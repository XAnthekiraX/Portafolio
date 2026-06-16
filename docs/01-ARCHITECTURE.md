# 01-ARCHITECTURE.md — Anthekira.dev

## 1. Visión General de la Arquitectura

Anthekira.dev es un proyecto organizado en tres dominios claramente separados: **frontend** (Next.js App Router), **backend** (lógica de negocio y acceso a datos) y **shared** (tipos y utilidades compartidas). Todo se despliega en Vercel, con base de datos y almacenamiento en Supabase.

### 1.1 Diagrama Conceptual

```
[Browser]
    │
    ├── Landing Page (/{lang}/)
    │       └── frontend Server Components → consulta directa → Supabase (DB)
    │
    └── Panel Admin (/admin)
            │
            ├── Client Components → fetch() → API Privada (/api/private/*)
            │                                           │
            └── Login → Supabase Auth → JWT ────────────┘
                                                        │
                                              [frontend/src/app/api/*]
                                              (Route Handlers de Next.js)
                                                        │
                                              backend/src/services/*
                                              backend/src/lib/*
                                                        │
                                              Supabase (service_role)
                                                        │
                                              ┌─────────┴──────────┐
                                              │  PostgreSQL        │
                                              │  Storage           │
                                              │  Auth              │
                                              └────────────────────┘
```

### 1.2 Principios Arquitectónicos

| Principio | Aplicación |
|---|---|
| **Simplicidad** | Proyecto único con separación lógica de dominios. Evitar microservicios o proyectos separados innecesarios |
| **Bajo costo** | Todo en Vercel (plan Hobby/Pro) + Supabase (plan Free) |
| **Mantenibilidad** | Separación clara de responsabilidades por carpeta y naming |
| **Performance** | Server Components para datos públicos, Client Components solo cuando sea necesario |
| **Escalabilidad i18n** | next-intl con archivos JSON de traducción, agregar idiomas sin cambiar código |

---

## 2. Estructura del Proyecto

```
anthekira.dev/
├── .env.local                    # Variables de entorno (local)
├── .env.production               # Variables de entorno (producción)
├── next.config.ts                # Configuración de Next.js
├── tsconfig.json                 # Configuración de TypeScript
├── package.json
│
├── frontend/                     # ← FRONTEND: Next.js App Router
│   ├── src/
│   │   ├── app/
│   │   │   ├── [locale]/         #   Landing Page (público, con i18n)
│   │   │   │   ├── layout.tsx    #     Landing Layout (header + footer)
│   │   │   │   ├── page.tsx      #     Landing Page principal
│   │   │   │   ├── projects/
│   │   │   │   ├── about/
│   │   │   │   ├── contact/
│   │   │   │   └── not-found.tsx
│   │   │   ├── admin/            #   Panel Admin (privado, sin i18n)
│   │   │   │   ├── login/
│   │   │   │   ├── layout.tsx    #     Admin Layout (sidebar + navbar)
│   │   │   │   ├── page.tsx      #     Dashboard
│   │   │   │   ├── projects/
│   │   │   │   ├── saas/
│   │   │   │   ├── profile/
│   │   │   │   ├── education/
│   │   │   │   ├── technologies/
│   │   │   │   ├── services/
│   │   │   │   └── skills/
│   │   │   └── api/              #   API Routes (Next.js)
│   │   │       ├── public/       #     Endpoints públicos (sin auth)
│   │   │       │   ├── personal-info/
│   │   │       │   ├── projects/
│   │   │       │   ├── skills/
│   │   │       │   ├── services/
│   │   │       │   ├── technologies/
│   │   │       │   ├── saas/
│   │   │       │   └── contact/
│   │   │       └── private/      #     Endpoints privados (con auth JWT)
│   │   │           ├── admin/login/
│   │   │           ├── personal-info/
│   │   │           ├── projects/
│   │   │           ├── saas/
│   │   │           ├── skills/
│   │   │           ├── technologies/
│   │   │           ├── services/
│   │   │           └── stats/count/
│   │   ├── components/           #   Componentes React
│   │   │   ├── ui/               #     Atómicos (Button, Card, Input, etc.)
│   │   │   ├── landing/          #     Landing Page (Hero, About, Skills...)
│   │   │   ├── admin/            #     Panel Admin (Sidebar, DataTable...)
│   │   │   └── shared/           #     Compartidos (LanguageSwitcher, AuthGuard)
│   │   ├── lib/                  #   Utilidades del frontend
│   │   │   ├── supabase/         #     Clientes (server.ts, client.ts)
│   │   │   ├── i18n.ts           #     Configuración de next-intl
│   │   │   └── routing.ts        #     Configuración de routing i18n
│   │   └── middleware.ts         #   Middleware (protección rutas + i18n)
│   └── docs/                     #   Documentación del frontend
│       └── (documentos .md del frontend)
│
├── backend/                      # ← BACKEND: Lógica de negocio
│   ├── src/
│   │   ├── services/             #   Capa de servicios (business logic)
│   │   │   ├── personal-info.ts
│   │   │   ├── projects.ts
│   │   │   ├── skills.ts
│   │   │   ├── technologies.ts
│   │   │   ├── services.ts
│   │   │   ├── contact.ts
│   │   │   ├── auth.ts
│   │   │   ├── translations.ts
│   │   │   ├── dashboard.ts
│   │   │   └── ...
│   │   └── lib/                  #   Utilidades del backend
│   │       ├── supabase/
│   │       │   └── admin.ts      #     Cliente service_role (bypass RLS)
│   │       ├── auth/
│   │       │   └── verify.ts     #     Verificación de tokens JWT
│   │       ├── errors.ts         #     Clases de error personalizadas
│   │       ├── upload.ts         #     Validación y subida de archivos
│   │       └── i18n.ts           #     Helpers de locale para API
│   └── docs/                     #   Documentación del backend
│       └── (documentos .md del backend)
│
├── shared/                       # ← SHARED: Código compartido
│   └── src/
│       ├── types/                #   Interfaces TypeScript
│       │   ├── entities.ts       #     Entidades del sistema
│       │   ├── api.ts            #     Envelope API (ApiResponse, etc.)
│       │   └── i18n.d.ts         #     Tipos para traducciones
│       ├── validators/           #   Schemas Zod de validación
│       │   └── index.ts          #     Schemas de todas las entidades
│       └── utils/                #   Utilidades generales
│           ├── slug.ts           #     generateSlug, generateUniqueSlug
│           └── format.ts         #     formatZodErrors, etc.
│
├── public/                       # Archivos estáticos
│   ├── locales/                  # Traducciones next-intl
│   │   ├── es.json
│   │   ├── en.json
│   │   └── pt.json
│   └── images/                   # Imágenes estáticas (favicon, OG, etc.)
│
├── docs/                         # Documentación general del proyecto
│   ├── 00-REQUIREMENTS.md
│   ├── 01-ARCHITECTURE.md
│   ├── 02-DECISIONS.md
│   ├── 03-USER-FLOWS.md
│   └── 04-AI-DEVELOPMENT-GUIDE.md
│
└── README.md
```

