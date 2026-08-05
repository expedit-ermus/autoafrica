# Authentification

## Flux

- Inscription (`/auth/register`) → POST /api/v1/auth/register → redirection vers `/auth/login`
- Connexion (`/auth/login`) → POST /api/v1/auth/login → redirection vers `/dashboard`
- Session expirée → Redirection vers `/auth/login` avec message
- Déconnexion → POST /api/v1/auth/logout
- Activation vendeur (`/dashboard/profile`) → POST /api/v1/seller/activate → `sellerEnabled=true` + création du `SellerProfile`

## Endpoints

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/api/v1/auth/register` | Public | Inscription |
| POST | `/api/v1/auth/login` | Public | Connexion |
| POST | `/api/v1/auth/logout` | Requise | Déconnexion |
| GET | `/api/v1/auth/me` | Requise | Profil utilisateur (inclut `sellerEnabled` et `sellerProfile`) |
| POST | `/api/v1/auth/refresh` | Public | Rafraîchir token |
| POST | `/api/v1/seller/activate` | Requise | Activer l'espace vendeur |
| GET | `/api/v1/seller/profile` | Requise | Profil vendeur |
| PUT | `/api/v1/seller/profile` | Requise | Mettre à jour le profil vendeur |

## JWT

- Algorithme : HS256
- Expiration access token : 24h
- Refresh token : 7 jours
- Storage : HttpOnly cookie
- Secret : variable d'environnement `JWT_SECRET` (obligatoire, pas de fallback — voir D8)

## Password hashing

- Algorithme : bcrypt
- Salt rounds : 12

## Headers

```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

## Rôles

| Rôle | Permissions |
|------|-------------|
| BUYER | Lire produits, créer commandes, gérer profil |
| SELLER | Gérer produits, commandes, clients, analytics |
| ADMIN | Tout gérer, administration plateforme |

> Compte à rôle choisi à l'inscription : l'utilisateur choisit « Acheteur » (défaut, `role=BUYER`) ou « Vendeur » (`role=SELLER`) sur la même page d'inscription. Le champ `role` est utilisé par le RBAC. Un compte `role=SELLER` peut compléter son profil boutique via « Mon compte » (POST `/api/v1/seller/activate`), qui passe `sellerEnabled=true` et crée le `SellerProfile`.

## Formulaires

### Login

| Champ | Type | Obligatoire | Validation | Message d'erreur |
|-------|------|-------------|------------|------------------|
| email | email | oui | Format email valide | Email invalide |
| password | password | oui | Min 8 caracteres | Mot de passe requis |

Gestion erreurs : "Email ou mot de passe incorrect"

### Register

| Champ | Type | Obligatoire | Validation | Message d'erreur |
|-------|------|-------------|------------|------------------|
| name | text | oui | Min 2 caracteres | Nom requis |
| email | email | oui | Format email valide | Email invalide |
| phone | tel | non | Format international | Telephone invalide |
| country | select | oui | Valeur de la liste | Selectionnez un pays |
| password | password | oui | Min 8, 1 maj, 1 chiffre | Mot de passe trop faible |
| confirmPassword | password | oui | = password | Les mots de passe ne correspondent pas |
| acceptTerms | checkbox | oui | Coche | Acceptez les conditions |

| role | select (cartes Acheteur/Vendeur) | oui (défaut Acheteur) | `BUYER` ou `SELLER` | Sélectionnez un type de compte |

Sélection du type de compte à l'inscription : deux cartes « Acheteur » / « Vendeur » sur la même page. « Acheteur » (défaut) enregistre `role=BUYER`, « Vendeur » enregistre `role=SELLER` immédiatement (RBAC). Le profil vendeur (nom de boutique, ville, paiement) se complète dans « Mon compte ».

## Sécurité

- Tokens jamais en URL, HttpOnly cookie uniquement
- Secure flag en production, SameSite=Lax
- Rate limiting login : 5 tentatives / 15 min
- Limite de taille body : 1MB

## Pages

- `/auth/login` : noindex, follow
- `/auth/register` : noindex, follow
