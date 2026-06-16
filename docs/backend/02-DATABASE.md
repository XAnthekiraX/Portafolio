# 02-DATABASE.md — Anthekira.dev — Esquema de Base de Datos

## 1. Propósito

Este documento define el esquema completo de la base de datos PostgreSQL de Anthekira.dev, incluyendo tablas, columnas, tipos, constraints, índices, relaciones, políticas de seguridad (RLS) y datos semilla.

**Plataforma:** Supabase (PostgreSQL 15+)
**Extensión obligatoria:** `pgcrypto` (para UUIDs) — habilitada por defecto en Supabase.

---

## 2. Convenciones

| Elemento | Convención | Ejemplo |
|---|---|---|
| Nombres de tablas | `snake_case` plural | `projects`, `contact_messages` |
| Nombres de columnas | `snake_case` | `created_at`, `site_name` |
| Primary Key | `id UUID DEFAULT gen_random_uuid()` | — |
| Timestamps | `created_at` y `updated_at` en cada tabla | `TIMESTAMPTZ NOT NULL DEFAULT now()` |
| Soft delete | No implementado en V1 (DELETE físico) | — |
| Traducciones | Tabla separada `{resource}_translations` | `project_translations` |
| Relaciones N:M | Tabla pivote `{resource1}_{resource2}` | `project_skills` |
| JSON para datos planos | `JSONB` para listas pequeñas sin consultas complejas | `social_links`, `features` |

---

## 3. Diagrama de Relaciones

```
users (auth.users de Supabase)
  │
  ├── personal_info ─── (1:1, FK → users.id)
  │
  ├── projects ─── (1:N, creator → users.id)
  │     ├── project_translations ─── (1:N, FK → projects.id)
  │     └── project_skills ─── (N:M, skills)
  │
  ├── saas_projects ─── (1:N, creator → users.id)
  │     └── saas_project_skills ─── (N:M, skills)
  │
  ├── skills ─── (1:N, creator → users.id)
  │
  ├── technologies ─── (1:N, creator → users.id)
  │
  ├── education ─── (sin FK, independiente)
  │
  ├── services ─── (1:N, creator → users.id)
  │     └── service_translations ─── (1:N, FK → services.id)
  │
  └── contact_messages ─── (sin FK, solo registro — formulario contacto público)
```

---

## 4. Tablas Detalladas

### 4.1 `users`

Gestionada automáticamente por Supabase Auth (`auth.users`). Se referencia mediante FK desde las tablas del esquema `public`.

| Columna (auth.users) | Tipo | Descripción |
|---|---|---|
| `id` | `UUID` | Primary Key (generado por Supabase) |
| `email` | `TEXT` | Email del administrador |
| `created_at` | `TIMESTAMPTZ` | Fecha de registro |
| `last_sign_in_at` | `TIMESTAMPTZ` | Último inicio de sesión |

> **Nota:** No se crea una tabla `users` en el esquema `public`. Se usa directamente `auth.users` mediante FK con `REFERENCES auth.users(id) ON DELETE CASCADE`.

---

### 4.2 `personal_info`

Información personal y profesional del administrador.

```sql
CREATE TABLE personal_info (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Datos básicos
  name                TEXT NOT NULL DEFAULT '',
  professional_title  TEXT NOT NULL DEFAULT '',
  bio                 TEXT NOT NULL DEFAULT '',         -- Español (idioma fuente)
  current_status      TEXT NOT NULL DEFAULT '',          -- "Open to work", "Freelance", etc.
  email               TEXT NOT NULL DEFAULT '',          -- Email público de contacto
  location            TEXT NOT NULL DEFAULT '',          -- Ciudad/País
  avatar_url          TEXT NOT NULL DEFAULT '',          -- Supabase Storage URL

  -- Redes sociales (JSONB plano)
  social_links        JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- Ejemplo: {
  --   "github": "https://github.com/anthekira",
  --   "linkedin": "https://linkedin.com/in/anthekira",
  --   "twitter": "https://twitter.com/anthekira",
  --   "website": "https://anthekira.dev"
  -- }

  -- CV
  cv_url              TEXT NOT NULL DEFAULT '',          -- URL del PDF en Supabase Storage

  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Solo una fila por usuario (UNIQUE en user_id ya cubre esto)
```

