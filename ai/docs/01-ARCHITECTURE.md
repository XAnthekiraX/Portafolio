# 01-ARCHITECTURE.md — Anthekira.dev

## 1. Visión General

Monorepo Next.js con tres dominios: **frontend** (Next.js App Router), **backend** (lógica de negocio), **shared** (tipos/validadores). Todo en Vercel. DB + Storage + Auth en Supabase.

```
[Browser] → Landing Page (/{lang}/) → Server Components → Supabase directo
          → Panel Admin (/admin)    → Client Components → fetch() → API Routes
```

### Principios

| Principio   | Aplicación                                                             |
| ----------- | ---------------------------------------------------------------------- |
| Simplicidad | Proyecto único con separación lógica. Sin microservicios               |
| Bajo costo  | Vercel Hobby + Supabase Free                                           |
| Performance | Server Components para datos públicos, Client solo cuando es necesario |
| i18n        | next-intl, agregar idiomas sin cambiar código                          |
| DRY         | CRUD genéricos backend y frontend para eliminar boilerplate            |

## 2. Estructura del Proyecto

```
anthekira.dev/
├── frontend/src/
│   ├── app/[locale]/      # Landing Page pública (i18n)
│   ├── app/admin/         # Panel admin (sin i18n)
│   ├── app/api/public/    # Endpoints públicos
│   ├── app/api/private/   # Endpoints privados
│   ├── components/{ui,landing,admin,shared}/
│   ├── lib/supabase/{server,client}.ts
│   ├── lib/generic/       # ResourcePage, GenericForm (admin genérico)
│   └── middleware.ts      # Auth + i18n routing
├── backend/src/
│   ├── services/          # Lógica de negocio (generic.ts con createCrudService)
│   └── lib/{supabase,auth,errors,upload,i18n,generic,rate-limit}/
├── shared/src/
│   ├── types/{entities,api,i18n}.ts
│   ├── validators/index.ts  # Zod schemas
│   └── utils/{slug,format}.ts
├── public/locales/{es,en,pt}.json
└── ai/docs/
```

## 3. Data Fetching

- **Landing Page:** Server Components consultan Supabase directo (sin API intermediaria — ADR-005)
- **Panel Admin:** Client Components → fetch() → `/api/private/*` con JWT + CSRF header → servicios genéricos → Supabase (service_role)
- **API Pública:** Existe para consumo externo, no para el propio frontend

## 4. Base de Datos

PostgreSQL 15+ (Supabase). Esquema en `backend/docs/02-DATABASE.md`.

- 7 tablas principales + 1 de traducciones genérica (`entity_translations`) + 1 pivote N:M (`project_skills`) = **9 tablas en total** (vs 14 originales)
- RLS: SELECT público excepto contact_messages. `entity_translations` visible solo si `translation_status = 'completed'`. Escritura solo service_role
- Storage: buckets `profile`, `projects`, `cv`

**Mejoras:**

- Projects + SaaS Projects unificados en `projects` con campo `type` (-3 tablas)
- Traducciones en tabla genérica `entity_translations` (-3 tablas)

## 5. Autenticación

- Login: email + password → Supabase Auth → JWT en cookies httpOnly + cookie CSRF token
- Middleware protege `/admin` y `/api/private/*` (sin agregar headers adicionales)
- CSRF Protection: double submit cookie pattern (cookie + header `X-CSRF-Token`)
- Rate limiting: 5 intentos/minuto en login
- Service role key para bypass RLS en operaciones admin
- Único administrador (sin roles — ADR-008)

## 6. Internacionalización

- next-intl con routing localizado (`/es`, `/en`, `/pt`)
- `localePrefix: 'as-needed'` → `/` = español, `/en` = inglés
- Admin sin i18n (solo español)
- Contenido estático (UI): archivos JSON. Contenido dinámico (CMS): BD con auto-traducción DeepL (síncrona y paralela)

## 7. Flujo de Datos

**Visitante:** anthekira.dev → middleware detecta locale → SC renderiza página → consulta directa a Supabase → HTML servido.  
**Admin:** /admin/login → rate limit check → Supabase Auth → JWT + CSRF cookies → fetch() a /api/private/\* con JWT + header CSRF → middleware verifica sesión → Route Handler (valida CSRF) → servicio genérico CRUD → Supabase (service_role) → DeepL síncrono+paralelo → respuesta.

## 8. Variables de Entorno

```
NEXT_PUBLIC_SUPABASE_URL / ANON_KEY   # Públicas
SUPABASE_SERVICE_ROLE_KEY / DEEPL_API_KEY  # Secretas (solo server)
NEXT_PUBLIC_GA_ID / SITE_URL
UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN  # Rate limiting
```
