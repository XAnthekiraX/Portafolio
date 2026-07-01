---
doc_id: frontend-admin
version: 1.0.0
last_updated: 2026-07-01
owner: Anthekira
type: api-reference
dependencies: [frontend-routes, frontend-components]
tags: [frontend, admin, crud, dashboard, login, sidebar, resource-config]
ai_context:
  primary_use: Admin panel structure, CRUD generic configuration per resource, sidebar, dashboard, login flow
  key_constraints: [all admin CC, no i18n admin, CRUD generic for 5 resources, exceptions for profile and contact]
  target_audience: Frontend developers, AI agents implementing admin features
---

# 08-ADMIN-PANEL.md — Anthekira.dev

## 1. Sidebar
```
📊 Dashboard           → /admin
📁 Projects            → /admin/projects      (unifica projects + saas)
👤 Profile             → /admin/profile
🎓 Education           → /admin/education
🛠️ Technologies        → /admin/technologies
🏢 Services            → /admin/services
💻 Skills              → /admin/skills
✉️ Messages            → /admin/contact
────────────────────────
📊 Google Analytics    → (enlace externo)
🚪 Sign Out
```

> **Cambio:** Se eliminó "SaaS Projects" como entrada separada. Ahora es parte de Projects con filtro por tipo.
> **Nota de implementación:** Las rutas `/admin/projects`, `/admin/skills`, `/admin/education`, `/admin/technologies`, `/admin/services` usan el patrón de ruta dinámica `/admin/[resource]/` de Next.js App Router. El recurso se resuelve del parámetro `params.resource` y se usa para cargar la configuración correspondiente desde `resourceConfigs`.

## 1.1 Mapeo Endpoint ↔ Tabla BD
Cada recurso del CRUD genérico mapea directamente a una tabla de BD:
| Ruta Admin | Endpoint API | Tabla BD | Nombre recurso |
|---|---|---|---|
| `/admin/projects` | `/api/private/projects` | `projects` | `projects` |
| `/admin/skills` | `/api/private/skills` | `skills` | `skills` |
| `/admin/education` | `/api/private/education` | `education` | `education` |
| `/admin/technologies` | `/api/private/technologies` | `technologies` | `technologies` |
| `/admin/services` | `/api/private/services` | `services` | `services` |

El nombre del recurso en la URL debe coincidir con el nombre de la tabla en BD para que el CRUD genérico funcione correctamente.

## 2. Dashboard (`/admin`)
Cards de resumen desde `GET /api/private/stats/count`:
| Card | Fuente |
|---|---|
| Projects | `total_projects` (incluye type='project' y type='saas') |
| Technologies | `total_technologies` |
| Translation Errors | `total_failed` (badge rojo si > 0, enlace a retry) |
+ Enlace a Google Analytics.

## 3. Login (`/admin/login`)
```
Email + Password → POST /api/private/admin/login
  → Rate limit (5/min/IP)
    → Supabase Auth → JWT + CSRF cookies → /admin
```

## 4. CRUD Genérico (ADR-014)

Los CRUD de contenido usan un sistema genérico parametrizable. Cada recurso se define con una configuración:

