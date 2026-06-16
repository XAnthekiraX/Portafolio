# 09-CMS-INTEGRATION.md — Anthekira.dev — Integración del CMS con el Frontend

## 1. Propósito

Este documento describe cómo el frontend de Anthekira.dev se integra con el backend (Supabase + API Routes) para gestionar y renderizar contenido. Cubre los clientes de Supabase, los patrones de obtención de datos, la subida de archivos, el flujo de traducción automática y el manejo de errores en la capa de datos.

---

## 2. Arquitectura General de la Integración

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
│                                                                  │
│  Landing Page (pública)                Panel Admin (privada)     │
│  ┌──────────────────────┐              ┌──────────────────────┐  │
│  │ Server Components    │              │ Client Components    │  │
│  │ direct query         │              │ fetch() → API        │  │
│  └──────────┬───────────┘              └──────────┬───────────┘  │
│             │                                     │              │
│  @supabase/ssr (server)              @supabase/ssr (browser)     │
│             │                                     │              │
└─────────────┼─────────────────────────────────────┼──────────────┘
              │                                     │
              ▼                                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND                                     │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ API Routes (/api/*)                                      │   │
│  │  └── Route Handler → Service Layer → Supabase Client     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Supabase (PostgreSQL + Storage + Auth)                   │   │
│  │  └── service_role key (server-side, bypasses RLS)        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ DeepL API (auto-traducción al guardar contenido)         │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 2.1 Dos Patrones de Obtención de Datos

| Patrón | Dónde se usa | Cómo funciona |
|---|---|---|
| **Direct Query** | Landing Page (Server Components) | El Server Component consulta Supabase directamente con `@supabase/ssr`. Sin API Routes intermedias. |
| **Fetch to API** | Panel Admin (Client Components) | El Client Component hace `fetch()` a `/api/private/*` con JWT en headers. La API Route verifica auth y consulta Supabase con `service_role`. |

> **Decisión (ADR-005):** La Landing Page consulta Supabase directamente para minimizar latencia. Las API Routes públicas existen para consumo externo, no para el propio frontend.

---

## 3. Clientes de Supabase

### 3.1 `frontend/src/lib/supabase/server.ts` — Para Server Components y Route Handlers

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignorar errores en Server Components (read-only cookies)
          }
        },
      },
    }
  );
}
```

**Usado por:**
- Server Components de la Landing Page (consulta directa a BD)
- Route Handlers de API Routes (con `service_role` ver sección 3.3)

### 3.2 `frontend/src/lib/supabase/client.ts` — Para Client Components

```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**Usado por:**
- `AuthGuard.tsx` — Verificar sesión en el cliente
- `ContactForm.tsx` — Verificar estado antes de enviar
- `LanguageSwitcher.tsx` — No se usa (solo navegación)

### 3.3 `backend/src/lib/supabase/admin.ts` — Para API Routes (service_role)

```typescript
import { createClient } from '@supabase/supabase-js';

export function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
```

**Usado por:**
- Route Handlers de `/api/private/*` — Operaciones CRUD con bypass de RLS
- Funciones de auto-traducción (DeepL) — Escritura en tablas de traducción

> ⚠️ **Seguridad:** Este cliente NUNCA debe exponerse al cliente. Solo se usa en Server Components y Route Handlers.

### 3.4 Resumen de Clientes

| Cliente | Entorno | Key | RLS | Uso |
|---|---|---|---|---|
| `server.ts` | Server Component | `anon` | Respeta RLS | Landing Page (consulta pública) |
| `client.ts` | Client Component | `anon` | Respeta RLS | `createBrowserClient` — verificar sesión, estado |
| `admin.ts` | Route Handler | `service_role` | Bypass RLS | Admin CRUD, traducciones |

---

## 4. Obtención de Datos en la Landing Page

### 4.1 Patrón: Server Component → Supabase Directo

```tsx
// frontend/src/app/[locale]/projects/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';
import ProjectCard from '@/components/landing/Projects/ProjectCard';

export default async function ProjectsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations('projects');
  const supabase = await createSupabaseServerClient();

  // Consulta directa a Supabase (sin API Route intermedia)
  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      id,
      slug,
      image_url,
      status,
      project_translations!inner(
        title,
        description
      )
    `)
    .eq('project_translations.locale', locale)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    // Renderizar estado de error
  }

  return (
    <section>
      <h2 className="font-heading text-3xl">{t('title')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects?.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.project_translations.title}
            description={project.project_translations.description}
            image={project.image_url}
            slug={project.slug}
          />
        ))}
      </div>
    </section>
  );
}
```

### 4.2 Fallback de Idioma

Cuando una traducción no existe en el locale solicitado, se debe hacer fallback al español:

```tsx
// Consulta con fallback a ES
const { data } = await supabase
  .from('projects')
  .select(`
    id,
    slug,
    image_url,
    project_translations(
      title,
      description,
      locale
    )
  `)
  .eq('status', 'active');

// En el componente, filtrar por locale con fallback
const getTranslation = (
  translations: Translation[],
  locale: string
) => {
  return (
    translations.find((t) => t.locale === locale) ||
    translations.find((t) => t.locale === 'es') ||
    translations[0]
  );
};
```

### 4.3 Entidades y sus Consultas

| Entidad | Tabla principal | Tabla de traducción | Campos traducidos |
|---|---|---|---|
| **Projects** | `projects` | `project_translations` | `title`, `description` |
| **Services** | `services` | `service_translations` | `title`, `description` |
| **PersonalInfo** | `personal_info` | `personal_info_translations` | `bio` |
| **Skills** | `skills` | — | Sin traducciones (términos técnicos) |
| **Technologies** | `technologies` | — | Sin traducciones |
| **Media** | `media` | — | Sin traducciones |

---

## 5. Obtención de Datos en el Panel Admin

### 5.1 Patrón: Client Component → fetch() → API Route

```tsx
// frontend/src/app/admin/projects/page.tsx
'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/private/projects');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setProjects(data.projects);
    } catch (error) {
      console.error('Error:', error);
      // Mostrar toast de error
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataTable
      columns={[
        { key: 'title', label: 'Name' },
        { key: 'technologies', label: 'Technologies' },
        { key: 'status', label: 'Status' },
      ]}
      data={projects}
      loading={loading}
      onEdit={(id) => window.location.href = `/admin/projects/${id}`}
      onDelete={handleDelete}
    />
  );
}
```

### 5.2 Autenticación en API Routes Privadas

Cada request a `/api/private/*` debe incluir el token JWT:

```tsx
// En cualquier Client Component del admin
const response = await fetch('/api/private/projects', {
  headers: {
    'Content-Type': 'application/json',
  },
  // Las cookies de sesión se envían automáticamente (httpOnly)
});
```

El middleware de Next.js verifica la sesión en cookies para todas las rutas `/admin` y `/api/private/*`.

### 5.3 Estructura de una API Route

```typescript
// frontend/src/app/api/private/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const supabase = await createSupabaseAdminClient();

  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_translations(*),
      project_technologies(
        technologies(*)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }

  return NextResponse.json({ projects: data });
}

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseAdminClient();
  const body = await request.json();

  // 1. Guardar proyecto en español (idioma fuente)
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({
      slug: body.slug,
      image_url: body.image_url,
      project_url: body.project_url,
      repository_url: body.repository_url,
      status: body.status,
    })
    .select()
    .single();

  if (projectError) {
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }

  // 2. Auto-traducir con DeepL (ver sección 7)
  await translateProject(project.id, body.title, body.description);

  // 3. Asociar tecnologías
  if (body.technology_ids?.length) {
    await supabase.from('project_technologies').insert(
      body.technology_ids.map((tech_id: string) => ({
        project_id: project.id,
        technology_id: tech_id,
      }))
    );
  }

  return NextResponse.json({ success: true, id: project.id });
}
```

---

## 6. Subida de Archivos Multimedia

### 6.1 Flujo Completo

```
Admin selecciona archivo
    → FileUploader valida en cliente (tipo + tamaño)
        → POST /api/private/media/upload (multipart/form-data)
            → Route Handler valida en servidor
                → Supabase Storage: upload al bucket correspondiente
                    → Tabla media: registra metadata (url, type, alt_text)
                        → Responde { success: true, url }
                            → FileUploader muestra preview + URL
```

### 6.2 Buckets de Supabase Storage

| Bucket | Tipo de archivo | Tamaño max | Uso |
|---|---|---|---|
| `profile` | JPG, PNG, WebP | 2 MB | Avatar/imagen de perfil |
| `projects` | JPG, PNG, WebP | 5 MB | Capturas de proyectos |
| `media` | JPG, PNG, WebP, PDF | 5 MB | Recursos visuales generales |
| `cv` | PDF | 10 MB | Currículum vitae |

### 6.3 API Route de Upload

```typescript
// frontend/src/app/api/private/media/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];

const MAX_SIZES: Record<string, number> = {
  profile: 2 * 1024 * 1024,    // 2 MB
  projects: 5 * 1024 * 1024,   // 5 MB
  media: 5 * 1024 * 1024,      // 5 MB
  cv: 10 * 1024 * 1024,        // 10 MB
};

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const bucket = formData.get('bucket') as string;

  // Validar tipo
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'File type not allowed' },
      { status: 400 }
    );
  }

  // Validar tamaño
  const maxSize = MAX_SIZES[bucket] || 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json(
      { error: `File exceeds ${maxSize / 1024 / 1024}MB limit` },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseAdminClient();

  // Generar nombre único
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${bucket}/${fileName}`;

  // Subir a Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }

  // Obtener URL pública
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  // Registrar metadata en BD
  const { error: dbError } = await supabase
    .from('media')
    .insert({
      file_name: file.name,
      file_path: filePath,
      file_url: urlData.publicUrl,
      file_type: file.type,
      file_size: file.size,
      bucket,
    });

  if (dbError) {
    return NextResponse.json(
      { error: 'Failed to save metadata' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    url: urlData.publicUrl,
  });
}
```

### 6.4 FileUploader Component (resumen)

```tsx
// frontend/src/components/admin/FileUploader/index.tsx
'use client';

import { useState, useRef } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

interface FileUploaderProps {
  accept: string;
  maxSizeMB?: number;
  bucket: string;
  onUploadComplete: (url: string) => void;
  multiple?: boolean;
}

export default function FileUploader({
  accept,
  maxSizeMB = 5,
  bucket,
  onUploadComplete,
  multiple = false,
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setError(null);

    // Validación en cliente
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File exceeds ${maxSizeMB}MB limit`);
      return;
    }

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', bucket);

    try {
      const response = await fetch('/api/private/media/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setProgress(100);
      onUploadComplete(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
        className="hidden"
      />

      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full p-8 border-2 border-dashed border-surface-600
                   rounded-xl hover:border-accent-500/50 transition-colors
                   text-surface-400 hover:text-accent-500"
      >
        {uploading ? (
          <div>
            <div className="w-full bg-surface-700 rounded-full h-2 mb-2">
              <div
                className="bg-accent-500 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span>Uploading...</span>
          </div>
        ) : (
          <span>Drag & drop or click to upload</span>
        )}
      </button>

      {error && (
        <p className="mt-2 text-sm text-primary-500">{error}</p>
      )}
    </div>
  );
}
```

---

## 7. Flujo de Auto-traducción con DeepL

### 7.1 Diagrama

```
Admin guarda contenido en ES
    → API Route recibe datos
        → Guarda en tabla principal (projects, services, personal_info)
            → Detecta campos traducibles (title, description, bio)
                → Llama a DeepL API con texto en ES
                    → Recibe traducciones EN y PT
                        → Upsert en tabla de traducción
                            → { resource_id, locale, field, value }
```

### 7.2 Implementación del Servicio de Traducción

```typescript
// backend/src/services/translations.ts
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

interface TranslationFields {
  title?: string;
  description?: string;
  bio?: string;
}

export async function translateContent(
  resourceTable: string,
  resourceId: string,
  fields: TranslationFields,
  targetLocales: string[] = ['en', 'pt']
): Promise<void> {
  const supabase = await createSupabaseAdminClient();

  // Recopilar textos a traducir
  const textsToTranslate: string[] = [];
  const fieldNames: string[] = [];

  for (const [fieldName, value] of Object.entries(fields)) {
    if (value) {
      textsToTranslate.push(value);
      fieldNames.push(fieldName);
    }
  }

  if (textsToTranslate.length === 0) return;

  // Llamar a DeepL API
  const response = await fetch(DEEPL_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: textsToTranslate,
      target_lang: targetLocales.map((l) => l.toUpperCase()),
      source_lang: 'ES',
    }),
  });

  if (!response.ok) {
    console.error('DeepL API error:', await response.text());
    throw new Error('Translation failed');
  }

  const data = await response.json();

  // Almacenar traducciones en BD
  const translationsToInsert: any[] = [];

  for (const translation of data.translations) {
    const fieldIndex = textsToTranslate.indexOf(translation.text);
    const fieldName = fieldNames[fieldIndex];
    const targetLocale = translation.detected_source_language === 'EN'
      ? 'en'
      : translation.text === data.translations[fieldIndex]?.text
        ? targetLocales[0]
        : targetLocales[0];

    // Mapear el idioma目标 desde DeepL response
    for (const locale of targetLocales) {
      translationsToInsert.push({
        [`${resourceTable.replace('_translations', '')}_id`]: resourceId,
        locale,
        [fieldName]: translation.text,
      });
    }
  }

  // Upsert traducciones (insertar o actualizar)
  const { error } = await supabase
    .from(`${resourceTable}`)
    .upsert(translationsToInsert, {
      onConflict: `${resourceTable.replace('_translations', '')}_id,locale`,
    });

  if (error) {
    console.error('Error saving translations:', error);
    throw new Error('Failed to save translations');
  }
}
```

### 7.3 Uso en API Routes

```typescript
// En frontend/src/app/api/private/projects/route.ts
import { translateContent } from '@/services/translation';

// Después de guardar el proyecto...
await translateContent(
  'project_translations',
  project.id,
  {
    title: body.title,
    description: body.description,
  }
);
```

### 7.4 Manejo de Errores de DeepL

Si DeepL falla al traducir, el contenido en español se guarda correctamente. Las traducciones EN y PT quedan pendientes:

```typescript
// En la API Route
try {
  await translateContent('project_translations', project.id, {
    title: body.title,
    description: body.description,
  });
} catch (translationError) {
  // El contenido en ES ya está guardado
  // Las traducciones fallaron pero el admin puede reintentar después
  console.error('Translation failed, content saved in ES only:', translationError);

  // Responder con warning al admin
  return NextResponse.json({
    success: true,
    id: project.id,
    warning: 'Content saved but translations failed. You can retry later.',
  });
}
```

---

## 8. Manejo de Errores en la Capa de Datos

### 8.1 Estados de Carga en Server Components

```tsx
// Patrón para Server Components
export default async function Page() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*');

  // Error de consulta
  if (error) {
    console.error('Database error:', error);
    // Next.js captura esto y muestra error.tsx
    throw new Error('Failed to fetch projects');
  }

  // Sin datos
  if (!data || data.length === 0) {
    return <EmptyState message="No projects yet" />;
  }

  return <ProjectList projects={data} />;
}
```

### 8.2 Estados de Carga en Client Components

```tsx
'use client';

import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/private/projects');
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setData(json.projects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Skeleton variant="rectangular" />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;
  if (!data) return <EmptyState message="No data" />;

  return <DataTable data={data} />;
}
```

### 8.3 Códigos de Error Comunes

| Error | Causa | Solución |
|---|---|---|
| `401 Unauthorized` | Token JWT inválido o expirado | Redirigir a `/admin/login` |
| `403 Forbidden` | RLS bloquea la consulta (anon key) | Verificar que se use `service_role` en admin |
| `400 Bad Request` | Datos de entrada inválidos | Verificar validación Zod en Route Handler |
| `413 Payload Too Large` | Archivo excede límite | Reducir tamaño del archivo |
| `500 Internal Server Error` | Error de Supabase o DeepL | Revisar logs en Vercel |
| `503 Service Unavailable` | Supabase caído | Mostrar mensaje de error al usuario |

---

## 9. Cache y Rendimiento

### 9.1 Caché de Datos en Server Components

```tsx
// Opción 1: ISR (Incremental Static Regeneration)
export const revalidate = 60; // Revalidar cada 60 segundos

// Opción 2: Static (build time)
export const dynamic = 'force-static';

// Opción 3: Dynamic (cada request)
export const dynamic = 'force-dynamic';
```

Para un portafolio personal, `revalidate = 60` (1 minuto) es suficiente. El contenido no cambia frecuentemente.

### 9.2 Caché de Imágenes

```tsx
import Image from 'next/image';

<Image
  src={project.image_url}
  alt={project.title}
  width={800}
  height={450}
  loading="lazy"
  className="rounded-xl"
/>
```

Next.js optimiza automáticamente las imágenes de Supabase Storage (via `remotePatterns` en `next.config.ts`).

### 9.3 Caché de API Routes

```typescript
// Forzar cache en Route Handler
export const revalidate = 60;

// O deshabilitar cache
export const dynamic = 'force-dynamic';
```

---

## 10. Variables de Entorno Requeridas

```env
# Frontend (públicas)
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
NEXT_PUBLIC_SITE_URL=https://anthekira.dev

# Backend (secretas - solo server)
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
DEEPL_API_KEY=<deepl-api-key>
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

> ⚠️ Las variables sin `NEXT_PUBLIC_` NUNCA se exponen al cliente. Solo están disponibles en Server Components y Route Handlers.

---

## 11. Dependencias con otros documentos

| Archivo | Relación |
|---|---|
| `00-REQUIREMENTS.md` | Requisitos del CMS y funcionalidades |
| `01-ARCHITECTURE.md` | Arquitectura de capas (Frontend → API → Supabase) |
| `02-DECISIONS.md` | ADR-005 (consulta directa), ADR-006 (auto-traducción DeepL) |
| `03-USER-FLOWS.md` | Flujos de CRUD, upload, traducción |
| `frontend/docs/00-FRONTEND.md` | Configuración de Supabase clients |
| `frontend/docs/02-COMPONENTS.md` | FileUploader, DataTable, FormBuilder |
| `frontend/docs/08-ADMIN-PANEL.md` | Panel admin con CRUDs |
| `frontend/docs/04-I18N.md` | Estrategia de traducción (JSON + DeepL + BD) |
