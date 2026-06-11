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
│  ⚙️  Settings               │
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
| **Settings** | `/admin/settings` | Configuración del sitio, media, mensajes, tecnologías, servicios, education |

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
┌──────────┬──────────┬──────────┬──────────┐
│  📁 12   │  🚀 3    │  ✅ 8    │  📬 5    │
│ Projects │ SaaS     │ Active   │ Messages │
└──────────┴──────────┴──────────┴──────────┘
```

| Card | Fuente | Descripción |
|---|---|---|
| **Projects** | `GET /api/private/projects/count` | Total de proyectos regulares |
| **SaaS Projects** | `GET /api/private/saas/count` | Total de proyectos SaaS |
| **Active** | `GET /api/private/active/count` | Proyectos activos (regulares + SaaS combinados) |
| **Messages** | `GET /api/private/messages/count` | Mensajes no leídos |

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

### 6.1 Descripción
Gestión de proyectos SaaS. Cada proyecto SaaS tiene información detallada: nombre, descripción, imagen, URL, estado, etc.

### 6.2 Lista (`/admin/saas`)

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

### 6.3 Crear (`/admin/saas/new`)

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

### 6.4 Modal de Skills

Al igual que en Projects, SaaS Projects incluye un modal de gestión de skills:

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
│ Selected: React, Node.js, TypeScript         │
│                                              │
│           [Cancel]  [Apply]                  │
└──────────────────────────────────────────────┘
```

- Misma funcionalidad que el modal de Projects
- Skills se cargan de `GET /api/private/skills`
- Selección múltiple con checkboxes

### 6.5 Modelo de datos

```typescript
type SaasProject = {
  id: string;
  name: string;
  description: string;
  url: string;
  image_url: string;
  status: 'live' | 'beta' | 'development' | 'planning';
  features: string[];  // Lista de características
  technology_ids: string[];
  order: number;
  created_at: string;
  updated_at: string;
};
```

### 6.5 Traducción
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
│ │ 💻 Skills                              │   │
│ │ Manage all skills by category          │   │
│ │ Frontend: [React] [TypeScript] [+]     │   │
│ │ Backend: [Node.js] [PostgreSQL] [+]    │   │
│ │ DevOps: [Docker] [AWS] [+]             │   │
│ │ Tools: [Git] [VS Code] [+]             │   │
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

### 7.3 Personal Info

```
GET /api/private/personal-info → datos actuales
PUT /api/private/personal-info → actualizar
```

| Campo | Tipo | Descripción |
|---|---|---|
| Name | `text` | Nombre completo |
| Professional Title | `text` | "Full-Stack Developer" |
| Bio (ES) | `textarea` | Biografía → auto-traducción a EN + PT |
| Current Status | `text` | "Open to work", "Freelance", etc. |
| Avatar | `image` | Imagen de perfil (FileUploader → bucket `profile`) |
| Email | `email` | Email de contacto público |
| Location | `text` | Ciudad/País |

### 7.4 CV Management

```
PUT /api/private/cv → subir/actualizar CV
GET /api/private/cv → obtener URL actual
```

- Upload de PDF (max 10MB)
- Solo un archivo activo a la vez
- Landing Page obtiene la URL vía `GET /api/public/personal-info`

### 7.5 Skills Management

Gestión centralizada de todas las skills del usuario.

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

**Modelo de datos:**

```typescript
type Skill = {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'devops' | 'tools' | 'other';
  order: number;
};
```

### 7.6 Social Links

```
GET /api/private/personal-info → incluye social_links
PUT /api/private/personal-info → actualiza social_links
```

| Campo | Tipo | Requerido |
|---|---|---|
| GitHub URL | `url` | No |
| LinkedIn URL | `url` | No |
| Twitter URL | `url` | No |
| Website URL | `url` | No |

---

## 8. Education (`/admin/education`)

### 8.1 Descripción
Gestión de la formación académica. Sin traducción (solo en español).

### 8.2 Lista (`/admin/education`)

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

### 8.3 Crear/Editar (`/admin/education/new` y `/admin/education/[id]`)

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

## 9. Settings (`/admin/settings`)

### 9.1 Descripción
Configuración general del sitio y gestión de contenido secundario.

### 9.2 Secciones

