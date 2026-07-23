# Schemes — Backend Portfolio

> Esquema completo de base de datos, RLS, buckets de Storage y configuración de Supabase.

## Convenciones

- Nombres en **snake_case** plural.
- `id` UUID v4 PK en todas las tablas.
- `created_at` y `updated_at` con default `NOW()`.
- Tipos: `VARCHAR(100-255)` para strings cortas, `TEXT` para largas, `INTEGER` para números, `BOOLEAN` para flags, `TIMESTAMPTZ` para fechas, `DATE` para fechas sin hora, `JSONB` para arrays.

---

## Modelo relacional

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

### profiles

| Columna | Tipo | Constraint | Descripción |
|---------|------|-----------|-------------|
| id | UUID | PK → auth.users(id) CASCADE | Misma ID que Supabase Auth |
| first_name | VARCHAR(100) | NOT NULL | |
| last_name | VARCHAR(100) | NOT NULL | |
| title | VARCHAR(255) | NOT NULL | Título profesional |
| description | TEXT | | Biografía |
| location | VARCHAR(255) | | Ub. geográfica |
| experience_years | INTEGER | NOT NULL DEFAULT 0 | |
| is_available | BOOLEAN | NOT NULL DEFAULT true | |
| email | VARCHAR(255) | NOT NULL | |
| avatar_url | TEXT | | Bucket `avatars` |
| cv_url | TEXT | | Bucket `cv` |
| cv_updated_at | TIMESTAMPTZ | | |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |

---

### social_links

| Columna | Tipo | Constraint |
|---------|------|-----------|
| id | UUID | PK |
| profile_id | UUID | NOT NULL → profiles(id) CASCADE |
| platform | VARCHAR(50) | NOT NULL |
| url | TEXT | NOT NULL |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() |

**UNIQUE** (profile_id, platform)

---

### skill_categories

| Columna | Tipo | Constraint |
|---------|------|-----------|
| id | UUID | PK |
| name | VARCHAR(100) | NOT NULL UNIQUE |
| icon | VARCHAR(100) | |
| display_order | INTEGER | NOT NULL DEFAULT 0 |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() |

---

### skill_technologies

| Columna | Tipo | Constraint |
|---------|------|-----------|
| id | UUID | PK |
| skill_category_id | UUID | NOT NULL → skill_categories(id) CASCADE |
| name | VARCHAR(100) | NOT NULL |
| display_order | INTEGER | NOT NULL DEFAULT 0 |

**UNIQUE** (skill_category_id, name)

---

### technologies

| Columna | Tipo | Constraint |
|---------|------|-----------|
| id | UUID | PK |
| name | VARCHAR(100) | NOT NULL UNIQUE |
| icon | VARCHAR(100) | |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() |

---

### projects

| Columna | Tipo | Constraint |
|---------|------|-----------|
| id | UUID | PK |
| title | VARCHAR(255) | NOT NULL |
| description | TEXT | |
| category | VARCHAR(100) | |
| image_url | TEXT | Bucket `projects` |
| features | JSONB | DEFAULT '[]'::jsonb |
| repo_url | TEXT | |
| demo_url | TEXT | |
| status | VARCHAR(20) | NOT NULL DEFAULT 'draft' CHECK (published,draft,hidden) |
| visits | INTEGER | NOT NULL DEFAULT 0 |
| display_order | INTEGER | NOT NULL DEFAULT 0 |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() |

---

### project_technologies

| Columna | Tipo | Constraint |
|---------|------|-----------|
| id | UUID | PK |
| project_id | UUID | NOT NULL → projects(id) CASCADE |
| technology_id | UUID | NOT NULL → technologies(id) CASCADE |

**UNIQUE** (project_id, technology_id)

---

### education_items

| Columna | Tipo | Constraint |
|---------|------|-----------|
| id | UUID | PK |
| title | VARCHAR(255) | NOT NULL |
| degree | VARCHAR(255) | |
| institution | VARCHAR(255) | NOT NULL |
| type | VARCHAR(20) | NOT NULL CHECK (academic,certification) |
| start_date | DATE | NOT NULL |
| end_date | DATE | |
| description | TEXT | |
| status | VARCHAR(20) | NOT NULL DEFAULT 'active' CHECK (active,expiring,expired) |
| display_order | INTEGER | NOT NULL DEFAULT 0 |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() |

---

### services

| Columna | Tipo | Constraint |
|---------|------|-----------|
| id | UUID | PK |
| title | VARCHAR(255) | NOT NULL |
| description | TEXT | |
| icon | VARCHAR(100) | |
| status | VARCHAR(20) | NOT NULL DEFAULT 'available' CHECK (popular,available,ondemand) |
| display_order | INTEGER | NOT NULL DEFAULT 0 |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() |

---

