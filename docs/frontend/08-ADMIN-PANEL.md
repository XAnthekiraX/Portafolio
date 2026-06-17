# 08-ADMIN-PANEL.md — Anthekira.dev

## 1. Sidebar
```
📊 Dashboard     → /admin
📁 Projects      → /admin/projects
🚀 SaaS Projects → /admin/saas
👤 Profile       → /admin/profile
🎓 Education     → /admin/education
🛠️ Technologies  → /admin/technologies
🏢 Services      → /admin/services
💻 Skills        → /admin/skills
✉️ Messages      → /admin/contact
─────────────────
📊 Google Analytics → (enlace externo)
🚪 Sign Out
```

## 2. Dashboard (`/admin`)
Cards de resumen desde `GET /api/private/stats/count`:
| Card | Fuente |
|---|---|
| Projects | `total_projects` |
| SaaS Projects | `total_saas` |
| Technologies | `total_technologies` |
+ Enlace a Google Analytics.

## 3. Login (`/admin/login`)
```
Email + Password → POST /api/private/admin/login → Supabase Auth → JWT en cookies → /admin
```

## 4. CRUD Projects (`/admin/projects`)
**Lista:** GET → DataTable (Name, Skills, Status, Updated, Actions Edit/Delete).  
**Crear:** FormBuilder → title, description, slug, project_url, repository_url, image, status, skills (modal) → POST → auto-traducción DeepL (title + description → EN/PT).  
**Editar:** PUT → re-traduce si cambió texto.  
**Eliminar:** Modal confirmación → DELETE → cascade.

## 5. CRUD SaaS (`/admin/saas`)
**Crear:** FormBuilder → name, description, url, image, status, features (tag input), skills (modal) → POST → auto-traducción.

## 6. Profile (`/admin/profile`)
Secciones: Personal Info (name, title, bio, location, email, avatar, status), CV (upload PDF), Social Links (GitHub, LinkedIn, Twitter, Website).
**API:** `GET/PUT /api/private/personal-info` — merge parcial de `social_links`.

## 7. Skills Management (`/admin/skills`)
CRUD con categorías: frontend, backend, devops, tools, other. Badge colors por categoría.

## 8. Education (`/admin/education`)
CRUD sin traducción. Campos: institution, degree, description, website_url, logo_url, display_order.

## 9. Technologies (`/admin/technologies`)
CRUD. Campos: name, icon_url, website_url.

## 10. Services (`/admin/services`)
CRUD con auto-traducción. Campos: title, description (ES → EN/PT), icon (Lucide select), status (available/coming_soon).

## 11. Resumen Endpoints
| Recurso | GET | POST | PUT | DELETE |
|---|---|---|---|---|
| `/api/private/personal-info` | ✅ | — | ✅ | — |
| `/api/private/projects` | ✅ | ✅ | ✅ | ✅ |
| `/api/private/saas` | ✅ | ✅ | ✅ | ✅ |
| `/api/private/skills` | ✅ | ✅ | ✅ | ✅ |
| `/api/private/education` | ✅ | ✅ | ✅ | ✅ |
| `/api/private/technologies` | ✅ | ✅ | ✅ | ✅ |
| `/api/private/services` | ✅ | ✅ | ✅ | ✅ |
| `/api/private/upload` | — | ✅ | — | — |
| `/api/private/contact` | ✅ | — | ✅ (read) | ✅ |
| `/api/private/stats/count` | ✅ | — | — | — |
| `/api/private/admin/login` | — | ✅ | — | — |
