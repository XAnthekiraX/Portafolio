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

## 2. Estructura
```
backend/src/
├── services/          # Lógica de negocio
│   ├── auth.ts              # Login + logout
│   ├── personal-info.ts     # Profile CRUD + traducción
│   ├── projects.ts          # Projects CRUD + traducción + slug
│   ├── skills.ts            # Skills CRUD
│   ├── technologies.ts      # Technologies CRUD
│   ├── services.ts          # Services CRUD + traducción
│   ├── education.ts         # Education CRUD
│   ├── translations.ts      # Retry traducciones fallidas
│   ├── contact.ts           # Messages management
│   ├── stats.ts             # Dashboard counts
│   └── generic.ts           # createCrudService() genérico
├── lib/
│   ├── supabase/admin.ts    # service_role client (bypass RLS)
│   ├── auth/verify.ts       # JWT verification
│   ├── auth/csrf.ts         # CSRF token validation
│   ├── rate-limit.ts        # Rate limiting helper (Upstash/Vercel KV)
│   ├── generic/handler.ts   # createCrudHandler() genérico
│   ├── errors.ts            # AppError classes + handleApiError()
│   ├── upload.ts            # File validation por bucket
│   ├── storage.ts           # Supabase Storage upload helper
│   └── i18n.ts              # Locale helpers + applyTranslation() + translateField()
└── docs/
```

**Mejoras:**
- `services/generic.ts` + `lib/generic/handler.ts`: CRUD genérico que elimina ~70% del boilerplate
- `lib/auth/csrf.ts`: Validación CSRF doble cookie
- `lib/rate-limit.ts`: Rate limiting para login y contacto

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
| Auth | ❌ | ✅ JWT |
| Cliente DB | Anon + RLS | Service role (bypass) |
| Operaciones | GET (excepto POST /contact) | CRUD completo |
| Caché | ISR 5-30 min | Sin caché |
| CORS | ✅ | ❌ mismo origen |

## 5. Variables de Entorno
```
NEXT_PUBLIC_SUPABASE_URL / ANON_KEY  # Públicas
SUPABASE_SERVICE_ROLE_KEY            # Secreta (solo server)
DEEPL_API_KEY                        # Secreta (solo server)
NEXT_PUBLIC_GA_ID                    # Pública
NEXT_PUBLIC_SITE_URL                 # Pública
```
