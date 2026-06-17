# 02-DATABASE.md — Anthekira.dev

## 1. Plataforma
Supabase (PostgreSQL 15+). Extensión: pgcrypto (UUIDs). Convenciones: snake_case plural, PK = `id UUID DEFAULT gen_random_uuid()`, timestamps `created_at`/`updated_at`.

## 2. Diagrama Relacional
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

**Cambios respecto a V1 original:**
- `saas_projects`, `saas_project_translations`, `saas_project_skills` → eliminadas, absorbidas por `projects` (con campo `type`) y `project_skills`
- `personal_info_translations`, `project_translations`, `service_translations` → reemplazadas por única tabla `entity_translations`

## 3. Tablas

### personal_info
| Columna | Tipo | Notas |
|---------|------|-------|
| id | UUID PK | gen_random_uuid() |
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
| url | TEXT | Solo si type='saas' (link al SaaS) |
| image_url | TEXT | |
| features | JSONB | Solo si type='saas'. `CHECK (features IS NULL OR jsonb_typeof(features) = 'array')` |
| status | TEXT | CHECK IN ('draft','active','archived') |
| display_order | INTEGER | Default 0 |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

> **Nota:** Se eliminó `SaasStatus` ('live','beta','development','planning'). Todos los proyectos comparten el mismo status enum. Si un proyecto SaaS necesita indicar su estado de desarrollo, se usa un campo semántico adicional o tags.

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
| entity_id | UUID | FK polimórfica (sin constraint FK por ser polimórfica) |
| locale | TEXT | CHECK IN ('en', 'pt') |
| content | JSONB | `{ title?, description?, bio? }` según entity_type |
| translation_status | TEXT | CHECK IN ('completed', 'failed') |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |
| **UNIQUE** | (entity_type, entity_id, locale) | |

> **Simplificación:** Se eliminaron los estados `pending` y `translating`. La traducción ahora es síncrona, por lo que solo hay dos estados posibles.

**content keys por entity_type:**
| entity_type | content keys |
|---|---|
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

## 4. Traducciones (DeepL Auto-translate)

### Estrategia
- Admin escribe en ES → validación → guarda en tabla principal → DeepL traduce a EN/PT **en paralelo** (`Promise.all`) → upsert en `entity_translations` → responde al cliente
- La traducción es **síncrona** (completa antes de responder al cliente)
- Si una traducción falla → `translation_status: 'failed'` + contenido ES como fallback en la tabla principal
- Si fallan ambas → se responde con error parcial y se notifica al admin

### Fallback de idioma
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
- Endpoint `POST /api/private/translations/retry` para reintentar traducciones fallidas manualmente
- Se muestra contador en dashboard admin con enlace a retry

## 5. Índices
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

## 6. RLS

Todas las tablas con RLS habilitado.

### Políticas de SELECT público
- Todas las tablas permiten SELECT público EXCEPTO `contact_messages`
- `projects` filtra por `status = 'active'` (no se muestran drafts/archived)
- `entity_translations` permite SELECT público solo para `translation_status = 'completed'`

### Escritura solo service_role
- INSERT/UPDATE/DELETE en todas las tablas requieren `auth.role() = 'service_role'`

### Storage RLS
Tres buckets (`profile`, `projects`, `cv`) con políticas:
- SELECT público para todos
- INSERT/UPDATE/DELETE solo service_role

## 7. Seed Data
```sql
INSERT INTO personal_info (user_id, name, professional_title)
VALUES ((SELECT id FROM auth.users LIMIT 1), 'Anthekira', 'Full-Stack Developer');
```

## 8. Migración SQL
Archivo completo en: `backend/supabase/migrations/001_initial_schema.sql`
Incluye: CREATE TABLE (10 tablas, desde 14 originales), índices, RLS, triggers updated_at.
