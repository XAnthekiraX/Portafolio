# 02-DECISIONS.md — Anthekira.dev — Registro de Decisiones Técnicas

## 1. Propósito

Este documento registra todas las decisiones técnicas tomadas durante el diseño y construcción de Anthekira.dev. Cada decisión (ADR — Architecture Decision Record) incluye el contexto que la motivó, la decisión tomada y las consecuencias de esa decisión.

El objetivo es mantener trazabilidad y evitar que agentes de IA reintenten decisiones ya descartadas o implementen soluciones incompatibles con la arquitectura definida.

---

## [ADR-001] Monorepo Next.js (Frontend + Backend unificados)

| Campo | Valor |
|---|---|
| **ID** | ADR-001 |
| **Fecha** | 2025-06-03 |
| **Estado** | Aceptada |

### Contexto
- El proyecto necesita un frontend (Landing Page + Admin Panel) y un backend (API REST)
- Se busca simplicidad operativa, bajo costo y facilidad de despliegue
- Existen dos opciones: backend separado (Node/Express o Spring Boot) o unificado en Next.js (API Routes)

### Decisión
**Usar Next.js con App Router unificando frontend y backend en un mismo monorepo.** Las API Routes de Next.js actuarán como backend. No se usará un servidor backend separado.

### Consecuencias
- **Positivo:** Despliegue único en Vercel, menor complejidad operativa, menor costo
- **Positivo:** Tipo compartidos entre frontend y backend (mismo repositorio)
- **Positivo:** Facilita el desarrollo AI Native (un solo proyecto para los agentes)
- **Negativo:** Las API Routes de Next.js tienen limitaciones (no WebSockets, no long-running processes)
- **Negativo:** Si el proyecto escala, puede ser necesario separar backend

---

## [ADR-002] Supabase como plataforma de datos (PostgreSQL + Storage + Auth)

| Campo | Valor |
|---|---|
| **ID** | ADR-002 |
| **Fecha** | 2025-06-03 |
| **Estado** | Aceptada |

### Contexto
- El proyecto requiere base de datos relacional (PostgreSQL), almacenamiento de archivos (imágenes, CV) y autenticación
- Se valora la simplicidad operativa y el bajo costo
- Alternativas consideradas: AWS (RDS + S3 + Cognito), Firebase, PlanetScale + Cloudinary

### Decisión
**Usar Supabase como plataforma unificada que proporciona PostgreSQL, Storage y Auth.** Una sola plataforma cubre todas las necesidades de datos del proyecto.

### Consecuencias
- **Positivo:** Una sola integración (SDK `@supabase/supabase-js`) para DB, Storage y Auth
- **Positivo:** Plan free generoso (500 MB DB, 1 GB Storage, 50,000 usuarios)
- **Positivo:** RLS (Row Level Security) nativo para control de acceso a nivel de BD
- **Negativo:** Vendor lock-in parcial (migrar fuera de Supabase requiere reescribir capa de datos)
- **Negativo:** Dependencia de la disponibilidad del servicio Supabase

---

## [ADR-003] next-intl para internacionalización

| Campo | Valor |
|---|---|
| **ID** | ADR-003 |
| **Fecha** | 2025-06-03 |
| **Estado** | Aceptada |

### Contexto
- La Landing Page debe soportar Español, Inglés y Portugués en V1
- El panel admin no requiere i18n (solo español)
- La solución debe ser gratuita, escalable y compatible con Next.js App Router (Server Components)
- Alternativas consideradas: react-i18next, Intlayer, solución custom

### Decisión
**Usar next-intl**, la biblioteca estándar de facto para i18n en Next.js con App Router. Es gratuita, open-source, con soporte nativo para Server Components, routing localizado y TypeScript.

### Consecuencias
- **Positivo:** Integración nativa con Server Components, sin necesidad de `use client` para traducciones
- **Positivo:** Archivos JSON planos por idioma, fáciles de editar y mantener
- **Positivo:** Routing automático con prefijo de idioma (`/es`, `/en`, `/pt`)
- **Positivo:** SEO-ready (metadatos por idioma, hreflang, sitemap)
- **Negativo:** El contenido dinámico (proyectos, servicios) requiere estructura adicional en BD
- **Negativo:** next-intl es principalmente para UI estática; el contenido del CMS necesita su propia solución de traducción

---

## [ADR-004] Dark mode como único modo visual

| Campo | Valor |
|---|---|
| **ID** | ADR-004 |
| **Fecha** | 2025-06-03 |
| **Estado** | Aceptada |

### Contexto
- Se prefiere un diseño moderno, tecnológico y profesional
- El modo oscuro es la experiencia principal deseada
- No se requiere toggle claro/oscuro

