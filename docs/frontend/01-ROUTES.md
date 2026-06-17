# 01-ROUTES.md — Anthekira.dev

## 1. Rutas Públicas (con i18n)
```
frontend/src/app/[locale]/
├── layout.tsx          # LandingLayout
├── page.tsx            # /{lang}/ — Home
├── projects/
│   ├── page.tsx        # /{lang}/projects
│   └── [slug]/page.tsx # /{lang}/projects/[slug]
├── about/page.tsx      # /{lang}/about
├── contact/page.tsx    # /{lang}/contact
└── not-found.tsx       # 404 pública
```

| Ruta | Tipo | SEO |
|---|---|---|
| `/{lang}/` | `[SC]` | index, follow |
| `/{lang}/projects` | `[SC]` | index, follow |
| `/{lang}/projects/[slug]` | `[SC]` | index, follow |
| `/{lang}/about` | `[SC]` | index, follow |
| `/{lang}/contact` | `[SC]`+`[CC]` (form) | index, follow |

Redirección: `anthekira.dev` → 302 → `/{lang}/` según Accept-Language. Default: `/es/`.

## 2. Rutas Privadas (Admin, sin i18n)
```
frontend/src/app/admin/
├── login/
│   └── page.tsx            # /admin/login
├── layout.tsx              # AdminLayout (AuthGuard + Sidebar + Navbar)
├── page.tsx                # /admin — Dashboard
├── [resource]/             # CRUD genérico (projects, skills, education, technologies, services)
│   ├── page.tsx            # /admin/[resource] — GenericDataTable
│   ├── new/page.tsx        # /admin/[resource]/new — GenericForm (crear)
│   └── [id]/page.tsx       # /admin/[resource]/[id] — GenericForm (editar)
├── profile/page.tsx        # /admin/profile (personalizado, no genérico)
├── contact/
│   ├── page.tsx            # /admin/contact — Lista de mensajes
│   └── [id]/page.tsx       # /admin/contact/[id] — Detalle del mensaje
├── error.tsx               # 500 admin
└── loading.tsx             # Loading state admin
```

| Ruta | Tipo | SEO |
|---|---|---|
| `/admin/login` | `[CC]` | noindex |
| `/admin` | `[CC]` | noindex |
| `/admin/[resource]` | `[CC]` | noindex |
| `/admin/[resource]/new` | `[CC]` | noindex |
| `/admin/[resource]/[id]` | `[CC]` | noindex |
| `/admin/profile` | `[CC]` | noindex |
| `/admin/contact` | `[CC]` | noindex |
| `/admin/contact/[id]` | `[CC]` | noindex |

> **Mejora:** Las 21 páginas CRUD específicas se reemplazan por 3 páginas genéricas (`[resource]/`). La configuración de cada recurso (columnas, campos, endpoint, traducciones) se define en un archivo de configuración centralizado.

**Recursos soportados por el CRUD genérico:** `projects`, `skills`, `education`, `technologies`, `services`.
**Excepciones (requieren UI personalizada):** `profile` (merge social_links), `contact` (mensajes de terceros).

## 3. Middleware
**Responsabilidades:** 1) Proteger `/admin` (excepto `/admin/login`) y `/api/private/*`. 2) Aplicar i18n routing a rutas públicas.
```typescript
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|images/|fonts/|locales/).*)'] };
```

| Ruta | ¿Sesión? | Acción |
|---|---|---|
| `/admin/*` | Sí | Permite |
| `/admin/*` | No | → /admin/login |
| `/api/private/*` | Sí | Permite |
| `/api/private/*` | No | 401 |
| `/{lang}/*` | — | i18n routing |
