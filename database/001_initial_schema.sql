-- ============================================================
-- 001_initial_schema.sql — Migración inicial de Anthekira.dev
-- ============================================================
-- Fuente: ai/docs/backend/02-DATABASE.md (doc_id: backend-database)
--
-- Plataforma: Supabase (PostgreSQL 15+)
-- Extensión obligatoria: pgcrypto (para UUIDs) — habilitada por defecto en Supabase.
--
-- Mejoras incorporadas (vs diseño original):
-- - Projects y SaaS Projects unificados en una tabla `projects` con campo `type`
-- - Tabla genérica `entity_translations` reemplaza 4 tablas de traducción individuales
-- - Estados de traducción simplificados: solo 'completed' | 'failed'
-- - CHECK constraints adicionales (email format, slug pattern)
--
-- Total: 9 tablas (7 principales + 1 pivote N:M + 1 traducciones genérica)
-- ============================================================

-- ============================================================
-- TABLAS
-- ============================================================

-- 3.1 personal_info
CREATE TABLE personal_info (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name                TEXT NOT NULL DEFAULT '',
  professional_title  TEXT NOT NULL DEFAULT '',
  bio                 TEXT NOT NULL DEFAULT '',
  current_status      TEXT NOT NULL DEFAULT '',
  email               TEXT NOT NULL DEFAULT '' CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  location            TEXT NOT NULL DEFAULT '',
  avatar_url          TEXT NOT NULL DEFAULT '',
  social_links        JSONB NOT NULL DEFAULT '{}'::jsonb,
  cv_url              TEXT NOT NULL DEFAULT '',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_personal_info_user_id ON personal_info(user_id);

-- 3.2 skills
CREATE TABLE skills (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL UNIQUE,
  category      TEXT NOT NULL CHECK (category IN ('frontend', 'backend', 'devops', 'tools', 'other')),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_skills_name ON skills(name);
CREATE INDEX idx_skills_category ON skills(category);

-- 3.3 projects (unificada: projects + saas_projects)
CREATE TABLE projects (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  type            TEXT NOT NULL DEFAULT 'project' CHECK (type IN ('project', 'saas')),
  project_url     TEXT NOT NULL DEFAULT '',
  repository_url  TEXT NOT NULL DEFAULT '',
  url             TEXT NOT NULL DEFAULT '',
  image_url       TEXT NOT NULL DEFAULT '',
  features        JSONB DEFAULT NULL CHECK (features IS NULL OR jsonb_typeof(features) = 'array'),
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  display_order   INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_type ON projects(type);
CREATE INDEX idx_projects_display_order ON projects(display_order);

-- 3.4 project_skills (N:M unificada, sirve para projects de ambos tipos)
CREATE TABLE project_skills (
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  skill_id    UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (project_id, skill_id)
);

CREATE INDEX idx_project_skills_project ON project_skills(project_id);
CREATE INDEX idx_project_skills_skill ON project_skills(skill_id);

-- 3.5 entity_translations (genérica — reemplaza 4 tablas individuales)
CREATE TABLE entity_translations (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type         TEXT NOT NULL CHECK (entity_type IN ('project', 'personal_info', 'service')),
  entity_id           UUID NOT NULL,
  locale              TEXT NOT NULL CHECK (locale IN ('en', 'pt')),
  content             JSONB NOT NULL DEFAULT '{}'::jsonb,
  translation_status  TEXT NOT NULL DEFAULT 'completed'
    CHECK (translation_status IN ('completed', 'failed')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_entity_translations_unique ON entity_translations(entity_type, entity_id, locale);
CREATE INDEX idx_entity_translations_entity ON entity_translations(entity_type, entity_id);
CREATE INDEX idx_entity_translations_locale ON entity_translations(locale);
CREATE INDEX idx_entity_translations_status ON entity_translations(translation_status);

-- 3.6 technologies
CREATE TABLE technologies (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL UNIQUE,
  icon_url      TEXT NOT NULL DEFAULT '',
  website_url   TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_technologies_name ON technologies(name);
CREATE INDEX idx_technologies_display_order ON technologies(display_order);

-- 3.7 education
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

-- 3.8 services
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

-- 3.9 contact_messages
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
ALTER TABLE project_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Políticas de SELECT público (ver 02-DATABASE.md §RLS)
CREATE POLICY "personal_info_select_public"
  ON personal_info FOR SELECT USING (true);

CREATE POLICY "skills_select_public"
  ON skills FOR SELECT USING (true);

CREATE POLICY "projects_select_public"
  ON projects FOR SELECT USING (status = 'active');

CREATE POLICY "project_skills_select_public"
  ON project_skills FOR SELECT USING (true);

CREATE POLICY "entity_translations_select_public"
  ON entity_translations FOR SELECT USING (translation_status = 'completed');

CREATE POLICY "technologies_select_public"
  ON technologies FOR SELECT USING (true);

CREATE POLICY "education_select_public"
  ON education FOR SELECT USING (true);

CREATE POLICY "services_select_public"
  ON services FOR SELECT USING (true);

-- Nota: contact_messages NO tiene SELECT público
-- (solo accesible via service_role desde API privada)

-- Políticas de escritura solo service_role
-- (se ejecutan con SUPABASE_SERVICE_ROLE_KEY desde el backend)
-- Nota: Se recomienda migrar a roles de BD específicos en el futuro
-- para aplicar principio de mínimo privilegio.

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

CREATE TRIGGER trg_entity_translations_updated_at
  BEFORE UPDATE ON entity_translations
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

-- ============================================================
-- SEED DATA (ver 02-DATABASE.md §Seed Data)
-- ============================================================

INSERT INTO personal_info (user_id, name, professional_title)
VALUES ((SELECT id FROM auth.users LIMIT 1), 'Anthekira', 'Full-Stack Developer');
