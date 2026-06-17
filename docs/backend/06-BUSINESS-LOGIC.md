# 06-BUSINESS-LOGIC.md — Anthekira.dev

## 1. DeepL Auto-translate (Síncrono y Paralelo — ADR-017)
```typescript
const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';
const DEEPL_TARGET_LANGUAGES = { en: 'EN-US', pt: 'PT-PT' };
const DEEPL_TIMEOUT_MS = 8000;

export async function deeplTranslate(text: string, sourceLang = 'ES', targetLang: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEEPL_TIMEOUT_MS);
  
  try {
    const res = await fetch(DEEPL_API_URL, {
      method: 'POST',
      headers: { 'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ text, source_lang: sourceLang, target_lang: targetLang }),
      signal: controller.signal,
    });
    if (!res.ok) throw new InternalError(`DeepL failed: ${res.statusText}`);
    return (await res.json()).translations[0].text;
  } finally {
    clearTimeout(timeout);
  }
}
```
**Free tier:** 500K chars/mes. Consumo estimado: ~5-10K por guardado completo.

### Auto-translate Orchestrator (Síncrono + Paralelo)
```typescript
export async function autoTranslate(
  entityType: EntityType,
  entityId: string,
  sourceContent: Record<string, any>
): Promise<{ locale: string; status: TranslationStatus }[]> {
  const results = await Promise.all(
    ['en', 'pt'].map(async (locale) => {
      try {
        const translatedContent: Record<string, string> = {};
        for (const [key, text] of Object.entries(sourceContent))
          if (typeof text === 'string' && text.trim())
            translatedContent[key] = await deeplTranslate(text, 'ES', DEEPL_TARGET_LANGUAGES[locale]);
        
        return { locale, content: translatedContent, translation_status: 'completed' as const };
      } catch {
        // En fallo, guardamos el contenido fuente como fallback pero marcamos como failed
        return { locale, content: sourceContent, translation_status: 'failed' as const };
      }
    })
  );

  // Guardar ambos resultados en la tabla genérica entity_translations
  await Promise.all(
    results.map(r =>
      supabaseAdmin.from('entity_translations').upsert(
        {
          entity_type: entityType,
          entity_id: entityId,
          locale: r.locale,
          content: r.content,
          translation_status: r.translation_status,
        },
        { onConflict: 'entity_type,entity_id,locale' }
      )
    )
  );

  return results.map(r => ({ locale: r.locale, status: r.translation_status }));
}
```

**Cambios clave:**
- ✅ **Paralelo:** `Promise.all` ejecuta ambas traducciones simultáneamente (mitad de latencia)
- ✅ **Síncrono:** Se completa antes de responder al cliente (no hay riesgo de pérdida por serverless termination)
- ✅ **Timeout:** 8s por llamada DeepL para evitar bloqueos
- ✅ **Estados simplificados:** Solo `completed` | `failed` (se eliminaron `pending` y `translating`)
- ✅ **Tabla genérica:** Usa `entity_translations` en lugar de tablas específicas

### Estrategia de Reintento
Las traducciones fallidas (`translation_status = 'failed'`) se reintentan manualmente desde el panel admin:
- Endpoint `GET /api/private/stats/translations-pending` expone el conteo de traducciones fallidas
- Dashboard admin muestra badge con "N traducciones fallidas" que enlaza a reintento
- `POST /api/private/translations/retry` re-ejecuta `autoTranslate()` para registros fallidos
- Sin reintento automático (control de cuota DeepL: 500K chars/mes)

## 2. CRUD Genérico (ADR-013)

