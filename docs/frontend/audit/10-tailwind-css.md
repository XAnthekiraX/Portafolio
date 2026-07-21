# Tailwind CSS

## Puntuación: 78 / 100

---

### ID: TW-001

**Categoría:** Tailwind CSS  
**Severidad:** Baja  
**Archivo:** `src/pages/admin/Skills.tsx`  
**Línea:** 18  

**Problema:** Paleta de colores representada como array fijo de clases Tailwind en lugar de usar las variables CSS del design system.

```tsx
const dotColors = ["bg-red-600", "bg-cyan-500", "bg-green-500", "bg-yellow-500"]
```

**Impacto:** Si el design system cambia (ej: accent color), estos valores no se actualizarán automáticamente.

**Recomendación:** Usar variables CSS o tokens del design system para mantener consistencia.

**Justificación:** Valores hardcodeados que deberían derivarse del sistema de diseño.

---

### ID: TW-002

**Categoría:** Tailwind CSS  
**Severidad:** Media  
**Archivo:** Múltiples componentes y estilos (`src/index.css`, `tailwind.config.js`, `useTheme.ts`, `Navbar.tsx`, `Hero.tsx`, etc.)  

**Problema:** El modo oscuro actual se implementa con CSS custom properties y selectores manuales (`html.light`) en `index.css`, combinado con clases `dark-*`/`light-*` definidas en `tailwind.config.js` que apuntan a esas variables. Esto:

1. Duplica la lógica del theme: ya existe en `useTheme.ts` y también en las variables CSS.
2. No usa Tailwind `dark:` variant, que es el mecanismo nativo de Tailwind para modo oscuro.
3. Crea dos sistemas paralelos: los componentes públicos usan `dark-*`/`light-*` y los admin usan `zinc-*`, sin relación entre sí.

**Impacto:** Alto acoplamiento entre el toggle de tema y las variables CSS. Difícil de mantener y migrar a Tailwind v4. El sistema no escala porque cualquier nuevo color requiere definirlo tanto en CSS como en `tailwind.config.js`.

**Recomendación:** Al migrar a Tailwind v4, adoptar el sistema nativo de modo oscuro:

1. En `src/index.css` (o `app.css`), definir la variante personalizada `dark`:
```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));
```

2. Eliminar las variables CSS de `:root` y `html.light` de `index.css`.

3. Eliminar los colores `dark-*`/`light-*` del `tailwind.config.js` (o su equivalente en `@theme` de v4).

4. Usar exclusivamente la variante `dark:` en las clases Tailwind:
```tsx
<div className="bg-white text-black dark:bg-zinc-900 dark:text-white">
```

5. Simplificar `useTheme.ts` para que solo agregue/elimine la clase `dark` en `<html>`:
```ts
document.documentElement.classList.toggle("dark");
```

6. Persistir la preferencia en `localStorage` con la misma clave (`folio-theme`) y restaurarla al iniciar la app, antes del renderizado (en el `<script>` del `index.html` o en un efecto temprano).

**Justificación:** Este enfoque elimina la duplicación de lógica, usa el mecanismo nativo de Tailwind, simplifica el mantenimiento y alinea el proyecto con Tailwind v4. El toggle de tema no cambia estilos directamente; solo controla la presencia de la clase `dark` en `<html>`, y Tailwind aplica automáticamente todas las variantes `dark:` del proyecto.

---
