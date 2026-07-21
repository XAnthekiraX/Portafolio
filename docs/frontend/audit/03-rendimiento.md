# Rendimiento

## Puntuación: 58 / 100

---

### ID: PERF-001

**Categoría:** Rendimiento  
**Severidad:** Alta  
**Archivo:** `src/App.tsx` / `src/pages/admin/*.tsx`  

**Problema:** Code Splitting ausente. Las 8 páginas admin (Dashboard, Profile, Skills, CV, Education, Technologies, Projects, Services) se importan estáticamente en `App.tsx` en lugar de usar `React.lazy()`.

**Impacto:** Todo el bundle del admin se carga al iniciar la app, incluso si el usuario nunca visita el panel. Aumenta el tiempo de carga inicial.

**Recomendación:** Usar `React.lazy()` + `Suspense` para cargar bajo demanda las páginas admin y las secciones públicas pesadas.

**Justificación:** Las páginas admin representan funcionalidad condicional (requiere auth). Cargarlas bajo demanda reduce el bundle inicial significativamente.

---

### ID: PERF-002

**Categoría:** Rendimiento  
**Severidad:** Media  
**Archivo:** `src/components/ScrollReveal.tsx`  
**Línea:** 25  

**Problema:** Uso de `window.addEventListener("scroll", ...)` en lugar de `Intersection Observer` para detectar visibilidad. Cada instancia de `ScrollReveal` agrega su propio listener de scroll.

**Impacto:** Múltiples listeners de scroll (uno por cada sección) ejecutándose en cada evento de scroll, causando potenciales jank en dispositivos de bajos recursos.

**Recomendación:** Migrar a `Intersection Observer` que es más eficiente al ser manejado nativamente por el navegador en un hilo separado.

**Justificación:** `Intersection Observer` es la API recomendada para scroll-based animations y evita el overhead de calcular `getBoundingClientRect()` en cada frame.

---

### ID: PERF-003

**Categoría:** Rendimiento  
**Severidad:** Media  
**Archivo:** `src/components/Hero.tsx`  
**Línea:** 23-24  

**Problema:** Blobs decorativos renderizados como divs grandes con blur. `h-96 w-96` con `blur-[120px]`. En dispositivos móviles esto causa repintados costosos.

**Impacto:** Posible jank en la animación de scroll en dispositivos móviles con GPU limitada.

**Recomendación:** Agregar `will-change: transform` o `transform: translateZ(0)` para promover a su propia capa de composición. Considerar reducir el tamaño en mobile.

**Justificación:** Los blurs grandes son costosos de renderizar. Se benefician de ser promovidos a capas GPU.

---

### ID: PERF-004

**Categoría:** Rendimiento  
**Severidad:** Baja  
**Archivo:** Múltiples componentes (`Hero.tsx`, `ProjectCard.tsx`, `Dashboard.tsx`, etc.)  

**Problema:** Sin lazy loading para imágenes. Las imágenes (avatar, proyectos, dashboard) se cargan sin `loading="lazy"`.

**Impacto:** Las imágenes fuera de viewport compiten por ancho de banda en la carga inicial.

**Recomendación:** Agregar `loading="lazy"` a todas las imágenes que no están en el viewport inicial.

**Justificación:** Es una mejora simple con alto impacto en la carga percibida de la página.

---
