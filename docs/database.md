# Database Schema — Portfolio

> Diseño de base de datos derivado del análisis de endpoints públicos y privados.

## Convenciones

- Nombres de tablas en **snake_case** plural.
- Todas las tablas tienen `id` como UUID v4 (PK).
- `created_at` y `updated_at` con defaults `NOW()`.
- Soft-delete opcional con `deleted_at TIMESTAMPTZ`.
- Tipos de referencia: `VARCHAR` para strings cortas, `TEXT` para largas, `INTEGER` para números, `BOOLEAN` para flags, `TIMESTAMPTZ` para fechas.

---

## Diagrama entidad-relación

```
auth.users (Supabase)
    │
    └──1
       │
    profiles 1───* social_links

skill_categories 1───* skill_technologies (join)

technologies 1───* project_technologies *───1 projects

education_items (independiente, ordenado por display_order)

services (independiente, ordenado por display_order)

contact_messages (independiente, solo escritura pública)
```

---

## Tablas

### `profiles`

Información pública del portafolio. La PK es el `id` del usuario en `auth.users` de Supabase (relación 1:1).

| Columna          | Tipo         | Constraints                               | Descripción                                          |
| ---------------- | ------------ | ----------------------------------------- | ---------------------------------------------------- |
| id               | UUID         | PK, FK → auth.users(id) ON DELETE CASCADE | Misma ID que Supabase Auth                           |
| first_name       | VARCHAR(100) | NOT NULL                                  | Nombre                                               |
| last_name        | VARCHAR(100) | NOT NULL                                  | Apellido                                             |
| title            | VARCHAR(255) | NOT NULL                                  | Título profesional                                   |
| description      | TEXT         |                                           | Biografía                                            |
| location         | VARCHAR(255) |                                           | Ubicación geográfica                                 |
| experience_years | INTEGER      | NOT NULL, DEFAULT 0                       | Años de experiencia                                  |
| is_available     | BOOLEAN      | NOT NULL, DEFAULT true                    | Disponibilidad                                       |
| email            | VARCHAR(255) | NOT NULL                                  | Email de contacto                                    |
| avatar_url       | TEXT         |                                           | URL de avatar en Supabase Storage (bucket `avatars`) |
| cv_url           | TEXT         |                                           | URL del CV en Supabase Storage (bucket `cv`)         |
| cv_updated_at    | TIMESTAMPTZ  |                                           | Fecha de última actualización del CV                 |
| created_at       | TIMESTAMPTZ  | NOT NULL, DEFAULT NOW()                   |                                                      |
| updated_at       | TIMESTAMPTZ  | NOT NULL, DEFAULT NOW()                   |                                                      |

**Nota:** El endpoint público `GET /api/profile` expone `name` (concatenación de `first_name` + `last_name`) y `isAvailable`. El admin `GET /api/admin/profile` expone `firstName`/`lastName` por separado.

**Endpoints asociados:**

- Público: `GET /api/profile`
- Admin: `GET /api/admin/profile`, `PUT /api/admin/profile`

---

### `social_links`

Redes sociales asociadas al perfil.

| Columna    | Tipo        | Constraints                                   | Descripción              |
| ---------- | ----------- | --------------------------------------------- | ------------------------ |
| id         | UUID        | PK, DEFAULT gen_random_uuid()                 |                          |
| profile_id | UUID        | NOT NULL, FK → profiles(id) ON DELETE CASCADE |                          |
| platform   | VARCHAR(50) | NOT NULL                                      | Ej: "github", "linkedin" |
| url        | TEXT        | NOT NULL                                      | URL completa             |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW()                       |                          |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW()                       |                          |

**Endpoints asociados:**

- Público: embebido en `GET /api/profile`
- Admin: `GET /api/admin/profile/social`, `POST /api/admin/profile/social`, `PATCH /api/admin/profile/social/:id`, `DELETE /api/admin/profile/social/:id`

---

### `skill_categories`

Categorías de habilidades (Frontend, Backend, etc.).

