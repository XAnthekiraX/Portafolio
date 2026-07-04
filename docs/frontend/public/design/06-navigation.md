# Navigation

## Estructura de navegación

### Navbar principal (escritorio)

Enlaces horizontales visibles en md+:

| Enlace | Ancla | Comportamiento |
|--------|-------|---------------|
| About | `#about` | Scroll suave a sección |
| Skills | `#skills` | Scroll suave a sección |
| Projects | `#projects` | Scroll suave a sección |
| Education | `#education` | Scroll suave a sección |
| Services | `#services` | Scroll suave a sección |

### Navbar principal (móvil)

Drawer full-height que se abre/cierra al hacer click en el botón hamburguesa. Contiene los mismos enlaces que escritorio más un CTA "Contactar".

- El drawer se cierra automáticamente al hacer click en cualquier enlace.
- El botón hamburguesa solo es visible en móvil (< md).

### Navegación secundaria (Footer)

Enlaces rápidos: About, Projects, Contact. Mismos anchors que navbar.

## Language Switcher

- **Botón**: muestra "ES" y un chevron-down.
- **Dropdown**: 3 opciones (ES, EN, PT). ES está activo/destacado.
- **Comportamiento**: toggle al click del botón. Se cierra al click fuera.
- Nota: el cambio de idioma no tiene lógica implementada en el prototipo.

## Theme Toggle

- **Botón**: muestra icono sol (modo oscuro) o luna (modo claro).
- **Estado inicial**: modo oscuro.
- **Comportamiento**: toggle dark/light class en el elemento HTML.

## Call to Action

- **"Contactar"** en navbar (escritorio y móvil): navega a `#contact`.
- **"Descargar CV"** en hero: enlace (sin archivo real en prototipo).
- **"Contactar"** en hero: navega a `#contact`.

## Sombra dinámica en navbar

El navbar recibe una sombra (shadow-lg) cuando el usuario hace scroll > 20px, indicando la posición de scroll.

## Flujo de navegación completo

```
[Entrada] → Hero → About → Skills → Technologies → Projects → Education → Services → Contact → [Footer]
                                                                                                   
Los enlaces permiten saltar directamente a cualquier sección sin orden secuencial.
```
