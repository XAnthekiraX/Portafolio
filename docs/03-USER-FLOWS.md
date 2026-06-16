# 03-USER-FLOWS.md — Anthekira.dev

## 1. Propósito

Describir los flujos de usuario completos del sistema, tanto para el visitante de la Landing Page como para el administrador del panel. Estos flujos sirven como guía para implementar las rutas, componentes y lógica de negocio.

**Convenciones:**
- `[SC]` = Server Component (renderizado en servidor)
- `[CC]` = Client Component (renderizado en cliente)
- `→` = Acción del usuario
- `⇢` = Acción del sistema

---

## 2. Flujo: Visitante Nuevo — Landing Page

### Descripción
Un usuario llega al sitio por primera vez, se le detecta el idioma y explora la página principal.

```
[Visitante] → anthekira.dev
    ⇢ DNS → Vercel → Next.js maneja la solicitud
    ⇢ Negociación de idioma (Accept-Language header)
        ├── Si coincide con ES/EN/PT → redirige a /{lang}/
        └── Si no coincide → redirige a /es/ (default)
    ⇢ Server Component renderiza Landing Page:
        1. Hero (avatar, gradientes, grid tecnológico)
        2. About (biografía)
        3. Skills (tags por categorías)
        4. Technologies (grid de logos)
        5. Projects (grid de cards con capturas)
        6. Services (cards con iconos)
        7. Contact (formulario + redes sociales)
        8. Footer
    ⇢ Google Analytics registra la visita (disparo inicial)
    ⇢ HTML completo servido al navegador
[Visitante] → Ve la Landing Page en su idioma
```

### Componentes involucrados
- `frontend/src/middleware.ts` — Detección de idioma y redirección
- `frontend/src/app/[locale]/layout.tsx` — LandingLayout
- `frontend/src/app/[locale]/page.tsx` — Landing Page
- `frontend/src/components/landing/*` — Componentes de cada sección

---

## 3. Flujo: Exploración de Proyectos

### Descripción
El visitante navega a la página de proyectos y explora los detalles de un proyecto específico.

```
[Visitante] → Hace clic en "Proyectos" (nav) o en card de proyecto
    ⇢ Navegación a /{lang}/projects
    ⇢ Server Component [SC]:
        1. Consulta Supabase: JOIN projects + project_translations WHERE locale = {lang}
        2. Para cada proyecto, obtiene imágenes asociadas
        3. Renderiza grid de cards con capturas
[Visitante] → Ve grid de proyectos → Hace clic en una card
    ⇢ Navegación a /{lang}/projects/[slug]
    ⇢ Server Component [SC]:
        1. Consulta Supabase: SELECT * FROM projects WHERE slug = {slug}
        2. Obtiene traducciones (si el slug no existe en el locale actual, fallback a ES)
        3. Obtiene tecnologías asociadas
        4. Obtiene imágenes del proyecto
        5. Renderiza página de detalle (descripción completa, tecnologías, enlaces)
[Visitante] → Ve detalle completo del proyecto
```

### Componentes involucrados
- `frontend/src/app/[locale]/projects/page.tsx` — Lista de proyectos
- `frontend/src/app/[locale]/projects/[slug]/page.tsx` — Detalle de proyecto
- `frontend/src/components/landing/Projects/ProjectCard.tsx`
- `frontend/src/components/landing/Projects/ProjectDetail.tsx`

### Estados
- **Carga:** Skeleton grid mientras se obtienen datos (SSR, apenas perceptible)
- **Vacío:** "No projects yet" si no hay proyectos publicados
- **Error:** "Could not load projects" con botón de reintento
- **Sin resultados de búsqueda/filtro:** No aplica en V1 (sin búsqueda)

---

## 4. Flujo: Contacto

### Descripción
El visitante completa y envía el formulario de contacto.

```
[Visitante] → Navega a /{lang}/contact
    ⇢ Server Component [SC] renderiza:
        1. Formulario con campos: Nombre, Email, Asunto, Mensaje
        2. Redes sociales visibles (GitHub, LinkedIn, etc.)
    ⇢ Client Component [CC] hidrata el formulario
[Visitante] → Completa campos → Hace clic en "Enviar"
    ⇢ Validación en cliente [CC]:
        ├── Campos requeridos completos
        ├── Email con formato válido
        └── Mensaje >= 10 caracteres
    ├── (Si validación falla) → Muestra error específico por campo
    └── (Si validación pasa) → Envía POST a /api/public/contact
        ⇢ Route Handler recibe datos
        ⇢ Valida en servidor (Zod)
        ⇢ Inserta en tabla contact_messages
        ⇢ Responde { success: true }
    ⇢ Muestra toast/confirmación: "Message sent successfully"
[Visitante] → Ve confirmación de envío exitoso
```

