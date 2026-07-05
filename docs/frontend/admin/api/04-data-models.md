# Data Models

## Admin

Representa al administrador del sistema (único).

| Campo | Tipo | Descripción |
|---|---|---|
| id | string | Identificador único |
| firstName | string | Nombre |
| lastName | string | Apellido |
| email | string | Correo electrónico |
| password | string | Contraseña (solo escritura, no se devuelve) |

---

## Profile

Representa la información del dueño del portafolio.

```json
{
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "title": "string",
  "description": "string",
  "location": "string",
  "experienceYears": "integer",
  "isAvailable": "boolean",
  "email": "string",
  "avatarUrl": "string",
  "socialLinks": [
    {
      "id": "string",
      "platform": "string",
      "url": "string"
    }
  ]
}
```

| Campo | Tipo | Descripción |
|---|---|---|
| id | string | Identificador único |
| firstName | string | Nombre |
| lastName | string | Apellido |
| title | string | Título profesional |
| description | string | Biografía o resumen profesional |
| location | string | Ubicación geográfica |
| experienceYears | integer | Años de experiencia |
| isAvailable | boolean | Disponibilidad para proyectos |
| email | string | Correo electrónico |
| avatarUrl | string | URL de la foto de perfil (generada tras upload) |
| socialLinks | array[SocialLink] | Lista de redes sociales |

---

## SocialLink

```json
{
  "id": "string",
  "platform": "string",
  "url": "string"
}
```

| Campo | Tipo | Descripción |
|---|---|---|
| id | string | Identificador único |
| platform | string | Nombre de la red social (ej. "github", "linkedin", "twitter", "website") |
| url | string | URL completa del perfil |

---

## SkillCategory

```json
{
  "id": "string",
  "name": "string",
  "icon": "string",
  "technologies": ["string"]
}
```

| Campo | Tipo | Descripción |
|---|---|---|
| id | string | Identificador único |
| name | string | Nombre de la categoría (ej. "Frontend", "Backend") |
| icon | string | Nombre del icono Lucide (ej. "Code2", "Server") |
| technologies | array[string] | Lista de nombres de tecnologías en la categoría |

---

## CV

El CV se almacena como URL en `profiles.cv_url`. No existe una tabla separada.

```json
{
  "cvUrl": "string",
  "lastUpdated": "string"
}
```

| Campo | Tipo | Descripción |
|---|---|---|
| cvUrl | string | URL pública del archivo PDF en Supabase Storage |
| lastUpdated | string | Fecha ISO 8601 de la última actualización |

---

## EducationItem

```json
{
  "id": "string",
  "title": "string",
  "institution": "string",
  "type": "academic" | "certification",
  "startDate": "string",
  "endDate": "string",
  "description": "string",
  "status": "active" | "expiring" | "expired",
  "displayOrder": "integer"
}
```

| Campo | Tipo | Descripción |
|---|---|---|
| id | string | Identificador único |
| title | string | Título del grado o nombre de la certificación |
| institution | string | Institución educativa o entidad emisora |
| type | enum | "academic" para formación, "certification" para certificaciones |
| startDate | string | Fecha ISO 8601 de inicio |
| endDate | string | Fecha ISO 8601 de finalización |
| description | string | Descripción del programa o certificación |
| status | enum | "active", "expiring", "expired" |
| displayOrder | integer | Orden de visualización (ascendente) |

---

## Technology

```json
{
  "id": "string",
  "name": "string",
  "icon": "string"
}
```

| Campo | Tipo | Descripción |
|---|---|---|
| id | string | Identificador único |
| name | string | Nombre de la tecnología (ej. "React", "Docker") |
| icon | string | Nombre del icono Lucide (ej. "ReactIcon", "Server") |

---

## Project

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "imageUrl": "string",
  "url": "string",
  "repository": "string",
  "technologies": ["string"],
  "status": "published" | "draft" | "hidden",
  "visits": "integer",
  "displayOrder": "integer",
  "createdAt": "string",
  "updatedAt": "string"
}
```

| Campo | Tipo | Descripción |
|---|---|---|
| id | string | Identificador único |
| title | string | Título del proyecto |
| description | string | Descripción del proyecto |
| imageUrl | string | URL de la imagen de preview (generada tras upload) |
| url | string | URL del proyecto en vivo |
| repository | string | URL del repositorio |
| technologies | array[string] | Lista de tecnologías usadas |
| status | enum | "published", "draft", "hidden" |
| visits | integer | Contador de visitas |
| displayOrder | integer | Orden de visualización (ascendente) |
| createdAt | string | Fecha ISO 8601 de creación |
| updatedAt | string | Fecha ISO 8601 de última modificación |

---

## Service

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "icon": "string",
  "status": "popular" | "available" | "ondemand",
  "displayOrder": "integer"
}
```

| Campo | Tipo | Descripción |
|---|---|---|
| id | string | Identificador único |
| title | string | Nombre del servicio |
| description | string | Descripción del servicio |
| icon | string | Nombre del icono Lucide (ej. "Globe", "Server") |
| status | enum | "popular", "available", "ondemand" |
| displayOrder | integer | Orden de visualización (ascendente) |

---

## ContactMessage

```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "string",
  "status": "unread" | "read" | "replied",
  "readAt": "string",
  "createdAt": "string"
}
```

| Campo | Tipo | Descripción |
|---|---|---|
| id | string | Identificador único |
| name | string | Nombre del remitente |
| email | string | Correo electrónico del remitente |
| subject | string | Asunto del mensaje |
| message | string | Cuerpo del mensaje |
| status | enum | "unread", "read", "replied" |
| readAt | string | Fecha ISO 8601 de lectura (nullable) |
| createdAt | string | Fecha ISO 8601 de creación |

---

## Dashboard

```json
{
  "totalProjects": "integer",
  "totalSkillCategories": "integer",
  "totalTechnologies": "integer",
  "unreadMessages": "integer"
}
```

| Campo | Tipo | Descripción |
|---|---|---|
| totalProjects | integer | Total de proyectos (todos los status) |
| totalSkillCategories | integer | Total de categorías de habilidades |
| totalTechnologies | integer | Total de tecnologías en el catálogo |
| unreadMessages | integer | Mensajes de contacto no leídos |

---

## Enums globales

| Enum | Valores | Uso |
|---|---|---|
| EducationType | `academic`, `certification` | Tipo de ítem educativo |
| EducationStatus | `active`, `expiring`, `expired` | Estado de certificación |
| ProjectStatus | `published`, `draft`, `hidden` | Estado del proyecto |
| ServiceStatus | `popular`, `available`, `ondemand` | Estado del servicio |
| ContactStatus | `unread`, `read`, `replied` | Estado del mensaje de contacto |
