# Composants et layout

## Layout principal

### Structure globale

```
┌─────────────────────────────────────┐
│             Header (dark)           │
├─────────┬───────────────────────────┤
│         │                           │
│  Side   │        Contenu            │
│  bar    │        principal           │
│  (app)  │                           │
│         │                           │
├─────────┴───────────────────────────┤
│             Footer (e-commerce)     │
└─────────────────────────────────────┘
```

### Layout Landing Page

```
┌─────────────────────────────────────┐
│             Header (dark)           │
├─────────────────────────────────────┤
│                                     │
│  Hero (CarSelector + PromoBanner)  │
│                                     │
├─────────────────────────────────────┤
│                                     │
│         PartsCatalog (12)           │
│                                     │
├─────────────────────────────────────┤
│                                     │
│         BrandGrid (12)              │
│                                     │
├─────────────────────────────────────┤
│                                     │
│           TrustBar                  │
│                                     │
├─────────────────────────────────────┤
│                                     │
│        BestSellers (6)              │
│                                     │
├─────────────────────────────────────┤
│                                     │
│           SEOText                   │
│                                     │
├─────────────────────────────────────┤
│             Footer (e-commerce)     │
└─────────────────────────────────────┘
```

### Layout Dashboard

```
┌─────────────────────────────────────┐
│             Header (white)          │
├─────────┬───────────────────────────┤
│         │                           │
│  Side   │        Contenu            │
│  bar    │        principal           │
│  (dark) │                           │
│         │                           │
├─────────┴───────────────────────────┤
│           Footer (light)            │
└─────────────────────────────────────┘
```

## Composants réutilisables

### Header (dark)

| Élément | Style | Position |
|---------|-------|----------|
| Logo | Blanc, 120px | Gauche |
| Barre de recherche | Fond blanc, border | Centre |
| Icônes nav | Blanc, hover orange | Droite |
| Navigation catégories | Orange texte | Bas |

### Sidebar (app)

| Élément | Style | Position |
|---------|-------|----------|
| Logo | Blanc, 100px | Haut |
| Navigation | Blanc hover | Centre |
| Déconnexion | Bas | Bas |

### Carte produit (ProductCard)

| Élément | Style | Position |
|---------|-------|----------|
| Image | 200px height, object-cover | Haut |
| Badge (neuf/occasion) | Absolute top-left | Overlay |
| Titre | text-sm, 600 | Corps |
| Prix | text-lg, primary, FCFA | Corps |
| Vendeur | text-xs, gray | Corps |
| Localisation | text-xs, gray | Corps |
| CTA | primary button | Bas |

### Sélecteur véhicule (CarSelector)

| Élément | Style | Position |
|---------|-------|----------|
| Label | text-white | Haut |
| Select | SVG arrow, white bg | Inline |

### Bannière promo (PromoBanner)

| Élément | Style | Position |
|---------|-------|----------|
| Container | rounded-xl, overflow-hidden | Section |
| Slides | object-cover, h-full | Full |
| Dots | absolute bottom-2 | Overlay |

### Grille catégories (PartsCatalog)

| Élément | Style | Position |
|---------|-------|----------|
| Container | grid 2 cols (mobile), 3 cols (desktop) | Section |
| Carte | hover:shadow-lg, rounded-xl | Item |
| Image | h-40, object-cover | Haut |
| Titre | text-base, 600 | Bas |
| Nombre | text-xs, gray | Bas |

### Grille marques (BrandGrid)

| Élément | Style | Position |
|---------|-------|----------|
| Container | grid 3 cols | Section |
| Carte | bg-white, rounded-xl, shadow-sm | Item |
| Logo | h-16, object-contain | Centre |

### Barre de confiance (TrustBar)

| Élément | Style | Position |
|---------|-------|----------|
| Container | flex, gap-4, overflow-x-auto | Section |
| Item | flex-shrink-0, text-center | Item |
| Icône | text-primary, 24px | Haut |
| Texte | text-xs, white | Bas |

### Fil d'Ariane

| Élément | Style | Position |
|---------|-------|----------|
| Container | text-xs, gray | Haut de page |
| Lien | hover:text-primary | Item |
| Séparateur | / | Entre items |

### Pagination

| Élément | Style | Position |
|---------|-------|----------|
| Container | flex, gap-2 | Bas de page |
| Bouton | border, rounded, hover:bg-primary | Item |
| Actif | bg-primary, text-white | Item |

### Modal produit

| Élément | Style | Position |
|---------|-------|----------|
| Overlay | bg-black/50, z-40 | Fond |
| Conteneur | bg-white, rounded-xl, max-w-2xl | Centre |
| Fermer | absolute top-right | Overlay |

## Grille responsive

### Landing page

| Breakpoint | Grille |
|------------|--------|
| mobile (< 640px) | 2 colonnes |
| tablette (640-1024px) | 3 colonnes |
| desktop (> 1024px) | 3-4 colonnes |

### Dashboard

| Breakpoint | Sidebar |
|------------|---------|
| mobile (< 768px) | Cachée (hamburger) |
| desktop (> 768px) | Visible (250px) |

### Catalogue produits

| Breakpoint | Grille |
|------------|--------|
| mobile (< 640px) | 1 colonne |
| tablette (640-1024px) | 2 colonnes |
| desktop (> 1024px) | 3 colonnes |

## Composants UI

### Boutons

| Type | Style | Usage |
|------|-------|-------|
| Primaire | bg-primary, text-white | CTA principal |
| Secondaire | bg-secondary, text-white | CTA secondaire |
| Outline | border, text-primary | Actions secondaires |
| Ghost | transparent, hover:bg-gray-100 | Navigation |
| Danger | bg-danger, text-white | Suppression |

### Inputs

| Type | Style | Usage |
|------|-------|-------|
| Text | border, rounded-md | Texte |
| Email | border, rounded-md | Email |
| Password | border, rounded-md | Mot de passe |
| Select | border, SVG arrow | Sélection |
| Textarea | border, rounded-md | Texte long |
| Search | border, rounded-full | Recherche |

### Badges

| Type | Style | Usage |
|------|-------|-------|
| Neuf | bg-success, text-white | Produit neuf |
| Occasion | bg-warning, text-white | Produit occasion |
| Promo | bg-danger, text-white | Promotion |
| Local | bg-info, text-white | Local |

### Cards

| Type | Style | Usage |
|------|-------|-------|
| Produit | border, rounded-lg, shadow-sm | Catalogue |
| Catégorie | border, rounded-xl, hover:shadow-lg | Navigation |
| Marque | border, rounded-xl, shadow-sm | Partenaires |
