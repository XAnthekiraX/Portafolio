# 00-FRONTEND.md — Anthekira.dev — Visión General del Frontend

## 1. Propósito

Este documento describe la configuración global del frontend de Anthekira.dev, incluyendo el stack tecnológico, configuración de Next.js y Tailwind CSS, estructura de layouts y manejo de estado. Sirve como punto de partida para cualquier agente que implemente componentes o páginas del frontend.

---

## 2. Stack Frontend

| Tecnología | Versión / Notas |
|---|---|
| **Next.js** | 14+ (App Router) |
| **TypeScript** | Modo estricto |
| **Tailwind CSS** | v4+ con configuración CSS-first (`@theme` directives) |
| **next-intl** | v3+ — Internacionalización (ES, EN, PT) |
| **@supabase/ssr** | Cliente Supabase para Server Components y Client Components |
| **Google Analytics** | GA4 — Script en Landing Layout |
| **Fuentes** | Space Grotesk (headings) + Inter (body) vía Google Fonts |

---

## 3. Configuración de Next.js

### 3.1 `next.config.ts` (en raíz del proyecto)

```typescript
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/lib/i18n.ts');

const config: NextConfig = {
  // Domains permitidos para imágenes externas (Supabase Storage)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },

  // Compilación experimental (opcional, mejorar rendimiento)
  experimental: {
    // optimizePackageImports: [], // Agregar aquí paquetes pesados si es necesario
  },
};

export default withNextIntl(config);
```

### 3.2 Variables de Entorno

```env
# Frontend (públicas - NEXT_PUBLIC_*)
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://anthekira.dev
```

> Las variables sin prefijo `NEXT_PUBLIC_` (como `SUPABASE_SERVICE_ROLE_KEY`, `DEEPL_API_KEY`) solo están disponibles en Server Components y API Routes, nunca se exponen al cliente.

---

## 4. Configuración de Tailwind CSS

> **Tailwind CSS v4** usa configuración CSS-first. No se necesita `tailwind.config.ts`.
> Los design tokens se definen directamente en CSS con la directiva `@theme`.

### 4.1 `frontend/src/app/globals.css` — Design Tokens (CSS-first)

```css
@import "tailwindcss";

@theme {
  /* ─── Paleta de Colores ──────────────────────────────────── */
  /* Primario: Rojo (energía, personalidad) */
  --color-primary-50:  #FEF2F2;
  --color-primary-100: #FEE2E2;
  --color-primary-200: #FECACA;
  --color-primary-300: #FCA5A5;
  --color-primary-400: #F87171;
  --color-primary-500: #EF4444;
  --color-primary-600: #DC2626;  /* ← Principal */
  --color-primary-700: #B91C1C;
  --color-primary-800: #991B1B;
  --color-primary-900: #7F1D1D;

  /* Acento: Cian (tecnología) */
  --color-accent-50:  #ECFEFF;
  --color-accent-100: #CFFAFE;
  --color-accent-200: #A5F3FC;
  --color-accent-300: #67E8F9;
  --color-accent-400: #22D3EE;
  --color-accent-500: #06B6D4;  /* ← Principal */
  --color-accent-600: #0891B2;
  --color-accent-700: #0E7490;
  --color-accent-800: #155E75;
  --color-accent-900: #164E63;

  /* Superficies oscuras */
  --color-surface-50:  #FAFAFA;
  --color-surface-100: #F4F4F5;
  --color-surface-200: #E4E4E7;
  --color-surface-300: #D4D4D8;
  --color-surface-400: #A1A1AA;
  --color-surface-500: #71717A;
  --color-surface-600: #52525B;
  --color-surface-700: #3F3F46;
  --color-surface-750: #2A2A2E;  /* ← Fondo de secciones */
  --color-surface-800: #27272A;  /* ← Fondo de cards */
  --color-surface-900: #18181B;  /* ← Fondo base */
  --color-surface-950: #09090B;  /* ← Fondo más profundo */

  /* ─── Tipografía ────────────────────────────────────────── */
  --font-heading: 'Space Grotesk', sans-serif;
  --font-body:    'Inter', sans-serif;
  --font-mono:    'JetBrains Mono', monospace;

  /* ─── Glassmorphism ─────────────────────────────────────── */
  --color-glass: rgba(39, 39, 42, 0.6);  /* surface-800 con opacidad */

  /* ─── Animaciones ───────────────────────────────────────── */
  --animate-fade-in:       fade-in 0.5s ease-out;
  --animate-fade-in-up:    fade-in-up 0.6s ease-out;
  --animate-slide-in-left: slide-in-left 0.5s ease-out;
  --animate-glow-pulse:    glow-pulse 3s ease-in-out infinite;
}

/* ─── Keyframes ────────────────────────────────────────────── */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes slide-in-left {
  from { opacity: 0; transform: translateX(-20px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.2); }
  50%      { box-shadow: 0 0 30px rgba(6, 182, 212, 0.4); }
}

/* ─── Estilos globales ─────────────────────────────────────── */
html {
  scroll-behavior: smooth;
}

/* Scrollbar personalizada (dark mode) */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #18181B; /* surface-900 */
}
::-webkit-scrollbar-thumb {
  background: #3F3F46; /* surface-700 */
  border-radius: 4px;
}
```

