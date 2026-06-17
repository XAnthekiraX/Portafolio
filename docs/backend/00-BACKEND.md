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
│   ├── auth.ts, personal-info.ts, projects.ts, saas.ts
│   ├── skills.ts, technologies.ts, services.ts, stats.ts
│   ├── translations.ts, contact.ts
│   ├── education.ts
│   └── dashboard.ts -> stats.ts
├── lib/
│   ├── supabase/admin.ts    # service_role client (bypass RLS)
│   ├── auth/verify.ts       # JWT verification
│   ├── errors.ts            # AppError classes
│   ├── upload.ts            # File validation por bucket
│   ├── storage.ts           # Supabase Storage upload helper
│   └── i18n.ts              # Locale helpers + applyTranslation()
└── docs/
```

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