### 2.1 Propósito de Carpetas Raíz

| Carpeta | Propósito |
|---|---|
| `frontend/src/app/[locale]` | Páginas públicas de la Landing Page con i18n |
| `frontend/src/app/admin` | Panel administrativo (sin prefijo de idioma) |
| `frontend/src/app/api` | API Routes (Next.js) públicas y privadas |
| `frontend/src/components` | Componentes React organizados por dominio |
| `frontend/src/lib` | Utilidades del frontend (Supabase clients, i18n) |
| `frontend/src/middleware.ts` | Middleware de Next.js (auth + i18n routing) |
| `backend/src/services` | Lógica de negocio (capa de servicios) |
| `backend/src/lib` | Utilidades del backend (auth, errors, upload) |
| `shared/src/types` | Interfaces TypeScript compartidas |
| `shared/src/validators` | Schemas Zod de validación |
| `shared/src/utils` | Utilidades generales compartidas |
| `public/locales` | Archivos de traducción JSON |

---

## 3. Frontend — Next.js App Router

### 3.1 Organización por Rutas

| Ruta | Tipo | Ubicación en frontend | Descripción |
|---|---|---|---|
| `/{lang}/` | Server Component | `frontend/src/app/[locale]/` | Landing Page principal |
| `/{lang}/projects` | Server Component | `frontend/src/app/[locale]/` | Página de proyectos (SEO) |
| `/{lang}/about` | Server Component | `frontend/src/app/[locale]/` | Página Sobre Mí (SEO) |
| `/{lang}/contact` | Server Component | `frontend/src/app/[locale]/` | Página de contacto (SEO) |
| `/admin/login` | Client Component | `frontend/src/app/admin/` | Login del panel admin |
| `/admin` | Client Component | `frontend/src/app/admin/` | Dashboard con enlace externo a Google Analytics |
| `/admin/*` | Client Component | `frontend/src/app/admin/` | CRUDs de gestión de contenido |

### 3.2 Server Components vs Client Components

