# 05-SEO.md — Anthekira.dev — Estrategia SEO

## 1. Propósito

Definir la estrategia SEO del sitio para maximizar la visibilidad profesional en motores de búsqueda, facilitando que reclutadores y clientes encuentren el portafolio.

---

## 2. Estrategia General

### 2.1 Palabras Clave Objetivo

| Grupo | Palabras clave |
|---|---|
| **Desarrollo Web** | Full-stack developer, web developer, software engineer, frontend developer, backend developer |
| **Desarrollo Backend** | Backend developer, API developer, Node.js developer, PostgreSQL developer |
| **Full Stack** | Full-stack developer, software architect, AI Native Development |
| **AI & Automatización** | AI Native Development, automation developer, AI-powered development |
| **SaaS** | SaaS developer, product developer, freelance developer |

### 2.2 Público SEO

- **Reclutadores técnicos** que buscan desarrolladores con stack específico
- **Clientes freelance** que necesitan servicios de desarrollo
- **Empresas** que buscan desarrolladores full-stack

### 2.3 Indexación

| Tipo de ruta | Indexación |
|---|---|
| `/{lang}/` (Home) | `index, follow` |
| `/{lang}/projects` | `index, follow` |
| `/{lang}/projects/[slug]` | `index, follow` |
| `/{lang}/about` | `index, follow` |
| `/{lang}/contact` | `index, follow` |
| `/admin/*` | `noindex, nofollow` |
| `/api/*` | `noindex, nofollow` |

---

## 3. Metadatos por Ruta

Cada página pública debe exportar una función `generateMetadata()` con los siguientes campos mínimos:

```typescript
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'projects.meta' });

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('og_title'),
      description: t('og_description'),
      url: `https://anthekira.dev/${locale}/projects`,
      siteName: 'Anthekira.dev',
      images: [
        {
          url: '/images/og-projects.jpg',
          width: 1200,
          height: 630,
          alt: 'Anthekira.dev Projects',
        },
      ],
      locale: locale === 'es' ? 'es_ES' : locale === 'en' ? 'en_US' : 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('og_title'),
      description: t('og_description'),
      images: ['/images/og-projects.jpg'],
    },
    alternates: {
      canonical: `https://anthekira.dev/${locale}/projects`,
      languages: {
        es: 'https://anthekira.dev/es/projects',
        en: 'https://anthekira.dev/en/projects',
        pt: 'https://anthekira.dev/pt/projects',
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
```

### 3.1 Tabla de Metadatos por Ruta

| Ruta | Namespace i18n | Título (ejemplo ES) | Descripción (ejemplo ES) | OG Image |
|---|---|---|---|---|
| `/{lang}/` | `hero.meta` | "Anthekira.dev — Desarrollador Full-Stack" | "Desarrollador full-stack especializado en AI Native Development" | `/images/og-home.jpg` |
| `/{lang}/projects` | `projects.meta` | "Proyectos — Anthekira.dev" | "Conoce los proyectos en los que he trabajado" | `/images/og-projects.jpg` |
| `/{lang}/projects/[slug]` | Dinámico (desde BD) | "{Project Name} — Anthekira.dev" | "{Project Description}" | Imagen del proyecto |
| `/{lang}/about` | `about.meta` | "Sobre Mí — Anthekira.dev" | "Conoce más sobre mi trayectoria profesional" | `/images/og-about.jpg` |
| `/{lang}/contact` | `contact.meta` | "Contacto — Anthekira.dev" | "Ponte en contacto conmigo" | `/images/og-contact.jpg` |

---

## 4. Open Graph y Twitter Cards

### 4.1 Imágenes OG por Sección

Las imágenes OG deben:
- Medir **1200×630px** (proporción 1.91:1)
- Incluir el nombre "Anthekira.dev" y el título de la sección
- Usar la paleta de colores (rojo #DC2626, cian #06B6D4, fondo oscuro)
- Estar en formato JPG o PNG, optimizadas (< 100KB)

Ubicación: `public/images/og-*.jpg`

```
public/images/
├── og-home.jpg         # OG por defecto (Hero)
├── og-projects.jpg     # Sección proyectos
├── og-about.jpg        # Sección sobre mí
└── og-contact.jpg      # Sección contacto
```

### 4.2 Configuración Global en RootLayout

```typescript
// frontend/src/app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://anthekira.dev'),
  openGraph: {
    siteName: 'Anthekira.dev',
    type: 'website',
    locale: 'es_ES',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@anthekira', // Handle de Twitter (si aplica)
  },
};
```

---

## 5. Sitemap

### 5.1 Generación con `generateSitemaps`

Next.js App Router permite generar sitemaps dinámicos usando la función `generateSitemaps()`:

```typescript
// frontend/src/app/sitemap.ts
import { MetadataRoute } from 'next';

const locales = ['es', 'en', 'pt'];
const baseUrl = 'https://anthekira.dev';

// Rutas estáticas públicas
const staticRoutes = [
  '',           // Home
  '/projects',
  '/about',
  '/contact',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of staticRoutes) {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: route === '' ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map(l => [l, `${baseUrl}/${l}${route}`])
          ),
        },
      });
    }
  }

  // Agregar proyectos dinámicos (desde BD)
  // const { data: projects } = await supabase.from('projects').select('slug, updated_at');
  // for (const project of projects) {
  //   for (const locale of locales) {
  //     entries.push({
  //       url: `${baseUrl}/${locale}/projects/${project.slug}`,
  //       lastModified: new Date(project.updated_at),
  //       changeFrequency: 'monthly',
  //       priority: 0.6,
  //     });
  //   }
  // }

  return entries;
}
```

### 5.2 `robots.txt`

```typescript
// frontend/src/app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/es/', '/en/', '/pt/'],
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: 'https://anthekira.dev/sitemap.xml',
  };
}
```

---

## 6. SEO Técnico

### 6.1 HTML Semántico

Todas las páginas públicas deben usar HTML semántico:

```tsx
// Estructura base de cada página
<body>
  <header>     {/* Navegación principal */}
  <main>       {/* Contenido único de la página */}
    <section>  {/* Sección temática */}
      <h1>     {/* Título principal (1 por página) */}
      <h2>     {/* Subtítulos */}
      <article>{/* Contenido independiente */}
  <footer>     {/* Pie de página */}
