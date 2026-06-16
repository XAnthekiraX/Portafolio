# 03-API-PUBLIC.md — Anthekira.dev — API Pública

## 1. Propósito

Este documento define todos los **endpoints públicos** de Anthekira.dev. La API pública es de solo lectura (GET) con una excepción: el endpoint de contacto (POST).

> **Nota:** Por decisión arquitectónica (ADR-005), los Server Components de la Landing Page consultan Supabase **directamente**, no a través de estas API Routes. Estos endpoints existen para: consumo externo, futuras integraciones, y el formulario de contacto (POST).

---

## 2. Base URL y Formato

| Propiedad | Valor |
|---|---|
| **Base URL** | `https://anthekira.dev/api/public` |
| **Content-Type** | `application/json` |
| **Autenticación** | ❌ Ninguna (acceso público) |
| **CORS** | Habilitado (permitir acceso desde cualquier origen) |

### 2.1 Envelope de Respuesta

Todas las respuestas siguen el formato envelope definido en `01-ENTITIES.md` §14:

```typescript
// Éxito
{ "success": true, "data": T }

// Error
{ "success": false, "error": string }
```

---

## 3. Estructura de Archivos

```
frontend/src/app/api/public/
├── personal-info/
│   └── route.ts           # GET /api/public/personal-info
├── projects/
│   └── route.ts           # GET /api/public/projects
├── skills/
│   └── route.ts           # GET /api/public/skills
├── education/
│   └── route.ts           # GET /api/public/education
├── technologies/
│   └── route.ts           # GET /api/public/technologies
├── services/
│   └── route.ts           # GET /api/public/services
├── saas/
│   └── route.ts           # GET /api/public/saas
└── contact/
    └── route.ts           # POST /api/public/contact
```

---

## 4. Endpoints Detallados

### 4.1 `GET /api/public/personal-info`

Obtiene la información personal del administrador, con soporte de traducción para la biografía.

**Query params:**

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `locale` | `string` | `es` | Idioma para la bio (`es`, `en`, `pt`) |

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "name": "Anthekira",
    "professional_title": "Full-Stack Developer",
    "bio": "Desarrollador full-stack...",  // Traducido según locale, fallback a ES
    "current_status": "Open to work",
    "email": "hello@anthekira.dev",
    "location": "Ciudad, País",
    "avatar_url": "https://...",
    "cv_url": "https://...",
    "social_links": {
      "github": "https://github.com/anthekira",
      "linkedin": "https://linkedin.com/in/anthekira"
    }
  }
}
```

**Caché:** `stale-while-revalidate` (ISR cada 5 minutos).

**Service Layer:**
```typescript
// backend/src/services/personal-info.ts
async function getPersonalInfo(locale: string = 'es') {
  const { data } = await supabase
    .from('personal_info')
    .select(`
      *,
      personal_info_translations!left(bio, locale)
    `)
    .limit(1)
    .single();

  // Aplicar traducción de la bio según locale
  if (locale !== 'es' && data?.personal_info_translations) {
    const translation = data.personal_info_translations
      .find(t => t.locale === locale);
    if (translation?.bio) {
      data.bio = translation.bio;
    }
  }

  delete data.personal_info_translations; // Limpiar joined data
  return data;
}
```

---

### 4.2 `GET /api/public/projects`

Lista todos los proyectos activos, ordenados por `display_order`.

**Query params:**

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `locale` | `string` | `es` | Idioma para traducciones (`es`, `en`, `pt`) |
| `limit` | `number` | `50` | Máximo de proyectos a retornar |

**Response `200`:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Mi Proyecto",
      "description": "Descripción del proyecto...",
      "slug": "mi-proyecto",
      "project_url": "https://...",
      "repository_url": "https://...",
      "image_url": "https://...",
      "status": "active",
      "skills": [
        { "id": "uuid", "name": "React", "category": "frontend" }
      ],
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

**Query SQL (con fallback de traducción):**

```typescript
// backend/src/services/projects.ts
async function getPublicProjects(locale: string = 'es') {
  const { data } = await supabase
    .from('projects')
    .select(`
      id, slug, project_url, repository_url, image_url,
      status, display_order, created_at,
      title, description,  -- Fallback ES
      project_translations!left(
        title, description, locale
      ),
      project_skills!inner(
        skills(id, name, category)
      )
    `)
    .eq('status', 'active')
    .order('display_order');
  // Post-processing: aplicar traducción según locale
  return applyTranslations(data, locale);
}
```

**Caché:** `stale-while-revalidate` (ISR cada 5 minutos).

---
### 4.3 `GET /api/public/skills`

Lista todas las skills agrupadas por categoría.

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "frontend": [
      { "id": "uuid", "name": "React", "display_order": 0 },
      { "id": "uuid", "name": "TypeScript", "display_order": 1 }
    ],
    "backend": [
      { "id": "uuid", "name": "Node.js", "display_order": 0 }
    ],
    "devops": [],
    "tools": [
      { "id": "uuid", "name": "Git", "display_order": 0 }
    ],
    "other": []
  }
}
```

