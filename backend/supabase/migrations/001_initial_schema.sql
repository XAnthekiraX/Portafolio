-- ============================================================
-- 001_initial_schema.sql — Migración inicial de Anthekira.dev
-- ============================================================
-- Fuente: docs/backend/02-DATABASE.md (§9 Migración SQL Completa)
--
-- Plataforma: Supabase (PostgreSQL 15+)
-- Extensión obligatoria: pgcrypto (para UUIDs) — habilitada por defecto en Supabase.
--
-- Este archivo crea el esquema completo de la base de datos:
-- - 14 tablas principales
-- - 4 tablas de traducciones (modelo JSON content)
-- - 2 tablas pivote (relaciones N:M)
-- - Row Level Security (RLS) habilitado
-- - Triggers de updated_at automáticos
-- ============================================================

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

-- 4.2.1 personal_info_translations (modelo JSON content)
CREATE TABLE personal_info_translations (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  personal_info_id    UUID NOT NULL REFERENCES personal_info(id) ON DELETE CASCADE,
  locale              TEXT NOT NULL CHECK (locale IN ('en', 'pt')),
  content             JSONB NOT NULL DEFAULT '{}'::jsonb,
  translation_status  TEXT NOT NULL DEFAULT 'pending'
    CHECK (translation_status IN ('pending', 'translating', 'completed', 'failed')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (personal_info_id, locale)
);

CREATE INDEX idx_personal_info_translations_info ON personal_info_translations(personal_info_id);
CREATE INDEX idx_personal_info_translations_locale ON personal_info_translations(locale);
CREATE INDEX idx_personal_info_translations_status ON personal_info_translations(translation_status);

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

-- 4.5 project_translations (modelo JSON content)
CREATE TABLE project_translations (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id          UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  locale              TEXT NOT NULL CHECK (locale IN ('en', 'pt')),
  content             JSONB NOT NULL DEFAULT '{}'::jsonb,
  translation_status  TEXT NOT NULL DEFAULT 'pending'
    CHECK (translation_status IN ('pending', 'translating', 'completed', 'failed')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (project_id, locale)
);

CREATE INDEX idx_project_translations_project ON project_translations(project_id);
CREATE INDEX idx_project_translations_locale ON project_translations(locale);
CREATE INDEX idx_project_translations_status ON project_translations(translation_status);

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

-- 4.7.1 saas_project_translations (modelo JSON content)
CREATE TABLE saas_project_translations (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  saas_project_id     UUID NOT NULL REFERENCES saas_projects(id) ON DELETE CASCADE,
  locale              TEXT NOT NULL CHECK (locale IN ('en', 'pt')),
  content             JSONB NOT NULL DEFAULT '{}'::jsonb,
  translation_status  TEXT NOT NULL DEFAULT 'pending'
    CHECK (translation_status IN ('pending', 'translating', 'completed', 'failed')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (saas_project_id, locale)
);

CREATE INDEX idx_saas_project_translations_project ON saas_project_translations(saas_project_id);
CREATE INDEX idx_saas_project_translations_locale ON saas_project_translations(locale);
CREATE INDEX idx_saas_project_translations_status ON saas_project_translations(translation_status);

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

-- 4.12 service_translations (modelo JSON content)
CREATE TABLE service_translations (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id          UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  locale              TEXT NOT NULL CHECK (locale IN ('en', 'pt')),
  content             JSONB NOT NULL DEFAULT '{}'::jsonb,
  translation_status  TEXT NOT NULL DEFAULT 'pending'
    CHECK (translation_status IN ('pending', 'translating', 'completed', 'failed')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (service_id, locale)
);

CREATE INDEX idx_service_translations_service ON service_translations(service_id);
CREATE INDEX idx_service_translations_locale ON service_translations(locale);
CREATE INDEX idx_service_translations_status ON service_translations(translation_status);

-- 4.13 contact_messages
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
ALTER TABLE personal_info_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_project_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_project_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Políticas de SELECT público
CREATE POLICY "personal_info_select_public"
  ON personal_info FOR SELECT USING (true);

CREATE POLICY "personal_info_translations_select_public"
  ON personal_info_translations FOR SELECT USING (true);

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

CREATE TRIGGER trg_personal_info_translations_updated_at
  BEFORE UPDATE ON personal_info_translations
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
