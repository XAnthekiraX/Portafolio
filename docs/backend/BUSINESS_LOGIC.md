# Business Logic — Backend Portfolio

## Reglas de negocio por recurso

### Profile

- **Un solo perfil.** La tabla `profiles` tiene FK a `auth.users`, permitiendo un único registro.
- **Avatar opcional.** Si no se envía archivo en PUT, se conserva el `avatar_url` existente.
- **Nombre público.** El endpoint público devuelve `name` como concatenación de `firstName + lastName`.
- **Disponibilidad.** El campo `is_available` controla el badge en el Hero del portfolio.

### Social Links

- **Plataformas válidas:** github, linkedin, twitter/x, dribbble, website, youtube, instagram, tiktok.
- **Plataforma única.** No se permite duplicar la misma plataforma para un perfil (unique por profile_id + platform).
- **Mínimo 1, máximo 8** enlaces visibles.

### Skills

- **Cada categoría** (Frontend, Backend, etc.) tiene un nombre único.
- **Icono Lucide.** El campo `icon` guarda el nombre del icono (ej. "Code2", "Server") que el frontend resuelve en runtime.
- **Ordenable.** `display_order` define la posición.
- **Tecnologías embebidas.** Se almacenan en `skill_technologies` como strings planos (no referencian a la tabla `technologies`).
- **Gestión granular.** El admin puede crear/editar/eliminar tecnologías individuales dentro de una categoría. Al enviar un array `technologies` en POST/PATCH, el backend reemplaza todo el conjunto (delete + insert).

### Technologies

- **Catálogo único.** Cada tecnología tiene nombre único.
- **Icono Lucide.** Misma lógica que skills.
- Se usa también como catálogo para asociar tecnologías a proyectos (tabla pivote `project_technologies`).

### Projects

- **Estados:**
  - `draft` — Solo visible en admin.
  - `published` — Visible en portfolio público.
  - `hidden` — No visible en ningún lado (oculto).
- **Solo los publicados** se devuelven en `GET /api/projects`.
- **Visitas.** El contador `visits` se incrementa en cada `GET /api/projects`. (Implementar con UPDATE + 1, no lectura-escritura.)
- **Imagen opcional.** Si no se envía archivo, se conserva la existente.
- **Ordenable** por `display_order`.

### Education

- **Dos tipos:**
  - `academic` — Formación reglada (grado, máster, etc.). Visible en portfolio público.
  - `certification` — Cursos/certificaciones. Solo visible en admin.
- **Fechas.** `end_date` nullable (en curso).
- **Estados:**
  - `active` — Vigente.
  - `expiring` — Próximo a vencer.
  - `expired` — Vencido.
- **Ordenable** por `display_order`.

### CV

- **Un solo CV.** `profiles.cv_url` almacena la URL pública en Supabase Storage.
- **Subida.** El admin sube el PDF, el backend lo guarda en bucket `cv` y persiste la URL.
- **Eliminación.** Se borra la URL de la DB (el archivo en Storage puede quedar o eliminarse según implementación).

### Services

- **Estados:**
  - `popular` — Destacado como "más solicitado".
  - `available` — Servicio activo.
  - `ondemand` — Bajo demanda (disponible pero con precio variable).
- **Ordenable** por `display_order`.

### Contact Messages

- **Solo escritura pública.** El anónimo puede INSERT, nunca leer.
- **Spam protection.** Rate limiting en `/api/contact` (máx. 3 por IP por hora).
- **Auto-limpieza.** Los mensajes con más de 30 días de antigüedad se eliminan automáticamente (cron job diario o trigger en la DB).
- **Estados internos:**
  - `unread` — Recién llegado.
  - `read` — Visto por el admin.
  - `replied` — Respondido.
- **El admin** puede listar, ver detalle, marcar como leído/replied, y eliminar mensajes desde el panel.
- **Conteo.** Endpoint `GET /api/admin/contact/count` devuelve totales agrupados por estado.

---

## Reglas globales

### GET públicos → solo datos visibles

| Recurso | Filtro |
|---------|--------|
| projects | `status = 'published'` |
| education | `type = 'academic'` |

### CRUD admin → sin filtros

El admin ve y gestiona todos los registros independientemente de su estado.

### Supabase Storage

| Bucket | Ruta | Regla |
|--------|------|-------|
| `avatars` | `{user_id}/avatar.{ext}` | Se sobrescribe en cada PUT |
| `cv` | `{user_id}/cv.pdf` | Se sobrescribe en cada POST |
| `projects` | `{project_id}/image.{ext}` | Se sobrescribe en cada PATCH |

### Rate Limiting

| Endpoint | Límite | Ventana | Almacenamiento |
|---|---|---|---|
| `POST /api/contact` | 3 | 1 hora por IP | En memoria (o Redis si se escala) |

Respuesta al exceder el límite:

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later."
  }
}
```

HTTP Status: **429 Too Many Requests**

### Validaciones comunes (Zod)

```typescript
// Ejemplo de schema de validación
const contactSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  subject: z.string().min(1).max(255),
  message: z.string().min(1).max(5000),
});
```

| Campo | Tipo | Máx | Requerido |
|-------|------|-----|-----------|
| name | string | 255 | sí |
| email | email | 255 | sí |
| url | string (url) | 2048 | según contexto |
| description | text | 5000 | no |
| display_order | integer | — | default 0 |