```

### 6.2 Canonical URLs

Cada página debe incluir su URL canónica para evitar contenido duplicado entre idiomas:

```tsx
// Generado automáticamente por generateMetadata() via alternates.canonical
// Ejemplo: <link rel="canonical" href="https://anthekira.dev/en/projects" />
```

### 6.3 Structured Data (JSON-LD)

La Landing Page debe incluir structured data para **Person** (perfil profesional) y **CollectionPage** (proyectos):

```tsx
// En el Hero o componente About, agregar JSON-LD
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Anthekira',
      jobTitle: 'Full-Stack Developer',
      url: 'https://anthekira.dev',
      sameAs: [
        'https://github.com/anthekira',
        'https://linkedin.com/in/anthekira',
        // ... otras redes
      ],
      knowsAbout: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL'],
    }),
  }}
/>
```

### 6.4 Core Web Vitals

| Métrica | Objetivo | Estrategia |
|---|---|---|
| **LCP** | < 2.5s | Server Components, imágenes optimizadas, next/font con display:swap |
| **FID/INP** | < 100ms | Mínimo JS en cliente, solo hidratar componentes interactivos |
| **CLS** | < 0.1 | Dimensiones explícitas en imágenes (width/height), sin inyección de contenido que desplace layout |

### 6.5 Buenas Prácticas Adicionales

- **Títulos de página:** Únicos, descriptivos, < 60 caracteres
- **Meta descriptions:** Únicas, < 160 caracteres, con llamado a la acción
- **Alt text:** Todas las imágenes relevantes deben tener `alt` descriptivo
- **Enlaces:** Texto de enlace descriptivo (no "click here")
- **Velocidad:** Imágenes en WebP, lazy loading, recursos críticos inline

---

## 7. Resumen de Archivos SEO

| Archivo | Propósito | Tipo |
|---|---|---|
| `src/app/sitemap.ts` | Generar sitemap.xml con URLs localizadas | Dinámico |
| `src/app/robots.ts` | robots.txt (permitir público, bloquear admin/api) | Estático |
| `src/app/layout.tsx` | Metadata global (OG, Twitter, metadataBase) | Layout |
| `src/app/[locale]/layout.tsx` | Metadata del LandingLayout | Layout |
| `src/app/[locale]/page.tsx` | Metadata del Home | Página |
| `src/app/[locale]/projects/page.tsx` | Metadata de Projects | Página |
| `src/app/[locale]/projects/[slug]/page.tsx` | Metadata de detalle de proyecto | Página |
| `src/app/[locale]/about/page.tsx` | Metadata de About | Página |
| `src/app/[locale]/contact/page.tsx` | Metadata de Contact | Página |
| `public/images/og-*.jpg` | Imágenes Open Graph | Estático |

---

## 8. Dependencias con otros documentos

| Archivo | Relación |
|---|---|
| `00-REQUIREMENTS.md` | Requisitos SEO del proyecto |
| `01-ARCHITECTURE.md` | Estructura de rutas y metadatos |
| `frontend/00-FRONTEND.md` | Configuración de Next.js para SEO (headers, metadataBase) |
| `frontend/01-ROUTES.md` | Rutas indexables vs no indexables |
| `frontend/04-I18N.md` | Traducciones de metadatos SEO por idioma |
| `frontend/06-UI-UX.md` | Diseño de imágenes OG |
