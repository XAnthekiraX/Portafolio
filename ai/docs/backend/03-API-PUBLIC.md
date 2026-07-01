---
doc_id: backend-api-public
version: 1.0.0
last_updated: 2026-07-01
owner: Anthekira
type: api-reference
dependencies: [backend-overview, entities, database]
tags: [api, public, get, post, locale, cache, isr]
ai_context:
  primary_use: Reference for all public API endpoints (GET + POST contact)
  key_constraints: [no auth required, CORS enabled, ISR caching 5-30 min, rate limiting on contact]
  target_audience: Frontend developers, external consumers, AI agents
---

# API Pública — Anthekira.dev

## 📋 Contexto

**Propósito:** Endpoints públicos para consumo externo de datos del portafolio.  
**Cuándo usarlo:** Al consumir datos del portafolio desde clientes externos o landing page.  
**Problemas que resuelve:** Centraliza endpoints de solo lectura + contacto con caché ISR.

> **ADR-005:** Landing Page consulta Supabase directo. Estos endpoints existen para consumo externo.

## 🏗️ Configuración General

| Aspecto | Valor |
|---------|-------|
| Base | `/api/public` |
| Auth | ❌ No requerida |
| CORS | ✅ Habilitado |
| Locale | `?locale=en\|pt` (default: `es`) |
| Envelope | `{ success: true, data: T }` / `{ success: false, error: string }` |

## 🔌 Endpoints

### GET /api/public/personal-info

**Metadata:** `public-personal-info-get` · v1.0.0 · Categoría: Información Personal · Caché: ISR 5 min

**Query:**
- `locale` (string, opcional, enum: `es|en|pt`, default: `es`) — Idioma para traducciones

**Response Schema (200):**
```typescript
{
  success: boolean;
  data: {
    id: string;
    name: string;
    professional_title: string | null;
    bio: string | null;
    avatar_url: string | null;
    cv_url: string | null;
    social_links: SocialLinks | null;
    current_status: string | null;
    location: string | null;
  };
}
```

> Ver `SocialLinks` en `01-ENTITIES.md`.

**Business Logic:**
1. Consulta `personal_info` table
2. Busca `entity_translations` donde `entity_type='personal_info'`, `locale=?locale`, `translation_status='completed'`
3. `bio` se obtiene con COALESCE: traducción si existe, fallback al contenido en español
4. Retorna 404 si no existe registro de personal_info

**Error Handling:** `404` (no existe registro) · `500` (error inesperado)

---

### GET /api/public/projects

**Metadata:** `public-projects-get` · v1.0.0 · Categoría: Proyectos · Caché: ISR 5 min

**Query:**
- `locale` (string, opcional, enum: `es|en|pt`, default: `es`) — Idioma para traducciones
- `type` (string, opcional, enum: `project|saas`) — Filtra por tipo

**Response Schema (200):**
```typescript
{
  success: boolean;
  data: Array<{
    id: string;
    slug: string;
    title: string;
    description: string;
    type: 'project' | 'saas';
    status: 'active';
    image_url: string | null;
    repository_url: string | null;    // Link al repositorio (project y saas)
    url: string | null;               // Link al sitio vivo (solo si type='saas')
    features: string[] | null;        // Solo si type='saas'
    display_order: number;
    skills: Array<{ id: string; name: string }>;
  }>;
}
```

**Business Logic:**
1. Filtra `projects` donde `status='active'`
2. Left JOIN `entity_translations` (entity_type='project', locale=?locale, translation_status='completed')
3. JOIN `project_skills` + `skills` para obtener `skills[]`
4. `title` y `description` se obtienen con COALESCE desde traducciones, fallback a español
5. Ordena por `display_order`
6. Aplica filtro `type` si se especifica

**Nota:** Unifica projects y saas. Campo `type` indica el tipo. `repository_url` aplica para ambos tipos (link al código). `url` aplica solo si `type='saas'` (link al sitio desplegado).

**Error Handling:** `200` con array vacío si no hay proyectos · `500` (error inesperado)

---

### GET /api/public/skills

**Metadata:** `public-skills-get` · v1.0.0 · Categoría: Habilidades · Caché: ISR 30 min

