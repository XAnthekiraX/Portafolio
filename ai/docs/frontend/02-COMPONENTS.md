---
doc_id: frontend-components
version: 1.0.0
last_updated: 2026-07-01
owner: Anthekira
type: api-reference
dependencies: [frontend-overview]
tags: [frontend, components, ui, crud, generic, admin, landing]
ai_context:
  primary_use: Reference for all UI components, landing sections, admin components, and CRUD generic system
  key_constraints: [max component size 300 lines, split patterns, no external UI libraries]
  target_audience: Frontend developers, AI agents implementing or modifying components
---

# 02-COMPONENTS.md — Anthekira.dev

## 1. UI Components (`src/components/ui/`) — Atómicos
| Componente | Tipo | Props clave |
|---|---|---|
| `Button` | `[CC]` | `variant: primary\|secondary\|ghost\|danger`, `size: sm\|md\|lg`, `loading`, `disabled` |
| `Card` | `[SC]` | `children`, `hover?`, `className?` |
| `Input` | `[CC]` | `label`, `name`, `value`, `onChange`, `error?`, `placeholder?`, `required?` |
| `Textarea` | `[CC]` | igual que Input + `rows?` |
| `Select` | `[CC]` | `label`, `name`, `options: {value,label}[]`, `value`, `onChange`, `error?` |
| `Badge` | `[SC]` | `variant: default\|primary\|accent\|success`, `children` |
| `Toast` | `[CC]` | `message`, `type: success\|error\|warning\|info`, `duration?`, `onClose` |
| `Modal` | `[CC]` | `isOpen`, `onClose`, `title`, `children`, `size?: sm\|md\|lg` |
| `Skeleton` | `[SC]` | `variant: text\|circular\|rectangular`, `width?`, `height?` |
| `Avatar` | `[SC]` | `src`, `alt`, `size: sm\|md\|lg\|xl` |

**Ubicación:** `frontend/src/components/ui/{Component}/index.tsx`

## 2. Landing Components (`src/components/landing/`)
Todos `[SC]` excepto donde se indique.

| Componente | Props | Renderiza |
|---|---|---|
| `Header` | `locale: string` | Logo → Nav (Projects, About, Contact) → LanguageSwitcher [CC]. Sticky con blur |
| `Hero` | `personalInfo: PersonalInfo` | Avatar → Nombre → Título → Descripción → CV button → Redes. Grid bg + gradiente |
| `About` | `personalInfo: PersonalInfo` | Título "About Me" → Bio → Status badge |
| `Skills` | `skills: Skill[]` | Categorías → Tags (Badge). Sin barras de progreso |
| `Technologies` | `technologies: Technology[]` | Grid logos (6 cols desktop, 2 tablet, 1 mobile) |
| `Projects` | `projects: Project[]` | ProjectCard grid (3 cols) + ProjectDetail (página individual) |
| `Services` | `services: Service[]` | Cards con icono + título + descripción + estado (Available/Coming Soon) |
| `Contact` | `[CC]` | Formulario + redes sociales. POST a /api/public/contact |
| `Footer` | `personalInfo: PersonalInfo` | Logo → Links → Redes → Copyright |

**Ubicación:** `frontend/src/components/landing/{Section}/index.tsx`

## 3. Admin Components (`src/components/admin/`) — Todos `[CC]`

### Componentes base
| Componente | Props | Renderiza |
|---|---|---|
| `Sidebar` | `currentPath: string` | Logo → Nav vertical → GA link → Sign Out. Colapsable en móvil |
| `Navbar` | `title: string`, `userName?` | Page title → Avatar → Sign Out |
| `DataTable` | `columns, data, onEdit?, onDelete?, loading?, emptyMessage?` | Tabla configurable + acciones + skeleton loading |
| `FormBuilder` | `fields: Field[], initialValues?, onSubmit, loading?, submitLabel?` | Form dinámico con validación + auto-traducción |
| `SkillsModal` | `isOpen, onClose, selectedSkills[], onApply` | Modal con checkboxes + búsqueda de skills |
| `TagInput` | `label, tags[], onChange, placeholder?` | Tags como badges + Enter para agregar |
| `FileUploader` | `accept, maxSizeMB?, bucket, onUploadComplete, multiple?` | Drag & drop → Preview → Progress → URL |
| `AnalyticsLink` | `[SC]` `gaUrl?` | Botón que abre GA en nueva pestaña |

### Componentes CRUD Genéricos (ADR-014)
| Componente | Props | Descripción |
|---|---|---|
| `ResourcePage` | `config: ResourceConfig` | Página completa de listado + acciones (usa GenericDataTable + GenericForm internamente) |
| `GenericDataTable` | `resource: string, columns: Column[], actions: Action[]` | Tabla genérica con paginación, búsqueda, y acciones CRUD |
| `GenericForm` | `fields: FieldConfig[], initialValues?, onSubmit, submitLabel?, mode: 'create'\|'edit'` | Formulario dinámico con soporte para relaciones N:M (skills), upload de imágenes, auto-traducción |

**ResourceConfig:**
```typescript
interface ResourceConfig {
  resource: string;          // nombre del recurso (projects, skills, etc.)
  endpoint: string;          // /api/private/projects
  label: string;             // "Projects"
  icon: string;              // Lucide icon name
  columns: Column[];         // configuración de columnas del DataTable
  fields: FieldConfig[];     // configuración de campos del formulario
  translations?: {           // opcional: auto-traducción
    entityType: EntityType;
    fields: string[];
  };
}

interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'email' | 'url' | 'select' | 'file' | 'tags' | 'skills' | 'checkbox' | 'jsonb';
  required?: boolean;
  options?: { value: string; label: string }[];  // para select
  placeholder?: string;
  showIf?: (values: any) => boolean;              // campos condicionales
}

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => ReactNode;  // custom render
  sortable?: boolean;
}
```

