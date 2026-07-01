---
doc_id: frontend-ui-ux
version: 1.0.0
last_updated: 2026-07-01
owner: Anthekira
type: guide
dependencies: [frontend-overview]
tags: [frontend, ui, ux, design, colors, typography, animations, dark-mode]
ai_context:
  primary_use: Design system reference, colors, typography, glassmorphism, animations, and layout specifications
  key_constraints: [dark mode only, Tailwind CSS-first design tokens, Lucide icons, no external design libraries]
  target_audience: Frontend developers, AI agents implementing UI and visual design
---

# 06-UI-UX.md — Anthekira.dev

## 1. Principios
Moderno, tecnológico, minimalista, modo oscuro único, profesional, legible.

## 2. Colores
```
Rojo (principal):   primary-600: #DC2626,  hover: #EF4444,  active: #B91C1C
Cian (acento):      accent-500: #06B6D4,   hover: #22D3EE,  active: #0891B2
Fondo profundo:     #09090B (surface-950)
Fondo base:         #18181B (surface-900)
Cards/elevado:      #27272A (surface-800)
Bordes:             #3F3F46 (surface-700)
Texto primario:     #F4F4F5 (surface-100)
Texto secundario:   #A1A1AA (surface-400)
```

## 3. Tipografía
| Uso | Fuente | Peso | Tamaño |
|---|---|---|---|
| h1 | Space Grotesk | Bold | text-5xl/6xl |
| h2 | Space Grotesk | Bold | text-3xl |
| h3 | Space Grotesk | Bold | text-xl |
| Body | Inter | Regular | text-base |
| Body small | Inter | Regular | text-sm |
| Badge/Tag | JetBrains Mono | Regular | text-xs |

## 4. Glassmorphism
```tsx
className="bg-surface-800/60 backdrop-blur-md border border-surface-700/50"
```
Usar en: Header sticky, modales, overlays, LanguageSwitcher dropdown. NO en cards de proyectos.

## 5. Animaciones
| Animación | Uso |
|---|---|
| `animate-fade-in` (0.5s) | Scroll reveal |
| `animate-fade-in-up` (0.6s) | Cards al scrollear |
| `animate-slide-in-left` (0.5s) | Sidebar móvil |
| `animate-glow-pulse` (3s) | Botones/cards en hover |
| `transition-colors duration-200` | Links y botones hover |
| `hover:scale-[1.02] transition-transform` | Cards hover |

**Scroll reveal:** Intersection Observer manual (sin librerías). Animar una vez. Stagger con `0.1s * index`.

## 6. Diseño Landing Page
| Sección | Layout | Fondo |
|---|---|---|
| Hero | 2 cols (avatar + texto) desktop, centrado mobile | gradient + grid tecnológico |
| About | 1 col, max-w-3xl | surface-900 |
| Skills | 2 cols categorías desktop, 1 mobile | surface-950 |
| Technologies | grid 3/4/6 cols responsive | surface-900 |
| Projects | grid 1/2/3 cols | surface-950 |
| Services | grid 1/2/3 cols | surface-900 |
| Contact | 2 cols (form + info) desktop, 1 mobile | surface-950 |
| Footer | grid 3/2/1 cols | surface-950 |

## 7. Diseño Admin
- **Sidebar:** `bg-surface-950`, w-60 expandido / w-64 colapsado. Item activo: `bg-primary-600/10 border-l-2 border-primary-600`
- **Navbar:** `bg-surface-900/80 backdrop-blur-md`, h-16
- **DataTable:** `bg-surface-800 rounded-xl`, header `bg-surface-750 text-xs uppercase`
- **FormBuilder:** max-w-2xl, Labels `text-sm text-surface-300`, Campos `bg-surface-800 border-surface-700 focus:border-accent-500`
- **Botón guardar:** `bg-primary-600 hover:bg-primary-500 text-white rounded-lg`

## 8. Iconografía
**Lucide React.** Iconos principales: Github, Linkedin, Mail, Download, ExternalLink, FolderKanban, Code, Cpu, Briefcase, User, Image, Settings, FileText, LogOut, Menu, X, Plus, Pencil, Trash2, Check, AlertCircle.
