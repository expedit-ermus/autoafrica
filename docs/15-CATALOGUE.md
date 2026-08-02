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

## SEO

- `/dashboard/marketplace` : index, follow, schémas Product / ItemList
- `/dashboard/vehicles` : index, follow, schémas Vehicle / ItemList
