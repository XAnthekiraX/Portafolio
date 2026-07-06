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
  CV,
  EducationItem,
  Technology,
  Project,
  Service,
  SocialLink,
  ApiResponse,
} from "../types/admin";

function mapProfile(bp: BackendProfile): Profile {
  return {
    id: bp.id,
    firstName: bp.firstName,
    lastName: bp.lastName,
    title: bp.title,
    description: bp.description ?? "",
    location: bp.location ?? "",
    experienceYears: bp.experienceYears,
    isAvailable: bp.isAvailable,
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
    category: p.category ?? "",
    imageUrl: p.imageUrl ?? "",
    url: p.url ?? "",
    repository: p.repository ?? "",
    features: p.features ?? [],
    technologies: p.technologies.map((t) => t.name),
    status: p.status as Project["status"],
    visits: p.visits!,
    displayOrder: p.displayOrder!,
    createdAt: p.createdAt!,
    updatedAt: p.updatedAt!,
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
    icon: s.icon ?? "code",
    status: s.status as Service["status"],
    displayOrder: s.displayOrder,
  };
}

export async function getProfile(): Promise<ApiResponse<Profile>> {
  const data = await http.get<BackendProfile>("/api/admin/profile");
  return { data: mapProfile(data) };
}

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  title: string;
  description: string;
  location: string;
  experienceYears: number;
  email: string;
  isAvailable: boolean;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<ApiResponse<Profile>> {
  const data = await http.put<BackendProfile>("/api/admin/profile", payload);
  return { data: mapProfile(data) };
}

export async function uploadAvatar(file: File): Promise<ApiResponse<Profile>> {
  const formData = new FormData();
  formData.append("avatar", file);
  const data = await http.putForm<BackendProfile>("/api/admin/profile", formData);
  return { data: mapProfile(data) };
}

export async function getSkills(): Promise<ApiResponse<SkillCategory[]>> {
  const data = await http.get<BackendSkillCategory[]>("/api/admin/skills");
  return { data: data.map(mapSkillCategory) };
}

export interface CreateSkillPayload {
  name: string;
  technologies: string[];
}

export async function createSkillCategory(payload: CreateSkillPayload): Promise<ApiResponse<SkillCategory>> {
  const data = await http.post<BackendSkillCategory>("/api/admin/skills", payload);
  return { data: mapSkillCategory(data) };
}

export async function updateSkillCategory(id: string, payload: CreateSkillPayload): Promise<ApiResponse<SkillCategory>> {
  const data = await http.patch<BackendSkillCategory>(`/api/admin/skills/${id}`, payload);
  return { data: mapSkillCategory(data) };
}

export async function deleteSkillCategory(id: string): Promise<void> {
  await http.delete(`/api/admin/skills/${id}`);
}

