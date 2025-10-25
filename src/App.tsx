import { useEffect, useMemo, useRef, useState } from "react";
import { PreferencesCard } from "./components/PreferencesCard";
import { StatusFeed } from "./components/StatusFeed";
import { AuthModal } from "./components/AuthModal";
import { UserMenu } from "./components/UserMenu";
import { ProfileSetup } from "./components/ProfileSetup";
import { ProfileViewModal } from "./components/ProfileViewModal";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import { getStatus, startRun } from "./lib/api";
import type { RunSnapshot, UserPreferences, UserProfile } from "./types";

const DEFAULT_USER_ID =
  import.meta.env.VITE_DEMO_USER_ID || "demo-user";

function useLocalStorage<T>(key: string, initial: T) {
  const [val, setVal] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(val));
  }, [key, val]);
  return [val, setVal] as const;
}

// Helper function to convert UserProfile to text for AI processing
function createProfileText(profile: UserProfile): string {
  const sections = [];
  
  // Personal Information
  sections.push(`PERSONAL INFO:
Name: ${profile.fullName || 'Not specified'}
Email: ${profile.email || 'Not specified'}
Phone: ${profile.phone || 'Not specified'}
Location: ${profile.location || 'Not specified'}
Professional Title: ${profile.professionalTitle || 'Not specified'}
Years of Experience: ${profile.yearsExperience || 'Not specified'}`);
  
  // Professional Background
  sections.push(`PROFESSIONAL BACKGROUND:
Current Company: ${profile.currentCompany || 'Not specified'}
Previous Companies: ${profile.previousCompanies?.join(', ') || 'Not specified'}
Career Summary: ${profile.careerSummary || 'Not specified'}
Key Achievements: ${profile.keyAchievements?.join('; ') || 'Not specified'}`);
  
  // Education
  if (profile.education) {
    sections.push(`EDUCATION:
Degree: ${profile.education.degree || 'Not specified'}
University: ${profile.education.university || 'Not specified'}
Graduation Year: ${profile.education.graduationYear || 'Not specified'}`);
  }
  
  // Skills
  const skillsText = [];
  if (profile.technicalSkills?.length > 0) {
    skillsText.push(`Technical Skills: ${profile.technicalSkills.map(s => `${s.name} (${s.level})`).join(', ')}`);
  }
  if (profile.programmingLanguages?.length > 0) {
    skillsText.push(`Programming Languages: ${profile.programmingLanguages.map(s => `${s.name} (${s.level})`).join(', ')}`);
  }
  if (profile.frameworks?.length > 0) {
    skillsText.push(`Frameworks: ${profile.frameworks.map(s => `${s.name} (${s.level})`).join(', ')}`);
  }
  if (profile.certifications?.length > 0) {
    skillsText.push(`Certifications: ${profile.certifications.join(', ')}`);
  }
  if (skillsText.length > 0) {
    sections.push(`SKILLS & EXPERTISE:\n${skillsText.join('\n')}`);
  }
  
  // Career Goals
  sections.push(`CAREER GOALS: ${profile.careerGoals || 'Not specified'}`);
  
  // Preferences
  if (profile.preferences) {
    const prefs = profile.preferences;
    sections.push(`JOB PREFERENCES:
Role Types: ${prefs.roleTypes?.join(', ') || 'Not specified'}
Industries: ${prefs.industries?.join(', ') || 'Not specified'}
Company Sizes: ${prefs.companySizes?.join(', ') || 'Not specified'}
Work Styles: ${prefs.workStyles?.join(', ') || 'Not specified'}
Salary Range: ${prefs.salaryRange ? `${prefs.salaryRange.min || 0} - ${prefs.salaryRange.max || 'Open'} ${prefs.salaryRange.currency}` : 'Not specified'}`);
  }
  
  return sections.join('\n\n');
}