```
┌──────────────────────────────────────────────┐
│ Settings                                      │
│                                              │
│ ┌────────────────────────────────────────┐   │
│ │ ⚙️  General                             │   │
│ │ Site Name, Description, GA ID          │   │
│ └────────────────────────────────────────┘   │
│                                              │
│ ┌────────────────────────────────────────┐   │
│ │ 🛠️  Technologies                       │   │
│ │ CRUD de tecnologías (icono, nombre)    │   │
│ └────────────────────────────────────────┘   │
│                                              │
│ ┌────────────────────────────────────────┐   │
│ │ 🏢 Services                            │   │
│ │ CRUD de servicios ofrecidos            │   │
│ └────────────────────────────────────────┘   │
│                                              │
│ ┌────────────────────────────────────────┐   │
│ │ 📁 Media Library                       │   │
│ │ Upload/gestionar imágenes y docs       │   │
│ └────────────────────────────────────────┘   │
│                                              │
│ ┌────────────────────────────────────────┐   │
│ │ 📬 Messages                            │   │
│ │ Bandeja de mensajes de contacto        │   │
│ └────────────────────────────────────────┘   │
│                                              │
│                    [ Save Settings ]          │
└──────────────────────────────────────────────┘
```

### 9.3 General Settings

```
GET /api/private/settings → configuración actual
PUT /api/private/settings → actualizar
```

| Campo | Tipo | Descripción |
|---|---|---|
| Site Name | `text` | "Anthekira.dev" |
| Site Description | `textarea` | Meta description global |
| Google Analytics ID | `text` | G-XXXXXXXXXX |

### 9.4 Technologies CRUD

```
GET /api/private/technologies → lista
POST /api/private/technologies → crear
PUT /api/private/technologies/[id] → actualizar
DELETE /api/private/technologies/[id] → eliminar
```

| Campo | Tipo | Requerido |
|---|---|---|
| Name | `text` | Sí |
| Icon | `image` (FileUploader) | No |
| Website URL | `url` | No |

### 9.5 Services CRUD

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

### 9.6 Media Library

```
GET /api/private/media → lista de archivos
POST /api/private/media/upload → subir archivo
DELETE /api/private/media/[id] → eliminar
```

- Drag & drop upload
- Preview de imágenes
- Copy URL
- Validación de tipo y tamaño

**Buckets:**

| Bucket | Tipo | Tamaño max |
|---|---|---|
| `profile` | JPG, PNG, WebP | 2 MB |
| `projects` | JPG, PNG, WebP | 5 MB |
| `media` | JPG, PNG, WebP, PDF | 5 MB |
| `cv` | PDF | 10 MB |

### 9.7 Messages

```
GET /api/private/messages → lista
GET /api/private/messages/[id] → detalle
DELETE /api/private/messages/[id] → eliminar
```

- Mensajes no leídos marcados con punto rojo
- Modal de detalle
- Sin funcionalidad de respuesta (admin responde desde email)

---

## 10. Resumen de Endpoints

| Recurso | GET (list) | GET (one) | POST | PUT | DELETE |
|---|---|---|---|---|---|
| `/api/private/projects` | ✅ | ✅ `[id]` | ✅ | ✅ `[id]` | ✅ `[id]` |
| `/api/private/saas` | ✅ | ✅ `[id]` | ✅ | ✅ `[id]` | ✅ `[id]` |
| `/api/private/skills` | ✅ | ✅ `[id]` | ✅ | ✅ `[id]` | ✅ `[id]` |
| `/api/private/education` | ✅ | ✅ `[id]` | ✅ | ✅ `[id]` | ✅ `[id]` |
| `/api/private/personal-info` | ✅ | — | — | ✅ | — |
| `/api/private/cv` | ✅ (url) | — | ✅ | ✅ | — |
| `/api/private/technologies` | ✅ | ✅ `[id]` | ✅ | ✅ `[id]` | ✅ `[id]` |
| `/api/private/services` | ✅ | ✅ `[id]` | ✅ | ✅ `[id]` | ✅ `[id]` |
| `/api/private/media` | ✅ | ✅ `[id]` | ✅ (upload) | — | ✅ `[id]` |
| `/api/private/messages` | ✅ | ✅ `[id]` | — | — | ✅ `[id]` |
| `/api/private/settings` | ✅ | — | — | ✅ | — |
| `/api/private/admin/login` | — | — | ✅ | — | — |
| `/api/private/projects/count` | ✅ | — | — | — | — |
| `/api/private/saas/count` | ✅ | — | — | — | — |
| `/api/private/messages/count` | ✅ | — | — | — | — |

---

## 11. Dependencias con otros documentos

| Archivo | Relación |
|---|---|
| `00-REQUIREMENTS.md` | Requisitos del panel admin |
| `03-USER-FLOWS.md` | Flujos de usuario del admin |
| `frontend/01-ROUTES.md` | Rutas del admin |
| `frontend/02-COMPONENTS.md` | Componentes (DataTable, FormBuilder, FileUploader, Modal) |
| `frontend/03-LAYOUTS.md` | AdminLayout con Sidebar y Navbar |
| `frontend/06-UI-UX.md` | Diseño visual del admin |
| `backend/04-API-PRIVATE.md` | Endpoints privados del admin |
| `backend/06-BUSINESS-LOGIC.md` | Lógica de negocio (auto-traducción, validaciones) |