### Decisión
**Implementar solo modo oscuro como experiencia única.** No se desarrollará modo claro ni toggle de cambio. Los colores base serán oscuros con la paleta definida (rojo `#DC2626`, cian `#06B6D4`, neutros oscuros).

### Consecuencias
- **Positivo:** Simplifica el desarrollo (no requiere lógica de cambio de tema, clases condicionales `dark:`)
- **Positivo:** Menos CSS, menor tamaño de bundle
- **Positivo:** Experiencia consistente para todos los usuarios
- **Negativo:** No se adapta a preferencias del usuario (system theme)
- **Negativo:** Puede no ser óptimo en entornos con mucha luz ambiental

---

## [ADR-005] Server Components para Landing Page (sin API Routes intermedias)

| Campo | Valor |
|---|---|
| **ID** | ADR-005 |
| **Fecha** | 2025-06-03 |
| **Estado** | Aceptada |

### Contexto
- La Landing Page necesita mostrar datos de la BD (proyectos, habilidades, servicios)
- En Next.js, se puede obtener datos desde Server Components de dos formas: consultando Supabase directamente o llamando a las API Routes públicas
- Llamar a las propias API Routes desde el servidor agrega un round-trip HTTP innecesario

### Decisión
**Los Server Components de la Landing Page consultan Supabase directamente** usando `@supabase/ssr`. Las API Routes públicas (`/api/public/*`) existen pero están diseñadas para consumo externo (futuras integraciones, webhooks, etc.), no para el propio frontend.

### Consecuencias
- **Positivo:** Menor latencia (consulta directa a Supabase sin hop intermedio)
- **Positivo:** Menor carga en las API Routes (solo tráfico externo)
- **Positivo:** Server Components generan HTML completo en servidor (mejor SEO)
- **Negativo:** Lógica de acceso a datos ligeramente distribuida (Server Components + API Routes)
- **Negativo:** Las API Routes públicas tienen menos uso del esperado inicialmente

---

## [ADR-006] Auto-traducción con DeepL + tablas de traducción

| Campo | Valor |
|---|---|
| **ID** | ADR-006 |
| **Fecha** | 2025-06-03 |
| **Estado** | Aceptada |

### Contexto
- Las entidades del CMS (proyectos, servicios) contienen texto traducible (título, descripción)
- Se necesita soporte para 3 idiomas en V1, con posibilidad de agregar más
- El usuario escribe el contenido una sola vez en español (idioma fuente)
- Se desea evitar la traducción manual a EN y PT
- Opciones consideradas: traducción on-the-fly con hook cliente, traducción manual, auto-traducción al guardar

### Decisión
**Enfoque híbrido: auto-traducción al guardar + almacenamiento en BD.**

El administrador escribe el contenido en español. Al guardar, el backend envía el texto a la **API de DeepL** (plan gratuito: 500K caracteres/mes) y genera automáticamente las traducciones a EN y PT. Estas se almacenan en **tablas de traducción independientes** (`project_translations`, `service_translations`, `saas_project_translations`, `personal_info_translations`) con estructura `{ resource_id, locale, field, value }`.

Las traducciones se sirven desde la BD en cada solicitud, sin llamar a DeepL en cada visita.

### Consecuencias
- **Positivo:** El usuario escribe una vez, las traducciones se generan solas
- **Positivo:** Las traducciones existen en BD → SEO perfecto (Google indexa EN y PT)
- **Positivo:** Sin latencia en la Landing Page (no se llama API externa al cargar)
- **Positivo:** DeepL free tier (500K chars/mes) suficiente para un portafolio
- **Positivo:** El usuario puede editar manualmente cualquier traducción si algo no suena natural
- **Negativo:** Dependencia de DeepL API al guardar contenido (si DeepL falla, las traducciones no se generan)
- **Negativo:** Las tablas de traducción requieren JOINs en consultas

---

## [ADR-007] Contenido estructurado sin WYSIWYG ni Markdown

| Campo | Valor |
|---|---|
| **ID** | ADR-007 |
| **Fecha** | 2025-06-03 |
| **Estado** | Aceptada |

### Contexto
- El CMS debe permitir al administrador gestionar el contenido de la Landing Page
- Alternativas: editor visual WYSIWYG, editor Markdown, o formularios con campos estructurados
- El administrador es el único usuario del CMS (técnico, familiarizado con el sistema)

### Decisión
**Usar formularios con campos estructurados** (inputs, textareas, selects, checkboxes) para cada tipo de contenido. Sin editor WYSIWYG ni soporte Markdown en V1. La información se almacena en campos específicos de la BD.

