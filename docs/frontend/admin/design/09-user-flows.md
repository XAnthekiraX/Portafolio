# User Flows

## 0. Autenticación / Inicio de sesión

1. Usuario navega a `/admin` (o cualquier ruta `/admin/*`)
2. `ProtectedRoute` verifica si hay un token JWT válido en `localStorage`
3. **Si no hay token:**
   - Redirige automáticamente a `/admin/login`
   - Se muestra `LoginPage` (standalone, sin sidebar ni topbar)
   - Usuario ingresa email y password
   - Presiona "Iniciar sesión"
   - `POST /api/admin/auth/login` se envía al servidor
   - **Éxito:** se guarda el token en `localStorage`, redirige a `/admin` (Dashboard)
   - **Error:** se muestra mensaje de error en el formulario
4. **Si hay token pero no se ha validado:**
   - Se muestra un spinner/skeleton mientras se llama a `GET /api/admin/auth/me`
   - **Token válido:** se renderiza `AdminLayout` con la vista solicitada
   - **Token inválido/expirado:** se limpia el token, redirige a `/admin/login`
5. **Si ya hay sesión activa y visita `/admin/login`:**
   - Redirige automáticamente a `/admin`

---

## 11. Cerrar sesión

1. Usuario hace click en "Cerrar sesión" (dropdown del avatar en sidebar o topbar)
2. Se llama a `logout()` del contexto de autenticación
3. `POST /api/admin/auth/logout` (fire-and-forget)
4. Se elimina el token de `localStorage`
5. Se redirige a `/admin/login`
6. El `AdminLayout` se destruye completamente (no se ve sidebar ni topbar)

---

## 1. Revisar Dashboard

1. Usuario abre el panel
2. Ve dashboard con métricas generales (Projects, Technologies, Skills, Visits)
3. Revisa proyectos recientes en lista
4. Consulta estado del perfil (75% completo)
5. Ve actividad reciente del portafolio
6. Puede hacer click en "Ver todos" para ir a Projects

---

## 2. Editar Perfil Personal

1. Navega a Profile vía sidebar
2. Visualiza foto y datos actuales
3. Opcional: hace click en botón de cámara para cambiar foto
4. Edita campos del formulario (Nombre, Apellido, Título, Email, etc.)
5. Hace click en "Guardar cambios" o "Cancelar"
6. Gestiona redes sociales: edita URL existente o agrega nueva

---

## 3. Gestionar Skills

1. Navega a Skills vía sidebar
2. Ve 4 categorías con sus skills
3. Hace click en "Nueva skill" para agregar
4. Las skills existentes son tags que podrían ser editables o removibles

---

## 4. Gestionar CV

1. Navega a CV vía sidebar
2. Ve vista previa del documento actual
3. Opciones:
   - "Reemplazar CV": subir nuevo archivo PDF
   - "Descargar": descargar el CV actual
4. Consulta metadatos del archivo en columna lateral

---

## 5. Revisar Formación

1. Navega a Education vía sidebar
2. Ve timeline de formación académica (máster, grado)
3. Ve timeline de certificaciones con estados (Activo, Próximo a expirar)
4. Puede hacer click en botón de acciones (three dots) en cada ítem
5. Puede agregar nueva formación o certificación

---

## 6. Gestionar Tecnologías

1. Navega a Technologies vía sidebar
2. Ve catálogo de 18 tecnologías en cuadrícula
3. Cada tecnología es seleccionable (posible edición/eliminación)
4. Puede agregar nueva tecnología

---

## 7. Gestionar Proyectos

1. Navega a Projects vía sidebar
2. Ve grid de tarjetas de proyecto con preview
3. Acciones por proyecto:
   - Editar (icono pencil): abre modal de edición
   - Enlace externo (external-link)
   - Repositorio (github)
4. Puede crear nuevo proyecto desde tarjeta ghost o botón "Nuevo proyecto"
5. En la tabla inferior, ve todos los proyectos con métricas
6. En la tabla, puede hacer click en acciones (three dots) por fila

### Flujo de Edición de Proyecto (Modal)
1. Usuario hace click en icono pencil de una tarjeta
2. Modal "Editar proyecto" se abre con overlay
3. Usuario modifica campos (título, descripción, URL, repo, imagen, tecnologías, estado, orden)
4. Opcional: remueve tecnología con X, agrega con "+"
5. Cambia estado entre Publicado / Borrador / Oculto
6. Guarda cambios o cancela
7. Modal se cierra (X, Cancelar, o click fuera)

---

## 8. Gestionar Servicios

1. Navega a Services vía sidebar
2. Ve grid de servicios con estados (Popular, Disponible, Bajo demanda)
3. Cada servicio es editable (icono pencil)
4. Puede agregar nuevo servicio desde tarjeta ghost o botón "Nuevo servicio"

---

## 9. Cambiar Tema

1. Usuario hace click en icono de luna/sol en Topbar
2. Tema cambia de dark a light (o viceversa)
3. Todos los colores del sistema se actualizan instantáneamente
4. El icono toggle cambia (luna en dark, sol en light)

---

## 10. Cambiar Idioma

1. Usuario hace click en ES, EN, o PT en el Topbar
2. El botón seleccionado se marca como activo (fondo rojo)
3. Nota: El cambio de idioma es solo visual en el prototipo; la funcionalidad de traducción no está implementada
