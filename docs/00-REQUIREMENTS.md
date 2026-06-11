# 00-REQUIREMENTS.md — Anthekira.dev

## 1. Información del Proyecto

### 1.1 Nombre
**Anthekira.dev** — Portafolio profesional personal.

### 1.2 Propósito
Construir un portafolio personal para presentarse como desarrollador de software, con una landing page pública y un CMS integrado para administrar el contenido sin modificar código.

### 1.3 Dominio
`anthekira.dev`

### 1.4 Público Objetivo
- Potenciales clientes
- Reclutadores y empresas que buscan desarrolladores
- Posibles socios o colaboradores

### 1.5 Problema que Resuelve
- Centralizar la presencia profesional en una plataforma propia
- Mostrar proyectos, habilidades y experiencia
- Facilitar que clientes o empleadores conozcan el trabajo del propietario
- Reducir la dependencia de plataformas externas para mostrar el perfil profesional

### 1.6 Naturaleza del Proyecto
Proyecto personal y portafolio profesional. No está planteado como producto, empresa o SaaS independiente, aunque la marca podría evolucionar en el futuro.

---

## 2. Stack Tecnológico

| Capa | Tecnología | Versión / Notas |
|---|---|---|
| **Frontend** | Next.js + TypeScript + Tailwind CSS | App Router |
| **Backend** | Next.js API Routes | Mismo proyecto, rutas `/api/*` |
| **Base de datos** | PostgreSQL (Supabase) | Alojada en Supabase |
| **ORM / Cliente DB** | @supabase/supabase-js | - |
| **Almacenamiento** | Supabase Storage | Imágenes, CV, recursos multimedia |
| **Autenticación** | JWT + Refresh Tokens (Supabase Auth) | Built-in, usando `@supabase/auth-js` |
| **Internacionalización** | next-intl | ES, EN, PT. Gratuita, open-source |
| **Traducción automática** | DeepL API | Auto-traducción al guardar contenido (plan gratis: 500K chars/mes) |
| **Analíticas** | Google Analytics | Integración en el frontend |
| **Despliegue Frontend** | Vercel | - |
| **Despliegue Backend** | Vercel (API Routes) | Integrado en el mismo deploy |
| **Fuentes** | Space Grotesk + Inter (Google Fonts) | Cabeceras y cuerpo respectivamente |

---

## 3. Funcionalidades Principales

### 3.1 Landing Page Pública
- Hero con avatar ilustrado tipo anime profesional, gradientes y grid tecnológico de fondo
- Sección Sobre Mí
- Sección de Habilidades técnicas (tags por categorías)
- Sección de Tecnologías y herramientas (grid de logos)
- Sección de Proyectos destacados (grid de cards con capturas)
- Sección de Formación académica
- Sección de Servicios ofrecidos (cards con iconos)
- Sección de Metodología de trabajo y AI Native Development (contenido estático vía next-intl JSON)
- Enlaces profesionales (GitHub y otras plataformas)
- Formulario de contacto con redes sociales visibles
- Currículum vitae (CV) descargable
- Footer con información de contacto y enlaces

### 3.2 Panel Administrativo (`/admin`)
- **Dashboard** con cards de resumen (total projects, SaaS, activos, mensajes no leídos) + enlace a Google Analytics
- **CRUD de Projects** con gestión de skills vía modal y auto-traducción DeepL
- **CRUD de SaaS Projects** con modal de skills, tag input de features, y auto-traducción
- **Profile** con información personal, CV, skills management y redes sociales
- **Settings** con configuración general, tecnologías, servicios, media library y mensajes

### 3.3 CMS Integrado
- Gestión de contenido estructurado mediante formularios y campos específicos
- No requiere editor WYSIWYG ni soporte Markdown en V1
- No incluye sistema de borradores, versionado ni publicación programada
- No incluye gestión de SEO ni traducciones desde el panel admin en V1

### 3.4 Internacionalización (i18n)
- Idiomas en V1: Español, Inglés, Portugués
- Afecta únicamente al contenido público de la Landing Page
- El panel administrativo estará únicamente en español
- Arquitectura escalable para agregar nuevos idiomas sin cambios significativos
- Implementación mediante next-intl con archivos JSON de traducción

### 3.5 SEO
- Estrategia SEO desde el inicio
- Enfoque en keywords de: desarrollo web, backend, full stack, arquitectura de software, AI Native Development, automatización, SaaS
- Implementación de SEO técnico, Open Graph, Twitter Cards, sitemap XML
- Metadatos específicos para cada sección/ruta pública

### 3.6 Analíticas
- Integración con Google Analytics (GA4) en el frontend
- Seguimiento de visitas y navegación en la Landing Page
- El panel administrativo incluye un **enlace externo** que abre Google Analytics en nueva pestaña (sin dashboard interno)

---

## 4. Entidades del Sistema

