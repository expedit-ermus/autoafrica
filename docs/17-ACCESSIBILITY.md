# Accessibilite

## Standard
WCAG 2.1 niveau AA

## Regles

### Perceptible
- Texte alternatif sur toutes les images
- Contraste minimum 4.5:1 (texte normal)
- Contraste minimum 3:1 (texte gros >= 18px)
- Pas d'info uniquement par couleur
- Sous-titres pour contenus audio/video

### Utilisable
- Navigation au clavier complete
- Focus visible sur tous les elements interactifs
- Pas de piege clavier
- Donnees de tempo modifiables
- Pas de contenu clignotant

### Comprehensible
- Langue declaree (html lang="fr")
- Labels sur tous les formulaires
- Messages d'erreur explicites
- Navigation previsible
- Input assiste (autocomplete)

### Robuste
- HTML valide
- Noms de role accessibles
- Status live regions
- Compatible lecteurs d'cran

## Patterns

### Bouton
```html
<button aria-label="Ajouter au panier">
  <Icon /> Ajouter au panier
</button>
```

### Modal
```html
<div role="dialog" aria-modal="true" aria-labelledby="title">
  <h2 id="title">Titre</h2>
  <button aria-label="Fermer">X</button>
</div>
```

### Formulaire
```html
<label for="email">Email</label>
<input id="email" type="email" aria-required="true" aria-invalid="true" aria-describedby="email-error" />
<span id="email-error" role="alert">Email invalide</span>
```

### Navigation
```html
<nav aria-label="Navigation principale">
  <ul>
    <li><a href="/" aria-current="page">Accueil</a></li>
  </ul>
</nav>
```

### Fil d'Ariane
```html
<nav aria-label="Fil d'Ariane">
  <ol>
    <li><a href="/">Accueil</a></li>
    <li><a href="/marketplace">Marketplace</a></li>
    <li aria-current="page">Produit</li>
  </ol>
</nav>
```

### Pagination
```html
<nav aria-label="Pagination">
  <a href="?page=2" aria-label="Page precedente">Precedent</a>
  <span aria-current="page">Page 1</span>
  <a href="?page=2" aria-label="Page suivante">Suivant</a>
</nav>
```

### Annonces live
```html
<div aria-live="polite" aria-atomic="true">
  Produit ajoute au panier
</div>
```

## Test

### Outils
- Lighthouse accessibility audit
- axe DevTools
- Navigation clavier manuelle
- NVDA / VoiceOver

### Checklist
- [ ] Toutes les images ont alt
- [ ] Tous les inputs ont label
- [ ] Focus visible partout
- [ ] Navigation clavier OK
- [ ] Contraste OK
- [ ] Titres hierarchiques OK
- [ ] ARIA labels OK
- [ ] Screen reader OK
