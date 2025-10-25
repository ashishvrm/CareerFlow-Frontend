import React, { useState } from 'react';
import { Login } from './Login';
import { Signup } from './Signup';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'login' 
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    // Reset to login mode when modal closes
    setTimeout(() => setMode('login'), 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />
      
      <div className="relative z-10">
        {mode === 'login' ? (
          <Login 
            onClose={handleClose}
            onSwitchToSignup={() => setMode('signup')}
          />
        ) : (
          <Signup 
            onClose={handleClose}
            onSwitchToLogin={() => setMode('login')}
          />
        )}
      </div>
    </div>
  );
};