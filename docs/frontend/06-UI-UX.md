# 06-UI-UX.md — Anthekira.dev — Guía de Diseño Visual y UX

## 1. Propósito

Esta guía define el diseño visual completo de Anthekira.dev: paleta de colores, tipografía, glassmorphism, animaciones, diseño de cada sección de la Landing Page y del Panel Admin. Los agentes de IA deben usar esta guía como referencia para implementar todos los componentes visuales.

---

## 2. Principios de Diseño

| Principio | Descripción |
|---|---|
| **Moderno** | Diseño contemporáneo, limpio, sin elementos vintage ni ornamentales |
| **Tecnológico** | Aire futurista sutil: glassmorphism, grid backgrounds, glow effects |
| **Minimalista** | Menos es más. Espacio negativo generoso, contenido bien aireado |
| **Modo oscuro** | Experiencia única en modo oscuro. Sin modo claro |
| **Profesional** | Adecuado para reclutadores y clientes empresariales |
| **Legibilidad** | Contraste suficiente, tipografía clara, jerarquía visual definida |

---

## 3. Paleta de Colores

### 3.1 Colores Base

```
Rojo (Principal — Energía, personalidad)
  primary-600: #DC2626  ← Color principal de la marca
  primary-500: #EF4444  ← Hover states
  primary-700: #B91C1C  ← Active/pressed states

Cian (Acento — Tecnología, futuro)
  accent-500: #06B6D4  ← Color de acento principal
  accent-400: #22D3EE  ← Hover states
  accent-600: #0891B2  ← Active/pressed states
```

### 3.2 Escala de Neutros

```
Fondo más profundo:   surface-950: #09090B
Fondo base:           surface-900: #18181B
Fondo de secciones:   surface-750: #2A2A2E
Fondo de cards/elevado: surface-800: #27272A
Bordes:               surface-700: #3F3F46
Texto secundario:     surface-400: #A1A1AA
Texto primario:       surface-100: #F4F4F5
```

### 3.3 Aplicación de Colores

| Elemento | Color | CSS Class |
|---|---|---|
| **Fondo de página** | `#18181B` | `bg-surface-900` |
| **Fondo de secciones alternas** | `#09090B` | `bg-surface-950` |
| **Fondo de cards y contenedores** | `#27272A` | `bg-surface-800` |
| **Texto principal (headings)** | `#F4F4F5` | `text-surface-100` |
| **Texto body** | `#D4D4D8` | `text-surface-300` |
| **Texto secundario (metadatos)** | `#A1A1AA` | `text-surface-400` |
| **Bordes sutiles** | `#3F3F46/50` | `border-surface-700/50` |
| **Enlaces y botones primarios** | `#DC2626` | `bg-primary-600` |
| **Hover enlaces primarios** | `#EF4444` | `hover:bg-primary-500` |
| **Acentos tecnológicos** | `#06B6D4` | `text-accent-500` |
| **Glow effects** | rgba(6, 182, 212, 0.2-0.4) | `accent con opacidad` |

---

## 4. Tipografía

### 4.1 Fuentes

| Uso | Fuente | CSS Variable | Peso principal |
|---|---|---|---|
| **Headings (h1-h4)** | Space Grotesk | `--font-heading` | Bold (700) |
| **Headings (h5-h6)** | Space Grotesk | `--font-heading` | Semibold (600) |
| **Body text** | Inter | `--font-body` | Regular (400) |
| **Body strong** | Inter | `--font-body` | Semibold (600) |
| **Código / Tags** | JetBrains Mono | `--font-mono` | Regular (400) |

### 4.2 Escala de Tamaños