### Componentes involucrados
- `frontend/src/app/[locale]/contact/page.tsx`
- `frontend/src/components/landing/Contact/ContactForm.tsx` [CC]
- `frontend/src/app/api/public/contact/route.ts`

### Estados
- **Carga:** Botón de envío deshabilitado con spinner durante el POST
- **Éxito:** Mensaje verde "Message sent! I'll get back to you soon"
- **Error red:** Toast "Could not send message. Try again."
- **Validación:** Errores inline rojos debajo de cada campo inválido

---

## 5. Flujo: Descarga de CV

### Descripción
El visitante descarga el currículum vitae desde la Landing Page.

```
[Visitante] → Hace clic en "Download CV" (Hero, About o Footer)
    ⇢ Link directo a URL pública de Supabase Storage
        └── Bucket: cv / File: anthekira-cv.pdf
    ⇢ Supabase Storage sirve el archivo (público)
    ⇢ Google Analytics registra evento: download_cv
[Visitante] → Se descarga el PDF en su navegador
```

### Componentes involucrados
- `frontend/src/components/landing/Hero/Hero.tsx` — Botón de CV
- `frontend/src/components/landing/About/About.tsx` — Botón de CV
- Bucket `cv` en Supabase Storage (lectura pública)

### Estados
- **CV no disponible:** El botón no se renderiza si no hay CV configurado en PersonalInfo
- **Error 404:** Si el archivo fue eliminado, se muestra "CV not available"

---

## 6. Flujo: Cambio de Idioma

### Descripción
El visitante cambia el idioma del sitio mediante el selector de idioma.

```
[Visitante] → Hace clic en selector de idioma (Header)
    ⇢ Client Component [CC] muestra menú: Español | English | Português
[Visitante] → Selecciona "English"
    ⇢ Client Component navega a la misma ruta pero con prefijo /en/
        └── Ej: /es/projects/123 → /en/projects/123
    ⇢ next-intl cambia el locale
    ⇢ Server Component [SC] re-renderiza:
        1. UI (menús, botones) con traducciones de next-intl
        2. Contenido dinámico con traducciones de BD (locale = en)
    ⇢ Página se muestra en inglés
```

### Componentes involucrados
- `frontend/src/components/shared/LanguageSwitcher.tsx` [CC]
- next-intl middleware (configurado en `frontend/src/middleware.ts`)

### Estados
- **Carga:** Indicador de carga mientras next-intl cambia el locale
- **Error:** Si el locale no es soportado, redirige a /es/

---

## 7. Flujo: Login Administrativo

### Descripción
El administrador inicia sesión en el panel de administración.

```
[Admin] → Navega a /admin
    ⇢ Middleware de Next.js verifica sesión:
        ├── (Sin sesión) → Redirige a /admin/login
        └── (Con sesión) → Permite acceso a /admin
[Admin] → Ve página de login: email + password
[Admin] → Ingresa credenciales → Click "Sign In"
    ⇢ Client Component [CC] valida campos no vacíos
    ⇢ Envía POST a /api/private/admin/login
        ⇢ Route Handler llama a Supabase Auth: signInWithPassword()
            ├── (Credenciales inválidas) → Error 401 → Muestra "Invalid credentials"
            └── (Credenciales válidas) →
                ⇢ Supabase Auth devuelve session { access_token, refresh_token }
                ⇢ Establece cookies httpOnly con la sesión
                ⇢ Responde { success: true }
    ⇢ Redirige a /admin/dashboard
[Admin] → Ve el Dashboard del panel administrativo
```

### Componentes involucrados
- `frontend/src/app/admin/login/page.tsx`
- `frontend/src/components/admin/LoginForm.tsx` [CC]
- `frontend/src/app/api/private/admin/login/route.ts`
- `frontend/src/middleware.ts` — Protección de rutas

### Estados
- **Carga:** Botón "Sign In" deshabilitado con spinner
- **Error credenciales:** Toast/mensaje rojo "Invalid email or password"
- **Error red:** Toast "Connection error. Try again."

---

## 8. Flujo: CRUD de Contenido (Admin)

### Descripción
El administrador gestiona un recurso (proyectos, habilidades, servicios, etc.) desde el panel.

