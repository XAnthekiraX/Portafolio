# 04-API-PRIVATE.md — Anthekira.dev

## 1. General
**Base:** `/api/private` — **Auth:** ✅ JWT (header `Authorization: Bearer <token>` o cookies) — **Cliente DB:** service_role (bypass RLS)  
**Middleware:** `frontend/src/middleware.ts` protege todas las rutas `/api/private/*`.  
**Envelope:** `{ success: true, data: T }` / `{ success: false, error: string, code?: string, details?: Record<string, string[]> }`

## 2. Endpoints (34)

### Auth
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/private/admin/login` | Login email+password → Supabase Auth → JWT |

### Personal Info
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/private/personal-info` | Info completa + CV + redes |
| PUT | `/api/private/personal-info` | Actualizar (merge parcial social_links) + auto-traducir bio |

### Projects (CRUD completo)
| Método | Ruta | Auto-traducción |
|---|---|---|
| GET | `/api/private/projects` | — |
| POST | `/api/private/projects` | title + description → EN/PT |
| PUT | `/api/private/projects/[id]` | Re-traduce si cambió |
| DELETE | `/api/private/projects/[id]` | Cascade |

### SaaS (CRUD completo)
| Método | Ruta | Auto-traducción |
|---|---|---|
| GET | `/api/private/saas` | — |
| POST | `/api/private/saas` | name + description → EN/PT |
| PUT | `/api/private/saas/[id]` | Re-traduce si cambió |
| DELETE | `/api/private/saas/[id]` | Cascade |

### Skills, Education, Technologies (CRUD)
| Recurso | Métodos | Notas |
|---|---|---|
| `/api/private/skills` | GET, POST, PUT [id], DELETE [id] | Sin traducción |
| `/api/private/education` | GET, POST, PUT [id], DELETE [id] | Sin traducción |
| `/api/private/technologies` | GET, POST, PUT [id], DELETE [id] | Sin traducción |

### Services (CRUD completo)
| Método | Ruta | Auto-traducción |
|---|---|---|
| GET | `/api/private/services` | — |
| POST | `/api/private/services` | title + description → EN/PT |
| PUT | `/api/private/services/[id]` | Re-traduce si cambió |
| DELETE | `/api/private/services/[id]` | Cascade |

### Upload / Storage
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/private/upload` | Subir archivo a Supabase Storage |

**Request:** `multipart/form-data` — campos: `file` (File), `bucket` (string: `profile` | `projects` | `cv`).  
**Validación:** Tipos MIME y tamaño según bucket (ver `backend/06-BUSINESS-LOGIC.md` §4).  
**Response 201:** `{ success: true, data: { url: "https://...", path: "..." } }`  
**Errores:** 400 (archivo inválido o bucket incorrecto), 413 (archivo demasiado grande), 500 (error Storage).

### Stats
| Método | Ruta | Response |
|---|---|---|
| GET | `/api/private/stats/count` | `{ total_projects: N, total_saas: N, total_technologies: N }` |
| GET | `/api/private/stats/translations-pending` | `{ total_pending: N, total_failed: N }` — conteo de traducciones pendientes y fallidas |

### Translations
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/private/translations/retry` | Reintentar traducciones fallidas (`translation_status = 'failed'`). Re-ejecuta `autoTranslate()` para cada una |

**POST /api/private/translations/retry:**  
**Response 200:** `{ success: true, data: { retried: N, failed: N } }` — número de traducciones reintentadas con éxito y las que siguen fallando.  
**Nota:** Esta operación se invoca manualmente desde el dashboard admin. No hay reintento automático programado.

### Contact Messages
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/private/contact` | Listar mensajes de contacto (orden descendente por fecha) |
| PUT | `/api/private/contact/[id]/read` | Marcar mensaje como leído |
| DELETE | `/api/private/contact/[id]` | Eliminar mensaje |

**GET /api/private/contact:**  
**Response 200:** `{ success: true, data: [{ id, name, email, subject, message, is_read, created_at }] }`  
**Query params opcionales:** `?is_read=true|false` (filtrar por estado de lectura), `?page=1&page_size=20` (paginación).

## 3. Auto-traducción (DeepL) en POST/PUT
```typescript
async function autoTranslate(table, fkColumn, resourceId, sourceContent: Record<string, any>) {
  for (const locale of ['en', 'pt']) {
    try {
      const translatedContent = {};
      for (const [key, text] of Object.entries(sourceContent))
        if (typeof text === 'string' && text.trim())
          translatedContent[key] = await deeplTranslate(text, 'ES', locale.toUpperCase());
      await supabaseAdmin.from(table).upsert(
        { [fkColumn]: resourceId, locale, content: translatedContent, translation_status: 'completed' },
        { onConflict: `${fkColumn},locale` }
      );
    } catch {
      await supabaseAdmin.from(table).upsert(
        { [fkColumn]: resourceId, locale, content: sourceContent, translation_status: 'failed' },
        { onConflict: `${fkColumn},locale` }
      );
    }
  }
}
```

**Tablas con auto-traducción:**
| Recurso | Tabla _translations | content keys |
|---|---|---|
| Projects | project_translations | `title`, `description` |
| Services | service_translations | `title`, `description` |
| SaaS | saas_project_translations | `name`, `description` |
| Personal Info | personal_info_translations | `bio` |

## 4. Códigos de Estado
| 200 | OK | GET, PUT, DELETE |
|---|---|---|
| 201 | Created | POST |
| 400 | Bad Request | Validación Zod |
| 401 | Unauthorized | Token faltante/inválido |
| 404 | Not Found | Recurso no existe |
| 409 | Conflict | Slug/nombre duplicado |
| 500 | Internal Error | Error inesperado |
