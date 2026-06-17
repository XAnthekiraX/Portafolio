# 03-API-PUBLIC.md — Anthekira.dev

## 1. General
**Base:** `/api/public` — **Auth:** ❌ — **CORS:** ✅ — **Envelope:** `{ success: true, data: T }` / `{ success: false, error: string }`

> **ADR-005:** Landing Page consulta Supabase directo. Estos endpoints existen para consumo externo.

## 2. Endpoints
| Método | Ruta | Descripción | Caché |
|---|---|---|---|
| GET | `/api/public/personal-info` | Info personal + bio traducida | ISR 5 min |
| GET | `/api/public/projects` | Proyectos activos + traducciones | ISR 5 min |
| GET | `/api/public/skills` | Skills agrupadas por categoría | ISR 30 min |
| GET | `/api/public/education` | Formación académica | ISR 30 min |
| GET | `/api/public/technologies` | Tecnologías | ISR 30 min |
| GET | `/api/public/services` | Servicios + traducciones | ISR 5 min |
| POST | `/api/public/contact` | Enviar mensaje de contacto | Sin caché |

**Query param opcional:** `?locale=en|pt` (default: es) — aplica en endpoints con traducciones.

## 3. Detalles por Endpoint

### GET /api/public/personal-info
```json
{ "success": true, "data": { "name": "Anthekira", "professional_title": "Full-Stack Developer", "bio": "...", "avatar_url": "...", "cv_url": "...", "social_links": { "github": "...", "linkedin": "..." }, "current_status": "Open to work", "location": "..." } }
```
Traducción: busca `entity_translations` donde `entity_type='personal_info'`, `locale = ?locale` y `translation_status = 'completed'`. Fallback a ES.

### GET /api/public/projects
Filtra `status = 'active'`. JOIN `entity_translations` (entity_type='project') + `project_skills`. Orden por `display_order`.  
**Query param:** `?type=project|saas` (opcional, filtra por tipo).

**Nota:** El endpoint unifica projects y saas en una sola respuesta. El campo `type` indica si es proyecto regular o SaaS.

### GET /api/public/skills
Retorna agrupado por categoría: `{ frontend: [...], backend: [...], devops: [...], tools: [...], other: [...] }`.

### POST /api/public/contact
**Request:** `{ name (min:2), email (valid), subject (min:3), message (min:10) }`  
**Validation:** Zod schema → 400 con detalles por campo.  
**Response 201:** `{ success: true, data: { message: "Message sent successfully" } }`  
**Rate limiting:** 3 requests/hora por IP (ver ADR-015). Si se excede, respuesta 429.

## 4. Traducciones en API Pública
```typescript
// Helper: aplicar traducción con fallback a ES
function applyTranslation(item, translations, locale, fields) {
  if (!translations || locale === 'es') return item;
  const t = translations.find(t => t.locale === locale && t.translation_status === 'completed');
  if (!t) return item; // fallback ES
  const result = { ...item };
  for (const field of fields) if (t.content?.[field]) result[field] = t.content[field];
  return result;
}
```

## 5. Códigos de Estado
| 200 | OK | GET exitoso |
|---|---|---|
| 201 | Created | POST contacto exitoso |
| 400 | Bad Request | Validación Zod fallida |
| 404 | Not Found | Recurso no existe |
| 500 | Internal Error | Error inesperado |
