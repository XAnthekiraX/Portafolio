# 00-BACKEND.md — Anthekira.dev

## 1. Stack
| Capa | Tecnología |
|---|---|
| Runtime | Next.js API Routes (Node.js serverless en Vercel) |
| Lenguaje | TypeScript (strict) |
| DB | PostgreSQL 15+ (Supabase) |
| ORM | @supabase/supabase-js + @supabase/ssr |
| Auth | Supabase Auth (JWT + refresh tokens) |
| Storage | Supabase Storage (3 buckets) |
| Traducción | DeepL API (free tier) |
| Validación | Zod |

## 2. Estructura y Responsabilidades de Servicios
```
backend/src/
├── services/          # Lógica de negocio — cada archivo = UNA entidad
│   ├── auth.ts              # Login + logout (solo esto, no mezcla con otras entidades)
│   ├── personal-info.ts     # Profile CRUD (merge social_links) + auto-traducción
│   ├── projects.ts          # Projects: CRUD via createCrudService + slug + traducción
│   ├── skills.ts            # Skills: CRUD via createCrudService (sin traducciones)
│   ├── technologies.ts      # Technologies: CRUD via createCrudService (sin traducciones)
│   ├── services.ts          # Services: CRUD via createCrudService + traducción
│   ├── education.ts         # Education: CRUD via createCrudService (sin traducciones)
│   ├── translations.ts      # Retry de traducciones fallidas (solo reintento)
│   ├── contact.ts           # Messages: list, markAsRead, delete (gestión de terceros)
│   ├── stats.ts             # Dashboard counts agregados (query-only, sin escritura)
│   └── generic.ts           # createCrudService: fábrica CRUD para 5/10 servicios
├── lib/
│   ├── supabase/admin.ts    # service_role client (bypass RLS)
│   ├── auth/verify.ts       # JWT verification
│   ├── auth/csrf.ts         # CSRF token validation (stateless, double-submit)
│   ├── auth/log-sanitizer.ts # PII removal antes de escribir logs
│   ├── rate-limit.ts        # Rate limiting helper (Upstash/Vercel KV)
│   ├── generic/handler.ts   # createCrudHandler: wrapper API Route para CRUD genérico
│   ├── errors.ts            # AppError classes + handleApiError()
│   ├── upload.ts            # File validation por bucket
│   ├── storage.ts           # Supabase Storage upload helper
│   └── i18n.ts              # Locale helpers + applyTranslation()
└── docs/
```

**Principios de separación:**
- Cada archivo en `services/` = UNA entidad de negocio. Sin mezclar auth con projects.
- Servicios que usan `createCrudService` solo definen configuración. La lógica CRUD está en `generic.ts`.
- Helpers en `lib/` son técnicos (auth, rate-limit, errors) — sin conocimiento de entidades.
- `lib/errors.ts` es el único punto de definición de errores.

**Mejoras:**
- `services/generic.ts` + `lib/generic/handler.ts`: CRUD genérico elimina ~70% del boilerplate
- `lib/auth/csrf.ts`: Validación CSRF doble cookie
- `lib/auth/log-sanitizer.ts`: Sanitización logs para GDPR
- `lib/rate-limit.ts`: Rate limiting login + contacto

Los Route Handlers están en `frontend/src/app/api/{public,private}/`.

## 3. Documentación Backend
| # | Archivo | Contenido |
|---|---|---|
| 01 | 01-ENTITIES.md | Interfaces, DTOs, Zod schemas |
| 02 | 02-DATABASE.md | Esquema SQL, tablas, RLS, Storage |
| 03 | 03-API-PUBLIC.md | 8 endpoints públicos (GET + POST contact) (locale, caché) |
| 04 | 04-API-PRIVATE.md | 34 endpoints privados CRUD + auto-traducción + upload + contacto + reintento traducción |
| 05 | 05-AUTHENTICATION.md | Supabase Auth, JWT, cookies, middleware |
| 06 | 06-BUSINESS-LOGIC.md | DeepL, slugs, validaciones, errores |

## 4. Endpoints
| Aspecto | Público (/api/public/) | Privado (/api/private/) |
|---|---|---|
| Auth | ❌ | ✅ JWT + CSRF |
| Cliente DB | Anon + RLS | Service role (bypass) |
| Operaciones | GET (excepto POST /contact con rate limit) | CRUD completo + rate limit login |
| Caché | ISR 5-30 min | Sin caché |
| CORS | ✅ | ❌ mismo origen |

## 5. Logging
- Formato JSON estructurado: `{ timestamp, level, message, requestId }`
- Sin PII en logs: emails, IPs completas, nombres, mensajes de contenido — todos redactados
- Ver `lib/auth/log-sanitizer.ts` para implementación

## 6. Variables de Entorno
```
NEXT_PUBLIC_SUPABASE_URL / ANON_KEY  # Públicas
SUPABASE_SERVICE_ROLE_KEY            # Secreta (solo server)
DEEPL_API_KEY                        # Secreta (solo server)
NEXT_PUBLIC_GA_ID                    # Pública
NEXT_PUBLIC_SITE_URL                 # Pública
```
