# Matrice des routes

## Routes principales

| ID | Route | Type | Modèle | Objectif utilisateur | Objectif commercial | Intention | H1 | Indexation | Sitemap | Schéma | Auth |
|----|-------|------|--------|---------------------|--------------------|-----------|-----|-----------|---------|---------|----|
| R001 | `/` | Accueil | Landing | Découvrir l'offre | Inscription | Navigationnelle | AutoAfrique — Pièces Auto Marketplace Afrique de l'Ouest | index | oui | Organization, WebSite | publique |
| R002 | `/auth/login` | Auth | Login | Se connecter | Connexion | Navigationnelle | Connexion à AutoAfrique | noindex | non | aucun | publique |
| R003 | `/auth/register` | Auth | Register | Créer un compte | Inscription | Navigationnelle | Inscription sur AutoAfrique | noindex | non | aucun | publique |
| R004 | `/dashboard` | App | Dashboard | Vue d'ensemble | Rétention | Navigationnelle | Tableau de bord | noindex | non | aucun | privée |
| R005 | `/dashboard/marketplace` | App | Marketplace | Acheter/vendre | Vente | Commerciale | Marketplace — Pièces détachées automobile | index | oui | Product, ItemList | publique |
| R006 | `/dashboard/inventory` | App | Inventory | Gérer stock | Rétention | Navigationnelle | Gestion d'inventaire | noindex | non | aucun | privée |
| R007 | `/dashboard/cart` | App | Cart | Voir panier | Achat | Commerciale | Mon panier | noindex | non | aucun | privée |
| R008 | `/dashboard/orders` | App | Orders | Suivre commandes | Rétention | Navigationnelle | Mes commandes | noindex | non | aucun | privée |
| R009 | `/dashboard/crm` | App | CRM | Gérer clients | Rétention | Navigationnelle | CRM — Gestion client | noindex | non | aucun | privée |
| R010 | `/dashboard/payments` | App | Payments | Paiements | Rétention | Navigationnelle | Paiements | noindex | non | aucun | privée |
| R011 | `/dashboard/finance` | App | Finance | Comptabilité | Rétention | Navigationnelle | Finance | noindex | non | aucun | privée |
| R012 | `/dashboard/analytics` | App | Analytics | Rapports | Rétention | Navigationnelle | Analytics | noindex | non | aucun | privée |
| R013 | `/dashboard/admin` | App | Admin | Administration | Rétention | Navigationnelle | Administration | noindex | non | aucun | privée |
| R014 | `/dashboard/settings` | App | Settings | Paramètres | Rétention | Navigationnelle | Paramètres | noindex | non | aucun | privée |
| R015 | `/dashboard/profile` | App | Profile | Profil | Rétention | Navigationnelle | Mon profil | noindex | non | aucun | privée |
| R016 | `/dashboard/help` | App | Help | Aide | Support | Informationnelle | Aide | noindex | non | FAQPage | privée |
| R017 | `/dashboard/vehicles` | App | Vehicles | Voir annonces véhicules | Vente | Commerciale | Véhicules — Annonces Côte d'Ivoire | index | oui | Vehicle, ItemList | publique |
| R018 | `/dashboard/suppliers` | App | Suppliers | Gérer fournisseurs | Rétention | Navigationnelle | Fournisseurs | noindex | non | aucun | privée |
| R019 | `/dashboard/purchase-orders` | App | PurchaseOrders | Suivre approvisionnement | Rétention | Navigationnelle | Approvisionnement | noindex | non | aucun | privée |
| R020 | `/dashboard/containers` | App | Containers | Suivre conteneurs | Rétention | Navigationnelle | Conteneurs | noindex | non | aucun | privée |
| R021 | `/dashboard/customs` | App | Customs | Suivre dossiers douane | Rétention | Navigationnelle | Douanes | noindex | non | aucun | privée |

## Routes API

