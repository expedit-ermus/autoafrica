# Architecture de l'information

## Arborescence principale

```
Accueil (/)
├── Catalogue (/dashboard/marketplace)
│   ├── Catégorie (/dashboard/marketplace?category=...)
│   ├── Produit (/dashboard/marketplace?product=...)
│   └── Recherche (/dashboard/marketplace?search=...)
├── Panier (/dashboard/cart)
├── Commandes (/dashboard/orders)
├── Inventaire (/dashboard/inventory)
├── CRM (/dashboard/crm)
├── Finance (/dashboard/finance)
├── Paiements (/dashboard/payments)
├── Analytics (/dashboard/analytics)
├── Administration (/dashboard/admin)
├── Paramètres (/dashboard/settings)
├── Profil (/dashboard/profile)
├── Aide (/dashboard/help)
├── Connexion (/auth/login)
├── Inscription (/auth/register)
└── Pages légales
    ├── Mentions légales (/mentions-legales)
    ├── Politique de confidentialité (/politique-de-confidentialite)
    └── Conditions d'utilisation (/conditions-utilisation)
```

## Navigation principale

### Header (utilisateur non connecté)

| Ordre | Libellé | Route | CTA |
|-------|---------|-------|-----|
| 1 | Accueil | / | non |
| 2 | Catalogue | /dashboard/marketplace | non |
| 3 | Connexion | /auth/login | non |
| 4 | Inscription | /auth/register | oui |

### Header (utilisateur connecté)

| Ordre | Libellé | Route | CTA |
|-------|---------|-------|-----|
| 1 | Accueil | / | non |
| 2 | Catalogue | /dashboard/marketplace | non |
| 3 | Panier | /dashboard/cart | non |
| 4 | Tableau de bord | /dashboard | non |

### Sidebar Dashboard

| Ordre | Libellé | Route | Icône |
|-------|---------|-------|-------|
| 1 | Tableau de bord | /dashboard | 📊 |
| 2 | Marketplace | /dashboard/marketplace | 🏪 |
| 3 | Inventaire | /dashboard/inventory | 📦 |
| 4 | Commandes | /dashboard/orders | 🛒 |
| 5 | CRM | /dashboard/crm | 👥 |
| 6 | Paiements | /dashboard/payments | 💳 |
| 7 | Finance | /dashboard/finance | 💰 |
| 8 | Analytics | /dashboard/analytics | 📈 |
| 9 | Administration | /dashboard/admin | ⚙️ |
| 10 | Aide | /dashboard/help | ❓ |
| 11 | Paramètres | /dashboard/settings | ⚙️ |
| 12 | Profil | /dashboard/profile | 👤 |

### Footer

| Colonne 1 | Colonne 2 | Colonne 3 | Colonne 4 |
|-----------|-----------|-----------|-----------|
| AutoAfrique | Produit | Entreprise | Légal |
| Description | Marketplace | À propos | Politique de confidentialité |
| Social | Inventaire | Blog | Conditions d'utilisation |
| Paiements | CRM | Carrières | Cookies |
| Transporteurs | Paiements | Contact | |
| | Finance | Aide | |

### Catégories de pièces (Landing)

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

## Taxonomies

### Catégories de produits

Liste fermée et gouvernée par l'administration.

### Filtres de recherche

- Marque (Toyota, Hyundai, Kia, Peugeot, Mercedes, Renault, etc.)
- Modèle (Hilux, Corolla, Tucson, Sportage, etc.)
- Année (2000-2025)
- Condition (Neuf, Occasion, Remanufaturé)
- Prix (四 Plages)
- Disponibilité (En stock, Sur commande)
- Localisation (Pays, Ville)

### Pagination

- 20 produits par page
- Navigation "Précédent / Suivant"
- Numéros de page pour la navigation rapide

### Recherche interne

- Route : `/dashboard/marketplace?search=...`
- Indexation : noindex, follow
- État vide : "Aucun résultat pour [recherche]" + suggestions
