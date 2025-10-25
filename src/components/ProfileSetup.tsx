import React, { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import type { UserProfile, SkillItem } from '../types';

interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => void;
  onSkip?: () => void;
  existingProfile?: Partial<UserProfile>;
}

export const ProfileSetup: React.FC<ProfileSetupProps> = ({ 
  onComplete, 
  onSkip, 
  existingProfile 
}) => {
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>({
    // Personal Information
    fullName: existingProfile?.fullName || currentUser?.displayName || '',
    email: existingProfile?.email || currentUser?.email || '',
    phone: existingProfile?.phone || '',
    location: existingProfile?.location || '',
    
    // Professional Information
    professionalTitle: existingProfile?.professionalTitle || '',
    yearsExperience: existingProfile?.yearsExperience || 0,
    currentCompany: existingProfile?.currentCompany || '',
    previousCompanies: existingProfile?.previousCompanies || [],
    
    // Education
    education: {
      degree: existingProfile?.education?.degree || '',
      university: existingProfile?.education?.university || '',
      graduationYear: existingProfile?.education?.graduationYear || new Date().getFullYear(),
    },
    
    // Skills & Expertise
    technicalSkills: existingProfile?.technicalSkills || [],
    programmingLanguages: existingProfile?.programmingLanguages || [],
    frameworks: existingProfile?.frameworks || [],
    certifications: existingProfile?.certifications || [],
    
    // Career Information
    careerSummary: existingProfile?.careerSummary || '',
    keyAchievements: existingProfile?.keyAchievements || [''],
    careerGoals: existingProfile?.careerGoals || '',
    
    // Preferences
    preferences: {
      roleTypes: existingProfile?.preferences?.roleTypes || [],
      industries: existingProfile?.preferences?.industries || [],
      companySizes: existingProfile?.preferences?.companySizes || [],
      workStyles: existingProfile?.preferences?.workStyles || [],
      salaryRange: {
        min: existingProfile?.preferences?.salaryRange?.min || undefined,
        max: existingProfile?.preferences?.salaryRange?.max || undefined,
        currency: existingProfile?.preferences?.salaryRange?.currency || 'USD',
      },
    },
    
    // Documents & Links
    documents: {
      resumeUrl: existingProfile?.documents?.resumeUrl || '',
      portfolioUrl: existingProfile?.documents?.portfolioUrl || '',
      linkedinUrl: existingProfile?.documents?.linkedinUrl || '',
      githubUrl: existingProfile?.documents?.githubUrl || '',
    },
    
    // Metadata
    createdAt: existingProfile?.createdAt || Date.now(),
    updatedAt: Date.now(),
    isComplete: false,
  });

  const steps = [
    'Personal Info',
    'Professional Background', 
    'Skills & Expertise',
    'Career Goals',
    'Preferences',
    'Documents & Links'
  ];

  const updateProfile = (field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value,
      updatedAt: Date.now(),
    }));
  };

  const updateNestedProfile = (section: string, field: string, value: any) => {
    setProfile(prev => {
      const sectionData = prev[section as keyof UserProfile] as any;
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [field]: value,
        },
        updatedAt: Date.now(),
      };
    });
  };

  const addSkill = (category: 'technicalSkills' | 'programmingLanguages' | 'frameworks') => {
    const newSkill: SkillItem = { name: '', level: 'Intermediate' };
    setProfile(prev => ({
      ...prev,
      [category]: [...prev[category], newSkill],
    }));
  };

  const updateSkill = (category: 'technicalSkills' | 'programmingLanguages' | 'frameworks', index: number, skill: SkillItem) => {
    setProfile(prev => ({
      ...prev,
      [category]: prev[category].map((s, i) => i === index ? skill : s),
    }));
  };

  const removeSkill = (category: 'technicalSkills' | 'programmingLanguages' | 'frameworks', index: number) => {
    setProfile(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const completeProfile = {
        ...profile,
        isComplete: true,
        updatedAt: Date.now(),
      };
      await onComplete(completeProfile);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfo();
      case 2:
        return renderProfessionalBackground();
      case 3:
        return renderSkillsExpertise();
      case 4:
        return renderCareerGoals();
      case 5:
        return renderPreferences();
      case 6:
        return renderDocuments();
      default:
        return null;
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={profile.fullName}
            onChange={(e) => updateProfile('fullName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your full name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => updateProfile('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your@email.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone (Optional)</label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => updateProfile('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input
            type="text"
            value={profile.location}
            onChange={(e) => updateProfile('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="San Francisco, CA"
          />
        </div>
      </div>
    </div>
  );

  const renderProfessionalBackground = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Professional Background</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title</label>
          <input
            type="text"
            value={profile.professionalTitle}
            onChange={(e) => updateProfile('professionalTitle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Senior Frontend Engineer"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
          <input
            type="number"
            value={profile.yearsExperience}
            onChange={(e) => updateProfile('yearsExperience', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            max="50"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Company</label>
          <input
            type="text"
            value={profile.currentCompany}
            onChange={(e) => updateProfile('currentCompany', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Google, Facebook, etc."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            value={profile.education.degree}
            onChange={(e) => updateNestedProfile('education', 'degree', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Bachelor's in Computer Science"
          />
          <input
            type="text"
            value={profile.education.university}
            onChange={(e) => updateNestedProfile('education', 'university', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Stanford University"
          />
          <input
            type="number"
            value={profile.education.graduationYear}
            onChange={(e) => updateNestedProfile('education', 'graduationYear', parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1950"
            max={new Date().getFullYear() + 10}
            placeholder="2020"
          />
        </div>
      </div>
    </div>
  );

  const renderSkillsExpertise = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">Skills & Expertise</h3>
      
      {(['technicalSkills', 'programmingLanguages', 'frameworks'] as const).map((category) => (
        <div key={category}>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              {category === 'technicalSkills' ? 'Technical Skills' : 
               category === 'programmingLanguages' ? 'Programming Languages' : 'Frameworks & Tools'}
            </label>
            <button
              type="button"
              onClick={() => addSkill(category)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              + Add {category === 'technicalSkills' ? 'Skill' : 
                     category === 'programmingLanguages' ? 'Language' : 'Framework'}
            </button>
          </div>
          
          <div className="space-y-2">
            {profile[category].map((skill, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => updateSkill(category, index, { ...skill, name: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={category === 'technicalSkills' ? 'e.g., System Design' : 
                              category === 'programmingLanguages' ? 'e.g., JavaScript' : 'e.g., React'}
                />
                <select
                  value={skill.level}
                  onChange={(e) => updateSkill(category, index, { ...skill, level: e.target.value as SkillItem['level'] })}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeSkill(category, index)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Certifications (Optional)</label>
        <input
          type="text"
          value={profile.certifications.join(', ')}
          onChange={(e) => updateProfile('certifications', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="AWS Certified, Google Cloud Professional, etc."
        />
      </div>
    </div>
  );

  const renderCareerGoals = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Career Information</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Career Summary</label>
        <textarea
          value={profile.careerSummary}
          onChange={(e) => updateProfile('careerSummary', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Brief summary of your professional background and expertise (2-3 sentences)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Key Achievements</label>
        {profile.keyAchievements.map((achievement, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={achievement}
              onChange={(e) => {
                const newAchievements = [...profile.keyAchievements];
                newAchievements[index] = e.target.value;
                updateProfile('keyAchievements', newAchievements);
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Led team of 8 engineers to deliver 25% performance improvement"
            />
            {profile.keyAchievements.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  const newAchievements = profile.keyAchievements.filter((_, i) => i !== index);
                  updateProfile('keyAchievements', newAchievements);
                }}
                className="text-red-600 hover:text-red-800 p-2"
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => updateProfile('keyAchievements', [...profile.keyAchievements, ''])}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          + Add Achievement
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Career Goals</label>
        <textarea
          value={profile.careerGoals}
          onChange={(e) => updateProfile('careerGoals', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Where you want to be in your career in the next 2-3 years"
        />
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Job Preferences</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Role Types</label>
          <select
            multiple
            value={profile.preferences.roleTypes}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions, option => option.value);
              updateNestedProfile('preferences', 'roleTypes', values);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            size={3}
          >
            <option value="Individual Contributor">Individual Contributor</option>
            <option value="Tech Lead">Tech Lead</option>
            <option value="Engineering Manager">Engineering Manager</option>
            <option value="Senior Manager">Senior Manager</option>
            <option value="Director">Director</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Work Style Preferences</label>
          <select
            multiple
            value={profile.preferences.workStyles}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions, option => option.value);
              updateNestedProfile('preferences', 'workStyles', values);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            size={3}
          >
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range (Optional)</label>
        <div className="grid grid-cols-3 gap-2">
          <input
            type="number"
            value={profile.preferences.salaryRange.min || ''}
            onChange={(e) => updateNestedProfile('preferences', 'salaryRange', {
              ...profile.preferences.salaryRange,
              min: parseInt(e.target.value) || undefined
            })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Min"
          />
          <input
            type="number"
            value={profile.preferences.salaryRange.max || ''}
            onChange={(e) => updateNestedProfile('preferences', 'salaryRange', {
              ...profile.preferences.salaryRange,
              max: parseInt(e.target.value) || undefined
            })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Max"
          />
          <select
            value={profile.preferences.salaryRange.currency}
            onChange={(e) => updateNestedProfile('preferences', 'salaryRange', {
              ...profile.preferences.salaryRange,
              currency: e.target.value
            })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="INR">INR</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Documents & Links (Optional)</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Resume URL</label>
          <input
            type="url"
            value={profile.documents.resumeUrl}
            onChange={(e) => updateNestedProfile('documents', 'resumeUrl', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://drive.google.com/file/d/..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio URL</label>
          <input
            type="url"
            value={profile.documents.portfolioUrl}
            onChange={(e) => updateNestedProfile('documents', 'portfolioUrl', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://yourportfolio.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
          <input
            type="url"
            value={profile.documents.linkedinUrl}
            onChange={(e) => updateNestedProfile('documents', 'linkedinUrl', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
          <input
            type="url"
            value={profile.documents.githubUrl}
            onChange={(e) => updateNestedProfile('documents', 'githubUrl', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://github.com/yourusername"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
        <p className="text-gray-600">Help us create better, more personalized job applications for you.</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Step {currentStep} of {steps.length}</span>
          <span className="text-sm text-gray-600">{Math.round((currentStep / steps.length) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <span
              key={step}
              className={`text-xs ${
                index + 1 <= currentStep ? 'text-blue-600 font-medium' : 'text-gray-400'
              }`}
            >
              {step}
            </span>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-8">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <div className="flex space-x-3">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Previous
            </button>
          )}
          {onSkip && currentStep === 1 && (
            <button
              onClick={onSkip}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Skip for now
            </button>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : currentStep === steps.length ? 'Complete Profile' : 'Next'}
        </button>
      </div>
    </div>
  );
};