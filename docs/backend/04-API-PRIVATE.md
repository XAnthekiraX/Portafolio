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
| **Middleware** | `src/middleware.ts` protege todas las rutas `/api/private/*` |
| **Cliente DB** | `service_role` key (bypass de RLS para escritura) — excepto login (§4.1) que usa anon key |

### 2.1 Header de Autenticación

```typescript
// Cliente (fetch desde admin panel)
const response = await fetch('/api/private/projects', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
});
```

### 2.2 Middleware de Protección

El middleware de Next.js verifica la sesión antes de que la request llegue al Route Handler:

```typescript
// src/middleware.ts (pseudocódigo)
if (pathname.startsWith('/api/private')) {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }
}
```

### 2.3 Envelope de Respuesta

Todas las respuestas siguen el formato envelope definido en `01-ENTITIES.md` §14:

```typescript
// Éxito
{ "success": true, "data": T }

// Error
{ "success": false, "error": string, "code?: string, "details"?: Record<string, string[]> }
```

---

## 3. Estructura de Archivos

```
src/app/api/private/
├── admin/
│   └── login/
│       └── route.ts           # POST /api/private/admin/login
├── personal-info/
│   └── route.ts               # GET, PUT /api/private/personal-info
├── cv/
│   └── route.ts               # GET, POST, PUT /api/private/cv
├── projects/
│   ├── route.ts               # GET, POST /api/private/projects
│   ├── [id]/
│   │   └── route.ts           # GET, PUT, DELETE /api/private/projects/[id]
│   └── count/
│       └── route.ts           # GET /api/private/projects/count
├── saas/
│   ├── route.ts               # GET, POST /api/private/saas
│   ├── [id]/
│   │   └── route.ts           # GET, PUT, DELETE /api/private/saas/[id]
│   └── count/
│       └── route.ts           # GET /api/private/saas/count
├── skills/
│   ├── route.ts               # GET, POST /api/private/skills
│   └── [id]/
│       └── route.ts           # GET, PUT, DELETE /api/private/skills/[id]
├── education/
│   ├── route.ts               # GET, POST /api/private/education
│   └── [id]/
│       └── route.ts           # GET, PUT, DELETE /api/private/education/[id]
├── technologies/
│   ├── route.ts               # GET, POST /api/private/technologies
│   └── [id]/
│       └── route.ts           # GET, PUT, DELETE /api/private/technologies/[id]
├── services/
│   ├── route.ts               # GET, POST /api/private/services
│   └── [id]/
│       └── route.ts           # GET, PUT, DELETE /api/private/services/[id]
├── media/
│   ├── route.ts               # GET /api/private/media
│   ├── upload/
│   │   └── route.ts           # POST /api/private/media/upload
│   └── [id]/
│       └── route.ts           # GET, DELETE /api/private/media/[id]
├── messages/
│   ├── route.ts               # GET /api/private/messages
│   ├── [id]/
│   │   └── route.ts           # GET, DELETE /api/private/messages/[id]
│   └── count/
│       └── route.ts           # GET /api/private/messages/count
├── settings/
│   └── route.ts               # GET, PUT /api/private/settings
└── active/
    └── count/
        └── route.ts           # GET /api/private/active/count
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
// src/services/auth.ts
import { loginSchema } from '@/lib/validation';

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

#### `GET` — Obtener información personal

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
    "location": "Ciudad, País",
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

#### `PUT` — Actualizar información personal

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

### 4.3 CV — `GET`, `POST`, `PUT /api/private/cv`

#### `GET` — Obtener URL del CV actual

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "url": "https://...anthekira-cv.pdf",
    "file_name": "anthekira-cv.pdf"
  }
}
```

**Response `200` (sin CV):**

```json
{
  "success": true,
  "data": {
    "url": "",
    "file_name": ""
  }
}
```

#### `POST` / `PUT` — Subir o reemplazar CV