| Elemento | Tamaño | Line-height | Tracking |
|---|---|---|---|
| **h1** (Hero title) | `text-5xl` (48px) o `text-6xl` (60px) | `leading-tight` (1.1) | `tracking-tight` |
| **h2** (Section title) | `text-3xl` (30px) | `leading-snug` (1.3) | `tracking-tight` |
| **h3** (Card title) | `text-xl` (20px) | `leading-snug` (1.3) | normal |
| **h4** (Subsection) | `text-lg` (18px) | `leading-snug` (1.3) | normal |
| **Body** | `text-base` (16px) | `leading-relaxed` (1.6) | normal |
| **Body small** | `text-sm` (14px) | `leading-normal` (1.5) | normal |
| **Caption / Meta** | `text-xs` (12px) | `leading-normal` (1.5) | normal |
| **Badge / Tag** | `text-xs` (12px) | `leading-none` | `tracking-wide` |

### 4.3 Jerarquía Visual en Landing Page

```
Página Home:
  h1: "Desarrollador Full-Stack" (Hero - Space Grotesk Bold)
  h2: "Sobre Mí" / "Proyectos" / "Servicios" (Section titles)
  h3: "Project Card Title" / "Service Name"
  h4: "Skill Category" (Frontend, Backend, etc.)
  Body: Descripciones, biografía, textos de servicio

Página Proyecto:
  h1: "Project Name" (detalle de proyecto)
  h2: "Tecnologías utilizadas" / "Enlaces"
  Body: Descripción completa del proyecto
```

---

## 5. Glassmorphism

### 5.1 Definición

Efecto de vidrio esmerilado con blur y semitransparencia. Usado sutilmente para dar profundidad y un toque tecnológico.

### 5.2 Clase Base

```css
.glass {
  background: rgba(39, 39, 42, 0.6);  /* surface-800 con 60% opacidad */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(63, 63, 70, 0.5);  /* surface-700/50 */
}
```

Equivalente en Tailwind:
```tsx
className="bg-surface-800/60 backdrop-blur-md border border-surface-700/50"
```

### 5.3 Dónde Usar Glassmorphism

| Elemento | ¿Usar? | Intensidad |
|---|---|---|
| **Header sticky** | Sí | `bg-surface-900/80 backdrop-blur-md` |
| **Modales y overlays** | Sí | `bg-surface-950/60 backdrop-blur-sm` (overlay) |
| **Cards de proyectos** | No (usar fondo sólido) | — |
| **Sidebar admin** | Sí (transición hover) | `hover:bg-surface-800/80` |
| **LanguageSwitcher dropdown** | Sí | `bg-surface-800/90 backdrop-blur-md` |

---

## 6. Animaciones

### 6.1 Definiciones en Tailwind v4

> Las animaciones se definen en CSS con `@theme` y `@keyframes` en `globals.css`.
> Ver `frontend/00-FRONTEND.md` §4.1 para la implementación completa.

**Variables CSS en `@theme`:**
```css
--animate-fade-in:       fade-in 0.5s ease-out;
--animate-fade-in-up:    fade-in-up 0.6s ease-out;
--animate-slide-in-left: slide-in-left 0.5s ease-out;
--animate-glow-pulse:    glow-pulse 3s ease-in-out infinite;
```

**Keyframes en CSS:**
```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes slide-in-left {
  from { opacity: 0; transform: translateX(-20px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.2); }
  50%      { box-shadow: 0 0 30px rgba(6, 182, 212, 0.4); }
}
```

Tailwind v4 genera automáticamente las utilidades `animate-fade-in`, `animate-fade-in-up`, etc.

### 6.2 Cuándo Usar Cada Animación

| Animación | Uso |
|---|---|
| `fade-in` | Elementos que aparecen al hacer scroll (scroll reveal) |
| `fade-in-up` | Cards de proyectos, servicios, tecnologías al scrollear |
| `slide-in-left` | Sidebar del admin al abrirse en móvil |
| `glow-pulse` | Botones primarios en hover, cards de proyectos en hover |
| **Transiciones CSS** | `transition-colors duration-200` en hover de links y botones |
| **Transform** | `hover:scale-[1.02] transition-transform duration-200` en cards |

### 6.3 Scroll Reveal

Implementar scroll reveal con **Intersection Observer** (no librerías externas como AOS o Framer Motion). Estrategia:

