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

## 4. Shared Components (`src/components/shared/`)
| Componente | Tipo | Props | Uso |
|---|---|---|---|
| `LanguageSwitcher` | `[CC]` | `currentLocale: string` | Header Landing. Menú ES/EN/PT. Oculta en admin |
| `AuthGuard` | `[CC]` | `children` | AdminLayout. Verifica sesión, redirige a /admin/login |

## 5. Convenciones
- Cada componente en su propia carpeta con `index.tsx`
- Props types en mismo archivo o en `shared/src/types/`
- Estilos exclusivamente Tailwind
- `[SC]` no puede importar hooks (useState, useEffect, useContext)
- `[CC]` debe ser lo más pequeño posible
- Textos visibles via next-intl, no hardcodeados
