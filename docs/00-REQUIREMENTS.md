# 00-REQUIREMENTS.md — Anthekira.dev

## 1. Proyecto
**Nombre:** Anthekira.dev — Portafolio profesional personal.  
**Dominio:** anthekira.dev  
**Propósito:** Landing page pública + CMS para administrar contenido sin modificar código.  
**Público:** Clientes, reclutadores, colaboradores.

## 2. Stack
| Capa | Tecnología |
|---|---|
| Frontend | Next.js + TypeScript + Tailwind CSS (App Router) |
| Backend | Next.js API Routes (mismo proyecto) |
| DB | PostgreSQL (Supabase) |
| ORM | @supabase/supabase-js + @supabase/ssr |
| Storage | Supabase Storage |
| Auth | Supabase Auth (JWT + refresh tokens) |
| i18n | next-intl (ES, EN, PT) |
| Traducción auto | DeepL API (free: 500K chars/mes) |
| Analytics | Google Analytics GA4 |
| Deploy | Vercel |
| Fuentes | Space Grotesk (headings) + Inter (body) |

## 3. Funcionalidades
**Landing Page:** Hero con avatar, Sobre Mí, Skills, Technologies, Projects, Services, Contacto, CV descargable, Footer.  
**Panel Admin (/admin):** Dashboard (cards resumen + link GA), CRUD Projects/SaaS/Skills/Education/Technologies/Services, Profile (info personal + CV + redes).  
**CMS:** Contenido estructurado (sin WYSIWYG). Auto-traducción DeepL al guardar. Sin borradores/versionado.  
**i18n:** ES (default), EN, PT. Solo Landing Page. Admin solo en español.  
**SEO:** Técnico: OG, Twitter Cards, sitemap XML, metadatos por ruta. Keywords: desarrollo web, full-stack, AI Native, SaaS.  
**Analytics:** GA4 en Landing Page. Dashboard muestra enlace externo a GA.

## 4. Entidades
User, PersonalInfo, Education, Skill, Project (unifica Project + SaasProject mediante campo `type`), Technology, Service, ContactMessage.

> **Nota:** Se eliminó SaasProject como entidad separada. Los proyectos SaaS se representan con `type: 'saas'` en la tabla `projects`. Las traducciones usan una tabla genérica `entity_translations` en lugar de tablas separadas por entidad.

## 5. Diseño
**Estilo:** Moderno, minimalista, modo oscuro único. Glassmorphism sutil.  
**Colores:** Rojo #DC2626 (principal), Cian #06B6D4 (acento), fondo oscuro #18181B.  
**Animaciones:** Moderadas — hover, scroll reveal, transiciones suaves.

## 6. Autenticación y Seguridad
Email + password via Supabase Auth. JWT + refresh tokens. Único administrador (sin roles). Endpoints públicos sin auth.

## 7. Infraestructura
| Componente | Servicio |
|---|---|
| Frontend + Backend | Vercel |
| DB + Storage + Auth | Supabase |
| Analytics | Google Analytics |

## 8. Restricciones V1
Sin roles, sin borradores/versionado, sin WYSIWYG, sin SEO desde admin, sin gestión de traducciones desde admin, sin modo claro, sin WCAG formal.

## 9. Convenciones
Código en inglés. Documentación en español (docs/). Principios: SOLID, KISS, DRY. Mínimo de dependencias. Documentación = única fuente de verdad.
