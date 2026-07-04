# Overview — Portfolio CMS (Admin Panel)

## Propósito

Panel de administración para un portafolio personal. Permite gestionar el perfil profesional, habilidades, CV, formación académica, tecnologías, proyectos y servicios ofrecidos.

## Tipo de Aplicación

Single Page Application (SPA) con cambio de vistas interno. Toda la interacción ocurre en una sola página sin recarga.

## Arquitectura Visual

- **Layout principal:** Sidebar + Main-wrapper (Topbar + Content area)
- **Sidebar:** Navegación principal agrupada en 3 secciones (General, Profile, Content)
- **Topbar:** Título de vista activa, selector de idioma, toggle de tema, avatar
- **Content area:** Área desplazable que contiene la vista activa

## Vistas

| Vista | ID | Descripción |
|---|---|---|
| Dashboard | `view-dashboard` | Métricas, proyectos recientes, estado del perfil, actividad reciente |
| Profile | `view-profile` | Foto, info personal, formulario de datos, redes sociales |
| Skills | `view-skills` | Skills agrupadas por categoría (Frontend, Backend, DevOps, Tools) |
| CV | `view-cv` | Vista previa del CV, info del archivo, acciones de descarga |
| Education | `view-education` | Línea de tiempo con formación académica y certificaciones |
| Technologies | `view-technologies` | Catálogo de tecnologías en cuadrícula |
| Projects | `view-projects` | Tarjetas de proyectos, tabla completa, modal de edición |
| Services | `view-services` | Tarjetas de servicios ofrecidos, empty state |

## Tema

Soporte completo para tema oscuro (por defecto) y claro, con variables CSS para todos los colores del sistema.

## Idioma

Selector de idioma visible en el Topbar con 3 opciones: ES, EN, PT.

## Usuario Representado

- **Nombre:** Carlos Mendez
- **Rol:** Full Stack Developer
- **Ubicación:** Madrid, España
- **Email:** carlos@devfolio.io
