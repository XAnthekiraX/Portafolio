---
doc_id: backend-entities
version: 1.0.0
last_updated: 2026-06-28
owner: Anthekira
type: api-reference
dependencies: [backend-overview, database]
tags: [entities, types, schemas, zod, typescript]
ai_context:
  primary_use: Reference for all TypeScript interfaces, DTOs, and Zod validation schemas
  key_constraints: [strict typing, no any, Zod validation, generic translations table]
  target_audience: Backend developers, AI agents implementing CRUD operations
---

# Entities — Anthekira.dev

## 📋 Contexto

**Propósito:** Define todas las interfaces TypeScript, tipos y schemas Zod para el backend.  
**Cuándo usarlo:** Al crear/modificar endpoints, servicios, o validaciones.  
**Problemas que resuelve:** Centraliza tipos compartidos y schemas de validación.

## 🎯 Tipos Base

```typescript
// Timestamps base para todas las entidades
interface Timestamps {
  created_at: string;
  updated_at: string;
}

// Idiomas soportados
type Locale = 'es' | 'en' | 'pt';

// Locale para traducciones (excluye 'es' que es el idioma fuente)
type TranslationLocale = 'en' | 'pt';

// Estados de traducción (simplificado de 4 a 2)
type TranslationStatus = 'completed' | 'failed';

// Estados de proyecto (unifica projects + saas)
type ProjectStatus = 'draft' | 'active' | 'archived';

// Tipo de proyecto
type ProjectType = 'project' | 'saas';

// Estado de servicio
type ServiceStatus = 'available' | 'coming_soon';

// Categorías de skills
type SkillCategory = 'frontend' | 'backend' | 'devops' | 'tools' | 'other';

// Tipos de entidad para traducciones genéricas
type EntityType = 'project' | 'personal_info' | 'service' | 'education';

// Links sociales
interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}
```

> **Simplificación:** Se eliminaron `SaasStatus` (unificado con ProjectStatus) y `TranslationStatus` se redujo de 4 estados a 2.

## 📊 Tabla de Traducciones (Genérica)

Una sola tabla `entity_translations` reemplaza las 4 tablas anteriores:

```typescript
// Tipos de contenido JSONB por entity_type
interface ProjectTranslationContent {
  title: string;
  description: string;
}

interface PersonalInfoTranslationContent {
  professional_title: string;        // Título profesional traducido
  bio: string;                        // Biografía traducida
  cv_url: string;                     // URL del CV en ese idioma (subida manualmente)
}

interface ServiceTranslationContent {
  title: string;
  description: string;
}

interface EducationTranslationContent {
  description: string;
}

type TranslationContent = ProjectTranslationContent | PersonalInfoTranslationContent | ServiceTranslationContent | EducationTranslationContent;

interface EntityTranslation {
  id: string;
  entity_type: EntityType;
  entity_id: string;                 // FK polimórfica
  locale: TranslationLocale;         // 'en' | 'pt' (solo traducción, nunca 'es')
  content: TranslationContent;       // JSONB tipado según entity_type
  translation_status: TranslationStatus;
  created_at: string;
  updated_at: string;
}
```

### Content Keys por entity_type

| entity_type | content keys |
|-------------|--------------|
| `project` | `title`, `description` |
| `personal_info` | `professional_title`, `bio`, `cv_url` |
| `service` | `title`, `description` |
| `education` | `description` |

## 🔗 Relación Project ⇄ Translations

```
projects (title, description en ES)
  └── entity_translations (entity_type='project', entity_id=project.id)
        ├── locale='en' → content: { title: "...", description: "..." }
        └── locale='pt' → content: { title: "...", description: "..." }
```

### Query típica con traducción

```sql
SELECT p.id, p.slug,
  COALESCE(et.content->>'title', p.title) AS title,
  COALESCE(et.content->>'description', p.description) AS description
FROM projects p
LEFT JOIN entity_translations et
  ON et.entity_type = 'project'
  AND et.entity_id = p.id
  AND et.locale = 'en'
  AND et.translation_status = 'completed'
WHERE p.status = 'active'
ORDER BY p.display_order;
```

> **Nota:** `p.title` y `p.description` son siempre la fuente en español. Las traducciones en `entity_translations` se superponen con COALESCE para obtener el contenido localizado.

### ProjectSkill (tabla pivote N:M)

```typescript
interface ProjectSkill {
  project_id: string;
  skill_id: string;
  created_at: string;
}
```

> Tabla pivote que relaciona `projects` con `skills` (N:M). PK compuesta: `(project_id, skill_id)`.

## 🔌 Entidades

### PersonalInfo

```typescript
interface PersonalInfo extends Timestamps {
  id: string;
  user_id: string;
  name: string;
  professional_title: string | null;
  bio: string | null;
  current_status: string | null;
  email: string;
  location: string | null;
  avatar_url: string | null;
  social_links: SocialLinks | null;
  cv_url: string | null;
}
```

### Skill

```typescript
interface Skill extends Timestamps {
  id: string;
  name: string;        // UNIQUE
  category: SkillCategory;
  display_order: number;
}
```

### Project