> **⚠️ social_links merge strategy:** El endpoint `PUT /api/private/personal-info` recibe campos individuales (github, linkedin, twitter, website). El backend debe hacer **merge** parcial con el JSONB existente, no reemplazar el objeto completo. Si solo se envía `{ github: "..." }`, los otros enlaces (linkedin, twitter, website) deben conservarse.

**Índices:**
```sql
CREATE INDEX idx_personal_info_user_id ON personal_info(user_id);
```

**RLS:**
```sql
-- Lectura pública (Landing Page)
CREATE POLICY "personal_info_select_public"
  ON personal_info FOR SELECT
  USING (true);

-- Escritura solo con service_role (API privada)
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;
```

---

### 4.2.1 `personal_info_translations`

Traducciones de la biografía generadas por DeepL.

```sql
CREATE TABLE personal_info_translations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  personal_info_id UUID NOT NULL REFERENCES personal_info(id) ON DELETE CASCADE,
  locale          TEXT NOT NULL CHECK (locale IN ('en', 'pt')),

  bio             TEXT NOT NULL,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (personal_info_id, locale)
);

CREATE INDEX idx_personal_info_translations_info ON personal_info_translations(personal_info_id);
CREATE INDEX idx_personal_info_translations_locale ON personal_info_translations(locale);
```

**RLS:**
```sql
CREATE POLICY "personal_info_translations_select_public"
  ON personal_info_translations FOR SELECT
  USING (true);

ALTER TABLE personal_info_translations ENABLE ROW LEVEL SECURITY;
```

---

### 4.3 `skills`

Habilidades técnicas categorizadas.

```sql
CREATE TABLE skills (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  category    TEXT NOT NULL CHECK (category IN ('frontend', 'backend', 'devops', 'tools', 'other')),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_skills_name ON skills(name);
CREATE INDEX idx_skills_category ON skills(category);
```

**RLS:**
```sql
CREATE POLICY "skills_select_public"
  ON skills FOR SELECT USING (true);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
```

---

### 4.4 `projects`

Proyectos destacados del portafolio.

```sql
CREATE TABLE projects (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Campos en español (idioma fuente)
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,

  -- URL-friendly identifier
  slug            TEXT NOT NULL UNIQUE,

  -- Enlaces
  project_url     TEXT NOT NULL DEFAULT '',
  repository_url  TEXT NOT NULL DEFAULT '',

  -- Media
  image_url       TEXT NOT NULL DEFAULT '',     -- Imagen destacada (Supabase Storage)

  -- Estado
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),

  -- Orden de visualización
  display_order   INTEGER NOT NULL DEFAULT 0,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_display_order ON projects(display_order);
```

**RLS:**
```sql
CREATE POLICY "projects_select_public"
  ON projects FOR SELECT
  USING (status = 'active');

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
```

---

### 4.5 `project_translations`

Traducciones de proyectos generadas por DeepL.

```sql
CREATE TABLE project_translations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  locale      TEXT NOT NULL CHECK (locale IN ('en', 'pt')),

  -- Campos traducidos
  title       TEXT NOT NULL,
  description TEXT NOT NULL,

  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Solo una traducción por idioma por proyecto
  UNIQUE (project_id, locale)
);

CREATE INDEX idx_project_translations_project ON project_translations(project_id);
CREATE INDEX idx_project_translations_locale ON project_translations(locale);
```

**RLS:**
```sql
CREATE POLICY "project_translations_select_public"
  ON project_translations FOR SELECT
  USING (true);

ALTER TABLE project_translations ENABLE ROW LEVEL SECURITY;
```

---

### 4.6 `project_skills`

Relación N:M entre proyectos y skills.

