# Formulaires

## Login

### Route
`/auth/login`

### Champs

| Champ | Type | Obligatoire | Validation | Message d'erreur |
|-------|------|-------------|------------|------------------|
| email | email | oui | Format email valide | Email invalide |
| password | password | oui | Min 8 caracteres | Mot de passe requis |

### Actions
- Connexion via POST /api/v1/auth/login
- Redirection vers /dashboard
- Gestion erreurs : Email ou mot de passe incorrect

### Accessibilite
- Labels associes a chaque input
- aria-required
- Focus premier champ au chargement

---

## Register

### Route
`/auth/register`

### Champs

| Champ | Type | Obligatoire | Validation | Message d'erreur |
|-------|------|-------------|------------|------------------|
| name | text | oui | Min 2 caracteres | Nom requis |
| email | email | oui | Format email valide | Email invalide |
| phone | tel | non | Format international | Telephone invalide |
| country | select | oui | Valeur de la liste | Selectionnez un pays |
| role | select | oui | BUYER ou SELLER | Selectionnez un role |
| password | password | oui | Min 8, 1 maj, 1 chiffre | Mot de passe trop faible |
| confirmPassword | password | oui | = password | Les mots de passe ne correspondent pas |
| acceptTerms | checkbox | oui | Coche | Acceptez les conditions |

### Actions
- Inscription via POST /api/v1/auth/register
- Redirection vers /auth/login avec message succes

---

## Product Create/Edit

### Champs

| Champ | Type | Obligatoire | Validation |
|-------|------|-------------|------------|
| name | text | oui | Min 3 caracteres |
| reference | text | oui | Unique par vendeur |
| description | textarea | oui | Min 20 caracteres |
| price | number | oui | > 0 |
| condition | select | oui | NEUF, OCCASION, REMANUFACTURE |
| category | select | oui | Categorie valide |
| brand | select | oui | Marque valide |
| model | text | non | - |
| yearMin | number | non | <= yearMax |
| yearMax | number | non | >= yearMin |
| quantity | number | oui | >= 0 |
| images | file[] | oui | Max 5, JPG/PNG, 5Mo max |

### Actions
- Creation via POST /api/v1/products
- Modification via PUT /api/v1/products/[id]
- Upload images via POST /api/v1/upload

---

## Customer Create/Edit

### Champs

| Champ | Type | Obligatoire | Validation |
|-------|------|-------------|------------|
| name | text | oui | Min 2 caracteres |
| email | email | non | Format email |
| phone | tel | oui | Format international |
| address | text | non | - |
| city | text | non | - |
| country | select | oui | Pays valide |
| notes | textarea | non | - |

---

## Lead Create/Edit

### Champs

| Champ | Type | Obligatoire | Validation |
|-------|------|-------------|------------|
| name | text | oui | Min 2 caracteres |
| email | email | non | Format email |
| phone | tel | non | Format international |
| source | select | oui | SOURCE enum |
| status | select | oui | STATUS enum |
| notes | textarea | non | - |

---

## Search (Marketplace)

### Champs

| Champ | Type | Obligatoire | Validation |
|-------|------|-------------|------------|
| search | text | non | - |
| brand | select | non | Marque valide |
| model | text | non | - |
| category | select | non | Categorie valide |
| condition | select | non | Condition valide |
| priceMin | number | non | >= 0 |
| priceMax | number | non | >= priceMin |

### Comportement
- Mise a jour URL params en temps reel
- Debounce 300ms sur recherche texte
- Reset pagination a chaque changement de filtre
- Preset des valeurs depuis URL au chargement
