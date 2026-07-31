# Spécifications SEO

## Balises meta

### Landing Page (`/`)

| Balise | Valeur |
|--------|--------|
| `<title>` | AutoAfrique : Pièces détachées auto & Marketplace Afrique de l'Ouest |
| `<meta name="description">` | 85,000+ pièces pour Toyota, Hyundai, Kia, Peugeot. Paiement Mobile Money. Livraison 24-72h en Afrique de l'Ouest. |
| `<link rel="canonical">` | `/` |
| `<meta name="robots">` | index, follow |

### Marketplace (`/dashboard/marketplace`)

| Balise | Valeur |
|--------|--------|
| `<title>` | Marketplace — Pièces détachées automobile \| AutoAfrique |
| `<meta name="description">` | Parcourez notre catalogue de 85,000+ pièces auto. Filtrez par marque, modèle et prix. Paiement Mobile Money. |
| `<link rel="canonical">` | `/dashboard/marketplace` |
| `<meta name="robots">` | index, follow |

### Connexion (`/auth/login`)

| Balise | Valeur |
|--------|--------|
| `<title>` | Connexion — AutoAfrique |
| `<link rel="canonical">` | `/auth/login` |
| `<meta name="robots">` | noindex, follow |

### Inscription (`/auth/register`)

| Balise | Valeur |
|--------|--------|
| `<title>` | Inscription — AutoAfrique |
| `<link rel="canonical">` | `/auth/register` |
| `<meta name="robots">` | noindex, follow |

### Dashboard pages (`/dashboard/*`)

| Balise | Valeur |
|--------|--------|
| `<title>` | [Page Name] — AutoAfrique |
| `<meta name="robots">` | noindex, nofollow |

## Open Graph

| Property | Valeur |
|----------|--------|
| `og:title` | AutoAfrique — Pièces Auto Marketplace Afrique de l'Ouest |
| `og:description` | 85,000+ pièces pour Toyota, Hyundai, Kia, Peugeot. Paiement Mobile Money. Livraison 24-72h. |
| `og:image` | `/og-image.png` (1200×630px) |
| `og:url` | `https://autoafrique-saas.vercel.app/` |
| `og:type` | website |
| `og:locale` | fr_SN |
| `og:site_name` | AutoAfrique |

## Twitter Card

| Property | Valeur |
|----------|--------|
| `twitter:card` | summary_large_image |
| `twitter:title` | AutoAfrique — Pièces Auto Marketplace |
| `twitter:description` | 85,000+ pièces auto. Paiement Mobile Money. Livraison 24-72h. |
| `twitter:image` | `/og-image.png` |

## Données structurées

### Organization (Landing)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AutoAfrique",
  "url": "https://autoafrique-saas.vercel.app",
  "logo": "https://autoafrique-saas.vercel.app/logo.png",
  "description": "Marketplace de pièces détachées automobile en Afrique de l'Ouest",
  "areaServed": ["SN", "CI", "ML", "BF", "NE", "GM", "GN", "BJ", "TG", "GH"],
  "sameAs": []
}
```

### WebSite (Landing)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "AutoAfrique",
  "url": "https://autoafrique-saas.vercel.app",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://autoafrique-saas.vercel.app/dashboard/marketplace?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

### Product (Marketplace)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "[product name]",
  "description": "[product description]",
  "image": "[product image]",
  "offers": {
    "@type": "Offer",
    "price": "[price]",
    "priceCurrency": "XOF",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "[seller name]"
    }
  }
}
```

### ItemList (Marketplace)

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "url": "[product url]"
    }
  ]
}
```

### FAQPage (Aide)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[question]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[answer]"
      }
    }
  ]
}
```

## Sitemap

### Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://autoafrique-saas.vercel.app/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://autoafrique-saas.vercel.app/dashboard/marketplace</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
```

### Inclure
- `/` (priority 1.0)
- `/dashboard/marketplace` (priority 0.9)
- `/dashboard/help` (priority 0.5)

### Exclure
- `/auth/*`
- `/dashboard/*` (pages privées)
- `/api/*`
- `/404`

## Robots.txt

```
User-agent: *
Allow: /
Disallow: /auth/
Disallow: /dashboard/
Disallow: /api/

Sitemap: https://autoafrique-saas.vercel.app/sitemap.xml
```

## Performance SEO

| Métrique | Objectif |
|----------|----------|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| TTFB | < 600ms |
