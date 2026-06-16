# 05-AUTHENTICATION.md — Anthekira.dev — Autenticación con Supabase Auth

## 1. Propósito

Este documento define el sistema de autenticación de Anthekira.dev, basado en **Supabase Auth** con el método **email + password**. El sistema está diseñado para un único administrador (ADR-008), sin roles ni permisos.

---

## 2. Arquitectura General

```
[Admin Browser]
    │
    ├── /admin/login ─── LoginForm [CC]
    │       │
    │       └── POST /api/private/admin/login
    │               → supabase.auth.signInWithPassword()
    │                   → Devuelve session { access_token, refresh_token }
    │                       → @supabase/ssr establece cookies httpOnly
    │                           → Redirige a /admin
    │
    ├── /admin/* ─── Client Components [CC]
    │       │
    │       └── fetch() a /api/private/*
    │               → Header: Authorization: Bearer <access_token>
    │                   → Middleware verifica sesión en cookies
    │                       → Route Handler verifica token + usa service_role
    │
    └── Sign Out
            → supabase.auth.signOut()
                → Limpia cookies
                    → Redirige a /admin/login
```

### 2.1 Componentes del Sistema

| Componente | Archivo | Rol |
|---|---|---|
| **Supabase Auth** | Servicio externo | Manejo de usuarios, JWT, refresh tokens |
| **@supabase/ssr** | `src/lib/supabase/*.ts` | Clientes SSR para Next.js (server, browser, admin) |
| **Middleware** | `frontend/src/middleware.ts` | Protege rutas `/admin` y `/api/private/*` |
| **Route Handlers** | `frontend/src/app/api/private/*` | Verifican token y usan service_role |
| **Client Components** | `frontend/src/app/admin/*` | Obtienen sesión, envían JWT en headers |
| **Servicios backend** | `backend/src/services/*` | Lógica de negocio invocada desde Route Handlers |
| **Lib backend** | `backend/src/lib/*` | Auth verify, errores, upload |

---

## 3. Clientes de Supabase

### 3.1 `frontend/src/lib/supabase/server.ts` — Cliente Server Component

Usado en Server Components de la Landing Page. Consulta Supabase directamente (sin API Routes intermedias).

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}
```

### 3.2 `frontend/src/lib/supabase/client.ts` — Cliente Browser (Client Component)

Usado en Client Components del panel admin para operaciones de auth (login, logout, obtener sesión).

```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### 3.3 `backend/src/lib/supabase/admin.ts` — Cliente Service Role (solo server)

Usado en Route Handlers de API privada para operaciones administrativas. **Nunca se expone al cliente.**

```typescript
import { createClient } from '@supabase/supabase-js';

// Solo disponible en el servidor
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,  // Variable secreta, no expuesta al cliente
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
```

> **Importante:** `SUPABASE_SERVICE_ROLE_KEY` es una clave secreta que **nunca** debe exponerse al cliente. Solo se usa en `backend/src/lib/supabase/admin.ts`. Esta clave bypassa todas las políticas de RLS.

---

## 4. Flujo de Login

### 4.1 Proceso Detallado

```typescript
// frontend/src/app/api/private/admin/login/route.ts
import { createClient } from '@/lib/supabase/client';  // Browser client (server-side)
import { loginSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = loginSchema.parse(body);

    // Crear cliente Supabase en el servidor
    const supabase = createClient();

    // Intentar autenticación
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validated.email,
      password: validated.password,
    });

    if (error || !data.session) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // @supabase/ssr automáticamente establece cookies httpOnly con la sesión
    return NextResponse.json({
      success: true,
      data: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 4.2 Cookies de Sesión

`@supabase/ssr` maneja automáticamente estas cookies:

| Cookie | Propósito | httpOnly | Secure |
|---|---|---|---|
| `sb-{project-ref}-auth-token` | Access token JWT | Sí | Sí (prod) |
| `sb-{project-ref}-auth-token-code-verifier` | PKCE code verifier | Sí | Sí (prod) |

> El `project-ref` es el identificador único del proyecto en Supabase (ej: `abcdefg`).

### 4.3 Validación del Lado del Cliente (LoginForm)

```typescript
// frontend/src/components/admin/LoginForm.tsx [CC]
'use client';

