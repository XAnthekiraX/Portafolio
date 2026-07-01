# 03-USER-FLOWS.md — Anthekira.dev

## 1. Flujo: Visitante Nuevo — Landing Page
```
anthekira.dev → DNS → Vercel → Next.js
  → Negociación idioma (Accept-Language)
    → /{lang}/ (default: /es/)
      → Server Component renderiza Landing Page:
        1. Hero (avatar, gradientes, grid tecnológico)
        2. About (biografía con traducción)
        3. Skills (tags categorizadas)
        4. Technologies (grid logos)
        5. Projects (cards con imágenes + skills)
        6. Services (cards con iconos + estado)
        7. Contact (formulario + redes sociales)
        8. Footer
      → Google Analytics registra visita
      → HTML completo servido
```

## 2. Contacto
```
Visitante → /{lang}/contact → formulario (nombre, email, asunto, mensaje)
  → Validación cliente (campos requeridos + email válido)
    → POST /api/public/contact
      → Zod validation server
        → INSERT contact_messages
          → Toast confirmación "Message sent"
```

## 3. Login Admin
```
Admin → /admin → middleware detecta sin sesión → /admin/login
  → Ingresa email + password
    → POST /api/private/admin/login
      → Supabase Auth signInWithPassword()
        → (éxito) cookies httpOnly → redirige a /admin
        → (error 401) "Invalid credentials"
```

## 4. CRUD Contenido (Admin)
```
Admin → Dashboard → Sidebar → /admin/projects
  → GET /api/private/projects (JWT en cookie + CSRF header)
    → GenericDataTable con acciones (Editar/Eliminar)

Crear: Click "New" → GenericForm → campos estructurados
  → POST /api/private/[resource]
    → Valida (Zod) → Guarda en ES → DeepL traduce a EN+PT (Promise.all, síncrono)
      → Guarda content JSONB en tabla entity_translations
        → translation_status: completed (o failed)
          → Toast y redirección

Editar: Click "Edit" → GenericForm pre-poblado → PUT /api/private/[resource]/[id]
  → Re-traduce si cambió texto fuente

Eliminar: Click "Delete" → Modal confirmación → DELETE /api/private/[resource]/[id]
  → Cascade elimina traducciones y relaciones N:M
```

Aplica para: Projects (incluye SaaS vía `type: 'saas'`), Skills, Education, Technologies, Services, PersonalInfo.

> **Nota:** Projects y SaaS están unificados. Al crear/editar un proyecto, el campo `type` determina si es proyecto regular (`'project'`) o SaaS (`'saas'`). Los campos específicos de SaaS (`url`, `features`) aparecen condicionalmente en GenericForm.

### 4.1 Education (Admin)
```
Admin → /admin/education
  → GET /api/private/education → GenericDataTable (Institution, Degree, Actions)
    → Cada registro incluye translations: { en: translation_status|null; pt: translation_status|null }

Crear: Click "New" → GenericForm → institution, degree, description, website_url, logo_url → POST
  → Si tiene description → DeepL traduce a EN+PT (Promise.all, síncrono)
    → Guarda en entity_translations vía RPC

Editar: Click "Edit" → GenericForm pre-poblado → PUT /api/private/education/[id]
  → Si cambió description → re-ejecuta autoTranslate('education', id, { description })

Eliminar: Click "Delete" → Modal confirmación → DELETE /api/private/education/[id]
```

## 5. Flujo: Cambio de Idioma
```
Visitante → LanguageSwitcher [CC] → selecciona idioma
  → next-intl navega a misma ruta con nuevo prefijo
    → SC re-renderiza con traducciones (UI + BD)
```

## 6. Cierre de Sesión
```
Admin → Click avatar → "Sign Out"
  → supabase.auth.signOut()
    → Limpia cookies → redirige a /admin/login
```
