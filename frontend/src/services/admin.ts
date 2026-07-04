import type {
  Profile,
  SkillCategory,
  CV,
  EducationItem,
  Technology,
  Project,
  Service,
  ApiResponse,
} from "../types/admin"

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

const mockProfile: Profile = {
  id: "1",
  firstName: "Carlos",
  lastName: "Mendez",
  title: "Full Stack Developer",
  description:
    "Desarrollador full stack con 5+ años de experiencia construyendo aplicaciones web modernas y escalables. Especializado en React, Node.js y arquitecturas cloud-native.",
  location: "Madrid, España",
  experienceYears: 5,
  email: "carlos@devfolio.io",
  avatarUrl: "https://picsum.photos/seed/dev-avatar-cms/200/200.jpg",
  socialLinks: [
    { id: "1", platform: "github", url: "github.com/carlosmendez" },
    { id: "2", platform: "linkedin", url: "linkedin.com/in/carlosmendez" },
    { id: "3", platform: "twitter", url: "@carlosdev" },
    { id: "4", platform: "website", url: "carlosdev.io" },
  ],
}

const mockSkills: SkillCategory[] = [
  { id: "1", name: "Frontend", technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vue.js", "Framer Motion", "HTML5", "CSS3"] },
  { id: "2", name: "Backend", technologies: ["Node.js", "Express", "Python", "Django", "REST APIs", "GraphQL", "Prisma"] },
  { id: "3", name: "DevOps", technologies: ["Docker", "AWS", "Vercel", "CI/CD", "Linux"] },
  { id: "4", name: "Tools", technologies: ["Git", "Figma", "VS Code", "Postman"] },
]

const mockCV: CV = {
  id: "1",
  fileName: "cv-carlos-mendez.pdf",
  fileSize: 245 * 1024,
  fileType: "application/pdf",
  pages: 2,
  downloadUrl: "#",
  lastUpdated: new Date(Date.now() - 3 * 86400000).toISOString(),
}

const mockEducation: EducationItem[] = [
  { id: "1", title: "Máster en Ingeniería de Software", institution: "Universidad Politécnica de Madrid", type: "academic", startDate: "2020-09-01", endDate: "2022-06-30", description: "Especialización en arquitectura de software y sistemas distribuidos.", status: "active", displayOrder: 1 },
  { id: "2", title: "Grado en Informática", institution: "Universidad Complutense de Madrid", type: "academic", startDate: "2016-09-01", endDate: "2020-06-30", description: "Grado en Ingeniería Informática con mención en tecnologías de la información.", status: "active", displayOrder: 2 },
  { id: "3", title: "AWS Solutions Architect", institution: "Amazon Web Services", type: "certification", startDate: "2024-03-01", endDate: "2024-03-01", description: "", status: "active", displayOrder: 3 },
  { id: "4", title: "Meta Frontend Developer", institution: "Meta (Coursera)", type: "certification", startDate: "2023-01-01", endDate: "2023-01-01", description: "", status: "active", displayOrder: 4 },
  { id: "5", title: "Docker Certified Associate", institution: "Docker Inc.", type: "certification", startDate: "2022-06-01", endDate: "2022-06-01", description: "", status: "expiring", displayOrder: 5 },
]

const mockTechnologies: Technology[] = [
  { id: "1", name: "React" }, { id: "2", name: "Next.js" }, { id: "3", name: "TypeScript" },
  { id: "4", name: "Node.js" }, { id: "5", name: "PostgreSQL" }, { id: "6", name: "Tailwind" },
  { id: "7", name: "Python" }, { id: "8", name: "Django" }, { id: "9", name: "Docker" },
  { id: "10", name: "AWS" }, { id: "11", name: "Git" }, { id: "12", name: "GraphQL" },
  { id: "13", name: "Vue.js" }, { id: "14", name: "Prisma" }, { id: "15", name: "Express" },
  { id: "16", name: "Figma" }, { id: "17", name: "Vercel" }, { id: "18", name: "Linux" },
]

const mockProjects: Project[] = [
  { id: "1", title: "E-Commerce Platform", description: "Tienda online completa con carrito, pagos con Stripe y panel de administración.", imageUrl: "https://picsum.photos/seed/ecom-proj/600/380.jpg", url: "https://ecom.carlosdev.io", repository: "github.com/carlos/ecom", technologies: ["Next.js", "Stripe", "Prisma", "PostgreSQL"], status: "published", visits: 342, displayOrder: 1, createdAt: "2025-01-15T00:00:00Z", updatedAt: "2025-06-01T00:00:00Z" },
  { id: "2", title: "Task Manager API", description: "API RESTful para gestión de tareas con autenticación JWT y roles de usuario.", imageUrl: "https://picsum.photos/seed/task-api-proj/600/380.jpg", url: "", repository: "github.com/carlos/task-api", technologies: ["Node.js", "Express", "MongoDB"], status: "draft", visits: 0, displayOrder: 2, createdAt: "2025-03-10T00:00:00Z", updatedAt: "2025-05-20T00:00:00Z" },
  { id: "3", title: "AI Chat Interface", description: "Interfaz de conversación con IA generativa, streaming de respuestas en tiempo real.", imageUrl: "https://picsum.photos/seed/ai-chat-proj/600/380.jpg", url: "https://ai-chat.carlosdev.io", repository: "github.com/carlos/ai-chat", technologies: ["React", "OpenAI", "Framer Motion"], status: "published", visits: 518, displayOrder: 3, createdAt: "2025-02-01T00:00:00Z", updatedAt: "2025-06-10T00:00:00Z" },
  { id: "4", title: "Analytics Dashboard", description: "Panel de análisis de datos con gráficos interactivos y exportación de reportes.", imageUrl: "https://picsum.photos/seed/dashboard-proj/600/380.jpg", url: "https://analytics.carlosdev.io", repository: "github.com/carlos/analytics", technologies: ["Vue.js", "D3.js", "Python"], status: "published", visits: 276, displayOrder: 4, createdAt: "2024-11-01T00:00:00Z", updatedAt: "2025-04-15T00:00:00Z" },
  { id: "5", title: "SaaS Landing Page", description: "Landing page de producto SaaS con animaciones avanzadas y diseño responsive.", imageUrl: "https://picsum.photos/seed/landing-proj/600/380.jpg", url: "https://saas-landing.carlosdev.io", repository: "github.com/carlos/saas-landing", technologies: ["Astro", "Tailwind", "GSAP"], status: "hidden", visits: 89, displayOrder: 5, createdAt: "2024-08-01T00:00:00Z", updatedAt: "2025-01-10T00:00:00Z" },
]

const mockServices: Service[] = [
  { id: "1", title: "Desarrollo Web", description: "Creación de aplicaciones web completas con las últimas tecnologías. Desde landing pages hasta plataformas SaaS complejas.", status: "popular", displayOrder: 1 },
  { id: "2", title: "Aplicaciones Móviles", description: "Desarrollo de aplicaciones móviles multiplataforma con React Native y experiencia nativa optimizada.", status: "available", displayOrder: 2 },
  { id: "3", title: "Backend & APIs", description: "Diseño e implementación de APIs RESTful y GraphQL, arquitecturas de microservicios y bases de datos.", status: "available", displayOrder: 3 },
  { id: "4", title: "UI/UX Design", description: "Diseño de interfaces de usuario centradas en la experiencia, prototipos interactivos y sistemas de diseño.", status: "available", displayOrder: 4 },
  { id: "5", title: "DevOps & Cloud", description: "Configuración de pipelines CI/CD, contenedores Docker, orquestación con Kubernetes y despliegues en AWS.", status: "ondemand", displayOrder: 5 },
]

export async function getProfile(): Promise<ApiResponse<Profile>> {
  await delay(200)
  return { data: mockProfile }
}

export async function getSkills(): Promise<ApiResponse<SkillCategory[]>> {
  await delay(200)
  return { data: mockSkills }
}

export async function getCV(): Promise<ApiResponse<CV>> {
  await delay(200)
  return { data: mockCV }
}

export async function getEducation(): Promise<ApiResponse<EducationItem[]>> {
  await delay(200)
  return { data: mockEducation }
}

export async function getTechnologies(): Promise<ApiResponse<Technology[]>> {
  await delay(200)
  return { data: mockTechnologies }
}

export async function getProjects(): Promise<ApiResponse<Project[]>> {
  await delay(200)
  return { data: mockProjects }
}

export async function getServices(): Promise<ApiResponse<Service[]>> {
  await delay(200)
  return { data: mockServices }
}
