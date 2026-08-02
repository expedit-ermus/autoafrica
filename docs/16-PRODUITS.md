# Produits

## Modèle `Product`

| Champ | Type | Contrainte |
|-------|------|------------|
| name | String | Obligatoire |
| reference | String | Unique par vendeur |
| description | String? | - |
| price | Float | > 0, FCFA (XOF) |
| condition | Condition | NEUF, OCCASION, REMANUFACTURE |
| category | String | Catégorie valide |
| brand | String | Marque valide |
| model | String? | - |
| yearMin / yearMax | Int? | yearMin <= yearMax |
| quantity | Int | >= 0 |
| images | Json? | Max 5, JPG/PNG |
| specs | Json? | Caractéristiques techniques |
| isActive / isFeatured | Boolean | Publication / mise en avant |
| views | Int | Compteur de vues |

Un produit est lié à un tenant et à un vendeur (`User`). La disponibilité commerciale est suivie dans les lignes inventaire (`Inventory` : `available = quantity - reserved`).

## Formulaires

### Product Create/Edit

| Champ | Type | Obligatoire | Validation |
|-------|------|-------------|------------|
| name | text | oui | Min 3 caracteres |
| reference | text | oui | Unique par vendeur |
| description | textarea | oui | Min 20 caracteres |
| price | number | oui | > 0 |
| condition | select | oui | NEUF, OCCASION, REMANUFACTURE |
| category | select | oui | Categorie valide |
| brand | select | oui | Marque valide |
| model | text | non | - |
| yearMin | number | non | <= yearMax |
| yearMax | number | non | >= yearMin |
| quantity | number | oui | >= 0 |
| images | file[] | oui | Max 5, JPG/PNG, 5Mo max |

### Actions
- Creation via POST /api/v1/products
- Modification via PUT /api/v1/products/[id]
- Upload images via POST /api/v1/upload

## Avis produits

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/v1/reviews?productId=` | Public | Liste avis |
| POST | `/api/v1/reviews` | Requise | Créer avis (rating 1-5, comment) |

## Endpoints produits

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/v1/products` | Public | Liste produits |
| POST | `/api/v1/products` | Requise | Créer produit |
| GET | `/api/v1/products/[id]` | Public | Détail produit |
| PUT | `/api/v1/products/[id]` | Requise | Modifier produit |
| DELETE | `/api/v1/products/[id]` | Requise | Supprimer produit |

## Règles

- Pas de faux produits, avis ou chiffres dans le seed
- Les images passent par `/api/v1/upload` (voir `17-IMAGES-MEDIA.md`)
- Le stock produit est géré dans l'inventaire multi-entrepôts (voir `13-ERP.md`)
