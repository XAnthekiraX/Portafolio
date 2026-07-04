# Responsive Design

## Breakpoints

| Categoría | Ancho | Sidebar |
|---|---|---|
| Desktop | > 1024px | Expandida (240px) |
| Tablet | 769px – 1024px | Colapsada (64px) |
| Mobile | ≤ 768px | Drawer oculto |

---

## Desktop (> 1024px)

- Sidebar completa con labels visibles
- Content-area padding: 32px
- Grids:
  - Metrics: 4 columnas
  - Skills: 2 columnas
  - Technologies: 6 columnas
  - Projects: 3 columnas
  - Services: 3 columnas
  - Profile form: 2 columnas
  - Profile social + info: 3 columnas

---

## Tablet (769px – 1024px)

### Sidebar Colapsada
- Ancho: 64px
- Ocultos: nav-label, brand-text, sidebar-footer-text, sidebar-section-label
- Nav items centrados (justify-content: center)
- Indicador activo reposicionado (left: -1px)
- Brand area centrado (padding 16px 8px)
- Sidebar footer centrado

### Content Area
- Padding reducido: 24px
- Grids se adaptan:
  - Metrics: 2 columnas (sm) → 4 columnas (lg)
  - Technologies: 5 columnas
  - Projects: 2 columnas (md) → 3 columnas (xl)

---

## Mobile (≤ 768px)

### Sidebar como Drawer
- Posición fija, oculta fuera de pantalla (left: -260px)
- Al abrirse: left: 0 con transición de 0.3s
- Ancho completo: 240px
- Labels visibles al abrir
- Overlay semitransparente cubre el contenido

### Botón Burger
- Visible solo en mobile (display: flex)
- En desktop/tablet: display: none

### Content Area
- Padding reducido: 16px
- Topbar padding: 0 16px
- Grids apilados (1 columna):
  - Metrics: 1 columna
  - Profile: 1 columna (form apilado)
  - Skills: 1 columna
  - Technologies: 3 columnas
  - Projects: 1 columna
  - Services: 1 columna
  - Profile form: 1 columna

### Tabla Projects
- Contenedor con overflow-x-auto para scroll horizontal

---

## Prefers Reduced Motion

Se respeta `prefers-reduced-motion: reduce`:
- Todas las animaciones y transiciones se reducen a 0.01ms
