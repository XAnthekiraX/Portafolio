---
doc_id: backend-database
version: 1.0.0
last_updated: 2026-06-28
owner: Anthekira
type: api-reference
dependencies: [backend-overview, entities]
tags: [database, postgresql, supabase, rls, migrations, indexes]
ai_context:
  primary_use: Reference for database schema, tables, indexes, RLS policies, and translations
  key_constraints: [PostgreSQL 15+, Supabase, RLS enabled, snake_case plural, UUID PKs]
  target_audience: Backend developers, AI agents implementing database queries
---

# Database — Anthekira.dev

## 📋 Contexto

**Propósito:** Documentación completa del esquema de base de datos PostgreSQL.  
**Cuándo usarlo:** Al crear/modificar queries, migraciones, o entender relaciones entre tablas.  
**Problemas que resuelve:** Centraliza esquema SQL, índices, RLS, y estrategia de traducciones.

## 🏗️ Plataforma

| Componente | Tecnología | Notas |
|------------|------------|-------|
| Motor | PostgreSQL 15+ | Via Supabase |
| Extensión | pgcrypto | UUIDs con `gen_random_uuid()` |
| Convenciones | snake_case plural | PK = `id UUID`, timestamps `created_at`/`updated_at` |

## 📁 Diagrama Relacional

```
auth.users
├── personal_info (1:1)
│   └── entity_translations (1:N, entity_type='personal_info')
├── projects (1:N, type='project'|'saas')
│   ├── entity_translations (1:N, entity_type='project')
│   └── project_skills (N:M skills)
├── skills (1:N)
├── technologies (independiente)
├── education (independiente)
├── services (1:N)
│   └── entity_translations (1:N, entity_type='service')
└── contact_messages (independiente)
```

### Cambios vs V1 Original

| Tabla Eliminada | Absorbida Por | Cambio |
|-----------------|---------------|--------|
| `saas_projects` | `projects` | Unificada con campo `type` |
| `saas_project_translations` | `entity_translations` | Tabla genérica |
| `saas_project_skills` | `project_skills` | Pivote unificado |
| `personal_info_translations` | `entity_translations` | Tabla genérica |
| `project_translations` | `entity_translations` | Tabla genérica |
| `service_translations` | `entity_translations` | Tabla genérica |

**Total:** 14 tablas → 9 tablas (10 tablas principales + 1 pivote N:M + 1 traducciones genérica)

## 📊 Tablas

### personal_info

| Columna | Tipo | Notas |
|---------|------|-------|
| id | UUID PK | `gen_random_uuid()` |
| user_id | UUID FK → auth.users | UNIQUE, ON DELETE CASCADE |
| name | TEXT | |
| professional_title | TEXT | |
| bio | TEXT | |
| current_status | TEXT | |
| email | TEXT | CHECK formato email |
| location | TEXT | |
| avatar_url | TEXT | |
| social_links | JSONB | `{ github?, linkedin?, twitter?, website? }` |
| cv_url | TEXT | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### skills

| Columna | Tipo | Notas |
|---------|------|-------|
| id | UUID PK | |
| name | TEXT | UNIQUE |
| category | TEXT | CHECK IN ('frontend','backend','devops','tools','other') |
| display_order | INTEGER | Default 0 |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### projects (unificada: projects + saas_projects)

| Columna | Tipo | Notas |
|---------|------|-------|
| id | UUID PK | |
| user_id | UUID FK → auth.users | ON DELETE CASCADE |
| title | TEXT | |
| description | TEXT | |
| slug | TEXT | UNIQUE |
| type | TEXT | 'project' \| 'saas', default 'project' |
| project_url | TEXT | Solo si type='project' |
| repository_url | TEXT | Solo si type='project' |
| url | TEXT | Solo si type='saas' |
| image_url | TEXT | |
| features | JSONB | Solo si type='saas'. CHECK: `features IS NULL OR jsonb_typeof(features) = 'array'` |
| status | TEXT | CHECK IN ('draft','active','archived') |
| display_order | INTEGER | Default 0 |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

> **Nota:** Se eliminó `SaasStatus` ('live','beta','development','planning'). Todos comparten el mismo status enum.

### project_skills (N:M)

| Columna | Tipo | Notas |
|---------|------|-------|
| project_id | UUID FK → projects.id | ON DELETE CASCADE |
| skill_id | UUID FK → skills.id | ON DELETE CASCADE |
| created_at | TIMESTAMPTZ | |
| **PK** | (project_id, skill_id) | |

### entity_translations (genérica — reemplaza 4 tablas)

| Columna | Tipo | Notas |
|---------|------|-------|
| id | UUID PK | |
| entity_type | TEXT | CHECK IN ('project', 'personal_info', 'service') |
| entity_id | UUID | FK polimórfica (sin constraint FK) |
| locale | TEXT | CHECK IN ('en', 'pt') |
| content | JSONB | `{ title?, description?, bio? }` según entity_type |
| translation_status | TEXT | CHECK IN ('completed', 'failed') |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |
| **UNIQUE** | (entity_type, entity_id, locale) | |

> **Simplificación:** Se eliminaron `pending` y `translating`. Solo dos estados posibles.

### Content Keys por entity_type

