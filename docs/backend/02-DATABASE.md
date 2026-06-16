# 02-DATABASE.md — Anthekira.dev

## 1. Plataforma
Supabase (PostgreSQL 15+). Extensión: pgcrypto (UUIDs). Convenciones: snake_case plural, PK = `id UUID DEFAULT gen_random_uuid()`, timestamps `created_at`/`updated_at`.

## 2. Diagrama Relacional
```
auth.users
├── personal_info (1:1)
│   └── personal_info_translations (content JSONB)
├── projects (1:N) + project_translations (content JSONB) + project_skills (N:M skills)
├── saas_projects (1:N) + saas_project_translations (content JSONB) + saas_project_skills (N:M skills)
├── skills (1:N)
├── technologies (1:N)
├── education (independiente)
├── services (1:N) + service_translations (content JSONB)
└── contact_messages (independiente)
```

## 3. Tablas (resumen)
| Tabla | PK | FK | Columnas clave |
|---|---|---|---|
| personal_info | UUID | user_id → auth.users | name, bio, avatar_url, social_links(JSONB), cv_url |
| personal_info_translations | UUID | personal_info_id | locale, content(JSONB), translation_status |
| skills | UUID | — | name (unique), category, display_order |
| projects | UUID | user_id → auth.users | title, description, slug (unique), image_url, status |
| project_translations | UUID | project_id | locale, content(JSONB){title, description}, translation_status |
| project_skills | (project_id, skill_id) | ambas | — |
| saas_projects | UUID | user_id → auth.users | name, description, url, features(JSONB[]), status |
| saas_project_translations | UUID | saas_project_id | locale, content(JSONB){name, description}, translation_status |
| saas_project_skills | (saas_project_id, skill_id) | ambas | — |
| technologies | UUID | — | name (unique), icon_url, website_url |
| education | UUID | — | institution, degree, description |
| services | UUID | — | title, description, icon, status |
| service_translations | UUID | service_id | locale, content(JSONB){title, description}, translation_status |
| contact_messages | UUID | — | name, email, subject, message, is_read |

> **social_links merge:** PUT en personal-info hace merge parcial del JSONB, no reemplazo completo. Campos null = eliminar, no enviados = conservar.

## 4. Traducciones (DeepL Auto-translate)
**Estrategia:** Admin escribe en ES → DeepL traduce a EN/PT al guardar → tablas separadas con `content JSONB` + `translation_status`.  
**Fallback:** Si no hay traducción → se muestra ES (contenido tabla principal).  
**Estados:** pending → translating → completed | → failed (reintentable).

| Tabla | content keys | Locales |
|---|---|---|
| project_translations | `title`, `description` | en, pt |
| service_translations | `title`, `description` | en, pt |
| saas_project_translations | `name`, `description` | en, pt |
| personal_info_translations | `bio` | en, pt |

**Consulta con fallback:**
```sql
SELECT p.id, p.slug,
  COALESCE((pt.content->>'title'), p.title) AS title,
  COALESCE((pt.content->>'description'), p.description) AS description
FROM projects p LEFT JOIN project_translations pt ON pt.project_id = p.id AND pt.locale = 'en'
WHERE p.status = 'active' ORDER BY p.display_order;
```

## 5. RLS
Todas las tablas con RLS habilitado. SELECT público en todas excepto contact_messages. Projects filtra por `status = 'active'`. Escritura solo via service_role.

## 6. Storage
| Bucket | Tipos | Tamaño max | Contenido |
|---|---|---|---|
| profile | JPG, PNG, WebP | 2 MB | Avatar |
| projects | JPG, PNG, WebP | 5 MB | Imágenes |
| cv | PDF | 10 MB | CV |

Políticas: SELECT público, INSERT solo service_role.

## 7. Seed Data
Admin user se crea manualmente en Supabase Auth. Seed de personal_info:
```sql
INSERT INTO personal_info (user_id, name, professional_title)
VALUES ((SELECT id FROM auth.users LIMIT 1), 'Anthekira', 'Full-Stack Developer');
```

## 8. Migración SQL
Archivo completo en: `backend/supabase/migrations/001_initial_schema.sql`
Incluye: CREATE TABLE (16 tablas), índices (28), RLS (14 políticas + ALTER TABLE), triggers updated_at (11).
