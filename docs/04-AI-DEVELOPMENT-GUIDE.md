# 04-AI-DEVELOPMENT-GUIDE.md — Anthekira.dev

## 1. Propósito
Reglas para agentes IA que implementen código en Anthekira.dev. La documentación es la única fuente de verdad.

## 2. Stack Aprobado
| Capa | Tecnología |
|---|---|
| Frontend | Next.js (App Router) + TypeScript + Tailwind CSS |
| Backend | Next.js API Routes |
| DB | PostgreSQL via Supabase |
| ORM | @supabase/ssr + @supabase/supabase-js |
| Storage | Supabase Storage |
| Auth | Supabase Auth (email + password, JWT) |
| i18n | next-intl (ES, EN, PT) |
| Traducción | DeepL API |
| Analytics | Google Analytics GA4 |
| Deploy | Vercel |

## 3. Reglas Fundamentales
**No asumir, no inventar:** Si no está en la documentación, no existe.  
**Una tarea a la vez:** Cada tarea debe completarse y validarse antes de continuar.  
**Divide y vencerás:** Funcionalidades complejas → tareas pequeñas y verificables.  
**Pregunta ante la duda:** No tomes decisiones no documentadas.  
**Alineación con docs:** Desviaciones deben ser consultadas y aprobadas.

## 4. Convenciones de Código
**Idioma:** Todo en inglés (variables, funciones, componentes, archivos, commits).  
**Excepciones:** Archivos de traducción (locales/*.json) y strings de UI (via next-intl).  
**TypeScript:** Modo estricto. Prohibido `any`. Preferir `interface` sobre `type`.  
**Componentes:** Server Component por defecto. `'use client'` solo cuando sea necesaria interactividad.  
**Naming:** Archivos `kebab-case`, componentes `PascalCase`, funciones `camelCase`, constantes `UPPER_SNAKE_CASE`.  
**Estilos:** Tailwind CSS exclusivamente. Sin CSS modules ni styled-components. Modo oscuro único (sin clases `dark:`).

## 5. Flujo de Trabajo
```
1. LEER → 2. PLANIFICAR → 3. IMPLEMENTAR (un archivo a la vez)
4. VALIDAR (tsc --noEmit) → 5. REPETIR
```

## 6. Orden de Precedencia de Docs
1. `02-DECISIONS.md` (ADRs)
2. `00-REQUIREMENTS.md`
3. `01-ARCHITECTURE.md`
4. `03-USER-FLOWS.md`
5. `frontend/docs/*.md`
6. `backend/docs/*.md`
7. `04-AI-DEVELOPMENT-GUIDE.md`

## 7. Restricciones Técnicas
- Minimizar dependencias. Prohibido agregar sin justificación.
- Sin sobreingeniería (no CQRS, Event Sourcing, microservicios para un portafolio).
- API Routes compatibles con Serverless Functions (sin estado, timeout 10s plan Hobby).
- Variables sensibles (`SUPABASE_SERVICE_ROLE_KEY`, `DEEPL_API_KEY`) nunca expuestas al cliente.
- Toda página pública debe tener metadatos SEO (title, description, OG).
- Imágenes con `width`, `height`, `alt`. Google Analytics asíncrono.
- Modo oscuro único. No usar clases `dark:`.
- Accesibilidad V1: HTML semántico, headings jerárquicos, contraste ≥ 4.5:1, labels en formularios.
