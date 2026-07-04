# Portfolio CMS — Admin Panel

Panel de administración para la gestión del portafolio personal. Permite al propietario administrar todo el contenido que se muestra en la página pública.

---

## Estructura de la documentación

```
docs/frontend/admin/
├── README.md                 ← Este archivo
├── index.html                ← Prototipo HTML (Single Source of Truth del diseño)
│
├── design/                   ← Documentación UX/UI generada por analizador
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
│
└── api/                      ← Especificación de API privada (CRUD)
    ├── 00-overview.md
    ├── 02-private-api.md
    ├── 03-authentication.md
    ├── 04-data-models.md
    ├── 05-validation.md
    └── 06-errors.md
```

---

## Recursos gestionados

| Recurso | Diseño | API privada |
|---|---|---|
| Perfil personal | `01-pages.md` (Profile) | `02-private-api.md` → `/api/admin/profile` |
| Redes sociales | `07-forms.md` (Social links) | `02-private-api.md` → `/api/admin/profile/social` |
| Habilidades | `01-pages.md` (Skills) | `02-private-api.md` → `/api/admin/skills` |
| Currículum Vitae | `01-pages.md` (CV) | `02-private-api.md` → `/api/admin/cv` |
| Educación / Certificaciones | `01-pages.md` (Education) | `02-private-api.md` → `/api/admin/education` |
| Tecnologías | `01-pages.md` (Technologies) | `02-private-api.md` → `/api/admin/technologies` |
| Proyectos | `01-pages.md` (Projects) | `02-private-api.md` → `/api/admin/projects` |
| Servicios | `01-pages.md` (Services) | `02-private-api.md` → `/api/admin/services` |

---

## Vistas del panel

El panel tiene 8 vistas navegables desde la sidebar:

| Vista | ID en prototipo |
|---|---|
| Dashboard | `view-dashboard` |
| Profile | `view-profile` |
| Skills | `view-skills` |
| CV | `view-cv` |
| Education | `view-education` |
| Technologies | `view-technologies` |
| Projects | `view-projects` |
| Services | `view-services` |

---

## Autenticación

El panel es privado. Todas las operaciones CRUD requieren autenticación JWT.

Ver `api/03-authentication.md` para la especificación completa.

---

## Relación con la API pública

La API pública (`/api/`) expone datos de solo lectura para el portafolio.
La API privada (`/api/admin/`) es la fuente de verdad: los cambios en el admin se reflejan automáticamente en los endpoints públicos.

| Documentación pública | Documentación admin |
|---|---|
| `docs/frontend/public/api/` | `docs/frontend/admin/api/` |
| Solo lectura + contacto | CRUD completo |
| Sin autenticación | JWT requerido |

---

## Convenciones técnicas

- **Prototipo**: HTML + Tailwind CSS + Lucide icons (no representa la arquitectura final)
- **API**: REST, JSON, fechas ISO 8601, UUID v4
- **Auth**: JWT Bearer Token
- **Idioma UI**: Español
- **Tema**: Dark
