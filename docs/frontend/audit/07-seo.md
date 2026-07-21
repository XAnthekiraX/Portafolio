# SEO

## Puntuación: 30 / 100

---

### ID: SEO-001

**Categoría:** SEO  
**Severidad:** Alta  
**Archivo:** `frontend/index.html`  
**Línea:** 6  

**Problema:** No hay meta description, Open Graph tags (og:title, og:description, og:image, og:url) ni Twitter Cards. El único tag relevante es `<title>`.

**Impacto:** La página se comparte en redes sociales sin preview (solo URL). Google no tiene meta description para el snippet de búsqueda.

**Recomendación:** Agregar meta tags completos para SEO y Social Sharing:
```html
<meta name="description" content="..." />
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="..." />
<meta property="og:url" content="..." />
<meta name="twitter:card" content="summary_large_image" />
```

**Justificación:** Los meta tags son esenciales para tener control sobre cómo se muestra el sitio en buscadores y redes sociales.

---

### ID: SEO-002

**Categoría:** SEO  
**Severidad:** Media  
**Archivo:** `frontend/index.html`  

**Problema:** No hay datos estructurados JSON-LD para representar la persona/portfolio.

**Impacto:** Los buscadores no pueden enriquecer el snippet de búsqueda con información como nombre, título, foto, redes sociales.

**Recomendación:** Implementar JSON-LD con schema.org `Person` y `Portfolio` usando datos dinámicos del perfil.

**Justificación:** Los datos estructurados mejoran la presencia en buscadores (rich snippets).

---

### ID: SEO-003

**Categoría:** SEO  
**Severidad:** Media  
**Archivo:** `frontend/index.html` / `public/`  

**Problema:** No hay etiqueta `canonical` ni `sitemap.xml` referenciado.

**Impacto:** Posibles problemas de contenido duplicado y falta de indexación completa.

**Recomendación:** Agregar `<link rel="canonical" href="https://..." />` y crear un `sitemap.xml` en la raíz del frontend.

**Justificación:** Buenas prácticas SEO para sitios en producción.

---
