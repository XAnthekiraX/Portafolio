# 08-ADMIN-PANEL.md — Anthekira.dev — Panel Administrativo

## 1. Propósito

Este documento define la funcionalidad completa del panel administrativo de Anthekira.dev. El panel está diseñado para un único administrador con interfaz en español, estilo dashboard SaaS profesional, y acceso a todas las operaciones de gestión de contenido del portafolio.

---

## 2. Estructura del Sidebar

```
┌──────────────────────────────┐
│  Anthekira                   │
│                              │
│  📊 Dashboard               │
│  📁 Projects                │
│  🚀 SaaS Projects           │
│  👤 Profile                 │
│  🎓 Education               │
│  🛠️  Technologies           │
│  🏢 Services                │
│  💻 Skills                  │
│  ─────────────────          │
│  📊 Google Analytics        │
│  ─────────────────          │
│  🚪 Sign Out                │
└──────────────────────────────┘
```

| Sección | Ruta | Descripción |
|---|---|---|
| **Dashboard** | `/admin` | Vista general con cards de resumen y enlace a Google Analytics |
| **Projects** | `/admin/projects` | CRUD de proyectos destacados con gestión de skills vía modal |
| **SaaS Projects** | `/admin/saas` | CRUD de proyectos SaaS (nombre, descripción, imagen, URL, estado, etc.) |
| **Profile** | `/admin/profile` | Información personal, CV, skills, redes sociales |
| **Education** | `/admin/education` | CRUD de formación académica (institución, título, descripción) |
| **Technologies** | `/admin/technologies` | CRUD de tecnologías y herramientas |
| **Services** | `/admin/services` | CRUD de servicios profesionales ofrecidos |
| **Skills** | `/admin/skills` | CRUD de habilidades técnicas categorizadas |

---

## 3. Login (`/admin/login`)

### 3.1 Flujo
```
Admin → /admin/login
  → Ingresa email + password
    → POST /api/private/admin/login
      → Supabase Auth: signInWithPassword()
        → (éxito) Redirige a /admin
        → (error) Muestra "Invalid credentials"
```

### 3.2 Diseño
```
┌──────────────────────────────┐
│                              │
│   ╔══════════════════════╗   │
│   ║   Login                ║   │
│   ║                        ║   │
│   ║   Email                ║   │
│   ║   [________________]   ║   │
│   ║                        ║   │
│   ║   Password             ║   │
│   ║   [________________]   ║   │
│   ║                        ║   │
│   ║   [ Sign In ]          ║   │
│   ╚══════════════════════╝   │
│                              │
│     ← Back to homepage       │
└──────────────────────────────┘
```

---

## 4. Dashboard (`/admin`)

### 4.1 Descripción
Pantalla principal después del login. Muestra información general del proyecto en cards visuales.

### 4.2 Cards de Resumen

```
┌──────────┬──────────┬──────────┐
│  📁 12   │  🚀 3    │  🛠️  15  │
│ Projects │ SaaS     │ Techs    │
└──────────┴──────────┴──────────┘
```

| Card | Fuente | Descripción |
|---|---|---|
| **Projects** | `GET /api/private/stats/count` → `total_projects` | Total de proyectos |
| **SaaS Projects** | `GET /api/private/stats/count` → `total_saas` | Total de proyectos SaaS |
| **Technologies** | `GET /api/private/stats/count` → `total_technologies` | Total de tecnologías |

### 4.3 Google Analytics
Card que abre Google Analytics en nueva pestaña.

---

## 5. CRUD de Projects (`/admin/projects`)

### 5.1 Lista (`/admin/projects`)

```
GET /api/private/projects
→ Renderiza DataTable con columnas:
  | Name       | Skills        | Status   | Updated     | Actions      |
  |────────────|───────────────|──────────|─────────────|──────────────|
  | Project A  | React, Node   | Active   | 2025-06-01  | [Edit][Del]  |
  | Project B  | Python        | Draft    | 2025-05-28  | [Edit][Del]  |
  |────────────|───────────────|──────────|─────────────|──────────────|
  |                                           [New Project] →            |
```

### 5.2 Crear (`/admin/projects/new`)

```
POST /api/private/projects
→ FormBuilder con campos:

  ┌──────────────────────────────────────────────┐
  │ Project Information                          │
  │                                              │
  │ Title *                 [______________]     │
  │ Description *           [______________]     │
  │                        (textarea)            │
  │                                              │
  │ Slug *                 [project-slug]        │
  │ Project URL            [______________]      │
  │ Repository URL         [______________]      │
  │                                              │
  │ Image                   [Select Media]       │
  │                                              │
  │ Status *                [Active ▼]           │
  │                                              │
  │ Skills                  [Manage Skills →]    │
  │                         (abre modal)         │
  │                                              │
  │ [ Cancel ]            [ Save ]               │
  └──────────────────────────────────────────────┘
```

### 5.3 Modal de Skills

Al hacer clic en "Manage Skills", se abre un modal:

