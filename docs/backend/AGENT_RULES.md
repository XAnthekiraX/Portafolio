# Agent Rules — Backend

Reglas que debe seguir cualquier agente (IA o humano) al trabajar sobre el backend del portafolio.

## Stack obligatorio

| Capa | Tecnología |
|------|-----------|
| Runtime | Node.js 22+ con TypeScript 5+ |
| Framework | Express (o Hono si se prefiere minimalista) |
| ORM | Drizzle ORM (evitar Prisma u otros) |
| Auth | Supabase Auth (client-supabase o supabase-js del lado server) |
| Storage | Supabase Storage |
| DB | PostgreSQL (Supabase) |
| Validación | Zod |
| Testing | Vitest |

## Estructura de carpetas

```
backend/
├── src/
│   ├── index.ts              # Entry point
│   ├── config/               # Env vars, DB connection, Supabase client
│   ├── routes/               # Express routers
│   │   ├── public/           # GET /api/* (sin auth)
│   │   └── admin/            # CRUD /api/admin/* (JWT required)
│   ├── middleware/           # Auth middleware, error handler, rate-limit
│   ├── services/             # Business logic
│   ├── validators/           # Zod schemas
│   └── types/                # TypeScript interfaces
├── migrations/               # Drizzle migrations
├── tests/
├── package.json
├── tsconfig.json
└── drizzle.config.ts
```

Nota: `contact-message.service.ts` expone tanto el `insert` público (POST /api/contact) como los métodos privados (list, getById, updateStatus, delete, getCount) para el panel admin.

## Convenciones de código

- **Idioma**: Código y comentarios en español.
- **Nombrado**: camelCase en JS/TS, snake_case en DB.
- **Endpoints**: siempre con prefijo `/api/` y versionado implícito.
- **Respuestas**: envolver en `{ data: … }` para éxito, `{ error: { code, message, details? } }` para error.
- **HTTP Status**: 200 GET/PATCH, 201 POST, 204 DELETE, 400 validación, 401 auth, 404 not found.

## Autenticación

- No implementar login/logout propio. Delegar a Supabase Auth.
- El middleware de auth verifica el JWT con `supabase.auth.getUser()`.
- Si el token es inválido/expirado → `401 { error: { code: "UNAUTHORIZED" } }`.

## Supabase Storage

Buckets definidos:

| Bucket | Visibilidad | Uso |
|--------|-----------|-----|
| `avatars` | Público | Fotos de perfil |
| `cv` | Público | Archivos CV |
| `projects` | Público | Imágenes de proyectos |

Las URLs se generan con `supabase.storage.from('bucket').getPublicUrl(path)`.

## RLS

Ver `SCHEMES.md` — todas las tablas tienen RLS habilitado.
- `SELECT` → anónimo (público).
- `INSERT`, `UPDATE`, `DELETE` → `auth.role() = 'authenticated'`.

## ORM (Drizzle)

- Usar `drizzle-orm` con driver `postgres.js`.
- Las migraciones se generan con `drizzle-kit`.
- No usar `raw SQL` fuera de migraciones.

## Testing

- Unit tests con Vitest para servicios y validadores.
- Las rutas se testean con `supertest`.

## Comandos

```bash
npm run dev          # Desarrollo
npm run build        # Compilar TS
npm run test         # Tests
npm run db:generate  # Generar migración Drizzle
npm run db:migrate   # Aplicar migración
npm run db:studio    # Abrir Drizzle Studio
```
