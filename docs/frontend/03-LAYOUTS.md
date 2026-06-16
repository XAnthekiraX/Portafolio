# 03-LAYOUTS.md — Anthekira.dev — Layouts

## 1. Propósito

Este documento define los layouts del frontend de Anthekira.dev, su jerarquía, comportamiento y responsabilidades. Los layouts son componentes que envuelven páginas y proveen estructura visual compartida (headers, footers, sidebars, etc.).

---

## 2. Jerarquía de Layouts

```
RootLayout (obligatorio en Next.js)
└── HTML, body, fuentes, metadata global
    │
    ├── LandingLayout (frontend/src/app/[locale]/layout.tsx)
    │   └── Header + {children} + Footer + Google Analytics
    │
    └── AdminLayout (frontend/src/app/admin/layout.tsx)
        └── AuthGuard + Sidebar + Navbar + {children}
```

---

## 3. RootLayout (`frontend/src/app/layout.tsx`)

### 3.1 Responsabilidades

- Configurar las fuentes Space Grotesk (headings) e Inter (body) con `next/font/google`
- Definir metadata global del sitio
- Establecer el color de fondo base (`bg-surface-900`) y texto (`text-surface-100`)
- NO incluir Header/Footer (eso va en los layouts hijos)
- NO incluir Google Analytics (va en LandingLayout)

### 3.2 Código de Implementación

```tsx
import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import './globals.css';  // Tailwind directives

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
  // NOTA: El template '%s — Anthekira.dev' aplica a las páginas públicas.
  // Las rutas /admin/* sobrescriben metadata en su propio layout
  // con title propio y robots: { index: false } para evitar indexación SEO.
  openGraph: {
    siteName: 'Anthekira.dev',
    type: 'website',
    locale: 'es_ES',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body
        className={`
          ${spaceGrotesk.variable}
          ${inter.variable}
          font-body
          bg-surface-900
          text-surface-100
          antialiased
        `}
      >
        {children}
      </body>
    </html>
  );
}
```

### 3.3 `globals.css`

```css
@import "tailwindcss";

/* Los design tokens (colores, fuentes, animaciones) se definen en @theme */
/* Ver frontend/00-FRONTEND.md §4.1 para la configuración completa */

/* Estilos globales adicionales */
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

---

## 4. LandingLayout (`frontend/src/app/[locale]/layout.tsx`)

### 4.1 Responsabilidades

- Renderizar Header (logo, nav, LanguageSwitcher)
- Renderizar el contenido de la página actual (`{children}`)
- Renderizar Footer
- Incluir Google Analytics Script
- NO requiere AuthGuard (es público)
- Recibe el `locale` de los parámetros de ruta

### 4.2 Estructura Visual

```
┌──────────────────────────────────────────┐
│  Header (sticky)                         │
│  ┌──────┬──────────────────────┬──────┐  │
│  │ Logo │ Nav: Prj | About | Ct│  EN ▼│  │
│  └──────┴──────────────────────┴──────┘  │
├──────────────────────────────────────────┤
│                                          │
│  {children} (página actual)              │
│  Hero, About, Skills, Technologies,      │
│  Projects, Services, Contact             │
│                                          │
├──────────────────────────────────────────┤
│  Footer                                  │
│  ┌────────────────────────────────────┐  │
│  │ Logo  │  Links  │  Social  │ ©2025 │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

### 4.3 LandingLayout Completo (con next-intl)

```tsx
// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import Script from 'next/script';

export default async function LandingLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Cargar mensajes de traducción para el locale actual
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {/* Header sticky con glassmorphism */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="
          mx-auto max-w-6xl px-4 py-4
          bg-surface-900/80 backdrop-blur-md
          border-b border-surface-800
        ">
          <nav className="flex items-center justify-between">
            <Link href={`/${locale}`} className="font-heading text-xl font-bold text-primary-600">
              Anthekira
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href={`/${locale}/projects`}>Projects</Link>
              <Link href={`/${locale}/about`}>About</Link>
              <Link href={`/${locale}/contact`}>Contact</Link>
            </div>
            <LanguageSwitcher currentLocale={locale} />
          </nav>
        </div>
      </header>

      {/* Padding-top compensa el header sticky */}
      <main className="pt-16">
        {children}
      </main>

      <Footer />

      {/* Google Analytics */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
        `}
      </Script>
    </NextIntlClientProvider>
  );
}
```



### 4.5 Footer

```tsx
<footer className="border-t border-surface-800 bg-surface-950">
  <div className="mx-auto max-w-6xl px-4 py-12">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Columna 1: Logo + descripción */}
      <div>
        <span className="font-heading text-lg text-primary-600">Anthekira</span>
        <p className="mt-2 text-sm text-surface-400">
          Full-stack developer specialized in AI Native Development
        </p>
      </div>

      {/* Columna 2: Enlaces rápidos */}
      <div>
        <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-surface-300">
          Quick Links
        </h3>
        <ul className="mt-4 space-y-2">
          <li><Link href={`/${locale}/projects`}>Projects</Link></li>
          <li><Link href={`/${locale}/about`}>About</Link></li>
          <li><Link href={`/${locale}/contact`}>Contact</Link></li>
        </ul>
      </div>

      {/* Columna 3: Redes sociales */}
      <div>
        <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-surface-300">
          Social
        </h3>
        <div className="mt-4 flex gap-4">
          {/* Iconos de redes desde configuración */}
        </div>
      </div>
    </div>

    <div className="mt-8 pt-8 border-t border-surface-800 text-center text-sm text-surface-500">
      &copy; {new Date().getFullYear()} Anthekira.dev. All rights reserved.
    </div>
  </div>
