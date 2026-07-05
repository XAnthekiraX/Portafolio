import { http } from "../lib/http";
import type {
  Profile,
  SkillCategory,
  Technology,
  Project,
  EducationItem,
  Service,
  ContactMessage,
  ApiResponse,
} from "../types";

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
  url: string | null;
  repository: string | null;
  features: string[];
  repoUrl: string | null;
  demoUrl: string | null;
  status: string;
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
    name: `${bp.firstName} ${bp.lastName}`,
    title: bp.title,
    description: bp.description ?? "",
    location: bp.location ?? "",
    experienceYears: bp.experienceYears,
    isAvailable: bp.isAvailable,
    email: bp.email,
    avatarUrl: bp.avatarUrl ?? "",
    socialLinks: bp.socialLinks.map((l) => ({ platform: l.platform, url: l.url })),
  };
}

function mapSkillCategory(sc: BackendSkillCategory): SkillCategory {
  return {
    id: sc.id,
    name: sc.name,
    icon: sc.icon ?? "code",
    technologies: sc.technologies.map((t) => t.name),
  };
}

function mapTechnology(t: BackendTechnology): Technology {
  return {
    id: t.id,
    name: t.name,
    icon: t.icon ?? t.name.toLowerCase(),
  };
}

function mapProject(p: BackendProject): Project {
  return {
    id: p.id,
    title: p.title,
    description: p.description ?? "",
    category: p.category ?? "",
    imageUrl: p.imageUrl ?? "",
    features: p.features ?? [],
    repoUrl: p.repoUrl ?? p.url ?? "",
    demoUrl: p.demoUrl ?? p.repository ?? "",
  };
}

function mapEducation(e: BackendEducation): EducationItem {
  return {
    id: e.id,
    degree: e.degree ?? e.title,
    institution: e.institution,
    startDate: e.startDate,
    endDate: e.endDate ?? "",
    description: e.description ?? "",
  };
}

function mapService(s: BackendService): Service {
  return {
    id: s.id,
    title: s.title,
    description: s.description ?? "",
    icon: s.icon ?? "code",
  };
}

export async function getProfile(): Promise<ApiResponse<Profile>> {
  const data = await http.get<BackendProfile>("/api/profile");
  return { data: mapProfile(data) };
}

export async function getSkills(): Promise<ApiResponse<SkillCategory[]>> {
  const data = await http.get<BackendSkillCategory[]>("/api/skills");
  return { data: data.map(mapSkillCategory) };
}

export async function getTechnologies(): Promise<ApiResponse<Technology[]>> {
  const data = await http.get<BackendTechnology[]>("/api/technologies");
  return { data: data.map(mapTechnology) };
}

export async function getProjects(): Promise<ApiResponse<Project[]>> {
  const data = await http.get<BackendProject[]>("/api/projects");
  return { data: data.map(mapProject) };
}

export async function getEducation(): Promise<ApiResponse<EducationItem[]>> {
  const data = await http.get<BackendEducation[]>("/api/education");
  return { data: data.map(mapEducation) };
}

export async function getServices(): Promise<ApiResponse<Service[]>> {
  const data = await http.get<BackendService[]>("/api/services");
  return { data: data.map(mapService) };
}

export async function sendContact(
  message: ContactMessage,
): Promise<ApiResponse<{ id: string; status: "sent" }>> {
  const data = await http.post<{ id: string; status: "sent" }>("/api/contact", message);
  return { data };
}

export async function getCvUrl(): Promise<string> {
  const res = await fetch("http://localhost:3001/api/cv", { redirect: "manual" });
  if (res.status >= 300 && res.status < 400) {
    return res.headers.get("location") ?? "";
  }
  return "";
}
