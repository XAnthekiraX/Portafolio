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

const mockProfile: Profile = {
  id: "1",
  name: "Alex Doe",
  title: "Senior Product Engineer & UI/UX Designer",
  description:
    "Especializado en construir interfaces de usuario de alto rendimiento y experiencias digitales premium. Transformo ideas complejas en productos elegantes, funcionales y escalables. Mi enfoque se centra en la intersección entre el diseño y la ingeniería. No solo creo interfaces que se ven bien; construyo sistemas de diseño robustos y arquitecturas front-end escalables que perduran. A lo largo de mi carrera, he liderado equipos en la creación de SaaS complejos, siempre priorizando la accesibilidad, el rendimiento y una experiencia de usuario impecable.",
  location: "Madrid, España",
  experienceYears: 8,
  isAvailable: true,
  email: "hello@alexdoe.com",
  avatarUrl:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
  socialLinks: [
    { platform: "github", url: "#" },
    { platform: "linkedin", url: "#" },
    { platform: "twitter", url: "#" },
    { platform: "dribbble", url: "#" },
  ],
};

const mockSkills: SkillCategory[] = [
  {
    id: "1",
    name: "Frontend",
    icon: "layout-dashboard",
    technologies: ["React", "Next.js", "Vue 3", "TypeScript", "TailwindCSS", "Framer Motion"],
  },
  {
    id: "2",
    name: "Backend",
    icon: "server",
    technologies: ["Node.js", "Express", "NestJS", "PostgreSQL", "Prisma", "GraphQL"],
  },
  {
    id: "3",
    name: "DevOps",
    icon: "cloud",
    technologies: ["Docker", "AWS", "Vercel", "GitHub Actions", "Nginx"],
  },
  {
    id: "4",
    name: "Tools",
    icon: "wrench",
    technologies: ["Figma", "Git", "Jira", "Linear", "Notion"],
  },
  {
    id: "5",
    name: "Design & Other",
    icon: "palette",
    technologies: ["UI/UX", "Design Systems", "Accessibility", "SEO"],
  },
];

const mockTechnologies: Technology[] = [
  { id: "1", name: "Github", icon: "github" },
  { id: "2", name: "Figma", icon: "figma" },
  { id: "3", name: "PostgreSQL", icon: "database" },
  { id: "4", name: "AWS", icon: "cloud" },
  { id: "5", name: "Bash", icon: "terminal" },
  { id: "6", name: "Git", icon: "git-branch" },
  { id: "7", name: "Docker", icon: "boxes" },
  { id: "8", name: "Vercel", icon: "zap" },
];

const mockProjects: Project[] = [
  {
    id: "1",
    title: "Analytics Pro",
    description:
      "Plataforma de analítica en tiempo real con dashboards personalizables y seguimiento de métricas avanzado.",
    category: "SaaS",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    features: ["Real-time", "Charts", "Auth"],
    repoUrl: "#",
    demoUrl: "#",
  },
  {
    id: "2",
    title: "Task Flow",
    description:
      "Aplicación de gestión de proyectos con integraciones de IA para automatización de flujos de trabajo.",
    category: "Web App",
    imageUrl:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=1200&auto=format&fit=crop",
    features: ["AI", "Kanban", "Team"],
    repoUrl: "#",
    demoUrl: "#",
  },
  {
    id: "3",
    title: "FinTrack",
    description:
      "App de finanzas personales con sincronización bancaria y predicciones de gastos basadas en ML.",
    category: "Mobile",
    imageUrl:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop",
    features: ["React Native", "Charts", "ML"],
    repoUrl: "#",
    demoUrl: "#",
  },
  {
    id: "4",
    title: "Shop Swift",
    description:
      "Headless e-commerce de alta velocidad con Stripe, carrito persistente y panel de admin completo.",
    category: "E-commerce",
    imageUrl:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop",
    features: ["Next.js", "Stripe", "Sanity"],
    repoUrl: "#",
    demoUrl: "#",
  },
];

const mockEducation: EducationItem[] = [
  {
    id: "1",
    degree: "M.Sc. Human-Computer Interaction",
    institution: "Stanford University",
    startDate: "2018",
    endDate: "2020",
    description: "Especialización en interfaces espaciales y usabilidad avanzada.",
  },
  {
    id: "2",
    degree: "B.Sc. Computer Science",
    institution: "MIT",
    startDate: "2014",
    endDate: "2018",
    description: "Fundamentos de ingeniería de software, algoritmos y estructuras de datos.",
  },
];

const mockServices: Service[] = [
  {
    id: "1",
    title: "Web Development",
    description:
      "Desarrollo de aplicaciones web rápidas, seguras y escalables utilizando las últimas tecnologías del ecosistema.",
    icon: "code",
  },
  {
    id: "2",
    title: "UI/UX Design",
    description:
      "Diseño de interfaces centradas en el usuario, creando prototipos interactivos y sistemas de diseño consistentes.",
    icon: "pen-tool",
  },
  {
    id: "3",
    title: "Consulting",
    description:
      "Auditoría de código, arquitectura y optimización de rendimiento para equipos existentes y productos en producción.",
    icon: "rocket",
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getProfile(): Promise<ApiResponse<Profile>> {
  await delay(300);
  return { data: mockProfile };
}

export async function getSkills(): Promise<ApiResponse<SkillCategory[]>> {
  await delay(300);
  return { data: mockSkills };
}

export async function getTechnologies(): Promise<ApiResponse<Technology[]>> {
  await delay(300);
  return { data: mockTechnologies };
}

export async function getProjects(): Promise<ApiResponse<Project[]>> {
  await delay(300);
  return { data: mockProjects };
}

export async function getEducation(): Promise<ApiResponse<EducationItem[]>> {
  await delay(300);
  return { data: mockEducation };
}

export async function getServices(): Promise<ApiResponse<Service[]>> {
  await delay(300);
  return { data: mockServices };
}

export async function sendContact(
  _message: ContactMessage
): Promise<ApiResponse<{ id: string; status: "sent" }>> {
  await delay(500);
  return { data: { id: crypto.randomUUID(), status: "sent" } };
}

export async function getCvUrl(): Promise<string> {
  await delay(200);
  return "#";
}
