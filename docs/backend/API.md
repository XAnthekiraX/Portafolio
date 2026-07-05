# API — Backend Portfolio

> Documentación técnica de los endpoints del backend. El contrato completo (request/response) está en `docs/frontend/*/api/`.

## Base URL

```
http://localhost:3001/api
```

---

## Públicos (sin autenticación)

### GET /api/profile

Obtiene perfil público con sus redes sociales.

**Tabla:** `profiles` + `social_links` (LEFT JOIN)

**RLS:** `anon` puede SELECT.

---

### GET /api/skills

Obtiene categorías de habilidades con sus tecnologías.

**Tabla:** `skill_categories` + `skill_technologies`

**RLS:** `anon` puede SELECT.

---

### GET /api/technologies

Obtiene catálogo de tecnologías.

**Tabla:** `technologies`

**RLS:** `anon` puede SELECT.

---

### GET /api/projects

Obtiene proyectos publicados.

**Tabla:** `projects` + `project_technologies` + `technologies`

**Filtro:** `WHERE status = 'published'`

**RLS:** `anon` puede SELECT.

---

### GET /api/education

Obtiene formación académica (no certificaciones).

**Tabla:** `education_items`

**Filtro:** `WHERE type = 'academic'`

**RLS:** `anon` puede SELECT.

---

### GET /api/services

Obtiene servicios ofrecidos.

**Tabla:** `services`

**RLS:** `anon` puede SELECT.

---

### GET /api/cv

Redirige a la URL del CV almacenada en `profiles.cv_url`.

**Tabla:** `profiles` (solo columna `cv_url`)

**RLS:** `anon` puede SELECT.

---

### POST /api/contact

Guarda un mensaje del formulario de contacto.

**Tabla:** `contact_messages`

**RLS:** `anon` puede INSERT.

**Validación (Zod):**
- `name`: string, 1-255 chars, required
- `email`: string, email válido, required
- `subject`: string, 1-255 chars, required
- `message`: string, 1-5000 chars, required

---

## Privados (JWT requerido — Supabase Auth)

Todas las rutas protegidas verifican el token mediante `supabase.auth.getUser()`.

Si el token falta o es inválido → `401`.

### Auth

| Método | Endpoint | Supabase Auth | Descripción |
|--------|----------|---------------|-------------|
| POST | `/api/admin/auth/login` | `signInWithPassword` | Iniciar sesión |
| POST | `/api/admin/auth/logout` | `signOut` | Cerrar sesión |
| GET | `/api/admin/auth/me` | `getUser` | Verificar sesión |

Estos endpoints delegan en Supabase Auth. El backend actúa como proxy: recibe la petición, llama a `supabase.auth.signInWithPassword()` / `signOut()` / `getUser()` y devuelve la respuesta.

### Profile

| Método | Endpoint | Tabla | Operación |
|--------|----------|-------|-----------|
| GET | `/api/admin/profile` | `profiles` + `social_links` | SELECT (JOIN) |
| PUT | `/api/admin/profile` | `profiles` | UPDATE (multipart) |
| GET | `/api/admin/profile/completion` | — | Porcentaje de perfil completado |

Campos de profile: `firstName`, `lastName`, `title`, `description`, `location`, `experienceYears`, `email`, `avatar` (file opcional).

### Social Links

| Método | Endpoint | Operación |
|--------|----------|-----------|
| GET | `/api/admin/profile/social` | SELECT |
| POST | `/api/admin/profile/social` | INSERT |
| PATCH | `/api/admin/profile/social/:id` | UPDATE |
| DELETE | `/api/admin/profile/social/:id` | DELETE |

### Skills

| Método | Endpoint | Operación |
|--------|----------|-----------|
| GET | `/api/admin/skills` | SELECT + JOIN |
| POST | `/api/admin/skills` | INSERT |
| PATCH | `/api/admin/skills/:id` | UPDATE |
| DELETE | `/api/admin/skills/:id` | DELETE |

### CV

| Método | Endpoint | Operación |
|--------|----------|-----------|
| GET | `/api/admin/cv` | SELECT `cv_url` de profiles |
| POST | `/api/admin/cv` | UPDATE `cv_url` en profiles |
| DELETE | `/api/admin/cv` | SET `cv_url = NULL` |

### Education

| Método | Endpoint | Operación |
|--------|----------|-----------|
| GET | `/api/admin/education` | SELECT |
| POST | `/api/admin/education` | INSERT |
| PATCH | `/api/admin/education/:id` | UPDATE |
| DELETE | `/api/admin/education/:id` | DELETE |

### Technologies

| Método | Endpoint | Operación |
|--------|----------|-----------|
| GET | `/api/admin/technologies` | SELECT |
| POST | `/api/admin/technologies` | INSERT |
| PATCH | `/api/admin/technologies/:id` | UPDATE |
| DELETE | `/api/admin/technologies/:id` | DELETE |

### Projects

| Método | Endpoint | Operación |
|--------|----------|-----------|
| GET | `/api/admin/projects` | SELECT + JOIN (todos los status) |
| POST | `/api/admin/projects` | INSERT (multipart) |
| PATCH | `/api/admin/projects/:id` | UPDATE (multipart) |
| DELETE | `/api/admin/projects/:id` | DELETE |

### Services

| Método | Endpoint | Operación |
|--------|----------|-----------|
| GET | `/api/admin/services` | SELECT |
| POST | `/api/admin/services` | INSERT |
| PATCH | `/api/admin/services/:id` | UPDATE |
| DELETE | `/api/admin/services/:id` | DELETE |

### Dashboard

| Método | Endpoint | Operación |
|--------|----------|-----------|
| GET | `/api/admin/dashboard` | COUNT de projects, skill_categories, technologies, contact_messages |

### Notifications

| Método | Endpoint | Operación |
|--------|----------|-----------|
| GET | `/api/admin/notifications` | Mensajes no leídos recientes + conteos |

### Contact Messages

| Método | Endpoint | Operación |
|--------|----------|-----------|
| GET | `/api/admin/contact/count` | SELECT COUNT agrupado por status |
| GET | `/api/admin/contact` | SELECT (listado) |
| GET | `/api/admin/contact/:id` | SELECT (detalle) |
| PATCH | `/api/admin/contact/:id` | UPDATE status |
| DELETE | `/api/admin/contact/:id` | DELETE |

---

## Errores comunes

| Status | Código | Causa |
|--------|--------|-------|
| 400 | `VALIDATION_ERROR` | Datos inválidos (Zod) |
| 401 | `UNAUTHORIZED` | Token faltante, inválido o expirado |
| 401 | `INVALID_CREDENTIALS` | Email/password incorrectos (Supabase Auth) |
| 404 | `RESOURCE_NOT_FOUND` | Recurso no existe |
| 429 | `RATE_LIMIT_EXCEEDED` | Demasiadas solicitudes (POST /api/contact) |
| 500 | `INTERNAL_ERROR` | Error del servidor |

Todos los errores siguen el formato:

```json
{
  "error": {
    "code": "UPPERCASE_CODE",
    "message": "Descripción legible",
    "details": []
  }
}
```
