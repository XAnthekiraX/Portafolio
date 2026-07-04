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
| email | string | sí |
| avatar | file | no (imagen, reemplaza avatarUrl) |

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
    "email": "string",
    "avatarUrl": "string"
  }
}
```

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
  "technologies": ["string"]
}
```

**Response — 201 Created**

```json
{
  "data": {
    "id": "string",
    "name": "string",
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
  "technologies": ["string"]
}
```

**Response — 200 OK**

```json
{
  "data": {
    "id": "string",
    "name": "string",
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

Obtiene los metadatos del CV y su URL de descarga.

**Response — 200 OK**

```json
{
  "data": {
    "id": "string",
    "fileName": "string",
    "fileSize": "integer",
    "fileType": "string",
    "pages": "integer",
    "downloadUrl": "string",
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

Guarda o actualiza la URL del archivo CV.

**Request Body**

```json
{
  "url": "string"
}
```

**Response — 200 OK**

```json
{
  "data": {
    "id": "string",
    "fileName": "string",
    "fileSize": "integer",
    "fileType": "string",
    "pages": "integer",
    "downloadUrl": "string",
    "lastUpdated": "string"
  }
}
```

---

## DELETE /api/admin/cv

Elimina el CV del portafolio.

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
      "name": "string"
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
  "name": "string"
}
```

**Response — 201 Created**

```json
{
  "data": {
    "id": "string",
    "name": "string"
  }
}
```

---

## PATCH /api/admin/technologies/:id

Actualiza una tecnología existente.

**Request Body**

```json
{
  "name": "string"
}
```

**Response — 200 OK**

```json
{
  "data": {
    "id": "string",
    "name": "string"
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
      "url": "string",
      "repository": "string",
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
| url | string | no |
| repository | string | no |
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
    "url": "string",
    "repository": "string",
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
| url | string | no |
| repository | string | no |
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
    "url": "string",
    "repository": "string",
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
