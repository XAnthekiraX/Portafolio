# 06-BUSINESS-LOGIC.md — Anthekira.dev

## 1. DeepL Auto-translate
```typescript
const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';
const DEEPL_TARGET_LANGUAGES = { en: 'EN-US', pt: 'PT-PT' };

export async function deeplTranslate(text: string, sourceLang = 'ES', targetLang: string) {
  const res = await fetch(DEEPL_API_URL, {
    method: 'POST',
    headers: { 'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ text, source_lang: sourceLang, target_lang: targetLang }),
  });
  if (!res.ok) throw new InternalError(`DeepL failed: ${res.statusText}`);
  return (await res.json()).translations[0].text;
}
```
**Free tier:** 500K chars/mes. Consumo estimado: ~5-10K por guardado completo.

### Estrategia de Reintento
Las traducciones fallidas (`translation_status = 'failed'`) se reintentan manualmente desde el panel admin:
- El endpoint `GET /api/private/stats/translations-pending` expone el conteo de traducciones con estado `failed`.
- Desde el dashboard/admin se muestra un badge "N traducciones pendientes" que enlaza a una acción de reintento.
- El reintento consiste en re-ejecutar `autoTranslate()` para los registros con `translation_status = 'failed'` vía `POST /api/private/translations/retry`.
- No hay reintento automático programado. DeepL API free tier tiene límite de 500K chars/mes, por lo que reintentos automáticos podrían agotar el cuota sin intervención del administrador.

### Auto-translate Orchestrator
```typescript
export async function autoTranslate(table, fkColumn, resourceId, sourceContent: TranslationContent) {
  for (const locale of ['en', 'pt']) {
    try {
      const translatedContent = {};
      for (const [key, text] of Object.entries(sourceContent))
        if (typeof text === 'string' && text.trim())
          translatedContent[key] = await deeplTranslate(text, 'ES', DEEPL_TARGET_LANGUAGES[locale]);
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
**No bloqueante:** Se ejecuta después de responder al cliente (`.then()`). Si falla: `status: 'failed'` + contenido ES como fallback. El administrador puede reintentar desde el panel.

## 2. Slug Generation
```typescript
export function generateSlug(title: string) {
  return title.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // quitar acentos
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/-{2,}/g, '-');
}
// generateUniqueSlug: verifica duplicados en BD, agrega sufijo numérico si existe
```

## 3. Social Links Merge (JSONB Partial Update)
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

## 4. File Validation (Storage Upload)
```typescript
const BUCKET_CONFIGS = {
  profile: { maxSizeBytes: 2 * 1024 * 1024, allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'] },
  projects: { maxSizeBytes: 5 * 1024 * 1024, allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'] },
  cv: { maxSizeBytes: 10 * 1024 * 1024, allowedMimeTypes: ['application/pdf'] },
};
export function validateFile(file: File, bucket: string): { valid: boolean; error?: string };
```

## 5. Error Classes
```typescript
class AppError extends Error { constructor(message, statusCode, code?, details?) }
class NotFoundError extends AppError { constructor(resource='Resource') { super(`${resource} not found`, 404, 'NOT_FOUND') } }
class UnauthorizedError extends AppError { constructor(message='Unauthorized') { super(message, 401, 'UNAUTHORIZED') } }
class ValidationError extends AppError { constructor(details) { super('Validation failed', 400, 'VALIDATION_ERROR', details) } }
class ConflictError extends AppError { constructor(message='Already exists') { super(message, 409, 'CONFLICT') } }
class InternalError extends AppError { constructor(message='Internal error') { super(message, 500, 'INTERNAL_ERROR') } }
// handleApiError(): transforma AppError y ZodError a NextResponse JSON
```

## 6. Locale Helpers
```typescript
export function getLocaleFromRequest(request: NextRequest): string {
  const locale = request.nextUrl.searchParams.get('locale') || 'es';
  return ['es', 'en', 'pt'].includes(locale) ? locale : 'es';
}
// applyTranslation(): extrae campos del content JSONB con fallback a ES y verificación de translation_status === 'completed'
```

## 7. Service Files
```
backend/src/services/{auth, personal-info, projects, saas, skills, technologies, services, stats, translations, contact, education, dashboard}.ts
```

Ver estructura completa en `backend/00-BACKEND.md` §2.
