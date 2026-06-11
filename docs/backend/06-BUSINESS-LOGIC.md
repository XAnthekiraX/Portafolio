# 06-BUSINESS-LOGIC.md — Anthekira.dev — Lógica de Negocio y Utilidades

## 1. Propósito

Este documento define la lógica de negocio y utilidades compartidas del backend de Anthekira.dev. Incluye el servicio de auto-traducción con DeepL, generación de slugs, validaciones, errores personalizados, y helpers reutilizables.

---

## 2. DeepL Auto-translate Service

### 2.1 Integración con DeepL API

```typescript
// src/services/translations.ts
import { createClient } from '@/lib/supabase/admin';

const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

// Mapeo de locales de la app a códigos de DeepL
const DEEPL_TARGET_LANGUAGES: Record<string, string> = {
  en: 'EN-US',
  pt: 'PT-PT',
};

export async function deeplTranslate(
  text: string,
  sourceLang: string = 'ES',
  targetLang: string
): Promise<string> {
  if (!text.trim()) return '';

  const response = await fetch(DEEPL_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      text,
      source_lang: sourceLang,
      target_lang: targetLang,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`DeepL API error (${response.status}):`, errorBody);
    throw new InternalError(`DeepL translation failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.translations[0]?.text ?? text;
}
```

> **⚠️ DeepL Free Tier:** 500,000 caracteres/mes. Para un portafolio personal con ~20 proyectos y ~10 servicios, el consumo estimado es de ~5,000-10,000 caracteres por guardado completo, muy por debajo del límite mensual.

### 2.2 Auto-translate Orchestrator

Función genérica que coordina la traducción de cualquier recurso:

```typescript
// src/services/translations.ts (continuación)

type TranslatableTable =
  | 'project_translations'
  | 'service_translations'
  | 'saas_project_translations'
  | 'personal_info_translations';

type TranslationFields = Record<string, string>; // { title: "...", description: "..." }

export async function autoTranslate(
  table: TranslatableTable,
  fkColumn: string,
  resourceId: string,
  sourceFields: TranslationFields
): Promise<{ success: boolean; error?: string }> {
  const locales = ['en', 'pt'];
  const results: { locale: string; success: boolean; error?: string }[] = [];

  for (const locale of locales) {
    try {
      const translations: Record<string, string> = {};

      for (const [field, text] of Object.entries(sourceFields)) {
        if (!text.trim()) continue;
        const translated = await deeplTranslate(text, 'ES', DEEPL_TARGET_LANGUAGES[locale]);
        translations[field] = translated;
      }

      if (Object.keys(translations).length === 0) continue;

      // Upsert: insertar o actualizar si ya existe traducción para ese locale
      const { error } = await supabaseAdmin
        .from(table)
        .upsert(
          {
            [fkColumn]: resourceId,
            locale,
            ...translations,
          },
          { onConflict: `${fkColumn},locale` }
        );

      if (error) {
        console.error(`Failed to save ${locale} translation for ${table}:`, error);
        results.push({ locale, success: false, error: error.message });
      } else {
        results.push({ locale, success: true });
      }
    } catch (error) {
      console.error(`Translation failed for ${locale}:`, error);
      results.push({ locale, success: false, error: String(error) });
    }
  }

  const allFailed = results.every(r => !r.success);
  const someFailed = results.some(r => !r.success);

  if (allFailed) {
    return { success: false, error: 'All translations failed. Content saved in Spanish only.' };
  }
  if (someFailed) {
    return { success: true, error: 'Some translations failed. Partial translations saved.' };
  }
  return { success: true };
}
```

### 2.3 Uso en Route Handlers

```typescript
// Ejemplo en POST /api/private/projects
export async function POST(request: NextRequest) {
  const body = await request.json();
  const validated = createProjectSchema.parse(body);
  const userId = request.headers.get('x-user-id')!;

  // 1. Insertar proyecto
  const { data: project, error } = await supabaseAdmin
    .from('projects')
    .insert({
      user_id: userId,
      title: validated.title,
      description: validated.description,
      slug: validated.slug ?? generateSlug(validated.title),
      project_url: validated.project_url ?? '',
      repository_url: validated.repository_url ?? '',
      image_url: validated.image_url ?? '',
      status: validated.status ?? 'draft',
      display_order: validated.display_order ?? 0,
    })
    .select()
    .single();

  if (error) throw new InternalError('Failed to create project');
  const projectId = project.id;

  // 2. Asociar skills
  if (validated.skill_ids?.length) {
    const skillRecords = validated.skill_ids.map(skill_id => ({
      project_id: projectId,
      skill_id,
    }));
    await supabaseAdmin.from('project_skills').insert(skillRecords);
  }

  // 3. Auto-traducción (no bloqueante — no debe impedir la creación)
  autoTranslate('project_translations', 'project_id', projectId, {
    title: validated.title,
    description: validated.description,
  }).then(result => {
    if (!result.success) {
      console.warn('Translation warning:', result.error);
      // El contenido se guardó en español, las traducciones se reintentarán
    }
  });

  return NextResponse.json(
    { success: true, data: { id: projectId } },
    { status: 201 }
  );
}
```

> **⚠️ No bloqueante:** La auto-traducción se ejecuta después de responder al cliente (`.then()`). Si DeepL falla, el contenido se guarda en español y se registra un warning. El admin puede reintentar la traducción manualmente o el sistema puede reintentar en un job futuro.

### 2.4 Tablas de Traducción

| Recurso | Tabla | FK Column | Campos | Locales |
|---|---|---|---|---|
| Projects | `project_translations` | `project_id` | `title`, `description` | `en`, `pt` |
| Services | `service_translations` | `service_id` | `title`, `description` | `en`, `pt` |
| SaaS Projects | `saas_project_translations` | `saas_project_id` | `name`, `description` | `en`, `pt` |
| Personal Info | `personal_info_translations` | `personal_info_id` | `bio` | `en`, `pt` |

---

## 3. Slug Generation

```typescript
// src/lib/utils.ts

