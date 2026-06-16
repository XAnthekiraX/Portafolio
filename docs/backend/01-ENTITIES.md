# 01-ENTITIES.md — Anthekira.dev

## 1. Tipos Base
```typescript
interface Timestamps { created_at: string; updated_at: string; }
type Locale = 'es' | 'en' | 'pt';
type TranslationStatus = 'pending' | 'translating' | 'completed' | 'failed';
type ProjectStatus = 'draft' | 'active' | 'archived';
type SaasStatus = 'live' | 'beta' | 'development' | 'planning';
type ServiceStatus = 'available' | 'coming_soon';
type SkillCategory = 'frontend' | 'backend' | 'devops' | 'tools' | 'other';

interface SocialLinks { github?: string; linkedin?: string; twitter?: string; website?: string; }

// Modelo genérico de traducción (content JSONB)
interface Translation {
  id: string; entity_id: string; locale: Locale;
  content: Record<string, any>;  // JSONB con textos traducibles
  translation_status: TranslationStatus;
  created_at: string; updated_at: string;
}
```

## 2. Entidades
**PersonalInfo** extends Timestamps: id, user_id, name, professional_title, bio, current_status, email, location, avatar_url, cv_url, social_links.  
**PersonalInfoTranslation** extends Translation: entity_id → personal_info.id | content: `{ bio: "..." }`

**Skill** extends Timestamps: id, name, category, display_order.

**Project** extends Timestamps: id, user_id, title, description, slug, project_url, repository_url, image_url, status, display_order.  
**ProjectTranslation** extends Translation: entity_id → projects.id | content: `{ title: "...", description: "..." }`

**SaasProject** extends Timestamps: id, user_id, name, description, url, image_url, status, features (string[]), display_order.  
**SaasProjectTranslation** extends Translation: entity_id → saas_projects.id | content: `{ name: "...", description: "..." }`

**Technology** extends Timestamps: id, name (unique), icon_url, website_url, display_order.

**Education** extends Timestamps: id, institution, degree, description, website_url, logo_url, display_order.

**Service** extends Timestamps: id, title, description, icon, status, display_order.  
**ServiceTranslation** extends Translation: entity_id → services.id | content: `{ title: "...", description: "..." }`

**ContactMessage:** id, name, email, subject, message, is_read, created_at.

## 3. Auth Types
```typescript
interface LoginRequest { email: string; password: string; }
interface LoginResponse { success: boolean; error?: string; }
```

## 4. API Envelope
```typescript
interface ApiResponse<T> { success: true; data: T; }
interface ApiError { success: false; error: string; code?: string; details?: Record<string, string[]>; }
interface PaginatedResponse<T> { success: true; data: T[]; pagination: { total; page; page_size; total_pages; }; }
interface CountResponse { success: true; data: { count: number; }; }
```

## 5. Zod Schemas (shared/src/validators/index.ts)
Schemas para cada entidad: `create{Entity}Schema` + `update{Entity}Schema = create.partial()`.  
Ej: `createProjectSchema = z.object({ title: z.string().min(2).max(200), description: z.string().min(10).max(10000), ... })`.  
Especiales: `updatePersonalInfoSchema` con `social_links` merge parcial (campos opcionales + nullable para eliminación).
