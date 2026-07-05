import { http } from "../lib/http";
import type {
  Profile,
  SkillCategory,
  CV,
  EducationItem,
  Technology,
  Project,
  Service,
  ApiResponse,
} from "../types/admin";

interface BackendProfile {
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
  socialLinks: { id: string; platform: string; url: string }[];
}

interface BackendSkillCategory {
  id: string;
  name: string;
  icon: string | null;
  displayOrder: number;
  technologies: { id: string; name: string; displayOrder: number }[];
}

interface BackendTechnology {
  id: string;
  name: string;
  icon: string | null;
}

interface BackendProject {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  imageUrl: string | null;
  features: string[];
  repoUrl: string | null;
  demoUrl: string | null;
  url: string | null;
  repository: string | null;
  status: string;
  visits: number;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  technologies: { id: string; name: string; icon: string | null }[];
}

interface BackendEducation {
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

interface BackendService {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  status: string;
  displayOrder: number;
}

function mapProfile(bp: BackendProfile): Profile {
  return {
    id: bp.id,
    firstName: bp.firstName,
    lastName: bp.lastName,
    title: bp.title,
    description: bp.description ?? "",
    location: bp.location ?? "",
    experienceYears: bp.experienceYears,
    email: bp.email,
    avatarUrl: bp.avatarUrl ?? "",
    socialLinks: bp.socialLinks.map((l) => ({
      id: l.id,
      platform: l.platform,
      url: l.url,
    })),
  };
}

function mapSkillCategory(sc: BackendSkillCategory): SkillCategory {
  return {
    id: sc.id,
    name: sc.name,
    technologies: sc.technologies.map((t) => t.name),
  };
}

function mapProject(p: BackendProject): Project {
  return {
    id: p.id,
    title: p.title,
    description: p.description ?? "",
    imageUrl: p.imageUrl ?? "",
    url: p.url ?? "",
    repository: p.repository ?? "",
    technologies: p.technologies.map((t) => t.name),
    status: p.status as Project["status"],
    visits: p.visits,
    displayOrder: p.displayOrder,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

function mapEducation(e: BackendEducation): EducationItem {
  return {
    id: e.id,
    title: e.title,
    institution: e.institution,
    type: e.type as EducationItem["type"],
    startDate: e.startDate,
    endDate: e.endDate ?? "",
    description: e.description ?? "",
    status: e.status as EducationItem["status"],
    displayOrder: e.displayOrder,
  };
}

function mapService(s: BackendService): Service {
  return {
    id: s.id,
    title: s.title,
    description: s.description ?? "",
    status: s.status as Service["status"],
    displayOrder: s.displayOrder,
  };
}

export async function getProfile(): Promise<ApiResponse<Profile>> {
  const data = await http.get<BackendProfile>("/api/admin/profile");
  return { data: mapProfile(data) };
}

export async function getSkills(): Promise<ApiResponse<SkillCategory[]>> {
  const data = await http.get<BackendSkillCategory[]>("/api/admin/skills");
  return { data: data.map(mapSkillCategory) };
}

export async function getCV(): Promise<ApiResponse<CV>> {
  const data = await http.get<{ url: string }>("/api/admin/cv");
  const cvUrl = data.url;
  return {
    data: {
      id: "cv-1",
      fileName: cvUrl.split("/").pop() ?? "cv.pdf",
      fileSize: 0,
      fileType: "application/pdf",
      pages: 1,
      downloadUrl: cvUrl,
      lastUpdated: new Date().toISOString(),
    },
  };
}

export async function getEducation(): Promise<ApiResponse<EducationItem[]>> {
  const data = await http.get<BackendEducation[]>("/api/admin/education");
  return { data: data.map(mapEducation) };
}

export async function getTechnologies(): Promise<ApiResponse<Technology[]>> {
  const data = await http.get<BackendTechnology[]>("/api/admin/technologies");
  return { data: data.map((t) => ({ id: t.id, name: t.name })) };
}

export async function getProjects(): Promise<ApiResponse<Project[]>> {
  const data = await http.get<BackendProject[]>("/api/admin/projects");
  return { data: data.map(mapProject) };
}

export async function getServices(): Promise<ApiResponse<Service[]>> {
  const data = await http.get<BackendService[]>("/api/admin/services");
  return { data: data.map(mapService) };
}

export interface DashboardCounts {
  totalProjects: number;
  totalSkillCategories: number;
  totalTechnologies: number;
  unreadMessages: number;
}

export async function getDashboard(): Promise<ApiResponse<DashboardCounts>> {
  const data = await http.get<DashboardCounts>("/api/admin/dashboard");
  return { data };
}

export interface NotificationItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface NotificationsResponse {
  unreadCount: number;
  todayCount: number;
  recent: NotificationItem[];
}

export async function getNotifications(): Promise<ApiResponse<NotificationsResponse>> {
  const data = await http.get<NotificationsResponse>("/api/admin/notifications");
  return { data };
}

export async function markContactRead(id: string): Promise<void> {
  await http.patch(`/api/admin/contact/${id}`, { status: "read" });
}
