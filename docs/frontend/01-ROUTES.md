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
│   └── page.tsx          # /admin/login
├── layout.tsx            # AdminLayout (AuthGuard + Sidebar + Navbar)
├── page.tsx              # /admin — Dashboard
├── projects/
│   ├── page.tsx          # /admin/projects
│   ├── new/page.tsx      # /admin/projects/new
│   └── [id]/page.tsx     # /admin/projects/[id]
├── saas/
│   ├── page.tsx          # /admin/saas
│   ├── new/page.tsx      # /admin/saas/new
│   └── [id]/page.tsx     # /admin/saas/[id]
├── profile/page.tsx      # /admin/profile
├── education/
│   ├── page.tsx          # /admin/education
│   ├── new/page.tsx      # /admin/education/new
│   └── [id]/page.tsx     # /admin/education/[id]
├── technologies/
│   ├── page.tsx          # /admin/technologies
│   ├── new/page.tsx      # /admin/technologies/new
│   └── [id]/page.tsx     # /admin/technologies/[id]
├── services/
│   ├── page.tsx          # /admin/services
│   ├── new/page.tsx      # /admin/services/new
│   └── [id]/page.tsx     # /admin/services/[id]
├── skills/
│   ├── page.tsx          # /admin/skills
│   ├── new/page.tsx      # /admin/skills/new
│   └── [id]/page.tsx     # /admin/skills/[id]
└── error.tsx             # 500 admin
```

| Ruta | Tipo | SEO |
|---|---|---|
| `/admin/login` | `[CC]` | noindex |
| `/admin` | `[CC]` | noindex |
| `/admin/projects` | `[CC]` | noindex |
| `/admin/projects/new` | `[CC]` | noindex |
| `/admin/projects/[id]` | `[CC]` | noindex |
| `/admin/saas` | `[CC]` | noindex |
| `/admin/profile` | `[CC]` | noindex |
| `/admin/education` | `[CC]` | noindex |
| `/admin/technologies` | `[CC]` | noindex |
| `/admin/services` | `[CC]` | noindex |
| `/admin/skills` | `[CC]` | noindex |

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
