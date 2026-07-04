# Sections

## 1. Hero (Header)

- **Altura**: min-h-screen con `pt-24 pb-12` para compensar navbar.
- **Fondo**: patrón de cuadrícula (.grid-bg) con dos glows decorativos (rojo y cian) en esquinas.
- **Layout**: dos columnas en escritorio (texto izquierda, avatar derecha); columna única en móvil.
- **Bloques internos**:
  - Badge de disponibilidad con dot pulsante verde.
  - Nombre grande (h1).
  - Título profesional con "&" en rojo.
  - Párrafo descriptivo.
  - Metadata: ubicación + años de experiencia.
  - Dos botones: "Descargar CV" (primario con glow) y "Contactar" (outline).
  - Redes sociales: GitHub, LinkedIn, Twitter, Dribbble.
- **Avatar**: frame cuadrado con bordes geométricos rotados, imagen en escala de grises (se satura al hover), badge flotante "React / Node" con glow cian.
- **Scroll indicator**: flecha animada con texto "Scroll" (solo visible en escritorio).

## 2. About

- **ID**: `#about`
- **Ancho**: max-w-4xl (centrado, angosto).
- **Contenido**: 3 párrafos narrativos sobre enfoque profesional, experiencia y filosofía.
- **Encabezado**: prefijo mono "// 01. Sobre mí" + título display.

## 3. Skills

- **ID**: `#skills`
- **Layout**: grid 3 columnas en escritorio, 2 en tablet, 1 en móvil.
- **5 cards** con: icono + título + lista de tags tecnológicos:
  - Frontend (icono layout-dashboard, color primario)
  - Backend (icono server, color acento)
  - DevOps (icono cloud, color primario)
  - Tools (icono wrench, color acento)
  - Design & Other (icono palette, color primario)
- Staggered reveal con delays progresivos (0s, 0.1s, 0.2s).

## 4. Technologies

- **Layout**: grid responsivo (3→4→6→8 columnas).
- **8 items** cuadrados (aspect-square) con icono Lucide + etiqueta: Github, Figma, PostgreSQL, AWS, Bash, Git, Docker, Vercel.
- Hover: cambio de borde (primario o acento alternado) + elevación (-translate-y-1).
- Staggered reveal con delays de 0.05s.

## 5. Projects

- **ID**: `#projects`
- **Layout**: grid 2 columnas en escritorio, 1 en móvil.
- **4 project cards** con:
  - Imagen de fondo con overlay gradient.
  - Badge de categoría (SaaS, Web App, Mobile, E-commerce).
  - Título + descripción.
  - Tags de features.
  - Footer con enlaces Repo (GitHub) y Demo (externo).
- Hover: cambio de borde (primario o acento), escalado de imagen.

## 6. Education

- **ID**: `#education`
- **Layout**: timeline vertical con línea central en escritorio.
- **2 items** alternados (izquierda/derecha en escritorio, todos izquierda en móvil):
  - M.Sc. Human-Computer Interaction (Stanford, 2018-2020)
  - B.Sc. Computer Science (MIT, 2014-2018)
- Cada item: card con fecha (mono), título, institución, descripción.
- Dots indicadores: primario (rojo) y acento (cian) alternados.

## 7. Services

- **ID**: `#services`
- **Layout**: grid 3 columnas en escritorio, 1 en móvil.
- **3 service cards** con:
  - Icono cuadrado en contenedor (cambia fondo y color al hover).
  - Título.
  - Descripción.
- Staggered reveal con delays.

## 8. Contact

- **ID**: `#contact`
- **Layout**: 2 columnas en escritorio (info izquierda, formulario derecha).
- **Info blocks**:
  - Email (mailto) con icono.
  - Ubicación con icono.
  - Estado disponible con dot verde.
  - Redes sociales en contenedores cuadrados.
- **Formulario**: ver 07-forms.md.