> **Nota:** Tailwind v4 genera automáticamente las utilidades `bg-primary-600`, `text-accent-500`, `font-heading`, `animate-fade-in-up`, etc. a partir de las variables CSS definidas en `@theme`. No se necesita un archivo `tailwind.config.ts`.

### 4.2 Uso de los Design Tokens

```tsx
// Ejemplos de uso en componentes:
<div className="bg-surface-900 text-surface-100">
  <h1 className="font-heading text-primary-600">Título con rojo</h1>
  <p className="font-body text-surface-300">Texto body con cian</p>
  <span className="text-accent-500">Texto de acento cian</span>
  <button className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg">
    Botón primario
  </button>
</div>

// Glassmorphism:
<div className="bg-glass backdrop-blur-md border border-surface-700/50 rounded-xl">
  Contenido con efecto glass
</div>

// Animaciones:
<div className="animate-fade-in-up">
  Aparece con desplazamiento hacia arriba
</div>
```
```

---

## 5. Layouts y Estructura de Páginas

### 5.1 Jerarquía de Layouts

```
RootLayout (frontend/src/app/layout.tsx)
├── <html lang={locale}>
├── <body className="font-body bg-surface-900 text-surface-100 antialiased">
│
├── LandingLayout (src/app/[locale]/layout.tsx)
│   ├── Header
│   │   ├── Logo (texto estilizado "Anthekira")
│   │   ├── Nav (Proyectos, Sobre Mí, Contacto)
│   │   └── LanguageSwitcher (ES | EN | PT)
│   │
│   ├── {children} (página actual)
│   │   ├── / → Home (Hero, About, Skills, Technologies, Projects, Services, Contact)
│   │   ├── /projects → Lista de proyectos
│   │   ├── /projects/[slug] → Detalle de proyecto
│   │   ├── /about → Página Sobre Mí
│   │   └── /contact → Formulario de contacto
│   │
│   ├── Footer
│   │   ├── Redes sociales
│   │   ├── Enlaces rápidos
│   │   └── Copyright
│   │
│   └── Google Analytics Script
│
└── AdminLayout (src/app/admin/layout.tsx)
    ├── AuthGuard (protege rutas admin)
    ├── Sidebar (navegación admin)
    │   ├── Dashboard
    │   ├── Projects
    │   ├── SaaS Projects
    │   ├── Profile
    │   ├── Settings
    │   └── Google Analytics (enlace externo)
    │
    ├── Navbar
    │   ├── Título de página actual
    │   └── Avatar / Sign Out
    │
    └── {children} (página actual del admin)
```

### 5.2 Root Layout (`frontend/src/app/layout.tsx`)

```tsx
// Responsabilidades:
// - Configurar fuente Space Grotesk + Inter
// - Definir metadata global
// - No agrega navegación (eso va en los layouts hijos)

import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Anthekira.dev — Software Developer',
    template: '%s — Anthekira.dev',
  },
  description: 'Full-stack developer specialized in AI Native Development',
  // ... otros metadatos globales
};

