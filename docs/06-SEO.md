# SEO

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

## Performance SEO

| Métrique | Objectif |
|----------|----------|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| TTFB | < 600ms |

## Titres dynamiques (détail produit / annonce)

Le détail produit (R005) et le détail annonce véhicule (R017) s'affichent dans une modal (aucune route dédiée documentée dans `02-ROUTES.md`). Le titre de l'onglet est mis à jour côté client via `useDocumentTitle` :

- Modal produit : `<nom du produit> | AutoAfrique` (fallback : « Marketplace — Pièces détachées automobile | AutoAfrique »)
- Modal véhicule : `<marque> <modèle> <année> | AutoAfrique` (fallback : « Véhicules — Annonces Côte d'Ivoire | AutoAfrique »)

`generateMetadata` reste inutilisable ici (pas de page serveur avec `params`) ; voir `DECISIONS.md` D23.
