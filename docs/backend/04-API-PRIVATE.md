# 04-API-PRIVATE.md — Anthekira.dev

## 1. General
**Base:** `/api/private` — **Auth:** ✅ JWT (cookies httpOnly) + CSRF token (header `X-CSRF-Token`)  
**Rate limiting:** ✅ Login: 5 intentos/minuto por IP. Contact POST: ya está en API pública.  
**Cliente DB:** service_role (bypass RLS)  
**Middleware:** `frontend/src/middleware.ts` protege todas las rutas `/api/private/*`.  
**Envelope:** `{ success: true, data: T }` / `{ success: false, error: string, code?: string, details?: Record<string, string[]> }`

## 2. Endpoints (~24, desde 34 originales)

### Auth
| Método | Ruta | Rate Limit | Descripción |
|---|---|---|---|
| POST | `/api/private/admin/login` | 5/min/IP | Login email+password → Supabase Auth → JWT → cookies httpOnly + CSRF cookie |

### Personal Info
| Método | Ruta | Auto-traducción |
|---|---|---|
| GET | `/api/private/personal-info` | — |
| PUT | `/api/private/personal-info` | bio → EN/PT (Promise.all, síncrono) |

### Projects (CRUD completo — unifica projects + saas)
| Método | Ruta | Auto-traducción |
|---|---|---|
| GET | `/api/private/projects` | — |
| POST | `/api/private/projects` | title + description → EN/PT |
| PUT | `/api/private/projects/[id]` | Re-traduce si cambió |
| DELETE | `/api/private/projects/[id]` | Cascade (skills + traducciones) |

> **Nota:** Los proyectos SaaS se crean con `type: 'saas'`. Los campos específicos de SaaS (`url`, `features`) están disponibles en el mismo formulario.

### Skills, Education, Technologies (CRUD — sin traducción)
| Recurso | Métodos | Notas |
|---|---|---|
| `/api/private/skills` | GET, POST, PUT [id], DELETE [id] | Sin traducción |
| `/api/private/education` | GET, POST, PUT [id], DELETE [id] | Sin traducción |
| `/api/private/technologies` | GET, POST, PUT [id], DELETE [id] | Sin traducción |

### Services (CRUD completo)
| Método | Ruta | Auto-traducción |
|---|---|---|
| GET | `/api/private/services` | — |
| POST | `/api/private/services` | title + description → EN/PT |
| PUT | `/api/private/services/[id]` | Re-traduce si cambió |
| DELETE | `/api/private/services/[id]` | Cascade |

### Upload / Storage
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/private/upload` | Subir archivo a Supabase Storage |

**Request:** `multipart/form-data` — campos: `file` (File), `bucket` (string: `profile` | `projects` | `cv`).  
**Validación:** Tipos MIME y tamaño según bucket (ver `backend/06-BUSINESS-LOGIC.md` §5).  
**Response 201:** `{ success: true, data: { url: "https://...", path: "..." } }`  
**Errores:** 400 (archivo inválido o bucket incorrecto), 413 (archivo demasiado grande), 500 (error Storage).

### Stats
| Método | Ruta | Response |
|---|---|---|
| GET | `/api/private/stats/count` | `{ total_projects: N, total_skills: N, total_technologies: N, total_services: N, total_education: N, total_contact_messages: N, total_failed_translations: N }` |
| GET | `/api/private/stats/translations-pending` | `{ total_failed: N }` — conteo de traducciones fallidas |

### Translations
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/private/translations/retry` | Reintentar traducciones fallidas (`translation_status = 'failed'`) |

