# SEO

## Balises meta

### Landing Page (`/`)

| Balise | Valeur |
|--------|--------|
| `<title>` | Pièces détachées auto Abidjan, neuf & occasion \| AutoAfrique |
| `<meta name="description">` | Achetez pièces détachées auto neuves et occasion à Abidjan, Côte d'Ivoire. Prix transparents, garantie incluse, paiement Mobile Money, Afrique de l'Ouest. |
| `<link rel="canonical">` | `/` |
| `<meta name="robots">` | index, follow |

### Marketplace (`/dashboard/marketplace`)

| Balise | Valeur |
|--------|--------|
| `<title>` | Marketplace — Pièces détachées automobile \| AutoAfrique |
| `<meta name="description">` | Parcourez notre catalogue de pièces détachées auto neuves et occasion. Filtrez par marque, modèle et prix. Paiement Mobile Money. |
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

### Pages informationnelles (R023-R032)

Routes publiques indexables, `robots: index, follow`, canonical auto (URL de la page), sitemap oui. Le titre final respecte le template racine `%s | AutoAfrique`.

| Route | `<title>` | `<meta name="description">` |
|-------|-----------|------------------------------|
| `/a-propos` | Qui sommes-nous ? \| AutoAfrique | Découvrez AutoAfrique, la marketplace de pièces détachées automobiles en Afrique de l'Ouest, priorité Abidjan (Côte d'Ivoire). Paiement Mobile Money, livraison 24-72h. |
| `/conditions-generales` | Conditions générales de vente \| AutoAfrique | Conditions générales de vente d'AutoAfrique : commandes, paiement Mobile Money, livraison 24-72h, retours et garanties en Afrique de l'Ouest. |
| `/politique-de-confidentialite` | Politique de confidentialité \| AutoAfrique | Politique de confidentialité d'AutoAfrique : quelles données nous collectons, pourquoi, comment elles sont protégées et quels sont vos droits (loi ivoirienne 2013-450). |
| `/aide` | Centre d'aide \| AutoAfrique | Centre d'aide AutoAfrique : créer un compte Acheteur ou Vendeur, commander, payer en Mobile Money, suivre la livraison 24-72h et retourner une pièce. |
| `/paiement` | Paiement Mobile Money sécurisé \| AutoAfrique | Paiement sécurisé par Mobile Money sur AutoAfrique : Orange Money, MTN MoMo, Moov Money, Wave. Prix en FCFA affiché, aucune donnée bancaire, reçu dans votre compte. |
| `/livraison` | Livraison 24-72h \| AutoAfrique | Livraison AutoAfrique : expédition en 24-72h, priorité Abidjan et grandes villes d'Afrique de l'Ouest, point de retrait, suivi de commande. |
| `/contact` | Nous contacter \| AutoAfrique | Contactez l'équipe AutoAfrique : questions, commandes, paiements, livraisons, retours ou devenir vendeur. Service client Afrique de l'Ouest. |
| `/retours` | Retours et remboursements \| AutoAfrique | Retours et remboursements AutoAfrique : pièce non conforme, non adaptée ou endommagée. Conditions de retour sous 30 jours, remboursement en Mobile Money. |
| `/blog` | Le blog AutoAfrique \| AutoAfrique | Conseils automobiles : entretien, achat de pièces détachées, guide des prix, Mobile Money et livraison en Afrique de l'Ouest. Le blog AutoAfrique. |
| `/manuels-reparation` | Manuels de réparation et tutoriels \| AutoAfrique | Manuels de réparation et tutoriels AutoAfrique pour les véhicules des marques disponibles en Afrique de l'Ouest. Guides pratiques à destination des garagistes et particuliers. |

Contrainte « aucun faux chiffre / aucune fausse preuve » : les pages de contact et préfixées n'exposent pas de numéro de téléphone, d'adresse email ou de coordonnées inventées ; les canaux de contact sont présentés comme « à confirmer avant mise en production ».

### Pages catalogue SEO (catégorie / marque) — R033-R057

Routes publiques rendues dynamiquement (`force-dynamic`), `robots: index, follow`, canonical auto = URL de la page (ex. `/marketplace/categorie/pneus-jantes`), sitemap oui. Titre final selon le template racine `%s | AutoAfrique`.

| Type de page | `<title>` | `<meta name="description">` | H1 |
|--------------|-----------|------------------------------|----|
| Catégorie (`/marketplace/categorie/{slug}`) | Pièces détachées {Catégorie} à Abidjan \| AutoAfrique | {Description de la catégorie} Paiement Mobile Money, livraison 24-72h. | Pièces détachées {Catégorie} à Abidjan |
| Marque (`/marketplace/marque/{slug}`) | Pièces détachées auto {Marque} à Abidjan \| AutoAfrique | {Description de la marque} Paiement Mobile Money, livraison 24-72h. | Pièces détachées auto {Marque} à Abidjan |

Le mapping slug → libellé → filtre est centralisé dans `src/lib/marketplace-catalog.ts` (source de vérité, cf. `15-CATALOGUE.md`).

## Open Graph

| Property | Valeur |
|----------|--------|
| `og:title` | Pièces détachées auto Abidjan, neuf & occasion \| AutoAfrique |
| `og:description` | Achetez pièces détachées auto neuves et occasion à Abidjan, Côte d'Ivoire. Prix transparents, garantie incluse, paiement Mobile Money. |
| `og:image` | `/og-image.png` (1200×630px) |
| `og:url` | `https://autoafrique-saas.vercel.app/` |
| `og:type` | website |
| `og:locale` | fr_SN |
| `og:site_name` | AutoAfrique |

## Twitter Card

| Property | Valeur |
|----------|--------|
| `twitter:card` | summary_large_image |
| `twitter:title` | Pièces détachées auto Abidjan, neuf & occasion \| AutoAfrique |
| `twitter:description` | Achetez pièces détachées auto neuves et occasion à Abidjan, Côte d'Ivoire. Prix transparents, garantie incluse, paiement Mobile Money. |
| `twitter:image` | `/og-image.png` |

## Performance SEO

| Métrique | Objectif |
|----------|----------|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| TTFB | < 600ms |

## Structured data (landing `/`)

La landing embarque `Organization`, `WebSite` et `FAQPage` (3 questions : compatibilité d'une pièce, différence pièce d'origine / neuve / occasion contrôlée, paiement Mobile Money). Modèles dans `08-STRUCTURED-DATA.md`.

## Titres dynamiques (détail produit / annonce)

Le détail produit (R005) et le détail annonce véhicule (R017) s'affichent dans une modal (aucune route dédiée documentée dans `02-ROUTES.md`). Le titre de l'onglet est mis à jour côté client via `useDocumentTitle` :

- Modal produit : `<nom du produit> | AutoAfrique` (fallback : « Marketplace — Pièces détachées automobile | AutoAfrique »)
- Modal véhicule : `<marque> <modèle> <année> | AutoAfrique` (fallback : « Véhicules — Annonces Côte d'Ivoire | AutoAfrique »)

`generateMetadata` reste inutilisable ici (pas de page serveur avec `params`) ; voir `DECISIONS.md` D23.
