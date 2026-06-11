# 07-ACCESSIBILITY.md — Anthekira.dev — Accesibilidad

## 1. Propósito

Definir las prácticas de accesibilidad implementadas en la V1 de Anthekira.dev. El objetivo es garantizar buenas prácticas básicas que hagan el sitio usable por la mayor cantidad de personas posible, sentando las bases para un futuro cumplimiento formal de estándares WCAG.

---

## 2. Nivel de Cumplimiento

| Aspecto | V1 |
|---|---|
| **Estándar** | Buenas prácticas básicas (WCAG-inspired, sin certificación) |
| **WCAG 2.1 AA** | No se requiere cumplimiento formal en V1 |
| **Evolución futura** | La arquitectura y componentes están diseñados para permitir evolucionar hacia cumplimiento más estricto sin reestructuración importante |

### 2.1 Qué NO se implementa en V1

- ARIA live regions para contenido dinámico
- Soporte completo para lectores de pantalla en el panel admin
- Pruebas automatizadas de accesibilidad
- Versión de alto contraste alternativa

---

## 3. HTML Semántico

### 3.1 Estructura de Landmarks

Todas las páginas públicas deben seguir esta estructura:

```html
<body>
  <!-- Landmark: banner -->
  <header role="banner">
    <nav role="navigation" aria-label="Main navigation">
      <!-- Links de navegación -->
    </nav>
  </header>

  <!-- Landmark: main -->
  <main role="main" id="main-content">
    <!-- Cada sección temática usa <section> con aria-label o heading -->
    <section aria-labelledby="hero-title">
      <h1 id="hero-title">Hero Title</h1>
    </section>

    <section aria-labelledby="projects-title">
      <h2 id="projects-title">Projects</h2>
      <!-- Grid de proyectos -->
    </section>
  </main>

  <!-- Landmark: contentinfo -->
  <footer role="contentinfo">
    <!-- Copyright, redes sociales -->
  </footer>
</body>
```

### 3.2 Elementos HTML Correctos

| Elemento | Uso correcto | Uso incorrecto |
|---|---|---|
| `<nav>` | Navegación principal y secundaria | Enlaces sueltos no relacionados con navegación |
| `<main>` | Contenido único de la página (1 por página) | — |
| `<section>` | Agrupación temática con heading | Contenedor genérico sin heading |
| `<article>` | Contenido independiente (proyecto, post) | Elementos que dependen del contexto |
| `<aside>` | Contenido complementario (redes, sidebar) | Contenido principal |
| `<footer>` | Información de cierre de sección o página | — |
| `<button>` | Acciones (enviar formulario, abrir modal) | Navegación (usar `<a>`) |
| `<a>` | Navegación a otra URL | Acciones sin href |
| `<h1>`-`<h6>` | Jerarquía de títulos | Estilos visuales con CSS |

### 3.3 Jerarquía de Encabezados

```
Página Home:
  h1: "Desarrollador Full-Stack" (Hero)
  h2: "Sobre Mí"
  h2: "Habilidades"
    h3: "Frontend" (categoría de skill)
    h3: "Backend"
  h2: "Tecnologías"
  h2: "Proyectos"
    h3: "Project Name" (card individual)
  h2: "Servicios"
    h3: "Service Name"
  h2: "Contacto"

Página de Proyecto:
  h1: "Project Name"
  h2: "Tecnologías utilizadas"
  h2: "Enlaces"

Panel Admin:
  h1: "Panel Admin — Anthekira.dev"
  h2: "Dashboard" / "Projects" / etc. (título de página actual)
  h3: (subtítulos dentro de cada página)
```

**Reglas:**
- Solo un `<h1>` por página
- No saltar niveles (no ir de h1 a h3)
- Los headings reflejan la estructura del contenido, no el estilo visual

---

## 4. Contraste y Color

### 4.1 Relaciones de Contraste

| Combinación | Foreground | Background | Ratio | Cumple WCAG AA |
|---|---|---|---|---|
| Texto principal | `#F4F4F5` (surface-100) | `#18181B` (surface-900) | ~14.5:1 | ✅ Sí (mínimo 4.5:1) |
| Texto body | `#D4D4D8` (surface-300) | `#18181B` (surface-900) | ~11.5:1 | ✅ Sí |
| Texto secundario | `#A1A1AA` (surface-400) | `#18181B` (surface-900) | ~7.5:1 | ✅ Sí |
| Texto secundario | `#A1A1AA` (surface-400) | `#27272A` (surface-800) | ~5.2:1 | ✅ Sí |
| Botón primario texto | `#FFFFFF` | `#DC2626` (primary-600) | ~4.8:1 | ✅ Sí |
| Enlace en body | `#06B6D4` (accent-500) | `#18181B` (surface-900) | ~8.5:1 | ✅ Sí |
| Enlace hover | `#22D3EE` (accent-400) | `#18181B` (surface-900) | ~10.2:1 | ✅ Sí |

