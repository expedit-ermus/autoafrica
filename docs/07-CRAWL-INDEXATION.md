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
  <url>
    <loc>https://autoafrique-saas.vercel.app/aide</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://autoafrique-saas.vercel.app/paiement</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://autoafrique-saas.vercel.app/livraison</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://autoafrique-saas.vercel.app/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://autoafrique-saas.vercel.app/a-propos</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://autoafrique-saas.vercel.app/retours</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://autoafrique-saas.vercel.app/blog</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://autoafrique-saas.vercel.app/manuels-reparation</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://autoafrique-saas.vercel.app/conditions-generales</loc>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>https://autoafrique-saas.vercel.app/politique-de-confidentialite</loc>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>https://autoafrique-saas.vercel.app/marketplace/categorie/pneus-jantes</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://autoafrique-saas.vercel.app/marketplace/categorie/frein</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://autoafrique-saas.vercel.app/marketplace/categorie/moteur</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://autoafrique-saas.vercel.app/marketplace/categorie/courroies-chaines</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://autoafrique-saas.vercel.app/marketplace/categorie/embrayage</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://autoafrique-saas.vercel.app/marketplace/categorie/amortissement</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://autoafrique-saas.vercel.app/marketplace/categorie/suspension</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://autoafrique-saas.vercel.app/marketplace/categorie/filtre</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://autoafrique-saas.vercel.app/marketplace/categorie/carrosserie</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://autoafrique-saas.vercel.app/marketplace/categorie/huiles-fluides</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://autoafrique-saas.vercel.app/marketplace/categorie/electricite</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://autoafrique-saas.vercel.app/marketplace/categorie/autres</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://autoafrique-saas.vercel.app/marketplace/marque/toyota</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://autoafrique-saas.vercel.app/marketplace/marque/mercedes-benz</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://autoafrique-saas.vercel.app/marketplace/marque/peugeot</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>
```

### Inclure (uniquement les pages « index / sitemap oui » de `02-ROUTES.md`)
- `/` (R001, priority 1.0)
- `/dashboard/marketplace` (R005, priority 0.9)
- `/dashboard/vehicles` (R017, priority 0.8)
- `/aide` (R026, priority 0.6)
- `/paiement` (R027, priority 0.6)
- `/livraison` (R028, priority 0.6)
- `/contact` (R029, priority 0.6)
- `/a-propos` (R023, priority 0.5)
- `/retours` (R030, priority 0.5)
- `/blog` (R031, priority 0.5)
- `/manuels-reparation` (R032, priority 0.5)
- `/conditions-generales` (R024, priority 0.4)
- `/politique-de-confidentialite` (R025, priority 0.4)
- `/marketplace/categorie/*` (R033-R044, priority 0.7, URL fixes : `{R033..pneus-jantes, R034..frein, R035..moteur, R036..courroies-chaines, R037..embrayage, R038..amortissement, R039..suspension, R040..filtre, R041..carrosserie, R042..huiles-fluides, R043..electricite, R044..autres}`)
- `/marketplace/marque/*` (R045-R057, priority 0.6, URL fixes : `{R045..toyota, R046..hyundai, R047..kia, R048..peugeot, R049..mercedes-benz, R050..renault, R051..suzuki, R052..nissan, R053..ford, R054..volkswagen, R055..bmw, R056..citroen, R057..opel}`)

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

## Google Search Console

### Vérification du site

- Métadonnée `google-site-verification` dans `src/app/layout.tsx` (`<head>`) :
  - `content="google67878e31d8998189"`
- Fichier de vérification servis depuis le dossier `public/` :
  - `/google67878e31d8998189.html` (contenu `google-site-verification: google67878e31d8998189.html`)
- Propriété à vérifier dans Google Search Console : `https://autoafrique-saas.vercel.app/`

### Session SEO — 2026-08-06

Audit via le serveur MCP GSC (`gsc-server`, scope `webmasters`) :

- **Propriété** : `https://autoafrique-saas.vercel.app/` (permission `siteOwner`, vérifiée).
- **Accueil** : indexé (`PASS`, soumis et indexé, crawl mobile 05/08/2026, robots autorisé, canonical OK).
- **Sitemap soumis** : `https://autoafrique-saas.vercel.app/sitemap.xml` → soumis le 06/08/2026 02:23 UTC, statut *Pending processing* (37 URLs). A relancer une inspection une fois le traitement terminé.
- **Pages `/dashboard/*` privées** (analytics, inventory, orders, crm…) : `URL is unknown to Google` — attendu (espaces authentifiés, `Disallow` + noindex).
- **Données Search** (28 jours) : 0 clic / 0 impression — normal : propriété récente, crawl en cours via le sitemap.
- **Audit dynamique : à refaire après ~48 h** pour vérifier l'indexation des 37 URLs publiques puis surveiller clics/impressions.

## Recherche interne

- Route : `/dashboard/marketplace?search=...`
- Indexation : noindex, follow
- État vide : "Aucun résultat pour [recherche]" + suggestions
