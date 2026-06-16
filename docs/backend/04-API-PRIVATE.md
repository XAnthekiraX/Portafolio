# 04-API-PRIVATE.md — Anthekira.dev — API Privada (Admin Panel)

## 1. Propósito

Este documento define todos los **endpoints privados** de Anthekira.dev, utilizados exclusivamente por el panel administrativo. Todos los endpoints requieren autenticación JWT y operan con la clave `service_role` de Supabase.

---

## 2. Autenticación

| Propiedad | Valor |
|---|---|
| **Base URL** | `https://anthekira.dev/api/private` |
| **Content-Type** | `application/json` |
| **Autenticación** | ✅ JWT en header `Authorization: Bearer <token>` |
| **Middleware** | `frontend/src/middleware.ts` protege todas las rutas `/api/private/*` |
| **Cliente DB** | `service_role` key (bypass de RLS para escritura) — excepto login (§4.1) que usa anon key |

### 2.1 Envelope de Respuesta

Todas las respuestas siguen el formato envelope definido en `backend/docs/01-ENTITIES.md` §14:

```typescript
// Éxito
{ "success": true, "data": T }

// Error
{ "success": false, "error": string, "code"?: string, "details"?: Record<string, string[]> }
```

---

## 3. Estructura de Archivos

```
frontend/src/app/api/private/
├── admin/
│   └── login/
│       └── route.ts           # POST /api/private/admin/login
├── personal-info/
│   └── route.ts               # GET, PUT /api/private/personal-info
├── projects/
│   ├── route.ts               # GET, POST /api/private/projects
│   └── [id]/
│       └── route.ts           # PUT, DELETE /api/private/projects/[id]
├── saas/
│   ├── route.ts               # GET, POST /api/private/saas
│   └── [id]/
│       └── route.ts           # PUT, DELETE /api/private/saas/[id]
├── skills/
│   ├── route.ts               # GET, POST /api/private/skills
│   └── [id]/
│       └── route.ts           # PUT, DELETE /api/private/skills/[id]
├── education/
│   ├── route.ts               # GET, POST /api/private/education
│   └── [id]/
│       └── route.ts           # PUT, DELETE /api/private/education/[id]
├── technologies/
│   ├── route.ts               # GET, POST /api/private/technologies
│   └── [id]/
│       └── route.ts           # PUT, DELETE /api/private/technologies/[id]
├── services/
│   ├── route.ts               # GET, POST /api/private/services
│   └── [id]/
│       └── route.ts           # PUT, DELETE /api/private/services/[id]
└── stats/
    └── count/
        └── route.ts           # GET /api/private/stats/count
```

---

## 4. Endpoints Detallados

### 4.1 Auth — `POST /api/private/admin/login`

Inicia sesión con credenciales de Supabase Auth.

**Request:**

```json
{
  "email": "admin@anthekira.dev",
  "password": "********"
}
```

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "access_token": "eyJ...",
    "refresh_token": "eyJ..."
  }
}
```

**Response `401`:**

```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

**Service Layer:**

```typescript
// backend/src/services/auth.ts
import { loginSchema } from 'shared/src/validators';

export async function login(input: LoginRequest) {
  const validated = loginSchema.parse(input);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: validated.email,
    password: validated.password,
  });

  if (error || !data.session) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // La sesión se establece automáticamente en cookies via @supabase/ssr
  return {
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  };
}
```

---

### 4.2 Personal Info — `GET`, `PUT /api/private/personal-info`

#### `GET` — Obtener información personal completa (incluye CV y redes sociales)

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Anthekira",
    "professional_title": "Full-Stack Developer",
    "bio": "Desarrollador full-stack...",
    "current_status": "Open to work",
    "email": "hello@anthekira.dev",
    "location": "Madrid, España",
    "avatar_url": "https://...",
    "cv_url": "https://...",
    "social_links": {
      "github": "https://github.com/anthekira",
      "linkedin": "https://linkedin.com/in/anthekira",
      "twitter": "",
      "website": ""
    }
  }
}
```

#### `PUT` — Actualizar información personal completa (incluye CV y redes sociales)

**Request (todos los campos son opcionales — merge parcial):**

```json
{
  "name": "Anthekira",
  "professional_title": "Senior Full-Stack Developer",
  "bio": "Nueva biografía...",
  "current_status": "Freelance",
  "email": "hello@anthekira.dev",
  "location": "Madrid, España",
  "avatar_url": "https://...",
  "cv_url": "https://...",
  "social_links": {
    "github": "https://github.com/anthekira",
    "linkedin": "https://linkedin.com/in/anthekira",
    "twitter": null,
    "website": "https://anthekira.dev"
  }
}
```

> **⚠️ Social Links Merge:** El backend debe hacer merge con el JSONB existente. Si un campo se envía como `null`, se elimina del objeto. Si no se envía, se conserva el valor anterior.

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Anthekira",
    "professional_title": "Senior Full-Stack Developer",
    ...
  }
}
```

