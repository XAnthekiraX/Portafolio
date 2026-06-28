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

## ADR-019: Log Sanitization y PII Protection (GDPR)
**Estado:** Aceptada  
**Decisión:**  
1. **Logs estructurados:** Todos los logs del backend usan `console.log` / `console.error` con formato JSON (timestamp, nivel, mensaje, requestId). Sin loguear request bodies.  
2. **PII nunca en logs:** Correos electrónicos, direcciones IP completas, nombres de usuario y mensajes de contacto nunca se escriben en logs. Se reemplazan por `[REDACTED]` o un hash irreversible.  
3. **IP parcial:** Se almacena solo prefijo de IP para rate limiting (ej: `192.168.x.x`), nunca la IP completa.  
4. **GDPR consent:** Botón modal de consentimiento de cookies/analytics antes de cargar GA4. Se almacena preferencia en localStorage (`gdpr_consent: boolean`).  
5. **Contact messages:** Los datos del formulario de contacto (nombre, email, mensaje) se almacenan en BD pero no se incluyen en logs ni en backups externos. El admin puede eliminar mensajes manualmente.  
6. **Data retention:** Política de retención de 12 meses para contact_messages. No hay otros datos de usuarios que requieran limpieza.  
**Consecuencia:** Cumplimiento GDPR básico. Menos útilidad de logs para debugging, pero seguro. Sin PII en Vercel Logs Dashboard. Coste mínimo: modal de consentimiento + sanitizer wrapper.

## ADR-020: Refresh Token Rotation
**Estado:** Aceptada  
**Decisión:** Se habilita refresh token rotation en el cliente Supabase admin (`@supabase/ssr`). Cada vez que se usa un refresh token, se invalida el anterior y se emite uno nuevo. Configuración: `supabase.auth.setSession({ ... })` con `refreshInterval: true` (por defecto en @supabase/ssr v1+).  
**Consecuencia:** Si un refresh token es robado, solo es válido para un uso. El token anterior queda invalidado. Previene session fixation y replay attacks. Sin cambios en el middleware ni en los route handlers. Sin sobrecarga de implementación porque @supabase/ssr lo maneja automáticamente.

## ADR-021: Component Size Limits y Split Patterns
**Estado:** Aceptada  
**Decisión:**  
1. **Límite duro de 300 líneas por archivo de componente** (medido sin imports/export de tipos). Componentes que excedan deben dividirse en subcomponentes más pequeños.  
2. **Límite suave de 200 líneas** para componentes de administración.  
3. **Patrones de split obligatorios:**  
   - `Component.tsx` → `Component/` con `index.tsx` (main), `Header.tsx`, `Form.tsx`, `List.tsx`, etc.  
   - Extraer lógica de negocio a hooks (`use{Feature}.ts`)  
   - Extraer lógica de estado a utilidades separadas  
4. **Excepción:** Componentes de landing page con contenido principalmente JSX estático pueden llegar a 400 líneas si la división no aporta valor semántico.  
5. **Regla de composición:** Si un componente tiene más de 5 props o maneja más de 3 estados internos, debe dividirse.  
**Consecuencia:** Componentes mantenibles y testeables. Mayor cantidad de archivos pero menor complejidad por archivo. Prevención de deuda técnica por componentes monolíticos.

## ADR-022: State Management Consistente
**Estado:** Aceptada  
**Decisión:**  
1. **Sin estado global:** No hay Redux, Zustand, ni Context global. El estado se maneja localmente donde se necesita.  
2. **Server Components** para todo dato que viene de BD en la landing page. Sin estado cliente para datos públicos.  
3. **Client Components** usan hooks de React (useState, useReducer) para estado local del componente. Para estado compartido entre componentes cercanos, se usa prop drilling (máximo 2 niveles de profundidad).  
4. **Custom hooks** encapsulan lógica de estado reutilizable: `useAuth()` (sesión admin), `useForm()` (formularios), `useTranslations()` (traducciones dinámicas).  
5. **Fetch en admin:** Cada página CRUD usa un custom hook `useResource(resource)` que encapsula fetch states (loading, error, data, refetch). No hay caché cliente — se refetch al navegar.  
6. **Excepción:** El auth state del admin (sesión) se comparte via React Context en AdminLayout para evitar re-fetch en cada navegación SPA. Scope: solo `AdminLayout`.  
7. **Prohibido:** useContext para estado de formularios, props en componentes no relacionados, estado global para datos de BD.  
**Consecuencia:** Arquitectura predecible y fácil de debuggear. Mínimo overhead de estado. Cada componente es autónomo. Sin bugs de estado fantasma.

## ADR-023: Testing Strategy y Coverage
**Estado:** Aceptada  
**Decisión:**  
1. **Framework:** Vitest + Testing Library (@testing-library/react). Vitest es compatible nativo con Vite/Next.js y más rápido que Jest.  
2. **Coverage targets:**  
   - Shared (validators, utils, types): ≥ 95%  
   - Backend services: ≥ 85%  
   - Frontend components: ≥ 70%  
   - API Route handlers: ≥ 75%  
   - **Global mínimo: 80%** (líneas)  
3. **Tipos de tests requeridos:**  
   - **Unitarios:** Cada servicio backend, cada validador Zod, cada utility function.  
   - **Integración:** Cada API Route handler (con mock de Supabase), cada componente con interacción (formularios, modales).  
   - **Sin E2E en V1** (se consideran para V2 si hay presupuesto).  
4. **Ubicación:** Tests junto al archivo que prueban: `{file}.test.ts` en el mismo directorio.  
5. **Mock de Supabase:** Usar `vi.mock('@supabase/ssr')` y factory functions `createMockSupabaseClient()` en `shared/src/test-utils/mocks.ts`.  
6. **Test de componentes:** Preferir `render()` + `screen.getBy*` + `userEvent` de Testing Library. Sin snapshot tests.  
7. **CI:** Los tests se ejecutan en cada PR vía GitHub Actions. El PR no se mergea si baja el coverage global.  
8. **Prioridad V1:** Validators y servicios backend primero. Luego componentes críticos (Contact, CRUD forms).  
**Consecuencia:** Calidad garantizada. Refactors seguros. Coverage mínimo evita deuda técnica. ~2x tiempo de desarrollo inicial pero ~10x menos bugs en producción.
