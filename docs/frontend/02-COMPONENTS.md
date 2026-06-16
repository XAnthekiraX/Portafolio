# 02-COMPONENTS.md — Anthekira.dev — Componentes del Frontend

## 1. Propósito

Este documento define todos los componentes del frontend de Anthekira.dev, organizados por capas (atómicos, landing, admin, compartidos). Incluye la jerarquía, responsabilidades, props principales y tipo de componente (Server vs Client).

**Convenciones:**
- `[SC]` = Server Component (sin `"use client"`)
- `[CC]` = Client Component (con `"use client"`)
- Los componentes atómicos están en `frontend/src/components/ui/`
- Los componentes de sección están en `frontend/src/components/landing/` o `frontend/src/components/admin/`

---

## 2. UI Components — Atómicos (`src/components/ui/`)

Componentes base, reutilizables en toda la aplicación.

| Componente | Tipo | Props principales | Descripción |
|---|---|---|---|
| `Button` | `[CC]` | `variant: 'primary' \| 'secondary' \| 'ghost' \| 'danger'`, `size: 'sm' \| 'md' \| 'lg'`, `loading?: boolean`, `disabled?: boolean`, `children`, `onClick`, `type?: 'button' \| 'submit'` | Botón con variantes de color (primary rojo, accent cian, ghost transparente, danger rojo intenso), soporta estado loading con spinner |
| `Card` | `[SC]` | `children`, `className?`, `hover?: boolean` | Contenedor con bg `surface-800`, borde sutil `border-surface-700/50`, hover effect con glow (si `hover=true`) |
| `Input` | `[CC]` | `label: string`, `name: string`, `type?: string`, `value`, `onChange`, `error?: string`, `placeholder?`, `required?: boolean` | Input estilizado con label flotante o superior, estado de error con mensaje rojo |
| `Textarea` | `[CC]` | `label`, `name`, `value`, `onChange`, `rows?: number`, `error?`, `placeholder?` | Textarea con mismas convenciones que Input |
| `Select` | `[CC]` | `label`, `name`, `options: { value, label }[]`, `value`, `onChange`, `error?` | Select desplegable estilizado |
| `Badge` | `[SC]` | `children`, `variant: 'default' \| 'primary' \| 'accent' \| 'success'` | Tag pequeño para habilidades, tecnologías, estados |
| `Toast` | `[CC]` | `message: string`, `type: 'success' \| 'error' \| 'warning' \| 'info'`, `duration?: number`, `onClose` | Notificación temporal que desaparece automáticamente. Posición: top-right |
| `Modal` | `[CC]` | `isOpen: boolean`, `onClose`, `title: string`, `children`, `size?: 'sm' \| 'md' \| 'lg'` | Modal con overlay oscuro, animación de entrada, botón de cierre |
| `Skeleton` | `[SC]` | `variant: 'text' \| 'circular' \| 'rectangular'`, `width?`, `height?`, `className?` | Placeholder animado para estados de carga |
| `Avatar` | `[SC]` | `src: string`, `alt: string`, `size: 'sm' \| 'md' \| 'lg' \| 'xl'`, `className?` | Imagen circular con fallback a iniciales si no carga |

### Ejemplos de uso

```tsx
// Botón primario con loading
<Button variant="primary" loading={isSaving} onClick={handleSave}>
  Save Project
</Button>

// Card con hover effect
<Card hover>
  <h3 className="font-heading text-lg">Project Title</h3>
  <p className="text-surface-400">Description</p>
</Card>

// Input con error
<Input
  label="Email"
  name="email"
  value={email}
  onChange={handleChange}
  error="Invalid email format"
  required
/>

// Toast de éxito
<Toast type="success" message="Project saved successfully" onClose={() => {}} />
```

---

## 3. Landing Page Components (`src/components/landing/`)

Componentes específicos de la Landing Page pública. Todos son `[SC]` por defecto, excepto donde se indique.

### 3.1 `Header`

| Propiedad | Descripción |
|---|---|
| **Ubicación** | `frontend/src/components/landing/Header/index.tsx` |
| **Tipo** | `[SC]` |
| **Props** | `locale: string` |
| **Renderiza** | Logo texto "Anthekira" → Nav (Projects, About, Contact) → LanguageSwitcher |

Comportamiento:
- Sticky en la parte superior con efecto blur al hacer scroll
- Links de navegación usan next-intl para rutas localizadas (`/es/projects`, etc.)
- En móvil, el menú se colapsa en un hamburger menu `[CC]`

### 3.2 `Hero`