**Auto-traducción:** Al actualizar `bio`, el backend debe:
1. Guardar bio en español
2. Llamar a DeepL API para traducir a EN y PT
3. Guardar traducciones en `personal_info_translations`

---

### 4.3 Projects — CRUD completo

#### `GET /api/private/projects` — Listar todos los proyectos (incluye borradores)

**Response `200`:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Mi Proyecto",
      "slug": "mi-proyecto",
      "status": "active",
      "skills": [
        { "id": "uuid", "name": "React", "category": "frontend" }
      ],
      "display_order": 0,
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-06-01T00:00:00Z"
    }
  ]
}
```

#### `POST /api/private/projects` — Crear proyecto

**Request:**

```json
{
  "title": "Mi Nuevo Proyecto",
  "description": "Descripción detallada del proyecto...",
  "slug": "mi-nuevo-proyecto",
  "project_url": "https://...",
  "repository_url": "https://github.com/...",
  "image_url": "https://...",
  "status": "active",
  "skill_ids": ["uuid1", "uuid2"],
  "display_order": 0
}
```

**Auto-traducción:** Al crear, el backend:
1. Inserta el proyecto con title/description en español
2. Llama a DeepL API → traduce title y description a EN y PT
3. Inserta traducciones en `project_translations`
4. Asocia skills (insert en `project_skills`)

**Response `201`:**

```json
{
  "success": true,
  "data": { "id": "uuid" }
}
```

#### `PUT /api/private/projects/[id]` — Actualizar proyecto

**Request:** Mismos campos que POST, todos opcionales.

**Auto-traducción:** Si `title` o `description` cambiaron, re-traduce a EN y PT vía DeepL.

**Response `200`:**

```json
{
  "success": true,
  "data": { "id": "uuid" }
}
```

#### `DELETE /api/private/projects/[id]` — Eliminar proyecto

(Cascade elimina traducciones y relaciones N:M automáticamente.)

**Response `200`:**

```json
{
  "success": true,
  "data": { "message": "Project deleted" }
}
```

---

### 4.4 SaaS Projects — CRUD completo

#### `GET /api/private/saas` — Listar todos los SaaS

**Response `200`:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "App Alpha",
      "url": "https://alpha.example.com",
      "status": "live",
      "features": ["Real-time sync", "Multi-tenant"],
      "skills": [ ... ],
      "display_order": 0
    }
  ]
}
```

#### `POST /api/private/saas` — Crear SaaS

**Request:**

```json
{
  "name": "App Alpha",
  "description": "Descripción del SaaS...",
  "url": "https://alpha.example.com",
  "image_url": "https://...",
  "status": "live",
  "features": ["Real-time sync", "Multi-tenant"],
  "skill_ids": ["uuid1"],
  "display_order": 0
}
```

**Auto-traducción:** name + description → EN y PT (igual que projects).

#### `PUT /api/private/saas/[id]` — Actualizar SaaS

Mismos campos que POST, todos opcionales.

#### `DELETE /api/private/saas/[id]` — Eliminar SaaS

Cascade elimina traducciones y relaciones N:M.

---

### 4.5 Skills — CRUD completo

#### `GET /api/private/skills` — Listar todas las skills

