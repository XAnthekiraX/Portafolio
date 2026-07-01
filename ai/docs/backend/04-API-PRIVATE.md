---
doc_id: backend-api-private
version: 1.0.0
last_updated: 2026-07-01
owner: Anthekira
type: api-reference
dependencies:
  [backend-overview, entities, database, authentication, business-logic]
tags: [api, private, crud, admin, authentication, csrf, rate-limiting]
ai_context:
  primary_use: Reference for all private admin API endpoints with authentication and CSRF
  key_constraints:
    [JWT + CSRF required, service_role bypass RLS, rate limiting on login]
  target_audience: Backend developers, AI agents implementing admin features
---

# API Privada — Anthekira.dev

## 📋 Contexto

**Propósito:** Documentación de endpoints privados para el panel de administración.  
**Cuándo usarlo:** Al implementar/modificar endpoints CRUD, autenticación, o funcionalidades admin.  
**Problemas que resuelve:** Centraliza autenticación, CSRF, rate limiting y endpoints privados.

## 🏗️ Configuración General

| Aspecto       | Valor                                                                 |
| ------------- | --------------------------------------------------------------------- |
| Base          | `/api/private`                                                        |
| Auth          | ✅ JWT (cookies httpOnly) + CSRF token (header `X-CSRF-Token`)        |
| Rate Limiting | ✅ Login: 5 intentos/minuto por IP                                    |
| Cliente DB    | service_role (bypass RLS)                                             |
| Middleware    | `frontend/src/middleware.ts` protege todas las rutas `/api/private/*` |
| CORS          | ❌ mismo origen                                                       |

**Envelope:**

```typescript
{ success: true; data: T } | { success: false; error: string; code?: string; details?: Record<string, string[]> }
```

## 🔌 Endpoints

### POST /api/private/admin/login

**Metadata:** `private-admin-login-post` · v1.0.0 · Categoría: Auth · Rate Limit: 5/min/IP

**Request Schema:**

```typescript
{
  email: string;
  password: string;
}
```

**Response Schema (200):**

```typescript
{
  success: boolean;
  data: {
    message: string;
  }
}
```

**Business Logic:**

1. Rate limiting por IP (5 intentos/minuto)
2. `supabase.auth.signInWithPassword({ email, password })`
3. Establece cookies httpOnly + cookie `csrf-token`
4. Redirige a `/admin`

**Error Handling:** `401` (credenciales inválidas) · `429` (rate limit excedido) · `500` (error inesperado)

---

### GET /api/private/personal-info

**Metadata:** `private-personal-info-get` · v1.0.0 · Categoría: Personal Info

**Response Schema (200):**

```typescript
{
  success: boolean;
  data: {
    id: string;
    name: string;
    professional_title: string | null;
    bio: string | null;
    current_status: string | null;
    email: string;
    location: string | null;
    avatar_url: string | null;
    cv: {
      // CVs por idioma
      es: string | null; // desde personal_info.cv_url
      en: string | null; // desde entity_translations.content.cv_url
      pt: string | null; // desde entity_translations.content.cv_url
    }
    social_links: SocialLinks | null;
  }
}
```

**Business Logic:**

1. Consulta `personal_info` con `user_id` del JWT autenticado
2. Consulta `entity_translations` donde `entity_type='personal_info'` y `entity_id = personal_info.id` para obtener los CVs en EN y PT
3. Compone `cv`: `{ es: personal_info.cv_url, en: translations.en?.content?.cv_url, pt: translations.pt?.content?.cv_url }`

**Error Handling:** `404` (no existe perfil) · `500` (error inesperado)

---

### POST /api/private/personal-info

**Metadata:** `private-personal-info-post` · v1.0.0 · Categoría: Personal Info · Auto-traducción: professional_title + bio → EN/PT

**Request Schema:**

```typescript
{
  name: string;
  professional_title: string;
  bio: string;
  current_status?: string;
  email: string;
  location?: string;
  avatar_url?: string;
  social_links?: SocialLinks;
}
```

**Response Schema (201):**

```typescript
{
  success: boolean;
  data: PersonalInfo;
}
```

**Business Logic:**

1. Valida con `createPersonalInfoSchema`
2. Verifica que no exista ya un perfil (solo uno por usuario)
3. Inserta en `personal_info` table
4. Si tiene `professional_title` o `bio`, ejecuta `autoTranslate('personal_info', id, { professional_title, bio })` en paralelo

