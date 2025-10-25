import React, { useState } from 'react';
import { useAuth } from '../lib/AuthContext';

interface UserMenuProps {
  onViewProfile?: () => void;
  onEditProfile?: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ onViewProfile, onEditProfile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout, hasCompleteProfile, userProfile } = useAuth();
  
  // Check localStorage as fallback for profile existence
  const [localHasProfile, setLocalHasProfile] = useState(() => {
    try {
      const cached = localStorage.getItem('userProfile');
      if (cached) {
        const profile = JSON.parse(cached);
        return profile.isComplete === true;
      }
    } catch (e) {
      return false;
    }
    return false;
  });
  
  // Update when userProfile changes
  React.useEffect(() => {
    if (userProfile?.isComplete) {
      setLocalHasProfile(true);
    }
  }, [userProfile]);
  
  const shouldShowProfileOptions = hasCompleteProfile || localHasProfile;

  if (!currentUser) return null;

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getDisplayName = () => {
    return currentUser.displayName || currentUser.email || 'User';
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
          {getInitials()}
        </div>
        <span className="text-sm font-medium text-gray-700 hidden sm:block">
          {getDisplayName()}
        </span>
        <svg 
          className="w-4 h-4 text-gray-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg py-1 z-10 border">
          <div className="px-4 py-2 text-sm text-gray-700 border-b">
            <div className="font-medium">{getDisplayName()}</div>
            <div className="text-xs text-gray-500">{currentUser.email}</div>
          </div>
          
          {shouldShowProfileOptions && onViewProfile && (
            <button
              onClick={() => {
                onViewProfile();
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              View Profile
            </button>
          )}
          
          {shouldShowProfileOptions && onEditProfile && (
            <button
              onClick={() => {
                onEditProfile();
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Edit Profile
            </button>
          )}
          
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-t mt-1 pt-2"
          >
            Sign out
          </button>
        </div>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};