# Gestion des erreurs

## Pages d'erreur

### 404 — Page introuvable
- Titre : "Page introuvable"
- Message : "La page que vous recherchez n'existe pas ou a ete deplacee."
- CTA : "Retour a l'accueil"
- Design : illustration + bouton

### 500 — Erreur serveur
- Titre : "Erreur serveur"
- Message : "Quelque chose s'est mal passe. Veuillez reessayer."
- CTA : "Reessayer"
- Design : illustration + bouton

### 403 — Non autorise
- Titre : "Acces refuse"
- Message : "Vous n'avez pas les droits pour acceder a cette page."
- CTA : "Retour au tableau de bord"

### 401 — Non connecte
- Redirection vers /auth/login
- Message : "Votre session a expire. Veuillez vous reconnecter."

## Erreurs API

### Format reponse erreur
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Le champ email est invalide",
    "details": [
      { "field": "email", "message": "Format email invalide" }
    ]
  }
}
```

### Codes d'erreur

| Code | HTTP | Signification |
|------|------|---------------|
| VALIDATION_ERROR | 400 | Donnees invalides |
| UNAUTHORIZED | 401 | Non connecte |
| FORBIDDEN | 403 | Pas les droits |
| NOT_FOUND | 404 | Ressource introuvable |
| CONFLICT | 409 | Conflit (email deja utilise) |
| RATE_LIMITED | 429 | Trop de requetes |
| SERVER_ERROR | 500 | Erreur interne |

### Gestion cote client

| Erreur | Action UI |
|--------|-----------|
| 400 | Messages d'erreur inline sur les champs |
| 401 | Redirection login + toast |
| 403 | Message "Acces refuse" |
| 404 | Page 404 |
| 409 | Message specifique (email existant) |
| 429 | Message "Trop de requetes, reessayez" |
| 500 | Toast erreur + bouton reessayer |
| Network | Toast "Erreur reseau" |

## Toasts

### Types
- Success : fond vert, icone check
- Error : fond rouge, icone X
- Warning : fond jaune, icone alerte
- Info : fond bleu, icone i

### Duree
- Success : 3 secondes
- Error : 5 secondes (manuel fermer)
- Warning : 4 secondes
- Info : 3 secondes

### Position
- Top-right
- Max 3 visibles
- Animation slide-in

## Fallbacks

### Image produit
- Image placeholder grise avec icone

### Donnees manquantes
- Texte par defaut gracieux

### API indisponible
- Message "Service temporairement indisponible"
- Bouton reessayer