```sql
CREATE TABLE project_skills (
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  skill_id    UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  PRIMARY KEY (project_id, skill_id)
);

CREATE INDEX idx_project_skills_project ON project_skills(project_id);
CREATE INDEX idx_project_skills_skill ON project_skills(skill_id);
```

**RLS:**
```sql
CREATE POLICY "project_skills_select_public"
  ON project_skills FOR SELECT
  USING (true);

ALTER TABLE project_skills ENABLE ROW LEVEL SECURITY;
```

---

### 4.7 `saas_projects`

Proyectos SaaS con estado y características.

```sql
CREATE TABLE saas_projects (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  name            TEXT NOT NULL,
  description     TEXT NOT NULL,
  url             TEXT NOT NULL,
  image_url       TEXT NOT NULL DEFAULT '',
  status          TEXT NOT NULL DEFAULT 'live' CHECK (status IN ('live', 'beta', 'development', 'planning')),
  features        JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(features) = 'array'),
  -- Ejemplo: ["Real-time sync", "Multi-tenant", "API REST", "Webhook integration"]

  display_order   INTEGER NOT NULL DEFAULT 0,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_saas_projects_user_id ON saas_projects(user_id);
CREATE INDEX idx_saas_projects_status ON saas_projects(status);
CREATE INDEX idx_saas_projects_display_order ON saas_projects(display_order);
```

**RLS:**
```sql
CREATE POLICY "saas_projects_select_public"
  ON saas_projects FOR SELECT
  USING (true);

ALTER TABLE saas_projects ENABLE ROW LEVEL SECURITY;
```

---

### 4.7.1 `saas_project_translations`

Traducciones de proyectos SaaS generadas por DeepL (name + description).

```sql
CREATE TABLE saas_project_translations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  saas_project_id UUID NOT NULL REFERENCES saas_projects(id) ON DELETE CASCADE,
  locale          TEXT NOT NULL CHECK (locale IN ('en', 'pt')),

  name            TEXT NOT NULL,
  description     TEXT NOT NULL,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (saas_project_id, locale)
);

CREATE INDEX idx_saas_project_translations_project ON saas_project_translations(saas_project_id);
CREATE INDEX idx_saas_project_translations_locale ON saas_project_translations(locale);
```

**RLS:**
```sql
CREATE POLICY "saas_project_translations_select_public"
  ON saas_project_translations FOR SELECT
  USING (true);

ALTER TABLE saas_project_translations ENABLE ROW LEVEL SECURITY;
```

---

### 4.8 `saas_project_skills`

Relación N:M entre proyectos SaaS y skills.

```sql
CREATE TABLE saas_project_skills (
  saas_project_id UUID NOT NULL REFERENCES saas_projects(id) ON DELETE CASCADE,
  skill_id        UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  PRIMARY KEY (saas_project_id, skill_id)
);

CREATE INDEX idx_saas_project_skills_project ON saas_project_skills(saas_project_id);
CREATE INDEX idx_saas_project_skills_skill ON saas_project_skills(skill_id);
```

**RLS:**
```sql
CREATE POLICY "saas_project_skills_select_public"
  ON saas_project_skills FOR SELECT
  USING (true);

ALTER TABLE saas_project_skills ENABLE ROW LEVEL SECURITY;
```

---

### 4.9 `technologies`

Tecnologías y herramientas (con icono y web).

```sql
CREATE TABLE technologies (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL UNIQUE,
  icon_url      TEXT NOT NULL DEFAULT '',     -- URL del icono (Supabase Storage)
  website_url   TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_technologies_display_order ON technologies(display_order);
```

**RLS:**
```sql
CREATE POLICY "technologies_select_public"
  ON technologies FOR SELECT
  USING (true);

ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;
```

---

### 4.10 `education`

Formación académica del administrador (sin traducción — contenido solo en español).

