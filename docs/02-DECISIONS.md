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

## ADR-006: Auto-traducción DeepL + tabla genérica de traducciones
**Estado:** Aceptada  
**Decisión:** Al guardar contenido, backend llama a DeepL en paralelo (Promise.all) y almacena traducciones en una tabla genérica `entity_translations`. La traducción se completa antes de responder al cliente.  
**Consecuencia:** El usuario escribe una vez. SEO multilingüe. Dependencia de DeepL al guardar. Sin riesgo de pérdida por serverless termination.

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

## ADR-011: Unificación Projects/SaaS
**Estado:** Aceptada  
**Decisión:** Projects y SaaS Projects se unifican en una sola tabla `projects` con campo `type: 'project' | 'saas'`. Se eliminan las tablas `saas_projects`, `saas_project_translations`, `saas_project_skills`.  
**Consecuencia:** Elimina ~30% del código backend y frontend. Tablas pivote N:M unificadas. La entidad SaaS usa `features` (JSONB) como campo adicional.

## ADR-012: Tabla Genérica de Traducciones
**Estado:** Aceptada  
**Decisión:** Las 4 tablas de traducción (`personal_info_translations`, `project_translations`, `saas_project_translations`, `service_translations`) se reemplazan por una única `entity_translations` con `entity_type` + `entity_id`.  
**Consecuencia:** Una sola política RLS, un trigger, un servicio de traducción. Agregar traducciones a nuevas entidades no requiere crear tablas.

## ADR-013: CRUD Genérico Backend
**Estado:** Aceptada  
**Decisión:** Se implementa `createCrudService<T>(table, config)` y `createCrudHandler(service)` para eliminar boilerplate. Los handlers específicos solo existen cuando hay lógica adicional (auto-traducción, slugs).  
**Consecuencia:** ~70% menos código repetitivo. Nuevos recursos requieren solo una configuración.

## ADR-014: CRUD Genérico Frontend (Admin)
**Estado:** Aceptada  
**Decisión:** Las 21 páginas admin CRUD se reemplazan por componentes genéricos `ResourcePage`, `GenericForm`, y `GenericDataTable` parametrizables por configuración.  
**Consecuencia:** De 21 páginas a ~7 archivos de configuración. Cambios de UI se aplican globalmente.

## ADR-015: Rate Limiting
**Estado:** Aceptada  
**Decisión:** Se implementa rate limiting en `/api/private/admin/login` (5 intentos/minuto) y `/api/public/contact` (3 requests/hora por IP). Uso de Upstash Redis o Vercel KV.  
**Consecuencia:** Protección contra fuerza bruta y spam. Dependencia externa mínima.

## ADR-016: CSRF Protection
**Estado:** Aceptada  
**Decisión:** Las rutas `/api/private/*` requieren header `X-CSRF-Token` validado contra una cookie httpOnly con mismo valor (double submit cookie pattern).  
**Consecuencia:** Protección contra ataques CSRF sin estado en servidor.

## ADR-017: Traducción Síncrona y Paralela
**Estado:** Aceptada  
**Decisión:** DeepL se llama con `Promise.all` para EN y PT en paralelo. La operación completa (DB write + traducción) se ejecuta antes de responder al cliente. Timeout de 8s por llamada.  
**Consecuencia:** Mitad de latencia que la versión secuencial. Sin riesgo de pérdida por serverless timeout. El cliente sabe el resultado final.

## ADR-018: Error Boundaries en Landing Page
**Estado:** Aceptada  
**Decisión:** Cada segmento de ruta pública exporta `error.tsx` y `loading.tsx`. Los Server Component fallback a un estado de error amigable en lugar de crash 500.  
**Consecuencia:** Mejor UX ante fallos de infraestructura. Degradación graceful.
