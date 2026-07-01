---
doc_id: frontend-seo
version: 1.0.0
last_updated: 2026-07-01
owner: Anthekira
type: guide
dependencies: [frontend-routes]
tags: [frontend, seo, metadata, opengraph, sitemap, json-ld]
ai_context:
  primary_use: SEO strategy, metadata by route, sitemap generation, JSON-LD, and technical SEO requirements
  key_constraints: [generateMetadata per public page, canonical URLs per locale, LCP < 2.5s, semantic HTML]
  target_audience: Frontend developers, AI agents implementing SEO features
---

# 05-SEO.md — Anthekira.dev

## 1. Estrategia
**Keywords:** full-stack developer, web development, backend, AI Native Development, SaaS, software architect.  
**Público:** Reclutadores técnicos, clientes freelance, empresas.

## 2. Indexación
| Tipo | Indexación |
|---|---|
| `/{lang}/` (todas) | `index, follow` |
| `/admin/*` | `noindex, nofollow` |
| `/api/*` | `noindex, nofollow` |

## 3. Metadatos por Ruta
Cada página pública exporta `generateMetadata()` con:
```typescript
return {
  title: t('meta.title'),       // "< 60 chars"
  description: t('meta.description'), // "< 160 chars"
  openGraph: { title, description, url, siteName, images: [{ url, width: 1200, height: 630 }], locale, type: 'website' },
  twitter: { card: 'summary_large_image', title, description, images },
  alternates: { canonical, languages: { es, en, pt } },
  robots: { index: true, follow: true },
};
```

| Ruta | Namespace i18n | OG Image |
|---|---|---|
| `/{lang}/` | `hero.meta` | `/images/og-home.jpg` |
| `/{lang}/projects` | `projects.meta` | `/images/og-projects.jpg` |
| `/{lang}/projects/[slug]` | Dinámico (BD) | Imagen del proyecto |
| `/{lang}/about` | `about.meta` | `/images/og-about.jpg` |
| `/{lang}/contact` | `contact.meta` | `/images/og-contact.jpg` |

## 4. Sitemap
```typescript
// frontend/src/app/sitemap.ts — Genera URLs localizadas para rutas estáticas + proyectos dinámicos
// frontend/src/app/robots.ts — Allow: /, /es/, /en/, /pt/. Disallow: /admin/, /api/
```

## 5. SEO Técnico
- HTML semántico: header, nav, main, section, article, footer
- Un solo h1 por página. Jerarquía sin saltos
- Canonical URLs por idioma (evitar contenido duplicado)
- JSON-LD Person en Hero: name, jobTitle, sameAs, knowsAbout
- **LCP < 2.5s:** Server Components, imágenes optimizadas, next/font display:swap
- **CLS < 0.1:** Dimensiones explícitas en imágenes (width/height)
- Alt text descriptivo en imágenes relevantes
- Links con texto descriptivo (no "click here")
