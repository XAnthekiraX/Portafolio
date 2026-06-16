# 00-BACKEND.md — Anthekira.dev — Backend Overview

## 1. Propósito

Este documento es el punto de entrada a la documentación del backend de Anthekira.dev. Proporciona un resumen del stack backend, un índice de todos los documentos, y una guía de navegación para desarrolladores y agentes de IA.

El backend está implementado como **API Routes de Next.js** (en `frontend/src/app/api/`) que delegan la lógica de negocio en los servicios de `backend/src/services/`. Los tipos y validaciones compartidas residen en `shared/src/`.

---

## 2. Stack Backend

| Capa | Tecnología | Detalle |
|---|---|---|
| **Runtime** | Next.js API Routes (Node.js) | Serverless en Vercel |
| **Lenguaje** | TypeScript (strict mode) | Tipado completo |
| **Base de datos** | PostgreSQL 15+ (Supabase) | Con UUIDs, triggers, RLS |
| **ORM / Cliente DB** | `@supabase/supabase-js` + `@supabase/ssr` | 3 clientes: server, browser, admin |
| **Autenticación** | Supabase Auth (email + password) | JWT + refresh tokens |
| **Almacenamiento** | Supabase Storage | 4 buckets: profile, projects, media, cv |
| **Traducción** | DeepL API (free tier) | Auto-traducción al guardar contenido |
| **Validación** | Zod | Schemas en servidor |
| **Despliegue** | Vercel (API Routes integradas) | Mismo deploy que el frontend |

### 2.1 Principios Arquitectónicos

| Principio | Aplicación |
|---|---|
| **Separación por dominios** | `frontend/` (UI + API Routes), `backend/` (servicios), `shared/` (tipos) |
| **Server Components** | Landing Page consulta Supabase directamente (sin API intermediaria) |
| **API Routes como BFF** | Endpoints privados como Backend-for-Frontend del panel admin |
| **Service Role para escritura** | Operaciones CRUD usan `service_role` key (bypass RLS) |
| **Sin roles de usuario** | Un solo administrador (ADR-008) |
| **Auto-traducción no bloqueante** | DeepL se ejecuta después de responder al cliente |
| **Caché con ISR** | Endpoints públicos con stale-while-revalidate |

---

## 3. Estructura del Backend

```
backend/
├── src/
│   ├── services/              # Capa de servicios (lógica de negocio)
│   │   ├── auth.ts            #   login()
│   │   ├── personal-info.ts   #   getPersonalInfo(), mergeSocialLinks()
│   │   ├── cv.ts              #   uploadCv()
│   │   ├── projects.ts        #   CRUD projects
│   │   ├── saas.ts            #   CRUD saas_projects
│   │   ├── skills.ts          #   CRUD skills
│   │   ├── education.ts       #   CRUD education (sin traducción)
│   │   ├── technologies.ts    #   CRUD technologies
│   │   ├── services.ts        #   CRUD services
│   │   ├── media.ts           #   uploadMedia(), deleteMedia()
│   │   ├── messages.ts        #   getMessages(), markAsRead()
│   │   ├── settings.ts        #   getSettings(), updateSettings()
│   │   ├── dashboard.ts       #   getActiveCount()
│   │   ├── translations.ts    #   autoTranslate(), deeplTranslate()
│   │   └── contact.ts         #   submitContactMessage()
│   │
│   └── lib/                   # Utilidades del backend
│       ├── supabase/
│       │   └── admin.ts       #   Service role client (bypass RLS)
│       ├── auth/
│       │   └── verify.ts      #   Verificación de tokens JWT
│       ├── errors.ts          #   Clases de error personalizadas
│       ├── upload.ts          #   validateFile(), getImageDimensions()
│       └── i18n.ts            #   getLocaleFromRequest(), applyTranslation()
│
├── docs/                      # Documentación del backend
│   └── (documentos .md del backend)
│
└── [Nota: Los Route Handlers de la API están en frontend/src/app/api/]
    frontend/src/app/api/
    ├── public/            # Endpoints públicos (sin auth)
    └── private/           # Endpoints privados (con auth JWT)

[Nota: Los clientes de Supabase server/client están en frontend/src/lib/supabase/]
frontend/src/lib/supabase/
├── server.ts      # Server Component client (anon key)
└── client.ts      # Browser client (anon key)

[Nota: Los tipos compartidos y validadores están en shared/src/]
shared/src/
├── types/          # Interfaces TypeScript
│   ├── entities.ts
│   └── api.ts
├── validators/     # Zod schemas + formatZodErrors()
│   └── index.ts
└── utils/          # Utilidades generales
    ├── slug.ts     # generateSlug(), generateUniqueSlug()
    └── format.ts   # mergeSocialLinks(), formatZodErrors()
```

