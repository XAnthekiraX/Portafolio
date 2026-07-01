---
doc_id: backend-overview
version: 1.0.0
last_updated: 2026-07-01
owner: Anthekira
type: configuration
dependencies: [frontend-overview, entities, database, api-public, api-private, authentication, business-logic]
tags: [backend, architecture, services, infrastructure]
ai_context:
  primary_use: Overview of backend architecture, services, and infrastructure
  key_constraints: [Next.js API Routes, Supabase, serverless, single admin]
  target_audience: Backend developers, AI agents implementing backend features
---

# Backend Overview — Anthekira.dev

## 📋 Contexto

**Propósito:** Documentación completa del backend del portafolio profesional.  
**Cuándo usarlo:** Al implementar nuevos endpoints, modificar servicios, o entender la arquitectura backend.  
**Problemas que resuelve:** Centraliza información sobre stack, estructura de servicios, logging y variables de entorno.

## 🏗️ Stack/Configuración

| Tecnología | Versión | Propósito | Restricciones |
|------------|---------|-----------|---------------|
| Next.js API Routes | 14+ | Runtime serverless en Vercel | Sin WebSockets, timeout 10s plan Hobby |
| TypeScript | 5+ | Lenguaje de programación | Modo estricto, prohibido `any` |
| PostgreSQL | 15+ | Base de datos | Via Supabase |
| @supabase/supabase-js | 2+ | ORM/Client | Junto con @supabase/ssr |
| Supabase Auth | - | Autenticación | JWT + refresh tokens |
| Supabase Storage | - | Almacenamiento | 3 buckets: profile, projects, cv |
| DeepL API | v2 | Traducción automática | Free tier: 500K chars/mes |
| Zod | 3+ | Validación de schemas | Schemas compartidos en shared/ |

## 📁 Estructura

```
backend/src/
├── services/          # Lógica de negocio — cada archivo = UNA entidad
│   ├── auth.ts              # Login + logout (solo esto, no mezcla con otras entidades)
│   ├── personal-info.ts     # Profile CRUD (merge social_links) + auto-traducción
│   ├── projects.ts          # Projects: CRUD via createCrudService + slug + traducción
│   ├── skills.ts            # Skills: CRUD via createCrudService (sin traducciones)
│   ├── technologies.ts      # Technologies: CRUD via createCrudService (sin traducciones)
│   ├── services.ts          # Services: CRUD via createCrudService + traducción
│   ├── education.ts         # Education: CRUD via createCrudService + traducción (description → EN/PT)
│   ├── translations.ts      # Retry de traducciones fallidas (solo reintento)
│   ├── contact.ts           # Messages: list, markAsRead, delete (gestión de terceros)
│   ├── stats.ts             # Dashboard counts agregados (query-only, sin escritura)
│   └── generic.ts           # createCrudService: fábrica CRUD para 5/10 servicios
├── lib/
│   ├── supabase/admin.ts    # service_role client (bypass RLS)
│   ├── auth/verify.ts       # JWT verification
│   ├── auth/csrf.ts         # CSRF token validation (stateless, double-submit)
│   ├── auth/log-sanitizer.ts # PII removal antes de escribir logs
│   ├── rate-limit.ts        # Rate limiting helper (Upstash/Vercel KV)
│   ├── generic/handler.ts   # createCrudHandler: wrapper API Route para CRUD genérico
│   ├── errors.ts            # AppError classes + handleApiError()
│   ├── upload.ts            # File validation por bucket
│   ├── storage.ts           # Supabase Storage upload helper
│   └── i18n.ts              # Locale helpers + applyTranslation()
└── docs/
```

## 🎯 Principios/Reglas

### ✅ DO (Hacer)
- Cada archivo en `services/` = UNA entidad de negocio
- Servicios que usan `createCrudService` solo definen configuración
- Helpers en `lib/` son técnicos (auth, rate-limit, errors)
- `lib/errors.ts` es el único punto de definición de errores
- Usar `createCrudService` para CRUD estándar

### ❌ DON'T (No hacer)
- Mezclar auth con projects en el mismo servicio
- Crear endpoints sin usar los helpers genéricos
- Exponer `SUPABASE_SERVICE_ROLE_KEY` al cliente
- Agregar dependencias sin justificación

## 📊 Referencias Cruzadas

| ID | Archivo | Cuándo consultar |
|----|---------|------------------|
| 01 | 01-ENTITIES.md | Interfaces, DTOs, Zod schemas |
| 02 | 02-DATABASE.md | Esquema SQL, tablas, RLS, Storage |
| 03 | 03-API-PUBLIC.md | Endpoints públicos (GET + POST contact) |
| 04 | 04-API-PRIVATE.md | Endpoints privados CRUD + auto-traducción |
| 05 | 05-AUTHENTICATION.md | Supabase Auth, JWT, cookies, middleware |
| 06 | 06-BUSINESS-LOGIC.md | DeepL, slugs, validaciones, errores |

## 🔧 Configuración

### Variables de Entorno

**Públicas (NEXT_PUBLIC_):**
- `NEXT_PUBLIC_SUPABASE_URL` — URL de Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Key anónima de Supabase
- `NEXT_PUBLIC_GA_ID` — Google Analytics ID
- `NEXT_PUBLIC_SITE_URL` — URL del sitio

**Secretas (solo server):**
- `SUPABASE_SERVICE_ROLE_KEY` — Key con permisos admin (bypass RLS)
- `DEEPL_API_KEY` — API key de DeepL para traducciones

### Endpoints Overview

| Aspecto | Público (/api/public/) | Privado (/api/private/) |
|---------|------------------------|-------------------------|
| Auth | ❌ | ✅ JWT + CSRF |
| Cliente DB | Anon + RLS | Service role (bypass) |
| Operaciones | GET (excepto POST /contact) | CRUD completo + rate limit |
| Caché | ISR 5-30 min | Sin caché |
| CORS | ✅ | ❌ mismo origen |

## 📝 Estándares

### Logging
- Formato JSON estructurado: `{ timestamp, level, message, requestId }`
- Sin PII en logs: emails, IPs completas, nombres, mensajes — todos redactados
- Implementación: `lib/auth/log-sanitizer.ts`

### Rate Limiting
- Login: 5 intentos/minuto por IP
- Contact: 3 requests/hora por IP
- Implementación: `lib/rate-limit.ts` con Upstash Redis

## 💡 Mejoras/Features

| Feature | Archivo | Beneficio |
|---------|---------|-----------|
| CRUD genérico | generic.ts + handler.ts | ~70% menos boilerplate |
| CSRF doble cookie | auth/csrf.ts | Protección sin estado en servidor |
| Log sanitizer | auth/log-sanitizer.ts | Cumplimiento GDPR |
| Rate limiting | rate-limit.ts | Protección fuerza bruta y spam |

## 🔍 Reglas de Transformación

1. **Preservar información:** No eliminar contenido, solo reorganizar
2. **Metadata obligatoria:** Frontmatter YAML al inicio
3. **Emplear emojis:** 📋 🏗️ 📁 🎯 🔌 📊 🔧 📝 💡 ✅ ❌
4. **Tablas sobre párrafos:** Preferir tablas para información estructurada
5. **Jerarquía clara:** H2 para secciones principales, H3 para subsecciones
6. **Código con comentarios:** Todos los bloques con explicación

## 🚫 Restricciones

- NO inventar información no documentada
- NO cambiar significado técnico
- NO eliminar secciones existentes
- SI falta información crítica, marcar con `[REQUIERE: descripción]`