| Columna       | Tipo         | Constraints                   | Descripción             |
| ------------- | ------------ | ----------------------------- | ----------------------- |
| id            | UUID         | PK, DEFAULT gen_random_uuid() |                         |
| name          | VARCHAR(100) | NOT NULL, UNIQUE              |                         |
| icon          | VARCHAR(100) |                               | Nombre del icono Lucide |
| display_order | INTEGER      | NOT NULL, DEFAULT 0           |                         |
| created_at    | TIMESTAMPTZ  | NOT NULL, DEFAULT NOW()       |                         |
| updated_at    | TIMESTAMPTZ  | NOT NULL, DEFAULT NOW()       |                         |

**Endpoints asociados:**

- Público: `GET /api/skills`
- Admin: `GET /api/admin/skills`, `POST /api/admin/skills`, `PATCH /api/admin/skills/:id`, `DELETE /api/admin/skills/:id`

---

### `skill_technologies`

Tabla pivote: tecnologías dentro de cada categoría de skill.

| Columna           | Tipo         | Constraints                                           | Descripción             |
| ----------------- | ------------ | ----------------------------------------------------- | ----------------------- |
| id                | UUID         | PK, DEFAULT gen_random_uuid()                         |                         |
| skill_category_id | UUID         | NOT NULL, FK → skill_categories(id) ON DELETE CASCADE |                         |
| name              | VARCHAR(100) | NOT NULL                                              | Nombre de la tecnología |
| display_order     | INTEGER      | NOT NULL, DEFAULT 0                                   |                         |

**UNIQUE** (`skill_category_id`, `name`)

---

### `technologies`

Catálogo global de tecnologías/herramientas de uso diario.

| Columna    | Tipo         | Constraints                   | Descripción             |
| ---------- | ------------ | ----------------------------- | ----------------------- |
| id         | UUID         | PK, DEFAULT gen_random_uuid() |                         |
| name       | VARCHAR(100) | NOT NULL, UNIQUE              |                         |
| icon       | VARCHAR(100) |                               | Nombre del icono Lucide |
| created_at | TIMESTAMPTZ  | NOT NULL, DEFAULT NOW()       |                         |
| updated_at | TIMESTAMPTZ  | NOT NULL, DEFAULT NOW()       |                         |

**Endpoints asociados:**

- Público: `GET /api/technologies`
- Admin: `GET /api/admin/technologies`, `POST /api/admin/technologies`, `PATCH /api/admin/technologies/:id`, `DELETE /api/admin/technologies/:id`

---

### `projects`

Proyectos destacados del portafolio.

| Columna       | Tipo         | Constraints                                                        | Descripción                                           |
| ------------- | ------------ | ------------------------------------------------------------------ | ----------------------------------------------------- |
| id            | UUID         | PK, DEFAULT gen_random_uuid()                                      |                                                       |
| title         | VARCHAR(255) | NOT NULL                                                           |                                                       |
| description   | TEXT         |                                                                    |                                                       |
| category      | VARCHAR(100) |                                                                    | Ej: "SaaS", "Web App" (público)                       |
| image_url     | TEXT         |                                                                    | URL de imagen en Supabase Storage (bucket `projects`) |
| features      | JSONB        | DEFAULT '[]'::jsonb                                                | Array de strings (público)                            |
| repo_url      | TEXT         |                                                                    | URL del repositorio                                   |
| demo_url      | TEXT         |                                                                    | URL de demo en vivo                                   |
| url           | TEXT         |                                                                    | URL del proyecto en vivo (admin)                      |
| repository    | TEXT         |                                                                    | URL del repositorio (admin)                           |
| status        | VARCHAR(20)  | NOT NULL, DEFAULT 'draft', CHECK IN ('published','draft','hidden') |                                                       |
| visits        | INTEGER      | NOT NULL, DEFAULT 0                                                | Contador de visitas                                   |
| display_order | INTEGER      | NOT NULL, DEFAULT 0                                                |                                                       |
| created_at    | TIMESTAMPTZ  | NOT NULL, DEFAULT NOW()                                            |                                                       |
| updated_at    | TIMESTAMPTZ  | NOT NULL, DEFAULT NOW()                                            |                                                       |

