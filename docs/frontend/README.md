# Frontend — Portfolio

## Stack

| Herramienta | Versión |
|---|---|
| [Vite](https://vitejs.dev/) | Última |
| [React](https://react.dev/) | 19+ |
| [TypeScript](https://www.typescriptlang.org/) | 5+ |
| [Tailwind CSS](https://tailwindcss.com/) | v4 |
| [React Router](https://reactrouter.com/) | 7+ |
| [Ky](https://github.com/sindresorhus/ky) | Última |
| [TanStack Query](https://tanstack.com/query) | 5+ |
| [Lucide React](https://lucide.dev/) | Última |

## Creación del proyecto

```bash
npm create vite@latest . -- --template react-ts
npm install
npm install tailwindcss @tailwindcss/vite
npm install react-router-dom
npm install ky @tanstack/react-query lucide-react
```

Agregar el plugin de Tailwind en `vite.config.ts`:

```ts
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

Importar Tailwind en `src/index.css`:

```css
@import "tailwindcss";
```

## Iconos dinámicos

Los nombres de iconos vienen desde la API como strings. Se resuelven en runtime con Lucide mediante un wrapper:

**`src/components/ui/Icon.tsx`:**

```tsx
import * as LucideIcons from 'lucide-react'

interface IconProps {
  name: string
  className?: string
  size?: number
}

export const Icon = ({ name, className, size = 24 }: IconProps) => {
  const LucideIcon = (LucideIcons as Record<string, React.ComponentType<{ className?: string; size?: number }>>)[name]
  if (!LucideIcon) return null
  return <LucideIcon className={className} size={size} />
}
```

**Uso:**

```tsx
<Icon name="Github" className="size-5" />
<Icon name={skill.icon} className="size-6 text-blue-400" />
```

Si el nombre no existe en Lucide, no renderiza nada (no rompe).

## Arquitectura de routing

La aplicación tiene dos grupos de rutas bien diferenciados: **público** y **admin**.

### Diagrama de componentes

```
main.tsx
└── BrowserRouter
    └── AuthProvider
        └── Routes
            ├── PublicLayout
            │   └── / → HomePage
            │
            ├── /admin/login → LoginPage (standalone, sin layout admin)
            │
            └── ProtectedRoute (guarda auth)
                └── AdminLayout
                    ├── /admin → Dashboard
                    ├── /admin/profile → Profile
                    ├── /admin/skills → Skills
                    ├── /admin/cv → CV
                    ├── /admin/education → Education
                    ├── /admin/technologies → Technologies
                    ├── /admin/projects → Projects
                    └── /admin/services → Services
```

### Flujo de autenticación

```
Visitante navega a /admin
         │
         ▼
  ProtectedRoute verifica token
         │
    ┌────┴────┐
    │         │
   No        Sí
    │         │
    ▼         ▼
  Redirect   Renderiza
  a /admin/  AdminLayout
  login      con vista
    │         solicitada
    ▼
  LoginPage
  (sin sidebar,
   sin topbar)
    │
    ▼
  POST /api/admin/auth/login
    │
    ├── Éxito → guarda token → redirect a /admin
    └── Error → muestra mensaje en LoginPage
```

### Tabla de rutas

| Ruta | Layout | Auth | Componente |
|---|---|---|---|
| `/` | `PublicLayout` | No | `HomePage` |
| `/admin/login` | Ninguno (standalone) | No | `LoginPage` |
| `/admin` | `AdminLayout` | Sí (JWT) | `Dashboard` |
| `/admin/profile` | `AdminLayout` | Sí (JWT) | `Profile` |
| `/admin/skills` | `AdminLayout` | Sí (JWT) | `Skills` |
| `/admin/cv` | `AdminLayout` | Sí (JWT) | `CV` |
| `/admin/education` | `AdminLayout` | Sí (JWT) | `Education` |
| `/admin/technologies` | `AdminLayout` | Sí (JWT) | `Technologies` |
| `/admin/projects` | `AdminLayout` | Sí (JWT) | `Projects` |
| `/admin/services` | `AdminLayout` | Sí (JWT) | `Services` |

### Comportamiento de guardia

| Ruta visitada | Autenticado | Resultado |
|---|---|---|
| `/admin` | Sí | Renderiza Dashboard |
| `/admin` | No | Redirige a `/admin/login` |
| `/admin/login` | Sí | Redirige a `/admin` |
| `/admin/login` | No | Renderiza LoginPage |

## Estructura del proyecto

```
src/
├── main.tsx                  # Entry point (BrowserRouter + AuthProvider)
├── App.tsx                   # Router setup (public + admin routes)
├── index.css                 # Tailwind base
├── layouts/
│   ├── PublicLayout.tsx      # Layout público (navbar, footer, <Outlet />)
│   └── AdminLayout.tsx       # Layout admin (sidebar, topbar, <Outlet />)
├── pages/
│   ├── public/
│   │   └── Home.tsx          # One-page portfolio (renamed from HomePage)
│   └── admin/
│       ├── LoginPage.tsx     # Login standalone (sin layout admin)
│       ├── Dashboard.tsx
│       ├── Profile.tsx
│       ├── Skills.tsx
│       ├── CV.tsx
│       ├── Education.tsx
│       ├── Technologies.tsx
│       ├── Projects.tsx
│       └── Services.tsx
├── components/
│   ├── ui/                   # Primitivas reutilizables (Button, Card, Modal…)
│   ├── public/               # Componentes del sitio público
│   └── admin/                # Componentes del panel admin
│       └── ProtectedRoute.tsx # Guard que verifica auth y redirige
├── hooks/                    # Custom hooks
├── lib/                      # Utilidades, API client
├── types/                    # TypeScript interfaces
├── context/                  # Contextos (Theme, Auth, Language)
│   └── AuthContext.tsx        # AuthProvider + useAuth hook
└── services/                 # Funciones de API
```

## Documentación

### `docs/frontend/public/`

Sitio público del portafolio — single-page application con scroll nativo, 8 secciones (Hero, About, Skills, Technologies, Projects, Education, Services, Contact), modo oscuro/claro y selector de idioma (ES/EN/PT — las traducciones se implementarán en el futuro).

- **`api/`** — Contrato REST público de solo lectura. Endpoints: `GET /api/profile`, `GET /api/skills`, `GET /api/technologies`, `GET /api/projects`, `GET /api/education`, `GET /api/services`, `GET /api/cv`, `POST /api/contact`. Sin autenticación.
- **`design/`** — Documentación UX/UI extraída del prototipo HTML (`index.html`). Cubre páginas, layouts, secciones, componentes, sistema de diseño, navegación, formularios, responsive y flujos de usuario.
- **`index.html`** — Prototipo HTML (Single Source of Truth del diseño).

### `docs/frontend/admin/`

Panel de administración — SPA con layout de sidebar + topbar, 8 vistas gestionadas mediante CRUD, autenticación JWT, modo oscuro/claro y selector de idioma.

- **`api/`** — Contrato REST privado con CRUD completo. Recursos: Auth (login/logout), Profile, Social Links, Skills, CV, Education, Technologies, Projects, Services. JWT Bearer requerido.
- **`design/`** — Documentación UX/UI del panel: dashboard con métricas, formularios de edición, tabla de proyectos, timeline educativo, etc.
- **`index.html`** — Prototipo HTML (Single Source of Truth del diseño).