| ID | Route | Méthode | Auth | Description |
|----|-------|---------|------|-------------|
| R100 | `/api/v1/auth/login` | POST | Public | Connexion |
| R101 | `/api/v1/auth/register` | POST | Public | Inscription |
| R102 | `/api/v1/auth/logout` | POST | Required | Déconnexion |
| R103 | `/api/v1/auth/me` | GET | Required | Profil utilisateur |
| R104 | `/api/v1/auth/refresh` | POST | Public | Rafraîchir token |
| R105 | `/api/v1/products` | GET | Public | Liste produits |
| R106 | `/api/v1/products` | POST | Required | Créer produit |
| R107 | `/api/v1/products/[id]` | GET | Public | Détail produit |
| R108 | `/api/v1/products/[id]` | PUT | Required | Modifier produit |
| R109 | `/api/v1/products/[id]` | DELETE | Required | Supprimer produit |
| R110 | `/api/v1/orders` | GET | Required | Liste commandes |
| R111 | `/api/v1/orders` | POST | Required | Créer commande |
| R112 | `/api/v1/orders/[id]` | GET | Public | Détail commande |
| R113 | `/api/v1/orders/[id]` | PATCH | Required | Modifier commande |
| R114 | `/api/v1/payments` | POST | Required | Traiter paiement |
| R115 | `/api/v1/payments` | GET | Required | Liste paiements |
| R116 | `/api/v1/payments/[id]` | GET | Required | Statut paiement |
| R117 | `/api/v1/customers` | GET | Public | Liste clients |
| R118 | `/api/v1/customers` | POST | Required | Créer client |
| R119 | `/api/v1/customers/[id]` | GET | Public | Détail client |
| R120 | `/api/v1/customers/[id]` | PUT | Required | Modifier client |
| R121 | `/api/v1/customers/[id]` | DELETE | Required | Supprimer client |
| R122 | `/api/v1/leads` | GET | Public | Liste leads |
| R123 | `/api/v1/leads` | POST | Required | Créer lead |
| R124 | `/api/v1/leads/[id]` | PUT | Required | Modifier lead |
| R125 | `/api/v1/leads/[id]` | DELETE | Required | Supprimer lead |
| R126 | `/api/v1/notifications` | GET | Required | Notifications |
| R127 | `/api/v1/notifications/read` | POST | Required | Marquer lues |
| R128 | `/api/v1/reviews` | GET | Public | Avis produits |
| R129 | `/api/v1/reviews` | POST | Required | Créer avis |
| R130 | `/api/v1/upload` | POST | Required | Upload image |
| R131 | `/api/v1/vehicles` | GET | Public | Liste annonces véhicules |
| R132 | `/api/v1/vehicles` | POST | Required | Créer annonce véhicule |
| R133 | `/api/v1/vehicles/[id]` | GET | Public | Détail véhicule |
| R134 | `/api/v1/vehicles/[id]` | PUT | Required | Modifier annonce véhicule |
| R135 | `/api/v1/vehicles/[id]` | DELETE | Required | Supprimer annonce véhicule |
| R136 | `/api/v1/suppliers` | GET | Public | Liste fournisseurs |
| R137 | `/api/v1/suppliers` | POST | Required | Créer fournisseur |
| R138 | `/api/v1/suppliers/[id]` | GET | Public | Détail fournisseur |
| R139 | `/api/v1/suppliers/[id]` | PUT | Required | Modifier fournisseur |
| R140 | `/api/v1/suppliers/[id]` | DELETE | Required | Supprimer fournisseur |
| R141 | `/api/v1/purchase-orders` | GET | Public | Liste bons de commande |
| R142 | `/api/v1/purchase-orders` | POST | Required | Créer bon de commande |
| R143 | `/api/v1/purchase-orders/[id]` | GET | Public | Détail bon de commande |
| R144 | `/api/v1/purchase-orders/[id]` | PUT | Required | Modifier bon de commande |
| R145 | `/api/v1/purchase-orders/[id]` | PATCH | Required | Changer statut bon de commande |
| R146 | `/api/v1/purchase-orders/[id]` | DELETE | Required | Supprimer bon de commande |
| R147 | `/api/v1/containers` | GET | Public | Liste conteneurs |
| R148 | `/api/v1/containers` | POST | Required | Créer conteneur |
| R149 | `/api/v1/customs-records` | GET | Public | Liste dossiers douane |
| R150 | `/api/v1/customs-records` | POST | Required | Créer dossier douane |

## Routes techniques

| ID | Route | Statut | Description |
|----|-------|--------|-------------|
| R200 | `/robots.txt` | 200 | Robots |
| R201 | `/sitemap.xml` | 200 | Sitemap |
| R202 | `/404` | 404 | Page introuvable |
| R203 | `/opengraph-image` | 200 | Image OG |

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