</footer>
```

### 4.6 Responsive

| Breakpoint | Comportamiento Header |
|---|---|
| `≥ md (768px)` | Nav horizontal completo + LanguageSwitcher |
| `< md (768px)` | Logo + Hamburguer menu (mobile nav desplegable) |

El Footer siempre es vertical en móvil (grid de 1 columna) y horizontal en escritorio (grid de 3 columnas).

---

## 5. AdminLayout (`frontend/src/app/admin/layout.tsx`)

### 5.1 Responsabilidades

- Proteger rutas admin con AuthGuard (redirigir a `/admin/login` si no hay sesión)
- Renderizar Sidebar con navegación del admin
- Renderizar Navbar con título de página y menú de usuario
- Establecer metadata `{ robots: { index: false } }` para no indexar en Google
- Sin i18n (todo en español)

### 5.2 Metadata

```tsx
// src/app/admin/layout.tsx
export const metadata: Metadata = {
  title: 'Panel Admin — Anthekira.dev',
  robots: { index: false, follow: false },
};
```

### 5.3 Estructura Visual

```
┌──────────┬───────────────────────────────────┐
│          │  Navbar                           │
│          │  ┌──────────────────┬──────────┐  │
│ Sidebar  │  │ Page Title       │ 👤 Admin │  │
│          │  └──────────────────┴──────────┘  │
│ Dashboard│                                   │
│ Projects │  {children}                       │
│ Skills   │  DataTable / FormBuilder /        │
│ Tech     │  MediaGrid / etc.                 │
│ Services │                                   │
│ Personal │                                   │
│ Media    │                                   │
│ Messages │                                   │
│ CV       │                                   │
│ Settings │                                   │
│ ──────── │                                   │
│ GA 📊    │                                   │
│ ──────── │                                   │
│ Sign Out │                                   │
└──────────┴───────────────────────────────────┘
```

### 5.4 Comportamiento Responsive del Sidebar

| Breakpoint | Comportamiento Sidebar |
|---|---|
| `≥ lg (1024px)` | Sidebar expandido (240px de ancho) |
| `< lg (1024px)` | Sidebar colapsado a iconos (64px) con tooltips |
| `< md (768px)` | Sidebar oculto, menú hamburguesa en Navbar |

```tsx
// Pseudocódigo del AdminLayout
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen bg-surface-900">
        {/* Sidebar */}
        <Sidebar />

        {/* Contenido principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
```

### 5.5 Sidebar Detallado

```tsx
// src/components/admin/Sidebar/index.tsx
// Props: ninguna (usa usePathname() para detectar ruta activa)

// Items del menú:
const menuItems = [
  { label: 'Dashboard',     href: '/admin',                icon: LayoutDashboard },
  { label: 'Projects',      href: '/admin/projects',       icon: FolderKanban },
  { label: 'Skills',        href: '/admin/skills',         icon: Code },
  { label: 'Technologies',  href: '/admin/technologies',   icon: Cpu },
  { label: 'Services',      href: '/admin/services',       icon: Briefcase },
  { label: 'Personal Info', href: '/admin/personal-info',  icon: User },
  { label: 'Media',         href: '/admin/media',          icon: Image },
  { label: 'Messages',      href: '/admin/messages',       icon: Mail },
  { label: 'CV',            href: '/admin/cv',             icon: FileText },
  { label: 'Settings',      href: '/admin/settings',       icon: Settings },
];
```

Cada item resalta con bg `primary-600/10` y borde izquierdo `border-l-2 border-primary-600` cuando es la ruta activa.

### 5.6 AuthGuard

```tsx
// src/components/shared/AuthGuard.tsx
'use client';

import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/admin/login'); // SPA redirect, sin recargar
      } else {
        setHasSession(true);
      }
      setIsLoading(false);
    };
    checkSession();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return hasSession ? <>{children}</> : null;
}
```

---

## 6. Resumen de Layouts

| Layout | Archivo | Tipo | Protegido | i18n | Contenido |
|---|---|---|---|---|---|
| RootLayout | `src/app/layout.tsx` | `[SC]` | No | No | HTML, body, fuentes, metadata global |
| LandingLayout | `src/app/[locale]/layout.tsx` | `[SC]` | No | Sí (ES/EN/PT) | Header + Footer + GA + children |
| AdminLayout | `src/app/admin/layout.tsx` | `[CC]` (AuthGuard) | Sí (JWT) | No (solo ES) | Sidebar + Navbar + children |

---

## 7. Dependencias con otros documentos

| Archivo | Relación |
|---|---|
| `frontend/00-FRONTEND.md` | Configuración de Tailwind que los layouts deben usar |
| `frontend/01-ROUTES.md` | Rutas que estos layouts envuelven |
| `frontend/02-COMPONENTS.md` | Componentes (Sidebar, Navbar, Header, Footer) usados en layouts |
| `frontend/04-I18N.md` | next-intl en LandingLayout |
| `frontend/06-UI-UX.md` | Guía visual para estilos de layouts |
| `backend/05-AUTHENTICATION.md` | AuthGuard y verificación de sesión |
