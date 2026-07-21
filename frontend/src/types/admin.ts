// Admin-specific types (extend or differ from public types in types/index.ts)
// Naming convention: Admin-prefix to distinguish from public types

export interface Admin {
  id: string
  firstName: string
  lastName: string
  email: string
}

export interface AdminProfile {
  id: string
  firstName: string
  lastName: string
  title: string
  description: string
  location: string
  experienceYears: number
  email: string
  isAvailable: boolean
  avatarUrl: string
  socialLinks: AdminSocialLink[]
}

export interface AdminSocialLink {
  id: string
  platform: string
  url: string
}

export interface AdminSkillCategory {
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

export interface AdminEducationItem {
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

export interface AdminTechnology {
  id: string
  name: string
}

export interface AdminProject {
  id: string
  title: string
  description: string
  category: string
  imageUrl: string
  url: string
  repository: string
  features: string[]
  technologies: string[]
  status: "published" | "draft" | "hidden"
  visits: number
  displayOrder: number
  createdAt: string
  updatedAt: string
}

export interface AdminService {
  id: string
  title: string
  description: string
  icon: string
  status: "popular" | "available" | "ondemand"
  displayOrder: number
}

export interface AuthResponse {
  admin: Admin
}

export type { ApiResponse } from "./index";