> **Nota:** Todas las combinaciones de la paleta superan el ratio 4.5:1 requerido por WCAG AA para texto normal.

### 4.2 Uso de Color No Exclusivo

- **No usar el color como única forma de transmitir información**
- Los enlaces deben ser reconocibles no solo por color, sino también por subrayado o icono
- Los errores de formulario deben mostrar texto además de borde rojo
- Los badges de estado deben incluir texto descriptivo ("Available", "Coming Soon"), no solo color

```tsx
// ✅ Correcto: texto + color
<Badge variant="success">Available</Badge>

// ❌ Incorrecto: solo color
<Badge variant="success" />
```

---

## 5. Formularios

### 5.1 Labels Asociados

Todos los campos de formulario deben tener un `<label>` explícitamente asociado:

```tsx
// ✅ Correcto: label + htmlFor / id
<label htmlFor="name" className="text-sm font-medium text-surface-300">
  Name
</label>
<input
  id="name"
  name="name"
  type="text"
  required
  className="..."
/>

// ✅ Correcto: aria-label (cuando no hay label visible)
<button aria-label="Close modal">
  <X />
</button>

// ❌ Incorrecto: placeholder como única identificación
<input placeholder="Name" /> {/* Sin label */}
```

### 5.2 Mensajes de Error

Los errores deben ser anunciados con `aria-describedby` y `aria-invalid`:

```tsx
<label htmlFor="email">Email</label>
<input
  id="email"
  name="email"
  type="email"
  aria-invalid={!!error}
  aria-describedby={error ? 'email-error' : undefined}
  required
/>
{error && (
  <p id="email-error" className="text-sm text-red-400" role="alert">
    {error}
  </p>
)}
```

### 5.3 Estados de Foco Visibles

Todos los elementos interactivos (links, botones, inputs) deben tener un estado de foco visible:

```css
/* Clase base para todos los elementos interactivos */
:focus-visible {
  outline: 2px solid #06B6D4;
  outline-offset: 2px;
}
```

O en Tailwind:
```tsx
className="focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-surface-900"
```

> **Nota:** El outline/focus ring debe tener suficiente contraste con el fondo. El cian `#06B6D4` sobre `#18181B` tiene un ratio de 8.5:1, que excede ampliamente el mínimo.

---

## 6. Imágenes y Multimedia

### 6.1 Alt Text

| Tipo de imagen | Alt text |
|---|---|
| **Avatar de perfil** | `alt="Anthekira profile picture"` |
| **Captura de proyecto** | `alt="Screenshot of [Project Name] - [brief description]"` |
| **Logo de tecnología** | `alt="[Technology Name] logo"` |
| **Icono decorativo en botón** | `alt=""` (aria-hidden) |
| **Imagen decorativa de fondo** | CSS background-image (no img) o `alt=""` |

Ejemplos:

```tsx
// Imagen informativa
<img
  src={project.image}
  alt={`Screenshot of ${project.title} - ${project.description.substring(0, 60)}`}
  className="aspect-video object-cover"
/>

// Icono decorativo
<Github className="h-5 w-5" aria-hidden="true" />

// Imagen decorativa (sin significado)
<img src="/images/grid-bg.png" alt="" role="presentation" />
```

### 6.2 Imágenes en Tarjetas de Proyecto

```tsx
<article>
  <img
    src={project.image}
    alt={`Screenshot of ${project.title}`}
    loading="lazy"
    width={640}
    height={360}
  />
  <h3>{project.title}</h3>
  <p>{project.description}</p>
</article>
```

---

## 7. Navegación por Teclado

### 7.1 Orden de Tabulación Lógico

El orden de tabulación (Tab) debe seguir el orden visual de la página:

1. Header → Logo (home)
2. Header → Navegación (Projects, About, Contact)
3. Header → LanguageSwitcher
4. Main content (en orden visual: Hero → About → Skills → Technologies → Projects → Services → Contact)
5. Footer → Enlaces
6. Footer → Redes sociales

### 7.2 Skip to Content

Implementar un enlace "Skip to content" al inicio del `body` que permita saltar directamente al contenido principal:

```tsx
// En LandingLayout, al inicio del body:
<a
  href="#main-content"
  className="
    sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
    focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white
    focus:rounded-lg focus:outline-none
  "
>
  Skip to content
</a>

// El <main> debe tener id="main-content"
<main id="main-content" role="main">
  {children}
</main>
```

