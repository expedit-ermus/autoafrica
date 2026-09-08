# Catalogue

## Vision

Le catalogue AutoAfrique couvre les pièces détachées (12 catégories) et les véhicules d'occasion/neufs (annonces Côte d'Ivoire). Il est le point d'entrée de la recherche pour les acheteurs et structure les données produits.

## Catégories de pièces

Liste fermée et gouvernée par l'administration.

Dix catégories, alignées sur `Category.slug` en base (créées par `prisma/seed.mjs`) et sur `CATEGORY_SLUGS`.

| Catégorie | Sous-catégories |
|-----------|-----------------|
| Moteur | Pièces moteur, joint de culasse, piston, vilebrequin, filtres, courroies |
| Frein | Disques, plaquettes, étriers, câbles |
| Électrique | Alternateur, démarreur, batterie, bougies, phares, faisceaux |
| Suspension | Amortisseurs, ressorts, bras, rotules, barres antiroulis |
| Refroidissement | Radiateurs, pompes à eau, thermostats, durites, liquides |
| Transmission | Boîtes de vitesses, kits d'embrayage, disques, butées, cardans |
| Carrosserie | Pare-chocs, rétroviseurs, phares, calandre, tôlerie |
| Pneumatique | Pneus neufs et d'occasion, jantes aluminium et acier |
| Direction | Crémaillères, rotules, biellettes, pompes d'assistance |
| Échappement | Silencieux, catalyseurs, collecteurs, lignes complètes |

> Cette liste comptait auparavant douze catégories définies pour le SEO, dont huit sans aucun produit en base (`pneus-jantes`, `filtre`, `huiles-fluides`, `embrayage`, `courroies-chaines`, `amortissement`, `autres`, plus `electricite` mal orthographié). Trois catégories réelles — `electrique`, `refroidissement`, `transmission` — n'étaient exposées par aucune page. Vingt et un produits sur cinquante et un étaient inatteignables par la navigation (cf. D62).

## Marques

Marques populaires : Toyota, Hyundai, Kia, Peugeot, Mercedes, Renault, Nissan, Volkswagen (modèles Brand / CarModel pour la compatibilité véhicule).

## Filtres de recherche

- Marque, Modèle, Année (2000-2025)
- Condition (Neuf, Occasion, Remanufaturé)
- Prix (plages)
- Disponibilité (En stock, Sur commande)
- Localisation (Pays, Ville)

## Véhicules (marché CI)

| Modèle | Description |
|--------|-------------|
| `Vehicle` | Catalogue de référence (brandId, carModelId, année, prix, kilométrage, fuel, gearbox, condition, bodyType, city, pays CI) |
| `VehicleListing` | Annonce vendeur (statut DRAFT, ACTIVE, RESERVED, SOLD, CANCELLED) |

Le marché CI (Abidjan, Bouaké, Yamoussoukro, Korhogo, San-Pedro) est prioritaire, prix en FCFA, paiement Mobile Money.

### Endpoints véhicules

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/v1/vehicles` | Public | Liste annonces véhicules |
| POST | `/api/v1/vehicles` | Requise | Créer annonce véhicule |
| GET | `/api/v1/vehicles/[id]` | Public | Détail véhicule |
| PUT | `/api/v1/vehicles/[id]` | Requise | Modifier annonce véhicule |
| DELETE | `/api/v1/vehicles/[id]` | Requise | Supprimer annonce véhicule |

## Pages

- `/dashboard/marketplace` — catalogue pièces
- `/dashboard/vehicles` — annonces véhicules (index, oui)
- `/marketplace/categorie/[slug]` — page SEO par catégorie (R033-R044)
- `/marketplace/marque/[slug]` — page SEO par marque (R045-R057)

## SEO

- `/dashboard/marketplace` : index, follow, schémas Product / ItemList
- `/dashboard/vehicles` : index, follow, schémas Vehicle / ItemList
- `/marketplace/categorie/[slug]` et `/marketplace/marque/[slug]` : index, follow ; titres et descriptions mentionnent Abidjan (« Pièces détachées {X} à Abidjan ») ; rendues dynamiquement (`force-dynamic`) depuis le catalogue réel ; sitemap oui.

## Routes SEO catalogue (groupe 2)

### Catégories (slugs R033-R042)

Les 10 slugs exposés et leur libellé affiché sur les pages SEO :

| Slug | Libellé |
|------|---------|
| `moteur` | Moteur |
| `frein` | Frein |
| `electrique` | Électrique |
| `suspension` | Suspension |
| `refroidissement` | Refroidissement |
| `transmission` | Transmission |
| `carrosserie` | Carrosserie |
| `pneumatique` | Pneumatique |
| `direction` | Direction |
| `echappement` | Échappement |

`pneumatique`, `direction` et `echappement` existent en base mais n'ont pas encore de produit : elles affichent l'état vide, ce qui est exact, et se rempliront sans changement de code.

Un slug inconnu appelle `notFound()` et renvoie un vrai 404 (cf. D60). Une catégorie sans produit affiche l'état vide de `CatalogueFilters` : elle ne montre plus un échantillon d'autres catégories sous son propre titre (cf. D62).

Le filtre API produits s'applique par `category = slug` : la route `/marketplace/categorie/{slug}` appelle le service avec `{ category: slug }`, exactement le champ `Category.slug` (cf. `products.service.ts`).

### Marques (slugs R045-R057)

| Slug | Marque (nom pour le filtre) |
|------|----------------------------|
| `toyota` | Toyota |
| `hyundai` | Hyundai |
| `kia` | Kia |
| `peugeot` | Peugeot |
| `mercedes-benz` | Mercedes |
| `renault` | Renault |
| `suzuki` | Suzuki |
| `nissan` | Nissan |
| `ford` | Ford |
| `volkswagen` | Volkswagen |
| `bmw` | BMW |
| `citroen` | Citroën |
| `opel` | Opel |

> **Note** : le filtre API produits s'applique par `brand = nom exact` (pas par slug) : `productsService.list({ brand: "<nom>" })`. Les routes `/marketplace/marque/{slug}` mappent donc chaque slug vers le nom de marque (ex. `mercedes-benz` → `Mercedes`, `citroen` → `Citroën`). Le nom doit correspondre exactement a `Brand.name` en base : il valait `Mercedes-Benz`, la base porte `Mercedes`, et les six pieces de la marque etaient inatteignables (cf. D62). Le tableau est centralisé dans `src/lib/marketplace-catalog.ts` (seule source de vérité du mapping slugs ↔ libellés ↔ filtre).

### Contenu

- Pages serveur `force-dynamic` (asynchrones, réflètent le catalogue réel au moment de la requête), `generateMetadata` par page, `notFound()` (HTTP 404) pour un slug inconnu.
- Composant serveur réutilisable `src/components/CatalogPage.tsx` (fil d'Ariane, H1 mentionnant Abidjan, description, décompte, grille `ProductCard`, état vide « Catalogue en cours de préparation », CTA vers le marketplace complet).
- Liens mis à jour vers les routes SEO : `PartsCatalog`, `BrandGrid` (homepage), footer (colonne Produits), `Header` (navigation catégories).
- Limite : la base n'est pas encore seedée (Catégorie/Marque vides) → les pages s'affichent avec l'état vide mais restent indexables.