```typescript
interface Project extends Timestamps {
  id: string;
  user_id: string;
  title: string;                    // Fuente ES
  description: string;              // Fuente ES
  slug: string;                     // UNIQUE — identificador URL-friendly (ej: "mi-proyecto")
  type: ProjectType;                // default 'project'
  repository_url: string | null;    // Link al repositorio (project y saas)
  url: string | null;               // Link al sitio vivo (solo si type='saas')
  image_url: string | null;
  features: string[] | null;        // Solo si type='saas' (JSONB array)
  status: ProjectStatus;
  display_order: number;
}

// Project con traducciones incluidas (para responses de API/admin)
interface ProjectWithTranslations extends Project {
  translations: Partial<Record<TranslationLocale, ProjectTranslationContent>>;
}

// Project localizado para el público (title/description ya traducidos según locale solicitado)
interface LocalizedProject extends Omit<Project, 'title' | 'description'> {
  locale: TranslationLocale;
  title: string;                    // Ya traducido o fallback a ES
  description: string;              // Ya traducido o fallback a ES
}
```

> **Nota sobre URL:** `repository_url` almacena el link al repositorio (GitHub, GitLab, etc.) tanto para projects como para saas. `url` almacena el link al sitio desplegado (solo para saas). `image_url` es la imagen de portada del proyecto.

> **Nota sobre slug:** El slug es un identificador URL-friendly generado automáticamente a partir del título. Ej: "Mi Proyecto Genial" → slug: `mi-proyecto-genial`. Se usa en la URL de detalle del proyecto y es UNIQUE en la tabla. Se genera con `generateSlug()` que normaliza el texto (quita acentos, espacios → guiones, minúsculas) y verifica unicidad agregando sufijo numérico si hay duplicado.

### Technology

```typescript
interface Technology extends Timestamps {
  id: string;
  name: string;        // UNIQUE
  icon_url: string | null;
  website_url: string | null;
  display_order: number;
}
```

### Education

```typescript
interface Education extends Timestamps {
  id: string;
  institution: string;
  degree: string;
  description: string | null;
  website_url: string | null;
  logo_url: string | null;
}

// Education con estado de traducciones (para respuestas de API privada)
interface EducationWithTranslations extends Education {
  translations: {
    en: { translation_status: TranslationStatus } | null;
    pt: { translation_status: TranslationStatus } | null;
  };
}
```

### Service

```typescript
interface Service extends Timestamps {
  id: string;
  title: string;
  description: string;
  icon: string | null;  // Lucide icon name, default 'Code'
  status: ServiceStatus;
  display_order: number;
}
```

### ContactMessage

```typescript
interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
```

## 📝 Auth Types

```typescript
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  error?: string;
}
```

## 📊 API Envelope

```typescript
// Respuesta exitosa
interface ApiResponse<T> {
  success: true;
  data: T;
}

// Respuesta de error
interface ApiError {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, string[]>;
}

// Respuesta paginada
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

// Respuesta de conteo
interface CountResponse {
  success: true;
  data: {
    count: number;
  };
}
```

## 🔧 Zod Schemas

Ubicación: `shared/src/validators/index.ts`

### Patrón de Schemas

```typescript
// Schema de creación
create{Entity}Schema = z.object({ ... })

// Schema de actualización (parcial)
update{Entity}Schema = create{Entity}Schema.partial()
```

### Ejemplo: Project Schema

```typescript
const createProjectSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(10).max(10000),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  type: z.enum(['project', 'saas']).default('project'),
  repository_url: z.string().url().nullable().optional(),  // Link al repositorio
  url: z.string().url().nullable().optional(),  // Solo si type='saas'
  image_url: z.string().url().nullable().optional(),
  features: z.array(z.string()).nullable().optional(),  // Solo si type='saas'
  status: z.enum(['draft', 'active', 'archived']).default('draft'),
  display_order: z.number().int().min(0).default(0),
});
```

### Schemas Especiales

**updatePersonalInfoSchema:**
- `social_links` merge parcial (campos opcionales + nullable para eliminación)

**createProjectSchema:**
- Validación condicional: si `type='saas'`, `features` es requerido y `url` aplica; si `type='project'`, `repository_url` aplica

## 🏗️ Configuraciones CRUD Genérico

```typescript
interface CrudConfig<T> {
  table: string;                    // nombre tabla en BD
  schema: {
    create: z.ZodSchema<T>;
    update: z.ZodSchema<Partial<T>>;
  };
  translations?: {
    entityType: EntityType;         // para auto-traducción
    fields: string[];               // campos a traducir
  };
  slug?: {
    source: string;                 // campo usado para generar slug
    unique: boolean;
  };
  searchFields?: string[];          // campos para búsqueda en listado
}

// Ejemplo de configuración:
const projectCrud = createCrudService('projects', {
  schema: { create: createProjectSchema, update: updateProjectSchema },
  translations: { entityType: 'project', fields: ['title', 'description'] },
  slug: { source: 'title', unique: true },
  searchFields: ['title', 'description'],
});
```

## 🚫 Restricciones

- NO usar `any` tipos — usar tipos específicos
- NO crear entidades sin documentar en esta guía
- SI se necesita nueva entidad, agregar aquí primero
- SI falta campo crítico, marcar con `[REQUIERE: descripción]`