**Error Handling:** `400` (validación fallida) · `409` (ya existe perfil) · `500` (error inesperado)

---

### PUT /api/private/personal-info

**Metadata:** `private-personal-info-put` · v1.0.0 · Categoría: Personal Info · Auto-traducción: professional_title + bio → EN/PT

**Request Schema:**

```typescript
{ name?: string; professional_title?: string; bio?: string; current_status?: string; location?: string; avatar_url?: string; social_links?: SocialLinks; }
```

> Nota: Los CVs se gestionan por separado en `PUT /api/private/personal-info/cv`.

**Response Schema (200):**

```typescript
{
  success: boolean;
  data: PersonalInfo;
}
```

**Business Logic:**

1. Valida con `updatePersonalInfoSchema` (merge parcial social_links)
2. Actualiza `personal_info` table
3. Si cambió `professional_title` o `bio`, ejecuta `autoTranslate('personal_info', id, { professional_title, bio })` en paralelo

**Error Handling:** `400` (validación fallida) · `404` (no existe) · `500` (error inesperado)

---

### PUT /api/private/personal-info/cv

**Metadata:** `private-personal-info-cv-put` · v1.0.0 · Categoría: Personal Info

**Request Schema:**

```typescript
{
  cv: {
    es: string | null; // URL del CV en español (se guarda en personal_info.cv_url)
    en: string | null; // URL del CV en inglés (se guarda en entity_translations.content.cv_url)
    pt: string | null; // URL del CV en portugués (se guarda en entity_translations.content.cv_url)
  }
}
```

**Response Schema (200):**

```typescript
{
  success: boolean;
  data: {
    cv: {
      es: string | null;
      en: string | null;
      pt: string | null;
    }
  }
}
```

**Business Logic:**

1. Valida que los valores sean URLs válidas o null
2. Guarda `cv.es` en `personal_info.cv_url` (UPDATE directo en la tabla)
3. Guarda `cv.en` y `cv.pt` en `entity_translations` vía RPC `upsert_entity_translations`:

```typescript
await supabaseAdmin.rpc("upsert_entity_translations", {
  p_entity_type: "personal_info",
  p_entity_id: personalInfoId,
  p_translations: [
    {
      locale: "en",
      content: { cv_url: cv.en },
      translation_status: "completed",
    },
    {
      locale: "pt",
      content: { cv_url: cv.pt },
      translation_status: "completed",
    },
  ],
});
```

> El RPC hace **merge JSONB** (`entity_translations.content || EXCLUDED.content`), por lo que al enviar solo `{ cv_url: ... }` se agrega al content existente sin perder `professional_title` ni `bio`. Si se envía `null`, el merge lo establece correctamente.

**Error Handling:** `400` (validación fallida) · `404` (no existe perfil) · `500` (error inesperado)

---

### GET /api/private/projects

**Metadata:** `private-projects-get` · v1.0.0 · Categoría: Projects

**Response Schema (200):**

```typescript
{
  success: boolean;
  data: Array<
    Project & {
      translations: {
        en: { translation_status: TranslationStatus } | null;
        pt: { translation_status: TranslationStatus } | null;
      };
    }
  >;
}
```

**Business Logic:**

1. Lista todos los projects ordenados por `display_order`
2. Left JOIN `entity_translations` donde `entity_type='project'` y `entity_id = projects.id`
3. Para cada project, compone `translations`:

```typescript
translations: {
  en: translations.find(t => t.locale === 'en')?.translation_status ?? null,
  pt: translations.find(t => t.locale === 'pt')?.translation_status ?? null,
}
```

> `null` indica que nunca se generó traducción para ese locale. Los valores posibles son `'completed'` | `'failed'`.

**Error Handling:** `200` con array vacío si no hay proyectos · `500` (error inesperado)

---

### POST /api/private/projects

**Metadata:** `private-projects-post` · v1.0.0 · Categoría: Projects · Auto-traducción: title + description → EN/PT

**Request Schema:**

```typescript
{ title: string; description: string; type: 'project'|'saas'; repository_url?: string; url?: string; features?: string[]; image_url?: string; status?: string; display_order?: number }
```

**Response Schema (201):**

```typescript
{
  success: boolean;
  data: Project;
}
```

**Business Logic:**

1. Valida con `createProjectSchema`
2. Genera slug único con `generateUniqueSlug()`
3. Inserta en `projects` table
4. Ejecuta `autoTranslate('project', id, { title, description })` en paralelo