```sql
CREATE TABLE education (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  institution   TEXT NOT NULL,             -- Nombre de la institución
  degree        TEXT NOT NULL,             -- Título o curso obtenido
  description   TEXT NOT NULL DEFAULT '',  -- Descripción rápida
  website_url   TEXT NOT NULL DEFAULT '',  -- URL de la institución
  logo_url      TEXT NOT NULL DEFAULT '',  -- URL del logo
  display_order INTEGER NOT NULL DEFAULT 0,

  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_education_display_order ON education(display_order);
```

**RLS:**
```sql
CREATE POLICY "education_select_public"
  ON education FOR SELECT
  USING (true);

ALTER TABLE education ENABLE ROW LEVEL SECURITY;
```

---

### 4.11 `services`

Servicios profesionales ofrecidos.

```sql
CREATE TABLE services (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Campos en español (idioma fuente)
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,

  -- Icono de Lucide (nombre del icono, ej: "Code", "Server", "Cloud")
  icon          TEXT NOT NULL DEFAULT 'Code',

  -- Estado
  status        TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'coming_soon')),

  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_services_display_order ON services(display_order);
```

**RLS:**
```sql
CREATE POLICY "services_select_public"
  ON services FOR SELECT
  USING (true);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
```

---

### 4.12 `service_translations`

Traducciones de servicios generadas por DeepL.

```sql
CREATE TABLE service_translations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id  UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  locale      TEXT NOT NULL CHECK (locale IN ('en', 'pt')),

  title       TEXT NOT NULL,
  description TEXT NOT NULL,

  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (service_id, locale)
);

CREATE INDEX idx_service_translations_service ON service_translations(service_id);
CREATE INDEX idx_service_translations_locale ON service_translations(locale);
```

**RLS:**
```sql
CREATE POLICY "service_translations_select_public"
  ON service_translations FOR SELECT
  USING (true);

ALTER TABLE service_translations ENABLE ROW LEVEL SECURITY;
```

---

### 4.13 `contact_messages`

Mensajes recibidos desde el formulario de contacto público.

```sql
CREATE TABLE contact_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  subject     TEXT NOT NULL,
  message     TEXT NOT NULL,
  is_read     BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_contact_messages_is_read ON contact_messages(is_read);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);
```

**RLS:**
```sql
-- Sin acceso público (solo service_role)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
```

---



## 5. Traducciones (DeepL Auto-translate)

### 5.1 Estrategia

| Aspecto | Decisión |
|---|---|
| **Idioma fuente** | Español (ES) — el admin escribe en español |
| **Idiomas destino** | Inglés (EN) y Portugués (PT) |
| **Cuándo se traduce** | Al guardar/actualizar el contenido (POST/PUT) |
| **Servicio** | DeepL API (plan gratis: 500K caracteres/mes) |
| **Almacenamiento** | Tablas separadas `{resource}_translations` con `locale` |
| **Fallback** | Si no hay traducción para un locale, se muestra ES |
| **Edición manual** | El admin puede modificar cualquier traducción manualmente |

### 5.2 Tablas de Traducción

| Tabla | Resource FK | Locales | Campos traducibles |
|---|---|---|---|
| `project_translations` | `project_id → projects.id` | `en`, `pt` | `title`, `description` |
| `service_translations` | `service_id → services.id` | `en`, `pt` | `title`, `description` |
| `saas_project_translations` | `saas_project_id → saas_projects.id` | `en`, `pt` | `name`, `description` |
| `personal_info_translations` | `personal_info_id → personal_info.id` | `en`, `pt` | `bio` |

### 5.3 Consulta con Fallback

```sql
-- Obtener proyecto con traducción en el locale solicitado (con fallback a ES)
SELECT
  p.id,
  p.slug,
  COALESCE(pt.title, p.title) AS title,
  COALESCE(pt.description, p.description) AS description,
  p.project_url,
  p.image_url,
  p.status
FROM projects p
LEFT JOIN project_translations pt
  ON pt.project_id = p.id AND pt.locale = 'en'
WHERE p.status = 'active'
ORDER BY p.display_order;
```

---

## 6. Row Level Security (RLS)

