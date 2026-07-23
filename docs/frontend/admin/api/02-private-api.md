# Private API — Endpoints

---

## POST /api/admin/auth/login

Inicia sesión y devuelve un token JWT.

**Request Body**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response — 200 OK**

```json
{
  "data": {
    "token": "string",
    "expiresAt": "string",
    "admin": {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string"
    }
  }
}
```

**Response — 401 Unauthorized**

```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

---

## POST /api/admin/auth/logout

Invalida la sesión actual.

**Headers**

`Authorization: Bearer <token>`

**Response — 200 OK**

```json
{
  "data": {
    "status": "logged_out"
  }
}
```

---

## GET /api/admin/auth/me

Devuelve la información del administrador autenticado.

**Headers**

`Authorization: Bearer <token>`

**Response — 200 OK**

```json
{
  "data": {
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string"
  }
}
```

---

## GET /api/admin/profile

Obtiene el perfil completo del portafolio incluyendo sus redes sociales.

**Response — 200 OK**

```json
{
  "data": {
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
}
```

---

## PUT /api/admin/profile

Reemplaza todos los campos del perfil. Envío como `multipart/form-data`.

**Request (multipart/form-data)**

| Campo | Tipo | Requerido |
|---|---|---|
| firstName | string | sí |
| lastName | string | sí |
| title | string | sí |
| description | string | sí |
| location | string | sí |
| experienceYears | integer | sí |
| isAvailable | boolean | no |
| email | string | sí |
| avatar | file | no (webp, reemplaza avatarUrl. Se sube a Supabase Storage bucket `Images`) |

**Response — 200 OK**

```json
{
  "data": {
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "title": "string",
    "description": "string",
    "location": "string",
    "experienceYears": "integer",
    "isAvailable": "boolean",
    "email": "string",
    "avatarUrl": "string"
  }
}
```

---

## GET /api/admin/profile/completion

Obtiene el porcentaje de completitud del perfil y una lista de checks.

**Response — 200 OK**

```json
{
  "data": {
    "percentage": 75,
    "checks": [
      { "label": "Foto de perfil", "done": true },
      { "label": "Descripción profesional", "done": true },
      { "label": "CV adjunto", "done": false },
      { "label": "Redes sociales", "done": true },
      { "label": "Título profesional", "done": true },
      { "label": "Ubicación", "done": false }
    ]
  }
}
```

| Campo | Tipo | Descripción |
|---|---|---|
| percentage | integer | 0-100, redondeado |
| checks | array | Lista de items con label y done |

---

## GET /api/admin/profile/social

Lista todas las redes sociales del perfil.

**Response — 200 OK**

```json
{
  "data": [
    {
      "id": "string",
      "platform": "string",
      "url": "string"
    }
  ]
}
```

---

## POST /api/admin/profile/social

Agrega una nueva red social.

**Request Body**

```json
{
  "platform": "string",
  "url": "string"
}
```

**Response — 201 Created**

```json
{
  "data": {
    "id": "string",
    "platform": "string",
    "url": "string"
  }
}
```

---

## PATCH /api/admin/profile/social/:id

Actualiza una red social existente.

**Request Body**

```json
{
  "platform": "string",
  "url": "string"
}
```

**Response — 200 OK**

```json
{
  "data": {
    "id": "string",
    "platform": "string",
    "url": "string"
  }
}
```

---

## DELETE /api/admin/profile/social/:id

Elimina una red social.

**Response — 200 OK**

```json
{
  "data": {
    "status": "deleted"
  }
}
```

---

## GET /api/admin/skills

Obtiene todas las categorías de habilidades con sus tecnologías.

**Response — 200 OK**

```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "icon": "string",
      "technologies": ["string"]
    }
  ]
}
```

---

## POST /api/admin/skills

Crea una nueva categoría de habilidad.

**Request Body**

```json
{
  "name": "string",
  "icon": "string",
  "technologies": ["string"]
}
```

**Response — 201 Created**

```json
{
  "data": {
    "id": "string",
    "name": "string",
    "icon": "string",
    "technologies": ["string"]
  }
}
```

---

## PATCH /api/admin/skills/:id

Actualiza una categoría de habilidad.

**Request Body**

```json
{
  "name": "string",
  "icon": "string",
  "technologies": ["string"]
}
```

**Response — 200 OK**

```json
{
  "data": {
    "id": "string",
    "name": "string",
    "icon": "string",
    "technologies": ["string"]
  }
}
```

---

## DELETE /api/admin/skills/:id

Elimina una categoría de habilidad.

**Response — 200 OK**

```json
{
  "data": {
    "status": "deleted"
  }
}
```

---

## GET /api/admin/cv

Obtiene la URL del CV almacenada en el perfil.

**Response — 200 OK**

```json
{
  "data": {
    "cvUrl": "string",
    "lastUpdated": "string"
  }
}
```

**Response — 404 Not Found**

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "CV not uploaded yet"
  }
}
```