```
┌──────────────────────────────────────────────┐
│ Manage Skills                          [X]   │
│                                              │
│ Search: [________________]                   │
│                                              │
│ ┌────────────────────────────────────────┐   │
│ │ ☑ React          ☑ Node.js            │   │
│ │ ☑ TypeScript     ☐ Python             │   │
│ │ ☑ PostgreSQL     ☐ Docker             │   │
│ │ ☐ AWS            ☐ GraphQL            │   │
│ └────────────────────────────────────────┘   │
│                                              │
│ Selected: React, Node.js, TypeScript,        │
│           PostgreSQL                         │
│                                              │
│           [Cancel]  [Apply]                  │
└──────────────────────────────────────────────┘
```

- Skills se cargan de `GET /api/private/skills`
- Selección múltiple con checkboxes
- Búsqueda/filtro de skills
- Al aplicar, se asocian al proyecto (relación N:M)

### 5.4 Auto-traducción
Al guardar, el backend:
1. Guarda título y descripción en español
2. Envía a DeepL API → EN y PT
3. Guarda traducciones en `project_translations`

---

## 6. CRUD de SaaS Projects (`/admin/saas`)

### 6.1 Lista (`/admin/saas`)

```
GET /api/private/saas
→ Renderiza DataTable con columnas:
  | Name         | Status    | URL              | Updated     | Actions    |
  |──────────────|───────────|──────────────────|─────────────|────────────|
  | App Alpha    | Live      | alpha.example.com| 2025-06-01  | [Edit][Del]|
  | App Beta     | Beta      | beta.example.com | 2025-05-28  | [Edit][Del]|
  |──────────────|───────────|──────────────────|─────────────|────────────|
  |                                              [New SaaS Project] →    |
```

### 6.2 Crear (`/admin/saas/new`)

```
POST /api/private/saas
→ FormBuilder con campos:

  ┌──────────────────────────────────────────────┐
  │ SaaS Project Information                     │
  │                                              │
  │ Name *                  [______________]     │
  │ Description *           [______________]     │
  │                        (textarea)            │
  │                                              │
  │ URL *                  [______________]      │
  │ Image                   [Select Media]       │
  │                                              │
  │ Status *                [Live ▼]             │
  │                         (Live, Beta,         │
  │                          Development,        │
  │                          Planning)           │
  │                                              │
  │ Features                [Feature 1] [+]      │
  │                         (tag input, una      │
  │                          feature por tag)    │
  │                                              │
  │ Skills                  [Manage Skills →]    │
  │                         (abre modal)         │
  │                                              │
  │ [ Cancel ]            [ Save ]               │
  └──────────────────────────────────────────────┘
```

### 6.3 Auto-traducción
Al guardar, el backend auto-traduce name y description a EN y PT.

---

## 7. Profile (`/admin/profile`)

### 7.1 Descripción
Gestión completa de la información del usuario: datos personales, CV, skills, redes sociales.

### 7.2 Secciones del Profile

```
┌──────────────────────────────────────────────┐
│ Profile                                       │
│                                              │
│ ┌────────────────────────────────────────┐   │
│ │ 📋 Personal Info                       │   │
│ │ Name, Title, Bio, Location, Email      │   │
│ │ Avatar, Current Status                 │   │
│ └────────────────────────────────────────┘   │
│                                              │
│ ┌────────────────────────────────────────┐   │
│ │ 📄 CV                                  │   │
│ │ Upload/Replace CV (PDF)                │   │
│ │ Current: anthekira-cv.pdf              │   │
│ └────────────────────────────────────────┘   │
│                                              │
│ ┌────────────────────────────────────────┐   │
│ │ 🔗 Social Links                        │   │
│ │ GitHub URL    [______________]         │   │
│ │ LinkedIn URL  [______________]         │   │
│ │ Twitter URL   [______________]         │   │
│ │ Website URL   [______________]         │   │
│ └────────────────────────────────────────┘   │
│                                              │
│                    [ Save Profile ]           │
└──────────────────────────────────────────────┘
```

### 7.3 Personal Info (incluye CV y redes sociales)

```
GET /api/private/personal-info → datos actuales (nombre, bio, avatar, cv_url, redes, etc.)
PUT /api/private/personal-info → actualizar todo (merge parcial de social_links)
```

| Campo | Tipo | Descripción |
|---|---|---|
| Name | `text` | Nombre completo |
| Professional Title | `text` | "Full-Stack Developer" |
| Bio (ES) | `textarea` | Biografía → auto-traducción a EN + PT |
| Current Status | `text` | "Open to work", "Freelance", etc. |
| Avatar | `image` | Imagen de perfil |
| Email | `email` | Email de contacto público |
| Location | `text` | Ciudad/País |
| CV URL | `url` | URL del CV descargable |

### 7.4 Social Links

```
GET /api/private/personal-info → incluye social_links
PUT /api/private/personal-info → actualiza social_links (merge parcial)
```

| Campo | Tipo | Requerido |
|---|---|---|
| GitHub URL | `url` | No |
| LinkedIn URL | `url` | No |
| Twitter URL | `url` | No |
| Website URL | `url` | No |