**Error Handling:** `400` (validación fallida) · `409` (slug duplicado) · `500` (error inesperado)

---

### PUT /api/private/projects/[id]

**Metadata:** `private-projects-put` · v1.0.0 · Categoría: Projects · Auto-traducción: re-traduce si cambió texto

**Request Schema:** `Partial<createProjectSchema>`

**Response Schema (200):**

```typescript
{
  success: boolean;
  data: Project;
}
```

**Business Logic:**

1. Valida con `updateProjectSchema`
2. Si cambió `title`, regenera slug
3. Actualiza project
4. Si cambió `title` o `description`, re-ejecuta `autoTranslate()`

**Error Handling:** `400` (validación fallida) · `404` (no existe) · `409` (slug duplicado) · `500` (error inesperado)

---

### DELETE /api/private/projects/[id]

**Metadata:** `private-projects-delete` · v1.0.0 · Categoría: Projects

**Response Schema (200):**

```typescript
{
  success: boolean;
  data: null;
}
```

**Business Logic:**

1. Elimina project por ID
2. Cascade elimina `project_skills` y `entity_translations` relacionadas

**Error Handling:** `404` (no existe) · `500` (error inesperado)

---

### GET /api/private/skills

**Metadata:** `private-skills-get` · v1.0.0 · Categoría: Skills

**Response Schema (200):**

```typescript
{ success: boolean; data: Skill[] }
```

**Business Logic:** Lista skills ordenadas por `display_order`

**Error Handling:** `500` (error inesperado)

---

### POST /api/private/skills

**Metadata:** `private-skills-post` · v1.0.0 · Categoría: Skills · Auto-traducción: ❌

**Request Schema:**

```typescript
{ name: string; category: SkillCategory; display_order?: number }
```

**Response Schema (201):**

```typescript
{
  success: boolean;
  data: Skill;
}
```

**Business Logic:**

1. Valida con `createSkillSchema`
2. Inserta en `skills` table

**Error Handling:** `400` (validación fallida) · `409` (nombre duplicado) · `500` (error inesperado)

---

### PUT /api/private/skills/[id]

**Metadata:** `private-skills-put` · v1.0.0 · Categoría: Skills · Auto-traducción: ❌

**Request Schema:** `Partial<createSkillSchema>`

**Response Schema (200):**

```typescript
{
  success: boolean;
  data: Skill;
}
```

**Business Logic:** Valida y actualiza skill por ID

**Error Handling:** `400` (validación fallida) · `404` (no existe) · `409` (nombre duplicado) · `500` (error inesperado)

---

### DELETE /api/private/skills/[id]

**Metadata:** `private-skills-delete` · v1.0.0 · Categoría: Skills

**Response Schema (200):**

```typescript
{
  success: boolean;
  data: null;
}
```

**Business Logic:** Elimina skill. Cascade elimina `project_skills` relacionadas.

**Error Handling:** `404` (no existe) · `500` (error inesperado)

---

### GET /api/private/education

**Metadata:** `private-education-get` · v1.0.0 · Categoría: Education · Estado traducciones: ✅

**Response Schema (200):**

```typescript
{
  success: boolean;
  data: Array<
    Education & {
      translations: {
        en: { translation_status: TranslationStatus } | null;
        pt: { translation_status: TranslationStatus } | null;
      };
    }
  >;
}
```

**Business Logic:**

1. Lista toda la educación (ordenada por `institution`)
2. Left JOIN `entity_translations` donde `entity_type='education'` y `entity_id = education.id`
3. Para cada registro, compone `translations`:

```typescript
translations: {
  en: translations.find(t => t.locale === 'en')?.translation_status ?? null,
  pt: translations.find(t => t.locale === 'pt')?.translation_status ?? null,
}
```

> `null` indica que nunca se generó traducción para ese locale. Los valores posibles son `'completed'` | `'failed'`.

**Error Handling:** `200` con array vacío si no hay registros · `500` (error inesperado)

---

### POST /api/private/education

**Metadata:** `private-education-post` · v1.0.0 · Categoría: Education · Auto-traducción: description → EN/PT

**Request Schema:**

```typescript
{ institution: string; degree: string; description?: string; website_url?: string; logo_url?: string }
```

**Response Schema (201):**

```typescript
{
  success: boolean;
  data: Education;
}
```

**Business Logic:**

1. Valida con `createEducationSchema`
2. Inserta en `education` table
3. Si tiene `description`, ejecuta `autoTranslate('education', id, { description })` en paralelo

