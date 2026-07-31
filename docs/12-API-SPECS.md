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