**Nota:** `repo_url` y `repository` son equivalentes semánticos; `demo_url` y `url` también. Se mantienen ambos para compatibilidad con ambas APIs.

**Endpoints asociados:**

- Público: `GET /api/projects`
- Admin: `GET /api/admin/projects`, `POST /api/admin/projects`, `PATCH /api/admin/projects/:id`, `DELETE /api/admin/projects/:id`

---

### `project_technologies`

Tecnologías asociadas a un proyecto.

| Columna       | Tipo | Constraints                                       | Descripción |
| ------------- | ---- | ------------------------------------------------- | ----------- |
| id            | UUID | PK, DEFAULT gen_random_uuid()                     |             |
| project_id    | UUID | NOT NULL, FK → projects(id) ON DELETE CASCADE     |             |
| technology_id | UUID | NOT NULL, FK → technologies(id) ON DELETE CASCADE |             |

**UNIQUE** (`project_id`, `technology_id`)

---

### `education_items`

Formación académica y certificaciones.

| Columna       | Tipo         | Constraints                                                          | Descripción                       |
| ------------- | ------------ | -------------------------------------------------------------------- | --------------------------------- |
| id            | UUID         | PK, DEFAULT gen_random_uuid()                                        |                                   |
| title         | VARCHAR(255) | NOT NULL                                                             | Título del grado o certificación  |
| degree        | VARCHAR(255) |                                                                      | Alias para compatibilidad pública |
| institution   | VARCHAR(255) | NOT NULL                                                             |                                   |
| type          | VARCHAR(20)  | NOT NULL, CHECK IN ('academic','certification')                      |                                   |
| start_date    | DATE         | NOT NULL                                                             |                                   |
| end_date      | DATE         |                                                                      | NULL si es "en curso"             |
| description   | TEXT         |                                                                      |                                   |
| status        | VARCHAR(20)  | NOT NULL, DEFAULT 'active', CHECK IN ('active','expiring','expired') |                                   |
| display_order | INTEGER      | NOT NULL, DEFAULT 0                                                  |                                   |
| created_at    | TIMESTAMPTZ  | NOT NULL, DEFAULT NOW()                                              |                                   |
| updated_at    | TIMESTAMPTZ  | NOT NULL, DEFAULT NOW()                                              |                                   |

**Nota:** El endpoint público `GET /api/education` expone `degree`; el admin `title`. En DB se almacena `title` y se mapea a `degree` en la respuesta pública (o viceversa).

**Endpoints asociados:**

- Público: `GET /api/education`
- Admin: `GET /api/admin/education`, `POST /api/admin/education`, `PATCH /api/admin/education/:id`, `DELETE /api/admin/education/:id`

---

### `services`

Servicios profesionales ofrecidos.

| Columna       | Tipo         | Constraints                                                                | Descripción                       |
| ------------- | ------------ | -------------------------------------------------------------------------- | --------------------------------- |
| id            | UUID         | PK, DEFAULT gen_random_uuid()                                              |                                   |
| title         | VARCHAR(255) | NOT NULL                                                                   |                                   |
| description   | TEXT         |                                                                            |                                   |
| icon          | VARCHAR(100) |                                                                            | Nombre del icono Lucide (público) |
| status        | VARCHAR(20)  | NOT NULL, DEFAULT 'available', CHECK IN ('popular','available','ondemand') |                                   |
| display_order | INTEGER      | NOT NULL, DEFAULT 0                                                        |                                   |
| created_at    | TIMESTAMPTZ  | NOT NULL, DEFAULT NOW()                                                    |                                   |
| updated_at    | TIMESTAMPTZ  | NOT NULL, DEFAULT NOW()                                                    |                                   |

**Endpoints asociados:**

- Público: `GET /api/services`
- Admin: `GET /api/admin/services`, `POST /api/admin/services`, `PATCH /api/admin/services/:id`, `DELETE /api/admin/services/:id`

---

### `contact_messages`

Mensajes enviados desde el formulario de contacto público.

