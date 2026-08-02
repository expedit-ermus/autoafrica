# ERP

## Vision

AutoAfrique est un ERP SaaS complet : au-delà de la marketplace, il couvre la supply chain (approvisionnement, import, douane), l'inventaire multi-entrepôts, la logistique de livraison et la finance. Le cœur de l'ERP est la supply chain : achat depuis l'Asie/Europe, importation par conteneur, dédouanement, stockage et livraison.

## Modules

### Approvisionnement (supply chain)

| Module | Modèle | Page | Service |
|--------|--------|------|---------|
| Fournisseurs | `Supplier`, `SupplierProduct` | `/dashboard/suppliers` | `suppliers` |
| Bons de commande | `PurchaseOrder`, `PurchaseOrderItem` | `/dashboard/purchase-orders` | `purchase-orders` |
| Conteneurs | `Container` | `/dashboard/containers` | `containers` |
| Douanes | `CustomsRecord` | `/dashboard/customs` | `customs-records` |

Flux : un bon de commande référence un fournisseur, un conteneur référence un bon de commande, un dossier douane référence un conteneur.

### Inventaire et entrepôts

| Modèle | Page | Service |
|--------|------|---------|
| `Warehouse`, `Inventory`, `StockMovement` | `/dashboard/inventory` (multi-onglets) | `inventory` |

- Stock multi-entrepôts : `available = quantity - reserved`
- Mouvements : RECEIVED, TRANSFERRED, ADJUSTED, SOLD...
- Transfert entre entrepôts
- Ajustement de stock inline

### Livraison

| Modèle | Page | Service |
|--------|------|---------|
| `Shipment`, `DeliveryRoute`, `FleetVehicle` | `/dashboard/delivery` (multi-onglets) | `delivery` |

- Expéditions liées à une commande (`Order`), tracking unique
- Tournées de livraison
- Flotte (moto, voiture, camion, van) avec plaque unique

### Finance

| Modèle | Page | Service |
|--------|------|---------|
| `Invoice`, `Account`, `Transaction` | `/dashboard/finance` (multi-onglets) | `finance` |

- Factures : TVA 18% par défaut (`totalAmount = subtotal + taxAmount`), `paidAt` à PAID
- Plan comptable : asset, liability, equity, revenue, expense
- Écritures de journal : débit/crédit, solde courant mis à jour, running balance

## Endpoints

Voir `02-ROUTES.md` (R136-R203) pour la matrice complète des routes API de la supply chain, de l'inventaire, de la livraison et de la finance.

## Règles métier

- Un bon de commande a un `poNumber` unique
- Un conteneur a un `containerNumber` unique, une seule PO associée
- Un dossier douane est lié à un conteneur (1:1)
- Le stock disponible d'une ligne inventaire = quantité - réservée
- La TVA est calculée automatiquement à 18% sur les factures
- Une écriture de journal met à jour le solde du compte dans la même transaction