- **Server Components (default):** Toda la Landing Page pública. Consulta directa a Supabase desde el servidor (sin pasar por API Routes). Sin JavaScript hasta que sea necesario.
- **Client Components (`use client`):** Panel admin, formularios, interactividad (hover effects, scroll reveal, microinteracciones), LanguageSwitcher.
- **Estrategia:** Máximo contenido renderizado en servidor. Solo enviar JavaScript al cliente cuando haya interacción real.

### 3.3 Layouts Anidados

```
RootLayout (frontend/src/app/layout.tsx)
├── HTML, body, fonts, metadata global
│
├── LandingLayout (frontend/src/app/[locale]/layout.tsx)
│   ├── Header (logo, nav, language switcher)
│   ├── {children} (página actual)
│   ├── Footer
│   └── Google Analytics (Script)
│
└── AdminLayout (frontend/src/app/admin/layout.tsx)
    ├── AuthGuard (redirect a /admin/login si no hay sesión)
    ├── Sidebar (navegación)
    ├── Navbar (usuario, logout)
    └── {children} (página actual)
    └── Google Analytics (enlace externo en el sidebar)
```

### 3.4 Data Fetching

- **Landing Page (pública):** Los Server Components (`frontend/src/app/[locale]/`) consultan Supabase **directamente** usando el cliente de `frontend/src/lib/supabase/server.ts`. No pasan por las API Routes públicas, evitando un round-trip innecesario.
- **Panel Admin (privada):** Los Client Components (`frontend/src/app/admin/`) hacen `fetch()` a los endpoints privados `/api/private/*` con el token JWT en headers.
- **API Routes (privadas):** Los Route Handlers (`frontend/src/app/api/private/*`) delegan en los servicios de `backend/src/services/` y usan el cliente `backend/src/lib/supabase/admin.ts` (service_role) para operaciones CRUD.

---

## 4. Backend — Next.js API Routes

### 4.1 Estructura de `/api`

```
frontend/src/app/api/
├── public/          # Sin autenticación
│   └── [resource]/ # GET (listar)
│       ├── route.ts
│       └── [id]/   # GET (obtener uno)
│           └── route.ts
│
└── private/         # Con autenticación JWT (verify)
    └── [resource]/ # GET, POST, PUT, DELETE
        ├── route.ts
        └── [id]/   # GET (obtener uno), PUT, DELETE
            └── route.ts
```

### 4.2 Middleware de Autenticación

- El middleware de Next.js (`frontend/src/middleware.ts`) protege las rutas `/admin` y `/api/private/*`
- Verifica la presencia y validez del token JWT en cookies
- Redirige a `/admin/login` si no hay sesión válida
- Para API Routes privadas, verifica el token en el header `Authorization: Bearer <token>`

### 4.3 Separación Lógica

Cada endpoint de API Route delega en la capa de servicios:

```
Route Handler (frontend/src/app/api/*/route.ts)
    → validación de input (Zod: shared/src/validators/)
        → Service Layer (backend/src/services/*.ts)
            → Supabase Admin Client (backend/src/lib/supabase/admin.ts)
                → PostgreSQL
```

---

## 5. Base de Datos — Supabase (PostgreSQL)

### 5.1 Esquema General

El esquema completo se define en `backend/docs/02-DATABASE.md`. Las tablas principales son:

- `users`
- `personal_info`
- `personal_info`
- `personal_info_translations` (content JSONB)
- `skills`
- `projects`
- `project_translations` (content JSONB)
- `project_skills` (relación N:M)
- `saas_projects`
- `saas_project_translations` (content JSONB)
- `saas_project_skills` (relación N:M)
- `technologies`
- `services`
- `service_translations` (content JSONB)
- `education`

### 5.2 Row Level Security (RLS)

- **Tablas públicas:** Políticas de lectura pública (`SELECT` permitido para anon). Escritura solo con `service_role` (API privada).
- **Tablas privadas:** Sin acceso público. Solo accesibles desde el servidor via `service_role` key.
- **`users`:** Solo accesible por el propio usuario autenticado.

### 5.3 Conexión desde Next.js

- **Server Components (Landing Page):** Usar `frontend/src/lib/supabase/server.ts` (`@supabase/ssr` con anon key)
- **Client Components (Admin Panel):** Usar `frontend/src/lib/supabase/client.ts` (`@supabase/ssr` browser)
- **Operaciones administrativas (API Routes):** Usar `backend/src/lib/supabase/admin.ts` (`service_role` key, bypass de RLS)

---

## 6. Almacenamiento — Supabase Storage

### 6.1 Buckets

| Bucket | Visibilidad | Contenido |
|---|---|---|
| `profile` | Público | Avatar/imagen de perfil |
| `projects` | Público | Imágenes y capturas de proyectos |
| `cv` | Público | Currículum vitae (PDF) |

### 6.2 Políticas de Acceso

