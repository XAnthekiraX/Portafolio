-- ============================================================
-- Portfolio — Seed Data
-- ============================================================
-- NOTA: Este seed asume que ya existe un usuario en auth.users.
-- Reemplaza el UUID con el ID real del usuario de Supabase Auth.
-- ============================================================
-- ============================================================
-- Profile inicial
-- ============================================================
INSERT INTO profiles (
        id,
        first_name,
        last_name,
        title,
        description,
        location,
        experience_years,
        is_available,
        email
    )
VALUES (
        'REPLACE_WITH_AUTH_USER_UUID',
        'Anthony',
        'Bonilla',
        'Desarrollador Full Stack — AI Native Development',
        $$Desarrollador Full Stack orientado al desarrollo de software mediante metodologías AI Native Development,
        especializado en el diseño y construcción de aplicaciones web modernas,
        escalables y mantenibles.Experiencia en el desarrollo de arquitecturas frontend y backend,
        automatización de procesos con inteligencia artificial y creación de flujos de trabajo asistidos por agentes de IA para acelerar el ciclo de desarrollo.Enfocado en la implementación de interfaces de usuario con una sólida experiencia en React,
        TypeScript y Tailwind CSS,
        junto con el desarrollo de APIs robustas utilizando Node.js,
        Express o Fastify y bases de datos relacionales como PostgreSQL.Interés constante en la optimización del rendimiento,
        la calidad del código y la documentación técnica para facilitar el mantenimiento y la colaboración.Capacidad para transformar requerimientos de negocio en soluciones tecnológicas,
        diseñar arquitecturas modulares y desarrollar productos con un enfoque en experiencia de usuario,
        escalabilidad y buenas prácticas de ingeniería de software.Comprometido con el aprendizaje continuo y la adopción de nuevas tecnologías relacionadas con inteligencia artificial,
        automatización y desarrollo de software.$$,
        'Sin especificar',
        0,
        true,
        'anthony@ejemplo.com'
    ) ON CONFLICT (id) DO NOTHING;
-- ============================================================
-- Skill Categories
-- ============================================================
INSERT INTO skill_categories (name, icon, display_order)
VALUES ('Frontend', 'Code2', 1),
    ('Backend', 'Server', 2),
    ('Database', 'Database', 3),
    ('DevOps', 'Cloud', 4),
    ('Design', 'Palette', 5) ON CONFLICT (name) DO NOTHING;
-- ============================================================
-- Skill Technologies
-- ============================================================
-- Frontend
INSERT INTO skill_technologies (skill_category_id, name, display_order)
SELECT id,
    'React',
    1
FROM skill_categories
WHERE name = 'Frontend';
INSERT INTO skill_technologies (skill_category_id, name, display_order)
SELECT id,
    'TypeScript',
    2
FROM skill_categories
WHERE name = 'Frontend';
INSERT INTO skill_technologies (skill_category_id, name, display_order)
SELECT id,
    'Next.js',
    3
FROM skill_categories
WHERE name = 'Frontend';
INSERT INTO skill_technologies (skill_category_id, name, display_order)
SELECT id,
    'Tailwind CSS',
    4
FROM skill_categories
WHERE name = 'Frontend';
-- Backend
INSERT INTO skill_technologies (skill_category_id, name, display_order)
SELECT id,
    'Node.js',
    1
FROM skill_categories
WHERE name = 'Backend';
INSERT INTO skill_technologies (skill_category_id, name, display_order)
SELECT id,
    'Python',
    2
FROM skill_categories
WHERE name = 'Backend';
INSERT INTO skill_technologies (skill_category_id, name, display_order)
SELECT id,
    'PostgreSQL',
    3
FROM skill_categories
WHERE name = 'Backend';
-- Database
INSERT INTO skill_technologies (skill_category_id, name, display_order)
SELECT id,
    'PostgreSQL',
    1
FROM skill_categories
WHERE name = 'Database';
INSERT INTO skill_technologies (skill_category_id, name, display_order)
SELECT id,
    'MongoDB',
    2
FROM skill_categories
WHERE name = 'Database';
INSERT INTO skill_technologies (skill_category_id, name, display_order)
SELECT id,
    'Redis',
    3
FROM skill_categories
WHERE name = 'Database';
-- DevOps
INSERT INTO skill_technologies (skill_category_id, name, display_order)
SELECT id,
    'Docker',
    1
FROM skill_categories
WHERE name = 'DevOps';
INSERT INTO skill_technologies (skill_category_id, name, display_order)
SELECT id,
    'AWS',
    2
FROM skill_categories
WHERE name = 'DevOps';
INSERT INTO skill_technologies (skill_category_id, name, display_order)
SELECT id,
    'CI/CD',
    3
FROM skill_categories
WHERE name = 'DevOps';
-- Design
INSERT INTO skill_technologies (skill_category_id, name, display_order)
SELECT id,
    'Figma',
    1
FROM skill_categories
WHERE name = 'Design';
INSERT INTO skill_technologies (skill_category_id, name, display_order)
SELECT id,
    'UI/UX',
    2
FROM skill_categories
WHERE name = 'Design';
-- ============================================================
-- Technologies (catálogo global)
-- ============================================================
INSERT INTO technologies (name, icon)
VALUES ('React', 'ReactIcon'),
    ('TypeScript', 'FileType'),
    ('Next.js', 'FileText'),
    ('Tailwind CSS', 'Palette'),
    ('Node.js', 'Server'),
    ('Python', 'Terminal'),
    ('PostgreSQL', 'Database'),
    ('MongoDB', 'Database'),
    ('Redis', 'Database'),
    ('Docker', 'Container'),
    ('AWS', 'Cloud'),
    ('Figma', 'PenTool') ON CONFLICT (name) DO NOTHING;
-- ============================================================
-- Services
-- ============================================================
INSERT INTO services (title, description, icon, status, display_order)
VALUES (
        'Web Development',
        'Desarrollo de aplicaciones web modernas con React, Next.js y Node.js.',
        'Globe',
        'popular',
        1
    ),
    (
        'UI/UX Design',
        'Diseño de interfaces centradas en el usuario con Figma.',
        'Palette',
        'available',
        2
    ),
    (
        'API Design',
        'Creación de APIs RESTful robustas y escalables.',
        'Server',
        'available',
        3
    ),
    (
        'Consulting',
        'Consultoría técnica para proyectos digitales.',
        'Lightbulb',
        'ondemand',
        4
    ) ON CONFLICT DO NOTHING;