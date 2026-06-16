# 04-AI-DEVELOPMENT-GUIDE.md — Anthekira.dev

## 1. Propósito

Esta guía establece las reglas, convenciones y flujo de trabajo que **todo agente de IA (OpenCode)** debe seguir al implementar código para Anthekira.dev. La documentación del proyecto es la única fuente de verdad.

> **Regla de oro:** Si no está en la documentación, no existe. Si no fue solicitado explícitamente, no se implementa.

---

## 2. Stack y Herramientas

### 2.1 Stack Tecnológico Aprobado

| Capa | Tecnología |
|---|---|
| **Frontend** | Next.js (App Router) + TypeScript + Tailwind CSS |
| **Backend** | Next.js API Routes (mismo proyecto) |
| **Base de datos** | PostgreSQL via Supabase |
| **ORM / Cliente** | `@supabase/ssr` + `@supabase/supabase-js` |
| **Almacenamiento** | Supabase Storage |
| **Autenticación** | Supabase Auth (email + password, JWT) |
| **Internacionalización** | next-intl (ES, EN, PT) |
| **Traducción automática** | DeepL API (al guardar contenido) |
| **Analíticas** | Google Analytics (GA4) |
| **Despliegue** | Vercel |

### 2.2 Herramientas IA

| Herramienta | Rol |
|---|---|
| **OpenCode** | Implementación de código (única herramienta autorizada para escribir código) |
| **Codebuff** | Generación de documentación técnica (este archivo y todos los de `/docs/`) |
| **ChatGPT** | Revisión y validación de documentación |

**OpenCode no debe modificar archivos de documentación (`/docs/*`).** Cualquier cambio en la documentación debe ser solicitado al usuario, quien decidirá si involucrar a Codebuff.

---

## 3. Reglas Fundamentales de Desarrollo

### 3.1 No Asumir, No Inventar

- **No asumas** requisitos, funcionalidades o comportamientos que no estén documentados explícitamente.
- **No inventes** entidades, endpoints, componentes, reglas de negocio o flujos de usuario.
- **No implementes** funcionalidades que no hayan sido solicitadas explícitamente en la documentación o por el usuario.

### 3.2 Una Tarea a la Vez

- Trabaja únicamente sobre la tarea actual asignada.
- No generes múltiples funcionalidades simultáneamente.
- Cada tarea debe completarse, validarse y aprobarse antes de continuar con la siguiente.

### 3.3 Divide y Vencerás

- Las funcionalidades complejas deben dividirse en tareas pequeñas, concretas y verificables.
- Cada tarea debe tener un resultado tangible (archivo creado, componente funcional, endpoint respondiendo).

### 3.4 Pregunta ante la Duda

- Si existe información ambigua o incompleta en la documentación, **detente y pregunta**.
- No tomes decisiones arquitectónicas no documentadas.
- Si una decisión de implementación tiene múltiples opciones viables, consulta.

### 3.5 Alineación con la Documentación

- La implementación debe mantenerse alineada en todo momento con la documentación aprobada.
- Cualquier desviación de la documentación debe ser consultada y aprobada previamente.

---

## 4. Estructura del Proyecto

```
anthekira.dev/
├── .env.local
├── .env.production
├── next.config.ts
├── tsconfig.json
├── package.json
│
├── frontend/                       # ← Código del frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── [locale]/           #   Landing Page (público, con i18n)
│   │   │   ├── admin/              #   Panel Admin (privado, sin i18n)
│   │   │   └── api/                #   API Routes (public/ + private/)
│   │   ├── components/             #   Componentes React (ui/, landing/, admin/, shared/)
│   │   ├── lib/                    #   Utilidades (supabase server/client, i18n.ts)
│   │   └── middleware.ts           #   Next.js Middleware
│   └── docs/                       #   Documentación del frontend
│
├── backend/                        # ← Código del backend
│   ├── src/
│   │   ├── services/               #   Lógica de negocio
│   │   └── lib/                    #   Utilidades (supabase admin, auth, errors, upload)
│   └── docs/                       #   Documentación del backend
│
├── shared/                         # ← Código compartido
│   └── src/
│       ├── types/                  #   Interfaces TypeScript
│       ├── validators/             #   Schemas Zod
│       └── utils/                  #   Utilidades generales
│
├── public/
│   ├── locales/                    # Traducciones next-intl
│   └── images/                     # Imágenes estáticas
│
└── docs/                           # Documentación general del proyecto
```

