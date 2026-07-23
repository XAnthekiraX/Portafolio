export interface SocialLink {
  platform: string;
  url: string;
}

export interface Profile {
  id: string;
  name: string;
  title: string;
  description: string;
  location: string;
  experienceYears: number;
  isAvailable: boolean;
  email: string;
  avatarUrl: string;
  socialLinks: SocialLink[];
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  technologies: string[];
}

export interface Technology {
  id: string;
  name: string;
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  features: string[];
  repoUrl: string | null;
  demoUrl: string | null;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  id: string;
  status: "sent";
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: { field: string; message: string }[];
  };
}

export interface ApiResponse<T> {
  data: T;
}