**Response Schema (200):**
```typescript
{
  success: boolean;
  data: {
    frontend: Array<{ id: string; name: string; category: string }>;
    backend: Array<{ id: string; name: string; category: string }>;
    devops: Array<{ id: string; name: string; category: string }>;
    tools: Array<{ id: string; name: string; category: string }>;
    other: Array<{ id: string; name: string; category: string }>;
  };
}
```

**Business Logic:**
1. Consulta `skills` table
2. Agrupa por campo `category`

**Error Handling:** `500` (error inesperado)

---

### GET /api/public/education

**Metadata:** `public-education-get` · v1.0.0 · Categoría: Formación Académica · Caché: ISR 30 min

**Response Schema (200):**
```typescript
{
  success: boolean;
  data: Array<{
    id: string;
    institution: string;
    degree: string;
    description: string | null;
    website_url: string | null;
    logo_url: string | null;
  }>;
}
```

**Business Logic:** Consulta `education` table

**Error Handling:** `200` con array vacío si no hay registros · `500` (error inesperado)

---

### GET /api/public/technologies

**Metadata:** `public-technologies-get` · v1.0.0 · Categoría: Tecnologías · Caché: ISR 30 min

**Response Schema (200):**
```typescript
{
  success: boolean;
  data: Array<{
    id: string;
    name: string;
    icon_url: string | null;
    website_url: string | null;
    display_order: number;
  }>;
}
```

**Business Logic:** Consulta `technologies` table · Ordena por `display_order` ascendente

**Error Handling:** `200` con array vacío si no hay registros · `500` (error inesperado)

---

### GET /api/public/services

**Metadata:** `public-services-get` · v1.0.0 · Categoría: Servicios · Caché: ISR 5 min

**Query:**
- `locale` (string, opcional, enum: `es|en|pt`, default: `es`) — Idioma para traducciones

**Response Schema (200):**
```typescript
{
  success: boolean;
  data: Array<{
    id: string;
    title: string;
    description: string;
    icon: string | null;
    status: ServiceStatus;
    display_order: number;
  }>;
}
```

**Business Logic:**
1. Consulta `services` table
2. Left JOIN `entity_translations` (entity_type='service', locale=?locale, translation_status='completed')
3. `title` y `description` se obtienen con COALESCE desde traducciones, fallback a español
4. Ordena por `display_order` ascendente

**Error Handling:** `200` con array vacío si no hay servicios · `500` (error inesperado)

---

### POST /api/public/contact

**Metadata:** `public-contact-post` · v1.0.0 · Categoría: Contacto · Caché: ❌ · Rate Limit: 3/hora por IP (ADR-015)

**Request Schema:**
```typescript
{
  name: string;      // min: 2
  email: string;     // formato email válido
  subject: string;   // min: 3
  message: string;   // min: 10
}
```

**Response Schema (201):**
```typescript
{ success: boolean; data: { message: string } }
```

**Business Logic:**
1. Valida request con Zod schema
2. Aplica rate limiting por IP (3/hora)
3. Inserta en `contact_messages` table
4. Retorna confirmación

**Error Handling:** `400` (validación fallida) · `429` (rate limiting excedido) · `500` (error inesperado)

---

## 📊 Códigos de Estado

| Código | Nombre | Descripción |
|--------|--------|-------------|
| 200 | OK | GET exitoso |
| 201 | Created | POST contacto exitoso |
| 400 | Bad Request | Validación Zod fallida |
| 404 | Not Found | Recurso no existe |
| 429 | Too Many Requests | Rate limiting excedido |
| 500 | Internal Error | Error inesperado |

## 💡 Helper de Traducciones

```typescript
function applyTranslation(item: any, translations: any[], locale: string, fields: string[]) {
  if (!translations || locale === 'es') return item;
  const t = translations.find(t => t.locale === locale && t.translation_status === 'completed');
  if (!t) return item; // fallback ES
  const result = { ...item };
  for (const field of fields) if (t.content?.[field]) result[field] = t.content[field];
  return result;
}
```

## 🚫 Restricciones

- NO exponer endpoints internos al público
- SIempre validar locale en query params
- SIempre usar fallback a español en traducciones