Ambos usan `multipart/form-data`:

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `file` | File | Sí | PDF, max 10MB |

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "url": "https://...anthekira-cv.pdf",
    "file_name": "anthekira-cv.pdf"
  }
}
```

**Service Layer:**

```typescript
// src/services/cv.ts
export async function uploadCv(file: File, userId: string) {
  // 1. Validar tipo y tamaño
  if (file.type !== 'application/pdf') throw new ValidationError('Only PDF files allowed');
  if (file.size > 10 * 1024 * 1024) throw new ValidationError('File exceeds 10MB limit');

  // 2. Subir a Supabase Storage (bucket: cv)
  const { data: storageData, error: uploadError } = await supabaseAdmin
    .storage
    .from('cv')
    .upload('anthekira-cv.pdf', file, { upsert: true });

  // 3. Obtener URL pública
  const { data: { publicUrl } } = supabaseAdmin
    .storage
    .from('cv')
    .getPublicUrl('anthekira-cv.pdf');

  // 4. Actualizar personal_info.cv_url
  await supabaseAdmin
    .from('personal_info')
    .update({ cv_url: publicUrl })
    .eq('user_id', userId);

  return { url: publicUrl, file_name: 'anthekira-cv.pdf' };
}
```

---

### 4.4 Projects — CRUD completo

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

#### `GET /api/private/projects/[id]` — Obtener proyecto con traducciones

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Mi Proyecto",
    "description": "Descripción en español...",
    "slug": "mi-proyecto",
    "project_url": "https://...",
    "repository_url": "https://...",
    "image_url": "https://...",
    "status": "active",
    "display_order": 0,
    "skills": [ ... ],
    "translations": [
      { "locale": "en", "title": "My Project", "description": "..." },
      { "locale": "pt", "title": "Meu Projeto", "description": "..." }
    ]
  }
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

#### `GET /api/private/projects/count` — Contar proyectos

**Response `200`:**

```json
{
  "success": true,
  "data": { "count": 12 }
}
```

---

### 4.5 SaaS Projects — CRUD completo

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

#### `GET /api/private/saas/count` — Contar SaaS

```json
{ "success": true, "data": { "count": 3 } }
```

---

### 4.6 Skills — CRUD completo

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

### 4.7 Education — CRUD completo (sin traducción)

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

### 4.8 Technologies — CRUD completo

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

### 4.9 Services — CRUD completo

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

### 4.10 Media — Gestión de archivos

#### `GET /api/private/media` — Listar archivos

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "file_name": "project-hero.webp",
      "file_size": 204800,
      "mime_type": "image/webp",
      "bucket": "media",
      "public_url": "https://...",
      "width": 1920,
      "height": 1080,
      "alt_text": "Hero image del proyecto",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

#### `POST /api/private/media/upload` — Subir archivo

**Tipo:** `multipart/form-data`

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `file` | File | Sí | JPG, PNG, WebP o PDF |
| `bucket` | string | No | `profile`, `projects`, `media`, `cv` (default: `media`) |
| `alt_text` | string | No | Texto alternativo (solo imágenes) |

**Validación:**

| Bucket | Tipos permitidos | Tamaño máximo |
|---|---|---|
| `profile` | JPG, PNG, WebP | 2 MB |
| `projects` | JPG, PNG, WebP | 5 MB |
| `media` | JPG, PNG, WebP, PDF | 5 MB |
| `cv` | PDF | 10 MB |

**Flujo:**
1. Validar tipo y tamaño
2. Generar nombre único: `{uuid}.{extension}`
3. Subir a Supabase Storage
4. Insertar registro en tabla `media`
5. Devolver `public_url`

**Response `201`:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "public_url": "https://...",
    "file_name": "project-hero.webp"
  }
}
```

#### `GET /api/private/media/[id]` — Obtener detalle de archivo

#### `DELETE /api/private/media/[id]` — Eliminar archivo

> ⚠️ Elimina tanto el registro en BD como el archivo en Supabase Storage.

---

### 4.11 Messages — Bandeja de mensajes

#### `GET /api/private/messages` — Listar mensajes

**Query params:**

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `is_read` | boolean | — | Filtrar por leído/no leído |
| `order` | string | `desc` | `asc` o `desc` por `created_at` |

**Response `200`:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "subject": "Consulta sobre servicios",
      "is_read": false,
      "created_at": "2025-06-01T10:00:00Z"
    }
  ]
}
```

> La lista incluye `subject` pero NO `message` completo (solo en detalle).

#### `GET /api/private/messages/[id]` — Detalle del mensaje (incluye `message` completo)

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "subject": "Consulta sobre servicios",
    "message": "Hola, me interesaría contratar...",
    "is_read": false,
    "created_at": "2025-06-01T10:00:00Z"
  }
}
```

> Al acceder al detalle, marcar `is_read = true` automáticamente.

#### `DELETE /api/private/messages/[id]` — Eliminar mensaje

#### `GET /api/private/messages/count` — Contar mensajes no leídos

```json
{ "success": true, "data": { "count": 5 } }
```

---

### 4.12 Settings — Configuración del sitio

#### `GET /api/private/settings` — Obtener configuración

```json
{
  "success": true,
  "data": {
    "site_name": "Anthekira.dev",
    "site_description": "Portfolio personal...",
    "ga_id": "G-XXXXXXXXXX"
  }
}
```

#### `PUT /api/private/settings` — Actualizar configuración

```json
{
  "site_name": "Anthekira.dev",
  "site_description": "Nueva descripción...",
  "ga_id": "G-XXXXXXXXXX"
}
```

**Validación (Zod):**

| Campo | Regla |
|---|---|
| `ga_id` | Regex `/^G-[A-Z0-9]+$/` o string vacío |

---

### 4.13 Dashboard — Endpoints de conteo

#### `GET /api/private/active/count` — Contar proyectos activos (regulares + SaaS)