```typescript
// backend/src/services/generic.ts
export interface CrudConfig<T> {
  table: string;
  schema: { create: z.ZodSchema<T>; update: z.ZodSchema<Partial<T>> };
  translations?: { entityType: EntityType; fields: string[] };
  slug?: { source: string; unique: boolean };
  searchFields?: string[];
}

export function createCrudService<T extends { id: string }>(table: string, config: CrudConfig<T>) {
  const supabase = createAdminClient();

  return {
    async list(filters?: Record<string, any>): Promise<T[]> {
      let query = supabase.from(table).select('*').order('display_order', { ascending: true });
      if (filters) {
        for (const [key, value] of Object.entries(filters))
          if (value !== undefined) query = query.eq(key, value);
      }
      const { data, error } = await query;
      if (error) throw new InternalError(error.message);
      return data as T[];
    },

    async getById(id: string): Promise<T | null> {
      const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
      if (error?.code === 'PGRST116') return null;
      if (error) throw new InternalError(error.message);
      return data as T;
    },

    async create(data: T): Promise<T> {
      // Generar slug si está configurado
      if (config.slug) {
        const slug = await generateUniqueSlug(data[config.slug.source] as string, table);
        data = { ...data, slug };
      }

      const { data: created, error } = await supabase.from(table).insert(data).select().single();
      if (error) throw new ConflictError(error.message);

      // Auto-traducir si está configurado
      if (config.translations) {
        const sourceContent: Record<string, any> = {};
        for (const field of config.translations.fields)
          sourceContent[field] = data[field];
        
        await autoTranslate(config.translations.entityType, created.id, sourceContent);
      }

      return created as T;
    },

    async update(id: string, data: Partial<T>): Promise<T> {
      // Re-generar slug si cambió el campo fuente
      if (config.slug && data[config.slug.source]) {
        const slug = await generateUniqueSlug(data[config.slug.source] as string, table, id);
        data = { ...data, slug };
      }

      const { data: updated, error } = await supabase.from(table).update(data).eq('id', id).select().single();
      if (error) throw new NotFoundError();

      // Re-traducir si cambió algún campo traducible
      if (config.translations) {
        const sourceContent: Record<string, any> = {};
        let shouldRetranslate = false;
        for (const field of config.translations.fields) {
          if (data[field]) {
            sourceContent[field] = data[field];
            shouldRetranslate = true;
          }
        }
        if (shouldRetranslate) {
          await autoTranslate(config.translations.entityType, id, sourceContent);
        }
      }

      return updated as T;
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw new InternalError(error.message);
      // Las traducciones y relaciones N:M se eliminan por CASCADE en BD
    },
  };
}
```

## 3. Slug Generation
```typescript
export function generateSlug(title: string) {
  return title.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // quitar acentos
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/-{2,}/g, '-');
}

// generateUniqueSlug: verifica duplicados en BD, agrega sufijo numérico si existe
import { createAdminClient } from '@/lib/supabase/admin';

export async function generateUniqueSlug(title: string, table: string, excludeId?: string): Promise<string> {
  const supabase = createAdminClient();
  let slug = generateSlug(title);
  let counter = 0;
  let exists = true;

  while (exists) {
    const candidate = counter === 0 ? slug : `${slug}-${counter}`;
    const query = supabase.from(table).select('id').eq('slug', candidate);
    if (excludeId) query.neq('id', excludeId);
    
    const { data } = await query.maybeSingle();
    exists = !!data;
    if (exists) counter++;
    else slug = candidate;
  }

  return slug;
}
```

## 4. Social Links Merge (JSONB Partial Update)
```typescript
export function mergeSocialLinks(existing: SocialLinks, updates: Partial<SocialLinks>): SocialLinks {
  const merged = { ...existing };
  for (const [key, value] of Object.entries(updates)) {
    if (value === null) delete merged[key as keyof SocialLinks];
    else if (value !== undefined) merged[key as keyof SocialLinks] = value;
  }
  return merged;
}
```

## 5. File Validation (Storage Upload)
```typescript
const BUCKET_CONFIGS = {
  profile: { maxSizeBytes: 2 * 1024 * 1024, allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'] },
  projects: { maxSizeBytes: 5 * 1024 * 1024, allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'] },
  cv: { maxSizeBytes: 10 * 1024 * 1024, allowedMimeTypes: ['application/pdf'] },
};
export function validateFile(file: File, bucket: string): { valid: boolean; error?: string };
```

## 6. Error Classes
```typescript
class AppError extends Error { constructor(message, statusCode, code?, details?) }
class NotFoundError extends AppError { constructor(resource='Resource') { super(`${resource} not found`, 404, 'NOT_FOUND') } }
class UnauthorizedError extends AppError { constructor(message='Unauthorized') { super(message, 401, 'UNAUTHORIZED') } }
class ValidationError extends AppError { constructor(details) { super('Validation failed', 400, 'VALIDATION_ERROR', details) } }
class ConflictError extends AppError { constructor(message='Already exists') { super(message, 409, 'CONFLICT') } }
class TooManyRequestsError extends AppError { constructor(message='Too many requests') { super(message, 429, 'RATE_LIMITED') } }
class InternalError extends AppError { constructor(message='Internal error') { super(message, 500, 'INTERNAL_ERROR') } }
// handleApiError(): transforma AppError y ZodError a NextResponse JSON
```