---

## 8. Skills Management (`/admin/skills`)

### 8.1 Descripción
Gestión centralizada de todas las skills del usuario.

### 8.2 CRUD

```
GET /api/private/skills → lista de skills
POST /api/private/skills → crear skill
PUT /api/private/skills/[id] → actualizar skill
DELETE /api/private/skills/[id] → eliminar skill
```

**Skills por categoría:**

| Categoría | Ejemplo | Color Badge |
|---|---|---|
| Frontend | React, TypeScript, Vue | `primary` (rojo) |
| Backend | Node.js, Python, Go | `accent` (cian) |
| DevOps | Docker, AWS, CI/CD | `success` (verde) |
| Tools | Git, VS Code, Figma | `default` (neutro) |

---

## 9. Education (`/admin/education`)

### 9.1 Descripción
Gestión de la formación académica. Sin traducción (solo en español).

### 9.2 Lista (`/admin/education`)

```
GET /api/private/education
→ Renderiza DataTable con columnas:
  | Institution           | Degree              | Updated     | Actions      |
  |───────────────────────|─────────────────────|─────────────|──────────────|
  | Universidad X         | Ing. en Sistemas    | 2025-06-01  | [Edit][Del]  |
  | Curso Online          | React Avanzado      | 2025-05-28  | [Edit][Del]  |
  |───────────────────────|─────────────────────|─────────────|──────────────|
  |                                              [New Education] →         |
```

### 9.3 Crear/Editar

```
POST /api/private/education
PUT /api/private/education/[id]
→ FormBuilder con campos:

  ┌──────────────────────────────────────────────┐
  │ Education                                    │
  │                                              │
  │ Institution *           [________________]   │
  │ Degree *                [________________]   │
  │ Description             [________________]   │
  │                         (textarea, corto)    │
  │                                              │
  │ Website URL             [________________]   │
  │ Logo URL                [________________]   │
  │                                              │
  │ [ Cancel ]            [ Save ]               │
  └──────────────────────────────────────────────┘
```

- Sin auto-traducción (contenido solo en español)
- `display_order` se asigna automáticamente al final de la lista

---

## 10. Technologies (`/admin/technologies`)

### 10.1 Descripción
Gestión de tecnologías y herramientas utilizadas.

### 10.2 CRUD

```
GET /api/private/technologies → lista
POST /api/private/technologies → crear
PUT /api/private/technologies/[id] → actualizar
DELETE /api/private/technologies/[id] → eliminar
```

| Campo | Tipo | Requerido |
|---|---|---|
| Name | `text` | Sí |
| Icon | `image` | No |
| Website URL | `url` | No |

---

## 11. Services (`/admin/services`)

### 11.1 Descripción
Gestión de servicios profesionales ofrecidos.

### 11.2 CRUD

```
GET /api/private/services → lista
POST /api/private/services → crear
PUT /api/private/services/[id] → actualizar
DELETE /api/private/services/[id] → eliminar
```

| Campo | Tipo | Requerido | Auto-traducción |
|---|---|---|---|
| Title (ES) | `text` | Sí | → EN + PT |
| Description (ES) | `textarea` | Sí | → EN + PT |
| Icon | `select` (Lucide icons) | Sí | No |
| Status | `select` (Available, Coming Soon) | Sí | No |

---

## 12. Resumen de Endpoints

| Recurso | GET (list) | POST | PUT `[id]` | DELETE `[id]` |
|---|---|---|---|---|
| `/api/private/personal-info` | ✅ | — | ✅ | — |
| `/api/private/projects` | ✅ | ✅ | ✅ | ✅ |
| `/api/private/saas` | ✅ | ✅ | ✅ | ✅ |
| `/api/private/skills` | ✅ | ✅ | ✅ | ✅ |
| `/api/private/education` | ✅ | ✅ | ✅ | ✅ |
| `/api/private/technologies` | ✅ | ✅ | ✅ | ✅ |
| `/api/private/services` | ✅ | ✅ | ✅ | ✅ |
| `/api/private/stats/count` | ✅ | — | — | — |
| `/api/private/admin/login` | — | ✅ | — | — |

---

## 13. Dependencias con otros documentos

| Archivo | Relación |
|---|---|
| `00-REQUIREMENTS.md` | Requisitos del panel admin |
| `03-USER-FLOWS.md` | Flujos de usuario del admin |
| `frontend/docs/01-ROUTES.md` | Rutas del admin |
| `frontend/docs/02-COMPONENTS.md` | Componentes (DataTable, FormBuilder, FileUploader, Modal) |
| `frontend/docs/03-LAYOUTS.md` | AdminLayout con Sidebar y Navbar |
| `frontend/docs/06-UI-UX.md` | Diseño visual del admin |
| `backend/docs/04-API-PRIVATE.md` | Endpoints privados del admin |
| `backend/docs/06-BUSINESS-LOGIC.md` | Lógica de negocio (auto-traducción, validaciones) |
