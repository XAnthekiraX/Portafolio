# 03-LAYOUTS.md — Anthekira.dev

## 1. Jerarquía
```
RootLayout (frontend/src/app/layout.tsx) — HTML, body, fonts, metadata global
├── LandingLayout ([locale]/layout.tsx) — Header + children + Footer + GA
│   └── [locale]/* (error.tsx + loading.tsx por ruta)
└── AdminLayout (admin/layout.tsx) — AuthGuard + Sidebar + Navbar + children
    └── admin/* (error.tsx + loading.tsx)
```

## 2. RootLayout
```tsx
// Responsabilidades: fuentes (Space Grotesk + Inter), metadata global, fondo bg-surface-900
// NO incluye Header/Footer (van en layouts hijos)
// NO incluye Google Analytics (va en LandingLayout)

export const metadata: Metadata = {
  title: { default: 'Anthekira.dev — Software Developer', template: '%s — Anthekira.dev' },
  description: 'Full-stack developer specialized in AI Native Development',
  openGraph: { siteName: 'Anthekira.dev', type: 'website', locale: 'es_ES' },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-body bg-surface-900 text-surface-100 antialiased`}>
        <SkipToContent />
        {children}
      </body>
    </html>
  );
}
```

## 3. LandingLayout
```tsx
// Responsabilidades: Header sticky (glassmorphism), Footer, Google Analytics
// No requiere AuthGuard (es público)
// Recibe locale de params de ruta

// Header: fixed top-0, bg-surface-900/80 backdrop-blur-md, border-b border-surface-800
//   Logo → Nav (Projects, About, Contact) → LanguageSwitcher
// Main: pt-16 (compensa header sticky), id="main-content"
// Footer: border-t border-surface-800, bg-surface-950, grid 3 cols
```

| Breakpoint | Header | Footer |
|---|---|---|
| ≥ 768px (md) | Nav horizontal + LanguageSwitcher | Grid 3 columnas |
| < 768px | Logo + Hamburguer menu | Grid 1 columna |

### Error y Loading States (Landing Page)
Cada segmento de ruta pública exporta `error.tsx` y `loading.tsx`:

```tsx
// frontend/src/app/[locale]/error.tsx
'use client';
export default function LandingError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <h2 className="text-2xl font-heading text-surface-100">Something went wrong</h2>
      <p className="text-surface-400">{error.message || 'Please try again later'}</p>
      <Button onClick={reset} variant="primary">Try again</Button>
    </div>
  );
}
```

```tsx
// frontend/src/app/[locale]/loading.tsx
export default function LandingLoading() {
  return (
    <div className="space-y-4 p-8">
      <Skeleton variant="rectangular" width="100%" height="400px" />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="80%" />
    </div>
  );
}
```

## 4. AdminLayout
```tsx
// Metadata: title 'Panel Admin — Anthekira.dev', robots: { index: false, follow: false }
export default function AdminLayout({ children }) {
  return (
    <AuthGuard>
      <div className="flex h-screen bg-surface-900">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
```

| Breakpoint | Sidebar |
|---|---|
| ≥ 1024px (lg) | Expandido (240px) con texto |
| ≥ 768px y < 1024px | Colapsado (64px) solo iconos + tooltips |
| < 768px | Oculto, toggle hamburguer en Navbar |

### AuthGuard
```tsx
'use client';
// Verifica sesión con supabase.auth.getSession()
// Si no hay sesión: router.replace('/admin/login')
// Mientras verifica: spinner centrado
```

> **Nota:** AuthGuard tiene un spinner de carga inicial para evitar el flash de la página de login antes de verificar la sesión. El middleware ya protege las rutas en el servidor, AuthGuard es un respaldo client-side para navegación SPA.

### Error y Loading States (Admin)
```tsx
// frontend/src/app/admin/error.tsx
'use client';
export default function AdminError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <h2 className="text-xl font-heading">Error</h2>
      <p className="text-surface-400">{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}

// frontend/src/app/admin/loading.tsx — Full page spinner
// frontend/src/app/admin/[resource]/loading.tsx — Skeleton table
// frontend/src/app/admin/[resource]/error.tsx — Error message + retry
```