```
[Admin] → Dashboard → Click en "Projects" (sidebar)
    ⇢ Client Component [CC] navega a /admin/projects
    ⇢ fetch GET a /api/private/projects (con JWT en Authorization header)
        ⇢ Middleware verifica token → Route Handler → Service → Supabase
        ⇢ Responde con lista de proyectos
    ⇢ Renderiza DataTable con: nombre, tecnologías, acciones (Editar/Eliminar)
[Admin] → Click "New Project"
    ⇢ Navega a /admin/projects/new
    ⇢ Renderiza FormBuilder [CC] con campos:
        1. Título (ES)
        2. Descripción (ES)
        3. Skills (selector múltiple vía modal)
        4. Imágenes (selector de Media)
        5. URL del proyecto
        6. URL del repositorio
        7. Estado (activo/inactivo)
[Admin] → Completa formulario → Click "Save"
    ⇢ Validación en cliente
    ⇢ POST a /api/private/projects (JWT en header)
        ⇢ Route Handler:
            1. Valida input (Zod)
            2. Guarda proyecto en tabla projects
            3. Toma los campos en ES y llama a DeepL API:
                ├── Traduce título y descripción a EN
                └── Traduce título y descripción a PT
            4. Guarda traducciones en project_translations
            5. Responde { success: true, id }
    ⇢ Muestra toast verde "Project created"
    ⇢ Redirige a /admin/projects (lista actualizada)
```

### Flujo de Edición (similar)
```
[Admin] → Click "Edit" en un proyecto
    ⇢ fetch GET /api/private/projects/[id] → carga datos actuales
    ⇢ FormBuilder pre-poblado con datos existentes
[Admin] → Modifica campos → Click "Save"
    ⇢ PUT /api/private/projects/[id]
        ⇢ Actualiza projects
        ⇢ Re-traduce a EN y PT via DeepL (si cambió texto en ES)
        ⇢ Actualiza project_translations
    ⇢ Toast "Project updated"
```

### Flujo de Eliminación
```
[Admin] → Click "Delete" → Modal de confirmación
[Admin] → Confirma eliminación
    ⇢ DELETE /api/private/projects/[id]
        ⇢ Elimina traducciones asociadas
        ⇢ Elimina relaciones project_skills
        ⇢ Elimina proyecto
    ⇢ Toast "Project deleted"
    ⇢ DataTable actualizada (sin recargar página)
```

### Recursos aplicables
Este flujo aplica para: **Projects**, **SaaS Projects**, **Skills**, **Education**, **Technologies**, **Services**, **PersonalInfo**, **Social Links**.

### Componentes involucrados
- `frontend/src/components/admin/DataTable/` — Lista de recursos
- `frontend/src/components/admin/FormBuilder/` — Formulario genérico CRUD
- `backend/src/services/*.ts` — Lógica de negocio por recurso
- `frontend/src/app/api/private/*/route.ts` — Endpoints CRUD

### Estados
- **Carga lista:** Skeleton rows en DataTable
- **Carga formulario:** Spinner mientras se obtienen datos existentes
- **Vacío (lista):** "No [resource] yet. Create your first one."
- **Error guardar:** Toast rojo "Could not save. Check your connection."
- **Error DeepL:** Toast amarillo "Saved but translations failed. You can edit them manually."

---

## 9. Flujo: Cierre de Sesión

### Descripción
El administrador cierra sesión y es redirigido al login.

```
[Admin] → Click en avatar/nombre (navbar) → Click "Sign Out"
    ⇢ Client Component [CC] llama a Supabase Auth: signOut()
        ⇢ Limpia cookies de sesión
    ⇢ Redirige a /admin/login
[Admin] → Ve pantalla de login
```

### Componentes involucrados
- `frontend/src/components/admin/Navbar.tsx` [CC]
- Supabase Auth `signOut()`

### Estados
- **Cerrando sesión:** Botón "Sign Out" se deshabilita momentáneamente
- **Error:** Si el signOut falla, se muestra toast y se intenta de nuevo

---

## 10. Dependencias con otros documentos

| Archivo | Relación |
|---|---|
| `00-REQUIREMENTS.md` | Define las funcionalidades que estos flujos realizan |
| `01-ARCHITECTURE.md` | Define la arquitectura que soporta estos flujos |
| `frontend/01-ROUTES.md` | Define las rutas navegadas en estos flujos |
| `frontend/02-COMPONENTS.md` | Define los componentes utilizados en cada flujo |
| `backend/03-API-PUBLIC.md` | Endpoints usados en flujos públicos |
| `backend/04-API-PRIVATE.md` | Endpoints usados en flujos privados (admin) |
| `backend/05-AUTHENTICATION.md` | Flujo de login/logout detallado |
