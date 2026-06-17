# 05-AUTHENTICATION.md — Anthekira.dev

## 1. Arquitectura
```
Admin Browser → /admin/login → LoginForm [CC] → POST /api/private/admin/login
  → Rate limit check (5/min/IP)
    → supabase.auth.signInWithPassword()
      → session { access_token, refresh_token }
        → @supabase/ssr establece cookies httpOnly
          → Establece cookie csrf-token
            → Redirige a /admin

Admin → fetch() a /api/private/*
  → Middleware: verifica sesión en cookies + valida CSRF
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
import { loginRateLimit } from '@/lib/rate-limit';

const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
const { success: withinLimit } = await loginRateLimit.limit(`login:${ip}`);
if (!withinLimit) return NextResponse.json(
  { success: false, error: 'Demasiados intentos. Intenta de nuevo en 1 minuto.' },
  { status: 429 }
);

const { data, error } = await supabase.auth.signInWithPassword({ email, password });
if (error) return NextResponse.json(
  { success: false, error: 'Credenciales inválidas' },
  { status: 401 }
);

// Establecer CSRF token en cookie (httpOnly, misma sesión)
const csrfToken = crypto.randomUUID();
const response = NextResponse.json({ success: true, data: { message: 'Login successful' } });
response.cookies.set('csrf-token', csrfToken, {
  httpOnly: true, secure: true, sameSite: 'lax', path: '/admin'
});
return response;
```

## 4. Middleware (`frontend/src/middleware.ts`)
**Responsabilidades:** 1) Proteger `/admin` (excepto `/admin/login`) y `/api/private/*`. 2) i18n routing en rutas públicas.

| Ruta | ¿Sesión? | Acción |
|---|---|---|
| `/admin/*` | Sí | Permite |
| `/admin/*` | No | → /admin/login |
| `/api/private/*` | Sí | Permite (no agrega headers adicionales) |
| `/api/private/*` | No | 401 JSON |

> **Simplificación:** El middleware ya no agrega headers `x-user-id` ni `x-access-token`, pues el backend usa service_role key y no necesita el JWT del usuario.

### Validación CSRF (por cada route handler)
```typescript
// backend/src/lib/auth/csrf.ts
export function validateCsrf(request: NextRequest): boolean {
  const cookieToken = request.cookies.get('csrf-token')?.value;
  const headerToken = request.headers.get('X-CSRF-Token');
  return !!cookieToken && cookieToken === headerToken;
}

// Uso en route handler:
if (!validateCsrf(request)) {
  return NextResponse.json({ success: false, error: 'CSRF token inválido' }, { status: 403 });
}
```

## 5. Logout
```typescript
await supabase.auth.signOut();
// Limpia cookies → redirige a /admin/login
// También limpia cookie csrf-token
```

## 6. Refresh Tokens
Automáticos via `@supabase/ssr`. Access token: 1 hora. Refresh token: 60 días. No requiere código manual.

## 7. Seguridad
| Medida | Implementación |
|---|---|
| JWT en cookies httpOnly | Automático @supabase/ssr |
| SameSite=Lax | Default de Supabase |
| CSRF Protection | Double submit cookie: cookie + header X-CSRF-Token |
| Rate limiting login | 5 intentos/minuto por IP (Upstash/Vercel KV) |
| Service role solo server | `backend/src/lib/supabase/admin.ts` |
| Sin roles ni permisos | ADR-008 |
| Logout invalida sesión | signOut() invalida refresh token |

**Limitaciones V1:** Sin MFA/2FA, sin logs de acceso, sin expiración forzada de sesión.

**Nota de seguridad (futuro):** Se recomienda migrar a roles de BD específicos en lugar de usar service_role para todo, para limitar el daño potencial si un endpoint se compromete.
