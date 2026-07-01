---
doc_id: frontend-cms
version: 1.0.0
last_updated: 2026-07-01
owner: Anthekira
type: guide
dependencies: [frontend-admin, backend-entities, backend-database]
tags: [frontend, cms, supabase, deepl, storage, data-fetching, csrf]
ai_context:
  primary_use: CMS data flow, Supabase clients, data fetching patterns, auto-translation, file upload
  key_constraints: [SC reads Supabase direct, CC uses fetch with CSRF, DeepL parallel translation, service_role for admin]
  target_audience: Frontend developers, AI agents implementing CMS integration
---

# 09-CMS-INTEGRATION.md — Anthekira.dev

## 1. Arquitectura
```
Landing Page (SC):     Server Component → @supabase/ssr (anon) → PostgreSQL (SELECT público)
Panel Admin (CC):      Client Component → fetch() + CSRF header → API Route genérica → servicio CRUD genérico → admin client (service_role) → PostgreSQL
Auto-traducción:       API Route → DeepL API (Promise.all, EN + PT en paralelo) → tabla entity_translations
```

**Decisión (ADR-005):** Landing Page consulta Supabase directo (sin API Routes intermedias).

## 2. Clientes Supabase
| Cliente | Archivo | Key | RLS | Uso |
|---|---|---|---|---|
| `server.ts` | `frontend/src/lib/supabase/` | anon | Respeta | Server Components, Landing Page |
| `client.ts` | `frontend/src/lib/supabase/` | anon | Respeta | Client Components, AuthGuard, LoginForm |
| `admin.ts` | `backend/src/lib/supabase/` | service_role | Bypass | Route Handlers privados (CRUD genérico) |

## 3. Data Fetching Landing Page (SC → Supabase directo)
```typescript
const supabase = await createSupabaseServerClient();

// La tabla projects ahora unifica projects + saas
const { data: projects } = await supabase
  .from('projects')
  .select(`
    id, slug, image_url, type,
    entity_translations!inner(content, locale, translation_status)
  `)
  .eq('entity_translations.locale', locale)
  .eq('entity_translations.translation_status', 'completed')
  .eq('status', 'active');
```

**Fallback de idioma (usando entity_translations genérica):**
```typescript
async function getContentWithFallback<T>(
  table: string,
  entityType: EntityType,
  locale: string,
  orderBy?: { column: string; ascending?: boolean }
): Promise<(T & { title?: string; description?: string })[]> {
  const supabase = createSupabaseServerClient();
  const orderColumn = orderBy?.column ?? 'display_order';
  const orderAsc = orderBy?.ascending ?? true;
  
  // Obtener datos principales (ES siempre disponible)
  const { data: items } = await supabase
    .from(table)
    .select('*')
    .eq('status', 'active')
    .order(orderColumn, { ascending: orderAsc });

  if (!items || locale === 'es') return items;

  // Obtener traducciones para el locale solicitado
  const itemIds = items.map(i => i.id);
  const { data: translations } = await supabase
    .from('entity_translations')
    .select('*')
    .in('entity_id', itemIds)
    .eq('entity_type', entityType)
    .eq('locale', locale)
    .eq('translation_status', 'completed');

  // Aplicar traducciones con fallback a ES
  const translationMap = new Map(translations?.map(t => [t.entity_id, t]) || []);
  return items.map(item => {
    const t = translationMap.get(item.id);
    if (!t?.content) return item;
    return { ...item, ...t.content };
  });
}
```

## 4. Data Fetching Admin (CC → fetch → API con CSRF)
```typescript
const csrfToken = getCookie('csrf-token');
const response = await fetch('/api/private/projects', {
  headers: {
    'X-CSRF-Token': csrfToken,  // Requerido para POST/PUT/DELETE
  },
});
// cookies JWT automáticas

// Estados: loading → Skeleton, error → ErrorMessage + retry, empty → EmptyState
```

**CSRF Protection:** Toda mutación debe incluir el header `X-CSRF-Token` con el valor de la cookie `csrf-token`. Las requests GET no requieren CSRF.

## 5. Subida de Archivos (Storage)
**Buckets:**
| Bucket | Tipos | Tamaño | Contenido |
|---|---|---|---|
| `profile` | JPG, PNG, WebP | 2 MB | Avatar |
| `projects` | JPG, PNG, WebP | 5 MB | Imágenes proyectos |
| `cv` | PDF | 10 MB | Currículum |

**Flujo:** FileUploader [CC] → valida tipo+tamaño → POST `/api/private/upload` (con CSRF header) → Supabase Storage → URL pública → callback.

## 6. Auto-traducción DeepL (Síncrona + Paralela)
```
Admin guarda en ES → INSERT en tabla principal →
  DeepL API (EN-US, PT-PT en Promise.all) →
  UPSERT en entity_translations (content JSONB + translation_status) →
  Responde al cliente con resultado
```
**Síncrono y en paralelo:** Se completa antes de responder al cliente. Sin riesgo de pérdida por serverless termination. La respuesta incluye el estado de las traducciones para que el admin sepa si debe reintentar.

## 7. Manejo de Errores
| Error | Causa | Solución |
|---|---|---|
| 401 | Token inválido | Redirigir a /admin/login |
| 403 | CSRF inválido | Recargar página (renueva CSRF token) |
| 400 | Validación fallida | Zod muestra errores por campo |
| 413 | Archivo muy grande | Reducir tamaño |
| 429 | Rate limit | Esperar e intentar de nuevo |
| 500 | Error Supabase/DeepL | Logs en Vercel + reintento manual |

**Caché:**
- Landing Page: `revalidate = 60` (ISR 1 min)
- Admin: sin caché
- Imágenes: Next.js Image optimization automática
- Error Boundaries: `error.tsx` por segmento de ruta para evitar crash total