## 7. Locale Helpers
```typescript
export function getLocaleFromRequest(request: NextRequest): string {
  const locale = request.nextUrl.searchParams.get('locale') || 'es';
  return ['es', 'en', 'pt'].includes(locale) ? locale : 'es';
}

// applyTranslation(): extrae campos del content JSONB con fallback a ES
// Usa entity_translations genérica en lugar de tablas específicas
export function applyTranslation<T>(
  item: T,
  translations: Array<{ locale: string; content: Record<string, any>; translation_status: string }>,
  locale: string,
  fields: string[]
): T {
  if (!translations || locale === 'es') return item;
  const t = translations.find(t => t.locale === locale && t.translation_status === 'completed');
  if (!t) return item; // fallback a ES (contenido de la tabla principal)
  const result = { ...item } as any;
  for (const field of fields)
    if (t.content?.[field]) result[field] = t.content[field];
  return result;
}
```

## 8. Rate Limiting Helper
```typescript
// backend/src/lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Login: 5 intentos por minuto por IP
export const loginRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  prefix: "rate:login",
});

// Contact: 3 envíos por hora por IP
export const contactRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "3600 s"),
  prefix: "rate:contact",
});
```

## 9. CSRF Token Helper
```typescript
// backend/src/lib/auth/csrf.ts
import { NextRequest } from 'next/server';

export function validateCsrf(request: NextRequest): boolean {
  const cookieToken = request.cookies.get('csrf-token')?.value;
  const headerToken = request.headers.get('X-CSRF-Token');
  
  if (!cookieToken || !headerToken) return false;
  
  // Timing-safe comparison
  if (cookieToken.length !== headerToken.length) return false;
  let mismatch = 0;
  for (let i = 0; i < cookieToken.length; i++) {
    mismatch |= cookieToken.charCodeAt(i) ^ headerToken.charCodeAt(i);
  }
  return mismatch === 0;
}
```

## 10. Generic Handler (API Route wrapper)
```typescript
// backend/src/lib/generic/handler.ts
export function createCrudHandler(service: ReturnType<typeof createCrudService>) {
  return {
    async GET(request: NextRequest) {
      try {
        const searchParams = request.nextUrl.searchParams;
        const filters: Record<string, any> = {};
        searchParams.forEach((value, key) => { filters[key] = value; });
        
        const data = await service.list(filters);
        return NextResponse.json({ success: true, data });
      } catch (error) {
        return handleApiError(error);
      }
    },

    async POST(request: NextRequest) {
      try {
        // Validar CSRF
        if (!validateCsrf(request)) {
          return NextResponse.json({ success: false, error: 'CSRF token inválido' }, { status: 403 });
        }

        const body = await request.json();
        const data = await service.create(body);
        return NextResponse.json({ success: true, data }, { status: 201 });
      } catch (error) {
        return handleApiError(error);
      }
    },

    async PUT(request: NextRequest, { params }: { params: { id: string } }) {
      try {
        if (!validateCsrf(request)) {
          return NextResponse.json({ success: false, error: 'CSRF token inválido' }, { status: 403 });
        }

        const body = await request.json();
        const data = await service.update(params.id, body);
        return NextResponse.json({ success: true, data });
      } catch (error) {
        return handleApiError(error);
      }
    },

    async DELETE(request: NextRequest, { params }: { params: { id: string } }) {
      try {
        if (!validateCsrf(request)) {
          return NextResponse.json({ success: false, error: 'CSRF token inválido' }, { status: 403 });
        }

        await service.delete(params.id);
        return NextResponse.json({ success: true, data: null });
      } catch (error) {
        return handleApiError(error);
      }
    },
  };
}
```

## 11. Service Files
```
backend/src/services/
├── auth.ts              # Login + logout
├── personal-info.ts     # Profile CRUD (manual, por merge social_links)
├── projects.ts          # Projects CRUD (usa createCrudService)
├── skills.ts            # Skills CRUD (usa createCrudService)
├── technologies.ts      # Technologies CRUD (usa createCrudService)
├── education.ts         # Education CRUD (usa createCrudService)
├── services.ts          # Services CRUD (usa createCrudService)
├── translations.ts      # Retry traducciones fallidas
├── contact.ts           # Messages management
├── stats.ts             # Dashboard counts
└── generic.ts           # createCrudService()
```

> **Nota:** Los servicios que usan `createCrudService` son mínimos — solo definen la configuración y exportan el servicio. La lógica CRUD real está en `generic.ts`.

Ver estructura completa en `backend/00-BACKEND.md` §2.