### contact_messages

| Columna | Tipo | Constraint |
|---------|------|-----------|
| id | UUID | PK |
| name | VARCHAR(255) | NOT NULL |
| email | VARCHAR(255) | NOT NULL |
| subject | VARCHAR(255) | NOT NULL |
| message | TEXT | NOT NULL |
| status | VARCHAR(20) | NOT NULL DEFAULT 'unread' CHECK (unread,read,replied) |
| read_at | TIMESTAMPTZ | |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() |

**Auto-limpieza:** Los mensajes con `created_at < NOW() - INTERVAL '30 days'` se eliminan automáticamente (cron o trigger).

---

## Row-Level Security (RLS)

Todas las tablas tienen RLS habilitado. Políticas:

| Tabla | Operación | Rol | Policy |
|-------|-----------|-----|--------|
| profiles | SELECT | `anon` | `true` (público) |
| profiles | INSERT / UPDATE / DELETE | `authenticated` | `auth.uid() = id` (solo dueño) |
| social_links | SELECT | `anon` | `true` |
| social_links | INSERT / UPDATE / DELETE | `authenticated` | `true` |
| skill_categories | SELECT | `anon` | `true` |
| skill_categories | INSERT / UPDATE / DELETE | `authenticated` | `true` |
| skill_technologies | SELECT | `anon` | `true` |
| skill_technologies | INSERT / UPDATE / DELETE | `authenticated` | `true` |
| technologies | SELECT | `anon` | `true` |
| technologies | INSERT / UPDATE / DELETE | `authenticated` | `true` |
| projects | SELECT | `anon` | `status = 'published'` |
| projects | INSERT / UPDATE / DELETE | `authenticated` | `true` |
| project_technologies | SELECT | `anon` | `true` (filtro implícito por projects) |
| project_technologies | INSERT / UPDATE / DELETE | `authenticated` | `true` |
| education_items | SELECT | `anon` | `type = 'academic'` |
| education_items | INSERT / UPDATE / DELETE | `authenticated` | `true` |
| services | SELECT | `anon` | `true` |
| services | INSERT / UPDATE / DELETE | `authenticated` | `true` |
| contact_messages | INSERT | `anon` | `true` |
| contact_messages | SELECT / UPDATE / DELETE | `authenticated` | `true` |

### SQL de RLS

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policies públicas (SELECT para anon)

CREATE POLICY "public_select_profiles" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "public_select_social_links" ON social_links
    FOR SELECT USING (true);

CREATE POLICY "public_select_skill_categories" ON skill_categories
    FOR SELECT USING (true);

CREATE POLICY "public_select_skill_technologies" ON skill_technologies
    FOR SELECT USING (true);

CREATE POLICY "public_select_technologies" ON technologies
    FOR SELECT USING (true);

CREATE POLICY "public_select_projects" ON projects
    FOR SELECT USING (status = 'published');

CREATE POLICY "public_select_project_technologies" ON project_technologies
    FOR SELECT USING (true);

CREATE POLICY "public_select_education" ON education_items
    FOR SELECT USING (type = 'academic');

CREATE POLICY "public_select_services" ON services
    FOR SELECT USING (true);

CREATE POLICY "public_insert_contact" ON contact_messages
    FOR INSERT WITH CHECK (true);

-- Policies privadas (authenticated)

CREATE POLICY "admin_all_profiles" ON profiles
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "admin_all_social_links" ON social_links
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "admin_all_skill_categories" ON skill_categories
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "admin_all_skill_technologies" ON skill_technologies
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "admin_all_technologies" ON technologies
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "admin_all_projects" ON projects
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "admin_all_project_technologies" ON project_technologies
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "admin_all_education" ON education_items
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "admin_all_services" ON services
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "admin_all_contact_messages" ON contact_messages
    FOR ALL USING (auth.role() = 'authenticated');
```

---

## Resumen de buckets (Supabase Storage)

| Bucket | Visibilidad | Objetos | Ruta típica |
|--------|-----------|---------|-------------|
| `Images` | Público | N | `{user_id}/avatar.webp`, `{user_id}/cv.pdf`, `{project_id}/image.webp` |

### Políticas de Storage

```sql
-- Lectura pública
CREATE POLICY "public_read_images" ON storage.objects
    FOR SELECT USING (bucket_id = 'Images');

-- Escritura autenticada
CREATE POLICY "admin_write_images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'Images' AND auth.role() = 'authenticated'
    );

CREATE POLICY "admin_update_images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'Images' AND auth.role() = 'authenticated'
    );

CREATE POLICY "admin_delete_images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'Images' AND auth.role() = 'authenticated'
    );
```

---

## SQL completo de creación

Ver `docs/sql/01-schema.sql` para el SQL completo con todas las tablas, constraints, índices y DDL.