/**
 * Genera un slug URL-friendly a partir de un título en español.
 * Ejemplo: "Mi Proyecto Increíble" → "mi-proyecto-increible"
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')     // Quitar acentos y diacríticos
    .replace(/[^a-z0-9]+/g, '-')          // Reemplazar caracteres no alfanuméricos por guiones
    .replace(/^-+|-+$/g, '')              // Quitar guiones iniciales y finales
    .replace(/-{2,}/g, '-');              // Colapsar guiones múltiples
}

/**
 * Verifica si un slug ya existe y genera uno único agregando un sufijo numérico.
 * Ejemplo: "mi-proyecto" → "mi-proyecto-2" (si ya existe)
 */
export async function generateUniqueSlug(
  supabase: SupabaseClient,
  table: string,
  baseSlug: string,
  excludeId?: string
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    let query = supabase
      .from(table)
      .select('id', { count: 'exact', head: true })
      .eq('slug', slug);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { count } = await query;
    if (count === 0) return slug;

    counter++;
    slug = `${baseSlug}-${counter}`;
  }
}
```

---

## 4. Social Links Merge (JSONB Partial Update)

Cuando el admin actualiza `social_links` vía `PUT /api/private/personal-info`, no debe reemplazar el objeto JSONB completo, sino hacer merge con los valores existentes.

```typescript
// src/services/personal-info.ts

/**
 * Merge parcial de social_links.
 * - Campos enviados: se actualizan
 * - Campos con valor null: se eliminan
 * - Campos no enviados: se conservan
 */
export function mergeSocialLinks(
  existing: SocialLinks,
  updates: Partial<SocialLinks>
): SocialLinks {
  const merged = { ...existing };

  for (const [key, value] of Object.entries(updates)) {
    if (value === null) {
      // Eliminar la clave si se envía null explícitamente
      delete merged[key as keyof SocialLinks];
    } else if (value !== undefined) {
      // Actualizar si se envía un valor
      merged[key as keyof SocialLinks] = value;
    }
    // Si el valor es undefined (no se envió), conservar el existente
  }

  return merged;
}

