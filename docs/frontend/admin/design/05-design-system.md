# Design System

## Modo de Color

Soporte dual dark/light. El modo dark es el predeterminado.
El toggle de tema intercambia entre ambos modos mediante la clase `dark`/`light` en `<html>`.

---

## Paleta de Colores

### Modo Dark
| Token | Valor | Uso |
|---|---|---|
| bg | #09090b | Fondo principal |
| surface | #18181b | Fondo de tarjetas, sidebar, topbar |
| surface-alt | #27272a | Hover de items, fondo de tags |
| border | #3f3f46 | Bordes de elementos |
| text | #f4f4f5 | Texto principal |
| text-muted | #a1a1aa | Texto secundario |
| glow-red | rgba(220,38,38,0.15) | Brillo rojo de fondo |
| glow-cyan | rgba(6,182,212,0.12) | Brillo cyan de fondo |

### Modo Light
| Token | Valor |
|---|---|
| bg | #fafafa |
| surface | #ffffff |
| surface-alt | #f4f4f5 |
| border | #e4e4e7 |
| text | #18181b |
| text-muted | #71717a |
| glow-red | rgba(220,38,38,0.08) |
| glow-cyan | rgba(6,182,212,0.07) |

### Colores de Acento
| Color | Valor | Uso |
|---|---|---|
| Red primario | #DC2626 | Botón primary, indicador activo, acentos |
| Red hover | #B91C1C | Hover de botón primary |
| Cyan primario | #06B6D4 | Botón cyan, enlaces, acentos secundarios |
| Cyan hover | #0891B2 | Hover de botón cyan |
| Verde | #22C55E | Badge "Publicado", estados positivos |
| Amarillo | #EAB308 | Badge "Borrador", estados intermedios |

---

## Tipografía

| Familia | Uso |
|---|---|
| Space Grotesk | Headings (font-heading) |
| Inter | Body text (defecto) |
| JetBrains Mono | Labels, tags, badges, código, tablas (font-mono) |

### Tamaños Observados
| Tamaño | Uso |
|---|---|
| 10px | Section labels en sidebar |
| 11px | Labels, badges, tags, mono text |
| 12px | Texto auxiliar |
| 13px | Body, inputs, botones |
| 14px | Títulos de card |
| 16px | Título de topbar, título de modal |
| 18px | Nombre en perfil |
| 24px | Valores de métrica |

---

## Border Radius
| Valor | Uso |
|---|---|
| 6px | Tags, skeletons, viewport indicator |
| 8px | Inputs, botones, thumbnails, icon containers |
| 10px | Tech icons |
| 12px | Cards, modals, service cards |
| 16px | Modal content, perfil foto |
| 99px | Badges (pill), progress bar |

---

## Espaciado
- Padding tarjetas: 20px
- Padding modal: 28px
- Padding content-area: 32px (desktop), 24px (tablet), 16px (mobile)
- Gap grid métricas: 16px
- Gap grid proyectos: 20px
- Gap items nav: 12px
- Gap botón interno: 6px

---

## Transiciones
| Duración | Uso |
|---|---|
| 0.1s | Hover en filas de tabla |
| 0.15s | Hover en botones, inputs, nav items, tags |
| 0.2s | Hover en cards, tech cards |
| 0.25s | FadeIn de vistas, hover service cards |
| 0.3s | Sidebar collapse/expand, project image zoom |
| 0.5s | Progress bar fill |

---

## Iconografía

Todos los iconos provienen de Lucide. Se inicializan con `lucide.createIcons()`.

### Iconos Utilizados
| Icono | Ubicación |
|---|---|
| code-2 | Brand sidebar, Dev Web service |
| layout-dashboard | Nav Dashboard |
| user | Nav Profile |
| zap | Nav Skills, Skills metric |
| file-text | Nav CV |
| graduation-cap | Nav Education |
| cpu | Nav Technologies, Technologies metric |
| folder-kanban | Nav Projects, Projects metric |
| briefcase | Nav Services, Profile experience |
| menu | Burger button |
| moon / sun | Theme toggle |
| camera | Cambiar foto perfil |
| map-pin | Ubicación perfil |
| pencil | Botón editar |
| plus | Agregar nuevo |
| arrow-right | "Ver todos" |
| check-circle-2 | Item completado |
| circle | Item pendiente |
| more-horizontal | Acciones de ítem |
| trending-up | Badge de métrica |
| eye | Visits metric |
| github | Social link, proyecto |
| linkedin | Social link |
| twitter | Social link |
| globe | Website social |
| upload | Reemplazar CV |
| download | Descargar CV |
| info | Nota informativa |
| external-link | Enlace externo proyecto |
| x | Cerrar modal, remover tag |
| smartphone | Mobile Apps service |
| server | Backend & APIs service |
| palette | UI/UX Design service |
| cloud | DevOps & Cloud service |