**Ejemplo de configuración:**
```typescript
const projectsConfig: ResourceConfig = {
  resource: 'projects',
  endpoint: '/api/private/projects',
  label: 'Projects',
  icon: 'FolderKanban',
  columns: [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'type', label: 'Type', render: (v) => <Badge>{v}</Badge> },
    { key: 'status', label: 'Status' },
  ],
  fields: [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
    {
      name: 'type', label: 'Type', type: 'select', required: true,
      options: [
        { value: 'project', label: 'Project' },
        { value: 'saas', label: 'SaaS' },
      ],
    },
    { name: 'repository_url', label: 'Repository URL', type: 'url' },
    { name: 'url', label: 'URL', type: 'url', showIf: (v) => v.type === 'saas' },
    { name: 'features', label: 'Features', type: 'tags', showIf: (v) => v.type === 'saas' },
    { name: 'image_url', label: 'Image', type: 'file', bucket: 'projects' },
    { name: 'skills', label: 'Skills', type: 'skills' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { value: 'draft', label: 'Draft' },
      { value: 'active', label: 'Active' },
      { value: 'archived', label: 'Archived' },
    ]},
  ],
  translations: { entityType: 'project', fields: ['title', 'description'] },
};
```

**Uso en página admin:**
```tsx
// frontend/src/app/admin/[resource]/page.tsx
const configs = {
  projects: projectsConfig,
  skills: skillsConfig,
  // ...
};

export default function ResourceListPage({ params }: { params: { resource: string } }) {
  const config = configs[params.resource];
  return <ResourcePage config={config} />;
}
```

## 4. Error Boundaries

| Componente | Tipo | Props | Uso |
|---|---|---|---|
| `ErrorBoundary` | `[CC]` | `fallback?: ReactNode, children` | Envuelve secciones críticas de la Landing Page para evitar crash total |
| `ErrorMessage` | `[SC]` | `message: string, retry?: () => void` | Mensaje de error amigable con botón de reintento |
| `EmptyState` | `[SC]` | `icon, title, description` | Estado vacío para listas sin datos |

```tsx
// Uso típico en landing page
<section>
  <ErrorBoundary fallback={<ErrorMessage message="Could not load projects" />}>
    <ProjectsList />
  </ErrorBoundary>
</section>
```

## 5. Shared Components (`src/components/shared/`)
| Componente | Tipo | Props | Uso |
|---|---|---|---|
| `LanguageSwitcher` | `[CC]` | `currentLocale: string` | Header Landing. Menú ES/EN/PT. Oculta en admin |
| `AuthGuard` | `[CC]` | `children` | AdminLayout. Verifica sesión, redirige a /admin/login. Muestra spinner mientras verifica |
| `SkipToContent` | `[SC]` | `targetId?: string` (default: `'main-content'`) | Enlace de accesibilidad "Skip to content" en RootLayout, permite saltar la navegación al presionar Tab al cargar |

## 6. Convenciones
- Cada componente en su propia carpeta con `index.tsx`
- Props types en mismo archivo o en `shared/src/types/`
- Estilos exclusivamente Tailwind
- `[SC]` no puede importar hooks (useState, useEffect, useContext)
- `[CC]` debe ser lo más pequeño posible
- Textos visibles via next-intl, no hardcodeados
- **CRUD Genérico:** Los componentes genéricos están en `frontend/src/lib/generic/`. Los componentes de UI base están en `frontend/src/components/ui/`.

## 7. Límite de Tamaño de Componentes y Patrones de División (ADR-021)

### Límites
| Tipo | Límite duro | Límite recomendado |
|---|---|---|
| Admin CC | 300 líneas | 200 líneas |
| Landing CC | 300 líneas | 250 líneas |
| Landing SC | 400 líneas* | 300 líneas |
| UI Components | 150 líneas | 100 líneas |

>*Excepción para componentes de landing page con contenido principalmente JSX estático si la división no aporta valor semántico.

### Reglas de composición
- Si un componente tiene > 5 props → dividir en subcomponentes
- Si un componente maneja > 3 estados internos → extraer lógica a hooks
- Si un componente supera el límite → mover a `ComponentName/` con `index.tsx` + subcomponentes

### Patrón de split
```
# ANTES (300+ líneas)
frontend/src/components/admin/ProjectsList.tsx

# DESPUÉS
frontend/src/components/admin/ProjectsList/
├── index.tsx          # Orchestrador, renderiza subcomponentes
├── ProjectCard.tsx    # Card individual
├── ProjectFilters.tsx # Filtros y búsqueda
└── useProjects.ts     # Lógica de fetch y estado
```

### Extracción de hooks
```typescript
// En lugar de mezclar lógica en el componente:
function useProjects(filters?: ProjectFilters) {
  const [data, setData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects(filters).then(...).catch(...);
  }, [filters]);

  return { data, loading, error, refetch: () => {...} };
}
```

### Casos típicos que requieren split
| Señal | Acción |
|---|---|
| Componente mezcla fetch + render + eventos | Extraer fetch a hook `useResource()` |
| Múltiples modales/dialogs en un componente | Extraer cada modal a su propio archivo |
| Formulario con > 10 campos | Dividir en secciones (BasicInfo, Media, Skills) |
| Tabla con lógica de paginación, sort, selección | Extraer lógica a hook `useDataTable()` |
