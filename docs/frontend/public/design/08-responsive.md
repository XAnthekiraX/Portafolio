# Responsive

## Breakpoints utilizados

| Prefijo | Valor | Cambios principales |
|---------|-------|---------------------|
| sm | 640px | Logo muestra texto, botones en fila, grid 4 cols tech |
| md | 768px | Navbar enlaces visibles, drawer oculto, grid 2 cols skills, timeline alterna, pie 3 cols |
| lg | 1024px | Hero en fila, contacto 2 cols, padding lateral 2rem |

## Comportamiento por componente

### Navbar
- **< md**: enlaces ocultos, botón hamburguesa visible. Drawer ocupa toda la altura restante.
- **>= md**: enlaces visibles horizontalmente, botón hamburguesa oculto.
- **< sm**: texto del logo ("Anthony Bonilla") oculto.

### Hero
- **< lg**: columna única centrada, avatar debajo del texto.
- **>= lg**: dos columnas (texto izquierda, avatar derecha) con gap de 3-5rem.
- Scroll indicator: oculto en móvil (< md).

### Skills grid
- **1 columna**: < md.
- **2 columnas**: md.
- **3 columnas**: lg.

### Technologies grid
- **3 columnas**: base.
- **4 columnas**: sm.
- **6 columnas**: md.
- **8 columnas**: lg.

### Projects grid
- **1 columna**: < md.
- **2 columnas**: >= md.

### Timeline (Education)
- **< md**: todos los items alineados a la izquierda, línea vertical a la izquierda.
- **>= md**: items alternan izquierda/derecha con línea central.

### Services grid
- **1 columna**: < md.
- **3 columnas**: >= md.

### Contact
- **< lg**: columna única (info arriba, form abajo).
- **>= lg**: 2 columnas.

### Footer
- **< md**: columnas apiladas centradas.
- **>= md**: 3 columnas en fila (logo izq, enlaces centro, redes der).

## Consideraciones de responsive

- Las cards de Skills y Services mantienen padding uniforme en todos los tamaños.
- Las imágenes de proyectos tienen altura fija (h-64) sin cambio responsivo.
- El avatar cambia de 256px a 320px (w-64 → w-80 md) manteniendo aspecto cuadrado.
- Los glows decorativos del hero tienen posiciones fijas y no se reubican en móvil.
- Los delays escalonados (staggered reveal) se mantienen en todos los tamaños.
