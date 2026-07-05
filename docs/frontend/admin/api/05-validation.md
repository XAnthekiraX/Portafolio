# Validation

## Formato general

La validación aplica a todos los endpoints de escritura. Los errores se devuelven con código `VALIDATION_ERROR` y HTTP 400.

---

## POST /api/admin/auth/login

| Campo | Tipo | Requerido | Reglas |
|---|---|---|---|
| email | string | sí | Formato email válido |
| password | string | sí | No vacío |

---

## PUT /api/admin/profile

| Campo | Tipo | Requerido | Reglas |
|---|---|---|---|
| firstName | string | sí | 1-100 caracteres |
| lastName | string | sí | 1-100 caracteres |
| title | string | sí | 1-200 caracteres |
| description | string | sí | 1-2000 caracteres |
| location | string | sí | 1-200 caracteres |
| experienceYears | integer | sí | 0-100 |
| isAvailable | boolean | no | Default: true |
| email | string | sí | Formato email válido, 1-254 caracteres |
| avatar | file | no | Imagen. Solo formato webp. Máximo 5MB. Se sube a Supabase Storage bucket `Images` |

---

## POST /api/admin/profile/social

| Campo | Tipo | Requerido | Reglas |
|---|---|---|---|
| platform | string | sí | 1-50 caracteres. Valores permitidos: github, linkedin, twitter, website, dribbble, youtube, instagram |
| url | string | sí | 1-2000 caracteres. URL válida (http/https) |

---

## PATCH /api/admin/profile/social/:id

Mismas reglas que POST.

---

## POST /api/admin/skills

| Campo | Tipo | Requerido | Reglas |
|---|---|---|---|
| name | string | sí | 1-100 caracteres |
| icon | string | no | Nombre de icono Lucide |
| technologies | array[string] | sí | Mínimo 1 elemento. Cada string: 1-100 caracteres |

---

## PATCH /api/admin/skills/:id

Mismas reglas que POST.

---

## POST /api/admin/cv

| Campo | Tipo | Requerido | Reglas |
|---|---|---|---|
| url | string | sí | URL válida (http/https). Debe apuntar a un archivo PDF |

---

## POST /api/admin/education

| Campo | Tipo | Requerido | Reglas |
|---|---|---|---|
| title | string | sí | 1-200 caracteres |
| institution | string | sí | 1-200 caracteres |
| type | enum | sí | "academic" o "certification" |
| startDate | string | sí | ISO 8601 date |
| endDate | string | no | ISO 8601 date. Si existe, debe ser posterior a startDate |
| description | string | no | 1-2000 caracteres |
| status | enum | no | "active", "expiring" o "expired" |
| displayOrder | integer | no | Entero positivo |

---

## PATCH /api/admin/education/:id

Mismas reglas que POST. Todos los campos son opcionales (merge parcial).

---

## POST /api/admin/technologies

| Campo | Tipo | Requerido | Reglas |
|---|---|---|---|
| name | string | sí | 1-100 caracteres. Debe ser único |
| icon | string | no | Nombre de icono Lucide |

---

## PATCH /api/admin/technologies/:id

| Campo | Tipo | Requerido | Reglas |
|---|---|---|---|
| name | string | sí | 1-100 caracteres. Debe ser único |
| icon | string | no | Nombre de icono Lucide |

---

## POST /api/admin/projects

| Campo | Tipo | Requerido | Reglas |
|---|---|---|---|
| title | string | sí | 1-200 caracteres |
| description | string | sí | 1-2000 caracteres |
| image | file | no | Imagen. Formatos: jpg, png, webp. Máximo 10MB |
| url | string | no | URL válida (http/https) |
| repository | string | no | URL válida (http/https) |
| technologies | array[string] | no | Cada string: 1-100 caracteres |
| status | enum | no | "published", "draft" o "hidden". Default: "draft" |
| displayOrder | integer | no | Entero positivo |

---

## PATCH /api/admin/projects/:id

Mismas reglas que POST. Todos los campos son opcionales (merge parcial).

---

## POST /api/admin/services

| Campo | Tipo | Requerido | Reglas |
|---|---|---|---|
| title | string | sí | 1-200 caracteres |
| description | string | sí | 1-2000 caracteres |
| icon | string | no | Nombre de icono Lucide |
| status | enum | no | "popular", "available" o "ondemand". Default: "available" |
| displayOrder | integer | no | Entero positivo |

---

## PATCH /api/admin/services/:id

Mismas reglas que POST. Todos los campos son opcionales (merge parcial).

---

## POST /api/admin/contact — Solo público (POST /api/contact)

Ver `docs/frontend/public/api/05-validation.md`.

---

## PATCH /api/admin/contact/:id

| Campo | Tipo | Requerido | Reglas |
|---|---|---|---|
| status | enum | sí | "read" o "replied" |

---

## Sanitización

Campos de texto:

- Eliminar etiquetas HTML/script (XSS prevention).
- Hacer trim de whitespace al inicio y final.
- Normalizar Unicode (NFC).

## Unicidad

- **Technology.name**: debe ser único a nivel global.
- **SocialLink.platform**: debe ser único por perfil (no se pueden tener dos enlaces de "github").

## Rate Limiting

| Endpoint | Límite | Ventana |
|---|---|---|
| `POST /api/contact` | 3 solicitudes | 1 hora por IP |

Si se excede el límite:

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later."
  }
}
```

HTTP Status: **429 Too Many Requests**
