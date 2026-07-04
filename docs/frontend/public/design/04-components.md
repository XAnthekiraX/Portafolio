# Components

## Navbar
- **Descripción**: barra de navegación fija superior con glassmorphism.
- **Estados**: estado inicial (transparente) → estado con scroll (sombra añadida).
- **Elementos internos**: logo, enlaces de navegación, language switcher, theme toggle, CTA button, mobile hamburger button.
- **Responsive**: en md+ muestra enlaces en línea; en móvil oculta enlaces y muestra drawer.

## Logo
- **Descripción**: bloque cuadrado rojo con la letra "A" blanca en fuente display + texto "Alex Doe".
- **Ubicación**: navbar y footer.
- **Responsive**: el texto "Alex Doe" se oculta en sm.

## Avatar Frame
- **Descripción**: contenedor cuadrado de 256px (64 en md) para la foto del perfil.
- **Comportamiento**: dos bordes decorativos rotados (±6°) que rotan ligeramente al hover (+3°). La imagen está en escala de grises y se satura al hover.
- **Floating badge**: badge "React / Node" con glow cian posicionado en la esquina inferior izquierda del avatar.

## Status Dot
- **Descripción**: círculo verde de 8px con animación pulsante (efecto ring expansivo).
- **Ubicación**: badge de disponibilidad en hero y bloque de estado en contacto.
- **Animación**: pulso infinito de 2 segundos.

## Skill Card
- **Descripción**: card de habilidad con icono, título y lista de tags.
- **Color de icono**: primario (rojo) o acento (cian) alternado.
- **Hover**: cambio sutil de borde.

## Tech Item
- **Descripción**: celda cuadrada con icono Lucide y etiqueta mono.
- **Hover**: cambio de borde (primario o acento alternado) + elevación (-translate-y-1).
- **Layout**: grid de 3 a 8 columnas según viewport.

## Project Card
- **Descripción**: card con imagen, badge, título, descripción, features tags y enlaces.
- **Imagen**: overlay gradient (primary→accent o accent→primary) + escalado al hover.
- **Badge**: categoría del proyecto en la esquina superior derecha.
- **Hover**: cambio de borde (primary/50 o accent/50), escalado de imagen, cambio de color de título.

## Timeline Item (Education)
- **Descripción**: item de timeline con dot, fecha, título, institución y descripción.
- **Layout**: alterna izquierda/derecha en escritorio (vía md classes).
- **Dot**: 12px, color primario o acento, con ring del color de fondo.

## Service Card
- **Descripción**: card con icono, título y descripción.
- **Hover**: fondo más claro, cambio de borde, icono cambia a fondo sólido con texto blanco.

## Contact Info Row
- **Descripción**: fila con icono en contenedor cuadrado + label mono + valor.
- **Variantes**: email (icono mail, rojo), ubicación (icono map-pin, cian), estado (dot verde).

## Form Input
- **Descripción**: input con label mono, fondo oscuro, borde, placeholder y foco con acento.
- **Variantes**: text, email, textarea (5 filas, resize-none).
- **Estado**: todos tienen estado required y placeholder.

## Form Button
- **Descripción**: botón full-width primario con icono send.
- **Estados**: default → hover → active (con colores correspondientes).

## Social Icons
- **Descripción**: enlaces a redes sociales usando iconos Lucide.
- **Variantes**: tamaño 24px (hero), 20px (contacto y footer).
- **Hover**: cambio de color a primario (rojo).

## Footer
- **Descripción**: barra inferior con 3 columnas: logo, enlaces (About, Projects, Contact), redes sociales.
- **Copyright**: línea inferior centrada con año y firma.

## Language Dropdown
- **Descripción**: menú desplegable con opciones ES (seleccionado), EN, PT.
- **Estado**: oculto por defecto, se muestra al click del botón. Se cierra al click fuera.

## Theme Toggle
- **Descripción**: botón que alterna entre icono sol (modo oscuro) y luna (modo claro).
- **Estado inicial**: modo oscuro (sol visible).
