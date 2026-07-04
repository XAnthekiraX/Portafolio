# Layouts

## Layout general

El sitio utiliza un layout de **columna única vertical** con secciones apiladas secuencialmente. No hay sidebar, grid complejo ni layout multicapa (fuera de la navbar fija).

```
┌─────────────────────────────────────┐
│          Navbar (fixed top)          │
├─────────────────────────────────────┤
│              Hero                    │  (min-h-screen)
├─────────────────────────────────────┤
│              About                   │
├─────────────────────────────────────┤
│              Skills                  │
├─────────────────────────────────────┤
│            Technologies              │
├─────────────────────────────────────┤
│             Projects                 │
├─────────────────────────────────────┤
│            Education                 │
├─────────────────────────────────────┤
│             Services                 │
├─────────────────────────────────────┤
│             Contact                  │
├─────────────────────────────────────┤
│              Footer                  │
└─────────────────────────────────────┘
```

## Contenedores

- Contenedor principal estándar: `max-w-7xl` con padding lateral `px-6 lg:px-8`.
- Secciones About y Education usan `max-w-4xl` (ancho reducido para mejor legibilidad).
- Cada sección ocupa el ancho completo del viewport con fondo de sección alternado.

## Navbar

- **Posición**: fixed top, z-index elevado (z-50).
- **Estilo**: glassmorphism (fondo semitransparente + blur).
- **Altura**: h-16 (64px).
- **Distribución**: logo izquierda, enlaces centro, acciones derecha.
- **En escritorio**: enlaces visibles horizontalmente.
- **En móvil**: enlaces ocultos, drawer desplegable desde la izquierda.

## Footer

- **Distribución**: 3 columnas en escritorio (logo, enlaces, sociales); centrado vertical en móvil.
- **Borde superior**: separador visual `border-t border-dark-800`.
- **Copyright**: línea inferior centrada.

## Patrón de alternancia de fondos

Las secciones alternan entre fondo base y fondo `bg-dark-900/50` con bordes superior e inferior para crear separación visual:

| Sección | Fondo |
|---------|-------|
| Hero | grid-bg (base) |
| About | base |
| Skills | bg-dark-900/50 + border-y |
| Technologies | base |
| Projects | bg-dark-900/50 + border-y |
| Education | base |
| Services | bg-dark-900/50 + border-y |
| Contact | base |