export async function getCV(): Promise<ApiResponse<CV>> {
  const data = await http.get<{ cvUrl: string }>("/api/admin/cv");
  const cvUrl = data.cvUrl;
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

export async function uploadCv(file: File): Promise<ApiResponse<{ url: string }>> {
  const formData = new FormData();
  formData.append("file", file);
  const data = await http.postForm<{ url: string }>("/api/admin/cv", formData);
  return { data };
}

export async function deleteCv(): Promise<void> {
  await http.delete("/api/admin/cv");
}

export async function getEducation(): Promise<ApiResponse<EducationItem[]>> {
  const data = await http.get<BackendEducation[]>("/api/admin/education");
  return { data: data.map(mapEducation) };
}

export interface CreateEducationPayload {
  title: string;
  institution: string;
  type: "academic" | "certification";
  startDate: string;
  endDate?: string;
  description?: string;
  status?: string;
  displayOrder?: number;
}

export async function createEducation(payload: CreateEducationPayload): Promise<ApiResponse<EducationItem>> {
  const data = await http.post<BackendEducation>("/api/admin/education", payload);
  return { data: mapEducation(data) };
}

export async function updateEducation(id: string, payload: Partial<CreateEducationPayload>): Promise<ApiResponse<EducationItem>> {
  const data = await http.patch<BackendEducation>(`/api/admin/education/${id}`, payload);
  return { data: mapEducation(data) };
}

export async function deleteEducation(id: string): Promise<void> {
  await http.delete(`/api/admin/education/${id}`);
}

export async function getTechnologies(): Promise<ApiResponse<Technology[]>> {
  const data = await http.get<BackendTechnology[]>("/api/admin/technologies");
  return { data: data.map((t) => ({ id: t.id, name: t.name })) };
}

export interface CreateTechnologyPayload {
  name: string;
}

export async function createTechnology(payload: CreateTechnologyPayload): Promise<ApiResponse<Technology>> {
  const data = await http.post<BackendTechnology>("/api/admin/technologies", payload);
  return { data: { id: data.id, name: data.name } };
}

export async function updateTechnology(id: string, payload: CreateTechnologyPayload): Promise<ApiResponse<Technology>> {
  const data = await http.patch<BackendTechnology>(`/api/admin/technologies/${id}`, payload);
  return { data: { id: data.id, name: data.name } };
}

export async function deleteTechnology(id: string): Promise<void> {
  await http.delete(`/api/admin/technologies/${id}`);
}

export async function getProjects(): Promise<ApiResponse<Project[]>> {
  const data = await http.get<BackendProject[]>("/api/admin/projects");
  return { data: data.map(mapProject) };
}

export interface CreateProjectPayload {
  title: string;
  description?: string;
  category?: string;
  url?: string;
  repository?: string;
  features?: string[];
  technologies?: string[];
  status?: string;
  displayOrder?: number;
}

function appendFormData(formData: FormData, payload: CreateProjectPayload) {
  formData.append("title", payload.title);
  if (payload.description !== undefined) formData.append("description", payload.description);
  if (payload.category !== undefined) formData.append("category", payload.category);
  if (payload.url !== undefined) {
    formData.append("url", payload.url);
    formData.append("repoUrl", payload.url);
  }
  if (payload.repository !== undefined) {
    formData.append("repository", payload.repository);
    formData.append("demoUrl", payload.repository);
  }
  if (payload.features?.length) formData.append("features", JSON.stringify(payload.features));
  if (payload.status) formData.append("status", payload.status);
  if (payload.displayOrder !== undefined) formData.append("displayOrder", String(payload.displayOrder));
  if (payload.technologies?.length) formData.append("technologies", JSON.stringify(payload.technologies));
}

export async function createProject(payload: CreateProjectPayload, image?: File): Promise<ApiResponse<Project>> {
  if (image) {
    const formData = new FormData();
    formData.append("image", image);
    appendFormData(formData, payload);
    const data = await http.postForm<BackendProject>("/api/admin/projects", formData);
    return { data: mapProject(data) };
  }
  const body: Record<string, unknown> = { ...payload };
  body.repoUrl = payload.url;
  body.demoUrl = payload.repository;
  if (payload.features?.length) body.features = payload.features;
  if (payload.category !== undefined) body.category = payload.category;
  const data = await http.post<BackendProject>("/api/admin/projects", body);
  return { data: mapProject(data) };
}

export async function updateProject(id: string, payload: CreateProjectPayload, image?: File): Promise<ApiResponse<Project>> {
  if (image) {
    const formData = new FormData();
    formData.append("image", image);
    appendFormData(formData, payload);
    const data = await http.patchForm<BackendProject>(`/api/admin/projects/${id}`, formData);
    return { data: mapProject(data) };
  }
  const body: Record<string, unknown> = {};
  for (const key of ["title", "description", "category", "url", "repository", "status", "displayOrder"] as const) {
    if ((payload as any)[key] !== undefined) body[key] = (payload as any)[key];
  }
  if (payload.url !== undefined) body.repoUrl = payload.url;
  if (payload.repository !== undefined) body.demoUrl = payload.repository;
  if (payload.features !== undefined) body.features = payload.features;
  if (payload.technologies !== undefined) body.technologies = payload.technologies;
  const data = await http.patch<BackendProject>(`/api/admin/projects/${id}`, body);
  return { data: mapProject(data) };
}

export async function deleteProject(id: string): Promise<void> {
  await http.delete(`/api/admin/projects/${id}`);
}

export async function getServices(): Promise<ApiResponse<Service[]>> {
  const data = await http.get<BackendService[]>("/api/admin/services");
  return { data: data.map(mapService) };
}

export interface CreateServicePayload {
  title: string;
  description?: string;
  icon?: string;
  status?: string;
  displayOrder?: number;
}

export async function createService(payload: CreateServicePayload): Promise<ApiResponse<Service>> {
  const data = await http.post<BackendService>("/api/admin/services", payload);
  return { data: mapService(data) };
}

export async function updateService(id: string, payload: Partial<CreateServicePayload>): Promise<ApiResponse<Service>> {
  const data = await http.patch<BackendService>(`/api/admin/services/${id}`, payload);
  return { data: mapService(data) };
}

export async function deleteService(id: string): Promise<void> {
  await http.delete(`/api/admin/services/${id}`);
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

export interface ProfileCompletionCheck {
  label: string;
  done: boolean;
}

export interface ProfileCompletion {
  percentage: number;
  checks: ProfileCompletionCheck[];
}

export async function getProfileCompletion(): Promise<ApiResponse<ProfileCompletion>> {
  const data = await http.get<ProfileCompletion>("/api/admin/profile/completion");
  return { data };
}

export interface CreateSocialLinkPayload {
  platform: string;
  url: string;
}

export async function createSocialLink(payload: CreateSocialLinkPayload): Promise<ApiResponse<SocialLink>> {
  const data = await http.post<SocialLink>("/api/admin/profile/social", payload);
  return { data };
}

export async function updateSocialLink(id: string, payload: CreateSocialLinkPayload): Promise<ApiResponse<SocialLink>> {
  const data = await http.patch<SocialLink>(`/api/admin/profile/social/${id}`, payload);
  return { data };
}

export async function deleteSocialLink(id: string): Promise<void> {
  await http.delete(`/api/admin/profile/social/${id}`);
}

export async function markContactRead(id: string): Promise<void> {
  await http.patch(`/api/admin/contact/${id}`, { status: "read" });
}
