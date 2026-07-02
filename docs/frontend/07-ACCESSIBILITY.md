---
doc_id: frontend-accessibility
version: 1.0.0
last_updated: 2026-07-01
owner: Anthekira
type: guide
dependencies: [frontend-overview, frontend-ui-ux]
tags: [frontend, accessibility, a11y, html-semantic, aria, contrast, keyboard]
ai_context:
  primary_use: Accessibility guidelines, HTML semantics, contrast ratios, ARIA attributes, and keyboard navigation
  key_constraints: [WCAG AA contrast > 4.5:1, semantic HTML, form labels, skip-to-content, focus ring]
  target_audience: Frontend developers, AI agents implementing accessible components
---

# 07-ACCESSIBILITY.md — Anthekira.dev

## 1. Nivel V1
Buenas prácticas básicas (WCAG-inspired, sin certificación). Sin ARIA live regions, sin pruebas automatizadas.

## 2. HTML Semántico
```html
<body>
  <header role="banner">
    <nav role="navigation" aria-label="Main navigation">...</nav>
  </header>
  <main role="main" id="main-content">
    <section aria-labelledby="section-title">
      <h1 id="section-title">...</h1>
    </section>
  </main>
  <footer role="contentinfo">...</footer>
</body>
```

**Jerarquía headings:** Un solo h1 por página. Sin saltos (h1→h2→h3). Ej: Home → h1 "Desarrollador Full-Stack", h2 "Sobre Mí", h2 "Proyectos", h3 "Project Name".

## 3. Contraste
Todas las combinaciones superan 4.5:1 (WCAG AA):
- Texto principal (#F4F4F5) sobre fondo (#18181B): ~14.5:1 ✅
- Botón primario (#FFF) sobre primary-600 (#DC2626): ~4.8:1 ✅
- Links accent-500 (#06B6D4) sobre surface-900: ~8.5:1 ✅

Color no exclusivo: errores muestran texto + borde rojo. Badges incluyen texto descriptivo.

## 4. Formularios
- Todos los campos con `<label htmlFor="...">` + `id` en input
- Sin placeholder como única identificación
- `aria-invalid={!!error}` + `aria-describedby={error ? 'id-error' : undefined}` en inputs con error
- `role="alert"` en mensajes de error
- `focus:ring-2 focus:ring-accent-500 focus:ring-offset-2` visible en todos los elementos interactivos

## 5. Imágenes
| Tipo | Alt text |
|---|---|
| Avatar perfil | `alt="Anthekira profile picture"` |
| Captura proyecto | `alt="Screenshot of [Project Name]..."` |
| Logo tecnología | `alt="[Technology Name] logo"` |
| Icono decorativo | `alt=""` + `aria-hidden="true"` |

Imágenes informativas: `loading="lazy"`, `width`, `height`.

## 6. Navegación Teclado
- **Skip to content:** Link al inicio del body que salta a `#main-content`
- **Modal:** Escape para cerrar, focus trap
- **LanguageSwitcher:** Enter abrir, Arrow Up/Down navegar, Escape cerrar
- **Mobile menu:** Enter abrir/cerrar, Escape cerrar
- Todos los botones/links accesibles con Enter y Space

## 7. ARIA Básico
```tsx
<button aria-label="Close menu" aria-expanded={isOpen} aria-controls="mobile-menu" />
<div role="dialog" aria-modal="true" aria-labelledby="modal-title" />
<div role="alert" aria-live="assertive">{errorMessage}</div>
<nav aria-label="Admin navigation">
  <a href="/admin" aria-current={isActive ? 'page' : undefined}>Dashboard</a>
</nav>
```