### Resource Config
```typescript
// frontend/src/lib/generic/configs.ts
export const resourceConfigs: Record<string, ResourceConfig> = {
  projects: {
    resource: 'projects',
    endpoint: '/api/private/projects',
    label: 'Projects',
    icon: 'FolderKanban',
    columns: [
      { key: 'title', label: 'Title', sortable: true },
      { key: 'type', label: 'Type', render: (v) => <Badge variant={v === 'saas' ? 'accent' : 'primary'}>{v}</Badge> },
      { key: 'status', label: 'Status' },
      { key: 'updated_at', label: 'Updated', render: (v) => formatDate(v) },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'type', label: 'Type', type: 'select', required: true,
        options: [{ value: 'project', label: 'Project' }, { value: 'saas', label: 'SaaS' }] },
      // Campos condicionales según type:
      { name: 'repository_url', label: 'Repository URL', type: 'url' },
      { name: 'url', label: 'URL', type: 'url', showIf: (v) => v.type === 'saas' },
      { name: 'features', label: 'Features', type: 'tags', showIf: (v) => v.type === 'saas' },
      { name: 'image_url', label: 'Image', type: 'file', bucket: 'projects' },
      { name: 'skills', label: 'Skills', type: 'skills' },
      { name: 'status', label: 'Status', type: 'select',
        options: [{ value: 'draft', label: 'Draft' }, { value: 'active', label: 'Active' }, { value: 'archived', label: 'Archived' }] },
    ],
    translations: { entityType: 'project', fields: ['title', 'description'] },
  },

  skills: {
    resource: 'skills',
    endpoint: '/api/private/skills',
    label: 'Skills',
    icon: 'Code',
    columns: [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'category', label: 'Category', render: (v) => <Badge>{v}</Badge> },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', required: true,
        options: [
          { value: 'frontend', label: 'Frontend' },
          { value: 'backend', label: 'Backend' },
          { value: 'devops', label: 'DevOps' },
          { value: 'tools', label: 'Tools' },
          { value: 'other', label: 'Other' },
        ],
      },
    ],
    // Sin traducciones
  },

  education: {
    resource: 'education',
    endpoint: '/api/private/education',
    label: 'Education',
    icon: 'GraduationCap',
    columns: [
      { key: 'institution', label: 'Institution', sortable: true },
      { key: 'degree', label: 'Degree' },
    ],
    fields: [
      { name: 'institution', label: 'Institution', type: 'text', required: true },
      { name: 'degree', label: 'Degree', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'website_url', label: 'Website URL', type: 'url' },
      { name: 'logo_url', label: 'Logo', type: 'file', bucket: 'profile' },
    ],
    translations: { entityType: 'education', fields: ['description'] },
  },

  technologies: {
    resource: 'technologies',
    endpoint: '/api/private/technologies',
    label: 'Technologies',
    icon: 'Cpu',
    columns: [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'website_url', label: 'Website' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'icon_url', label: 'Icon URL', type: 'url' },
      { name: 'website_url', label: 'Website URL', type: 'url' },
    ],
  },

  services: {
    resource: 'services',
    endpoint: '/api/private/services',
    label: 'Services',
    icon: 'Briefcase',
    columns: [
      { key: 'title', label: 'Title', sortable: true },
      { key: 'status', label: 'Status' },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'icon', label: 'Icon', type: 'select',
        options: [
          { value: 'Code', label: 'Code' },
          { value: 'Server', label: 'Server' },
          { value: 'Cloud', label: 'Cloud' },
          { value: 'Globe', label: 'Globe' },
          { value: 'Smartphone', label: 'Mobile' },
          { value: 'PenTool', label: 'Design' },
        ],
      },
      { name: 'status', label: 'Status', type: 'select',
        options: [{ value: 'available', label: 'Available' }, { value: 'coming_soon', label: 'Coming Soon' }] },
    ],
    translations: { entityType: 'service', fields: ['title', 'description'] },
  },
};
```

### Componentes Genéricos

| Ruta | Componente | Descripción |
|---|---|---|
| `/admin/[resource]` | `<ResourcePage config={config} />` | Listado + acciones |
| `/admin/[resource]/new` | `<GenericForm config={config} mode="create" />` | Crear nuevo |
| `/admin/[resource]/[id]` | `<GenericForm config={config} mode="edit" />` | Editar existente |

## 5. Profile (`/admin/profile`)
Sección personalizada (no usa CRUD genérico debido al merge parcial de `social_links`):
- Personal Info (name, title, bio, location, email, avatar, status)
- CVs por idioma (ES, EN, PT) — gestionados por separado de los datos personales
- Social Links (GitHub, LinkedIn, Twitter, Website)

**APIs:**
- `GET /api/private/personal-info` — obtiene datos personales + URLs de CVs por idioma (`cv.es`, `cv.en`, `cv.pt`)
- `PUT /api/private/personal-info` — actualiza datos personales (name, title, bio, etc.) con merge parcial de `social_links`
- `POST /api/private/personal-info` — crea perfil inicial con auto-traducción de `professional_title` + `bio`
- `PUT /api/private/personal-info/cv` — gestiona URLs de CVs: `{ cv: { es, en, pt } }`. ES se guarda en `personal_info.cv_url`. EN y PT se guardan en `entity_translations` vía RPC upsert.

## 6. Contact Messages (`/admin/contact`)
Sección personalizada (no usa CRUD genérico porque los mensajes son de terceros):
- Lista de mensajes con paginación y filtro por estado de lectura
- Detalle del mensaje con acción de marcar como leído
- Eliminación con confirmación

## 7. Skills Modal
Usado en Projects (para seleccionar skills N:M). Modal con checkboxes + búsqueda.

## 8. Resumen Endpoints
| Recurso | GET | POST | PUT | DELETE |
|---|---|---|---|---|
| `/api/private/personal-info` | ✅ | ✅ | ✅ | — |
| `/api/private/projects` | ✅ | ✅ | ✅ | ✅ |
| `/api/private/skills` | ✅ | ✅ | ✅ | ✅ |
| `/api/private/education` | ✅ | ✅ | ✅ | ✅ |
| `/api/private/technologies` | ✅ | ✅ | ✅ | ✅ |
| `/api/private/services` | ✅ | ✅ | ✅ | ✅ |
| `/api/private/personal-info/cv` | — | — | ✅ | — |
| `/api/private/upload` | — | ✅ | — | — |
| `/api/private/contact` | ✅ | — | ✅ (read) | ✅ |
| `/api/private/stats/count` | ✅ | — | — | — |
| `/api/private/stats/translations-pending` | ✅ | — | — | — |
| `/api/private/translations/retry` | — | ✅ | — | — |
| `/api/private/admin/login` | — | ✅ | — | — |

> **Reducción:** De 12 endpoints privados a 12 (se eliminaron los 4 de `/saas`). La funcionalidad de SaaS se absorbió en `/projects` con el campo `type`.