**Error Handling:** `400` (validación fallida) · `500` (error inesperado)

---

### PUT /api/private/education/[id]

**Metadata:** `private-education-put` · v1.0.0 · Categoría: Education · Auto-traducción: re-traduce si cambió description

**Request Schema:** `Partial<createEducationSchema>`

**Response Schema (200):**

```typescript
{
  success: boolean;
  data: Education;
}
```

**Business Logic:**

1. Valida con `updateEducationSchema`
2. Actualiza education
3. Si cambió `description`, re-ejecuta `autoTranslate('education', id, { description })`

**Error Handling:** `400` (validación fallida) · `404` (no existe) · `500` (error inesperado)

---

### DELETE /api/private/education/[id]

**Metadata:** `private-education-delete` · v1.0.0 · Categoría: Education

**Response Schema (200):**

```typescript
{
  success: boolean;
  data: null;
}
```

**Business Logic:** Elimina educación por ID

**Error Handling:** `404` (no existe) · `500` (error inesperado)

---

### GET /api/private/technologies

**Metadata:** `private-technologies-get` · v1.0.0 · Categoría: Technologies

**Response Schema (200):**

```typescript
{ success: boolean; data: Technology[] }
```

**Business Logic:** Lista tecnologías ordenadas por `display_order`

**Error Handling:** `500` (error inesperado)

---

### POST /api/private/technologies

**Metadata:** `private-technologies-post` · v1.0.0 · Categoría: Technologies · Auto-traducción: ❌

**Request Schema:**

```typescript
{ name: string; icon_url?: string; website_url?: string; display_order?: number }
```

**Response Schema (201):**

```typescript
{
  success: boolean;
  data: Technology;
}
```

**Business Logic:** Valida con `createTechnologySchema` e inserta

**Error Handling:** `400` (validación fallida) · `409` (nombre duplicado) · `500` (error inesperado)

---

### PUT /api/private/technologies/[id]

**Metadata:** `private-technologies-put` · v1.0.0 · Categoría: Technologies · Auto-traducción: ❌

**Request Schema:** `Partial<createTechnologySchema>`

**Response Schema (200):**

```typescript
{
  success: boolean;
  data: Technology;
}
```

**Business Logic:** Valida y actualiza tecnología por ID

**Error Handling:** `400` (validación fallida) · `404` (no existe) · `409` (nombre duplicado) · `500` (error inesperado)

---

### DELETE /api/private/technologies/[id]

**Metadata:** `private-technologies-delete` · v1.0.0 · Categoría: Technologies

**Response Schema (200):**

```typescript
{
  success: boolean;
  data: null;
}
```

**Business Logic:** Elimina tecnología por ID

**Error Handling:** `404` (no existe) · `500` (error inesperado)

---

### GET /api/private/services

**Metadata:** `private-services-get` · v1.0.0 · Categoría: Services

**Response Schema (200):**

```typescript
{ success: boolean; data: Service[] }
```

**Business Logic:** Lista servicios ordenados por `display_order`

**Error Handling:** `500` (error inesperado)

---

### POST /api/private/services

**Metadata:** `private-services-post` · v1.0.0 · Categoría: Services · Auto-traducción: title + description → EN/PT

**Request Schema:**

```typescript
{ title: string; description: string; icon?: string; status?: ServiceStatus; display_order?: number }
```

**Response Schema (201):**

```typescript
{
  success: boolean;
  data: Service;
}
```

**Business Logic:**

1. Valida con `createServiceSchema`
2. Inserta en `services` table
3. Ejecuta `autoTranslate('service', id, { title, description })` en paralelo

**Error Handling:** `400` (validación fallida) · `500` (error inesperado)

---

### PUT /api/private/services/[id]

**Metadata:** `private-services-put` · v1.0.0 · Categoría: Services · Auto-traducción: re-traduce si cambió texto

**Request Schema:** `Partial<createServiceSchema>`

**Response Schema (200):**

```typescript
{
  success: boolean;
  data: Service;
}
```

**Business Logic:**

1. Valida con `updateServiceSchema`
2. Actualiza service
3. Si cambió `title` o `description`, re-ejecuta `autoTranslate()`

**Error Handling:** `400` (validación fallida) · `404` (no existe) · `500` (error inesperado)

---

### DELETE /api/private/services/[id]

**Metadata:** `private-services-delete` · v1.0.0 · Categoría: Services

**Response Schema (200):**

