# Crawl et indexation

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
  <url>
    <loc>https://autoafrique-saas.vercel.app/dashboard/vehicles</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### Inclure (uniquement les pages « index / sitemap oui » de `02-ROUTES.md`)
- `/` (R001, priority 1.0)
- `/dashboard/marketplace` (R005, priority 0.9)
- `/dashboard/vehicles` (R017, priority 0.8)

### Exclure
- `/auth/*` (R002, R003 — noindex)
- `/dashboard/*` privées (R004, R006-R016, R018-R022 — noindex)
- `/api/*`
- `/404`

## Robots.txt

```
User-agent: *
Allow: /
Allow: /dashboard/marketplace
Allow: /dashboard/vehicles
Disallow: /dashboard/
Disallow: /auth/
Disallow: /api/

Sitemap: https://autoafrique-saas.vercel.app/sitemap.xml
```

Note : les pages publiques indexables sous `/dashboard/` (R005 marketplace, R017 véhicules) doivent rester crawlables ; les `Allow` spécifiques priment sur le `Disallow: /dashboard/` (règle de la correspondance la plus longue).

## Règles d'URL

- Utiliser des minuscules
- Utiliser des tirets
- Éviter les accents
- Éviter les paramètres lorsque l'URL descriptive suffit
- Slash final : non
- Éviter les dates dans les URL
- Éviter les changements d'URL après publication
- Rediriger les anciennes URL
- Ne pas créer plusieurs URL pour le même contenu

## Maillage interne

- La landing page pointe vers le catalogue et les catégories
- Le catalogue pointe vers les produits individuels
- Chaque produit pointe vers le vendeur et la catégorie
- Le dashboard pointe vers toutes les sections
- Les commandes pointent vers les produits et paiements
- Le CRM pointe vers les clients et leads

## Règles de maillage interne

- Une page catégorie pointe vers les produits associés
- Un produit pointe vers sa catégorie et son vendeur
- Les pages importantes sont accessibles en trois clics maximum
- Les ancres de liens sont descriptives
- Éviter les liens génériques du type "cliquer ici"
- Aucune page stratégique ne doit être orpheline
- Le fil d'Ariane doit suivre la hiérarchie réelle

## Recherche interne

- Route : `/dashboard/marketplace?search=...`
- Indexation : noindex, follow
- État vide : "Aucun résultat pour [recherche]" + suggestions
