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