// NOTA: El template '%s — Anthekira.dev' aplica a las páginas públicas.
// Las rutas /admin/* sobrescriben metadata en su propio layout
// con title propio y robots: { index: false } para evitar indexación SEO.

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-body bg-surface-900 text-surface-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

### 5.3 Landing Layout (`frontend/src/app/[locale]/layout.tsx`)

```tsx
// Responsabilidades:
// - Header (logo, nav, LanguageSwitcher)
// - Footer
// - Google Analytics Script
// - No requiere AuthGuard (es público)

// NOTA: Este layout recibe el locale como parámetro de ruta
// y lo pasa a los componentes hijos vía next-intl
```

### 5.4 Admin Layout (`frontend/src/app/admin/layout.tsx`)

```tsx
// Responsabilidades:
// - AuthGuard (verifica sesión, redirige a /admin/login si no hay)
// - Sidebar con navegación del admin
// - Navbar con título de página y botón de logout
// - Solo en español (sin i18n)
```

---

## 6. Manejo de Estado

### 6.1 Estrategia General

- **Sin estado global** (no Redux, no Zustand, no Context global)
- **Server Components:** Obtienen datos directamente de Supabase y renderizan HTML
- **Client Components:** Estado local con hooks (`useState`, `useEffect`) cuando sea necesario
- **Comunicación UI → API:** fetch directo a endpoints privados con JWT

### 6.2 Estado en la Landing Page (pública)

| Tipo de estado | Manejo |
|---|---|
| Contenido (proyectos, skills) | Server Component → Supabase directo |
| Idioma actual | next-intl (parámetro de ruta `[locale]`) |
| Formulario de contacto | Estado local en Client Component |
| Language Switcher | Estado local + navegación |

### 6.3 Estado en el Panel Admin (privada)

| Tipo de estado | Manejo |
|---|---|
| Sesión del admin | Supabase Auth (cookies) |
| Lista de recursos (CRUD) | fetch a API privada → estado local |
| Formularios de edición | Estado local en Client Component |
| Notificaciones (toasts) | Estado local en cada página |

---

## 7. Buenas Prácticas

### 7.1 Rendimiento

- Preferir Server Components sobre Client Components
- Las imágenes de Supabase Storage deben incluir `width`, `height` y `loading="lazy"`
- Google Analytics debe cargarse con `strategy="lazyOnload"` o `afterInteractive`
- next-intl mensajes cargados en servidor (sin JS en cliente)

### 7.2 SEO

- Cada página pública debe tener `generateMetadata()` exportado
- Los metadatos deben incluir: `title`, `description`, `openGraph`, `twitter`
- El sitemap se genera con `next-sitemap` o la función `generateSitemaps()` de Next.js
- Las imágenes de Open Graph deben estar en `/public/images/`

### 7.3 Accesibilidad (V1)

- HTML semántico (`<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- Headings en orden jerárquico (h1 → h2 → h3, sin saltos)
- Todos los formularios con `<label>` asociado
- `alt` text descriptivo en todas las imágenes relevantes
- Suficiente contraste de color (4.5:1 mínimo para texto normal)
- Navegación por teclado funcional

---

## 8. Dependencias con otros documentos

| Archivo | Relación |
|---|---|
| `01-ARCHITECTURE.md` | Define la arquitectura que este frontend implementa |
| `frontend/docs/01-ROUTES.md` | Define las rutas y navegación del frontend |
| `frontend/docs/02-COMPONENTS.md` | Define los componentes del frontend |
| `frontend/docs/03-LAYOUTS.md` | Especificación detallada de layouts |
| `frontend/docs/04-I18N.md` | Configuración de next-intl |
| `frontend/docs/05-SEO.md` | Estrategia SEO del frontend |
| `frontend/docs/06-UI-UX.md` | Design tokens y guía de diseño visual |
| `frontend/docs/07-ACCESSIBILITY.md` | Prácticas de accesibilidad |
| `frontend/docs/08-ADMIN-PANEL.md` | Funcionalidades del panel administrativo |
| `frontend/docs/09-CMS-INTEGRATION.md` | Integración del CMS con el frontend (clientes Supabase, data fetching, auto-traducción) |
| `backend/docs/05-AUTHENTICATION.md` | Autenticación para el panel admin |
