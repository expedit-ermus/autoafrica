# Templates de pages

## Template : Landing Page

### Structure

```
Header (dark)
├── Logo
├── Barre de recherche
├── Icônes (panier, profil)
└── Navigation catégories

Hero split
├── Gauche : CarSelector
│   ├── Label "Trouvez la pièce qu'il vous faut"
│   ├── Select marque
│   ├── Select modèle
│   └── CTA "Trouver"
└── Droite : PromoBanner (carousel 3 slides)

PartsCatalog (12 catégories)

BrandGrid (12 marques)

TrustBar (4 items)

BestSellers (6 produits ProductCard)

SEOText

Footer (e-commerce)
```

### Données à charger

- CarSelector : marques et modèles (statique)
- PromoBanner : 3 images carousel (statique)
- PartsCatalog : 12 catégories (statique)
- BrandGrid : 12 logos (statique)
- TrustBar : 4 items (statique)
- BestSellers : 6 produits (API /api/v1/products?limit=6)
- Footer : contenu i18n

---

## Template : Marketplace

### Structure

```
Header (app)
├── Logo
├── Recherche
└── Navigation

Sidebar (app)
├── Logo
├── Navigation items
└── Déconnexion

Contenu principal
├── Fil d'Ariane
├── Filtres
│   ├── Recherche texte
│   ├── Marque (select)
│   ├── Modèle (select)
│   ├── Condition (select)
│   └── Prix (range)
├── Grille produits (ProductCard × N)
└── Pagination

Footer (light)
```

### Données à charger

- Products : API /api/v1/products (avec filtres)
- Brands : API /api/v1/brands
- Categories : statique
- Filters : URL params

---

## Template : Détail Produit (Modal)

### Structure

```
Overlay (bg-black/50)
└── Conteneur
    ├── Image produit (gauche)
    ├── Infos produit (droite)
    │   ├── Badge (neuf/occasion)
    │   ├── Titre
    │   ├── Référence
    │   ├── Prix (FCFA)
    │   ├── Disponibilité
    │   ├── Localisation
    │   ├── Description
    │   ├── Caractéristiques
    │   ├── Compatibilité
    │   └── Avis clients
    ├── CTA "Ajouter au panier"
    └── Fermer (×)
```

---

## Template : Panier

### Structure

```
Header (app)

Contenu principal
├── Titre "Mon panier"
├── Liste articles
│   ├── Image
│   ├── Titre
│   ├── Prix
│   ├── Quantité
│   └── Supprimer
├── Sous-total
├── Frais de livraison
├── Total
└── CTA "Passer la commande"

Footer (light)
```

---

## Template : Commandes

### Structure

```
Header (app)

Contenu principal
├── Titre "Mes commandes"
├── Filtres (statut, date)
├── Liste commandes
│   ├── Numéro
│   ├── Date
│   ├── Statut (badge)
│   ├── Montant
│   └── Détails
└── Pagination

Footer (light)
```

---

## Template : Connexion

### Structure

```
Header (landing)

Conteneur centré
├── Logo
├── Titre "Connexion"
├── Formulaire
│   ├── Email
│   ├── Mot de passe
│   ├── Se souvenir de moi
│   └── CTA "Se connecter"
├── Lien "Mot de passe oublié ?"
├── Séparateur "ou"
└── Lien "Créer un compte"

Footer (landing)
```

---

## Template : Inscription

### Structure

```
Header (landing)

Conteneur centré
├── Logo
├── Titre "Inscription"
├── Formulaire
│   ├── Nom complet
│   ├── Email
│   ├── Téléphone
│   ├── Pays (select)
│   ├── Rôle (vendeur/acheteur)
│   ├── Mot de passe
│   ├── Confirmer mot de passe
│   ├── Conditions d'utilisation
│   └── CTA "S'inscrire"
├── Lien "Déjà un compte ? Se connecter"

Footer (landing)
```

---

## Template : Dashboard

### Structure

```
Header (app)

Sidebar (app)

Contenu principal
├── Titre page
├── Breadcrumb
├── Statistiques (4 cards)
├── Contenu spécifique
└── Actions

Footer (light)
```

---

## Template : Aide

### Structure

```
Header (app)

Contenu principal
├── Titre "Aide"
├── Barre de recherche
├── Catégories d'aide
│   ├── Général
│   ├── Compte
│   ├── Commandes
│   ├── Paiements
│   └── Livraison
├── FAQ accordéon
└── Contact support

Footer (light)
```
