# Forms

## Contact Form

Ubicado en la sección `#contact`, columna derecha del layout de 2 columnas.

### Campos

| Campo | Tipo | Requerido | Placeholder | Label |
|-------|------|-----------|-------------|-------|
| Nombre | text | sí | John Doe | Nombre |
| Correo | email | sí | john@example.com | Correo |
| Asunto | text | sí | Proyecto de rediseño | Asunto |
| Mensaje | textarea (5 rows) | sí | Cuéntame sobre tu proyecto... | Mensaje |

### Diseño visual

- **Labels**: texto mono, tamaño sm, color dark-400, margin-bottom 0.5rem.
- **Inputs**: fondo dark-950, borde dark-700, texto dark-100, placeholder dark-700.
- **Borde redondeado**: rounded-lg (8px).
- **Textarea**: resize none (no redimensionable).
- **Padding interno**: px-4 py-3.

### Estados de foco

- outline eliminado, reemplazado por:
  - border-color → accent (#06B6D4)
  - ring-1 ring-accent

### Botón de envío

- Full width (w-full).
- Fondo primario (#DC2626) con hover (#EF4444) y active (#B91C1C).
- Texto blanco, font-medium.
- Icono Lucide "send" a la derecha del texto.
- Border-radius: rounded-lg.

### Validación

Todos los campos tienen el atributo `required`. No hay validación visual adicional (errores, éxito) implementada en el prototipo.

### Comportamiento de envío

No hay comportamiento de envío implementado en el prototipo. El botón es de tipo `submit` pero no hay action ni script asociado.
