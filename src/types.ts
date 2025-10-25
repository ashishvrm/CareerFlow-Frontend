export type RunStatus = "pending" | "running" | "done" | "error";

export type AppStatus = "pending" | "scoring" | "generating" | "applying" | "success" | "failure";

export interface JobItem {
  jobId: string;
  title: string;
  company: string;
  location?: string;
  url?: string;
  posted_at?: number;
}

export interface ApplicationItem {
  jobId: string;
  title: string;
  company: string;
  status: AppStatus;
  match_score?: number;
  updatedAt?: number;
  error?: string;
  summary?: string; // AI-generated evaluation summary 
}

export interface RunSnapshot {
  run: {
    runId: string;
    userId: string;
    status: RunStatus;
    started_at?: number;
    ended_at?: number;
    counts?: { total: number; success: number; failed: number };
  };
  applications: ApplicationItem[];
}

export interface UserPreferences {
  keywords: string;
  locations: string;
  minSalary?: number | "";
  roleTags?: string;
  userId: string;
}

export interface UserProfile {
  // Personal Information
  fullName: string;
  email: string;
  phone?: string;
  location: string;
  
  // Professional Information
  professionalTitle: string;
  yearsExperience: number;
  currentCompany?: string;
  previousCompanies?: string[];
  
  // Education
  education: {
    degree?: string;
    university?: string;
    graduationYear?: number;
  };
  
  // Skills & Expertise
  technicalSkills: SkillItem[];
  programmingLanguages: SkillItem[];
  frameworks: SkillItem[];
  certifications: string[];
  
  // Career Information
  careerSummary: string;
  keyAchievements: string[];
  careerGoals: string;
  
  // Preferences (extends existing)
  preferences: {
    roleTypes: string[]; // IC, Lead, Manager
    industries: string[]; // Fintech, Healthcare, etc.
    companySizes: string[]; // Startup, Mid-size, Enterprise
    workStyles: string[]; // Remote, Hybrid, On-site
    salaryRange: {
      min?: number;
      max?: number;
      currency: string;
    };
  };
  
  // Documents & Links
  documents: {
    resumeUrl?: string;
    portfolioUrl?: string;
    linkedinUrl?: string;
    githubUrl?: string;
  };
  
  // Metadata
  createdAt: number;
  updatedAt: number;
  isComplete: boolean;
}

export interface SkillItem {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsUsed?: number;
}