---

## 4. Índice de Documentación Backend

| # | Documento | Contenido | Archivo |
|---|---|---|---|
| **01** | **Entidades TypeScript** | Interfaces, DTOs, tipos, Zod schemas, API envelope | `backend/docs/01-ENTITIES.md` |
| **02** | **Esquema de Base de Datos** | Tablas, columnas, índices, RLS, migración SQL, seed data | `backend/docs/02-DATABASE.md` |
| **03** | **API Pública** | Endpoints GET públicos, locale, caché, errores | `backend/docs/03-API-PUBLIC.md` |
| **04** | **API Privada** | Endpoints CRUD del admin panel, auto-traducción, auth | `backend/docs/04-API-PRIVATE.md` |
| **05** | **Autenticación** | Supabase Auth, JWT, cookies, middleware, service role | `backend/docs/05-AUTHENTICATION.md` |
| **06** | **Lógica de Negocio** | DeepL, slugs, validaciones, errores, helpers | `backend/docs/06-BUSINESS-LOGIC.md` |

### 4.1 Orden de Lectura Recomendado

```
Para entender el backend completo, leer en este orden:

1. `backend/docs/00-BACKEND.md`      ← Este documento (visión general)
2. `backend/docs/01-ENTITIES.md`     ← Entidades y tipos (conceptos base)
3. `backend/docs/02-DATABASE.md`     ← Esquema de BD (almacenamiento)
4. `backend/docs/05-AUTHENTICATION.md` ← Sistema de auth (seguridad)
5. `backend/docs/03-API-PUBLIC.md`   ← API pública (consulta externa)
6. `backend/docs/04-API-PRIVATE.md`  ← API privada (CRUD admin)
7. `backend/docs/06-BUSINESS-LOGIC.md` ← Lógica de negocio (implementación)
```

---

## 5. Resumen por Documento

### 5.1 `01-ENTITIES.md` — Entidades TypeScript

Define interfaces que representan las tablas de la BD, más DTOs para creación/actualización, tipos de API envelope, y **Zod schemas** de validación para todos los endpoints.

**Archivos destino:**
- `shared/src/types/entities.ts` — Interfaces
- `shared/src/types/api.ts` — API envelope
- `shared/src/validators/index.ts` — Zod schemas

### 5.2 `02-DATABASE.md` — Esquema de Base de Datos

Define **16 tablas** en PostgreSQL 15+ con migración SQL completa, incluyendo:
- 4 tablas de traducción (DeepL auto-translate)
- 2 tablas pivote N:M (project_skills, saas_project_skills)
- 4 buckets de Storage con políticas
- RLS en todas las tablas
- Trigger `updated_at` automático
- Datos semilla

### 5.3 `03-API-PUBLIC.md` — API Pública

**9 endpoints públicos** de solo lectura (excepto POST /contact):
- Información personal, proyectos, skills, tecnologías, servicios, SaaS
- Soporte de locale query param para contenido traducido
- Estrategias de caché ISR (5-30 min según recurso)
- CORS habilitado para consumo externo

### 5.4 `04-API-PRIVATE.md` — API Privada