function AppContent() {
  const { currentUser, getIdToken, hasCompleteProfile, saveProfile, userProfile } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileViewOpen, setProfileViewOpen] = useState(false);
  const [profileEditMode, setProfileEditMode] = useState(false);
  
  // FALLBACK: Check localStorage if hasCompleteProfile is false
  const [localHasProfile, setLocalHasProfile] = useState(() => {
    try {
      const cached = localStorage.getItem('userProfile');
      if (cached) {
        const profile = JSON.parse(cached);
        return profile.isComplete === true;
      }
    } catch (e) {
      console.error('Error checking cached profile:', e);
    }
    return false;
  });
  
  // Update local check when userProfile changes
  useEffect(() => {
    if (userProfile?.isComplete) {
      setLocalHasProfile(true);
    }
  }, [userProfile]);
  
  const shouldShowPreferences = hasCompleteProfile || localHasProfile;
  
  // DEBUG LOG
  useEffect(() => {
    console.log('🎯 Profile Status Check:', {
      hasCompleteProfile,
      localHasProfile,
      shouldShowPreferences,
      userProfile: userProfile ? { name: userProfile.fullName, isComplete: userProfile.isComplete } : null
    });
  }, [hasCompleteProfile, localHasProfile, shouldShowPreferences, userProfile]);
  
  const [prefs, setPrefs] = useLocalStorage<UserPreferences>("cf_prefs", {
    keywords: "react, typescript, node",
    locations: "Remote, Indianapolis, Bengaluru, Delhi NCR",
    minSalary: "",
    roleTags: "frontend, tech lead, engineering manager",
    userId: currentUser?.uid || DEFAULT_USER_ID,
  });

  const [runId, setRunId] = useLocalStorage<string | null>("cf_last_run", null);
  const [snapshot, setSnapshot] = useState<RunSnapshot | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const pollTimer = useRef<number | null>(null);

  // Update userId when user auth state changes
  useEffect(() => {
    if (currentUser?.uid && currentUser.uid !== prefs.userId) {
      setPrefs(prev => ({ ...prev, userId: currentUser.uid }));
    }
  }, [currentUser?.uid, prefs.userId, setPrefs]);

  const isActive = useMemo(() => {
    const s = snapshot?.run?.status;
    return s === "pending" || s === "running";
  }, [snapshot]);
  
  // DEBUG: Button state - Manual vs Auto Run state testing. Auto run submission is buggy. Turning back to manual for now.
  useEffect(() => {
    console.log('🔘 Button State:', {
      isStarting,
      isActive,
      currentUser: currentUser ? currentUser.email : null,
      buttonDisabled: isStarting || isActive || !currentUser,
      buttonText: !currentUser ? "Login Required" : isStarting ? "Starting..." : isActive ? "Running..." : "Start Run",
      snapshotStatus: snapshot?.run?.status || 'none'
    });
    
    // Auto-clear stuck runs with "pending" or "error" status after 5 seconds
    if (snapshot?.run?.status === 'pending' || snapshot?.run?.status === 'error') {
      const createdTime = snapshot.run.started_at || 0;
      const now = Date.now();
      const fiveSecondsAgo = now - 5000;
      
      if (createdTime < fiveSecondsAgo) {
        console.log('🧹 Clearing stuck run:', snapshot.run.status);
        setRunId(null);
        setSnapshot(null);
      }
    }
  }, [isStarting, isActive, currentUser, snapshot, setRunId]);

  // Show auth modal if not authenticated
  useEffect(() => {
    if (!currentUser) {
      setAuthModalOpen(true);
    }
  }, [currentUser]);

  useEffect(() => {
    const stop = () => {
      if (pollTimer.current) {
        window.clearInterval(pollTimer.current);
        pollTimer.current = null;
      }
    };

    if (!prefs.userId || !currentUser) return stop();

    const poll = async () => {
      try {
        const authToken = await getIdToken();
        const data = await getStatus(prefs.userId, runId ?? undefined, authToken);
        setSnapshot(data);
        
        // Stop polling if run is completed
        if (data?.run?.status === 'done' || data?.run?.status === 'error') {
          console.log('🛑 Run completed, stopping poll. Status:', data.run.status);
          stop();
        }
      } catch (err: any) {
        // Clear snapshot on error to reset button state
        setSnapshot(null);
        
        if (err.message?.includes('Authentication required')) {
          setAuthModalOpen(true);
        } else {
          console.log('Polling error:', err.message);
        }
      }
    };

    poll();
    pollTimer.current = window.setInterval(poll, 1200);
    return stop;
  }, [prefs.userId, runId, currentUser, getIdToken]);

  const handleStart = async () => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    setIsStarting(true);
    try {
      const authToken = await getIdToken();
      
      if (!authToken) {
        console.error('❌ No auth token available');
        alert('Authentication error. Please try logging out and back in.');
        setIsStarting(false);
        return;
      }
      
      // Create a comprehensive profile text for AI processing
      const profileText = userProfile ? createProfileText(userProfile) : prefs.keywords;
      
      console.log('🚀 Starting run with profile:', userProfile?.fullName || 'Default keywords');
      const { runId: newRunId } = await startRun(prefs.userId, profileText, authToken);
      setRunId(newRunId);
      console.log('✅ Run started successfully, ID:', newRunId);
    } catch (err: any) {
      console.error('❌ Error starting run:', err);
      if (err.message?.includes('Authentication required')) {
        alert('Authentication required. Please log in again.');
        setAuthModalOpen(true);
      } else {
        alert(`Failed to start run: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setIsStarting(false);
    }
  };

  const handleProfileComplete = async (profile: UserProfile) => {
    try {
      await saveProfile(profile);
      setProfileEditMode(false); 
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  const handleViewProfile = () => {
    setProfileViewOpen(true);
  };

  const handleEditProfile = () => {
    setProfileEditMode(true);
  };

  if (currentUser && (!shouldShowPreferences || profileEditMode)) {
    return (
      <div className="container">
        <header className="header">
          <div>
            <div className="title">
              Auto-Apply Lite - {profileEditMode ? 'Edit Profile' : 'Profile Setup'}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {profileEditMode && (
              <button
                onClick={() => setProfileEditMode(false)}
                className="button"
                style={{ background: "#6b7280", color: "#fff", fontSize: "14px", padding: "6px 12px" }}
              >
                Cancel
              </button>
            )}
            <UserMenu />
          </div>
        </header>
        <ProfileSetup 
          onComplete={handleProfileComplete} 
          existingProfile={profileEditMode && userProfile ? userProfile : undefined}
        />
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <div>
          <div className="title">Auto-Apply Lite</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {currentUser ? (
            <>
              <UserMenu 
                onViewProfile={handleViewProfile} 
                onEditProfile={handleEditProfile}
              />
            </>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="button"
              style={{ background: "#2563eb", color: "#fff", fontSize: "14px", padding: "6px 12px" }}
            >
              Login
            </button>
          )}
        </div>
      </header>

      <div className="grid">
        <section className="card">
          <PreferencesCard value={prefs} onChange={setPrefs} />
          <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
            <button
              className="button"
              onClick={handleStart}
              disabled={isStarting || isActive || !currentUser}
              style={{ background: "#2563eb", color: "#fff" }}
            >
              {!currentUser ? "Login Required" : isStarting ? "Starting..." : isActive ? "Running..." : "Start Run"}
            </button>
            <button
              className="button"
              style={{ background: "#fff", color: "#000", border: "1px solid #ccc"}}
              onClick={() => setRunId(null)}
              title="Reset state"
              disabled={!currentUser}
            >
              Reset Run
            </button>
          </div>
        </section>

        <section className="card" style={{ height: "fit-content" }}>
          <StatusFeed snapshot={snapshot} />
        </section>
      </div>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
      
      <ProfileViewModal
        isOpen={profileViewOpen}
        onClose={() => setProfileViewOpen(false)}
        profile={userProfile}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
