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
type EntityType = 'project' | 'personal_info' | 'service';

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
interface EntityTranslation {
  id: string;
  entity_type: EntityType;           // 'project' | 'personal_info' | 'service'
  entity_id: string;                 // FK polimórfica
  locale: Locale;                    // 'en' | 'pt'
  content: Record<string, any>;      // JSONB con textos traducibles
  translation_status: TranslationStatus;
  created_at: string;
  updated_at: string;
}
```

### Content Keys por entity_type

| entity_type | content keys |
|-------------|--------------|
| `project` | `title`, `description` |
| `personal_info` | `bio` |
| `service` | `title`, `description` |

## 🔌 Entidades

### PersonalInfo

```typescript
interface PersonalInfo extends Timestamps {
  id: string;
  user_id: string;
  name: string;
  professional_title: string;
  bio: string;
  current_status: string;
  email: string;
  location: string;
  avatar_url: string;
  social_links: SocialLinks;
  cv_url: string;
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
  title: string;
  description: string;
  slug: string;        // UNIQUE
  type: ProjectType;   // default 'project'
  project_url?: string;  // Solo si type='project'
  repository_url?: string;  // Solo si type='project'
  url?: string;        // Solo si type='saas'
  image_url: string;
  features?: string[];  // Solo si type='saas' (JSONB array)
  status: ProjectStatus;
  display_order: number;
}
```

> **Nota:** Los proyectos SaaS usan `url` en lugar de `project_url` + `repository_url`. El campo `features` es un array JSONB de strings.

### Technology

```typescript
interface Technology extends Timestamps {
  id: string;
  name: string;        // UNIQUE
  icon_url: string;
  website_url: string;
  display_order: number;
}
```

### Education

```typescript
interface Education extends Timestamps {
  id: string;
  institution: string;
  degree: string;
  description: string;
  website_url: string;
  logo_url: string;
  display_order: number;
}
```

### Service

```typescript
interface Service extends Timestamps {
  id: string;
  title: string;
  description: string;
  icon: string;        // Lucide icon name, default 'Code'
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
  type: z.enum(['project', 'saas']).default('project'),
  project_url: z.string().url().optional(),
  repository_url: z.string().url().optional(),
  url: z.string().url().optional(),  // Solo para saas
  image_url: z.string().url().optional(),
  features: z.array(z.string()).optional(),  // Solo para saas
  status: z.enum(['draft', 'active', 'archived']).default('draft'),
  display_order: z.number().int().min(0).default(0),
});
```

### Schemas Especiales

**updatePersonalInfoSchema:**
- `social_links` merge parcial (campos opcionales + nullable para eliminación)

**createProjectSchema:**
- Validación condicional: si `type='saas'`, `features` es requerido y `project_url`/`repository_url` se reemplazan por `url`

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