### 6.1 Resumen de Políticas

| Tabla | Lectura pública (SELECT) | Escritura (INSERT/UPDATE/DELETE) |
|---|---|---|
| `personal_info` | ✅ Sí (todo el mundo) | ❌ Solo service_role (API privada) |
| `skills` | ✅ Sí (todo el mundo) | ❌ Solo service_role |
| `projects` | ✅ Solo `status = 'active'` | ❌ Solo service_role |
| `project_translations` | ✅ Sí (todo el mundo) | ❌ Solo service_role |
| `saas_project_translations` | ✅ Sí (todo el mundo) | ❌ Solo service_role |
| `personal_info_translations` | ✅ Sí (todo el mundo) | ❌ Solo service_role |
| `education` | ✅ Sí (todo el mundo) | ❌ Solo service_role |
| `project_skills` | ✅ Sí (todo el mundo) | ❌ Solo service_role |
| `saas_projects` | ✅ Sí (todo el mundo) | ❌ Solo service_role |
| `saas_project_skills` | ✅ Sí (todo el mundo) | ❌ Solo service_role |
| `technologies` | ✅ Sí (todo el mundo) | ❌ Solo service_role |
| `services` | ✅ Sí (todo el mundo) | ❌ Solo service_role |
| `service_translations` | ✅ Sí (todo el mundo) | ❌ Solo service_role |
| `contact_messages` | ❌ No (solo service_role) | ❌ Solo service_role |

### 6.2 Notas

- Todas las tablas tienen RLS habilitado.
- Las políticas de SELECT público permiten a la Landing Page consultar datos sin autenticación.
- Las operaciones de escritura solo son posibles desde el servidor usando la `service_role` key.
- `contact_messages` no tiene SELECT público (solo el admin puede ver los mensajes).
- `projects` tiene un filtro `WHERE status = 'active'` para no mostrar borradores/archivados.

---

## 7. Supabase Storage

### 7.1 Buckets

| Bucket | Visibilidad | Tipos permitidos | Tamaño máximo | Contenido |
|---|---|---|---|---|
| `profile` | Público | JPG, PNG, WebP | 2 MB | Avatar/imagen de perfil |
| `projects` | Público | JPG, PNG, WebP | 5 MB | Imágenes de proyectos |
| `cv` | Público | PDF | 10 MB | Currículum vitae |

### 7.2 Políticas de Storage

```sql
-- Bucket: profile
CREATE POLICY "profile_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile');

CREATE POLICY "profile_insert_private"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'profile' AND auth.role() = 'service_role');

-- Bucket: projects
CREATE POLICY "projects_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'projects');

CREATE POLICY "projects_insert_private"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'projects' AND auth.role() = 'service_role');

-- Bucket: cv
CREATE POLICY "cv_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'cv');

CREATE POLICY "cv_insert_private"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'cv' AND auth.role() = 'service_role');
```

### 7.3 Estructura de Carpetas

```
profile/
  └── avatar.webp

projects/
  └── {project-id}/
      ├── main.webp
      └── screenshot-1.webp

cv/
  └── anthekira-cv.pdf
```

---

## 8. Datos Semilla

### 8.1 Admin User

El usuario administrador se crea manualmente desde el Dashboard de Supabase Auth (email + password). No se incluye en migraciones automáticas.

### 8.2 Personal Info por Defecto

```sql
INSERT INTO personal_info (user_id, name, professional_title)
VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  'Anthekira',
  'Full-Stack Developer'
);
```

---

## 9. Migración SQL Completa