// Uso en el Route Handler:
// export async function PUT(request: NextRequest) {
//   const body = updatePersonalInfoSchema.parse(await request.json());
//   const userId = request.headers.get('x-user-id')!;
//
//   const { data: existing } = await supabaseAdmin
//     .from('personal_info')
//     .select('social_links')
//     .eq('user_id', userId)
//     .single();
//
//   const updateData: any = { ...body };
//
//   if (body.social_links) {
//     updateData.social_links = mergeSocialLinks(
//       existing?.social_links ?? {},
//       body.social_links
//     );
//   }
//
//   const { data } = await supabaseAdmin
//     .from('personal_info')
//     .update(updateData)
//     .eq('user_id', userId)
//     .select()
//     .single();
//
//   return NextResponse.json({ success: true, data });
// }
```

---

## 5. File Validation (Media Upload)

```typescript
// src/lib/upload.ts

interface UploadConfig {
  maxSizeBytes: number;
  allowedMimeTypes: string[];
}

const BUCKET_CONFIGS: Record<string, UploadConfig> = {
  profile: {
    maxSizeBytes: 2 * 1024 * 1024,  // 2 MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  projects: {
    maxSizeBytes: 5 * 1024 * 1024,  // 5 MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  media: {
    maxSizeBytes: 5 * 1024 * 1024,  // 5 MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  },
  cv: {
    maxSizeBytes: 10 * 1024 * 1024, // 10 MB
    allowedMimeTypes: ['application/pdf'],
  },
};

export function validateFile(
  file: File,
  bucket: keyof typeof BUCKET_CONFIGS
): { valid: boolean; error?: string } {
  const config = BUCKET_CONFIGS[bucket];

  if (!config) {
    return { valid: false, error: `Invalid bucket: ${bucket}` };
  }

  if (!config.allowedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type '${file.type}' not allowed for bucket '${bucket}'. Allowed: ${config.allowedMimeTypes.join(', ')}`,
    };
  }

  if (file.size > config.maxSizeBytes) {
    return {
      valid: false,
      error: `File exceeds ${config.maxSizeBytes / (1024 * 1024)}MB limit for bucket '${bucket}'`,
    };
  }

  return { valid: true };
}

/**
 * Obtiene dimensiones de una imagen (width, height).
 * Solo para tipos image/jpeg, image/png, image/webp.
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
  if (!file.type.startsWith('image/')) return Promise.resolve(null);

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}

/**
 * Genera un nombre de archivo único para Storage.
 * Ejemplo: "d4f2e1a0-...webp"
 */
export function generateStorageFileName(file: File): string {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
  return `${crypto.randomUUID()}.${extension}`;
}
```

---

## 6. Error Classes

```typescript
// src/lib/errors.ts

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code?: string;
  public readonly details?: Record<string, string[]>;

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
    details?: Record<string, string[]>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ValidationError extends AppError {
  constructor(details: Record<string, string[]>) {
    super('Validation failed', 400, 'VALIDATION_ERROR', details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(message, 409, 'CONFLICT');
  }
}

export class InternalError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(message, 500, 'INTERNAL_ERROR');
  }
}

// ---------- Manejador global de errores para API Routes ----------
export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation failed',
        details: formatZodErrors(error),
      },
      { status: 400 }
    );
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
        details: error.details,
      },
      { status: error.statusCode }
    );
  }

  // Error inesperado
  console.error('Unhandled error:', error);
  return NextResponse.json(
    { success: false, error: 'Internal server error' },
    { status: 500 }
  );
}
```

---

## 7. Zod Error Formatter

```typescript
// src/lib/validation.ts (extensión)

import { ZodError, ZodIssue } from 'zod';

/**
 * Convierte errores de Zod en un Record<string, string[]> para el envelope API.
 * Ejemplo:
 *   { "email": ["Invalid email format"], "message": ["Must be at least 10 characters"] }
 */
export function formatZodErrors(error: ZodError): Record<string, string[]> {
  const details: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const path = issue.path.join('.') || '_root';

    if (!details[path]) {
      details[path] = [];
    }

    details[path].push(issue.message);
  }

  return details;
}
```

---

## 8. Locale Helpers

```typescript
// src/lib/i18n.ts (extensión para API)

const SUPPORTED_LOCALES = ['es', 'en', 'pt'] as const;
const DEFAULT_LOCALE = 'es';

/**
 * Extrae y valida el locale desde los query params de una request.
 * Si no se especifica o es inválido, retorna 'es'.
 */
export function getLocaleFromRequest(request: NextRequest): string {
  const locale = request.nextUrl.searchParams.get('locale') || DEFAULT_LOCALE;
  return SUPPORTED_LOCALES.includes(locale as any) ? locale : DEFAULT_LOCALE;
}

/**
 * Query helper: aplica traducción con fallback al idioma fuente (ES).
 * Útil para Server Components y API pública.
 *
 * Uso en Supabase query:
 *   .select(`*, project_translations!left(title, description, locale)`)
 *   → post-processing con applyTranslation()
 */
export function applyTranslation<T extends Record<string, any>>(
  item: T,
  translations: Array<{ locale: string; [key: string]: any }> | null,
  locale: string,
  fields: string[]
): T {
  if (!translations || locale === DEFAULT_LOCALE) return item;

  const translation = translations.find(t => t.locale === locale);
  if (!translation) return item; // Fallback a ES

  const result = { ...item };
  for (const field of fields) {
    if (translation[field]) {
      result[field] = translation[field];
    }
  }
  return result;
}
```

---

## 9. Supabase Client Factory

```typescript
// src/lib/supabase/index.ts — Factory centralizado

import { createServerClient } from '@supabase/ssr';
import { createBrowserClient } from '@supabase/ssr';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import type { Cookies } from '@supabase/ssr';

/**
 * Crea un cliente Supabase para Server Components.
 * Usa cookies de la request para mantener la sesión.
 */
export function createServerSupabase(cookieStore: ReturnType<typeof cookies>) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}

/**
 * Crea un cliente Supabase para Client Components (browser).
 */
export function createBrowserSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Crea un cliente Supabase con service_role (solo server).
 * Bypass de RLS para operaciones administrativas.
 */
export function createAdminSupabase() {
  return createAdminClient(
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

/**
 * Crea un cliente Supabase para Route Handlers (Next.js request context).
 * Usa cookies de la request y propaga cambios en la respuesta.
 */
export function createRouteHandlerSupabase(
  request: NextRequest,
  response?: NextResponse
) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({ name, value, ...options });
          if (response) {
            response.cookies.set({ name, value, ...options });
          }
        },
        remove(name: string, options: any) {
          request.cookies.set({ name, value: '', ...options });
          if (response) {
            response.cookies.set({ name, value: '', ...options });
          }
        },
      },
    }
  );
}
```

---

## 10. Archivos de Servicio Recomendados

```
src/services/
├── auth.ts              # login()
├── personal-info.ts     # getPersonalInfo(), mergeSocialLinks()
├── cv.ts                # uploadCv()
├── projects.ts          # getProjects(), createProject(), etc.
├── saas.ts              # getSaasProjects(), createSaasProject(), etc.
├── skills.ts            # CRUD skills
├── technologies.ts      # CRUD technologies
├── services.ts          # CRUD services
├── media.ts             # uploadMedia(), deleteMedia()
├── messages.ts          # getMessages(), markAsRead()
├── settings.ts          # getSettings(), updateSettings()
├── dashboard.ts         # getActiveCount()
├── translations.ts      # autoTranslate(), deeplTranslate()
└── contact.ts           # submitContactMessage()
```

---

## 11. Dependencias con otros documentos

| Archivo | Relación |
|---|---|
| `02-DATABASE.md` | Tablas de traducción que este módulo escribe |
| `01-ENTITIES.md` | Tipos SocialLinks, Zod schemas que validan input |
| `03-API-PUBLIC.md` | Endpoints públicos que usan locale helpers |
| `04-API-PRIVATE.md` | Endpoints privados que usan autoTranslate() y mergeSocialLinks() |
| `05-AUTHENTICATION.md` | Clientes Supabase que este módulo utiliza |
