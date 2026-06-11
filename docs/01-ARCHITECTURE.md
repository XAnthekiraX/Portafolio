# 01-ARCHITECTURE.md — Anthekira.dev

## 1. Visión General de la Arquitectura

Anthekira.dev es un monorepo de Next.js que unifica frontend (Landing Page + Panel Admin) y backend (API Routes) en un solo proyecto desplegado en Vercel. La base de datos y el almacenamiento de archivos están alojados en Supabase.

### 1.1 Diagrama Conceptual

```
[Browser]
    │
    ├── Landing Page (/{lang}/)
    │       └── Server Components → consulta directa → Supabase (DB)
    │
    └── Panel Admin (/admin)
            │
            ├── Client Components → fetch() → API Privada (/api/private/*)
            │                                           │
            └── Login → Supabase Auth → JWT ────────────┘
                                                        │
                                              [Next.js API Routes]
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
| **Simplicidad** | Monorepo único. Evitar microservicios o backends separados innecesarios |
| **Bajo costo** | Todo en Vercel (plan Hobby/Pro) + Supabase (plan Free) |
| **Mantenibilidad** | Separación clara de responsabilidades por carpeta y naming |
| **Performance** | Server Components para datos públicos, Client Components solo cuando sea necesario |
| **Escalabilidad i18n** | next-intl con archivos JSON de traducción, agregar idiomas sin cambiar código |

---

## 2. Estructura del Proyecto (Monorepo Next.js)

```
anthekira.dev/
├── .env.local                  # Variables de entorno (local)
├── .env.production             # Variables de entorno (producción)
├── next.config.ts              # Configuración de Next.js
├── tsconfig.json               # Configuración de TypeScript
│
├── public/
│   ├── locales/                # Archivos de traducción (next-intl)
│   │   ├── es.json
│   │   ├── en.json
│   │   └── pt.json
│   ├── images/                 # Imágenes estáticas (favicon, og-default, etc.)
│   └── fonts/                  # Fuentes auto-hospedadas (opcional)
│
├── src/
│   ├── app/                    # App Router (rutas y páginas)
│   │   ├── [locale]/           # Rutas localizadas (/{lang}/)
│   │   │   ├── layout.tsx      # Landing Layout (header + footer)
│   │   │   ├── page.tsx        # Landing Page principal (/)
│   │   │   ├── projects/
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   └── not-found.tsx
│   │   ├── admin/              # Panel administrativo (sin i18n)
│   │   │   ├── login/
│   │   │   ├── layout.tsx      # Admin Layout (sidebar + navbar)
│   │   │   ├── page.tsx        # Dashboard
│   │   │   ├── projects/       # CRUD de proyectos (con modal de skills)
│   │   │   ├── saas/           # CRUD de proyectos SaaS
│   │   │   ├── profile/        # Info personal, CV, skills, redes
│   │   │   └── settings/       # General, tecnologías, servicios, media, mensajes
│   │   └── api/                # API Routes
│   │       ├── public/         # Endpoints públicos (sin auth)
│   │       │   ├── personal-info/
│   │       │   ├── projects/
│   │       │   ├── skills/
│   │       │   ├── services/
│   │       │   ├── technologies/
│   │       │   ├── saas/
│   │       │   └── contact/    # POST - formulario de contacto
│   │       └── private/        # Endpoints privados (con auth JWT)
│   │           ├── admin/login/
│   │           ├── personal-info/
│   │           ├── cv/
│   │           ├── projects/
│   │           ├── saas/
│   │           ├── skills/
│   │           ├── technologies/
│   │           ├── services/
│   │           ├── media/
│   │           ├── messages/
│   │           ├── settings/
│   │           └── active/count/
│   │
│   ├── components/             # Componentes React reutilizables
│   │   ├── ui/                 # Componentes atómicos (Button, Card, Input, etc.)
│   │   ├── landing/            # Componentes específicos de la Landing Page
│   │   │   ├── Hero/
│   │   │   ├── About/
│   │   │   ├── Skills/
│   │   │   ├── Technologies/
│   │   │   ├── Projects/
│   │   │   ├── Services/
│   │   │   ├── Contact/
│   │   │   └── Footer/
│   │   ├── admin/              # Componentes específicos del Panel Admin
│   │   │   ├── Sidebar/
│   │   │   ├── Navbar/
│   │   │   ├── DataTable/
│   │   │   ├── FormBuilder/
│   │   │   └── Analytics/
│   │   └── shared/             # Componentes compartidos (Header, LanguageSwitcher, etc.)
│   │
│   ├── lib/                    # Lógica compartida (utilidades, helpers)
│   │   ├── supabase/
│   │   │   ├── client.ts       # Cliente Supabase para Client Components (browser)
│   │   │   ├── server.ts       # Cliente Supabase para Server Components (SSR)
│   │   │   └── admin.ts        # Cliente Supabase con service_role (solo server)
│   │   ├── auth/
│   │   │   ├── jwt.ts          # Utilidades JWT
│   │   │   └── verify.ts       # Middleware de autenticación para API
│   │   ├── i18n.ts             # Configuración de next-intl
│   │   └── utils.ts            # Utilidades generales
│   │
│   ├── services/               # Capa de servicios (lógica de negocio)
│   │   ├── personal-info.ts
│   │   ├── projects.ts
│   │   ├── skills.ts
│   │   ├── technologies.ts
│   │   ├── services.ts
│   │   ├── contact.ts
│   │   └── auth.ts
│   │
│   ├── types/                  # Tipos de TypeScript compartidos
│   │   ├── index.ts            # Tipos globales
│   │   ├── entities.ts         # Interfaces de entidades (DB)
│   │   ├── api.ts              # Tipos de request/response de API
│   │   └── i18n.d.ts           # Tipos para traducciones
│   │
│   └── middleware.ts           # Next.js Middleware (protección de rutas, i18n routing)
│
├── docs/                       # Documentación del proyecto
├── package.json
└── README.md
```

### 2.1 Propósito de Carpetas Raíz

| Carpeta | Propósito |
|---|---|
| `src/app/[locale]` | Páginas públicas de la Landing Page con i18n |
| `src/app/admin` | Panel administrativo (sin prefijo de idioma) |
| `src/app/api` | API Routes públicas y privadas |
| `src/components` | Componentes React organizados por dominio |
| `src/lib` | Utilidades compartidas (Supabase clients, auth, i18n) |
| `src/services` | Lógica de negocio (capa de servicios) |
| `src/types` | Definiciones de tipos TypeScript |
| `public/locales` | Archivos de traducción JSON |

---

## 3. Frontend — Next.js App Router

### 3.1 Organización por Rutas

| Ruta | Tipo | Descripción |
|---|---|---|
| `/{lang}/` | Server Component | Landing Page principal |
| `/{lang}/projects` | Server Component | Página de proyectos (SEO) |
| `/{lang}/about` | Server Component | Página Sobre Mí (SEO) |
| `/{lang}/contact` | Server Component | Página de contacto (SEO) |
| `/admin/login` | Client Component | Login del panel admin |
| `/admin` | Client Component | Dashboard con enlace externo a Google Analytics |
| `/admin/*` | Client Component | CRUDs de gestión de contenido |

### 3.2 Server Components vs Client Components

- **Server Components (default):** Toda la Landing Page pública. Consulta directa a Supabase desde el servidor (sin pasar por API Routes). Sin JavaScript hasta que sea necesario.
- **Client Components (`use client`):** Panel admin, formularios, interactividad (hover effects, scroll reveal, microinteracciones), LanguageSwitcher.
- **Estrategia:** Máximo contenido renderizado en servidor. Solo enviar JavaScript al cliente cuando haya interacción real.

### 3.3 Layouts Anidados

```
RootLayout (src/app/layout.tsx)
├── HTML, body, fonts, metadata global
│
├── LandingLayout (src/app/[locale]/layout.tsx)
│   ├── Header (logo, nav, language switcher)
│   ├── {children} (página actual)
│   ├── Footer
│   └── Google Analytics (Script)
│
└── AdminLayout (src/app/admin/layout.tsx)
    ├── AuthGuard (redirect a /admin/login si no hay sesión)
    ├── Sidebar (navegación)
    ├── Navbar (usuario, logout)
    └── {children} (página actual)
    └── Google Analytics (enlace externo en el sidebar)
```

### 3.4 Data Fetching

- **Landing Page (pública):** Los Server Components consultan Supabase **directamente** desde el servidor. No pasan por las API Routes públicas, evitando un round-trip innecesario.
- **Panel Admin (privada):** Los Client Components hacen `fetch()` a los endpoints privados `/api/private/*` con el token JWT en headers.

---

## 4. Backend — Next.js API Routes

### 4.1 Estructura de `/api`

```
src/app/api/
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

- El middleware de Next.js (`src/middleware.ts`) protege las rutas `/admin` y `/api/private/*`
- Verifica la presencia y validez del token JWT en cookies
- Redirige a `/admin/login` si no hay sesión válida
- Para API Routes privadas, verifica el token en el header `Authorization: Bearer <token>`

### 4.3 Separación Lógica

Cada endpoint de API Route delega en la capa de servicios:

```
Route Handler (route.ts)
    → validación de input (Zod o manual)
        → Service Layer (src/services/*.ts)
            → Supabase Client (src/lib/supabase/*.ts)
                → PostgreSQL
```

---

## 5. Base de Datos — Supabase (PostgreSQL)

### 5.1 Esquema General

El esquema completo se define en `backend/02-DATABASE.md`. Las tablas principales son:

- `users`
- `personal_info`
- `personal_info`
- `personal_info_translations`
- `skills`
- `projects`
- `project_translations`
- `project_skills` (relación N:M)
- `saas_projects`
- `saas_project_translations`
- `saas_project_skills` (relación N:M)
- `technologies`
- `services`
- `service_translations`
- `media`
- `contact_messages`
- `settings`

### 5.2 Row Level Security (RLS)

- **Tablas públicas:** Políticas de lectura pública (`SELECT` permitido para anon). Escritura solo con `service_role` (API privada).
- **Tablas privadas:** Sin acceso público. Solo accesibles desde el servidor via `service_role` key.
- **`users`:** Solo accesible por el propio usuario autenticado.

### 5.3 Conexión desde Next.js

- **Server Components y Route Handlers:** Usar `@supabase/ssr` (cliente server-side oficial)
- **Client Components:** Usar `@supabase/ssr` con cookies de sesión
- **Operaciones administrativas (server-side):** Usar `service_role` key para bypass de RLS

---

## 6. Almacenamiento — Supabase Storage

### 6.1 Buckets

| Bucket | Visibilidad | Contenido |
|---|---|---|
| `profile` | Público | Avatar/imagen de perfil |
| `projects` | Público | Imágenes y capturas de proyectos |
| `media` | Público | Recursos visuales generales |
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
| `frontend/01-ROUTES.md` | Especificación detallada de rutas y navegación |
| `frontend/03-LAYOUTS.md` | Especificación de layouts y jerarquía |
| `frontend/04-I18N.md` | Configuración detallada de next-intl |
| `backend/02-DATABASE.md` | Esquema de base de datos |
| `backend/05-AUTHENTICATION.md` | Implementación detallada de auth |
