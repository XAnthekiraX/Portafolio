# 01-ENTITIES.md — Anthekira.dev

## 1. Tipos Base
```typescript
interface Timestamps { created_at: string; updated_at: string; }
type Locale = 'es' | 'en' | 'pt';
type TranslationStatus = 'completed' | 'failed';
type ProjectStatus = 'draft' | 'active' | 'archived';
type ProjectType = 'project' | 'saas';
type ServiceStatus = 'available' | 'coming_soon';
type SkillCategory = 'frontend' | 'backend' | 'devops' | 'tools' | 'other';
type EntityType = 'project' | 'personal_info' | 'service';

interface SocialLinks { github?: string; linkedin?: string; twitter?: string; website?: string; }
```

> **Simplificación:** Se eliminaron los tipos `SaasStatus` (unificado con ProjectStatus) y `TranslationStatus` se redujo de 4 estados a 2 (`completed | failed`).

## 2. Tabla de Traducciones (genérica)
Una sola tabla `entity_translations` reemplaza las 4 tablas anteriores:

```typescript
interface EntityTranslation {
  id: string;
  entity_type: EntityType;     // 'project' | 'personal_info' | 'service'
  entity_id: string;           // FK polimórfica
  locale: Locale;              // 'en' | 'pt'
  content: Record<string, any>; // JSONB con textos traducibles
  translation_status: TranslationStatus;
  created_at: string;
  updated_at: string;
}
```

**content keys por entity_type:**
| entity_type | content keys |
|---|---|
| `project` | `title`, `description` |
| `personal_info` | `bio` |
| `service` | `title`, `description` |

## 3. Entidades

**PersonalInfo** extends Timestamps: id, user_id, name, professional_title, bio, current_status, email, location, avatar_url, cv_url, social_links (SocialLinks type).

**Skill** extends Timestamps: id, name (unique), category, display_order.

**Project** extends Timestamps: id, user_id, title, description, slug (unique), project_url, repository_url, image_url, type (ProjectType, default 'project'), status (ProjectStatus), features (string[], solo si type='saas'), display_order.

> **Nota:** Los proyectos SaaS (`type='saas'`) usan `url` en lugar de `project_url` + `repository_url`. El campo `features` es un array JSONB de strings. La relación N:M con skills se maneja en `project_skills`.

**Technology** extends Timestamps: id, name (unique), icon_url, website_url, display_order.

**Education** extends Timestamps: id, institution, degree, description, website_url, logo_url, display_order.

**Service** extends Timestamps: id, title, description, icon (Lucide icon name), status, display_order.

**ContactMessage:** id, name, email, subject, message, is_read, created_at.

## 4. Auth Types
```typescript
interface LoginRequest { email: string; password: string; }
interface LoginResponse { success: boolean; error?: string; }
```

## 5. API Envelope
```typescript
interface ApiResponse<T> { success: true; data: T; }
interface ApiError { success: false; error: string; code?: string; details?: Record<string, string[]>; }
interface PaginatedResponse<T> { success: true; data: T[]; pagination: { total; page; page_size; total_pages; }; }
interface CountResponse { success: true; data: { count: number; }; }
```

## 6. Zod Schemas (shared/src/validators/index.ts)
Schemas para cada entidad: `create{Entity}Schema` + `update{Entity}Schema = create.partial()`.  
Ej: `createProjectSchema = z.object({ title: z.string().min(2).max(200), description: z.string().min(10).max(10000), type: z.enum(['project', 'saas']).default('project'), ... })`.  
Especiales:
- `updatePersonalInfoSchema` con `social_links` merge parcial (campos opcionales + nullable para eliminación)
- `createProjectSchema` con validación condicional: si `type='saas'`, `features` es requerido y `project_url`/`repository_url` se reemplazan por `url`

## 7. Configuraciones CRUD Genérico
```typescript
interface CrudConfig<T> {
  table: string;              // nombre tabla en BD
  schema: {
    create: z.ZodSchema<T>;
    update: z.ZodSchema<Partial<T>>;
  };
  translations?: {
    entityType: EntityType;    // para auto-traducción
    fields: string[];          // campos a traducir (ej: ['title', 'description'])
  };
  slug?: {
    source: string;            // campo usado para generar slug (ej: 'title')
    unique: boolean;
  };
  searchFields?: string[];     // campos para búsqueda en listado
}

// Ejemplo de configuración:
const projectCrud = createCrudService('projects', {
  schema: { create: createProjectSchema, update: updateProjectSchema },
  translations: { entityType: 'project', fields: ['title', 'description'] },
  slug: { source: 'title', unique: true },
  searchFields: ['title', 'description'],
});
```
