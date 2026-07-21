# Arquitectura

## Puntuación: 70 / 100

---

### ID: ARC-001

**Categoría:** Arquitectura  
**Severidad:** Media  
**Archivo:** `src/pages/HomePage.tsx`  
**Línea:** 1-27  

**Problema:** Archivo huérfano `src/pages/HomePage.tsx`. Este componente renderiza su propio `Navbar` y `Footer` y no se utiliza en ningún lado. El componente `Home` en `src/pages/public/Home.tsx` es el que se usa actualmente (y depende de `PublicLayout` para Navbar/Footer).

**Impacto:** Código muerto que incrementa el bundle si se importa, o confunde a futuros desarrolladores.

**Recomendación:** Eliminar `src/pages/HomePage.tsx` ya que es reemplazado completamente por `src/pages/public/Home.tsx` y `PublicLayout.tsx`.

**Justificación:** La documentación de routing (`docs/frontend/README.md`) muestra que `Home` (desde `pages/public/Home.tsx`) es el componente renderizado para la ruta raíz, envuelto en `PublicLayout`. `HomePage.tsx` no aparece en ningún import del proyecto.

---

### ID: ARC-002

**Categoría:** Arquitectura  
**Severidad:** Alta  
**Archivo:** `frontend/package.json` / `src/lib/http.ts`  
**Línea:** 13  

**Problema:** La dependencia `ky` está declarada en la documentación como parte del stack (`docs/frontend/README.md` línea 12: `| [Ky](https://github.com/sindresorhus/ky) | Última |`), pero no está instalada en `package.json`. En su lugar, el proyecto utiliza `fetch` nativo envuelto en `src/lib/http.ts`.

**Impacto:** Inconsistencia entre documentación e implementación. No se aprovechan las características de Ky (manejo de errores, retry, interceptors).

**Recomendación:** Instalar `ky` como dependencia y migrar `src/lib/http.ts` para utilizarlo como cliente HTTP subyacente, manteniendo la misma interfaz pública. Actualizar la documentación si fuera necesario tras la migración.

**Justificación:** **Decisión del usuario:** "usaremos ky". Ky ofrece manejo nativo de errores HTTP, timeouts, retry, y un API más limpia que fetch nativo. El proyecto ya lo declaró en la documentación como parte del stack.

---

### ID: ARC-003

**Categoría:** Arquitectura  
**Severidad:** Alta  
**Archivo:** `src/services/api.ts`, `src/services/admin.ts`  

**Problema:** Duplicación casi completa de mappers de backend a frontend. Las funciones `mapProfile`, `mapSkillCategory`, `mapTechnology`, `mapProject`, `mapEducation`, `mapService` están definidas de forma casi idéntica en ambos archivos.

**Impacto:** Alto mantenimiento. Cualquier cambio en la estructura de datos del backend requiere modificar dos conjuntos de mappers. Aumenta el riesgo de inconsistencias.

**Recomendación:** Centralizar los mappers en un archivo compartido (ej. `src/lib/mappers.ts`) y reutilizarlos desde ambos servicios.

**Justificación:** El principio DRY (Don't Repeat Yourself) se viola con aproximadamente 150 líneas de código duplicado entre los dos archivos de servicios.

---

### ID: ARC-004

**Categoría:** Arquitectura  
**Severidad:** Media  
**Archivo:** `src/types/index.ts`, `src/types/admin.ts`  

**Problema:** Tipos duplicados con diferencias. `Profile`, `SkillCategory`, `Technology`, `Project`, `EducationItem`, `Service`, `SocialLink`, y `ApiResponse` están definidos en ambos archivos pero con interfaces diferentes. Por ejemplo, `Project` en `index.ts` tiene `repoUrl`/`demoUrl`, mientras que en `admin.ts` tiene `url`/`repository`.

**Impacto:** Puede causar confusiones al mapear datos entre la API pública y la API admin. No hay una fuente única de verdad para los tipos.

**Recomendación:** Definir tipos base compartidos y extenderlos si es necesario. Separar claramente los tipos públicos de los de admin con convención de nombres (ej. `PublicProfile` vs `AdminProfile`).

**Justificación:** Los tipos duplicados con campos diferentes son una fuente común de bugs. Si un mapper no se actualiza correctamente, los datos pueden llegar incorrectos al frontend.

---

### ID: ARC-005

**Categoría:** Arquitectura  
**Severidad:** Alta  
**Archivo:** `frontend/tailwind.config.js` / `frontend/postcss.config.js` / `frontend/package.json`  

**Problema:** Tailwind v3 se usa con PostCSS (según `postcss.config.js`), pero la documentación menciona Tailwind v4 con el plugin `@tailwindcss/vite`. La configuración actual usa `postcss.config.js` + `tailwind.config.js` + `tailwindcss: ^3.4.17` en lugar del nuevo plugin de Vite.

**Impacto:** Discrepancia documentación vs implementación. El proyecto no aprovecha las mejoras de rendimiento y el nuevo sistema de configuración de Tailwind v4 (basado en CSS nativo, sin `tailwind.config.js`).

**Recomendación:** Migrar a Tailwind v4:
1. Actualizar `tailwindcss` a v4 y agregar `@tailwindcss/vite` como plugin de Vite.
2. Eliminar `postcss.config.js` y `tailwind.config.js`.
3. Reemplazar `@tailwind base/components/utilities` por `@import "tailwindcss"` en `index.css`.
4. Migrar la configuración del theme a CSS nativo con `@theme`.
5. Eliminar `autoprefixer` y `postcss` de devDependencies si ya no se necesitan.

**Justificación:** **Decisión del usuario:** "Extrictamente usaremos tailwind v4". Tailwind v4 ofrece build más rápida, configuración nativa en CSS, y mejor integración con Vite. La documentación ya lo declaraba como v4.

---
