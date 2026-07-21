# Overview — Portfolio Anthony Bonilla

## Propósito

Portfolio personal de **Anthony Bonilla**, Junior Full Stack Developer & UI/UX Designer. Sitio web de una sola página (SPA) orientado a mostrar experiencia profesional, proyectos, servicios y facilitar el contacto.

## Tipo de aplicación

Página estática one-page con scroll nativo, modo oscuro/claro y selector de idioma. Sin enrutamiento interno (todo en el mismo documento HTML).

## Audiencia objetivo

- Clientes potenciales buscando servicios de desarrollo web, diseño UI/UX o consultoría.
- Reclutadores o equipos técnicos evaluando el perfil del candidato.

## Estructura general

El sitio se compone de 8 secciones principales ordenadas verticalmente:

| # | Sección | ID |
|---|---------|----|
| 1 | Hero (header) | — |
| 2 | Sobre mí | `#about` |
| 3 | Habilidades | `#skills` |
| 4 | Tecnologías | — |
| 5 | Proyectos | `#projects` |
| 6 | Educación | `#education` |
| 7 | Servicios | `#services` |
| 8 | Contacto | `#contact` |

## Componentes globales

- **Navbar** fijo en la parte superior con glassmorphism.
- **Footer** con enlaces rápidos, redes sociales y créditos.
- **Language Switcher** (ES/EN/PT) en la navbar.
- **Theme Toggle** (oscuro/claro) en la navbar.
- **Scroll reveal** en elementos al hacer scroll.

## Navegación

- Enlaces del navbar navegan a secciones vía anclas (`#about`, `#skills`, etc.).
- El footer incluye enlaces a About, Projects y Contact.
- Botón CTA "Contactar" navega a `#contact`.

## Dark/Light mode

El sitio soporta dos modos de color: **dark** (por defecto) y **light**. El usuario puede alternar mediante un botón en la navbar. El cambio afecta fondos, texto, bordes y efectos de glassmorphism.

## Internacionalización

Selector de idioma en la navbar con tres opciones: ES (activo), EN, PT. El comportamiento de cambio de idioma no está implementado en el prototipo; solo se muestra el dropdown con las opciones.

## Comportamientos observables

- Navbar añade sombra al hacer scroll > 20px.
- Elementos con clase `.reveal` aparecen con animación al hacer scroll.
- El avatar tiene efecto hover que desatura/restaura color y rota bordes decorativos.
- Las cards tienen hover effects: cambio de borde, elevación (translateY), escalado de imágenes.
