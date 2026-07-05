# Architecture — Backend Portfolio

## Diagrama de alto nivel

```
Cliente (React SPA)
    │
    ├── Público ───────── GET /api/* ───────┐
    │                                       │
    └── Admin (JWT) ──── CRUD /api/admin/* ─┤
                                            │
                                            ▼
                                     Express Server
                                     (Node.js + TS)
                                    │
                    ┌───────────────┼────────────────┐
                    │               │                │
                    ▼               ▼                ▼
             Supabase Auth    Supabase Storage   PostgreSQL
             (JWT gestion)    (avatars, cv,      (Drizzle ORM)
                               projects)
```

## Capas

### 1. Routes

Definen los endpoints y conectan con validadores y servicios.

```
routes/
├── public/
│   ├── profile.ts       → GET /api/profile
│   ├── skills.ts        → GET /api/skills
│   ├── technologies.ts  → GET /api/technologies
│   ├── projects.ts      → GET /api/projects
│   ├── education.ts     → GET /api/education
│   ├── services.ts      → GET /api/services
│   ├── cv.ts            → GET /api/cv
│   └── contact.ts       → POST /api/contact
└── admin/
    ├── auth.ts          → POST login/logout, GET me (delega a Supabase)
    ├── profile.ts       → GET/PUT profile
    ├── social.ts        → CRUD social_links
    ├── skills.ts        → CRUD skill_categories + skill_technologies
    ├── cv.ts            → GET/POST/DELETE cv_url
    ├── education.ts     → CRUD education_items
    ├── technologies.ts  → CRUD technologies
    ├── projects.ts      → CRUD projects
    ├── services.ts      → CRUD services
    └── contact.ts       → List, detail, count, update status, delete
```

### 2. Middleware

| Middleware | Propósito |
|-----------|-----------|
| `auth.ts` | Verifica JWT con `supabase.auth.getUser()`. Inserta `req.user`. |
| `validate.ts` | Valida request body/params contra schema Zod. |
| `error-handler.ts` | Captura errores, devuelve formato `{ error }`. |
| `rate-limit.ts` | Límite de peticiones. `POST /api/contact`: 3 solicitudes por hora por IP. |

### 3. Services

Capa de negocio. Cada recurso tiene un service que recibe el DB client y ejecuta queries con Drizzle.

```
services/
├── profile.service.ts
├── social-link.service.ts
├── skill-category.service.ts
├── technology.service.ts
├── project.service.ts
├── education.service.ts
├── cv.service.ts
├── service.service.ts       # Servicios profesionales
└── contact-message.service.ts
```

### 4. Database (Drizzle ORM)

Conexión a PostgreSQL vía Supabase. Esquema definido en Drizzle con tipos inferidos.

```
src/
└── db/
    ├── index.ts              # Conexión (supabase + drizzle)
    ├── schema/
    │   ├── profiles.ts
    │   ├── social-links.ts
    │   ├── skill-categories.ts
    │   ├── skill-technologies.ts
    │   ├── technologies.ts
    │   ├── projects.ts
    │   ├── project-technologies.ts
    │   ├── education-items.ts
    │   ├── services.ts
    │   └── contact-messages.ts
    └── migrations/           # Generadas por drizzle-kit
```

### 5. Storage (Supabase Storage)

Los archivos se manejan mediante las APIs de Supabase Storage. Flujo típico:

```
1. Cliente envía multipart/form-data
2. Backend recibe el file, lo sube a Supabase Storage
3. Obtiene la URL pública con getPublicUrl()
4. Guarda la URL en la DB (columna correspondiente)
```

## Flujo de autenticación

```
Request a /api/admin/*
    │
    ▼
auth middleware
    │
    ├── Sin token → 401
    │
    └── Con token
        │
        ▼
    supabase.auth.getUser(token)
        │
        ├── Inválido/expirado → 401
        │
        └── Válido
            │
            ▼
        req.user = { id, email }
            │
            ▼
        Pasa al route handler
```

## Dependencias principales

```json
{
  "express": "^5",
  "drizzle-orm": "^0.40",
  "postgres": "^3",
  "@supabase/supabase-js": "^2",
  "zod": "^3",
  "multer": "^1",
  "cors": "^2",
  "helmet": "^8"
}
```

## Variables de entorno

```env
PORT=3001
DATABASE_URL=postgresql://...
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
CORS_ORIGIN=http://localhost:5173
```