```typescript
// src/services/dashboard.ts
export async function getActiveCount() {
  const { data: projectCount } = await supabaseAdmin
    .from('projects')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'active');

  const { data: saasCount } = await supabaseAdmin
    .from('saas_projects')
    .select('id', { count: 'exact', head: true })
    // SaaS activos: todos excepto 'planning'
    .not('status', 'eq', 'planning');

  return {
    count: (projectCount?.count ?? 0) + (saasCount?.count ?? 0),
  };
}
```

**Response `200`:**

```json
{ "success": true, "data": { "count": 8 } }
```

---

## 5. Auto-traducción (DeepL) — Flujo en POST/PUT

Cada endpoint de creación/actualización que tenga contenido traducible debe seguir este flujo después de guardar:

```typescript
// src/services/translations.ts
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
      .upsert({
        [fkColumn]: resourceId,
        locale,
        ...translations,
      }, { onConflict: `${fkColumn},locale` });
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
| `413` | Payload Too Large | Archivo excede tamaño máximo |
| `415` | Unsupported Media Type | Tipo de archivo no permitido |
| `500` | Internal Error | Error inesperado del servidor |

---

## 7. Resumen de Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/private/admin/login` | Iniciar sesión |
| `GET` | `/api/private/personal-info` | Obtener info personal |
| `PUT` | `/api/private/personal-info` | Actualizar info personal (merge social_links) || `GET`  | `/api/private/cv`              | Obtener URL del CV |
| `POST` | `/api/private/cv`              | Subir CV |
| `PUT`  | `/api/private/cv`              | Reemplazar CV |
| `GET` | `/api/private/projects` | Listar proyectos |
| `GET` | `/api/private/projects/[id]` | Detalle de proyecto |
| `POST` | `/api/private/projects` | Crear proyecto (auto-traducción) |
| `PUT` | `/api/private/projects/[id]` | Actualizar proyecto (re-traducción) |
| `DELETE` | `/api/private/projects/[id]` | Eliminar proyecto (cascade) |
| `GET` | `/api/private/projects/count` | Contar proyectos |
| `GET` | `/api/private/saas` | Listar SaaS |
| `GET` | `/api/private/saas/[id]` | Detalle de SaaS |
| `POST` | `/api/private/saas` | Crear SaaS (auto-traducción) |
| `PUT` | `/api/private/saas/[id]` | Actualizar SaaS (re-traducción) |
| `DELETE` | `/api/private/saas/[id]` | Eliminar SaaS (cascade) |
| `GET` | `/api/private/saas/count` | Contar SaaS |
| `GET` | `/api/private/skills` | Listar skills |
| `GET` | `/api/private/skills/[id]` | Detalle de skill |
| `POST` | `/api/private/skills` | Crear skill |
| `PUT` | `/api/private/skills/[id]` | Actualizar skill |
| `DELETE` | `/api/private/skills/[id]` | Eliminar skill (cascade) |
| `GET` | `/api/private/education` | Listar formación académica |
| `GET` | `/api/private/education/[id]` | Detalle de formación |
| `POST` | `/api/private/education` | Crear entrada (sin traducción) |
| `PUT` | `/api/private/education/[id]` | Actualizar entrada |
| `DELETE` | `/api/private/education/[id]` | Eliminar entrada |
| `GET` | `/api/private/technologies` | Listar tecnologías |
| `GET` | `/api/private/technologies/[id]` | Detalle de tecnología |
| `POST` | `/api/private/technologies` | Crear tecnología |
| `PUT` | `/api/private/technologies/[id]` | Actualizar tecnología |
| `DELETE` | `/api/private/technologies/[id]` | Eliminar tecnología |
| `GET` | `/api/private/services` | Listar servicios |
| `GET` | `/api/private/services/[id]` | Detalle de servicio |
| `POST` | `/api/private/services` | Crear servicio (auto-traducción) |
| `PUT` | `/api/private/services/[id]` | Actualizar servicio (re-traducción) |
| `DELETE` | `/api/private/services/[id]` | Eliminar servicio (cascade) |
| `GET` | `/api/private/media` | Listar archivos |
| `GET` | `/api/private/media/[id]` | Detalle de archivo |
| `POST` | `/api/private/media/upload` | Subir archivo (multipart) |
| `DELETE` | `/api/private/media/[id]` | Eliminar archivo (BD + Storage) |
| `GET` | `/api/private/messages` | Listar mensajes |
| `GET` | `/api/private/messages/[id]` | Detalle de mensaje (marca como leído) |
| `DELETE` | `/api/private/messages/[id]` | Eliminar mensaje |
| `GET` | `/api/private/messages/count` | Contar mensajes no leídos |
| `GET` | `/api/private/settings` | Obtener configuración |
| `PUT` | `/api/private/settings` | Actualizar configuración |
| `GET` | `/api/private/active/count` | Contar proyectos activos (regulares + SaaS) |

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
| `frontend/08-ADMIN-PANEL.md` | Interfaz de usuario que consume estos endpoints |
| `backend/05-AUTHENTICATION.md` | Autenticación JWT y Supabase Auth |
| `backend/06-BUSINESS-LOGIC.md` | Lógica de auto-traducción y utilidades |
