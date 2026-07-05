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
|-------|------|-------------|
| code | string | Código de error máquina-legible |
| message | string | Mensaje legible para humanos |
| details | array | Lista de errores detallados (opcional) |

## Códigos de error

| Código | HTTP Status | Descripción |
|--------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Uno o más campos no pasaron validación |
| `RESOURCE_NOT_FOUND` | 404 | El recurso solicitado no existe |
| `METHOD_NOT_ALLOWED` | 405 | Método HTTP no soportado para el endpoint |
| `RATE_LIMIT_EXCEEDED` | 429 | Demasiadas solicitudes (POST /api/contact) |
| `INTERNAL_ERROR` | 500 | Error interno del servidor |

## Escenarios por endpoint

### GET /api/cv

- **404**: el archivo CV no está disponible.

### POST /api/contact

- **400**: uno o más campos inválidos (ver `details` para lista de errores por campo).

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

### Métodos no soportados

Cualquier endpoint que reciba un método HTTP no contemplado en la especificación debe responder:

```json
{
  "error": {
    "code": "METHOD_NOT_ALLOWED",
    "message": "Method not allowed for this endpoint"
  }
}
```

### Error interno

Errores inesperados del servidor:

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
```
