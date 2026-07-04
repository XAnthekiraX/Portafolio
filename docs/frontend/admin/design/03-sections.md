# Sections

Cada vista se implementa como una sección `<section>` con clase `view-section`. Solo la sección activa tiene la clase `active` y es visible.

---

## Dashboard Sections

### Metrics Grid
- Contenedor grid: 1 columna (mobile), 2 columnas (sm), 4 columnas (lg)
- 4 tarjetas de métrica con icono, valor numérico, indicador de cambio

### Recent Projects
- Título + botón "Ver todos"
- Lista vertical de 3 cards con thumbnail, nombre, descripción, badge

### Profile Status
- Card con foto, nombre, barra de progreso, checklist de completitud

### Recent Activity
- Card con lista de eventos con punto de color y timestamp relativo

### Loading Preview
- Card demostrativa de skeletons

---

## Profile Sections

### Avatar & Info Card
- Card centrada con foto grande (112px), botón de cámara, nombre, título, descripción, ubicación, experiencia

### Personal Info Form
- Card con formulario grid de 2 columnas y acciones al pie

### Social Links
- Card con lista de redes sociales (social-row con icono, label, URL, botón editar)
- Botón "Agregar red social"

---

## Skills Sections

### Skills Grid
- Grid de 2 columnas (md+) con 4 cards de categoría
- Cada card: punto de color, título, contador, tags

---

## CV Sections

### CV Preview
- Card con mockup de documento y botones de acción

### File Info
- Card con metadatos del archivo (nombre, tamaño, tipo, páginas, última actualización)
- Card informativa sobre formato recomendado

---

## Education Sections

### Academic Timeline
- Timeline vertical con dots rojos para formación académica

### Certifications Timeline
- Timeline vertical con dots cyan para certificaciones

---

## Technologies Sections

### Tech Grid
- Grid responsivo: 3→4→5→6 columnas según viewport
- 18 tech-cards con icono de 2 letras + nombre

---

## Projects Sections

### Projects Grid
- Grid responsivo: 1→2→3 columnas
- Project cards con imagen, contenido, acciones
- Empty state ghost card

### Projects Table
- Card con tabla de todos los proyectos
- Columnas: Proyecto, Estado, Tecnologías, Visitas, Acciones
- Scroll horizontal en viewports pequeños

---

## Services Sections

### Services Grid
- Grid responsivo: 1→2→3 columnas
- Service cards con icono, título, descripción, badge, acciones
- Empty state ghost card