```tsx
// Hook simple para scroll reveal (implementación manual)
function useScrollReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
}

// Uso:
// <div ref={ref} className={`animate-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
```

**Reglas de scroll reveal:**
- Animar solo una vez (no repetir al hacer scroll hacia arriba)
- No animar elementos que ya están visibles al cargar (Hero no necesita scroll reveal)
- No animar en el admin (solo Landing Page)
- Stagger: los hijos de un grid pueden aparecer con delay `0.1s * index`

---

## 7. Diseño de Cada Sección (Landing Page)

### 7.1 Hero

| Aspecto | Especificación |
|---|---|
| **Layout** | Dos columnas en escritorio (avatar + texto), centrado en móvil |
| **Fondo** | Gradiente sutil: `bg-gradient-to-br from-primary-600/10 via-surface-900 to-accent-500/10` + grid tecnológico (ver patrón CSS abajo) |

Patrón de grid tecnológico:
```css
.hero-grid {
  background-image: 
    linear-gradient(rgba(6, 182, 212, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  background-position: center center;
}
```
Esto genera una cuadrícula de líneas cian muy sutiles (3% de opacidad) separadas por 60px, dando un efecto de "grid tecnológico" sin distraer del contenido.
| **Avatar** | Ilustración anime profesional, circular, borde con glow cian (`ring-2 ring-accent-500/50`) |
| **Título** | `font-heading text-5xl md:text-6xl font-bold text-surface-100` |
| **Subtítulo** | `text-xl md:text-2xl text-accent-500 font-body` |
| **Descripción** | `text-base md:text-lg text-surface-400 max-w-xl` |
| **Botón CV** | `bg-primary-600 hover:bg-primary-500 text-white rounded-lg px-6 py-3` con icono de descarga |
| **Redes sociales** | Iconos en fila con `text-surface-400 hover:text-accent-500 transition-colors` |
| **Animación** | Elementos con `animate-fade-in-up` con stagger (0s, 0.1s, 0.2s, 0.3s) |
| **Responsive** | Móvil: centrado, avatar arriba, texto abajo. Tablet: mantiene dos columnas |

### 7.2 About

| Aspecto | Especificación |
|---|---|
| **Layout** | Una columna, ancho max-w-3xl centrado |
| **Título** | `font-heading text-3xl font-bold text-surface-100` con indicador de acento (línea cian debajo o `text-accent-500` en la primera letra) |
| **Contenido** | Párrafos de biografía con `text-surface-300 leading-relaxed` |
| **Separación** | `py-20 md:py-32` |
| **Estado profesional** | Badge: `bg-primary-600/20 text-primary-500 border border-primary-600/30 rounded-full px-4 py-1 text-sm` |

### 7.3 Skills

| Aspecto | Especificación |
|---|---|
| **Layout** | Categorías en columnas (2 en escritorio, 1 en móvil) |
| **Título de categoría** | `font-heading text-lg font-semibold text-surface-100 mb-4` |
| **Tags** | `Badge` component con variante: primario para Frontend, acento para Backend, etc. |
| **Contenedor de tags** | Flex wrap con `gap-2` |
| **Fondo de sección** | `bg-surface-950` (alternar con Hero) |

### 7.4 Technologies

| Aspecto | Especificación |
|---|---|
| **Layout** | Grid responsive: `grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6` |
| **Card de tecnología** | `flex flex-col items-center gap-2 p-4 bg-surface-800 rounded-xl hover:ring-1 hover:ring-accent-500/30 hover:shadow-lg hover:shadow-accent-500/5 transition-all duration-300` |
| **Icono/Logo** | 48x48px, filter grayscale(0) on hover |
| **Nombre** | `text-sm text-surface-300 font-medium` |

### 7.5 Projects

| Aspecto | Especificación |
|---|---|
| **Layout** | Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6` |
| **Card** | `bg-surface-800 rounded-xl overflow-hidden border border-surface-700/50 hover:border-accent-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent-500/5` |
| **Imagen** | `aspect-video w-full object-cover` |
| **Contenido card** | `p-5` con título `font-heading text-lg font-semibold` + descripción `text-sm text-surface-400 line-clamp-2` + tecnologías (Badges) |
| **Hover** | Elevación sutil `hover:-translate-y-1`, glow pulse en borde |

### 7.6 Services

| Aspecto | Especificación |
|---|---|
| **Layout** | Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6` |
| **Card** | `bg-surface-800 rounded-xl p-6 border border-surface-700/50 hover:border-primary-600/30 transition-all` |
| **Icono** | 40x40px, `text-accent-500` o `text-primary-500` según categoría |
| **Estado** | Badge pequeño arriba a la derecha: "Available" (`bg-green-500/20 text-green-400`) o "Coming Soon" (`bg-surface-700 text-surface-400`) |

### 7.7 Contact

| Aspecto | Especificación |
|---|---|
| **Layout** | Dos columnas en escritorio (formulario + info/redes), una en móvil |
| **Formulario** | Campos con `bg-surface-800 border border-surface-700 focus:border-accent-500 focus:ring-1 focus:ring-accent-500 focus:outline-none rounded-lg px-4 py-2.5 text-surface-100 placeholder:text-surface-500` |
| **Botón enviar** | `bg-primary-600 hover:bg-primary-500 text-white rounded-lg px-8 py-3 font-medium` |
| **Redes sociales** | Iconos grandes (`text-2xl`) con `text-surface-400 hover:text-accent-500` |
| **Fondo** | `bg-surface-950` |

### 7.8 Footer

| Aspecto | Especificación |
|---|---|
| **Layout** | Grid 3 columnas (logo, links, social) en escritorio, 1 en móvil |
| **Fondo** | `bg-surface-950 border-t border-surface-800` |
| **Logo** | `font-heading text-lg text-primary-600` |
| **Links** | `text-surface-400 hover:text-surface-100 transition-colors text-sm` |
| **Copyright** | `text-xs text-surface-600 text-center pt-8 border-t border-surface-800` |

---

## 8. Diseño del Panel Admin

Diferenciado visualmente de la Landing Page: más funcional, tipo dashboard SaaS profesional.

### 8.1 Sidebar

| Aspecto | Especificación |
|---|---|
| **Fondo** | `bg-surface-950 border-r border-surface-800` |
| **Ancho** | Expandido: `w-60` (240px). Colapsado: `w-16` (64px). Móvil: oculto |
| **Items** | `flex items-center gap-3 px-4 py-2.5 text-sm text-surface-400 hover:text-surface-100 hover:bg-surface-800/50 rounded-lg transition-colors` |
| **Item activo** | `bg-primary-600/10 text-primary-500 border-l-2 border-primary-600` |
| **Logo** | `font-heading text-lg text-primary-600 p-4` (expandido) o solo inicial (colapsado) |

### 8.2 Navbar

| Aspecto | Especificación |
|---|---|
| **Fondo** | `bg-surface-900/80 backdrop-blur-md border-b border-surface-800` |
| **Altura** | `h-16` |
| **Título** | `font-heading text-lg font-semibold text-surface-100` |
| **Avatar/Usuario** | `flex items-center gap-2 text-sm text-surface-300` |

### 8.3 DataTable

| Aspecto | Especificación |
|---|---|
| **Fondo** | `bg-surface-800 rounded-xl border border-surface-700/50 overflow-hidden` |
| **Header** | `bg-surface-750 text-surface-300 text-xs font-semibold uppercase tracking-wider` |
| **Filas** | `border-b border-surface-700/30 text-sm text-surface-100 hover:bg-surface-750/50` |
| **Acciones** | Iconos de editar/eliminar con `text-surface-400 hover:text-primary-500` |

### 8.4 FormBuilder

| Aspecto | Especificación |
|---|---|
| **Layout** | Una columna, `max-w-2xl` |
| **Labels** | `text-sm font-medium text-surface-300 mb-1.5` |
| **Campos** | `w-full bg-surface-800 border border-surface-700 focus:border-accent-500 focus:ring-1 focus:ring-accent-500 focus:outline-none rounded-lg px-4 py-2.5 text-surface-100 placeholder:text-surface-500` |
| **Errores** | `text-sm text-red-400 mt-1` |
| **Botón guardar** | `bg-primary-600 hover:bg-primary-500 text-white rounded-lg px-6 py-2.5 font-medium` |

---

## 9. Comportamiento Responsive

### 9.1 Breakpoints

| Breakpoint | Tailwind | Dispositivo |
|---|---|---|
| `≥ 1024px` | `lg:` | Escritorio (diseño principal) |
| `≥ 768px` | `md:` | Tablet |
| `< 768px` | (base) | Móvil |

### 9.2 Landing Page — Reorganización por Breakpoint

| Sección | Escritorio (lg) | Tablet (md) | Móvil |
|---|---|---|---|
| **Header** | Nav horizontal | Nav horizontal | Hamburguer menu |
| **Hero** | 2 columnas (avatar + texto) | 2 columnas | 1 columna centrada |
| **Skills** | 2 columnas de categorías | 2 columnas | 1 columna |
| **Technologies** | 6 columnas | 4 columnas | 3 columnas |
| **Projects** | 3 columnas | 2 columnas | 1 columna |
| **Services** | 3 columnas | 2 columnas | 1 columna |
| **Contact** | 2 columnas (form + info) | 2 columnas | 1 columna |
| **Footer** | 3 columnas | 2 columnas | 1 columna |

### 9.3 Admin — Comportamiento del Sidebar

| Breakpoint | Sidebar |
|---|---|
| `≥ 1024px` (`lg:`) | Expandido (`w-60`) con texto |
| `≥ 768px` y `< 1024px` (`md:`) | Colapsado (`w-16`) solo iconos, tooltips en hover |
| `< 768px` | Oculto, toggle con hamburguer en Navbar |

---

## 10. Iconografía

### 10.1 Librería Recomendada

**Lucide React** — Librería de iconos open-source, ligera, consistente, con soporte TypeScript.

```bash
npm install lucide-react
```

### 10.2 Uso de Iconos

```tsx
import { Github, Linkedin, Mail, Download, ExternalLink, FolderKanban, Code, Cpu, Briefcase, User, Image, Settings, FileText, LogOut, Menu, X, ChevronDown, ChevronRight, Plus, Pencil, Trash2, Check, AlertCircle } from 'lucide-react';
```

### 10.3 Iconos por Sección

| Sección / Uso | Icono |
|---|---|
| **Redes sociales** | `Github`, `Linkedin`, `Mail` (o `Globe`) |
| **Descargar CV** | `Download` |
| **Enlace externo** | `ExternalLink` |
| **Admin: Proyectos** | `FolderKanban` |
| **Admin: Skills** | `Code` |
| **Admin: Technologies** | `Cpu` |
| **Admin: Services** | `Briefcase` |
| **Admin: Personal Info** | `User` |
| **Admin: Media** | `Image` |
| **Admin: Messages** | `Mail` |
| **Admin: CV** | `FileText` |
| **Admin: Settings** | `Settings` |
| **Admin: Logout** | `LogOut` |
| **Admin: Menú móvil** | `Menu` / `X` |
| **Formularios: Éxito** | `Check` |
| **Formularios: Error** | `AlertCircle` |
| **CRUD: Crear** | `Plus` |
| **CRUD: Editar** | `Pencil` |
| **CRUD: Eliminar** | `Trash2` |
| **Modal: Cerrar** | `X` |

---

## 11. Dependencias con otros documentos

| Archivo | Relación |
|---|---|
| `frontend/00-FRONTEND.md` | Configuración de Tailwind que implementa estos tokens visuales |
| `frontend/02-COMPONENTS.md` | Componentes que usan estos estilos |
| `frontend/03-LAYOUTS.md` | Layouts que aplican estos estilos globales |
| `frontend/05-SEO.md` | Imágenes OG diseñadas con esta paleta |
| `frontend/07-ACCESSIBILITY.md` | Contraste y legibilidad de estos colores |
| `frontend/08-ADMIN-PANEL.md` | Diseño diferenciado del admin |