> Para la estructura completa y detallada, consultar `01-ARCHITECTURE.md` sección 2.

---

## 5. Convenciones de Código

### 5.1 Idioma

- **Todo el código debe escribirse en inglés:** nombres de variables, funciones, componentes, clases, archivos, carpetas, comentarios, mensajes de commit.
- **Excepción:** Los archivos de traducción (`public/locales/*.json`) y el contenido del CMS en BD pueden estar en español (idioma fuente).
- **Excepción:** Las strings de UI visibles al usuario se definen en los archivos de traducción de next-intl, no hardcodeadas.

### 5.2 Principios de Diseño

| Principio | Aplicación |
|---|---|
| **SOLID** | Single responsibility en componentes y servicios. Open/closed para extensiones. |
| **KISS** | La solución más simple que funciona. No agregues abstracciones innecesarias. |
| **DRY** | No dupliques lógica. Extrae a funciones/componentes compartidos cuando se repita 2+ veces. |

### 5.3 TypeScript

- **Modo estricto** habilitado en `tsconfig.json`
- Tipos explícitos en props de componentes, parámetros y retornos de funciones
- **Prohibido** usar `any`. Usar `unknown` si el tipo no se conoce, o definir interfaz si es posible
- Preferir `interface` para objetos públicos, `type` para uniones/tuplas
- Los tipos compartidos van en `src/types/`

### 5.4 Componentes React

| Tipo | Estrategia |
|---|---|
| **Server Component** | Default para toda la Landing Page. Acceso directo a Supabase. Sin `use client` |
| **Client Component** | Solo cuando sea necesaria interactividad (eventos, estado, efectos). Usar `"use client"` |
| **Estrategia** | Mantener los Server Components lo más abajo posible en el árbol. Hidratar solo hojas interactivas |

### 5.5 Naming

| Elemento | Convención | Ejemplo |
|---|---|---|
| **Archivos** | `kebab-case.ts` | `personal-info.ts`, `project-card.tsx` |
| **Directorios** | `PascalCase` (componentes) / `kebab-case` (resto) | `About/`, `services/` |
| **Componentes** | `PascalCase` | `ProjectCard`, `ContactForm` |
| **Funciones** | `camelCase` | `getProjects()`, `handleSubmit()` |
| **Variables** | `camelCase` | `userName`, `projectList` |
| **Constantes** | `UPPER_SNAKE_CASE` | `MAX_FILE_SIZE`, `SUPPORTED_LOCALES` |
| **Tipos/Interfaces** | `PascalCase` | `Project`, `ContactFormData` |
| **Rutas API** | `kebab-case` | `/api/private/projects/` |
| **Tablas BD** | `snake_case` | `project_translations`, `contact_messages` |

### 5.6 Estilos (Tailwind CSS)

- Usar clases de Tailwind exclusivamente (no CSS modules, no styled-components)
- Los tokens de diseño (colores, tipografía, espaciados) se definen en `tailwind.config.ts`
- No usar colores hardcodeados; usar variables del design system (`text-primary`, `bg-accent`, etc.)
- Las animaciones se definen en `tailwind.config.ts` como `keyframes` personalizados

---

## 6. Flujo de Trabajo Recomendado

```
1. LEER
   ├── Lee la documentación relevante para la tarea asignada
   └── Identifica dependencias con otros documentos

2. PLANIFICAR
   ├── Define los archivos a crear/modificar
   ├── Identifica los componentes involucrados
   └── Verifica que no haya conflictos con la arquitectura existente

3. IMPLEMENTAR
   ├── Crea o modifica un archivo a la vez
   ├── Escribe código limpio y tipado
   └── Sigue las convenciones establecidas

4. VALIDAR
   ├── Verifica que el código compile (tsc --noEmit)
   ├── Verifica que el código cumpla con la documentación
   └── Corrige errores encontrados

5. REPETIR
   └── Pasa a la siguiente tarea
```

---

## 7. Documentación como Fuente de Verdad

### 7.1 Orden de Precedencia

Cuando dos documentos entren en conflicto, el orden de precedencia es:

| Prioridad | Documento | Descripción |
|---|---|---|
| 1 (máxima) | `02-DECISIONS.md` | Decisiones técnicas registradas (ADR) |
| 2 | `00-REQUIREMENTS.md` | Requisitos del proyecto |
| 3 | `01-ARCHITECTURE.md` | Arquitectura del sistema |
| 4 | `03-USER-FLOWS.md` | Flujos de usuario |
| 5 | `frontend/docs/*.md` | Documentación del frontend |
| 6 | `backend/docs/*.md` | Documentación del backend |
| 7 (mínima) | `04-AI-DEVELOPMENT-GUIDE.md` | Esta guía (reglas de desarrollo) |