### Contact Messages
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/private/contact` | Listar mensajes (orden descendente, paginado) |
| PUT | `/api/private/contact/[id]/read` | Marcar como leído |
| DELETE | `/api/private/contact/[id]` | Eliminar mensaje |

**GET /api/private/contact:**  
**Query params:** `?is_read=true|false`, `?page=1&page_size=20`

## 3. CRUD Genérico

La mayoría de endpoints CRUD se implementan con el helper genérico:

```typescript
// backend/src/services/generic.ts
export function createCrudService<T extends { id: string }>(table: string, config: CrudConfig<T>) {
  return {
    list: async (filters?: Record<string, any>) => { /* GET */ },
    getById: async (id: string) => { /* GET /:id */ },
    create: async (data: T) => { /* POST */ },
    update: async (id: string, data: Partial<T>) => { /* PUT */ },
    delete: async (id: string) => { /* DELETE */ },
  };
}
```

```typescript
// backend/src/lib/generic/handler.ts
export function createCrudHandler(service: ReturnType<typeof createCrudService>) {
  return {
    GET:    async (req) => { /* ... */ },
    POST:   async (req) => { /* valida Zod + service.create + auto-traduce si config.translations */ },
    PUT:    async (req, { params }) => { /* valida Zod + service.update + auto-traduce si cambió texto */ },
    DELETE: async (req, { params }) => { /* service.delete */ },
  };
}
```

**Implementación concreta:**
```typescript
// frontend/src/app/api/private/projects/route.ts
import { createCrudHandler } from '@/lib/generic/handler';
import { projectCrudService } from '@/services/projects';

const handler = createCrudHandler(projectCrudService);
export const GET  = handler.GET;
export const POST = handler.POST;
```

> **Métrica:** De 34 endpoints originales a ~24 handlers HTTP (12 rutas × ~2 métodos cada una en promedio). La reducción viene de eliminar los 4 endpoints de `/saas` (ahora absorbidos por `/projects`).

## 4. Auto-traducción (DeepL) — Síncrona y Paralela

```typescript
async function autoTranslate(entityType: EntityType, entityId: string, sourceContent: Record<string, any>) {
  const results = await Promise.all(
    ['en', 'pt'].map(async (locale) => {
      try {
        const translatedContent: Record<string, string> = {};
        for (const [key, text] of Object.entries(sourceContent))
          if (typeof text === 'string' && text.trim())
            translatedContent[key] = await deeplTranslateWithTimeout(text, 'ES', DEEPL_TARGET_LANGUAGES[locale]);
        return { locale, content: translatedContent, translation_status: 'completed' as const };
      } catch {
        return { locale, content: sourceContent, translation_status: 'failed' as const };
      }
    })
  );

  // Guardar ambos resultados en paralelo
  await Promise.all(
    results.map(r =>
      supabaseAdmin.from('entity_translations').upsert(
        { entity_type: entityType, entity_id: entityId, ...r },
        { onConflict: 'entity_type,entity_id,locale' }
      )
    )
  );

  return results;
}
```

**Mejora clave:** La traducción se ejecuta **antes** de responder al cliente. Si alguna falla, se incluye en la respuesta para que el admin sepa que debe reintentar.

**Tablas con auto-traducción (usando entity_translations genérica):**
| Recurso | entity_type | content keys |
|---|---|---|
| Projects | `project` | `title`, `description` |
| Services | `service` | `title`, `description` |
| Personal Info | `personal_info` | `bio` |

## 5. Protección CSRF

Toda mutación (POST, PUT, DELETE) en `/api/private/*` requiere:
1. Cookie `csrf-token` (httpOnly, establecida al login)
2. Header `X-CSRF-Token` con el mismo valor

```typescript
// backend/src/lib/auth/csrf.ts
export function validateCsrf(request: NextRequest): boolean {
  const cookieToken = request.cookies.get('csrf-token')?.value;
  const headerToken = request.headers.get('X-CSRF-Token');
  return !!cookieToken && cookieToken === headerToken;
}
```

## 6. Rate Limiting

```typescript
// backend/src/lib/rate-limit.ts
// Implementación con Vercel KV o Upstash Redis
import { Ratelimit } from "@upstash/ratelimit";

export const loginRateLimit = new Ratelimit({
  limiter: Ratelimit.slidingWindow(5, "60 s"),  // 5 intentos/minuto
});

// Uso en route handler:
const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
const { success } = await loginRateLimit.limit(`login:${ip}`);
if (!success) return NextResponse.json({ error: 'Too many attempts' }, { status: 429 });
```

## 7. Códigos de Estado
| 200 | OK | GET, PUT, DELETE |
|---|---|---|
| 201 | Created | POST |
| 400 | Bad Request | Validación Zod |
| 401 | Unauthorized | Token faltante/inválido |
| 404 | Not Found | Recurso no existe |
| 409 | Conflict | Slug/nombre duplicado |
| 429 | Too Many Requests | Rate limit excedido |
| 500 | Internal Error | Error inesperado |
