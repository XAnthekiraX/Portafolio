export interface Admin {
  id: string
  firstName: string
  lastName: string
  email: string
}

export interface Profile {
  id: string
  firstName: string
  lastName: string
  title: string
  description: string
  location: string
  experienceYears: number
  email: string
  avatarUrl: string
  socialLinks: SocialLink[]
}

export interface SocialLink {
  id: string
  platform: string
  url: string
}

export interface SkillCategory {
  id: string
  name: string
  technologies: string[]
}

export interface CV {
  id: string
  fileName: string
  fileSize: number
  fileType: string
  pages: number
  downloadUrl: string
  lastUpdated: string
}

export interface EducationItem {
  id: string
  title: string
  institution: string
  type: "academic" | "certification"
  startDate: string
  endDate: string
  description: string
  status: "active" | "expiring" | "expired"
  displayOrder: number
}

export interface Technology {
  id: string
  name: string
}

export interface Project {
  id: string
  title: string
  description: string
  imageUrl: string
  url: string
  repository: string
  technologies: string[]
  status: "published" | "draft" | "hidden"
  visits: number
  displayOrder: number
  createdAt: string
  updatedAt: string
}

export interface Service {
  id: string
  title: string
  description: string
  status: "popular" | "available" | "ondemand"
  displayOrder: number
}

export interface AuthResponse {
  token: string
  expiresAt: string
  admin: Admin
}

export interface ApiResponse<T> {
  data: T
}
