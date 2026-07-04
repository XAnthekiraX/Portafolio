# Forms

## Profile — Información Personal

### Campos
| Label | Tipo | Valor Ejemplo | Estado |
|---|---|---|---|
| Nombre | text | Carlos | readonly |
| Apellido | text | Mendez | readonly |
| Título | text | Full Stack Developer | readonly |
| Email | email | carlos@devfolio.io | readonly |
| Descripción | textarea | "Desarrollador full stack..." | readonly |
| Ubicación | text | Madrid, España | readonly |
| Experiencia | text | 5 años | readonly |

### Acciones
- **Cancelar:** btn-secondary
- **Guardar cambios:** btn-primary

---

## Modal — Editar Proyecto

### Campos
| Label | Tipo | Valor Ejemplo | Estado |
|---|---|---|---|
| Título del proyecto | text | E-Commerce Platform | readonly |
| Descripción | textarea | "Tienda online completa..." | readonly |
| URL del proyecto | text | https://ecom.carlosdev.io | readonly |
| Repositorio | text | github.com/carlos/ecom | readonly |
| Imagen de preview | file (dropzone) | — | interactivo (prototipo) |
| Tecnologías | tag-list | Next.js, Stripe, Prisma, PostgreSQL | interactivo (prototipo) |
| Estado | button group | Publicado (activo) / Borrador / Oculto | interactivo (prototipo) |
| Orden de visualización | text | 1 | readonly |

### Selección de Estado
- 3 botones secundarios: Publicado (borde verde), Borrador, Oculto
- El estado activo se distingue visualmente con estilo diferente

### Tecnologías
- Tags removibles con icono X
- Botón "+" con borde dashed para agregar más

### Dropzone de Imagen
- Área con borde dashed 2px
- Preview de imagen actual
- Texto: "Arrastra una imagen o haz click para subir"

### Acciones
- **Cancelar:** btn-secondary (cierra modal)
- **Guardar proyecto:** btn-cyan

---

## Profile — Redes Sociales

No es un formulario tradicional, sino una lista con filas editables.
Cada fila tiene un botón de editar (icono pencil) que sugiere edición inline o modal.
Botón "Agregar red social" al pie.

---

## Patrón General de Formularios

- Labels en JetBrains Mono (11px, uppercase, tracking-wider)
- Inputs con focus ring rojo
- Campos readonly en el prototipo (la funcionalidad de edición no está implementada)
- Separador visual antes de las acciones del formulario
- Botones de acción alineados a la derecha (justify-end)