**~27 endpoints privados** protegidos con JWT para el panel admin:
- CRUD completo de projects, saas, skills, education, technologies, services
- Personal Info (incluye CV y redes sociales)
- 1 endpoint unificado de conteo (`/stats/count`) para el Dashboard
- Auto-traducción DeepL en POST/PUT

### 5.5 `05-AUTHENTICATION.md` — Autenticación

Sistema completo de auth con Supabase:
- 3 clientes Supabase diferenciados (server, browser, admin)
- Middleware de Next.js que protege `/admin` y `/api/private/*`
- Login con email + password, logout con invalidación de sesión
- Refresh tokens automáticos vía `@supabase/ssr`
- Service role key para bypass de RLS
- Cookies httpOnly + SameSite=Lax
- Manejo de 401 en client components

### 5.6 `06-BUSINESS-LOGIC.md` — Lógica de Negocio

Utilidades compartidas del backend:
- DeepL auto-translate orquestador (no bloqueante)
- Slug generation con detección de duplicados
- Social Links merge (JSONB parcial)
- File validation por bucket
- Error classes personalizadas con handler global
- Zod error formatter
- Locale helpers (applyTranslation, getLocaleFromRequest)
- Supabase client factory (4 variantes)

---

## 6. Endpoints Públicos vs Privados

| Aspecto | Públicos (`/api/public/*`) | Privados (`/api/private/*`) |
|---|---|---|
| **Autenticación** | ❌ No requiere | ✅ JWT requerido |
| **Cliente DB** | Anon key + RLS | Service role (bypass RLS) |
| **Operaciones** | Solo GET (excepto POST /contact) | CRUD completo |
| **Caché** | ISR (5-30 min) | Sin caché |
| **CORS** | ✅ Habilitado | ❌ Solo mismo origen |
| **Consumidor** | Landing Page (externo/futuro) | Panel admin (Client Components) |

---

## 7. Variables de Entorno

```env
# === Supabase (obligatorias) ===
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-public-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-secret-key>

# === DeepL (obligatorio para auto-traducción) ===
DEEPL_API_KEY=<deepl-api-key>

# === Google Analytics (opcional) ===
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# === Sitio (opcional) ===
NEXT_PUBLIC_SITE_URL=https://anthekira.dev
```

---

## 8. Flujo de Datos

```
[Visitante / Cliente externo]
    │
    ├── GET /api/public/* ───→ Server Component (anon key + RLS)
    │                               └──→ PostgreSQL (SELECT público)
    │
    └── POST /api/public/contact ──→ Route Handler (anon key)
                                        └──→ PostgreSQL (INSERT contact_messages)

[Admin (autenticado)]
    │
    ├── POST /api/private/admin/login ──→ Route Handler (auth)
    │                                       └──→ Supabase Auth → JWT
    │
    └── GET/POST/PUT/DELETE /api/private/* ──→ Middleware verifica JWT
                                                   │
                                                   └──→ Route Handler
                                                       ├──→ supabaseAdmin (service_role)
                                                       │       └──→ PostgreSQL (CRUD)
                                                       └──→ autoTranslate() (DeepL)
                                                               └──→ Tablas de traducción
```

---

## 9. Dependencias con otros documentos

| Archivo | Relación |
|---|---|
| `00-REQUIREMENTS.md` | Define los requisitos que el backend implementa |
| `01-ARCHITECTURE.md` | Describe la arquitectura general del sistema |
| `02-DECISIONS.md` | ADR-001 (monorepo), ADR-002 (Supabase), ADR-006 (DeepL), ADR-008 (sin roles) |
| `03-USER-FLOWS.md` | Flujos de usuario que el backend soporta |
| `frontend/docs/08-ADMIN-PANEL.md` | Interfaz de usuario que consume los endpoints privados |
| `frontend/docs/01-ROUTES.md` | Middleware de protección de rutas admin |
| `frontend/docs/02-COMPONENTS.md` | Componentes que consumen la API (FormBuilder, DataTable) |
