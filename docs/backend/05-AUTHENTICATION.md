# 05-AUTHENTICATION.md — Anthekira.dev

## 1. Arquitectura
```
Admin Browser → /admin/login → LoginForm [CC] → POST /api/private/admin/login
  → supabase.auth.signInWithPassword()
    → session { access_token, refresh_token }
      → @supabase/ssr establece cookies httpOnly
        → Redirige a /admin

Admin → fetch() a /api/private/*
  → Middleware verifica sesión en cookies
    → Route Handler usa service_role (bypass RLS)
```
**Sin roles (ADR-008):** Un solo administrador.

## 2. Clientes Supabase
| Cliente | Ubicación | Key | RLS | Uso |
|---|---|---|---|---|
| `server.ts` | `frontend/src/lib/supabase/` | anon | ✅ | Server Components |
| `client.ts` | `frontend/src/lib/supabase/` | anon | ✅ | LoginForm, AuthGuard |
| `admin.ts` | `backend/src/lib/supabase/` | service_role | ❌ Bypass | API Routes privadas (CRUD) |

> `SUPABASE_SERVICE_ROLE_KEY` NUNCA se expone al cliente. Solo en `admin.ts`.

## 3. Login
```typescript
// POST /api/private/admin/login
const { data, error } = await supabase.auth.signInWithPassword({ email, password });
// Error 401: "Invalid email or password"
// Éxito: cookies httpOnly automáticas via @supabase/ssr
```

## 4. Middleware (`frontend/src/middleware.ts`)
**Responsabilidades:** 1) Proteger `/admin` (excepto `/admin/login`) y `/api/private/*`. 2) i18n routing en rutas públicas.

| Ruta | ¿Sesión? | Acción |
|---|---|---|
| `/admin/*` | Sí | Permite |
| `/admin/*` | No | → /admin/login |
| `/api/private/*` | Sí | Permite + agrega headers `x-user-id` y `x-access-token` |
| `/api/private/*` | No | 401 JSON |

```typescript
// En API Route privada:
const userId = request.headers.get('x-user-id');
// Usar supabaseAdmin (service_role) para escritura
```

## 5. Logout
```typescript
await supabase.auth.signOut(); // Limpia cookies → redirige a /admin/login
```

## 6. Refresh Tokens
Automáticos via `@supabase/ssr`. Access token: 1 hora. Refresh token: 60 días. No requiere código manual.

## 7. Seguridad
| Medida | Implementación |
|---|---|
| JWT en cookies httpOnly | Automático @supabase/ssr |
| SameSite=Lax | Default de Supabase |
| Service role solo server | `backend/src/lib/supabase/admin.ts` |
| Sin roles ni permisos | ADR-008 |
| Logout invalida sesión | signOut() invalida refresh token |

**Limitaciones V1:** Sin rate limiting, sin MFA/2FA, sin logs de acceso, sin expiración forzada.
