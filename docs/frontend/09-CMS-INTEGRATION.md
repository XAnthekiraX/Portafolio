# 09-CMS-INTEGRATION.md — Anthekira.dev

## 1. Arquitectura
```
Landing Page (SC):     Server Component → @supabase/ssr (anon) → PostgreSQL (SELECT público)
Panel Admin (CC):      Client Component → fetch() → API Route → servicio → admin client (service_role) → PostgreSQL
Auto-traducción:       API Route → DeepL API → tablas _translations
```

**Decisión (ADR-005):** Landing Page consulta Supabase directo (sin API Routes intermedias).

## 2. Clientes Supabase
| Cliente | Archivo | Key | RLS | Uso |
|---|---|---|---|---|
| `server.ts` | `frontend/src/lib/supabase/` | anon | Respeta | Server Components, Landing Page |
| `client.ts` | `frontend/src/lib/supabase/` | anon | Respeta | Client Components, AuthGuard, LoginForm |
| `admin.ts` | `backend/src/lib/supabase/` | service_role | Bypass | Route Handlers privados, CRUD admin |

## 3. Data Fetching Landing Page (SC → Supabase directo)
```typescript
const supabase = await createSupabaseServerClient();
const { data: projects } = await supabase
  .from('projects')
  .select(`id, slug, image_url, project_translations!inner(title, description)`)
  .eq('project_translations.locale', locale)
  .eq('status', 'active');
```

**Fallback de idioma:** Si no hay traducción en el locale solicitado, se muestra ES:
```typescript
const translation = translations.find(t => t.locale === locale)
  || translations.find(t => t.locale === 'es')
  || translations[0];
```

## 4. Data Fetching Admin (CC → fetch → API)
```typescript
const response = await fetch('/api/private/projects'); // cookies JWT automáticas
// Estados: loading → Skeleton, error → ErrorMessage + retry, empty → EmptyState
```

## 5. Subida de Archivos (Storage)
**Buckets:**
| Bucket | Tipos | Tamaño | Contenido |
|---|---|---|---|
| `profile` | JPG, PNG, WebP | 2 MB | Avatar |
| `projects` | JPG, PNG, WebP | 5 MB | Imágenes proyectos |
| `cv` | PDF | 10 MB | Currículum |

**Flujo:** FileUploader [CC] → valida tipo+tamaño → POST `/api/private/media/upload` → Supabase Storage → URL pública → callback.

## 6. Auto-traducción DeepL
```
Admin guarda en ES → INSERT en tabla principal → DeepL API (EN-US, PT-PT) → UPSERT en _translations (content JSONB + translation_status)
```
**No bloqueante:** Se ejecuta después de responder al cliente. Si falla → `translation_status: 'failed'` + fallback ES.

## 7. Manejo de Errores
| Error | Causa | Solución |
|---|---|---|
| 401 | Token inválido | Redirigir a /admin/login |
| 400 | Validación fallida | Zod muestra errores por campo |
| 413 | Archivo muy grande | Reducir tamaño |
| 500 | Error Supabase/DeepL | Logs en Vercel |

**Caché:** Landing Page: `revalidate = 60` (ISR 1 min). Admin: sin caché. Imágenes: Next.js Image optimization automática.
