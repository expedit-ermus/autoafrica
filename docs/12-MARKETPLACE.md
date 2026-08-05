# Marketplace

## Vision

Le marketplace AutoAfrique connecte acheteurs et vendeurs de pièces détachées automobile en Afrique de l'Ouest. Les vendeurs publient leurs pièces, les acheteurs (garagistes, revendeurs, particuliers) recherchent, comparent et commandent avec paiement Mobile Money.

## Flux

1. Recherche : `/dashboard/marketplace?search=...&brand=...&category=...`
2. Consultation produit : modal/panneau détail
3. Ajout au panier : `/dashboard/cart`
4. Création de commande : POST `/api/v1/orders`
5. Paiement : POST `/api/v1/payments` (Mobile Money)
6. Suivi commande et livraison

## Vendeurs

- Activation de la vente dans « Mon compte » (`/dashboard/profile`) via POST `/api/v1/seller/activate` (`sellerEnabled=true`) — pas de compte séparé
- Publication de produits (`Product`) liés à un tenant et à un vendeur
- Gestion des produits, du stock et des ventes
- Frais de commission transparents

## Recherche et filtres

| Filtre | Type | Valeurs |
|--------|------|---------|
| Marque | select | Toyota, Hyundai, Kia, Peugeot, Mercedes, Renault... |
| Modèle | select | Hilux, Corolla, Tucson, Sportage... |
| Année | range | 2000-2025 |
| Condition | select | Neuf, Occasion, Remanufaturé |
| Prix | range | Plages |
| Disponibilité | select | En stock, Sur commande |
| Localisation | select | Pays, Ville |

### Comportement
- Mise à jour des URL params en temps réel
- Debounce 300ms sur la recherche texte
- Reset pagination à chaque changement de filtre
- Preset des valeurs depuis l'URL au chargement
- Pagination : 20 produits par page

## États

- Recherche vide : "Aucun résultat pour [terme]" + suggestions
- Produit hors stock : "Rupture de stock" + alternatives
- Panier vide : "Votre panier est vide"

## Tracking

- `search_product`, `filter_product`, `view_product`
- `add_to_cart`, `remove_from_cart`
- `checkout_start`, `payment_method`, `payment_success`, `payment_fail`
- `order_complete`

## SEO

- `/dashboard/marketplace` : index, follow
- Données structurées : ItemList, Product
- Title dynamique selon filtres, canonique sur elle-même

## Endpoints

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/v1/products` | Public | Liste produits (filtres + pagination) |
| POST | `/api/v1/products` | Requise | Créer produit |
| GET | `/api/v1/products/[id]` | Public | Détail produit |
| PUT | `/api/v1/products/[id]` | Requise | Modifier produit |
| DELETE | `/api/v1/products/[id]` | Requise | Supprimer produit |
| GET | `/api/v1/orders` | Requise | Liste commandes |
| POST | `/api/v1/orders` | Requise | Créer commande |
| GET | `/api/v1/orders/[id]` | Public | Détail commande |
| PATCH | `/api/v1/orders/[id]` | Requise | Modifier commande |
| POST | `/api/v1/payments` | Requise | Traiter paiement |
| GET | `/api/v1/payments` | Requise | Liste paiements |
| GET | `/api/v1/payments/[id]` | Requise | Statut paiement |

## Pages

- `/dashboard/marketplace` — catalogue avec recherche et filtres
- `/dashboard/cart` — panier
- `/dashboard/orders` — historique commandes
- `/dashboard/payments` — paiements
