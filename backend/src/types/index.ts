export interface AuthenticatedUser {
  id: string;
  email: string;
}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown[];
  };
}

export type ProfilePublic = {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  description: string | null;
  location: string | null;
  experienceYears: number;
  isAvailable: boolean;
  email: string;
  avatarUrl: string | null;
  socialLinks: SocialLinkPublic[];
};

export type SocialLinkPublic = {
  id: string;
  platform: string;
  url: string;
};

export type SkillCategoryWithTechnologies = {
  id: string;
  name: string;
  icon: string | null;
  displayOrder: number;
  technologies: SkillTechnology[];
};

export type SkillTechnology = {
  id: string;
  name: string;
  displayOrder: number;
};

export type TechnologyPublic = {
  id: string;
  name: string;
  icon: string | null;
};

export type ProjectPublic = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  imageUrl: string | null;
  features: string[];
  repoUrl: string | null;
  demoUrl: string | null;
  status: string;
  visits: number;
  displayOrder: number;
  technologies: { id: string; name: string; icon: string | null }[];
};

export type EducationPublic = {
  id: string;
  title: string;
  degree: string | null;
  institution: string;
  type: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
  status: string;
  displayOrder: number;
};

export type ServicePublic = {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  status: string;
  displayOrder: number;
};

export type ContactMessageCreate = {
  name: string;
  email: string;
  subject: string;
  message: string;
};
