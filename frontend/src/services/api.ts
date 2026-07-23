import { http } from "../lib/http";
import type {
  BackendProfile,
  BackendSkillCategory,
  BackendTechnology,
  BackendProject,
  BackendEducation,
  BackendService,
} from "../lib/mappers";
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

export async function getProfile(signal?: AbortSignal): Promise<ApiResponse<Profile>> {
  const data = await http.get<BackendProfile>("/api/profile", signal);
  return { data: mapProfile(data) };
}

export async function getSkills(signal?: AbortSignal): Promise<ApiResponse<SkillCategory[]>> {
  const data = await http.get<BackendSkillCategory[]>("/api/skills", signal);
  return { data: data.map(mapSkillCategory) };
}

export async function getTechnologies(signal?: AbortSignal): Promise<ApiResponse<Technology[]>> {
  const data = await http.get<BackendTechnology[]>("/api/technologies", signal);
  return { data: data.map(mapTechnology) };
}

export async function getProjects(signal?: AbortSignal): Promise<ApiResponse<Project[]>> {
  const data = await http.get<BackendProject[]>("/api/projects", signal);
  return { data: data.map(mapProject) };
}

export async function getEducation(signal?: AbortSignal): Promise<ApiResponse<EducationItem[]>> {
  const data = await http.get<BackendEducation[]>("/api/education", signal);
  return { data: data.map(mapEducation) };
}

export async function getServices(signal?: AbortSignal): Promise<ApiResponse<Service[]>> {
  const data = await http.get<BackendService[]>("/api/services", signal);
  return { data: data.map(mapService) };
}

export async function sendContact(
  message: ContactMessage,
  signal?: AbortSignal,
): Promise<ApiResponse<{ id: string; status: "sent" }>> {
  const data = await http.post<{ id: string; status: "sent" }>("/api/contact", message, signal);
  return { data };
}

export async function getCvUrl(signal?: AbortSignal): Promise<string> {
  try {
    const data = await http.get<{ cvUrl: string }>("/api/cv", signal);
    return data?.cvUrl ?? "";
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    return "";
  }
}
