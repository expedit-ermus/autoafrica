# Images et médias

## Règles générales

- Réutiliser les composants d'image prévus par le projet
- Générer ou utiliser des tailles responsives
- Respecter les budgets de poids
- Fournir une largeur et une hauteur
- Distinguer l'image LCP des images différées
- Texte alternatif descriptif sur toutes les images (jamais générique)
- Ne jamais intégrer une image distante non validée
- Ne jamais générer une fausse preuve visuelle

## Budgets

| Ressource | Limite |
|-----------|--------|
| Image hero | < 150KB |
| Hauteur carte produit | 200px |
| Hauteur hero | 1200px |
| Upload fichier | 5MB |
| Fichiers par requête | 5 |

## Formats

- WebP avec fallback JPG
- Compression qualité 80%
- Max 5 images par produit (JPG/PNG)

## Optimisation

- Lazy loading natif (`loading="lazy"`)
- `srcset` pour le responsive
- Preload de l'image hero (LCP)
- `next/image` pour l'optimisation automatique

## Upload

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/api/v1/upload` | Requise | Upload image (multipart/form-data `file`) |

Réponse 201 : `{ "url": "/uploads/image.jpg" }`

## Types de fichiers

| Type | Usage | Contrainte |
|------|-------|------------|
| JPG | Photos produits | Max 5Mo |
| PNG | Logos, captures | Max 5Mo |
| WebP | Export optimisé | Qualité 80% |

## Accessibilité

- Contraste minimum 4.5:1 (texte normal), 3:1 (texte gros)
- Texte alternatif sur toutes les images
- Distinguer l'image LCP des images différées
- Placeholder gris avec icône pour les images manquantes