```sql
-- ============================================================
-- 02-DATABASE.sql — Migración completa de Anthekira.dev
-- ============================================================

-- Extensión UUID (ya habilitada en Supabase por defecto)
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- TABLAS
-- ============================================================

-- 4.2 personal_info
CREATE TABLE personal_info (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name                TEXT NOT NULL DEFAULT '',
  professional_title  TEXT NOT NULL DEFAULT '',
  bio                 TEXT NOT NULL DEFAULT '',
  current_status      TEXT NOT NULL DEFAULT '',
  email               TEXT NOT NULL DEFAULT '',
  location            TEXT NOT NULL DEFAULT '',
  avatar_url          TEXT NOT NULL DEFAULT '',
  social_links        JSONB NOT NULL DEFAULT '{}'::jsonb,
  cv_url              TEXT NOT NULL DEFAULT '',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_personal_info_user_id ON personal_info(user_id);

-- 4.3 skills
CREATE TABLE skills (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  category      TEXT NOT NULL CHECK (category IN ('frontend', 'backend', 'devops', 'tools', 'other')),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_skills_name ON skills(name);
CREATE INDEX idx_skills_category ON skills(category);

-- 4.4 projects
CREATE TABLE projects (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  project_url     TEXT NOT NULL DEFAULT '',
  repository_url  TEXT NOT NULL DEFAULT '',
  image_url       TEXT NOT NULL DEFAULT '',
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  display_order   INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_display_order ON projects(display_order);

-- 4.5 project_translations
CREATE TABLE project_translations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  locale      TEXT NOT NULL CHECK (locale IN ('en', 'pt')),
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (project_id, locale)
);

CREATE INDEX idx_project_translations_project ON project_translations(project_id);
CREATE INDEX idx_project_translations_locale ON project_translations(locale);

-- 4.6 project_skills
CREATE TABLE project_skills (
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  skill_id    UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (project_id, skill_id)
);

CREATE INDEX idx_project_skills_project ON project_skills(project_id);
CREATE INDEX idx_project_skills_skill ON project_skills(skill_id);

-- 4.7 saas_projects
CREATE TABLE saas_projects (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT NOT NULL,
  url             TEXT NOT NULL,
  image_url       TEXT NOT NULL DEFAULT '',
  status          TEXT NOT NULL DEFAULT 'live' CHECK (status IN ('live', 'beta', 'development', 'planning')),
  features        JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(features) = 'array'),
  display_order   INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_saas_projects_user_id ON saas_projects(user_id);
CREATE INDEX idx_saas_projects_status ON saas_projects(status);
CREATE INDEX idx_saas_projects_display_order ON saas_projects(display_order);

-- 4.8 saas_project_skills
CREATE TABLE saas_project_skills (
  saas_project_id UUID NOT NULL REFERENCES saas_projects(id) ON DELETE CASCADE,
  skill_id        UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (saas_project_id, skill_id)
);

CREATE INDEX idx_saas_project_skills_project ON saas_project_skills(saas_project_id);
CREATE INDEX idx_saas_project_skills_skill ON saas_project_skills(skill_id);

-- 4.9 technologies
CREATE TABLE technologies (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL UNIQUE,
  icon_url      TEXT NOT NULL DEFAULT '',
  website_url   TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_technologies_display_order ON technologies(display_order);

-- 4.10 education
CREATE TABLE education (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution   TEXT NOT NULL,
  degree        TEXT NOT NULL,
  description   TEXT NOT NULL DEFAULT '',
  website_url   TEXT NOT NULL DEFAULT '',
  logo_url      TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_education_display_order ON education(display_order);

-- 4.11 services
CREATE TABLE services (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  icon          TEXT NOT NULL DEFAULT 'Code',
  status        TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'coming_soon')),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_services_display_order ON services(display_order);

-- 4.12 service_translations
CREATE TABLE service_translations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id  UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  locale      TEXT NOT NULL CHECK (locale IN ('en', 'pt')),
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (service_id, locale)
);

CREATE INDEX idx_service_translations_service ON service_translations(service_id);
CREATE INDEX idx_service_translations_locale ON service_translations(locale);

-- 4.14 contact_messages
CREATE TABLE contact_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  subject     TEXT NOT NULL,
  message     TEXT NOT NULL,
  is_read     BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_contact_messages_is_read ON contact_messages(is_read);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_project_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_project_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_info_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Políticas de SELECT público
CREATE POLICY "personal_info_select_public"
  ON personal_info FOR SELECT USING (true);

CREATE POLICY "skills_select_public"
  ON skills FOR SELECT USING (true);

CREATE POLICY "projects_select_public"
  ON projects FOR SELECT USING (status = 'active');

CREATE POLICY "project_translations_select_public"
  ON project_translations FOR SELECT USING (true);

CREATE POLICY "project_skills_select_public"
  ON project_skills FOR SELECT USING (true);

CREATE POLICY "saas_projects_select_public"
  ON saas_projects FOR SELECT USING (true);

CREATE POLICY "saas_project_translations_select_public"
  ON saas_project_translations FOR SELECT USING (true);

CREATE POLICY "saas_project_skills_select_public"
  ON saas_project_skills FOR SELECT USING (true);

CREATE POLICY "personal_info_translations_select_public"
  ON personal_info_translations FOR SELECT USING (true);

CREATE POLICY "technologies_select_public"
  ON technologies FOR SELECT USING (true);

CREATE POLICY "education_select_public"
  ON education FOR SELECT USING (true);

CREATE POLICY "services_select_public"
  ON services FOR SELECT USING (true);

CREATE POLICY "service_translations_select_public"
  ON service_translations FOR SELECT USING (true);

-- Nota: contact_messages no tiene SELECT público
-- (solo accesible via service_role desde API privada)

-- ============================================================
-- TRIGGER: updated_at automático
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_personal_info_updated_at
  BEFORE UPDATE ON personal_info
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_skills_updated_at
  BEFORE UPDATE ON skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_project_translations_updated_at
  BEFORE UPDATE ON project_translations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_saas_projects_updated_at
  BEFORE UPDATE ON saas_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_saas_project_translations_updated_at
  BEFORE UPDATE ON saas_project_translations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_personal_info_translations_updated_at
  BEFORE UPDATE ON personal_info_translations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_technologies_updated_at
  BEFORE UPDATE ON technologies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_education_updated_at
  BEFORE UPDATE ON education
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_service_translations_updated_at
  BEFORE UPDATE ON service_translations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 10. Resumen de Entidades vs Tablas

| Entidad (admin panel) | Tabla(s) | Tipo |
|---|---|---|
| Dashboard (cards resumen) | Varias (count queries) | Consultas |
| Projects | `projects`, `project_translations`, `project_skills` | CRUD completo |
| SaaS Projects | `saas_projects`, `saas_project_translations`, `saas_project_skills` | CRUD completo |
| Profile → Personal Info | `personal_info`, `personal_info_translations` | GET/PUT |
| Profile → CV | `personal_info.cv_url` | Campo |
| Profile → Skills | `skills` | CRUD completo |
| Profile → Social Links | `personal_info.social_links` (JSONB) | Campo (merge parcial) |
| Technologies | `technologies` | CRUD completo |
| Education | `education` | CRUD completo (sin traducción) |
| Services | `services`, `service_translations` | CRUD completo |
| Contact Messages | `contact_messages` | POST (público) |
| Login | `auth.users` (Supabase Auth) | Autenticación |

---

## 11. Dependencias con otros documentos

| Archivo | Relación |
|---|---|
| `00-REQUIREMENTS.md` | Define las entidades del sistema |
| `01-ARCHITECTURE.md` | Describe cómo se conecta Next.js a esta BD |
| `02-DECISIONS.md` | ADR-002 (Supabase), ADR-006 (DeepL traducciones) |
| `frontend/docs/08-ADMIN-PANEL.md` | Define los formularios y campos que escriben en estas tablas |
| `backend/docs/03-API-PUBLIC.md` | Endpoints públicos que leen de estas tablas |
| `backend/docs/04-API-PRIVATE.md` | Endpoints privados que escriben en estas tablas |
| `backend/docs/05-AUTHENTICATION.md` | Integración con auth.users y Supabase Auth |
| `backend/docs/06-BUSINESS-LOGIC.md` | Lógica de negocio (auto-traducción, validaciones) |
