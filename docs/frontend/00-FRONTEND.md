# 00-FRONTEND.md — Anthekira.dev

## 1. Stack
| Tecnología | Versión |
|---|---|
| Next.js | 14+ (App Router) |
| TypeScript | Modo estricto |
| Tailwind CSS | v4+ (CSS-first @theme) |
| next-intl | v3+ (ES, EN, PT) |
| @supabase/ssr | Server + Client components |
| Google Analytics | GA4 |
| Fuentes | Space Grotesk + Inter (Google Fonts) |

## 2. next.config.ts
```typescript
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin('./frontend/src/lib/i18n.ts');
const config: NextConfig = {
  images: { remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' }] },
};
export default withNextIntl(config);
```

## 3. Tailwind v4 — Design Tokens (globals.css)
```css
@import "tailwindcss";
@theme {
  --color-primary-600: #DC2626;
  --color-accent-500: #06B6D4;
  --color-surface-900: #18181B;
  --color-surface-800: #27272A;
  --color-surface-750: #2A2A2E;
  --color-surface-700: #3F3F46;
  --color-surface-400: #A1A1AA;
  --color-surface-100: #F4F4F5;
  --color-surface-950: #09090B;
  --color-glass: rgba(39, 39, 42, 0.6);
  --font-heading: 'Space Grotesk', sans-serif;
  --font-body: 'Inter', sans-serif;
  --animate-fade-in: fade-in 0.5s ease-out;
  --animate-fade-in-up: fade-in-up 0.6s ease-out;
  --animate-slide-in-left: slide-in-left 0.5s ease-out;
  --animate-glow-pulse: glow-pulse 3s ease-in-out infinite;
}
```

## 4. Jerarquía de Layouts
```
RootLayout (HTML, body, fonts, metadata global)
├── LandingLayout [locale]/layout.tsx (Header + Footer + GA)
└── AdminLayout admin/layout.tsx (AuthGuard + Sidebar + Navbar)
```

## 5. Manejo de Estado
- Sin estado global (no Redux, no Zustand)
- Server Components: datos directo de Supabase
- Client Components: estado local con hooks
- Admin: fetch a API privada con JWT

## 6. Buenas Prácticas
- Server Components preferidos sobre Client
- Imágenes: width, height, loading="lazy", alt text
- GA: strategy="afterInteractive" o "lazyOnload"
- Cada página pública: `generateMetadata()` con title, description, OG, twitter
- HTML semántico: nav, main, section, article, footer
- Headings jerárquicos: h1 → h2 → h3
- Formularios con label asociado (htmlFor + id)
- Contraste mínimo 4.5:1
- Navegación por teclado funcional