---

## POST /api/admin/cv

Guarda o actualiza la URL del archivo CV. Envío como `multipart/form-data`.

**Request (multipart/form-data)**

| Campo | Tipo | Requerido |
|---|---|---|
| file | file | sí (PDF) |

**Response — 200 OK**

```json
{
  "data": {
    "cvUrl": "string",
    "lastUpdated": "string"
  }
}
```

---

## DELETE /api/admin/cv

Elimina el CV del portafolio (setea `cv_url = NULL`).

**Response — 200 OK**

```json
{
  "data": {
    "status": "deleted"
  }
}
```

---

## GET /api/admin/education

Obtiene la trayectoria académica completa (formación + certificaciones).

**Response — 200 OK**

```json
{
  "data": [
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
  ]
}
```

---

## POST /api/admin/education

Crea un nuevo ítem de formación o certificación.

**Request Body**

```json
{
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

**Response — 201 Created**

```json
{
  "data": {
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
}
```

---

## PATCH /api/admin/education/:id

Actualiza un ítem de formación o certificación.

**Request Body**

```json
{
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

**Response — 200 OK**

```json
{
  "data": {
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
}
```

---

## DELETE /api/admin/education/:id

Elimina un ítem de formación o certificación.

**Response — 200 OK**

```json
{
  "data": {
    "status": "deleted"
  }
}
```

---

## GET /api/admin/technologies

Obtiene el catálogo de tecnologías.

**Response — 200 OK**

```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "icon": "string"
    }
  ]
}
```

---

## POST /api/admin/technologies

Crea una nueva tecnología.

**Request Body**

```json
{
  "name": "string",
  "icon": "string"
}
```

**Response — 201 Created**

```json
{
  "data": {
    "id": "string",
    "name": "string",
    "icon": "string"
  }
}
```

---

## PATCH /api/admin/technologies/:id

Actualiza una tecnología existente.

**Request Body**

```json
{
  "name": "string",
  "icon": "string"
}
```

**Response — 200 OK**

```json
{
  "data": {
    "id": "string",
    "name": "string",
    "icon": "string"
  }
}
```

---

## DELETE /api/admin/technologies/:id

Elimina una tecnología.

**Response — 200 OK**

```json
{
  "data": {
    "status": "deleted"
  }
}
```

---

## GET /api/admin/projects

Obtiene todos los proyectos del portafolio.

**Response — 200 OK**

```json
{
  "data": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "imageUrl": "string",
      "demoUrl": "string",
      "repoUrl": "string",
      "technologies": ["string"],
      "status": "published" | "draft" | "hidden",
      "visits": "integer",
      "displayOrder": "integer",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
```

---

## POST /api/admin/projects

Crea un nuevo proyecto. Envío como `multipart/form-data`.

**Request (multipart/form-data)**

| Campo | Tipo | Requerido |
|---|---|---|
| title | string | sí |
| description | string | sí |
| image | file | no (imagen) |
| demoUrl | string | no |
| repoUrl | string | no |
| technologies | string[] | no (array JSON) |
| status | string | no (default: "draft") |
| displayOrder | integer | no |

**Response — 201 Created**

```json
{
  "data": {
    "id": "string",
    "title": "string",
    "description": "string",
    "imageUrl": "string",
    "demoUrl": "string",
    "repoUrl": "string",
    "technologies": ["string"],
    "status": "published" | "draft" | "hidden",
    "visits": 0,
    "displayOrder": "integer",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

---

## PATCH /api/admin/projects/:id

Actualiza un proyecto existente. Envío como `multipart/form-data`.

**Request (multipart/form-data)**

| Campo | Tipo | Requerido |
|---|---|---|
| title | string | no |
| description | string | no |
| image | file | no (reemplaza imagen) |
| demoUrl | string | no |
| repoUrl | string | no |
| technologies | string[] | no (array JSON) |
| status | string | no |
| displayOrder | integer | no |

**Response — 200 OK**

```json
{
  "data": {
    "id": "string",
    "title": "string",
    "description": "string",
    "imageUrl": "string",
    "demoUrl": "string",
    "repoUrl": "string",
    "technologies": ["string"],
    "status": "published" | "draft" | "hidden",
    "visits": "integer",
    "displayOrder": "integer",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

---

## DELETE /api/admin/projects/:id

Elimina un proyecto.

**Response — 200 OK**

```json
{
  "data": {
    "status": "deleted"
  }
}
```

---

## GET /api/admin/services

Obtiene todos los servicios ofrecidos.

**Response — 200 OK**

```json
{
  "data": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "icon": "string",
      "status": "popular" | "available" | "ondemand",
      "displayOrder": "integer"
    }
  ]
}
```

---

## POST /api/admin/services

Crea un nuevo servicio.

**Request Body**

```json
{
  "title": "string",
  "description": "string",
  "icon": "string",
  "status": "popular" | "available" | "ondemand",
  "displayOrder": "integer"
}
```

**Response — 201 Created**

```json
{
  "data": {
    "id": "string",
    "title": "string",
    "description": "string",
    "icon": "string",
    "status": "popular" | "available" | "ondemand",
    "displayOrder": "integer"
  }
}
```

---

## PATCH /api/admin/services/:id

Actualiza un servicio existente.

**Request Body**

```json
{
  "title": "string",
  "description": "string",
  "icon": "string",
  "status": "popular" | "available" | "ondemand",
  "displayOrder": "integer"
}
```

**Response — 200 OK**

```json
{
  "data": {
    "id": "string",
    "title": "string",
    "description": "string",
    "icon": "string",
    "status": "popular" | "available" | "ondemand",
    "displayOrder": "integer"
  }
}
```

---

## DELETE /api/admin/services/:id

Elimina un servicio.

**Response — 200 OK**

```json
{
  "data": {
    "status": "deleted"
  }
}
```

---

## GET /api/admin/contact/count

Obtiene el conteo de mensajes de contacto agrupados por estado.

**Response — 200 OK**

```json
{
  "data": {
    "total": "integer",
    "unread": "integer",
    "read": "integer",
    "replied": "integer"
  }
}
```

---

## GET /api/admin/contact

Obtiene la lista de mensajes de contacto.

**Response — 200 OK**

```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "subject": "string",
      "status": "unread" | "read" | "replied",
      "createdAt": "string"
    }
  ]
}
```

---

## GET /api/admin/contact/:id

Obtiene el detalle de un mensaje de contacto.

**Response — 200 OK**

```json
{
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "subject": "string",
    "message": "string",
    "status": "unread" | "read" | "replied",
    "readAt": "string",
    "createdAt": "string"
  }
}
```

---

## PATCH /api/admin/contact/:id

Actualiza el estado de un mensaje de contacto.

**Request Body**

```json
{
  "status": "read" | "replied"
}
```

**Response — 200 OK**

```json
{
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "subject": "string",
    "status": "unread" | "read" | "replied",
    "readAt": "string",
    "createdAt": "string"
  }
}
```

---

## GET /api/admin/dashboard

Obtiene métricas agregadas del portafolio (conteos).

**Response — 200 OK**

```json
{
  "data": {
    "totalProjects": "integer",
    "totalSkillCategories": "integer",
    "totalTechnologies": "integer",
    "unreadMessages": "integer"
  }
}
```

---

## GET /api/admin/notifications

Obtiene los mensajes de contacto no leídos recientes con conteos.

**Response — 200 OK**

```json
{
  "data": {
    "unreadCount": "integer",
    "todayCount": "integer",
    "recent": [
      {
        "id": "string",
        "name": "string",
        "email": "string",
        "subject": "string",
        "message": "string (truncado a 100 chars)",
        "createdAt": "string"
      }
    ]
  }
}
```

---

## DELETE /api/admin/contact/:id

Elimina un mensaje de contacto.

**Response — 200 OK**

```json
{
  "data": {
    "status": "deleted"
  }
}
```