- **Lectura pública:** Todos los buckets son de lectura pública (GET permitido para anon)
- **Escritura restringida:** Solo desde el servidor (API privada con service_role)

---

## 7. Autenticación — Supabase Auth + JWT

### 7.1 Flujo de Login

```
Usuario → /admin/login → ingresa email + password
    → Supabase Auth (signInWithPassword)
        → Devuelve session con access_token + refresh_token
            → Se almacenan en cookies (httpOnly)
                → Redirección a /admin/dashboard
```

### 7.2 Protección de Rutas

- **Middleware de Next.js:** Verifica session en cookies para rutas `/admin` y `/api/private/*`
- **API Routes privadas:** Verifican token JWT en header `Authorization`
- **Client Components:** Usan `@supabase/ssr` para obtener la sesión

### 7.3 Refresh Tokens

- Supabase Auth maneja automáticamente el refresh de tokens
- Las sesiones se mantienen activas mientras el refresh token sea válido
- No se requiere implementación manual de refresh tokens

---

## 8. Internacionalización — next-intl

### 8.1 Routing con Prefijo de Idioma

```
/es          → Landing Page en español
/en          → Landing Page en inglés
/pt          → Landing Page en portugués
/es/projects → Proyectos en español
/admin       → Panel admin (sin prefijo de idioma)
```

### 8.2 Archivos de Traducción

```
public/locales/
├── es.json   # Traducciones en español
├── en.json   # Traducciones en inglés
└── pt.json   # Traducciones en portugués
```

### 8.3 Server-Side Rendering de Mensajes

- next-intl carga los mensajes del idioma actual en Server Components
- Se pasa el locale a través de los parámetros de ruta `[locale]`
- Los mensajes se renderizan en el servidor, sin necesidad de JS en cliente

---

## 9. Despliegue — Vercel

### 9.1 Configuración

- **Framework:** Next.js (detección automática en Vercel)
- **Dominio:** anthekira.dev (personalizado en Vercel)
- **Deploy:** Automático desde GitHub (rama `main`)
- **Monorepo:** Vercel detecta automáticamente Next.js en la raíz del proyecto. Los directorios `frontend/`, `backend/` y `shared/` son organizativos; el build de Vercel se ejecuta desde la raíz.

### 9.2 Variables de Entorno

```
NEXT_PUBLIC_SUPABASE_URL=             # URL del proyecto Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=        # Clave anónima (pública)
SUPABASE_SERVICE_ROLE_KEY=            # Clave service_role (secreta)
NEXT_PUBLIC_GA_ID=                    # Google Analytics ID
DEEPL_API_KEY=                         # DeepL API Key (auto-traducción de contenido)
NEXT_PUBLIC_SITE_URL=https://anthekira.dev
```

### 9.3 Dominio Personalizado

- Configurar `anthekira.dev` como dominio personalizado en Vercel
- Configurar registros DNS apuntando a Vercel

---

## 10. Flujo de Datos

### 10.1 Visitante → Landing Page

```
Visitante → anthekira.dev
    → Next.js detecta locale (negociación HTTP o redirección)
        → Server Component renderiza /{lang}/
            → Consulta directa a Supabase (via @supabase/ssr)
                → PostgreSQL devuelve datos traducidos
                    → HTML renderizado en servidor (SSR/SSG)
                        → Respuesta al navegador
```

### 10.2 Admin → Panel Administrativo

```
Admin → /admin/login
    → Ingresa credenciales → Supabase Auth valida
        → JWT almacenado en cookies
            → Redirección a /admin/dashboard
                → Client Component carga página
                    → fetch() a /api/private/* con JWT
                        → Middleware verifica token
                            → Route Handler ejecuta servicio
                                → Supabase (service_role) CRUD
                                    → Respuesta JSON al cliente
```

---

## 11. Dependencias con otros documentos

| Archivo | Relación |
|---|---|
| `00-REQUIREMENTS.md` | Define los requisitos que esta arquitectura implementa |
| `02-DECISIONS.md` | Registra las decisiones que originan esta arquitectura |
| `03-USER-FLOWS.md` | Describe flujos de usuario que esta arquitectura soporta |
| `04-AI-DEVELOPMENT-GUIDE.md` | Guía para agentes IA que implementarán esta arquitectura |
| `frontend/docs/01-ROUTES.md` | Especificación detallada de rutas y navegación |
| `frontend/docs/03-LAYOUTS.md` | Especificación de layouts y jerarquía |
| `frontend/docs/04-I18N.md` | Configuración detallada de next-intl |
| `backend/docs/02-DATABASE.md` | Esquema de base de datos |
| `backend/docs/05-AUTHENTICATION.md` | Implementación detallada de auth |
