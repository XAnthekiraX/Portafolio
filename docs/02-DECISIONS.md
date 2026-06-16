# 02-DECISIONS.md — Anthekira.dev — ADRs

## ADR-001: Monorepo Next.js
**Estado:** Aceptada  
**Decisión:** Frontend + Backend en Next.js API Routes. Un solo deploy en Vercel.  
**Consecuencia:** Simplicidad operativa. Limitaciones: no WebSockets, no long-running processes.

## ADR-002: Supabase
**Estado:** Aceptada  
**Decisión:** Supabase para PostgreSQL + Storage + Auth. SDK unificado.  
**Consecuencia:** Una integración. Plan free generoso. Vendor lock-in parcial.

## ADR-003: next-intl
**Estado:** Aceptada  
**Decisión:** next-intl para i18n. Gratuito, Server Components nativo, routing localizado.  
**Consecuencia:** SEO-ready, archivos JSON planos. Contenido CMS requiere su propia solución de traducción (DeepL).

## ADR-004: Dark Mode Único
**Estado:** Aceptada  
**Decisión:** Solo modo oscuro. Sin toggle.  
**Consecuencia:** Menos CSS, menor bundle. No se adapta a preferencias del usuario.

## ADR-005: Server Components → Supabase Directo
**Estado:** Aceptada  
**Decisión:** Landing Page consulta Supabase directo (sin API Routes intermedias).  
**Consecuencia:** Menor latencia. API Routes públicas existen solo para consumo externo.

## ADR-006: Auto-traducción DeepL + tablas de traducción
**Estado:** Aceptada  
**Decisión:** Al guardar contenido, backend llama a DeepL y almacena traducciones en BD. No se traduce en cada visita.  
**Consecuencia:** El usuario escribe una vez. SEO multilingüe. Dependencia de DeepL al guardar.

## ADR-007: Contenido Estructurado (sin WYSIWYG)
**Estado:** Aceptada  
**Decisión:** Formularios con campos específicos. Sin editor visual ni Markdown.  
**Consecuencia:** Datos limpios en BD. Menos flexibilidad para contenido enriquecido.

## ADR-008: Un Solo Administrador
**Estado:** Aceptada  
**Decisión:** Sin roles ni permisos. Un único admin con acceso completo.  
**Consecuencia:** Simplicidad máxima. No escalable para multi-usuario.

## ADR-009: Google Analytics
**Estado:** Aceptada  
**Decisión:** GA4 integrado en frontend. Dashboard con enlace externo a GA.  
**Consecuencia:** Cero mantenimiento. Requiere consentimiento GDPR si aplica.

## ADR-010: Vercel
**Estado:** Aceptada  
**Decisión:** Deploy único en Vercel. Automático desde GitHub.  
**Consecuencia:** Integración nativa Next.js. Plan Hobby gratuito suficiente. Vendor lock-in.
