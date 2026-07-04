# Authentication

## Esquema

Autenticación mediante tokens JWT.

- Tipo: `Bearer Token`
- Header: `Authorization: Bearer <token>`
- El token se obtiene mediante `POST /api/admin/auth/login`
- El token incluye un `expiresAt` que define su fecha de expiración

## Flujo

```
Cliente                              Servidor
  │                                       │
  │  POST /api/admin/auth/login           │
  │  { email, password }                  │
  │──────────────────────────────────────►│
  │                                       │
  │  200 { data: { token, expiresAt } }   │
  │◄──────────────────────────────────────│
  │                                       │
  │  GET /api/admin/profile               │
  │  Authorization: Bearer <token>        │
  │──────────────────────────────────────►│
  │                                       │
  │  200 { data: { ... } }                │
  │◄──────────────────────────────────────│
```

## Endpoints públicos (sin auth)

Solo un endpoint no requiere autenticación:

| Endpoint | Propósito |
|---|---|
| `POST /api/admin/auth/login` | Inicio de sesión |

## Rutas protegidas

Todos los demás endpoints requieren el header `Authorization: Bearer <token>`.

Si el token falta, es inválido o ha expirado:

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

HTTP Status: **401 Unauthorized**

## Cierre de sesión

`POST /api/admin/auth/logout` invalida el token actual. El mecanismo de invalidación (blacklist, tiempo de expiración corto, etc.) queda a criterio de implementación.

## Sesión actual

`GET /api/admin/auth/me` permite al frontend verificar que el token sigue siendo válido y obtener los datos del administrador autenticado.

## Consideraciones de seguridad

- El token debe transmitirse únicamente por HTTPS.
- El tiempo de expiración recomendado es de 24 horas o menos.
- La contraseña debe almacenarse hasheada (bcrypt o similar).
- No incluir datos sensibles en el payload del JWT.
