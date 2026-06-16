# 01-ROUTES.md — Anthekira.dev — Definición de Rutas

## 1. Propósito

Este documento define todas las rutas del frontend de Anthekira.dev, tanto públicas (Landing Page con i18n) como privadas (Panel Admin sin i18n), incluyendo la estructura de archivos en el App Router, metadatos SEO y protección de acceso.

---

## 2. Rutas Públicas — Landing Page (con i18n)

Todas las rutas públicas están bajo el segmento `[locale]` y soportan los idiomas: **es** (default), **en**, **pt**.

### 2.1 Estructura de Archivos

```
frontend/src/app/[locale]/
├── layout.tsx          # LandingLayout (Header + Footer + GA)
├── page.tsx            # /{lang}/ — Home (secciones completas)
├── projects/
│   ├── page.tsx        # /{lang}/projects — Grid de proyectos
│   └── [slug]/
│       └── page.tsx    # /{lang}/projects/[slug] — Detalle de proyecto
├── about/
│   └── page.tsx        # /{lang}/about — Sobre Mí
├── contact/
│   └── page.tsx        # /{lang}/contact — Formulario de contacto
└── not-found.tsx       # /{lang}/not-found — Página 404 pública
```

### 2.2 Tabla de Rutas Públicas

| Ruta | Tipo Componente | SEO Metadata | Descripción |
|---|---|---|---|
| `/{lang}/` | `[SC]` Server Component | `index, follow` | Landing Page: Hero, About, Skills, Technologies, Projects, Services, Contact |
| `/{lang}/projects` | `[SC]` Server Component | `index, follow` | Grid de proyectos destacados |
| `/{lang}/projects/[slug]` | `[SC]` Server Component | `index, follow` | Detalle completo de un proyecto |
| `/{lang}/about` | `[SC]` Server Component | `index, follow` | Información personal y profesional |
| `/{lang}/contact` | `[SC]` + `[CC]` (formulario) | `index, follow` | Formulario de contacto + redes sociales |
| `/{lang}/not-found` | `[SC]` Server Component | `noindex` | Página 404 personalizada |

### 2.3 Metadatos SEO por Ruta

Cada página debe exportar una función `generateMetadata()`:

```typescript
// Ejemplo para /{lang}/projects
export async function generateMetadata(
  { params }: { params: { locale: string } }
): Promise<Metadata> {
  // El título y descripción se obtienen de next-intl según el locale
  const t = await getTranslations({ locale: params.locale, namespace: 'projects' });

  return {
    title: t('meta.title'),       // "Projects — Anthekira.dev"
    description: t('meta.description'),
    openGraph: {
      title: t('meta.og_title'),
      description: t('meta.og_description'),
      images: [{ url: '/images/og-projects.jpg' }],
    },
    alternates: {
      languages: {
        es: '/es/projects',
        en: '/en/projects',
        pt: '/pt/projects',
      },
    },
  };
}
```

### 2.4 Redirección de Idioma por Defecto

Cuando un usuario visita `anthekira.dev` sin prefijo de idioma:

```
anthekira.dev → 302 → /es/
  └── Basado en Accept-Language del navegador
      ├── si Accept-Language es en → /en/
      ├── si Accept-Language es pt → /pt/
      └── cualquier otro → /es/ (default)
```

Esto se maneja en `frontend/src/middleware.ts` mediante la configuración de next-intl.

---

## 3. Rutas Privadas — Panel Admin (sin i18n)

El panel administrativo está en **español** exclusivamente y no tiene prefijo de idioma. Todas las rutas están protegidas por el middleware de Next.js.

### 3.1 Estructura de Archivos

```
frontend/src/app/admin/
├── login/
│   └── page.tsx        # /admin/login — Pantalla de inicio de sesión
├── layout.tsx          # AdminLayout (AuthGuard + Sidebar + Navbar)
├── page.tsx            # /admin — Dashboard (cards de resumen + GA)
├── projects/
│   ├── page.tsx        # /admin/projects — Lista CRUD
│   ├── new/
│   │   └── page.tsx    # /admin/projects/new — Crear proyecto
│   └── [id]/
│       └── page.tsx    # /admin/projects/[id] — Editar proyecto
├── saas/
│   ├── page.tsx        # /admin/saas — Lista CRUD de SaaS Projects
│   ├── new/
│   │   └── page.tsx    # /admin/saas/new — Crear proyecto SaaS
│   └── [id]/
│       └── page.tsx    # /admin/saas/[id] — Editar proyecto SaaS
├── profile/
│   └── page.tsx        # /admin/profile — Info personal, CV, skills, redes
├── settings/
│   ├── page.tsx        # /admin/settings — Configuración general
│   ├── technologies/
│   │   ├── page.tsx    # CRUD de tecnologías
│   │   ├── new/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── services/
│   │   ├── page.tsx    # CRUD de servicios
│   │   ├── new/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── media/
│   │   └── page.tsx    # Gestor de archivos multimedia
│   └── messages/
│       └── page.tsx    # Bandeja de mensajes de contacto
└── error.tsx           # 500 — Error del admin
```

### 3.2 Tabla de Rutas Privadas

