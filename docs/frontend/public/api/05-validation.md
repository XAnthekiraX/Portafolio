# Validation

## POST /api/contact — Reglas de validación

### Campos

| Campo | Tipo | Requerido | Longitud | Formato |
|-------|------|-----------|----------|---------|
| name | string | sí | 1-100 | No vacío, sin HTML |
| email | string | sí | 1-254 | email válido (RFC 5322) |
| subject | string | sí | 1-200 | No vacío, sin HTML |
| message | string | sí | 1-5000 | No vacío, sin HTML |

### Reglas adicionales

- **name**: debe contener al menos un carácter alfabético.
- **email**: debe cumplir formato email estándar (local@domain.tld).
- **subject**: no debe exceder 200 caracteres.
- **message**: no debe exceder 5000 caracteres.

### Sanitización

- Los campos de texto deben ser sanitizados para prevenir XSS (eliminar etiquetas HTML/script).
- Se debe recortar (trim) whitespace al inicio y final de todos los campos.

---

## Endpoints GET — Sin validación de entrada

Los endpoints de lectura (`GET /api/profile`, `/api/skills`, `/api/technologies`, `/api/projects`, `/api/education`, `/api/services`, `/api/cv`) no requieren parámetros de entrada ni validación. Sirven contenido estático predefinido.
