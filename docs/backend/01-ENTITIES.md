# 01-ENTITIES.md — Anthekira.dev — Definición de Entidades (TypeScript)

## 1. Propósito

Este documento define todas las entidades del sistema como interfaces TypeScript. Estas interfaces son la fuente de verdad para:

- Tipos en `src/types/entities.ts`
- Validaciones de entrada (Zod schemas)
- Documentación de API (request/response)
- Componentes del panel admin (FormBuilder fields)

**Convenciones:**

| Elemento | Regla |
|---|---|
| Nombres | `PascalCase` para interfaces |
| Archivo destino | `shared/src/types/entities.ts` |
| IDs | `string` (UUID v4) |
| Timestamps | `string` (ISO 8601) — se serializan como string en JSON |
| Nullable vs Optional | `null` para valores que pueden ser nulos en BD, `undefined` para campos opcionales en requests |
| Traducciones | Tipo genérico `Translation<T>` reutilizable |

---

## 2. Tipos Base y Genéricos

```typescript
// ============================================================
// shared/src/types/entities.ts — Tipos base
// ============================================================

// ---------- Timestamps ----------
interface Timestamps {
  created_at: string;   // ISO 8601
  updated_at: string;   // ISO 8601
}

// ---------- Locales soportados ----------
type Locale = 'es' | 'en' | 'pt';

// ---------- Social Links (JSONB) ----------
interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}

// ---------- Genérico para tablas de traducción (patrón, no usado directamente) ----------
type Translation<T> = {
  id: string;
  locale: Locale;
  // Omit 'es' porque el idioma fuente está en la tabla principal
} & Partial<T> & Timestamps;

// ---------- Estados ----------
type ProjectStatus = 'draft' | 'active' | 'archived';
type SaasStatus = 'live' | 'beta' | 'development' | 'planning';
type ServiceStatus = 'available' | 'coming_soon';
type SkillCategory = 'frontend' | 'backend' | 'devops' | 'tools' | 'other';
```

---

## 3. Personal Info

```typescript
// ---------- PersonalInfo ----------
interface PersonalInfo extends Timestamps {
  id: string;
  user_id: string;              // FK → auth.users.id

  // Datos básicos
  name: string;                 // Nombre completo
  professional_title: string;   // "Full-Stack Developer"
  bio: string;                  // Biografía (español, idioma fuente)
  current_status: string;       // "Open to work", "Freelance", etc.
  email: string;                // Email público de contacto
  location: string;             // Ciudad/País

  // Media
  avatar_url: string;           // URL en Supabase Storage (bucket: profile)
  cv_url: string;               // URL del PDF en Supabase Storage (bucket: cv)

  // Redes sociales
  social_links: SocialLinks;    // JSONB — merge parcial en PUT
}

// ---------- PersonalInfoTranslation ----------
interface PersonalInfoTranslation extends Timestamps {
  id: string;
  personal_info_id: string;     // FK → personal_info.id
  locale: Locale;               // 'en' | 'pt'
  bio: string;                  // Biografía traducida
}
```

### 3.1 Social Links — Merge Strategy

El endpoint `PUT /api/private/personal-info` recibe objetos parciales de `SocialLinks`. El backend debe hacer **merge** con el JSONB existente:

```typescript
// Request PUT ejemplos
{ social_links: { github: "https://github.com/anthekira" } }
  // → merge: conserva linkedin, twitter, website existentes

{ social_links: { linkedin: null } }
  // → elimina linkedin del objeto
```

---

## 4. Skills

```typescript
// ---------- Skill ----------
interface Skill extends Timestamps {
  id: string;
  name: string;                     // "React", "Node.js", etc.
  category: SkillCategory;          // 'frontend' | 'backend' | 'devops' | 'tools' | 'other'
  display_order: number;            // Orden de visualización
}

// ---------- Create/Update Skill ----------
interface CreateSkillDto {
  name: string;
  category: SkillCategory;
  display_order?: number;           // Default: 0
}

interface UpdateSkillDto extends Partial<CreateSkillDto> {}
```

---

## 5. Projects

```typescript
// ---------- Project ----------
interface Project extends Timestamps {
  id: string;
  user_id: string;                  // FK → auth.users.id

  // Contenido (español, idioma fuente)
  title: string;
  description: string;

  slug: string;                     // URL-friendly, unique

  // Enlaces
  project_url: string;              // URL del proyecto desplegado
  repository_url: string;           // URL del repositorio

  // Media
  image_url: string;                // Imagen destacada

  // Estado y orden
  status: ProjectStatus;            // 'draft' | 'active' | 'archived'
  display_order: number;
}

// ---------- ProjectTranslation ----------
interface ProjectTranslation extends Timestamps {
  id: string;
  project_id: string;               // FK → projects.id
  locale: Locale;                   // 'en' | 'pt'
  title: string;                    // Título traducido
  description: string;              // Descripción traducida
}

// ---------- Project con traducciones ----------
interface ProjectWithTranslations extends Project {
  translations: ProjectTranslation[];
  skills: Skill[];                  // Skills asociadas (join vía project_skills)
}
```

