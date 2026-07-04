# Design System

## Color Palette

### Primary (Rojo)
| Token | Valor | Uso |
|-------|-------|-----|
| primary | #DC2626 | Botones CTA, iconos, acentos, enlaces hover |
| primary-hover | #EF4444 | Hover de botones y elementos primarios |
| primary-active | #B91C1C | Active/pressed de botones primarios |

### Accent (Cian)
| Token | Valor | Uso |
|-------|-------|-----|
| accent | #06B6D4 | Iconos secundarios, enlaces, dots decorativos, focus ring |
| accent-hover | #22D3EE | Hover de elementos acento |
| accent-active | #0891B2 | Active de elementos acento |

### Dark Mode
| Token | Valor | Uso |
|-------|-------|-----|
| dark-950 | #09090B | Fondo base |
| dark-900 | #18181B | Fondo de secciones alternas, cards |
| dark-800 | #27272A | Bordes, tags, fondos secundarios |
| dark-700 | #3F3F46 | Bordes tenues, separadores |
| dark-400 | #A1A1AA | Texto secundario, metadata |
| dark-100 | #F4F4F5 | Texto principal |

### Light Mode
| Token | Valor | Uso |
|-------|-------|-----|
| light-50 | #FFFFFF | Fondo base |
| light-100 | #F4F4F5 | Fondo alterno |
| light-200 | #E4E4E7 | Bordes |
| light-300 | #D4D4D8 | Bordes tenues |
| light-400 | #A1A1AA | Texto secundario |
| light-500 | #71717A | Texto medio |
| light-800 | #27272A | Texto oscuro |
| light-900 | #18181B | Texto principal |

### Success
- **Green**: #22C55E — usado para status dot (disponible).

## Typography

| Role | Font | Fallback | Usado en |
|------|------|----------|----------|
| Display | Space Grotesk | sans-serif | Todos los h1-h5, logo |
| Body | Inter | sans-serif | Párrafos, texto general, body |
| Mono | JetBrains Mono | monospace | Labels, tags, metadata, sección numbering, badges |

### Font weights
- Inter: 300, 400, 500, 600, 700
- JetBrains Mono: 400, 500
- Space Grotesk: 400, 500, 600, 700

## Spacing

- **Section padding vertical**: 6rem (py-24) en móvil, 8rem (md:py-32) en escritorio.
- **Card padding**: 2rem (p-8).
- **Grid gaps**: 1.5rem (gap-6) en skills/projects, 1rem (gap-4) en technologies.
- **Container max-width**: 80rem (max-w-7xl) general, 56rem (max-w-4xl) para texto.
- **Navbar height**: 4rem (h-16).
- **Section inner margins**: mb-16 (4rem) para encabezados de sección.

## Border Radius

| Element | Radius |
|---------|--------|
| Cards (skills, projects, services) | rounded-2xl (16px) |
| Form inputs y botones | rounded-lg (8px) |
| Tags, badges | rounded-md (6px) |
| Avatar frame | rounded-2xl (16px) |

## Effects

- **Glassmorphism**: fondo semitransparente (rgba 0.3-0.7) + backdrop-filter blur(12px).
- **Grid background**: líneas tenues de 40x40px en el hero.
- **Glow**: box-shadow con blur de 80px en colores primario y acento.
- **Scroll reveal**: transición de opacidad 0→1 con translateY(30px)→0, duración 0.8s.
- **Custom scrollbar**: 8px, track dark, thumb gray (rojo al hover).
- **Focus ring**: outline 2px accent para accesibilidad en elementos interactivos.

## Shadows

- **Scroll shadow**: clase `.shadow-lg` añadida al navbar cuando scrollY > 20px.
- **Glow effects**: `0 0 80px -20px rgba(color, 0.4/0.5)` en botón CTA y floating badge.

## Animaciones

| Elemento | Animación | Duración |
|----------|-----------|----------|
| Status dot | pulse-dot (box-shadow expansivo) | 2s infinite |
| Scroll indicator chevron | bounce | estándar Tailwind |
| Avatar borders | rotate (6° → 3° al hover) | 0.5s |
| Avatar image | grayscale → full color al hover | 0.5s |
| Project images | scale(1 → 1.05) al hover | 0.5s |
| Scroll reveal | opacity + translateY | 0.8s |
| Card/service hover | border color, background, translateY | 0.3s |
| Theme transition | background-color, color | 0.3s |
