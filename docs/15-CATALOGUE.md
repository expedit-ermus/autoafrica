# Catalogue

## Vision

Le catalogue AutoAfrique couvre les pièces détachées (12 catégories) et les véhicules d'occasion/neufs (annonces Côte d'Ivoire). Il est le point d'entrée de la recherche pour les acheteurs et structure les données produits.

## Catégories de pièces

Liste fermée et gouvernée par l'administration.

| Catégorie | Sous-catégories |
|-----------|-----------------|
| Pneus & Jantes | Pneus été, Pneus hiver, Jantes aluminium, Jantes acier |
| Frein | Disques, Plaquettes, Étriers, Câbles |
| Moteur | Pièces moteur, Joint de culasse, Piston, Vilebrequin |
| Courroies & Chaînes | Courroie distribution, Galet tendeur |
| Embrayage | Kit d'embrayage, Disque, Récepteur |
| Amortissement | Amortisseurs, Supports, Biellettes |
| Suspension | Ressorts, Baladeurs, Barres antiroulis |
| Filtre | Filtre à huile, à air, à carburant, habitacle |
| Carrosserie | Pare-chocs, Rétroviseurs, Phares, Calandre |
| Huiles & Fluides | Huile moteur, Liquide refroidissement, de frein |
| Électricité | Alternateur, Démarreur, Batterie, Bougies |
| Accessoires | Divers |

## Marques

Marques populaires : Toyota, Hyundai, Kia, Peugeot, Mercedes, Renault (modèles Brand / CarModel pour la compatibilité véhicule).

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

### Catégories (slugs R033-R044)

Les 12 slugs demandés et leur libellé affiché sur les pages SEO :

| Slug | Libellé |
|------|---------|
| `pneus-jantes` | Pneus & Jantes |
| `frein` | Frein |
| `moteur` | Moteur |
| `courroies-chaines` | Courroies & Chaînes |
| `embrayage` | Embrayage |
| `amortissement` | Amortissement |
| `suspension` | Suspension |
| `filtre` | Filtre |
| `carrosserie` | Carrosserie |
| `huiles-fluides` | Huiles & Fluides |
| `electricite` | Électricité |
| `autres` | Autres catégories |

Le filtre API produits s'applique par `category = slug` : la route `/marketplace/categorie/{slug}` appelle le service avec `{ category: slug }`, exactement le champ `Category.slug` (cf. `products.service.ts`).

### Marques (slugs R045-R057)

| Slug | Marque (nom pour le filtre) |
|------|----------------------------|
| `toyota` | Toyota |
| `hyundai` | Hyundai |
| `kia` | Kia |
| `peugeot` | Peugeot |
| `mercedes-benz` | Mercedes-Benz |
| `renault` | Renault |
| `suzuki` | Suzuki |
| `nissan` | Nissan |
| `ford` | Ford |
| `volkswagen` | Volkswagen |
| `bmw` | BMW |
| `citroen` | Citroën |
| `opel` | Opel |

> **Note** : le filtre API produits s'applique par `brand = nom exact` (pas par slug) : `productsService.list({ brand: "<nom>" })`. Les routes `/marketplace/marque/{slug}` mappent donc chaque slug vers le nom de marque (ex. `mercedes-benz` → `Mercedes-Benz`, `citroen` → `Citroën`). Le tableau est centralisé dans `src/lib/marketplace-catalog.ts` (seule source de vérité du mapping slugs ↔ libellés ↔ filtre).

### Contenu

- Pages serveur `force-dynamic` (asynchrones, réflètent le catalogue réel au moment de la requête), `generateMetadata` par page, `notFound()` (HTTP 404) pour un slug inconnu.
- Composant serveur réutilisable `src/components/CatalogPage.tsx` (fil d'Ariane, H1 mentionnant Abidjan, description, décompte, grille `ProductCard`, état vide « Catalogue en cours de préparation », CTA vers le marketplace complet).
- Liens mis à jour vers les routes SEO : `PartsCatalog`, `BrandGrid` (homepage), footer (colonne Produits), `Header` (navigation catégories).
- Limite : la base n'est pas encore seedée (Catégorie/Marque vides) → les pages s'affichent avec l'état vide mais restent indexables.
