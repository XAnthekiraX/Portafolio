# Integración con APIs

## Puntuación: 75 / 100

---

### ID: API-001

**Categoría:** Integración con APIs  
**Severidad:** Media  
**Archivo:** `src/lib/http.ts`  

**Problema:** No hay soporte para `AbortController` en las requests. TanStack Query soporta `AbortSignal`, pero el cliente HTTP no lo expone.

**Impacto:** Las requests no pueden cancelarse al desmontar componentes, causando "memory leaks" o actualizaciones de estado después del desmontaje.

**Recomendación:** Pasar el `signal` desde TanStack Query (que lo proporciona en `queryFn`) al cliente HTTP. Implementar manejo de abort en `http.ts`.

**Justificación:** TanStack Query proporciona `AbortSignal` automáticamente en `queryFn`. Ignorarlo es una oportunidad perdida de optimización.

---

### ID: API-002

**Categoría:** Integración con APIs  
**Severidad:** Baja  
**Archivo:** `src/hooks/useContact.ts`  
**Línea:** 10  

**Problema:** El mensaje de error del hook de contacto es genérico y no utiliza el mensaje real del error de la API.

```ts
const serverError = error ? "Error al enviar el mensaje. Intenta de nuevo." : null;
```

**Impacto:** El usuario no recibe información específica sobre el error (ej: "email inválido", "servicio no disponible").

**Recomendación:** Propagar el error real desde `ApiError` al usuario extrayendo `error.message`.

**Justificación:** El backend envía mensajes de error estructurados (`error.message`), pero se ignoran.

---

### ID: API-003

**Categoría:** Integración con APIs  
**Severidad:** Baja  
**Archivo:** `src/services/api.ts`  
**Línea:** 180-186  

**Problema:** `getCvUrl()` no usa `http` ni maneja errores de red. Si el servidor no responde, la promesa se rechaza silenciosamente y `data` será `undefined`.

**Impacto:** Si falla la carga de CV, el botón de descarga simplemente no aparece sin feedback.

**Recomendación:** Usar el cliente `http` con manejo de errores y retry mediante TanStack Query.

**Justificación:** Inconsistencia con el resto del código que usa `http` para todas las llamadas API.

---
