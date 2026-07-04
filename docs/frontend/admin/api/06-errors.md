# Errors

## Formato de error

Todos los errores siguen la misma estructura:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": []
  }
}
```

| Campo | Tipo | Descripción |
|---|---|---|
| code | string | Código de error máquina-legible |
| message | string | Mensaje legible para humanos |
| details | array | Lista de errores detallados (opcional) |

Error con detalles de validación:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address"
      }
    ]
  }
}
```

---

## Códigos de error

| Código | HTTP Status | Descripción |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Campos inválidos (ver `details` por campo) |
| `UNAUTHORIZED` | 401 | Token faltante, inválido o expirado |
| `INVALID_CREDENTIALS` | 401 | Email o contraseña incorrectos (solo login) |
| `RESOURCE_NOT_FOUND` | 404 | El recurso solicitado no existe |
| `METHOD_NOT_ALLOWED` | 405 | Método HTTP no soportado |
| `CONFLICT` | 409 | Conflicto (ej. nombre de tecnología duplicado) |
| `INTERNAL_ERROR` | 500 | Error interno del servidor |

---

## Escenarios por endpoint

### POST /api/admin/auth/login

- **401**: credenciales inválidas.

### Todos los endpoints protegidos (excepto login)

- **401**: token faltante, inválido o expirado.

### POST|PATCH (cualquier recurso)

- **400**: validación fallida (ver `details`).

### GET /api/admin/cv

- **404**: no se ha subido ningún CV.

### GET|PATCH|DELETE /api/admin/:resource/:id

- **404**: el ID del recurso no existe.

### POST /api/admin/technologies

- **409**: el nombre de la tecnología ya existe.

---

## Métodos no soportados

Cualquier endpoint que reciba un método HTTP no contemplado en la especificación:

```json
{
  "error": {
    "code": "METHOD_NOT_ALLOWED",
    "message": "Method not allowed for this endpoint"
  }
}
```

---

## Error interno

Errores inesperados del servidor:

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
```
