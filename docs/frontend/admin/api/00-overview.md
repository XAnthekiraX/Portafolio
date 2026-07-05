# Private API Overview — Portfolio CMS Admin

## Propósito

API REST privada para la administración del portafolio. Permite gestionar (CRUD) todos los recursos del portafolio: perfil, habilidades, CV, educación, tecnologías, proyectos y servicios.

## Base URL

```
/api/admin
```

## Autenticación

Todas las rutas requieren autenticación JWT excepto `/api/admin/auth/login`.

- Header: `Authorization: Bearer <token>`
- El token se obtiene mediante `POST /api/admin/auth/login`

## Convenciones

- Formato de request/response: JSON.
- Multipart para endpoints que incluyen subida de archivos (profile avatar, project image).
- Codificación: UTF-8.
- Fechas en formato ISO 8601 (`string`).
- IDs como strings UUID v4.
- Los endpoints de listado devuelven `{ data: [] }`.
- Los endpoints de detalle devuelven `{ data: {} }`.
- Sin paginación.

## Recursos

| Recurso | Endpoint base | Propósito |
|---|---|---|
| Auth | `/api/admin/auth` | Login, logout, sesión actual |
| Profile | `/api/admin/profile` | Perfil personal del dueño |
| Social Links | `/api/admin/profile/social` | Redes sociales |
| Skills | `/api/admin/skills` | Categorías de habilidades |
| CV | `/api/admin/cv` | Archivo CV |
| Education | `/api/admin/education` | Formación y certificaciones |
| Technologies | `/api/admin/technologies` | Tecnologías del catálogo |
| Projects | `/api/admin/projects` | Proyectos del portafolio |
| Services | `/api/admin/services` | Servicios ofrecidos |
| Contact | `/api/admin/contact` | Gestión de mensajes de contacto |

## Relación con Public API

La API pública (`/api/`) expone los mismos datos en modo solo lectura. La API privada (`/api/admin/`) es la fuente de verdad: los cambios aquí se reflejan automáticamente en los endpoints públicos.

| Campo público | Origen admin |
|---|---|
| `name` | `firstName + lastName` |
| `status` (projects/services) | `status` |
| `icon` (skills/technologies/services) | Derivado del nombre |
| `features` (projects) | Tecnologías del proyecto |
| `imageUrl` (projects) | `image` (file upload → URL) |
| `avatarUrl` (profile) | `avatar` (file upload → URL) |

## Endpoints externos referenciados

- Redes sociales: enlaces directos a plataformas externas.
- Repositorios de proyectos: enlaces a GitHub.
- Demos de proyectos: URLs de demostración.
- URL del CV: enlace de descarga externo o CDN.
