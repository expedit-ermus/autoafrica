# Performance

## Objectifs

| Metrique | Objectif | Seuil critique |
|----------|----------|----------------|
| LCP (Largest Contentful Paint) | < 2.5s | > 4s |
| FID (First Input Delay) | < 100ms | > 300ms |
| CLS (Cumulative Layout Shift) | < 0.1 | > 0.25 |
| TTFB (Time to First Byte) | < 600ms | > 1s |
| FCP (First Contentful Paint) | < 1.8s | > 3s |
| TTI (Time to Interactive) | < 3.8s | > 7s |
| Score Lighthouse | > 90 | < 50 |

## Optimisations

### Images
- Format WebP avec fallback JPG
- Lazy loading natif (loading="lazy")
- Srcset pour responsive
- Compression qualite 80%
- Images hero preload
- Taille max : 200px hauteur pour cards, 1200px pour hero

### JavaScript
- Code splitting par route (Next.js dynamic imports)
- Tree shaking automatique
- Suppression console.log en production
- Bundle analyzer pour detection deps lourdes
- Prefetch des routes proches

### CSS
- Tailwind CSS purgé automatiquement
- CSS inline critique
- Fonts preconnect

### Fonts
- Inter chargee via next/font
- font-display: swap
- Preconnect vers CDN

### API
- Cache HTTP (Cache-Control headers)
- Debounce des recherches (300ms)
- Pagination cote serveur
- Optimistic updates pour UI

### Caching

| Ressource | Strategie | Duree |
|-----------|-----------|-------|
| Static assets | Immutable | 1 an |
| API responses | Stale-while-revalidate | 60s |
| Pages privees | No-cache | - |
| Landing page | ISR | 3600s |
| Catalogue (`/catalogue`) | ISR | 60s |

### Bundle budget

| Categorie | Limite |
|-----------|--------|
| JS total | < 200KB gzipped |
| CSS total | < 50KB gzipped |
| JS par page | < 80KB gzipped |
| Image hero | < 150KB |

## Monitoring

### Vercel Analytics
- Web Vitals en production
- Edge function performance
- Cache hit rates

### Alerts
- LCP > 4s → alerter
- Erreurs 5xx > 1% → alerter
- API latency p95 > 2s → alerter