```typescript
{
  success: boolean;
  data: null;
}
```

**Business Logic:** Elimina service. Cascade elimina `entity_translations` relacionadas.

**Error Handling:** `404` (no existe) · `500` (error inesperado)

---

### POST /api/private/upload

**Metadata:** `private-upload-post` · v1.0.0 · Categoría: Upload / Storage

**Request Schema:**

```typescript
multipart/form-data: { file: File; bucket: 'profile' | 'projects' | 'cv' }
```

**Response Schema (201):**

```typescript
{
  success: boolean;
  data: {
    url: string;
    path: string;
  }
}
```

**Business Logic:**

1. Valida MIME type y tamaño según bucket
2. Sube a Supabase Storage
3. Retorna URL pública

**Error Handling:** `400` (archivo inválido o bucket incorrecto) · `413` (archivo demasiado grande) · `500` (error Storage)

---

### GET /api/private/stats/count

**Metadata:** `private-stats-count-get` · v1.0.0 · Categoría: Stats

**Response Schema (200):**

```typescript
{
  success: boolean;
  data: {
    total_projects: number;
    total_skills: number;
    total_technologies: number;
    total_services: number;
    total_education: number;
    total_contact_messages: number;
    total_failed_translations: number;
  }
}
```

**Business Logic:** Consultas agregadas para dashboard admin

**Error Handling:** `500` (error inesperado)

---

### GET /api/private/stats/translations-pending

**Metadata:** `private-stats-translations-pending-get` · v1.0.0 · Categoría: Stats

**Response Schema (200):**

```typescript
{
  success: boolean;
  data: {
    total_failed: number;
  }
}
```

**Business Logic:** Cuenta traducciones con `translation_status = 'failed'`

**Error Handling:** `500` (error inesperado)

---

### POST /api/private/translations/retry

**Metadata:** `private-translations-retry-post` · v1.0.0 · Categoría: Translations

**Response Schema (200):**

```typescript
{
  success: boolean;
  data: {
    retried: number;
    failed: number;
  }
}
```

**Business Logic:**

1. Busca todas las traducciones con `translation_status = 'failed'`
2. Re-ejecuta `autoTranslate()` para cada una
3. Retorna conteo de reintentadas y fallidas

**Error Handling:** `500` (error inesperado)

---

### GET /api/private/contact

**Metadata:** `private-contact-get` · v1.0.0 · Categoría: Contact Messages

**Query:**

- `is_read` (boolean, opcional) — Filtrar por estado de lectura
- `page` (number, default: 1) — Página actual
- `page_size` (number, default: 20) — Elementos por página

**Response Schema (200):**

```typescript
{ success: boolean; data: ContactMessage[]; pagination: { total; page; page_size; total_pages } }
```

**Business Logic:** Lista mensajes con paginación, orden descendente por fecha

**Error Handling:** `500` (error inesperado)

---

### PUT /api/private/contact/[id]/read

**Metadata:** `private-contact-read-put` · v1.0.0 · Categoría: Contact Messages

**Response Schema (200):**

```typescript
{
  success: boolean;
  data: ContactMessage;
}
```

**Business Logic:** Marca `is_read = true` en el mensaje

**Error Handling:** `404` (no existe) · `500` (error inesperado)

---

### DELETE /api/private/contact/[id]

**Metadata:** `private-contact-delete` · v1.0.0 · Categoría: Contact Messages

**Response Schema (200):**

```typescript
{
  success: boolean;
  data: null;
}
```

**Business Logic:** Elimina mensaje de contacto por ID

**Error Handling:** `404` (no existe) · `500` (error inesperado)

---

## 🎯 CRUD Genérico

La mayoría de endpoints CRUD se implementan con helpers genéricos:

### Service (`backend/src/services/generic.ts`)

```typescript
export function createCrudService<T extends { id: string }>(
  table: string,
  config: CrudConfig<T>,
) {
  return {
    list: async (filters?: Record<string, any>) => {
      /* GET */
    },
    getById: async (id: string) => {
      /* GET /:id */
    },
    create: async (data: T) => {
      /* POST */
    },
    update: async (id: string, data: Partial<T>) => {
      /* PUT */
    },
    delete: async (id: string) => {
      /* DELETE */
    },
  };
}
```

### Handler (`backend/src/lib/generic/handler.ts`)

