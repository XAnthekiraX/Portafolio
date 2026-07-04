# API Overview — Portfolio

## Propósito

API REST que sirve los datos del portafolio personal de Anthony Bonilla. Proporciona endpoints públicos de solo lectura para el contenido del portfolio (perfil, proyectos, habilidades, servicios, educación, tecnologías) y un endpoint de escritura para el formulario de contacto.

## Base URL

```
/api
```

## Convenciones

- Formato de request/response: JSON.
- Codificación: UTF-8.
- Fechas en formato ISO 8601 (`string`).
- Los IDs son strings UUID v4.
- Los endpoints de listado siempre devuelven un objeto con propiedad `data` que contiene un array.
- Los endpoints de detalle devuelven un objeto con propiedad `data` que contiene el recurso.
- Sin paginación (contenido estático de portfolio).

## Recursos identificados

| Recurso | Endpoint | Método | Propósito |
|---------|----------|--------|-----------|
| Profile | `/api/profile` | GET | Información del dueño del portfolio |
| Skills | `/api/skills` | GET | Categorías de habilidades técnicas |
| Technologies | `/api/technologies` | GET | Tecnologías/herramientas de uso diario |
| Projects | `/api/projects` | GET | Proyectos destacados |
| Education | `/api/education` | GET | Trayectoria académica |
| Services | `/api/services` | GET | Servicios profesionales ofrecidos |
| Contact | `/api/contact` | POST | Envío de mensaje de contacto |
| CV | `/api/cv` | GET | Descarga del archivo CV |

## Dominio de datos

El portfolio es un sitio personal estático. Toda la información es pública y administrada por el propietario. No existen recursos que requieran autenticación, autorización o propiedad de usuarios.

## Endpoints externos referenciados

La UI referencia enlaces externos que **no son parte de esta API**:

- Redes sociales (GitHub, LinkedIn, Twitter, Dribbble): enlaces directos a plataformas externas.
- Repositorios de proyectos (GitHub): enlaces directos a repos externos.
- Demos de proyectos: enlaces directos a URLs de demostración.