| entity_type | content keys |
|-------------|--------------|
| `project` | `title`, `description` |
| `personal_info` | `bio` |
| `service` | `title`, `description` |

### technologies

| Columna | Tipo | Notas |
|---------|------|-------|
| id | UUID PK | |
| name | TEXT | UNIQUE |
| icon_url | TEXT | |
| website_url | TEXT | |
| display_order | INTEGER | Default 0 |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### education

| Columna | Tipo | Notas |
|---------|------|-------|
| id | UUID PK | |
| institution | TEXT | |
| degree | TEXT | |
| description | TEXT | |
| website_url | TEXT | |
| logo_url | TEXT | |
| display_order | INTEGER | Default 0 |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### services

| Columna | Tipo | Notas |
|---------|------|-------|
| id | UUID PK | |
| title | TEXT | |
| description | TEXT | |
| icon | TEXT | Lucide icon name, default 'Code' |
| status | TEXT | CHECK IN ('available','coming_soon') |
| display_order | INTEGER | Default 0 |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### contact_messages

| Columna | Tipo | Notas |
|---------|------|-------|
| id | UUID PK | |
| name | TEXT | NOT NULL |
| email | TEXT | NOT NULL |
| subject | TEXT | NOT NULL |
| message | TEXT | NOT NULL |
| is_read | BOOLEAN | Default false |
| created_at | TIMESTAMPTZ | |

## 🔌 Traducciones (DeepL Auto-translate)

### Estrategia

1. Admin escribe en ES → validación
2. Guarda en tabla principal
3. DeepL traduce a EN/PT **en paralelo** (`Promise.all`)
4. Upsert en `entity_translations`
5. Responde al cliente

**La traducción es síncrona** (completa antes de responder).

### Fallback de Idioma

```sql
SELECT p.id, p.slug, p.title,
  COALESCE((et.content->>'title'), p.title) AS title,
  COALESCE((et.content->>'description'), p.description) AS description
FROM projects p
LEFT JOIN entity_translations et
  ON et.entity_type = 'project'
  AND et.entity_id = p.id
  AND et.locale = 'en'
  AND et.translation_status = 'completed'
WHERE p.status = 'active'
ORDER BY p.display_order;
```

### Reintento

- Endpoint: `POST /api/private/translations/retry`
- Reintenta traducciones fallidas (`translation_status = 'failed'`)
- Dashboard muestra badge con conteo de fallidas

## 🔧 Índices

```sql
-- personal_info
CREATE INDEX idx_personal_info_user_id ON personal_info(user_id);

-- skills
CREATE UNIQUE INDEX idx_skills_name ON skills(name);
CREATE INDEX idx_skills_category ON skills(category);

-- projects
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_type ON projects(type);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_display_order ON projects(display_order);

-- project_skills
CREATE INDEX idx_project_skills_project ON project_skills(project_id);
CREATE INDEX idx_project_skills_skill ON project_skills(skill_id);

-- entity_translations
CREATE INDEX idx_entity_translations_entity ON entity_translations(entity_type, entity_id);
CREATE INDEX idx_entity_translations_locale ON entity_translations(locale);
CREATE INDEX idx_entity_translations_status ON entity_translations(translation_status);
CREATE UNIQUE INDEX idx_entity_translations_unique ON entity_translations(entity_type, entity_id, locale);

-- technologies
CREATE UNIQUE INDEX idx_technologies_name ON technologies(name);
CREATE INDEX idx_technologies_display_order ON technologies(display_order);

-- education
CREATE INDEX idx_education_display_order ON education(display_order);

-- services
CREATE INDEX idx_services_display_order ON services(display_order);

-- contact_messages
CREATE INDEX idx_contact_messages_is_read ON contact_messages(is_read);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);
```

## 🎯 RLS (Row Level Security)

### Políticas de SELECT Público

| Tabla | Acceso Público | Condición |
|-------|----------------|-----------|
| personal_info | ✅ | Sin filtro |
| skills | ✅ | Sin filtro |
| projects | ✅ | `status = 'active'` |
| technologies | ✅ | Sin filtro |
| education | ✅ | Sin filtro |
| services | ✅ | Sin filtro |
| entity_translations | ✅ | `translation_status = 'completed'` |
| contact_messages | ❌ | Solo service_role |

### Escritura

- INSERT/UPDATE/DELETE en todas las tablas: `auth.role() = 'service_role'`

### Storage RLS

| Bucket | SELECT | INSERT/UPDATE/DELETE |
|--------|--------|----------------------|
| profile | Público | service_role |
| projects | Público | service_role |
| cv | Público | service_role |

## 📝 Seed Data

```sql
INSERT INTO personal_info (user_id, name, professional_title)
VALUES ((SELECT id FROM auth.users LIMIT 1), 'Anthekira', 'Full-Stack Developer');
```

## 📊 Migración SQL

Archivo completo: `backend/supabase/migrations/001_initial_schema.sql`

Contenido:
- CREATE TABLE (10 tablas, desde 14 originales)
- Índices
- RLS policies
- Triggers updated_at

## 🚫 Restricciones

- NO crear tablas sin documentar aquí primero
- NO usar UUID v4 manual — usar `gen_random_uuid()`
- SIempre incluir RLS en nuevas tablas
- SI se necesita nueva relación N:M, crear tabla pivote explícita