**Response `200`:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "React",
      "category": "frontend",
      "display_order": 0
    }
  ]
}
```

#### `POST /api/private/skills` — Crear skill

```json
{
  "name": "React",
  "category": "frontend",
  "display_order": 0
}
```

#### `PUT /api/private/skills/[id]` — Actualizar skill

#### `DELETE /api/private/skills/[id]` — Eliminar skill

> ⚠️ Al eliminar una skill, las relaciones en `project_skills` y `saas_project_skills` se eliminan automáticamente (ON DELETE CASCADE).

---

### 4.6 Education — CRUD completo (sin traducción)

Formación académica. Solo en español, sin auto-traducción DeepL.

#### `GET /api/private/education` — Listar formación

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "institution": "Universidad Politécnica",
      "degree": "Ingeniería en Sistemas",
      "description": "Descripción breve...",
      "website_url": "https://universidad.edu",
      "logo_url": "https://...",
      "display_order": 0
    }
  ]
}
```

#### `POST /api/private/education` — Crear entrada

```json
{
  "institution": "Universidad Politécnica",
  "degree": "Ingeniería en Sistemas",
  "description": "Descripción breve...",
  "website_url": "https://universidad.edu",
  "logo_url": "https://...",
  "display_order": 0
}
```

#### `PUT /api/private/education/[id]` — Actualizar

Mismos campos que POST, todos opcionales.

#### `DELETE /api/private/education/[id]` — Eliminar

---

### 4.7 Technologies — CRUD completo

#### `GET /api/private/technologies` — Listar tecnologías

```json
{
  "success": true,
  "data": [
    { "id": "uuid", "name": "Next.js", "icon_url": "...", "website_url": "https://nextjs.org", "display_order": 0 }
  ]
}
```

#### `POST /api/private/technologies` — Crear tecnología

```json
{ "name": "Next.js", "icon_url": "...", "website_url": "https://nextjs.org", "display_order": 0 }
```

#### `PUT /api/private/technologies/[id]` — Actualizar

#### `DELETE /api/private/technologies/[id]` — Eliminar

---

### 4.8 Services — CRUD completo

#### `GET /api/private/services` — Listar servicios

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Desarrollo Web",
      "description": "Creación de aplicaciones...",
      "icon": "Code",
      "status": "available",
      "display_order": 0,
      "translations": [
        { "locale": "en", "title": "Web Development", "description": "..." }
      ]
    }
  ]
}
```

#### `POST /api/private/services` — Crear servicio

```json
{
  "title": "Desarrollo Web",
  "description": "Creación de aplicaciones web...",
  "icon": "Code",
  "status": "available",
  "display_order": 0
}
```

**Auto-traducción:** title + description → EN y PT (igual que projects).

#### `PUT /api/private/services/[id]` — Actualizar (re-traduce si cambió title/description)

#### `DELETE /api/private/services/[id]` — Eliminar

---

### 4.9 Stats — `GET /api/private/stats/count`

Obtiene el conteo total de proyectos, saas y tecnologías. Usado para las cards de resumen del Dashboard.

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "total_projects": 12,
    "total_saas": 3,
    "total_technologies": 15
  }
}
```

**Service Layer:**

```typescript
// backend/src/services/dashboard.ts
export async function getStatsCount() {
  const [projectsResult, saasResult, techResult] = await Promise.all([
    supabaseAdmin
      .from('projects')
      .select('id', { count: 'exact', head: true }),
    supabaseAdmin
      .from('saas_projects')
      .select('id', { count: 'exact', head: true }),
    supabaseAdmin
      .from('technologies')
      .select('id', { count: 'exact', head: true }),
  ]);

  return {
    total_projects: projectsResult.count ?? 0,
    total_saas: saasResult.count ?? 0,
    total_technologies: techResult.count ?? 0,
  };
}
```

---

## 5. Auto-traducción (DeepL) — Flujo en POST/PUT

Cada endpoint de creación/actualización que tenga contenido traducible debe seguir este flujo después de guardar:

```typescript
// backend/src/services/translations.ts
export async function autoTranslate(
  resourceId: string,
  table: string,          // 'project_translations' | 'service_translations' | etc.
  fkColumn: string,       // 'project_id' | 'service_id' | 'saas_project_id' | 'personal_info_id'
  sourceFields: Record<string, string>,  // { title: "texto en ES", description: "texto en ES" }
) {
  const locales = ['en', 'pt'];

  for (const locale of locales) {
    const translations: Record<string, string> = {};

    for (const [field, text] of Object.entries(sourceFields)) {
      if (!text) continue;
      // Llamar a DeepL API
      const translated = await deeplTranslate(text, 'ES', locale.toUpperCase());
      translations[field] = translated;
    }

    // Upsert: insertar o actualizar si ya existe traducción para ese locale
    await supabaseAdmin
      .from(table)
      .upsert(
        {
          [fkColumn]: resourceId,
          locale,
          ...translations,
        },
        { onConflict: `${fkColumn},locale` }
      );
  }
}
```

