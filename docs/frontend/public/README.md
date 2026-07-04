# Frontend — Documentación

## Estructura

```
public/
├── index.html          # Prototipo HTML (Single Source of Truth)
├── design/             # Documentación UX/UI
│   ├── 00-overview.md
│   ├── 01-pages.md
│   ├── 02-layouts.md
│   ├── 03-sections.md
│   ├── 04-components.md
│   ├── 05-design-system.md
│   ├── 06-navigation.md
│   ├── 07-forms.md
│   ├── 08-responsive.md
│   └── 09-user-flows.md
└── api/                # Contrato de API
    ├── 00-overview.md
    ├── 01-public-api.md
    ├── 02-private-api.md
    ├── 03-authentication.md
    ├── 04-data-models.md
    ├── 05-validation.md
    ├── 06-errors.md
    └── 07-openapi.md
```

## Design

Documentación UX/UI extraída del prototipo HTML (`index.html`). Cubre páginas, layouts, secciones, componentes, sistema de diseño, navegación, formularios, responsive y flujos de usuario.

## API

Contrato de API REST inferido de la documentación UX/UI. Define endpoints, modelos de datos, validación, errores y especificación OpenAPI. Sin implementación técnica — solo contratos.
