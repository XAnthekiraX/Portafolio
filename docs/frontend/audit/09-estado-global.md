# Estado global

## Puntuación: 82 / 100

---

### ID: STATE-001

**Categoría:** Estado global  
**Severidad:** Baja  
**Archivo:** `src/context/AuthContext.tsx`  

**Problema:** El estado de autenticación no se persiste cuando se cierra la pestaña (solo el token se mantiene). Al recargar la página, se hace una request a `/api/admin/auth/me` que puede fallar si el token expiró.

**Impacto:** Pequeña ventana de inconsistencia entre `isLoading=true` y la verificación real del token.

**Recomendación:** Almacenar también la expiración del token y verificar localmente antes de hacer la request.

**Justificación:** Mejora la experiencia y reduce requests innecesarias.

---