| Columna    | Tipo         | Constraints                                                      | Descripción |
| ---------- | ------------ | ---------------------------------------------------------------- | ----------- |
| id         | UUID         | PK, DEFAULT gen_random_uuid()                                    |             |
| name       | VARCHAR(255) | NOT NULL                                                         |             |
| email      | VARCHAR(255) | NOT NULL                                                         |             |
| subject    | VARCHAR(255) | NOT NULL                                                         |             |
| message    | TEXT         | NOT NULL                                                         |             |
| status     | VARCHAR(20)  | NOT NULL, DEFAULT 'unread', CHECK IN ('unread','read','replied') |             |
| read_at    | TIMESTAMPTZ  |                                                                  |             |
| created_at | TIMESTAMPTZ  | NOT NULL, DEFAULT NOW()                                          |             |

**Endpoints asociados:**

- Público: `POST /api/contact`

---

## Resumen de tablas

| #   | Tabla                  | PK   | FKs                           | Descripción                 |
| --- | ---------------------- | ---- | ----------------------------- | --------------------------- |
| 1   | `profiles`             | UUID | 1 → auth.users                | Perfil del portafolio       |
| 2   | `social_links`         | UUID | 1 (profile_id)                | Redes sociales              |
| 3   | `skill_categories`     | UUID | —                             | Categorías de habilidades   |
| 4   | `skill_technologies`   | UUID | 1 (skill_category_id)         | Tecnologías por categoría   |
| 5   | `technologies`         | UUID | —                             | Catálogo de tecnologías     |
| 6   | `projects`             | UUID | —                             | Proyectos                   |
| 7   | `project_technologies` | UUID | 2 (project_id, technology_id) | Tecnologías por proyecto    |
| 8   | `education_items`      | UUID | —                             | Formación y certificaciones |
| 9   | `services`             | UUID | —                             | Servicios                   |
| 10  | `contact_messages`     | UUID | —                             | Mensajes de contacto        |

## Mapeo endpoints → tablas

### Públicos (sin auth)

| Endpoint            | Método | Tabla(s)                                     | Operación                     |
| ------------------- | ------ | -------------------------------------------- | ----------------------------- |
| `/api/profile`      | GET    | profiles, social_links                       | SELECT                        |
| `/api/skills`       | GET    | skill_categories, skill_technologies         | SELECT + JOIN                 |
| `/api/technologies` | GET    | technologies                                 | SELECT                        |
| `/api/projects`     | GET    | projects, project_technologies, technologies | SELECT + JOIN                 |
| `/api/education`    | GET    | education_items                              | SELECT (solo type='academic') |
| `/api/services`     | GET    | services                                     | SELECT                        |
| `/api/cv`           | GET    | profiles                                     | SELECT (redirige a cv_url)    |
| `/api/contact`      | POST   | contact_messages                             | INSERT                        |

### Privados (JWT requerido)

