# API REST

## Base URL

`/api/v1`

## Authentification

### Headers
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

### Login
POST /api/v1/auth/login
```json
Request: { "email": "...", "password": "..." }
Response 200: { "token": "...", "user": { "id", "name", "email", "role" } }
Response 401: { "error": "Invalid credentials" }
```

### Register
POST /api/v1/auth/register
```json
Request: { "name", "email", "phone", "country", "role", "password" }
Response 201: { "user": { "id", "name", "email" } }
Response 400: { "error": "Email already exists" }
```

### Logout
POST /api/v1/auth/logout
Response 200: { "message": "Logged out" }

### Get Current User
GET /api/v1/auth/me
Response 200: { "user": { "id", "name", "email", "role", "tenant" } }

---

## Products

### List Products
GET /api/v1/products?search=&brand=&category=&condition=&priceMin=&priceMax=&page=&limit=&sort=
Response 200: { "products": [...], "total": 85, "page": 1, "pages": 9 }

### Create Product
POST /api/v1/products
Request: { "name", "reference", "description", "price", "condition", "category", "brand", "model", "quantity", "images" }
Response 201: { "product": { ... } }

### Get Product
GET /api/v1/products/[id]
Response 200: { "product": { ... } }

### Update Product
PUT /api/v1/products/[id]
Request: { "name", "price", ... }
Response 200: { "product": { ... } }

### Delete Product
DELETE /api/v1/products/[id]
Response 200: { "message": "Deleted" }

---

## Orders

### List Orders
GET /api/v1/orders?status=&page=&limit=
Response 200: { "orders": [...], "total": 12, "page": 1 }

### Create Order
POST /api/v1/orders
Request: { "items": [{ "productId", "quantity" }], "shippingAddress" }
Response 201: { "order": { ... } }

### Get Order
GET /api/v1/orders/[id]
Response 200: { "order": { "items", "payment", "timeline" } }

### Update Order Status
PATCH /api/v1/orders/[id]
Request: { "status": "SHIPPED" }
Response 200: { "order": { ... } }

---

## Payments

### Create Payment
POST /api/v1/payments
Request: { "orderId", "method": "ORANGE_MONEY", "phone": "..." }
Response 201: { "payment": { "id", "reference", "status" } }

### List Payments
GET /api/v1/payments?page=&limit=
Response 200: { "payments": [...], "total": 45 }

### Get Payment Status
GET /api/v1/payments/[id]
Response 200: { "payment": { "status", "paidAt" } }

---

## Customers

### List Customers
GET /api/v1/customers?search=&page=&limit=
Response 200: { "customers": [...], "total": 30 }

### Create Customer
POST /api/v1/customers
Request: { "name", "email", "phone", "address", "city", "country" }
Response 201: { "customer": { ... } }

### Get Customer
GET /api/v1/customers/[id]
Response 200: { "customer": { ... } }

### Update Customer
PUT /api/v1/customers/[id]
Request: { "name", "email", ... }
Response 200: { "customer": { ... } }

### Delete Customer
DELETE /api/v1/customers/[id]
Response 200: { "message": "Deleted" }

---

## Leads

### List Leads
GET /api/v1/leads?status=&source=&page=&limit=
Response 200: { "leads": [...], "total": 15 }

### Create Lead
POST /api/v1/leads
Request: { "name", "email", "phone", "source", "notes" }
Response 201: { "lead": { ... } }

### Update Lead
PUT /api/v1/leads/[id]
Request: { "status", "notes" }
Response 200: { "lead": { ... } }

### Delete Lead
DELETE /api/v1/leads/[id]
Response 200: { "message": "Deleted" }

---

## Notifications

### Get Notifications
GET /api/v1/notifications
Response 200: { "notifications": [...] }

### Mark as Read
POST /api/v1/notifications/read
Request: { "ids": ["id1", "id2"] }
Response 200: { "message": "Marked as read" }

---

## Upload

### Upload Image
POST /api/v1/upload
Request: multipart/form-data { "file": <image> }
Response 201: { "url": "/uploads/image.jpg" }

---

## Reviews

### List Reviews
GET /api/v1/reviews?productId=&page=&limit=
Response 200: { "reviews": [...], "total": 8 }

### Create Review
POST /api/v1/reviews
Request: { "productId", "rating": 5, "comment" }
Response 201: { "review": { ... } }

---

## Analytics

### Track Event
POST /api/v1/analytics/events
Public — le tracking anonyme est autorisé ; si un cookie JWT `token` est présent, l'événement est rattaché à l'utilisateur.
Request: { "event", "sessionId", "entity", "entityId", "properties", "country", "city" }
- `event` : l'un des événements documentés dans `09-TRACKING.md` (page_view, search_product, view_product, add_to_cart, checkout_start, order_complete, payment_success, ...)
- `properties` : objet libre (query, product_id, price, quantité...)
Response 201: { "success": true, "data": { "id", "event", "createdAt" } }
Response 400: { "error": "Événement non reconnu : <name>" } (événement hors liste)
Response 400: { "error": "Un nom d'événement est requis" }

### List Events
GET /api/v1/analytics/events?event=&entity=&entityId=&from=&to=&limit=
Auth requise.
Response 200: { "success": true, "data": { "data": [...], "total": N } }
- `limit` plafonné à 200

### Analytics Stats
GET /api/v1/analytics/stats?from=&to=
Auth requise. Agrège les événements de la période pour le dashboard `/dashboard/analytics`.
Response 200: {
  "success": true,
  "data": {
    "totalEvents": 100,
    "uniqueSessions": 42,
    "byEvent": { "page_view": 50, "search_product": 20 },
    "funnel": { "searches": 20, "productViews": 30, "addToCarts": 12, "checkouts": 8, "orders": 4 },
    "series": [{ "date": "2026-01-01", "count": 5 }]
  }
}

---

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