| Propiedad | Descripción |
|---|---|
| **Ubicación** | `frontend/src/components/landing/Hero/index.tsx` |
| **Tipo** | `[SC]` |
| **Props** | `personalInfo: PersonalInfo` |
| **Renderiza** | Avatar ilustrado → Nombre → Título profesional → Descripción breve → Botón CV → Redes sociales |

Diseño:
- Fondo con gradiente (primary-600/10 a accent-500/10) + grid tecnológico (CSS grid overlay)
- Avatar en lado izquierdo o central (según responsive)
- Animación fade-in-up en los elementos al hacer scroll
- Botón "Download CV" con icono de descarga

### 3.3 `About`

| Propiedad | Descripción |
|---|---|
| **Ubicación** | `src/components/landing/About/index.tsx` |
| **Tipo** | `[SC]` |
| **Props** | `personalInfo: PersonalInfo` |
| **Renderiza** | Título "About Me" → Biografía completa → Estado profesional actual |

### 3.4 `Skills`

| Propiedad | Descripción |
|---|---|
| **Ubicación** | `src/components/landing/Skills/index.tsx` |
| **Tipo** | `[SC]` |
| **Props** | `skills: Skill[]` (agrupados por categoría) |
| **Renderiza** | Título "Skills" → Categorías → Tags/Badges por habilidad |

Diseño:
- Sin barras de progreso (según especificación)
- Skills agrupadas visualmente por categoría (Frontend, Backend, DevOps, etc.)
- Cada skill es un `Badge` con variante según categoría

### 3.5 `Technologies`

| Propiedad | Descripción |
|---|---|
| **Ubicación** | `src/components/landing/Technologies/index.tsx` |
| **Tipo** | `[SC]` |
| **Props** | `technologies: Technology[]` |
| **Renderiza** | Título "Technologies" → Grid de iconos/logos con nombre |

Diseño:
- Grid responsive (4 columnas escritorio, 2 tablet, 1 móvil)
- Cada tecnología muestra su logo (imagen) + nombre
- Hover effect con glow cian

### 3.6 `Projects`

| Propiedad | Descripción |
|---|---|
| **Ubicación** | `src/components/landing/Projects/` |
| **Tipo** | `[SC]` |
| **Props** | `projects: Project[]` |
| **Subcomponentes** | `ProjectCard` (grid), `ProjectDetail` (página individual) |

`ProjectCard`:
```tsx
// Props: project: { title, description, image, technologies, slug }
// Renderiza: Imagen → Título → Descripción corta → Badges de tecnologías → Link "View project"
// Hover: Elevación sutil + glow borde cian
```

`ProjectDetail` (página completa):
```tsx
// Props: project: Project (con todas las relaciones)
// Renderiza: Imagen grande → Título → Descripción completa → Tecnologías → Enlaces (demo, repo)
```

### 3.7 `Services`

| Propiedad | Descripción |
|---|---|
| **Ubicación** | `src/components/landing/Services/index.tsx` |
| **Tipo** | `[SC]` |
| **Props** | `services: Service[]` |
| **Renderiza** | Título "Services" → Grid de cards con icono + título + descripción breve + estado |

Diseño:
- Cada servicio es una `Card` con icono representativo
- Estado de disponibilidad (Badge: "Available", "Coming Soon")

### 3.8 `Contact`

| Propiedad | Descripción |
|---|---|
| **Ubicación** | `src/components/landing/Contact/index.tsx` |
| **Tipo** | `[CC]` (necesita estado del formulario) |
| **Props** | Ninguna (los datos se manejan internamente) |
| **Renderiza** | Título "Get in Touch" → Formulario (nombre, email, asunto, mensaje) → Redes sociales |

Comportamiento:
- Validación en cliente (campos requeridos, email válido)
- POST a `/api/public/contact` al enviar
- Toast de confirmación al enviar
- Redes sociales: GitHub, LinkedIn, etc. (desde configuración)

### 3.9 `Footer`

| Propiedad | Descripción |
|---|---|
| **Ubicación** | `src/components/landing/Footer/index.tsx` |
| **Tipo** | `[SC]` |
| **Props** | `personalInfo: PersonalInfo` |
| **Renderiza** | Logo → Enlaces rápidos → Redes sociales → Copyright "© {year} Anthekira.dev" |

---

## 4. Admin Components (`src/components/admin/`)

Componentes específicos del panel administrativo. Todos son `[CC]` porque requieren interactividad y estado.

### 4.1 `Sidebar`