### Consecuencias
- **Positivo:** Interfaz simple, rápida y predecible
- **Positivo:** Datos limpios y estructurados en la BD (sin HTML ni Markdown embebido)
- **Positivo:** Fácil de implementar y mantener
- **Negativo:** Menos flexibilidad para contenido enriquecido (no se pueden agregar estilos inline)
- **Negativo:** Si en el futuro se necesita contenido formateado, habrá que migrar los datos

---

## [ADR-008] Un solo administrador sin roles ni permisos

| Campo | Valor |
|---|---|
| **ID** | ADR-008 |
| **Fecha** | 2025-06-03 |
| **Estado** | Aceptada |

### Contexto
- El CMS y panel admin serán usados únicamente por el propietario del sitio
- No hay necesidad de múltiples usuarios con diferentes niveles de acceso
- Implementar un sistema de roles (admin, editor, viewer) agregaría complejidad innecesaria

### Decisión
**No implementar roles ni permisos.** El sistema tiene un único administrador con acceso completo a todas las funcionalidades del panel. La autenticación existe solo para proteger el acceso al admin.

### Consecuencias
- **Positivo:** Simplicidad máxima en la implementación
- **Positivo:** Sin lógica de autorización (solo autenticación)
- **Positivo:** Menos endpoints, menos validaciones, menos tests
- **Negativo:** No escalable para equipos multi-usuario sin refactorización

---

## [ADR-009] Google Analytics para analíticas

| Campo | Valor |
|---|---|
| **ID** | ADR-009 |
| **Fecha** | 2025-06-03 |
| **Estado** | Aceptada |

### Contexto
- El panel admin debe tener visibilidad de las analíticas del sitio
- Opciones: Google Analytics, tracking custom en BD, Plausible, Umami
- Se busca simplicidad y cero mantenimiento

### Decisión
**Usar Google Analytics** (GA4) integrado en el frontend mediante script de Google. El panel admin no muestra un dashboard interno de analíticas — en su lugar, incluye un **enlace externo** que abre Google Analytics en una nueva pestaña. No se implementa tracking custom ni se almacenan datos de visitas en BD propia.

### Consecuencias
- **Positivo:** Cero mantenimiento de infraestructura de analíticas
- **Positivo:** Dashboard completo y profesional ya incluido en Google Analytics
- **Positivo:** Sin costo adicional
- **Negativo:** Dependencia de un servicio externo
- **Negativo:** Requiere consentimiento de cookies (GDPR) si el sitio tiene tráfico europeo
- **Negativo:** El admin debe salir del panel para ver analíticas (enlace externo)

---

## [ADR-010] Vercel como plataforma de despliegue única

| Campo | Valor |
|---|---|
| **ID** | ADR-010 |
| **Fecha** | 2025-06-03 |
| **Estado** | Aceptada |

### Contexto
- Next.js es el framework elegido
- Vercel es la plataforma creada por los autores de Next.js, con integración nativa
- Alternativas: Netlify, Railway, Cloudflare Pages, AWS Amplify

### Decisión
**Desplegar todo el proyecto en Vercel** (frontend + API Routes). La base de datos y almacenamiento permanecen en Supabase (externo a Vercel). El deploy es automático desde GitHub.

### Consecuencias
- **Positivo:** Integración nativa con Next.js (build optimizado, ISR, Edge Functions)
- **Positivo:** Deploy automático desde GitHub (push a `main` → deploy)
- **Positivo:** Plan Hobby gratuito suficiente para un portafolio
- **Positivo:** Dominio personalizado, SSL automático, CDN global
- **Negativo:** Limitaciones del plan Hobby (100 builds/día, 10 GB ancho de banda, 60 requests/segundo en Serverless Functions)
- **Negativo:** Vendor lock-in con Vercel (migrar a otro hosting requeriría adaptación)

---

## 2. Dependencias con otros documentos

| Archivo | Relación |
|---|---|
| `00-REQUIREMENTS.md` | Los requisitos justifican las decisiones registradas aquí |
| `01-ARCHITECTURE.md` | La arquitectura implementa las decisiones aquí registradas |
| `04-AI-DEVELOPMENT-GUIDE.md` | Los agentes IA deben consultar este archivo antes de implementar |
| `frontend/06-UI-UX.md` | Implementa la decisión ADR-004 (dark mode) |
| `frontend/04-I18N.md` | Implementa la decisión ADR-003 (next-intl) |
| `backend/02-DATABASE.md` | Implementa la decisión ADR-006 (tablas de traducción) |
| `backend/05-AUTHENTICATION.md` | Implementa la decisión ADR-008 (sin roles) |
