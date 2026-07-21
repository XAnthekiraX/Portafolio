# Calidad del código

## Puntuación: 68 / 100

---

### ID: CAL-001

**Categoría:** Calidad del código  
**Severidad:** Media  
**Archivo:** `src/lib/http.ts`  
**Línea:** 1  

**Problema:** URL del backend hardcodeada como fallback. `const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";` — en producción, si `VITE_API_URL` no está definida, se usará `localhost`.

**Impacto:** Posible error en producción si la variable de entorno no está configurada correctamente. La URL de fallback queda expuesta en el bundle.

**Recomendación:** Eliminar el fallback a localhost y forzar la definición de `VITE_API_URL` en tiempo de build. Validar en tiempo de compilación.

**Justificación:** El hardcoding de localhost como fallback puede causar que la app intente conectar a un servidor inexistente en producción en lugar de fallar explícitamente.

---

### ID: CAL-002

**Categoría:** Calidad del código  
**Severidad:** Media  
**Archivo:** `src/services/api.ts`  
**Línea:** 181  

**Problema:** Hardcoding de URL en `getCvUrl()`. Usa directamente `http://localhost:3001/api/cv` en lugar de utilizar el cliente HTTP configurable.

```ts
const res = await fetch("http://localhost:3001/api/cv", { redirect: "manual" });
```

**Impacto:** Totalmente incompatible con entornos que no sean localhost. Ignora la configuración de `VITE_API_URL`.

**Recomendación:** Usar `BASE_URL` (importada desde `src/lib/http.ts`) para construir la URL, o refactorizar `getCvUrl` para usar el cliente `http` con manejo de redirects.

**Justificación:** **Decisión del usuario:** "se usara BASE_URL". Rompe el principio de configuración externa. La app no funcionará en staging/production sin este cambio.

---

### ID: CAL-003

**Categoría:** Calidad del código  
**Severidad:** Media  
**Archivo:** `src/services/admin.ts`  
**Línea:** 349  

**Problema:** Uso extensivo de `as any` para acceder a propiedades de objetos.

```ts
if ((payload as any)[key] !== undefined) body[key] = (payload as any)[key];
```

**Impacto:** Pérdida de type safety. Si la interfaz cambia, no hay advertencia del compilador.

**Recomendación:** Eliminar el uso de `any` tipando correctamente el payload o usando `Object.keys` con tipado más estricto.

**Justificación:** TypeScript se configuró con `strict: true` para obtener máximos beneficios de tipado. El uso de `any` anula esa protección.

---

### ID: CAL-004

**Categoría:** Calidad del código  
**Severidad:** Baja  
**Archivo:** `src/components/ui/Sparkline.tsx`  
**Línea:** 12  

**Problema:** Referencia a clase CSS `group-hover/card` que no tiene efecto porque ningún elemento padre tiene la clase `group/card`.

```tsx
className={`...opacity-60 transition-opacity duration-150 group-hover/card:opacity-100`}
```

**Impacto:** El efecto hover sobre sparklines nunca se activa. Código CSS muerto con efecto visual inalcanzable.

**Recomendación:** Evaluar si se necesita un hover específico para la card contenedora. Si se desea mantener el efecto, agregar la clase `group/card` al elemento padre (`<Card>`) del Dashboard. Si se puede lograr el mismo resultado con clases estándar de Tailwind (ej. `group` simple si el padre ya es `group`), usar esas en su lugar.

**Justificación:** **Decisión del usuario:** "agregar la clase solo si no se obtiene el mismo resultado con tailwind". La funcionalidad declarada no se ejecuta actualmente.

---

### ID: CAL-005

**Categoría:** Calidad del código  
**Severidad:** Baja  
**Archivo:** `src/context/AuthContext.tsx`  
**Línea:** 36  

**Problema:** Se construye un objeto `user` con valores hardcodeados (`firstName: ""`, `lastName: ""`) a partir de la respuesta de `/api/admin/auth/me`.

```ts
user: { id: data.id, firstName: "", lastName: "", email: data.email }
```

**Impacto:** El sidebar muestra nombre vacío/null hasta que se carga el profile desde otra query. Inconsistencia visual.

**Recomendación:** Solicitar al backend que devuelva `firstName`/`lastName` en el endpoint `/api/admin/auth/me`, o sincronizar los datos del usuario con la query del perfil.

**Justificación:** Los valores hardcodeados como string vacío se muestran en la UI (sidebar), dando una experiencia incompleta.

---

### ID: CAL-006

**Categoría:** Calidad del código  
**Severidad:** Baja  
**Archivo:** `src/components/Hero.tsx`  
**Línea:** 14  

**Problema:** Query key `["cv-url"]` está definida inline en lugar de usar el objeto `queryKeys`.

**Impacto:** Inconsistencia en la gestión de query keys. Dificulta la invalidación centralizada de queries.

**Recomendación:** Agregar `cvUrl` a `queryKeys.ts` y usarlo aquí.

**Justificación:** El proyecto estableció el patrón de `queryKeys.ts` para centralizar keys, pero esta key se definió fuera del estándar.

---
