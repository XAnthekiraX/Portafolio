# Public API — Endpoints

## GET /api/profile

Obtiene la información pública del perfil del portafolio.

**Response — 200 OK**

```json
{
  "data": {
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
}
```

---

## GET /api/skills

Obtiene las categorías de habilidades y sus tecnologías asociadas.

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

## GET /api/technologies

Obtiene la lista de tecnologías/herramientas de uso diario.

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

## GET /api/projects

Obtiene la lista de proyectos destacados del portafolio.

**Response — 200 OK**

```json
{
  "data": [
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
  ]
}
```

---

## GET /api/education

Obtiene la trayectoria académica ordenada cronológicamente.

**Response — 200 OK**

```json
{
  "data": [
    {
      "id": "string",
      "degree": "string",
      "institution": "string",
      "startDate": "string",
      "endDate": "string",
      "description": "string"
    }
  ]
}
```

---

## GET /api/services

Obtiene la lista de servicios profesionales ofrecidos.

**Response — 200 OK**

```json
{
  "data": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "icon": "string"
    }
  ]
}
```

---

## GET /api/cv

Descarga el archivo del currículum vitae en formato PDF.

**Response — 200 OK**

- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="cv.pdf"`
- Body: binary PDF stream

**Response — 404 Not Found**

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "CV file not found"
  }
}
```

---

## POST /api/contact

Envía un mensaje de contacto desde el formulario.

**Request Body**

```json
{
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "string"
}
```

**Response — 201 Created**

```json
{
  "data": {
    "id": "string",
    "status": "sent"
  }
}
```

**Response — 400 Bad Request**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "string",
    "details": [
      {
        "field": "string",
        "message": "string"
      }
    ]
  }
}
```