Además, los landmarks semánticos (`<main>`, `<nav>`) permiten a usuarios de lectores de pantalla navegar directamente.

### 7.3 Focus Management en Componentes Interactivos

```tsx
// Modal: atrapar foco y restaurar al cerrar
// LanguageSwitcher: cerrar con Escape
// Mobile menu: cerrar con Escape, focus en el botón de menú al cerrar

// Ejemplo: cierre con Escape
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [onClose]);
```

### 7.4 Elementos Interactivos Requeridos por Teclado

| Componente | Interacción por teclado |
|---|---|
| **Links** | Enter (navegar) |
| **Botones** | Enter o Space (activar) |
| **LanguageSwitcher** | Enter (abrir), Arrow Up/Down (navegar), Enter (seleccionar), Escape (cerrar) |
| **Modal** | Escape (cerrar), Tab (navegar dentro), Shift+Tab (navegar inverso), focus trap |
| **Select / Dropdown** | Enter (abrir), Arrow Up/Down (navegar), Enter (seleccionar) |
| **Mobile menu** | Enter (abrir/cerrar), Escape (cerrar) |

---

## 8. ARIA

### 8.1 Roles ARIA Básicos

Usar roles ARIA solo cuando el HTML semántico no sea suficiente:

```tsx
// ✅ Correcto: HTML semántico nativo (no necesita ARIA)
<nav>...</nav>
<main>...</main>
<footer>...</footer>

// ✅ Correcto: ARIA cuando es necesario
<button aria-label="Close menu" onClick={closeMenu}>
  <X />
</button>

<div role="alert" aria-live="assertive">
  {errorMessage}
</div>

<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <h2 id="modal-title">Confirm Deletion</h2>
</div>
```

### 8.2 Estados y Propiedades

```tsx
// Botón con estado expandido (mobile menu, dropdown)
<button
  aria-expanded={isOpen}
  aria-controls="mobile-menu"
  onClick={toggleMenu}
>
  <Menu />
</button>

// Pestañas (si se implementan)
<div role="tablist" aria-label="Project categories">
  <button role="tab" aria-selected={activeTab === 'all'}>All</button>
  <button role="tab" aria-selected={activeTab === 'web'}>Web</button>
</div>

// Toast/Notificación
<div role="status" aria-live="polite" aria-atomic="true">
  {toastMessage}
</div>
```

### 8.3 ARIA en el Panel Admin

```tsx
// Sidebar
<nav aria-label="Admin navigation">
  <a href="/admin" aria-current={isActive ? 'page' : undefined}>
    Dashboard
  </a>
</nav>

// DataTable
<table role="grid" aria-label="Projects list">
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Actions</th>
    </tr>
  </thead>
  <tbody>
    {/* filas */}
  </tbody>
</table>
```

---

## 9. Resumen de Prácticas V1

| Práctica | ¿Implementado? | Notas |
|---|---|---|
| HTML semántico | ✅ Sí | Landmarks, elementos correctos |
| Jerarquía de headings | ✅ Sí | h1 → h2 → h3, sin saltos |
| Contraste suficiente | ✅ Sí | Todas las combinaciones superan 4.5:1 |
| Labels en formularios | ✅ Sí | htmlFor + id, aria-label |
| Mensajes de error | ✅ Sí | aria-invalid, aria-describedby, role="alert" |
| Focus visible | ✅ Sí | focus:ring-2 + focus:outline-none |
| Alt text en imágenes | ✅ Sí | Descriptivo para informativas, alt="" para decorativas |
| Navegación por teclado | ✅ Sí | Enter, Space, Tab, Escape |
| ARIA básico | ✅ Sí | aria-label, aria-expanded, aria-modal, role |
| Skip to content | ✅ Sí | Enlace visible al recibir focus, al inicio del body |
| Focus trap en modales | 🟡 Parcial | Documentado, implementación pendiente de verificar |
| ARIA live regions | ❌ No | V2 |
| Pruebas automatizadas | ❌ No | V2 |

---

## 10. Dependencias con otros documentos

| Archivo | Relación |
|---|---|
| `00-REQUIREMENTS.md` | Requisitos de accesibilidad del proyecto |
| `04-AI-DEVELOPMENT-GUIDE.md` | Reglas sobre accesibilidad para agentes de IA |
| `frontend/02-COMPONENTS.md` | Componentes que deben implementar estas prácticas |
| `frontend/06-UI-UX.md` | Colores y estilos que deben mantener contraste suficiente |