**Service Layer:**

```typescript
async function getSkillsGrouped() {
  const { data } = await supabase
    .from('skills')
    .select('*')
    .order('display_order');

  // Agrupar por categoría
  return groupBy(data, 'category');
}
```

**Caché:** `stale-while-revalidate` (ISR cada 30 minutos — las skills cambian poco).

---

### 4.4 `GET /api/public/education`

Lista la formación académica, ordenada por `display_order`.

**Response `200`:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "institution": "Universidad Politécnica",
      "degree": "Ingeniería en Sistemas",
      "description": "Descripción breve de la formación...",
      "website_url": "https://universidad.edu",
      "logo_url": "https://...",
      "display_order": 0
    }
  ]
}
```

**Service Layer:**

```typescript
async function getEducation() {
  const { data } = await supabase
    .from('education')
    .select('*')
    .order('display_order');
  return data;
}
```

**Caché:** `stale-while-revalidate` (ISR cada 30 minutos).

---

### 4.5 `GET /api/public/technologies`

Lista todas las tecnologías.

**Response `200`:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Next.js",
      "icon_url": "https://...",
      "website_url": "https://nextjs.org"
    }
  ]
}
```

**Service Layer:**

```typescript
async function getTechnologies() {
  const { data } = await supabase
    .from('technologies')
    .select('*')
    .order('display_order');
  return data;
}
```

---

### 4.6 `GET /api/public/services`

Lista todos los servicios disponibles.

**Query params:**

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `locale` | `string` | `es` | Idioma para traducciones |

**Response `200`:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Desarrollo Web",
      "description": "Creación de aplicaciones web...",
      "icon": "Code",
      "status": "available",
      "display_order": 0
    }
  ]
}
```

**Service Layer:**

```typescript
async function getPublicServices(locale: string = 'es') {
  // Similar a projects: JOIN con service_translations y fallback a ES
}
```

---

### 4.7 `GET /api/public/saas`

Lista todos los proyectos SaaS.

**Query params:**

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `locale` | `string` | `es` | Idioma para traducciones |

**Response `200`:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "App Alpha",
      "description": "Descripción del SaaS...",
      "url": "https://alpha.example.com",
      "image_url": "https://...",
      "status": "live",
      "features": ["Real-time sync", "Multi-tenant"],
      "skills": [ ... ]
    }
  ]
}
```

---

### 4.8 `POST /api/public/contact`

Envía un mensaje de contacto.

**Request:**

```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "subject": "Consulta sobre servicios",
  "message": "Hola, me interesaría contratar tus servicios de desarrollo web para mi proyecto."
}
```

**Validación (Zod):**

| Campo | Regla |
|---|---|
| `name` | `string`, min 2, max 100 |
| `email` | `email` válido |
| `subject` | `string`, min 3, max 200 |
| `message` | `string`, min 10, max 5000 |

**Response `201`:**

```json
{
  "success": true,
  "data": {
    "message": "Message sent successfully. I'll get back to you soon."
  }
}
```

**Response `400` (validación):**

```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "email": ["Invalid email format"],
    "message": ["Message must be at least 10 characters"]
  }
}
```

**Service Layer:**

```typescript
// src/services/contact.ts
import { createContactMessageSchema } from '@/lib/validation';

async function submitContactMessage(input: CreateContactMessageDto) {
  // 1. Validar input
  const validated = createContactMessageSchema.parse(input);

  // 2. Insertar en BD
  const { data, error } = await supabase
    .from('contact_messages')
    .insert({
      name: validated.name,
      email: validated.email,
      subject: validated.subject,
      message: validated.message,
    })
    .select()
    .single();

  if (error) throw new InternalError('Failed to save message');
  return data;
}
```

