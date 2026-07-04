# Pages / Views

## 1. Dashboard (`view-dashboard`)

Vista principal con resumen del portafolio.

### Métricas (4 tarjetas)
- **Projects:** 12 proyectos, +3 este mes, badge verde con icono trending-up
- **Technologies:** 18 tecnologías, sparkline de barras
- **Skills:** 24 skills, tags de categoría (Frontend, Backend, DevOps)
- **Visits:** 1.2k visitas, +18% vs mes anterior

### Proyectos Recientes (3 tarjetas horizontales)
- Cada tarjeta muestra: thumbnail, nombre, descripción corta, badge de estado
- Estados observados: Publicado (verde), Borrador (amarillo)
- Botón "Ver todos" que sugiere navegación a vista Projects

### Estado del Perfil
- Foto + nombre + "% completo" + barra de progreso (75%)
- Lista de ítems completados/pendientes con iconos check/circle

### Actividad Reciente
- Lista de eventos con punto de color (rojo, cyan, gris)
- Texto relativo ("Hace 2 horas", "Hace 1 día")

### Loading Preview
- Sección de demostración de skeletons

---

## 2. Profile (`view-profile`)

Vista de perfil personal.

### Columna Izquierda
- Foto de perfil grande (112px) con botón de cámara para cambiar
- Nombre, título (cyan), descripción, ubicación, años de experiencia

### Columna Derecha
- **Información personal:** Formulario con campos: Nombre, Apellido, Título, Email, Descripción, Ubicación, Experiencia. Botones Cancelar / Guardar cambios.
- **Redes sociales:** Lista de plataformas (GitHub, LinkedIn, Twitter, Website) con URL y botón de editar. Botón "Agregar red social".

---

## 3. Skills (`view-skills`)

Vista de habilidades agrupadas en 4 categorías.

- Encabezado con total (24 skills en 4 categorías) + botón "Nueva skill"
- **Frontend** (8 skills): React, Next.js, TypeScript, Tailwind CSS, Vue.js, Framer Motion, HTML5, CSS3
- **Backend** (7 skills): Node.js, Express, Python, Django, REST APIs, GraphQL, Prisma
- **DevOps** (5 skills): Docker, AWS, Vercel, CI/CD, Linux
- **Tools** (4 skills): Git, Figma, VS Code, Postman

Cada categoría tiene un punto de color distintivo.

---

## 4. CV (`view-cv`)

Vista de gestión del currículum vitae.

### Columna Izquierda (2/3)
- **Vista previa del CV:** Mockup de documento con placas de contenido (skeletons sin animación)
- Botones: "Reemplazar CV" (primary) y "Descargar" (secondary)

### Columna Derecha (1/3)
- **Info del archivo:** Nombre (`cv-carlos-mendez.pdf`), Tamaño (245 KB), Tipo (PDF), Páginas (2), Última actualización (hace 3 días)
- **Nota informativa:** Formato recomendado (PDF, max 5MB), con estilo cyan glow

---

## 5. Education (`view-education`)

Vista de formación académica y certificaciones.

- Encabezado con botón "Agregar"
- **Formación académica** (timeline): Máster en Ingeniería de Software (2020-2022), Grado en Informática (2016-2020)
- **Certificaciones** (timeline, dots cyan): AWS Solutions Architect, Meta Frontend Developer, Docker Certified Associate
- Cada ítem tiene botón de acciones (more-horizontal) o badge de estado

---

## 6. Technologies (`view-technologies`)

Vista de tecnologías del portafolio.

- 18 tecnologías en cuadrícula (6 columnas en desktop)
- Cada tecnología es un `tech-card` con icono de 2 letras y nombre
- Tecnologías: React, Next.js, TypeScript, Node.js, PostgreSQL, Tailwind, Python, Django, Docker, AWS, Git, GraphQL, Vue.js, Prisma, Express, Figma, Vercel, Linux

---

## 7. Projects (`view-projects`)

Vista de proyectos del portafolio.

### Tarjetas de proyecto (grid 3 columnas)
- 5 proyectos mostrados: E-Commerce Platform, Task Manager API, AI Chat Interface, Analytics Dashboard, SaaS Landing Page
- Cada tarjeta: imagen preview, nombre, descripción, tags de tecnologías, badge de estado, botones (externo, repo, editar)
- **Estados:** Publicado (verde), Borrador (amarillo), Oculto (rojo)
- **Empty state:** Tarjeta ghost para agregar nuevo proyecto

### Tabla de proyectos
- Columnas: Proyecto, Estado, Tecnologías, Visitas, Acciones
- 5 filas con datos mock

---

## 8. Services (`view-services`)

Vista de servicios profesionales.

### Tarjetas de servicio (grid 3 columnas)
- Desarrollo Web (Popular), Aplicaciones Móviles (Disponible), Backend & APIs (Disponible), UI/UX Design (Disponible), DevOps & Cloud (Bajo demanda)
- Cada tarjeta: icono, título, descripción, badge/tag de estado, botón de editar
- **Empty state:** Tarjeta ghost para agregar nuevo servicio
