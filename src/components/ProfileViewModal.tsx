import React from 'react';
import type { UserProfile } from '../types';

interface ProfileViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile | null;
}

export const ProfileViewModal: React.FC<ProfileViewModalProps> = ({ isOpen, onClose, profile }) => {
  if (!isOpen || !profile) return null;

  const formatSkills = (skills: any[]) => {
    return skills?.map(skill => `${skill.name} (${skill.level})`).join(', ') || 'Not specified';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Your Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ×
          </button>
        </div>
        
        <div className="px-6 py-4 space-y-6">
          {/* Personal Information */}
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Full Name:</span>
                <span className="ml-2 text-gray-600">{profile.fullName || 'Not specified'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Email:</span>
                <span className="ml-2 text-gray-600">{profile.email || 'Not specified'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Phone:</span>
                <span className="ml-2 text-gray-600">{profile.phone || 'Not specified'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Location:</span>
                <span className="ml-2 text-gray-600">{profile.location || 'Not specified'}</span>
              </div>
            </div>
          </section>

          {/* Professional Information */}
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Professional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Professional Title:</span>
                <span className="ml-2 text-gray-600">{profile.professionalTitle || 'Not specified'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Years of Experience:</span>
                <span className="ml-2 text-gray-600">{profile.yearsExperience || 'Not specified'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Current Company:</span>
                <span className="ml-2 text-gray-600">{profile.currentCompany || 'Not specified'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Previous Companies:</span>
                <span className="ml-2 text-gray-600">{profile.previousCompanies?.join(', ') || 'Not specified'}</span>
              </div>
            </div>
            
            {profile.careerSummary && (
              <div className="mt-4">
                <span className="font-medium text-gray-700">Career Summary:</span>
                <p className="mt-1 text-gray-600">{profile.careerSummary}</p>
              </div>
            )}
            
            {profile.keyAchievements && profile.keyAchievements.length > 0 && (
              <div className="mt-4">
                <span className="font-medium text-gray-700">Key Achievements:</span>
                <ul className="mt-1 text-gray-600 list-disc list-inside space-y-1">
                  {profile.keyAchievements.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Education */}
          {profile.education && (
            <section>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Education</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Degree:</span>
                  <span className="ml-2 text-gray-600">{profile.education.degree || 'Not specified'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">University:</span>
                  <span className="ml-2 text-gray-600">{profile.education.university || 'Not specified'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Graduation Year:</span>
                  <span className="ml-2 text-gray-600">{profile.education.graduationYear || 'Not specified'}</span>
                </div>
              </div>
            </section>
          )}

          {/* Skills & Expertise */}
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Skills & Expertise</h3>
            <div className="space-y-3 text-sm">
              {profile.technicalSkills && profile.technicalSkills.length > 0 && (
                <div>
                  <span className="font-medium text-gray-700">Technical Skills:</span>
                  <p className="mt-1 text-gray-600">{formatSkills(profile.technicalSkills)}</p>
                </div>
              )}
              {profile.programmingLanguages && profile.programmingLanguages.length > 0 && (
                <div>
                  <span className="font-medium text-gray-700">Programming Languages:</span>
                  <p className="mt-1 text-gray-600">{formatSkills(profile.programmingLanguages)}</p>
                </div>
              )}
              {profile.frameworks && profile.frameworks.length > 0 && (
                <div>
                  <span className="font-medium text-gray-700">Frameworks:</span>
                  <p className="mt-1 text-gray-600">{formatSkills(profile.frameworks)}</p>
                </div>
              )}
              {profile.certifications && profile.certifications.length > 0 && (
                <div>
                  <span className="font-medium text-gray-700">Certifications:</span>
                  <p className="mt-1 text-gray-600">{profile.certifications.join(', ')}</p>
                </div>
              )}
            </div>
          </section>

          {/* Career Goals */}
          {profile.careerGoals && (
            <section>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Career Goals</h3>
              <p className="text-gray-600">{profile.careerGoals}</p>
            </section>
          )}

          {/* Job Preferences */}
          {profile.preferences && (
            <section>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Job Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Role Types:</span>
                  <span className="ml-2 text-gray-600">{profile.preferences.roleTypes?.join(', ') || 'Not specified'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Industries:</span>
                  <span className="ml-2 text-gray-600">{profile.preferences.industries?.join(', ') || 'Not specified'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Company Sizes:</span>
                  <span className="ml-2 text-gray-600">{profile.preferences.companySizes?.join(', ') || 'Not specified'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Work Styles:</span>
                  <span className="ml-2 text-gray-600">{profile.preferences.workStyles?.join(', ') || 'Not specified'}</span>
                </div>
                {profile.preferences.salaryRange && (
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-700">Salary Range:</span>
                    <span className="ml-2 text-gray-600">
                      {profile.preferences.salaryRange.min || 0} - {profile.preferences.salaryRange.max || 'Open'} {profile.preferences.salaryRange.currency}
                    </span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Documents & Links */}
          {profile.documents && (
            <section>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Documents & Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {profile.documents.resumeUrl && (
                  <div>
                    <span className="font-medium text-gray-700">Resume:</span>
                    <a href={profile.documents.resumeUrl} className="ml-2 text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      View Resume
                    </a>
                  </div>
                )}
                {profile.documents.portfolioUrl && (
                  <div>
                    <span className="font-medium text-gray-700">Portfolio:</span>
                    <a href={profile.documents.portfolioUrl} className="ml-2 text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      View Portfolio
                    </a>
                  </div>
                )}
                {profile.documents.linkedinUrl && (
                  <div>
                    <span className="font-medium text-gray-700">LinkedIn:</span>
                    <a href={profile.documents.linkedinUrl} className="ml-2 text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      View LinkedIn
                    </a>
                  </div>
                )}
                {profile.documents.githubUrl && (
                  <div>
                    <span className="font-medium text-gray-700">GitHub:</span>
                    <a href={profile.documents.githubUrl} className="ml-2 text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      View GitHub
                    </a>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};