### 5.1 Tablas con auto-traducción

| Recurso | Tabla de traducción | FK Column | Campos traducibles |
|---|---|---|---|
| Projects | `project_translations` | `project_id` | `title`, `description` |
| Services | `service_translations` | `service_id` | `title`, `description` |
| SaaS Projects | `saas_project_translations` | `saas_project_id` | `name`, `description` |
| Personal Info | `personal_info_translations` | `personal_info_id` | `bio` |

---

## 6. Códigos de Estado

| Código | Significado | Uso |
|---|---|---|
| `200` | OK | GET, PUT, DELETE exitosos |
| `201` | Created | POST exitoso |
| `400` | Bad Request | Validación Zod fallida |
| `401` | Unauthorized | Token JWT faltante o inválido |
| `404` | Not Found | Recurso no encontrado |
| `409` | Conflict | Slug duplicado, nombre duplicado |
| `500` | Internal Error | Error inesperado del servidor |

---

## 7. Resumen de Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/private/admin/login` | Iniciar sesión |
| `GET` | `/api/private/personal-info` | Obtener info personal completa (incluye CV, redes) |
| `PUT` | `/api/private/personal-info` | Actualizar info personal completa (merge social_links) |
| `GET` | `/api/private/projects` | Listar proyectos |
| `POST` | `/api/private/projects` | Crear proyecto (auto-traducción) |
| `PUT` | `/api/private/projects/[id]` | Actualizar proyecto (re-traducción) |
| `DELETE` | `/api/private/projects/[id]` | Eliminar proyecto (cascade) |
| `GET` | `/api/private/saas` | Listar SaaS |
| `POST` | `/api/private/saas` | Crear SaaS (auto-traducción) |
| `PUT` | `/api/private/saas/[id]` | Actualizar SaaS (re-traducción) |
| `DELETE` | `/api/private/saas/[id]` | Eliminar SaaS (cascade) |
| `GET` | `/api/private/skills` | Listar skills |
| `POST` | `/api/private/skills` | Crear skill |
| `PUT` | `/api/private/skills/[id]` | Actualizar skill |
| `DELETE` | `/api/private/skills/[id]` | Eliminar skill (cascade) |
| `GET` | `/api/private/education` | Listar formación académica |
| `POST` | `/api/private/education` | Crear entrada (sin traducción) |
| `PUT` | `/api/private/education/[id]` | Actualizar entrada |
| `DELETE` | `/api/private/education/[id]` | Eliminar entrada |
| `GET` | `/api/private/technologies` | Listar tecnologías |
| `POST` | `/api/private/technologies` | Crear tecnología |
| `PUT` | `/api/private/technologies/[id]` | Actualizar tecnología |
| `DELETE` | `/api/private/technologies/[id]` | Eliminar tecnología |
| `GET` | `/api/private/services` | Listar servicios |
| `POST` | `/api/private/services` | Crear servicio (auto-traducción) |
| `PUT` | `/api/private/services/[id]` | Actualizar servicio (re-traducción) |
| `DELETE` | `/api/private/services/[id]` | Eliminar servicio (cascade) |
| `GET` | `/api/private/stats/count` | Conteo de proyectos, saas y tecnologías |

---

## 8. Dependencias con otros documentos

| Archivo | Relación |
|---|---|
| `00-REQUIREMENTS.md` | Define las funcionalidades del panel admin |
| `01-ARCHITECTURE.md` | §4.2 Middleware de autenticación para API privada |
| `02-DATABASE.md` | Tablas que estos endpoints modifican |
| `01-ENTITIES.md` | Tipos de request/response y Zod schemas |
| `03-API-PUBLIC.md` | Contraparte pública de solo lectura |
| `03-USER-FLOWS.md` | Flujos de CRUD que estos endpoints implementan |
| `frontend/docs/08-ADMIN-PANEL.md` | Interfaz de usuario que consume estos endpoints |
| `backend/docs/05-AUTHENTICATION.md` | Autenticación JWT y Supabase Auth |
| `backend/docs/06-BUSINESS-LOGIC.md` | Lógica de auto-traducción y utilidades |
