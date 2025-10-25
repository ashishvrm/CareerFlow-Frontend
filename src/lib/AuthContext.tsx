import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import type { UserProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  profileLoading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
  saveProfile: (profile: UserProfile) => Promise<void>;
  hasCompleteProfile: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    // Load profile from localStorage on init
    try {
      const cached = localStorage.getItem('userProfile');
      if (cached) {
        const profile = JSON.parse(cached);
        console.log('📦 Loaded cached profile:', profile.fullName);
        return profile;
      }
    } catch (e) {
      console.error('Failed to load cached profile:', e);
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const signup = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    setUserProfile(null);
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const getIdToken = async (): Promise<string | null> => {
    if (currentUser) {
      try {
        const token = await currentUser.getIdToken();
        if (!token) {
          console.warn('⚠️ Token is null, retrying...');
          // Wait a moment and retry
          await new Promise(resolve => setTimeout(resolve, 300));
          return await currentUser.getIdToken();
        }
        return token;
      } catch (error) {
        console.error('Error getting ID token:', error);
        return null;
      }
    }
    return null;
  };

  const saveProfile = async (profile: UserProfile) => {
    if (!currentUser) throw new Error('No authenticated user');
    
    setProfileLoading(true);
    try {
      console.log('💾 Saving profile for user:', currentUser.uid);
      
      // Save to backend API
      const authToken = await getIdToken();
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          ...profile,
          isComplete: true,
          updatedAt: Date.now()
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Profile save failed:', response.status, errorData);
        throw new Error(errorData.error || 'Failed to save profile');
      }
      
      // Update local state with complete profile
      const completeProfile = {
        ...profile,
        isComplete: true,
        updatedAt: Date.now()
      };
      setUserProfile(completeProfile);
      
      // Cache profile in localStorage
      try {
        localStorage.setItem('userProfile', JSON.stringify(completeProfile));
        console.log('💾 Profile cached in localStorage');
      } catch (e) {
        console.error('Failed to cache profile:', e);
      }
      
      console.log('✅ Profile saved successfully:', profile.fullName);
    } finally {
      setProfileLoading(false);
    }
  };

  const loadProfile = async (userId: string, retryCount = 0) => {
    setProfileLoading(true);
    try {
      console.log('🔍 Loading profile for user:', userId);
      
      // Get auth token with retry for Firebase users
      let authToken = await getIdToken();
      
      // If no token and we haven't retried yet, wait and try again
      if (!authToken && retryCount === 0) {
        console.log('⏳ No token, waiting for Firebase auth to initialize...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return loadProfile(userId, retryCount + 1);
      }
      
      if (!authToken) {
        console.error('❌ No auth token available after retry');
        setUserProfile(null);
        setProfileLoading(false);
        return;
      }
      
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${authToken}`
      };
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/profile/${userId}`, {
        headers,
      });
      
      if (response.status === 401 && retryCount === 0) {
        // Auth failed, token might be stale, force refresh and retry
        console.log('⏳ Auth failed, refreshing token and retrying...');
        await new Promise(resolve => setTimeout(resolve, 500));
        return loadProfile(userId, retryCount + 1);
      }
      
      if (response.ok) {
        const profile = await response.json();
        console.log('✅ Profile loaded successfully:', { 
          name: profile.fullName, 
          isComplete: profile.isComplete 
        });
        setUserProfile(profile);
        
        // Cache profile in localStorage
        try {
          localStorage.setItem('userProfile', JSON.stringify(profile));
        } catch (e) {
          console.error('Failed to cache profile:', e);
        }
      } else if (response.status === 404) {
        console.log('❌ Profile not found for user:', userId);
        // Don't clear profile on 404, user might have one in cache
      } else {
        console.log('❌ Profile fetch failed, status:', response.status);
        // Don't clear profile on error, keep cached version
      }
    } catch (error) {
      console.log('❌ Error loading profile:', error);
      // Don't clear profile on error, keep cached version
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    // If demo mode is enabled, skip Firebase auth and use demo user
    if (import.meta.env.VITE_DEMO_MODE === 'true') {
      console.log('🎯 Demo mode enabled, using demo user');
      const demoUser = {
        uid: 'demo-user',
        email: 'demo@example.com',
        displayName: 'Demo User',
        getIdToken: async () => null
      } as unknown as User;
      
      setCurrentUser(demoUser);
      loadProfile(demoUser.uid).then(() => {
        setIsInitialized(true);
        setLoading(false);
      });
      
      return; // No cleanup needed for demo mode
    }

    // Normal Firebase auth flow
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔄 Auth state changed:', user ? `User: ${user.email}` : 'No user');
      setCurrentUser(user);
      if (user) {
        await loadProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      setIsInitialized(true);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const hasCompleteProfile = userProfile?.isComplete || false;

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    profileLoading,
    signup,
    login,
    logout,
    resetPassword,
    loginWithGoogle,
    getIdToken,
    saveProfile,
    hasCompleteProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {(!loading && isInitialized) && children}
    </AuthContext.Provider>
  );
};