# Seguridad

## Puntuación: 60 / 100

---

### ID: SEC-001

**Categoría:** Seguridad  
**Severidad:** Crítica  
**Archivo:** `src/context/AuthContext.tsx` / `src/lib/http.ts`  
**Línea:** 31 / 4  

**Problema:** Token JWT almacenado en `localStorage` con clave `folio-cms-token`. `localStorage` es accesible desde cualquier script ejecutado en el mismo origen, haciéndolo vulnerable a ataques XSS.

**Impacto:** Si existe cualquier vulnerabilidad XSS en la app, el atacante puede robar el token JWT y acceder al panel admin.

**Recomendación:** Migrar el almacenamiento del token JWT a cookies `httpOnly` + `Secure` + `SameSite=Strict`. Esto requiere:
1. Modificar el backend para establecer la cookie en la respuesta de login en lugar de devolver el token en el body JSON.
2. Eliminar la lectura/escritura del token en `localStorage` desde el frontend.
3. Ajustar el interceptor HTTP para no enviar el token manualmente (la cookie se envía automáticamente).

**Justificación:** **Decisión del usuario:** "usaremos cookies". El almacenamiento de JWT en localStorage es una vulnerabilidad de seguridad conocida y documentada por OWASP. Las cookies httpOnly no son accesibles desde JavaScript, eliminando el vector de ataque XSS para robo de tokens.

---

### ID: SEC-002

**Categoría:** Seguridad  
**Severidad:** Media  
**Archivo:** `src/components/ContactForm.tsx`  
**Línea:** 12-15  

**Problema:** No hay sanitización ni validación del lado del cliente para los datos del formulario de contacto, más allá del atributo `required` nativo de HTML.

**Impacto:** Posible envío de datos maliciosos al backend que podrían explotar vulnerabilidades.

**Recomendación:** Agregar validación del lado del cliente (longitud de campos, formato de email, caracteres permitidos) antes de enviar.

**Justificación:** Aunque el backend debe validar, la validación del cliente es una capa de defensa adicional y mejora la UX.

---

### ID: SEC-003

**Categoría:** Seguridad  
**Severidad:** Baja  
**Archivo:** `frontend/index.html`  

**Problema:** No hay Content Security Policy (CSP) definida ni en el HTML ni en la configuración del servidor de producción.

**Impacto:** Sin CSP, la app es vulnerable a inyección de scripts desde cualquier origen.

**Recomendación:** Agregar meta tag CSP o configurarlo en el servidor de producción.

**Justificación:** CSP es una capa defensiva esencial contra XSS.

---

### Nota: Hallazgo removido

**ID SEC-002 original:** Hacía referencia a que el archivo `.env` estaba commiteado en el repositorio. **Verificado**: el `.env` está en `.gitignore` y no es trackeado por Git. Solo existe `.env.example` en el repositorio. El hallazgo queda descartado.

---