**Rate Limiting:** No implementado en V1 (opcional: 1 mensaje por minuto por IP).

---

## 5. Implementación de Traducciones (Locale)

### 5.1 Helper para aplicar traducciones con fallback

```typescript
// backend/src/lib/i18n.ts
type TranslatableField = 'title' | 'description' | 'name' | 'bio';

function applyTranslation<T extends Record<string, any>>(
  item: T,
  translations: Array<{ locale: string; [key: string]: any }>,
  locale: string,
  fields: TranslatableField[]
): T {
  const translation = translations.find(t => t.locale === locale);
  if (!translation) return item; // Fallback a ES

  const result = { ...item };
  for (const field of fields) {
    if (translation[field]) {
      result[field] = translation[field];
    }
  }
  return result;
}
```

### 5.2 Locale desde Query Params

```typescript
// En cada Route Handler público
function getLocaleFromRequest(request: NextRequest): string {
  const locale = request.nextUrl.searchParams.get('locale') || 'es';
  return ['es', 'en', 'pt'].includes(locale) ? locale : 'es';
}
```

---

## 6. Caché y Rendimiento

| Endpoint | Estrategia de caché | TTL sugerido |
|---|---|---|
| `GET /personal-info` | ISR (`revalidate` en fetch) | 5 minutos |
| `GET /projects` | ISR | 5 minutos |
| `GET /skills` | ISR | 30 minutos |
| `GET /education` | ISR | 30 minutos |
| `GET /technologies` | ISR | 30 minutos |
| `GET /services` | ISR | 5 minutos |
| `GET /saas` | ISR | 5 minutos |
| `POST /contact` | Sin caché | — |

> Los Server Components de la Landing Page (que consultan Supabase directamente) pueden usar `revalidate` en el fetch o `cache: 'force-cache'` para datos estáticos.

---

## 7. Manejo de Errores

```typescript
// frontend/src/app/api/public/contact/route.ts — Ejemplo de estructura
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await submitContactMessage(body);
    return NextResponse.json(
      { success: true, data: { message: 'Message sent successfully' } },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: formatZodErrors(error),
        },
        { status: 400 }
      );
    }
    // Error interno no esperado
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 7.1 Códigos de Estado

| Código | Significado | Uso |
|---|---|---|
| `200` | OK | GET exitoso |
| `201` | Created | POST contacto exitoso |
| `400` | Bad Request | Validación fallida |
| `404` | Not Found | Recurso no encontrado |
| `429` | Too Many Requests | Rate limiting (futuro) |
| `500` | Internal Error | Error inesperado del servidor |

---

## 8. Resumen de Endpoints

| Método | Ruta | Descripción | Auth | Cache |
|---|---|---|---|---|
| `GET` | `/api/public/personal-info` | Información personal | ❌ | 5 min |
| `GET` | `/api/public/projects` | Proyectos activos | ❌ | 5 min |
| `GET` | `/api/public/skills` | Skills agrupadas | ❌ | 30 min |
| `GET` | `/api/public/education` | Formación académica | ❌ | 30 min |
| `GET` | `/api/public/technologies` | Tecnologías | ❌ | 30 min |
| `GET` | `/api/public/services` | Servicios | ❌ | 5 min |
| `GET` | `/api/public/saas` | Proyectos SaaS | ❌ | 5 min |
| `POST` | `/api/public/contact` | Enviar mensaje | ❌ | — |

---

## 9. Dependencias con otros documentos

| Archivo | Relación |
|---|---|
| `00-REQUIREMENTS.md` | Define las funcionalidades que estos endpoints exponen |
| `01-ARCHITECTURE.md` | §4.1 Estructura de `/api` y §5 Client/Server data fetching |
| `02-DATABASE.md` | Tablas que estos endpoints consultan |
| `01-ENTITIES.md` | Tipos de request/response y Zod schemas |
| `03-USER-FLOWS.md` | Flujos de usuario que consumen estos endpoints |
| `backend/docs/04-API-PRIVATE.md` | Endpoints privados (contraparte de estos) |
| `backend/docs/06-BUSINESS-LOGIC.md` | Lógica de auto-traducción y utilidades compartidas |