```typescript
export function createCrudHandler(
  service: ReturnType<typeof createCrudService>,
) {
  return {
    GET: async (req) => {
      /* ... */
    },
    POST: async (req) => {
      /* valida Zod + service.create + auto-traduce si config.translations */
    },
    PUT: async (req, { params }) => {
      /* valida Zod + service.update + auto-traduce si cambió texto */
    },
    DELETE: async (req, { params }) => {
      /* service.delete */
    },
  };
}
```

### Implementación Concreta

```typescript
// frontend/src/app/api/private/projects/route.ts
import { createCrudHandler } from "@/lib/generic/handler";
import { projectCrudService } from "@/services/projects";

const handler = createCrudHandler(projectCrudService);
export const GET = handler.GET;
export const POST = handler.POST;
```

> **Métrica:** De 34 endpoints originales a ~24 handlers HTTP. Reducción por eliminar endpoints de `/saas` (absorbidos por `/projects`).

## 🔌 Auto-traducción (DeepL) — Síncrona y Paralela

```typescript
async function autoTranslate(
  entityType: EntityType,
  entityId: string,
  sourceContent: Record<string, any>,
) {
  const results = await Promise.all(
    ["en", "pt"].map(async (locale) => {
      try {
        const translatedContent: Record<string, string> = {};
        for (const [key, text] of Object.entries(sourceContent))
          if (typeof text === "string" && text.trim())
            translatedContent[key] = await deeplTranslateWithTimeout(
              text,
              "ES",
              DEEPL_TARGET_LANGUAGES[locale],
            );
        return {
          locale,
          content: translatedContent,
          translation_status: "completed" as const,
        };
      } catch {
        return {
          locale,
          content: sourceContent,
          translation_status: "failed" as const,
        };
      }
    }),
  );

  // Guardar vía RPC upsert_entity_translations (ver 02-DATABASE.md §RPC Functions)
  await supabaseAdmin.rpc("upsert_entity_translations", {
    p_entity_type: entityType,
    p_entity_id: entityId,
    p_translations: results.map((r) => ({
      locale: r.locale,
      content: r.content,
      translation_status: r.translation_status,
    })),
  });

  return results;
}
```

**Mejora clave:** La traducción se ejecuta **antes** de responder al cliente.

### Tablas con Auto-traducción

| Recurso       | entity_type     | content keys                |
| ------------- | --------------- | --------------------------- |
| Projects      | `project`       | `title`, `description`      |
| Services      | `service`       | `title`, `description`      |
| Personal Info | `personal_info` | `professional_title`, `bio` |
| Education     | `education`     | `description`               |

## 🎯 Protección CSRF

Toda mutación (POST, PUT, DELETE) en `/api/private/*` requiere:

1. Cookie `csrf-token` (httpOnly, establecida al login)
2. Header `X-CSRF-Token` con el mismo valor

```typescript
// backend/src/lib/auth/csrf.ts
export function validateCsrf(request: NextRequest): boolean {
  const cookieToken = request.cookies.get("csrf-token")?.value;
  const headerToken = request.headers.get("X-CSRF-Token");
  return !!cookieToken && cookieToken === headerToken;
}
```

## 🔧 Rate Limiting

```typescript
// backend/src/lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";

export const loginRateLimit = new Ratelimit({
  limiter: Ratelimit.slidingWindow(5, "60 s"), // 5 intentos/minuto
});

// Uso en route handler:
const ip = request.headers.get("x-forwarded-for") ?? "unknown";
const { success } = await loginRateLimit.limit(`login:${ip}`);
if (!success)
  return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
```

## 📊 Códigos de Estado

| Código | Nombre            | Uso                      |
| ------ | ----------------- | ------------------------ |
| 200    | OK                | GET, PUT, DELETE exitoso |
| 201    | Created           | POST exitoso             |
| 400    | Bad Request       | Validación Zod fallida   |
| 401    | Unauthorized      | Token faltante/inválido  |
| 404    | Not Found         | Recurso no existe        |
| 409    | Conflict          | Slug/nombre duplicado    |
| 413    | Payload Too Large | Archivo demasiado grande |
| 429    | Too Many Requests | Rate limit excedido      |
| 500    | Internal Error    | Error inesperado         |

## 🚫 Restricciones

- NO exponer `SUPABASE_SERVICE_ROLE_KEY` al cliente
- NO omitir validación CSRF en mutaciones
- NO crear endpoints sin rate limiting en login/contact
- SIempre usar `service_role` para operaciones admin
- SIempre validar CSRF antes de procesar mutaciones
