# Securite

## Authentification

### JWT
- Algorithm : HS256
- Expiration access token : 24h
- Refresh token : 7 jours
- Storage : HttpOnly cookie
- Secret : variable d'environnement JWT_SECRET

### Password hashing
- Algorithme : bcrypt
- Salt rounds : 12

### Endpoints auth
- POST /api/v1/auth/login
- POST /api/v1/auth/register
- POST /api/v1/auth/logout
- POST /api/v1/auth/refresh
- GET /api/v1/auth/me

## Autorisation

### Roles

| Role | Permissions |
|------|-------------|
| BUYER | Lire produits, creer commandes, gerer profil |
| SELLER | Gerer produits, commandes, clients, analytics |
| ADMIN | Tout gerer, administration plateforme |

### Middleware
- Verification JWT sur routes protegees
- Verification role pour routes admin
- Rate limiting sur tous les endpoints

## Validation

### Input validation
- Zod pour validation cote serveur
- Sanitisation des entrees
- Limites de taille (body, params)

### Limites

| Ressource | Limite |
|-----------|--------|
| Body request | 1MB |
| Upload fichier | 5MB |
| Fichiers par requete | 5 |
| Requetes par minute | 100 |
| Login tentatives | 5/15min |

## Securite des donnees

### MDP sensibles
- Jamais en log
- Jamais en reponse API
- Hash avant stockage

### Token
- Jamais en URL
- HttpOnly cookie uniquement
- Secure flag en production
- SameSite=Lax

### Headers
```
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

## Securite API

### Rate limiting
- General : 100 req/min
- Login : 5 req/15min
- Register : 3 req/hour
- Upload : 10 req/min

### CORS
- Origin : https://autoafrique-saas.vercel.app
- Credentials : true
- Methods : GET, POST, PUT, PATCH, DELETE

### SQL injection
- Prisma ORM (parameterized queries)
- Pas de requetes SQL brutes

### XSS
- React auto-escape
- Sanitisation output
- CSP headers

## Variables d'environnement

| Variable | Usage | Securite |
|----------|-------|----------|
| DATABASE_URL | Connexion DB | Secret |
| JWT_SECRET | Signature JWT | Secret |
| NEXTAUTH_SECRET | NextAuth | Secret |
| VERCEL_URL | URL deploiement | Public |
