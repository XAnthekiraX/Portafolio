# Layouts

La aplicación tiene dos layouts: **`PublicLayout`** (sitio público) y **`AdminLayout`** (panel de administración). La página de **login** es el único caso que no usa ningún layout — se renderiza como página standalone.

## Layout Público (PublicLayout)

```
+---------------------------------------------------+
|  Navbar                                           |
|  [logo] [nav-links] [lang-switcher] [theme-toggle] |
+---------------------------------------------------+
|                                                    |
|  <Outlet /> → HomePage (one-page scroll)           |
|  (Hero, About, Skills, Technologies, Projects,     |
|   Education, Services, Contact)                    |
|                                                    |
+---------------------------------------------------+
|  Footer                                            |
+---------------------------------------------------+
```

- Navbar fijo en la parte superior
- Footer al final
- El contenido se renderiza via `<Outlet />` de React Router

## Layout Admin (AdminLayout)

Estructura de dos columnas: Sidebar fijo a la izquierda + Main-wrapper a la derecha.

```
+------------------+------------------------------------------+
|                  |  Topbar (60px)                            |
|   Sidebar        |  [section-title] [lang-selector] [theme] |
|   (240px)        +------------------------------------------+
|                  |                                          |
|   - Brand        |  Content area (scrollable)               |
|   - Navigation   |                                          |
|   - Footer       |  [active view section]                   |
|                  |                                          |
+------------------+------------------------------------------+
```

---

## Sidebar

- Ancho: 240px
- Fondo: surface
- Borde derecho: 1px solid border
- Organización vertical con 3 zonas:

### Zona Superior: Brand
- Icono rojo con logo de código + nombre "FolioCMS"
- Separador inferior (border)

### Zona Media: Navegación
- Scroll independiente
- Grupos con labels: "GENERAL", "PROFILE", "CONTENT"
- Ítems de navegación con icono Lucide + label
- Ítem activo con indicador de barra roja a la izquierda

### Zona Inferior: Footer
- Avatar circular + nombre + email
- Separador superior (border)

---

## Topbar

- Altura: 60px
- Fondo: surface
- Borde inferior: 1px solid border
- Elementos (izquierda a derecha):
  1. Botón burger/menú (solo visible en mobile)
  2. Título de la vista activa
  3. Espaciador flexible
  4. Selector de idioma (ES | EN | PT)
  5. Toggle de tema (luna/sol)
  6. Avatar circular

---

## Content Area

- Área con scroll vertical propio
- Padding: 32px (desktop), 24px (tablet), 16px (mobile)
- Fondo con patrón de puntos sutiles (radial-gradient)
- Contiene las secciones de vista, mostrando solo la activa
