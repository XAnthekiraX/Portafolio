// Backend interfaces compartidas entre API pública y admin
// Estas interfaces reflejan la estructura que devuelve el backend.
// Los mappers específicos de cada servicio transforman estos tipos
// a los tipos públicos (types/index.ts) o de admin (types/admin.ts).

export interface BackendSocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface BackendProfile {
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
  socialLinks: BackendSocialLink[];
}

export interface BackendSkillCategory {
  id: string;
  name: string;
  icon: string | null;
  displayOrder: number;
  technologies: { id: string; name: string; displayOrder: number }[];
}

export interface BackendTechnology {
  id: string;
  name: string;
  icon: string | null;
}

export interface BackendProject {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  imageUrl: string | null;
  features: string[];
  repoUrl: string | null;
  demoUrl: string | null;
  status: string;
  technologies: { id: string; name: string; icon: string | null }[];
  // Admin-only fields
  visits?: number;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendEducation {
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
}

export interface BackendService {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  status: string;
  displayOrder: number;
}