| Entidad | Descripción |
|---|---|
| **User** | Administrador del sistema (único, sin roles) |
| **PersonalInfo** | Información personal y profesional (nombre, título, bio, redes, CV) |
| **Education** | Formación académica (institución, título, descripción, enlaces) |
| **Skill** | Habilidad técnica categorizada (frontend, backend, devops, tools, other) |
| **Project** | Proyecto destacado con descripción, tecnologías/skills, imágenes, enlaces |
| **SaasProject** | Proyecto SaaS con nombre, descripción, URL, features, skills |
| **Technology** | Tecnología o herramienta con icono, asociable a proyectos |
| **Service** | Servicio profesional ofrecido |
| **Media** | Archivo multimedia (imagen, documento) usado en la Landing Page |
| **ContactMessage** | Mensaje recibido desde el formulario de contacto |
| **Settings** | Configuración global del sitio (site name, descripción, GA ID) |


---

## 5. Diseño Visual

### 5.1 Estilo General
- Moderno, profesional y tecnológico
- Base minimalista enfocada en legibilidad
- Modo oscuro como experiencia principal (sin toggle claro)
- Uso ligero de glassmorphism
- Elementos futuristas sin excesos visuales

### 5.2 Paleta de Colores
- **Color principal:** Rojo `#DC2626` (energía y personalidad)
- **Color acento:** Cian `#06B6D4` (aspecto tecnológico)
- **Base:** Oscura con tonos neutros

### 5.3 Tipografía
- **Headings:** Space Grotesk (Google Fonts)
- **Body:** Inter (Google Fonts)
- **Código/Tags:** JetBrains Mono (Google Fonts, opcional)

### 5.4 Logo
- Texto estilizado con el nombre "Anthekira"
- No hay logo ni isotipo actualmente

### 5.5 Animaciones
- Moderadas: hover effects, scroll reveal, transiciones suaves, microinteracciones
- Sin animaciones excesivas que afecten rendimiento o legibilidad

---

## 6. Autenticación y Seguridad

- Autenticación mediante usuario y contraseña
- Autorización mediante JWT (JSON Web Tokens) vía Supabase Auth
- Mecanismo de refresh tokens para renovar sesiones
- Autenticación restringida al panel administrativo y endpoints privados
- Endpoints públicos de la Landing Page sin autenticación
- Sistema diseñado para un único administrador (sin roles ni permisos)

---

## 7. API

- API única con dos niveles de acceso: público (lectura) y privado (CRUD)
- Endpoints públicos: consulta de información de la Landing Page
- Endpoints privados: protegidos con JWT para operaciones de gestión
- Backend unificado (Next.js API Routes) para simplicidad y bajo costo

---

## 8. Infraestructura

| Componente | Servicio |
|---|---|
| **Frontend** | Vercel |
| **Backend** | Vercel (API Routes integradas) |
| **Base de datos** | Supabase (PostgreSQL) |
| **Almacenamiento** | Supabase Storage |
| **Analíticas** | Google Analytics |

---

## 9. Restricciones y Reglas del Proyecto

- Sin sistema de roles (solo existe el administrador)
- Sin versionado, borradores ni publicación programada
- Sin editor WYSIWYG (contenido mediante campos estructurados)
- Sin gestión de SEO desde el panel admin en V1
- Sin gestión de traducciones desde el panel admin en V1
- Sin estrategia mobile-first estricta (optimizado para escritorio, adaptado a móvil)
- Sin cumplimiento formal WCAG 2.1 AA en V1 (solo buenas prácticas básicas)

---

## 10. Plazos

- **Primera versión funcional:** ~8 días
- La velocidad de desarrollo no debe comprometer la calidad, mantenibilidad ni el rendimiento
- Se prioriza entrega rápida de un producto profesional listo para publicación

---

## 11. Convenciones de Desarrollo

- Código, documentación técnica, nombres de variables, funciones, componentes, clases y archivos en **inglés**
- Arquitectura limpia, modular y mantenible
- Principios: SOLID, KISS, DRY cuando sean aplicables
- Mínimo de dependencias externas, evitar bibliotecas pesadas o innecesarias
- Evitar sobreingeniería
- La documentación es la única fuente de verdad para la implementación

---

## 12. Dependencias con otros documentos

| Archivo | Relación |
|---|---|
| `01-ARCHITECTURE.md` | Describe la arquitectura que implementa estos requisitos |
| `02-DECISIONS.md` | Registra las decisiones técnicas que originan estos requisitos |
| `03-USER-FLOWS.md` | Describe los flujos que satisfacen estas funcionalidades |
| `04-AI-DEVELOPMENT-GUIDE.md` | Reglas para agentes IA que implementarán estos requisitos |
| `frontend/00-FRONTEND.md` | Especificaciones técnicas del frontend |
| `frontend/06-UI-UX.md` | Especificaciones detalladas de diseño visual |
| `backend/01-ENTITIES.md` | Definición detallada de las entidades listadas |
