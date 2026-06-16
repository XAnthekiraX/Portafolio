# 03-LAYOUTS.md — Anthekira.dev

## 1. Jerarquía
```
RootLayout (frontend/src/app/layout.tsx) — HTML, body, fonts, metadata global
├── LandingLayout ([locale]/layout.tsx) — Header + children + Footer + GA
└── AdminLayout (admin/layout.tsx) — AuthGuard + Sidebar + Navbar + children
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
// Main: pt-16 (compensa header sticky)
// Footer: border-t border-surface-800, bg-surface-950, grid 3 cols
```

| Breakpoint | Header | Footer |
|---|---|---|
| ≥ 768px (md) | Nav horizontal + LanguageSwitcher | Grid 3 columnas |
| < 768px | Logo + Hamburguer menu | Grid 1 columna |

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