| Ruta | Tipo Componente | SEO | Descripción |
|---|---|---|---|
| `/admin/login` | `[CC]` Client Component | `noindex` | Formulario de inicio de sesión |
| `/admin` | `[CC]` Client Component | `noindex` | Dashboard: cards de resumen + enlace GA |
| `/admin/projects` | `[CC]` Client Component | `noindex` | CRUD: listar, crear, editar, eliminar proyectos |
| `/admin/projects/new` | `[CC]` Client Component | `noindex` | Formulario de creación con auto-traducción |
| `/admin/projects/[id]` | `[CC]` Client Component | `noindex` | Formulario de edición (con modal de skills) |
| `/admin/saas` | `[CC]` Client Component | `noindex` | CRUD de proyectos SaaS |
| `/admin/saas/new` | `[CC]` Client Component | `noindex` | Crear proyecto SaaS (con modal de skills) |
| `/admin/saas/[id]` | `[CC]` Client Component | `noindex` | Editar proyecto SaaS |
| `/admin/profile` | `[CC]` Client Component | `noindex` | Info personal, CV, skills, redes sociales |
| `/admin/settings` | `[CC]` Client Component | `noindex` | Configuración general del sitio |
| `/admin/settings/technologies` | `[CC]` Client Component | `noindex` | CRUD de tecnologías |
| `/admin/settings/services` | `[CC]` Client Component | `noindex` | CRUD de servicios |
| `/admin/settings/media` | `[CC]` Client Component | `noindex` | Gestor de archivos multimedia |
| `/admin/settings/messages` | `[CC]` Client Component | `noindex` | Bandeja de mensajes de contacto |

### 3.3 Metadatos del Admin Layout

```typescript
// src/app/admin/layout.tsx
export const metadata: Metadata = {
  title: 'Panel Admin — Anthekira.dev',
  robots: { index: false, follow: false },  // No indexar en Google
};
```

Todas las páginas admin heredan este metadata del AdminLayout. No es necesario (ni deseable) que cada página admin defina su propio metadata SEO.

---

## 4. Middleware y Protección de Rutas

### 4.1 `frontend/src/middleware.ts`

El middleware de Next.js tiene dos responsabilidades principales:

1. **Routing de i18n:** Detectar idioma y redirigir a la ruta localizada
2. **Protección de rutas admin:** Verificar sesión JWT

```typescript
// Pseudocódigo del middleware
import createMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';

// 1. Middleware de i18n (next-intl)
const i18nMiddleware = createMiddleware({
  locales: ['es', 'en', 'pt'],
  defaultLocale: 'es',
});

// 2. Protección de rutas admin
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas admin protegidas (excepto login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get: (name) => request.cookies.get(name)?.value } }
    );
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Aplicar i18n middleware a rutas públicas
  if (!pathname.startsWith('/admin')) {
    return i18nMiddleware(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Aplicar a todas las rutas excepto archivos estáticos
    '/((?!_next/static|_next/image|favicon.ico|images/|fonts/|locales/).*)',
  ],
};
```

### 4.2 Comportamiento del Middleware

| Ruta solicitada | ¿Hay sesión? | Comportamiento |
|---|---|---|
| `/` | — | Redirige a `/{lang}/` |
| `/admin` | Sí | Muestra Dashboard |
| `/admin` | No | Redirige a `/admin/login` |
| `/admin/login` | — | Muestra login (sin protección) |
| `/api/private/*` | Sí | Permite la solicitud |
| `/api/private/*` | No | Responde 401 Unauthorized |
| `/{lang}/projects` | — | Muestra página pública (sin protección) |

---

## 5. Manejo de Errores

### 5.1 Página 404 — `not-found.tsx`

- **Ruta pública:** `src/app/[locale]/not-found.tsx`
- **Ruta admin:** Next.js muestra el 404 por defecto (sin personalizar en V1)

La página 404 pública debe:
- Mantener el diseño de la Landing (Header + Footer)
- Mostrar mensaje amigable: "Page not found"
- Incluir enlace para volver al inicio
- Usar traducciones de next-intl

### 5.2 Página 500 — `error.tsx`

- **Ruta:** `src/app/[locale]/error.tsx` (público)
- **Ruta:** `src/app/admin/error.tsx` (admin)

Ambas deben:
- Mostrar mensaje genérico: "Something went wrong"
- Incluir botón "Try again" (recarga la página)
- En producción, no mostrar detalles del error

---

## 6. Dependencias con otros documentos

| Archivo | Relación |
|---|---|
| `00-REQUIREMENTS.md` | Define las funcionalidades que estas rutas exponen |
| `01-ARCHITECTURE.md` | Define la estructura del App Router que implementa estas rutas |
| `03-USER-FLOWS.md` | Describe los flujos de navegación del usuario |
| `frontend/00-FRONTEND.md` | Configuración global del frontend |
| `frontend/02-COMPONENTS.md` | Componentes que renderizan estas rutas |
| `frontend/03-LAYOUTS.md` | Layouts que envuelven estas rutas |
| `frontend/04-I18N.md` | Configuración de next-intl para el routing localizado |
| `frontend/05-SEO.md` | Metadatos y generación de sitemap |