| Propiedad | Descripción |
|---|---|
| **Ubicación** | `src/components/admin/Sidebar/index.tsx` |
| **Tipo** | `[CC]` |
| **Props** | `currentPath: string` |
| **Renderiza** | Logo "Anthekira" → Navegación vertical → Enlace a Google Analytics → Cerrar sesión |

Items del menú:
```
Dashboard (/admin)
Projects (/admin/projects)
SaaS Projects (/admin/saas)
Profile (/admin/profile)
Settings (/admin/settings)
───
Google Analytics (enlace externo, nueva pestaña)
```

- El item activo se resalta con bg `primary-600/20` y borde izquierdo rojo
- Colapsable en móvil (hamburger menu)

### 4.2 `Navbar`

| Propiedad | Descripción |
|---|---|
| **Ubicación** | `src/components/admin/Navbar/index.tsx` |
| **Tipo** | `[CC]` |
| **Props** | `title: string`, `userName?: string` |
| **Renderiza** | Título de página actual → Avatar con menú de usuario → "Sign Out" |

### 4.3 `DataTable`

| Propiedad | Descripción |
|---|---|
| **Ubicación** | `src/components/admin/DataTable/index.tsx` |
| **Tipo** | `[CC]` |
| **Props** | `columns: Column[]`, `data: any[]`, `onEdit?: (id) => void`, `onDelete?: (id) => void`, `loading?: boolean`, `emptyMessage?: string` |
| **Renderiza** | Tabla con columnas configurables → acciones (Edit, Delete) → paginación |

Comportamiento:
- Soporta carga asíncrona (estado skeleton)
- Mensaje personalizado cuando no hay datos
- Las acciones Edit/Delete abren modal de confirmación para Delete

### 4.4 `FormBuilder`

| Propiedad | Descripción |
|---|---|
| **Ubicación** | `src/components/admin/FormBuilder/index.tsx` |
| **Tipo** | `[CC]` |
| **Props** | `fields: Field[]`, `initialValues?: any`, `onSubmit: (data) => void`, `loading?: boolean`, `submitLabel?: string` |
| **Renderiza** | Formulario dinámico basado en configuración de campos |

`Field` type:
```typescript
type Field = {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'multi-select' | 'image' | 'url' | 'boolean' | 'tag';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[]; // para select/multi-select
};
```

Comportamiento:
- Validación en cliente antes de submit
- Soporta auto-traducción (los campos en ES se traducen a EN y PT al guardar)
- Loading state en botón de submit

### 4.5 `SkillsModal`

| Propiedad | Descripción |
|---|---|
| **Ubicación** | `src/components/admin/SkillsModal/index.tsx` |
| **Tipo** | `[CC]` |
| **Props** | `isOpen: boolean`, `onClose`, `selectedSkills: string[]`, `onApply: (skillIds: string[]) => void` |
| **Renderiza** | Modal con lista de skills, checkboxes, búsqueda, botones Cancel/Apply |

Comportamiento:
- Carga skills de `GET /api/private/skills`
- Selección múltiple con checkboxes
- Búsqueda/filtro de skills
- Al aplicar, devuelve los IDs seleccionados al formulario padre

### 4.6 `TagInput`

| Propiedad | Descripción |
|---|---|
| **Ubicación** | `src/components/admin/TagInput/index.tsx` |
| **Tipo** | `[CC]` |
| **Props** | `label: string`, `tags: string[]`, `onChange: (tags: string[]) => void`, `placeholder?: string` |
| **Renderiza** | Input con tags visualizados como badges, Enter para agregar, X para eliminar |

### 4.7 `FileUploader`

| Propiedad | Descripción |
|---|---|
| **Ubicación** | `src/components/admin/FileUploader/index.tsx` |
| **Tipo** | `[CC]` |
| **Props** | `accept: string`, `maxSizeMB?: number`, `bucket: string`, `onUploadComplete: (url) => void`, `multiple?: boolean` |
| **Renderiza** | Drag & drop zone → Preview → Barra de progreso → URL generada |

### 4.8 `MediaGrid`

| Propiedad | Descripción |
|---|---|
| **Ubicación** | `src/components/admin/MediaGrid/index.tsx` |
| **Tipo** | `[CC]` |
| **Props** | `files: Media[]`, `onDelete: (id) => void`, `onSelect?: (url) => void`, `loading?: boolean` |
| **Renderiza** | Grid de thumbnails con acciones (copiar URL, eliminar) |

### 4.9 `AnalyticsLink`

| Propiedad | Descripción |
|---|---|
| **Ubicación** | `src/components/admin/AnalyticsLink/index.tsx` |
| **Tipo** | `[SC]` |
| **Props** | `gaUrl?: string` |
| **Renderiza** | Botón/card que abre Google Analytics en nueva pestaña |

