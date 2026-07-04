# Data Models

## Profile

Representa la información del dueño del portafolio.

```json
{
  "id": "string",
  "name": "string",
  "title": "string",
  "description": "string",
  "location": "string",
  "experienceYears": "integer",
  "isAvailable": "boolean",
  "email": "string",
  "avatarUrl": "string",
  "socialLinks": [
    {
      "platform": "string",
      "url": "string"
    }
  ]
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | Identificador único |
| name | string | Nombre completo |
| title | string | Título profesional (ej. "Senior Product Engineer & UI/UX Designer") |
| description | string | Biografía o resumen profesional |
| location | string | Ubicación geográfica (ej. "Madrid, España") |
| experienceYears | integer | Años de experiencia profesional |
| isAvailable | boolean | Disponibilidad para proyectos |
| email | string | Correo electrónico de contacto |
| avatarUrl | string | URL de la foto de perfil |
| socialLinks | array[SocialLink] | Lista de redes sociales |

---

## SocialLink

```json
{
  "platform": "string",
  "url": "string"
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| platform | string | Nombre de la red social (ej. "github", "linkedin", "twitter", "dribbble") |
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
|-------|------|-------------|
| id | string | Identificador único |
| name | string | Nombre de la categoría (ej. "Frontend", "Backend") |
| icon | string | Identificador del icono representativo |
| technologies | array[string] | Lista de tecnologías en la categoría |

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
|-------|------|-------------|
| id | string | Identificador único |
| name | string | Nombre de la tecnología (ej. "React", "Docker") |
| icon | string | Identificador del icono representativo |

---

## Project

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "category": "string",
  "imageUrl": "string",
  "features": ["string"],
  "repoUrl": "string",
  "demoUrl": "string"
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | Identificador único |
| title | string | Título del proyecto |
| description | string | Descripción del proyecto |
| category | string | Categoría (ej. "SaaS", "Web App", "Mobile", "E-commerce") |
| imageUrl | string | URL de la imagen de portada |
| features | array[string] | Lista de características destacadas |
| repoUrl | string | URL del repositorio (GitHub) |
| demoUrl | string | URL de la demo en vivo |

---

## EducationItem

```json
{
  "id": "string",
  "degree": "string",
  "institution": "string",
  "startDate": "string",
  "endDate": "string",
  "description": "string"
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | Identificador único |
| degree | string | Título o grado académico |
| institution | string | Institución educativa |
| startDate | string | Fecha de inicio (ISO 8601) |
| endDate | string | Fecha de finalización (ISO 8601) |
| description | string | Descripción del programa |

---

## Service

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "icon": "string"
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | Identificador único |
| title | string | Nombre del servicio (ej. "Web Development") |
| description | string | Descripción del servicio |
| icon | string | Identificador del icono representativo |

---

## ContactMessage

```json
{
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "string"
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre del remitente |
| email | string | Correo electrónico del remitente |
| subject | string | Asunto del mensaje |
| message | string | Cuerpo del mensaje |