| Endpoint                        | Método | Tabla(s)                                     | Operación                |
| ------------------------------- | ------ | -------------------------------------------- | ------------------------ |
| `/api/admin/auth/login`         | POST   | auth.users (Supabase)                        | signInWithPassword       |
| `/api/admin/auth/logout`        | POST   | —                                            | signOut (Supabase)       |
| `/api/admin/auth/me`            | GET    | auth.users (Supabase) + profiles             | getUser + SELECT         |
| `/api/admin/profile`            | GET    | profiles, social_links                       | SELECT                   |
| `/api/admin/profile`            | PUT    | profiles                                     | UPDATE                   |
| `/api/admin/profile/social`     | GET    | social_links                                 | SELECT                   |
| `/api/admin/profile/social`     | POST   | social_links                                 | INSERT                   |
| `/api/admin/profile/social/:id` | PATCH  | social_links                                 | UPDATE                   |
| `/api/admin/profile/social/:id` | DELETE | social_links                                 | DELETE                   |
| `/api/admin/skills`             | GET    | skill_categories, skill_technologies         | SELECT + JOIN            |
| `/api/admin/skills`             | POST   | skill_categories, skill_technologies         | INSERT                   |
| `/api/admin/skills/:id`         | PATCH  | skill_categories, skill_technologies         | UPDATE                   |
| `/api/admin/skills/:id`         | DELETE | skill_categories, skill_technologies         | DELETE                   |
| `/api/admin/cv`                 | GET    | profiles                                     | SELECT cv_url             |
| `/api/admin/cv`                 | POST   | profiles                                     | UPDATE cv_url             |
| `/api/admin/cv`                 | DELETE | profiles                                     | UPDATE cv_url = NULL      |
| `/api/admin/education`          | GET    | education_items                              | SELECT                   |
| `/api/admin/education`          | POST   | education_items                              | INSERT                   |
| `/api/admin/education/:id`      | PATCH  | education_items                              | UPDATE                   |
| `/api/admin/education/:id`      | DELETE | education_items                              | DELETE                   |
| `/api/admin/technologies`       | GET    | technologies                                 | SELECT                   |
| `/api/admin/technologies`       | POST   | technologies                                 | INSERT                   |
| `/api/admin/technologies/:id`   | PATCH  | technologies                                 | UPDATE                   |
| `/api/admin/technologies/:id`   | DELETE | technologies                                 | DELETE                   |
| `/api/admin/projects`           | GET    | projects, project_technologies, technologies | SELECT + JOIN            |
| `/api/admin/projects`           | POST   | projects, project_technologies               | INSERT                   |
| `/api/admin/projects/:id`       | PATCH  | projects, project_technologies               | UPDATE                   |
| `/api/admin/projects/:id`       | DELETE | projects, project_technologies               | DELETE                   |
| `/api/admin/services`           | GET    | services                                     | SELECT                   |
| `/api/admin/services`           | POST   | services                                     | INSERT                   |
| `/api/admin/services/:id`       | PATCH  | services                                     | UPDATE                   |
| `/api/admin/services/:id`       | DELETE | services                                     | DELETE                   |

## SQL de creación

```sql
-- La tabla auth.users es gestionada automáticamente por Supbase.
-- Los usuarios se crean desde el dashboard de Supabase Auth o vía API de Supabase.
-- No se almacenan passwords en tablas propias.

-- 1. profiles (PK hereda de auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    experience_years INTEGER NOT NULL DEFAULT 0,
    is_available BOOLEAN NOT NULL DEFAULT true,
    email VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    cv_url TEXT,
    cv_updated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. social_links
CREATE TABLE social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. skill_categories
CREATE TABLE skill_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(100),
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. skill_technologies
CREATE TABLE skill_technologies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_category_id UUID NOT NULL REFERENCES skill_categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    UNIQUE (skill_category_id, name)
);

-- 5. technologies
CREATE TABLE technologies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. projects
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    image_url TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    repo_url TEXT,
    demo_url TEXT,
    url TEXT,
    repository TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('published', 'draft', 'hidden')),
    visits INTEGER NOT NULL DEFAULT 0,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. project_technologies
CREATE TABLE project_technologies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    technology_id UUID NOT NULL REFERENCES technologies(id) ON DELETE CASCADE,
    UNIQUE (project_id, technology_id)
);

-- 8. education_items
CREATE TABLE education_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    degree VARCHAR(255),
    institution VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('academic', 'certification')),
    start_date DATE NOT NULL,
    end_date DATE,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'expiring', 'expired')),
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. services
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'available'
        CHECK (status IN ('popular', 'available', 'ondemand')),
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. contact_messages
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'unread'
        CHECK (status IN ('unread', 'read', 'replied')),
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices recomendados
CREATE INDEX idx_social_links_profile_id ON social_links(profile_id);
CREATE INDEX idx_skill_technologies_category_id ON skill_technologies(skill_category_id);
CREATE INDEX idx_project_technologies_project_id ON project_technologies(project_id);
CREATE INDEX idx_project_technologies_technology_id ON project_technologies(technology_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_display_order ON projects(display_order);
CREATE INDEX idx_education_display_order ON education_items(display_order);
CREATE INDEX idx_services_display_order ON services(display_order);
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
```
