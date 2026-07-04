# Components

## Card
- Fondo: surface, borde: 1px solid border, border-radius: 12px, padding: 20px
- Hover: border-color cambia a text-muted

## Card Ghost
- Fondo: transparente, borde: 1px dashed border
- Hover: border-color rojo, fondo con glow rojo
- Usada para empty states con "Agregar..."

## Button — Primary (`btn btn-primary`)
- Fondo: rojo (#DC2626), texto: blanco
- Hover: rojo oscuro (#B91C1C)
- Active: escala 0.97

## Button — Secondary (`btn btn-secondary`)
- Fondo: surface-alt, borde: 1px solid border
- Hover: fondo border

## Button — Ghost (`btn btn-ghost`)
- Fondo: transparente, texto: muted
- Hover: texto normal, fondo surface-alt

## Button — Cyan (`btn btn-cyan`)
- Fondo: cyan (#06B6D4), texto: blanco
- Hover: cyan oscuro (#0891B2)
- Usado en modal "Guardar proyecto"

## Tag
- Font: JetBrains Mono, 11px, border-radius: 6px
- Estados: default (muted), tag-red, tag-cyan
- Hover en default: borde y texto cyan

## Badge
- Formato pill (border-radius: 99px), 11px, font-weight 600
- Variantes: badge-green, badge-yellow, badge-red
- Puede incluir icono Lucide

## Input (`input-mock`)
- Fondo: bg, borde: 1px solid border, border-radius: 8px
- Focus: borde rojo + box-shadow glow rojo
- Placeholder: color muted

## Label (`label-mock`)
- Font: JetBrains Mono, 11px, uppercase, tracking-wider
- Color: muted, margin-bottom: 6px

## Skeleton
- Fondo: gradient animado (surface-alt → border → surface-alt)
- Animación shimmer (1.8s, infinite, ease-in-out)
- Border-radius: 6px

## Timeline
- Items con padding-left: 32px
- Línea vertical conectora (1px, border)
- Dot circular (12px, borde rojo 2px, fondo bg)
- Último ítem sin línea conectora

## Sparkline
- Contenedor flex align-end, gap 2px, height 32px
- Barras de 4px de ancho, border-radius 2px
- Color rojo (la última puede ser cyan)
- Hover en card padre: opacidad total

## Progress Bar
- Track: height 6px, border-radius 99px, fondo surface-alt
- Fill: gradient rojo→cyan, border-radius 99px
- Transición de width 0.5s

## Table (`mock-table`)
- Header: JetBrains Mono, 11px, uppercase, muted
- Celdas: padding 12px 16px, border-bottom
- Hover en fila: background surface-alt
- Scroll horizontal en viewports pequeños

## Empty State
- Centrado, padding 48px 24px, texto muted
- Icono contenedor (56px, border-radius 16px, surface-alt)
- Usado en Projects grid y Services grid

## Social Row
- Layout flex con gap 10px, padding 8px 0
- Separador border-bottom (último sin borde)
- Icono + label mono + valor + botón acción

## Metric Line
- Línea decorativa de 2px de alto, border-radius 2px
- Gradient: rojo→transparente o cyan→transparente

## Language Selector
- Flex container con border, border-radius 8px
- Botones: JetBrains Mono, 11px, font-weight 600
- Activo: fondo rojo, texto blanco

## Theme Toggle
- Botón cuadrado 36px, border-radius 8px, border
- Icono: luna (dark) / sol (light), alterna display

## Viewport Indicator
- Fixed, bottom-right, JetBrains Mono 10px
- Muestra "Desktop", "Tablet", o "Mobile" según el ancho

## Modal
- Overlay: fixed, inset 0, bg negro 0.6, backdrop-filter blur
- Content: surface, border-radius 16px, max-width 640px, max-height 85vh
- Scroll interno, padding 28px
- Se cierra al hacer click fuera del content
