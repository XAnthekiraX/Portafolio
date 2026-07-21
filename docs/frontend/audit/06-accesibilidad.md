# Accesibilidad

## Puntuación: 50 / 100

---

### ID: ACC-001

**Categoría:** Accesibilidad  
**Severidad:** Alta  
**Archivo:** `src/components/AdminLayout.tsx`  
**Línea:** 23-27  

**Problema:** El overlay de sidebar móvil no tiene `aria-hidden`, ni soporte para cerrar con tecla Escape.

**Impacto:** Los usuarios de lectores de pantalla pueden interactuar con contenido detrás del overlay. No hay forma de cerrarlo con teclado.

**Recomendación:** Agregar `role="presentation"`, `aria-hidden="true"`, y un event listener para la tecla Escape.

**Justificación:** WCAG 2.1 Criterio 2.1.2 (No Keyboard Trap) y 4.1.2 (Name, Role, Value).

---

### ID: ACC-002

**Categoría:** Accesibilidad  
**Severidad:** Alta  
**Archivo:** `src/components/admin/SocialLinkModal.tsx`, `SkillCategoryModal.tsx`, `TechnologyModal.tsx`, `EducationModal.tsx`, `ProjectModal.tsx`, `ServiceModal.tsx`  

**Problema:** Ninguno de los modales implementa focus trapping. El foco puede escapar del modal y seguir al contenido detrás del overlay.

**Impacto:** Usuarios de teclado pueden navegar fuera del modal y confundirse. Lectores de pantalla no saben que están en un modal.

**Recomendación:** Implementar focus trapping con `useEffect` y manejo de `Tab`/`Shift+Tab`, además de cerrar con Escape.

**Justificación:** WCAG 2.1 Criterio 2.4.3 (Focus Order) — requerido para diálogos modales.

---

### ID: ACC-003

**Categoría:** Accesibilidad  
**Severidad:** Media  
**Archivo:** Múltiples componentes (`AvatarFrame.tsx`, `Dashboard.tsx`, `Projects.tsx`, `AdminLayout.tsx`, etc.)  

**Problema:** Varias imágenes tienen `alt=""` o `alt="Avatar"` que no son descriptivas. Algunas imágenes decorativas tienen `alt=""` (correcto), pero otras que sí transmiten información tienen `alt` insuficiente.

**Impacto:** Usuarios de lectores de pantalla no obtienen información significativa de las imágenes.

**Recomendación:** Revisar y corregir `alt` texts. El avatar debería tener `alt={name}` (ya está correcto en `AvatarFrame.tsx`). Imágenes de proyectos deberían tener `alt={project.title}`. Las imágenes puramente decorativas pueden mantener `alt=""`.

**Justificación:** WCAG 1.1.1 (Non-text Content) — todas las imágenes deben tener un text alternative apropiado.

---

### ID: ACC-004

**Categoría:** Accesibilidad  
**Severidad:** Media  
**Archivo:** `src/components/ui/ToastContainer.tsx`  

**Problema:** Las notificaciones toast no tienen `role="alert"` ni `aria-live="polite"`, por lo que los lectores de pantalla no anuncian las notificaciones cuando aparecen.

**Impacto:** Usuarios con discapacidad visual no reciben feedback de las notificaciones del sistema.

**Recomendación:** Agregar `role="alert"` y `aria-live="polite"` al contenedor de toasts. Cada toast individual debe tener `role="status"`.

**Justificación:** WCAG 4.1.3 (Status Messages) — los mensajes de estado deben ser anunciados por lectores de pantalla sin desplazar el foco.

---

### ID: ACC-005

**Categoría:** Accesibilidad  
**Severidad:** Baja  
**Archivo:** `src/components/admin/Sidebar.tsx`  

**Problema:** El sidebar no tiene `role="navigation"` ni `aria-label` para distinguirlo de la navegación principal.

**Impacto:** Usuarios de lectores de pantalla no pueden identificar fácilmente que es un menú de navegación secundario.

**Recomendación:** Agregar `role="navigation"` y `aria-label="Admin navigation"` al elemento `aside` o `nav`.

**Justificación:** WCAG 2.4.1 (Bypass Blocks) — proporciona puntos de referencia de navegación.

---