---

## 5. Shared Components (`src/components/shared/`)

Componentes utilizados tanto en la Landing como en el Admin.

### 5.1 `LanguageSwitcher`

| Propiedad | Descripción |
|---|---|
| **Ubicación** | `src/components/shared/LanguageSwitcher.tsx` |
| **Tipo** | `[CC]` (necesita estado para el menú desplegable) |
| **Props** | `currentLocale: string` |
| **Renderiza** | Botón con bandera/idioma actual → Menú desplegable con ES, EN, PT |

Comportamiento:
- Al seleccionar un idioma, navega a la misma ruta con el nuevo prefijo
- El idioma actual se marca visualmente
- Se oculta en rutas admin (el admin es solo español)
- Animación sutil al cambiar

### 5.2 `AuthGuard`

| Propiedad | Descripción |
|---|---|
| **Ubicación** | `src/components/shared/AuthGuard.tsx` |
| **Tipo** | `[CC]` |
| **Props** | `children: React.ReactNode` |
| **Renderiza** | `children` si hay sesión, redirige a `/admin/login` si no |

Comportamiento:
- Verifica sesión con Supabase Auth al montar
- Muestra skeleton mientras verifica
- Si no hay sesión, redirige después de 100ms (para evitar flash)

---

## 6. Árbol de Jerarquía de Componentes

```
RootLayout
├── LandingLayout ([locale]/layout.tsx)          AdminLayout (admin/layout.tsx)
│   ├── Header [SC]                              ├── AuthGuard [CC]
│   │   ├── Logo                                 ├── Sidebar [CC]
│   │   ├── Nav                                  │   ├── NavItem (Dashboard)
│   │   │   ├── Projects Link                    │   ├── NavItem (Projects)
│   │   │   ├── About Link                       │   ├── NavItem (SaaS Projects)
│   │   │   └── Contact Link                     │   ├── NavItem (Profile)
│   │   └── LanguageSwitcher [CC]                │   ├── NavItem (Settings)
│   │                                            │   ├── Separator
│   ├── Page Content                             │   └── AnalyticsLink [SC]
│   │   ├── Home [SC]                            │
│   │   │   ├── Hero                             ├── Navbar [CC]
│   │   │   ├── About                            │   ├── PageTitle
│   │   │   ├── Skills                           │   └── UserMenu → SignOut
│   │   │   │   └── Badge (por skill)            │
│   │   │   ├── Technologies                     └── Page Content
│   │   │   │   └── Card (por tecnología)            ├── DataTable [CC]
│   │   │   ├── Projects                              ├── FormBuilder [CC]
│   │   │   │   └── ProjectCard × N                   │   └── Input / Textarea / Select / TagInput
│   │   │   ├── Services                              ├── SkillsModal [CC]
│   │   │   │   └── Card (por servicio)               ├── FileUploader [CC]
│   │   │   └── Contact [CC]                          └── MediaGrid [CC]
│   │   │       └── Form (Input, Textarea)
│   │   ├── Projects Page
│   │   │   └── ProjectCard × N
│   │   ├── Project Detail
│   │   │   └── ProjectDetail
│   │   ├── About Page
│   │   └── Contact Page [CC]
│   │
│   ├── Footer [SC]
│   └── Google Analytics Script
```

---

## 7. Convenciones de Implementación

1. **Cada componente en su propia carpeta** con `index.tsx` como exportación principal
2. **Los tipos de props se definen en el mismo archivo** o en `shared/src/types/` si se reutilizan
3. **Los estilos son exclusivamente Tailwind CSS** (sin CSS modules, sin styled-components)
4. **Los componentes `[SC]` no deben importar hooks** (`useState`, `useEffect`, `useContext`)
5. **Los `[CC]` deben ser lo más pequeños posible** (solo la parte interactiva, no el layout completo)
6. **Usar `next-intl` para textos visibles** (no hardcodear strings en componentes)

---

## 8. Dependencias con otros documentos

| Archivo | Relación |
|---|---|
| `frontend/00-FRONTEND.md` | Design tokens y config que estos componentes deben usar |
| `frontend/01-ROUTES.md` | Rutas donde estos componentes se renderizan |
| `frontend/03-LAYOUTS.md` | Layouts que contienen estos componentes |
| `frontend/04-I18N.md` | Traducciones usadas en los componentes |
| `frontend/06-UI-UX.md` | Guía visual detallada para el diseño |
| `frontend/07-ACCESSIBILITY.md` | Prácticas de accesibilidad para componentes |