import { createClient } from '@/lib/supabase/client';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Invalid email or password');
      setLoading(false);
      return;
    }

    // Redirigir al dashboard (la sesión se maneja automáticamente)
    window.location.href = '/admin';
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        minLength={6}
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
```

---

## 5. Flujo de Logout

```typescript
// src/components/admin/Navbar.tsx [CC]
async function handleSignOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  window.location.href = '/admin/login';
}
```

El `signOut()` de Supabase:
1. Invalida el refresh token en el servidor
2. Limpia las cookies de sesión en el cliente
3. El middleware detectará la falta de sesión y redirigirá a `/admin/login`

---

## 6. Middleware de Protección

### 6.1 `frontend/src/middleware.ts`

```typescript
import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ----- 1. Protección de rutas admin -----
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            // En middleware, las cookies se setean en la respuesta
            request.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            request.cookies.set({ name, value: '', ...options });
          },
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ----- 2. Protección de API privada -----
  if (pathname.startsWith('/api/private')) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          // Necesarios para que el refresh token funcione si el access token expiró
          set(name: string, value: string, options: any) {
            request.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            request.cookies.set({ name, value: '', ...options });
          },
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Agregar el user_id al header para que los Route Handlers lo usen
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', session.user.id);
    requestHeaders.set('x-access-token', session.access_token);

    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });

    // Propagar cookies actualizadas (refresh token) en la respuesta
    const setCookies = request.cookies.getAll()
      .filter(c => c.name.startsWith('sb-'))
      .map(c => `${c.name}=${c.value}; Path=/; HttpOnly; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);

    for (const cookie of setCookies) {
      response.headers.append('Set-Cookie', cookie);
    }

    return response;
  }

  // ----- 3. Redirección de idioma (delegado a next-intl) -----
  if (!pathname.startsWith('/admin')) {
    // next-intl middleware se encarga del routing localizado
    return handleI18nRouting(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/|fonts/|locales/).*)',
  ],
};
```

### 6.2 Comportamiento del Middleware

| Ruta solicitada | ¿Hay sesión? | Acción |
|---|---|---|
| `/admin` | Sí | Permite acceso al Dashboard |
| `/admin` | No | Redirige a `/admin/login` |
| `/admin/login` | — | Permite acceso (sin protección) |
| `/admin/projects` | Sí | Permite acceso |
| `/admin/projects` | No | Redirige a `/admin/login` |
| `/api/private/projects` | Sí | Permite request + agrega headers de usuario |
| `/api/private/projects` | No | Responde 401 Unauthorized |
| `/` o `/{lang}/` | — | Aplica i18n routing (sin auth) |
| `/api/public/*` | — | Permite acceso (sin auth) |

---

## 7. Uso en Route Handlers (API Privada)

### 7.1 Obteniendo el User ID

El middleware agrega `x-user-id` al header. Los Route Handlers lo obtienen así:

```typescript
// frontend/src/app/api/private/projects/route.ts
export async function POST(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Usar service_role para operaciones de escritura (bypass RLS)
  const { data, error } = await supabaseAdmin
    .from('projects')
    .insert({
      user_id: userId,
      title: body.title,
      // ...
    })
    .select()
    .single();
}
```

### 7.2 Verificación del Token JWT (Alternativa usando Header Authorization)

Para requests desde el cliente que no usan cookies (ej: fetch manual):

```typescript
// backend/src/lib/auth/verify.ts
import { createClient } from '@supabase/supabase-js';

export async function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or invalid token');
  }

  const token = authHeader.split(' ')[1];

  // Verificar el token con Supabase
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    throw new UnauthorizedError('Invalid or expired token');
  }

  return user;
}
```

---

## 8. Refresh Tokens

Supabase Auth maneja automáticamente el refresh de tokens:

### 8.1 Con `@supabase/ssr`

El cliente SSR renueva automáticamente el token cuando detecta que el access token ha expirado:

```typescript
// @supabase/ssr hace esto automáticamente:
// 1. Detecta que el access token expiró (por defecto: 1 hora)
// 2. Usa el refresh token para obtener uno nuevo
// 3. Actualiza las cookies httpOnly
// 4. Continúa con la request original

// No se requiere código manual para refresh tokens.
```

### 8.2 Configuración de Sesión en Supabase

| Parámetro | Valor por defecto | Recomendación |
|---|---|---|
| **Access token expiry** | 3600 segundos (1 hora) | Default (suficiente para admin) |
| **Refresh token expiry** | 60 días (reuse detection) | Default |
| **Max refresh interval** | 60 minutos | Default (cada refresh extiende la ventana) |

> La configuración se gestiona desde el dashboard de Supabase: `Authentication > Settings > Session Configuration`.

---

## 9. Service Role Key

### 9.1 Propósito

La `SUPABASE_SERVICE_ROLE_KEY` se usa para:

- Bypass de RLS en operaciones de escritura (CREATE, UPDATE, DELETE)
- Acceso a `auth.users` para verificar tokens
- Operaciones administrativas de Supabase Storage (subir/eliminar archivos)

### 9.2 Seguridad

| Regla | Descripción |
|---|---|
| **Nunca en el cliente** | Solo se usa en Route Handlers del servidor |
| **No en Server Components** | Los Server Components usan `@supabase/ssr` con anon key |
| **Solo para escritura** | Las lecturas públicas usan anon key + RLS |
| **Variables de entorno** | `SUPABASE_SERVICE_ROLE_KEY` en `.env.local` y Vercel |

### 9.3 Cuándo usar cada cliente

| Contexto | Cliente | Ubicación | Key | RLS |
|---|---|---|---|---|
| Server Component (Landing Page) | `@supabase/ssr` (server) | `frontend/src/lib/supabase/server.ts` | Anon key | ✅ Aplica |
| Client Component (admin UI) | `@supabase/ssr` (browser) | `frontend/src/lib/supabase/client.ts` | Anon key | ✅ Aplica |
| API Route pública | `@supabase/ssr` (server) | `frontend/src/lib/supabase/server.ts` | Anon key | ✅ Aplica |
| API Route privada (lectura) | `@supabase/ssr` (server) | `frontend/src/lib/supabase/server.ts` | Anon key | ✅ Aplica (SELECT público) |
| API Route privada (escritura) | `supabaseAdmin` (service_role) | `backend/src/lib/supabase/admin.ts` | Service role | ❌ Bypass |

---

## 10. Variables de Entorno

```env
# .env.local / Vercel Environment Variables

# Supabase (obligatorias)
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>  # SECRETA - nunca en cliente

# Autenticación (opcional)
NEXT_PUBLIC_SITE_URL=https://anthekira.dev  # Para redirects post-login
```

---

## 11. Seguridad

### 11.1 Medidas Implementadas

| Medida | Implementación |
|---|---|
| **Contraseña** | Mínimo 6 caracteres (validación Zod + UI) |
| **JWT en cookies httpOnly** | Automático con `@supabase/ssr` |
| **Protección CSRF** | Las cookies SameSite=Lax (default de Supabase) |
| **Rate limiting** | No implementado en V1 (opcional: Vercel WAF o middleware custom) |
| **Logout invalida sesión** | `signOut()` invalida refresh token |
| **Sin roles ni permisos** | Un solo admin (ADR-008) |
| **Service role no expuesto** | Solo en servidor (`src/lib/supabase/admin.ts`) |

### 11.2 Limitaciones Conocidas (V1)

| Limitación | Riesgo | Mitigación |
|---|---|---|
| Sin rate limiting en login | Ataque de fuerza bruta | Contraseña fuerte recomendada |
| Sin MFA/2FA | Cuenta comprometida si se filtra password | Contraseña única, no reutilizada |
| Sin logs de acceso | No hay auditoría de quién accedió | — |
| Sin expiración forzada de sesión | Sesión activa hasta que expire refresh token | Refresh token expiry configurable (60 días) |

---

## 12. Estados y Errores de Auth

### 12.1 Login

| Estado | UI | Descripción |
|---|---|---|
| **Carga** | Botón deshabilitado + spinner | POST en progreso |
| **Error credenciales** | Toast rojo "Invalid email or password" | 401 del servidor |
| **Error validación** | Error inline en el campo | Zod validation fallida |
| **Error red** | Toast "Connection error. Try again." | Fetch falló |
| **Éxito** | Redirección a `/admin` | Login exitoso |

### 12.2 Sesión Expirada

| Escenario | Comportamiento |
|---|---|
| Admin en página `/admin/*` | Middleware detecta sesión expirada → redirige a `/admin/login` |
| Admin hace fetch a API | Route Handler verifica token → 401 → Client Component redirige a login |
| Admin vuelve después de horas | Middleware intenta refresh automático → si falla, redirige a login |

### 12.3 Manejo de 401 en Client Components

```typescript
// Ejemplo: interceptor de fetch en admin
async function adminFetch(url: string, options?: RequestInit) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (response.status === 401) {
    // Sesión expirada, redirigir al login
    window.location.href = '/admin/login';
    return null;
  }

  return response.json();
}
```

---

## 13. Dependencias con otros documentos

| Archivo | Relación |
|---|---|
| `01-ARCHITECTURE.md` | §7 Autenticación — Supabase Auth + JWT |
| `02-DECISIONS.md` | ADR-008 (sin roles) |
| `03-USER-FLOWS.md` | §7 Login flow, §10 Logout flow |
| `01-ENTITIES.md` | §13 Auth types (LoginRequest, LoginResponse) |
| `04-API-PRIVATE.md` | §4.1 Login endpoint, middleware, headers |
| `frontend/01-ROUTES.md` | §4 Middleware y protección de rutas |
| `frontend/02-COMPONENTS.md` | LoginForm, Navbar (SignOut) |
| `frontend/03-LAYOUTS.md` | AdminLayout con AuthGuard |
