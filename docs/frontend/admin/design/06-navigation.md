# Navigation

## Sidebar Navigation

Estructura jerárquica con 3 grupos y 8 ítems de navegación.

### Grupo: GENERAL
| Ítem | Vista | Icono |
|---|---|---|
| Dashboard | `view-dashboard` | layout-dashboard |

### Grupo: PROFILE
| Ítem | Vista | Icono |
|---|---|---|
| Profile | `view-profile` | user |
| Skills | `view-skills` | zap |
| CV | `view-cv` | file-text |
| Education | `view-education` | graduation-cap |

### Grupo: CONTENT
| Ítem | Vista | Icono |
|---|---|---|
| Technologies | `view-technologies` | cpu |
| Projects | `view-projects` | folder-kanban |
| Services | `view-services` | briefcase |

---

## Comportamiento de Navegación

- Click en un ítem de navegación:
  1. Remueve clase `active` de todos los ítems
  2. Agrega clase `active` al ítem clickeado
  3. Oculta todas las `view-section`
  4. Muestra la `view-section` correspondiente al `data-view`
  5. Actualiza el título en el Topbar
  6. Cierra el drawer en mobile
  7. Reinicia los iconos Lucide
  8. Hace scroll al inicio del content-area

---

## Indicador de Vista Activa

- Barra vertical roja (3px) a la izquierda del ítem activo
- El Dashboard es la vista activa por defecto

---

## Navegación Mobile

- En viewports ≤ 768px:
  - La sidebar se oculta fuera de la pantalla (left: -260px)
  - Un botón burger en el Topbar la abre/cierra
  - Un overlay semitransparente cubre el contenido al abrir la sidebar
  - Click en el overlay cierra la sidebar
  - Al navegar a una vista, la sidebar se cierra automáticamente

---

## Acciones de Navegación Secundarias

- **Topbar:** El título se actualiza dinámicamente según la vista activa
- **"Ver todos" en Dashboard:** Botón que sugiere navegación a Projects (no implementado)
- **Modal:** Se abre con `onclick` desde botones de editar en proyectos
- **Modal close:** Click en X, botón Cancelar, o click fuera del modal