### 7.2 Qué Hacer ante Ambigüedad

1. **Busca en la documentación** si hay una respuesta explícita
2. **Si no la hay**, busca en documentos de mayor prioridad
3. **Si sigue sin estar claro**, pregunta al usuario
4. **No tomes decisiones no documentadas**

### 7.3 Archivos de Documentación por Orden de Lectura Recomendado

Para un agente que comienza una nueva tarea, se recomienda leer en este orden:

```
1. 04-AI-DEVELOPMENT-GUIDE.md  → Reglas de trabajo
2. 00-REQUIREMENTS.md          → Qué se está construyendo
3. 02-DECISIONS.md             → Por qué se tomaron las decisiones
4. 01-ARCHITECTURE.md          → Cómo está organizado el sistema
5. frontend/*.md o backend/*.md → Especificación concreta de la tarea
6. 03-USER-FLOWS.md            → Cómo se usará lo que se está implementando
```

---

## 8. Restricciones Técnicas

### 8.1 Dependencias Externas

- **Minimizar dependencias.** Cada biblioteca agregada debe resolver un problema específico y aportar valor real.
- **Prohibido** agregar dependencias sin justificación documentada.
- **Prohibido** usar bibliotecas que dupliquen funcionalidad ya disponible en Next.js o Supabase.
- **Preferir** soluciones nativas del framework sobre bibliotecas externas.

### 8.2 Evitar Sobrepingeniería

- No implementes patrones complejos (CQRS, Event Sourcing, Microservicios) para un portafolio personal.
- No agregues capas de abstracción hasta que sean necesarias (YAGNI).
- La simplicidad, mantenibilidad y rendimiento tienen prioridad sobre la complejidad técnica innecesaria.

### 8.3 Compatibilidad con Vercel + Supabase

- Las API Routes deben ser compatibles con Serverless Functions de Vercel (sin estado, sin WebSockets, timeout 10s en plan Hobby).
- Las consultas a Supabase deben usar `@supabase/ssr` (no el cliente browser directamente).
- Los archivos subidos a Supabase Storage deben ser accesibles via URL pública.
- Las variables de entorno sensibles (`SUPABASE_SERVICE_ROLE_KEY`, `DEEPL_API_KEY`) no deben exponerse al cliente.

### 8.4 SEO y Rendimiento

- Toda página pública debe tener metadatos (title, description, Open Graph) generados en Server Component.
- Las imágenes deben incluir `width`, `height` y `alt` text.
- Los enlaces a recursos externos deben usar `target="_blank" rel="noopener noreferrer"`.
- Google Analytics debe cargarse de forma asíncrona (no bloqueante).

### 8.5 Modo Oscuro

- Todos los estilos deben diseñarse exclusivamente para modo oscuro.
- No uses clases `dark:` de Tailwind (no hay modo claro).
- El fondo base es oscuro, el texto es claro.
- Usa la paleta de colores definida en `06-UI-UX.md` (rojo `#DC2626`, cian `#06B6D4`).

### 8.6 Accesibilidad (V1)

En V1 se implementan prácticas básicas:
- HTML semántico (`<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`)
- Estructura correcta de encabezados (h1 → h2 → h3, sin saltos)
- Contraste de colores legible (mínimo 4.5:1 para texto normal)
- Navegación funcional mediante teclado (Tab, Enter, Escape)
- Etiquetas `<label>` en todos los campos de formulario
- `alt` text en imágenes relevantes
- Roles ARIA básicos donde sea necesario

---

## 9. Dependencias con otros documentos

| Archivo | Relación |
|---|---|
| `00-REQUIREMENTS.md` | Define qué construir; este documento define cómo construirlo |
| `01-ARCHITECTURE.md` | Define la estructura que los agentes deben seguir |
| `02-DECISIONS.md` | Decisiones que los agentes NO deben revertir |
| `03-USER-FLOWS.md` | Flujos que los agentes deben implementar |
| `frontend/06-UI-UX.md` | Design tokens que los agentes deben usar en Tailwind |
| `frontend/*.md` | Especificaciones detalladas del frontend |
| `backend/*.md` | Especificaciones detalladas del backend |
