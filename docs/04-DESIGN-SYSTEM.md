# Système de design

## Tokens de couleur

### Palette principale

| Token | Valeur | Usage |
|-------|--------|-------|
| `--color-primary` | `#FF6B35` | CTA, liens, accent |
| `--color-primary-hover` | `#E85A25` | Hover CTA |
| `--color-secondary` | `#1E3A5F` | Header, sidebar, accents sombres |
| `--color-secondary-hover` | `#162D4A` | Hover secondary |
| `--color-success` | `#10B981` | Confirmations, badges |
| `--color-danger` | `#EF4444` | Erreurs, suppressions |
| `--color-warning` | `#F59E0B` | Alertes, badges |
| `--color-info` | `#3B82F6` | Informations |

### Neutres

| Token | Valeur | Usage |
|-------|--------|-------|
| `--color-white` | `#FFFFFF` | Fond principal |
| `--color-gray-50` | `#F9FAFB` | Fond secondaire |
| `--color-gray-100` | `#F3F4F6` | Fond sidebar |
| `--color-gray-200` | `#E5E7EB` | Bordures |
| `--color-gray-300` | `#D1D5DB` | Bordures légères |
| `--color-gray-500` | `#6B7280` | Texte secondaire |
| `--color-gray-700` | `#374151` | Texte principal |
| `--color-gray-900` | `#111827` | Titres |

### Background

| Token | Valeur | Usage |
|-------|--------|-------|
| `--background` | `#FFFFFF` | Fond body |
| `--card-bg` | `#FFFFFF` | Fond cartes |
| `--card-border` | `#E5E7EB` | Bordure cartes |

## Typographie

### Polices

| Token | Valeur | Usage |
|-------|--------|-------|
| `--font-sans` | `'Inter', system-ui, -apple-system, sans-serif` | Texte principal |
| `--font-mono` | `'Menlo', 'Monaco', 'Courier New', monospace` | Code |

### Tailles

| Token | Taille | Poids | Usage |
|-------|--------|-------|-------|
| `text-xs` | 0.75rem (12px) | 400-500 | Badges, labels |
| `text-sm` | 0.875rem (14px) | 400-500 | Texte secondaire |
| `text-base` | 1rem (16px) | 400 | Texte principal |
| `text-lg` | 1.125rem (18px) | 500-600 | Sous-titres |
| `text-xl` | 1.25rem (20px) | 600 | Titres secondaires |
| `text-2xl` | 1.5rem (24px) | 600-700 | Titres principaux |
| `text-3xl` | 1.875rem (30px) | 700 | Hero titles |

### Line heights

| Token | Valeur | Usage |
|-------|--------|-------|
| `leading-tight` | 1.25 | Titres |
| `leading-normal` | 1.5 | Texte |
| `leading-relaxed` | 1.75 | Texte long |

## Espacement

| Token | Valeur | Usage |
|-------|--------|-------|
| `space-1` | 0.25rem (4px) | Espacement minimal |
| `space-2` | 0.5rem (8px) | Espacement petit |
| `space-3` | 0.75rem (12px) | Espacement moyen |
| `space-4` | 1rem (16px) | Espacement standard |
| `space-5` | 1.25rem (20px) | Espacement moyen+ |
| `space-6` | 1.5rem (24px) | Espacement grand |
| `space-8` | 2rem (32px) | Sections |
| `space-10` | 2.5rem (40px) | Grands espaces |
| `space-12` | 3rem (48px) | Sections majeures |
| `space-16` | 4rem (64px) | Layouts larges |

## Bordures & Arrondis

| Token | Valeur | Usage |
|-------|--------|-------|
| `--radius-sm` | `0.375rem` | Petits éléments |
| `--radius-md` | `0.5rem` | Boutons, inputs |
| `--radius-lg` | `0.75rem` | Cartes |
| `--radius-xl` | `1rem` | Grandes cartes |
| `--radius-full` | `9999px` | Cercles, avatars |

## Ombres

| Token | Valeur | Usage |
|-------|--------|-------|
| `shadow-sm` | `0 1px 2px 0 rgba(0,0,0,0.05)` | Légère |
| `shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.1)` | Standard |
| `shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.1)` | Élevée |
| `shadow-xl` | `0 20px 25px -5px rgba(0,0,0,0.1)` | Modale |
| `shadow-2xl` | `0 25px 50px -12px rgba(0,0,0,0.25)` | Flottante |

## Z-index

| Token | Valeur | Usage |
|-------|--------|-------|
| `z-0` | 0 | Contenu de base |
| `z-10` | 10 | Contenu au-dessus |
| `z-20` | 20 | Éléments flottants |
| `z-30` | 30 | Modales |
| `z-40` | 40 | Overlays |
| `z-50` | 50 | Header fixe |

## Transitions

| Token | Valeur | Usage |
|-------|--------|-------|
| `transition-fast` | `150ms ease` | Hover, focus |
| `transition-normal` | `200ms ease` | Animations légères |
| `transition-slow` | `300ms ease` | Transitions de page |

## Breakpoints

| Token | Valeur | Usage |
|-------|--------|-------|
| `sm` | 640px | Mobile large |
| `md` | 768px | Tablette |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Desktop large |
| `2xl` | 1536px | Écran large |

## Composants

### Bouton primaire

```css
background: var(--color-primary);
color: white;
border-radius: var(--radius-md);
padding: 0.75rem 1.5rem;
font-weight: 600;
transition: background var(--transition-fast);
```

### Carte produit

```css
background: var(--card-bg);
border: 1px solid var(--card-border);
border-radius: var(--radius-lg);
padding: 1rem;
box-shadow: var(--shadow-sm);
transition: box-shadow var(--transition-fast);
```

### Input

```css
background: var(--color-white);
border: 1px solid var(--color-gray-300);
border-radius: var(--radius-md);
padding: 0.5rem 0.75rem;
```

---

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