### 5.1 Slug Generation

```typescript
// El slug se genera automáticamente desde el title en español:
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // Quitar acentos
    .replace(/[^a-z0-9]+/g, '-')                         // Reemplazar no-alphanum por guiones
    .replace(/^-+|-+$/g, '');                            // Quitar guiones iniciales/finales
}
```

### 5.2 Project con Skill Relations

```typescript
// Tabla pivote (no se expone directamente en API)
interface ProjectSkill {
  project_id: string;               // FK → projects.id
  skill_id: string;                 // FK → skills.id
  created_at: string;
}
```

---

## 6. SaaS Projects

```typescript
// ---------- SaasProject ----------
interface SaasProject extends Timestamps {
  id: string;
  user_id: string;                  // FK → auth.users.id

  name: string;                     // Nombre del SaaS
  description: string;              // Descripción (idioma fuente: ES)
  url: string;                      // URL del proyecto
  image_url: string;                // Imagen destacada

  status: SaasStatus;               // 'live' | 'beta' | 'development' | 'planning'
  features: string[];               // Array de características (JSONB)

  display_order: number;
}

// ---------- SaasProjectTranslation ----------
interface SaasProjectTranslation extends Timestamps {
  id: string;
  saas_project_id: string;          // FK → saas_projects.id
  locale: Locale;                   // 'en' | 'pt'
  name: string;                     // Nombre traducido
  description: string;              // Descripción traducida
}

// ---------- SaasProject con skills ----------
interface SaasProjectWithSkills extends SaasProject {
  skills: Skill[];
}

// ---------- Create/Update DTO ----------
interface CreateSaasProjectDto {
  name: string;
  description: string;
  url: string;
  image_url?: string;
  status?: SaasStatus;              // Default: 'live'
  features?: string[];              // Default: []
  skill_ids?: string[];             // IDs de skills a asociar
  display_order?: number;
}

// Tabla pivote
interface SaasProjectSkill {
  saas_project_id: string;          // FK → saas_projects.id
  skill_id: string;                 // FK → skills.id
  created_at: string;
}
```

---

## 7. Technologies

```typescript
interface Technology extends Timestamps {
  id: string;
  name: string;                     // Nombre único
  icon_url: string;                 // Icono (Supabase Storage)
  website_url: string;              // Sitio web de la tecnología
  display_order: number;
}

interface CreateTechnologyDto {
  name: string;
  icon_url?: string;
  website_url?: string;
  display_order?: number;
}

interface UpdateTechnologyDto extends Partial<CreateTechnologyDto> {}
```

---

## 8. Education

```typescript
// ---------- Education ----------
interface Education extends Timestamps {
  id: string;

  institution: string;             // Nombre de la institución
  degree: string;                  // Título o curso obtenido
  description: string;             // Descripción rápida
  website_url: string;             // URL de la institución
  logo_url: string;                // URL del logo

  display_order: number;
}

// ---------- Create/Update DTO ----------
interface CreateEducationDto {
  institution: string;
  degree: string;
  description?: string;
  website_url?: string;
  logo_url?: string;
  display_order?: number;
}

interface UpdateEducationDto extends Partial<CreateEducationDto> {}
```

---

## 9. Services

```typescript
// ---------- Service ----------
interface Service extends Timestamps {
  id: string;

  // Contenido (español, idioma fuente)
  title: string;
  description: string;

  icon: string;                     // Nombre del icono Lucide: "Code", "Server", "Cloud"
  status: ServiceStatus;            // 'available' | 'coming_soon'
  display_order: number;
}

// ---------- ServiceTranslation ----------
interface ServiceTranslation extends Timestamps {
  id: string;
  service_id: string;               // FK → services.id
  locale: Locale;                   // 'en' | 'pt'
  title: string;                    // Título traducido
  description: string;              // Descripción traducida
}

// ---------- Create/Update DTO ----------
interface CreateServiceDto {
  title: string;
  description: string;
  icon?: string;                    // Default: 'Code'
  status?: ServiceStatus;           // Default: 'available'
  display_order?: number;
}

interface UpdateServiceDto extends Partial<CreateServiceDto> {}

// ---------- Service con traducciones ----------
interface ServiceWithTranslations extends Service {
  translations: ServiceTranslation[];
}
```

---



---

## 14. Auth

```typescript
// ---------- Login Request ----------
interface LoginRequest {
  email: string;
  password: string;
}

// ---------- Login Response ----------
interface LoginResponse {
  success: boolean;
  error?: string;
}

// ---------- Session (de Supabase Auth, tipado propio) ----------
interface AdminSession {
  user: {
    id: string;
    email: string;
  };
  access_token: string;
  refresh_token: string;
}
```

---

## 15. API Envelope

Todas las respuestas de la API siguen un formato envelope consistente:

