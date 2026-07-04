# Pages

## Single page

El sitio es una aplicación de una sola página (SPA). No existen rutas ni vistas independientes. Todo el contenido está en un único documento HTML con secciones delimitadas por IDs de ancla.

## Secciones como vistas funcionales

Cada sección actúa como una "vista" dentro de la página única. La navegación interna desplaza la ventana a la sección correspondiente:

| Vista | Ancla | Propósito |
|-------|-------|-----------|
| Hero | — (top) | Presentación principal, descarga CV, CTA, redes sociales |
| About | `#about` | Biografía y filosofía profesional |
| Skills | `#skills` | Stack tecnológico y áreas de expertise |
| Technologies | — | Grid de herramientas diarias (íconos + etiquetas) |
| Projects | `#projects` | Showcase de 4 proyectos destacados |
| Education | `#education` | Línea de tiempo académica |
| Services | `#services` | Oferta de servicios profesionales |
| Contact | `#contact` | Información de contacto y formulario |

Nota: la sección "Technologies" no tiene un ID de ancla propio, por lo que no es directamente accesible desde la navegación.
