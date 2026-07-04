-- ============================================================
-- Portfolio — Row-Level Security (RLS)
-- PostgreSQL + Supabase
-- ============================================================
-- Políticas:
--   anon           → SELECT en tablas públicas
--   anon           → INSERT en contact_messages
--   authenticated  → ALL (INSERT, UPDATE, DELETE, SELECT) en admin
--   authenticated  → profiles usa auth.uid() = id (solo dueño)
-- ============================================================

-- ============================================================
-- Habilitar RLS en todas las tablas
-- ============================================================
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

-- ============================================================
-- Políticas públicas (rol: anon)
-- ============================================================

-- profiles: cualquiera puede leer el perfil público
CREATE POLICY "public_select_profiles" ON profiles
    FOR SELECT USING (true);

-- social_links: cualquiera puede leer los enlaces sociales
CREATE POLICY "public_select_social_links" ON social_links
    FOR SELECT USING (true);

-- skill_categories: cualquiera puede leer categorías
CREATE POLICY "public_select_skill_categories" ON skill_categories
    FOR SELECT USING (true);

-- skill_technologies: cualquiera puede leer tecnologías de skills
CREATE POLICY "public_select_skill_technologies" ON skill_technologies
    FOR SELECT USING (true);

-- technologies: cualquiera puede leer el catálogo
CREATE POLICY "public_select_technologies" ON technologies
    FOR SELECT USING (true);

-- projects: solo los publicados son visibles
CREATE POLICY "public_select_projects" ON projects
    FOR SELECT USING (status = 'published');

-- project_technologies: cualquiera puede leer (filtro implícito por projects)
CREATE POLICY "public_select_project_technologies" ON project_technologies
    FOR SELECT USING (true);

-- education_items: solo formación académica visible
CREATE POLICY "public_select_education" ON education_items
    FOR SELECT USING (type = 'academic');

-- services: cualquiera puede leer servicios
CREATE POLICY "public_select_services" ON services
    FOR SELECT USING (true);

-- contact_messages: cualquiera puede INSERTAR un mensaje
CREATE POLICY "public_insert_contact" ON contact_messages
    FOR INSERT WITH CHECK (true);

-- ============================================================
-- Políticas privadas (rol: authenticated)
-- ============================================================

-- profiles: solo el dueño (auth.uid() = id) puede modificar
CREATE POLICY "admin_all_profiles" ON profiles
    FOR ALL USING (auth.uid() = id);

-- social_links: cualquier authenticated puede CRUD
CREATE POLICY "admin_all_social_links" ON social_links
    FOR ALL USING (auth.role() = 'authenticated');

-- skill_categories: cualquier authenticated puede CRUD
CREATE POLICY "admin_all_skill_categories" ON skill_categories
    FOR ALL USING (auth.role() = 'authenticated');

-- skill_technologies: cualquier authenticated puede CRUD
CREATE POLICY "admin_all_skill_technologies" ON skill_technologies
    FOR ALL USING (auth.role() = 'authenticated');

-- technologies: cualquier authenticated puede CRUD
CREATE POLICY "admin_all_technologies" ON technologies
    FOR ALL USING (auth.role() = 'authenticated');

-- projects: cualquier authenticated puede CRUD (todos los status)
CREATE POLICY "admin_all_projects" ON projects
    FOR ALL USING (auth.role() = 'authenticated');

-- project_technologies: cualquier authenticated puede CRUD
CREATE POLICY "admin_all_project_technologies" ON project_technologies
    FOR ALL USING (auth.role() = 'authenticated');

-- education_items: cualquier authenticated puede CRUD
CREATE POLICY "admin_all_education" ON education_items
    FOR ALL USING (auth.role() = 'authenticated');

-- services: cualquier authenticated puede CRUD
CREATE POLICY "admin_all_services" ON services
    FOR ALL USING (auth.role() = 'authenticated');

-- contact_messages: cualquier authenticated puede leer/gestionar
CREATE POLICY "admin_all_contact_messages" ON contact_messages
    FOR ALL USING (auth.role() = 'authenticated');