```typescript
// ---------- Success Response ----------
interface ApiResponse<T> {
  success: true;
  data: T;
}

// ---------- Error Response ----------
interface ApiError {
  success: false;
  error: string;                    // Mensaje legible
  code?: string;                    // Código interno opcional: "VALIDATION_ERROR", "NOT_FOUND"
  details?: Record<string, string[]>; // Errores por campo (validación)
}

// ---------- Paginated Response ----------
interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

// ---------- Count Response ----------
interface CountResponse {
  success: true;
  data: {
    count: number;
  };
}
```

---

## 16. Zod Validation Schemas

Para validación en servidor, se usan schemas de Zod que reflejan las interfaces:

```typescript
// ============================================================
// shared/src/validators/index.ts — Schemas de validación
// ============================================================

import { z } from 'zod';

// ---------- Contact Message ----------
export const createContactMessageSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email format'),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

// ---------- Login ----------
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// ---------- Project ----------
export const createProjectSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(10).max(10000),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format').optional(),
  project_url: z.string().url().optional().or(z.literal('')),
  repository_url: z.string().url().optional().or(z.literal('')),
  image_url: z.string().optional().or(z.literal('')),
  status: z.enum(['draft', 'active', 'archived']).optional(),
  skill_ids: z.array(z.string().uuid()).optional(),
  display_order: z.number().int().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

// ---------- SaaS Project ----------
export const createSaasProjectSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().min(10).max(10000),
  url: z.string().url(),
  image_url: z.string().optional().or(z.literal('')),
  status: z.enum(['live', 'beta', 'development', 'planning']).optional(),
  features: z.array(z.string().max(200)).max(20).optional(),
  skill_ids: z.array(z.string().uuid()).optional(),
  display_order: z.number().int().optional(),
});

export const updateSaasProjectSchema = createSaasProjectSchema.partial();

// ---------- Skill ----------
export const createSkillSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.enum(['frontend', 'backend', 'devops', 'tools', 'other']),
  display_order: z.number().int().optional(),
});

export const updateSkillSchema = createSkillSchema.partial();

// ---------- Technology ----------
export const createTechnologySchema = z.object({
  name: z.string().min(1).max(100),
  icon_url: z.string().optional().or(z.literal('')),
  website_url: z.string().url().optional().or(z.literal('')),
  display_order: z.number().int().optional(),
});

export const updateTechnologySchema = createTechnologySchema.partial();

// ---------- Service ----------
export const createServiceSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(10).max(5000),
  icon: z.string().min(1).max(50).optional(),
  status: z.enum(['available', 'coming_soon']).optional(),
  display_order: z.number().int().optional(),
});

export const updateServiceSchema = createServiceSchema.partial();

// ---------- Education ----------
export const createEducationSchema = z.object({
  institution: z.string().min(2).max(200),
  degree: z.string().min(2).max(200),
  description: z.string().max(500).optional(),
  website_url: z.string().url().optional().or(z.literal('')),
  logo_url: z.string().optional().or(z.literal('')),
  display_order: z.number().int().optional(),
});

export const updateEducationSchema = createEducationSchema.partial();

// ---------- Settings ----------
export const updateSettingsSchema = z.object({
  site_name: z.string().min(1).max(100).optional(),
  site_description: z.string().max(500).optional(),
  ga_id: z.string().regex(/^G-[A-Z0-9]+$/, 'Invalid Google Analytics ID').optional().or(z.literal('')),
});

// ---------- Personal Info ----------
export const updatePersonalInfoSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  professional_title: z.string().max(200).optional(),
  bio: z.string().max(10000).optional(),
  current_status: z.string().max(100).optional(),
  email: z.string().email().optional().or(z.literal('')),
  location: z.string().max(100).optional(),
  avatar_url: z.string().optional().or(z.literal('')),
  cv_url: z.string().optional().or(z.literal('')),
  social_links: z.object({
    github: z.string().url().optional().or(z.literal('')).nullable(),
    linkedin: z.string().url().optional().or(z.literal('')).nullable(),
    twitter: z.string().url().optional().or(z.literal('')).nullable(),
    website: z.string().url().optional().or(z.literal('')).nullable(),
  }).optional(),
});
```

---

## 17. Resumen de Archivos TypeScript

| Archivo | Contenido |
|---|---|
| `shared/src/types/entities.ts` | Interfaces de todas las entidades (definidas arriba) |
| `shared/src/types/api.ts` | ApiResponse, ApiError, PaginatedResponse, CountResponse |
| `shared/src/validators/index.ts` | Zod schemas para validación de inputs |
| `shared/src/types/i18n.d.ts` | Tipos para next-intl (traducciones de UI) |

---

## 18. Dependencias con otros documentos

| Archivo | Relación |
|---|---|
| `00-REQUIREMENTS.md` | Define las entidades del sistema a alto nivel |
| `02-DATABASE.md` | Esquema PostgreSQL que estas interfaces reflejan |
| `03-API-PUBLIC.md` | Endpoints públicos que usan estas entidades |
| `04-API-PRIVATE.md` | Endpoints privados que usan estas entidades |
| `frontend/02-COMPONENTS.md` | FormBuilder Field types basados en estas entidades |
| `frontend/08-ADMIN-PANEL.md` | Formularios admin que renderizan estas entidades |
