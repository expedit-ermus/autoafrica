# Modeles de donnees

## Modeles Prisma

### Tenant
```
model Tenant {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  domain      String?
  logo        String?
  primaryColor String? @default("#FF6B35")
  settings    Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  users       User[]
  products    Product[]
  orders      Order[]
  messages    Message[]
  campaigns   Campaign[]
  warehouses  Warehouse[]
  customers   Customer[]
  suppliers   Supplier[]
}
```

### User
```
model User {
  id          String   @id @default(cuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  email       String   @unique
  name        String
  phone       String?
  password    String
  role        Role     @default(BUYER)
  avatar      String?
  country     String?
  city        String?
  isVerified  Boolean  @default(false)
  lastLoginAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  products    Product[]
  orders      Order[]
  payments    Payment[]
  messages    Message[]
  notifications Notification[]
  leads       Lead[]
  reviews     Review[]
}
```

### Product
```
model Product {
  id          String   @id @default(cuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  sellerId    String
  seller      User     @relation(fields: [sellerId], references: [id])
  name        String
  reference   String
  description String?
  price       Float
  currency    String   @default("XOF")
  condition   Condition @default(NEUF)
  category    String
  brand       String
  model       String?
  yearMin     Int?
  yearMax     Int?
  quantity    Int      @default(0)
  images      Json?
  specs       Json?
  isActive    Boolean  @default(true)
  isFeatured  Boolean  @default(false)
  views       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  orderItems  OrderItem[]
  reviews     Review[]
}
```

### Order
```
model Order {
  id            String      @id @default(cuid())
  tenantId      String
  tenant        Tenant      @relation(fields: [tenantId], references: [id])
  buyerId       String
  buyer         User        @relation(fields: [buyerId], references: [id])
  orderNumber   String      @unique
  status        OrderStatus @default(PENDING)
  subtotal      Float
  shippingFee   Float       @default(0)
  total         Float
  currency      String      @default("XOF")
  shippingAddress Json?
  notes         String?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  items         OrderItem[]
  payment       Payment?
  timeline      OrderTimeline[]
}
```

### OrderItem
```
model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])
  name      String
  price     Float
  quantity  Int
  total     Float
}
```

### Payment
```
model Payment {
  id              String        @id @default(cuid())
  tenantId        String
  tenant          Tenant        @relation(fields: [tenantId], references: [id])
  orderId         String        @unique
  order           Order         @relation(fields: [orderId], references: [id])
  userId          String
  user            User          @relation(fields: [userId], references: [id])
  amount          Float
  currency        String        @default("XOF")
  method          PaymentMethod
  status          PaymentStatus @default(PENDING)
  reference       String?
  providerRef     String?
  paidAt          DateTime?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}
```

### Customer
```
model Customer {
  id        String   @id @default(cuid())
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  name      String
  email     String?
  phone     String?
  address   String?
  city      String?
  country   String?
  notes     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  leads     Lead[]
}
```

### Supplier
```
model Supplier {
  id            String   @id @default(cuid())
  name          String
  companyName   String?
  country       String   // CN, TW, JP, KR, DE, etc.
  city          String?
  address       String?
  contactPerson String?
  email         String?
  phone         String?
  whatsapp      String?
  website       String?
  rating        Float    @default(0)
  leadTimeDays  Int?     // Average lead time
  paymentTerms  String?  // "NET30", "LC", "TT"
  moq           Int?     // Minimum Order Quantity
  verified      Boolean  @default(false)
  metadata      Json?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  purchaseOrders PurchaseOrder[]
  products       SupplierProduct[]
}
```

### SupplierProduct
```
model SupplierProduct {
  id              String   @id @default(cuid())
  supplierId      String
  productName     String
  reference       String?
  moq             Int?
  unitPrice       Int
  currency        String   @default("USD")
  leadTimeDays    Int?
  sampleAvailable Boolean  @default(false)
  metadata        Json?
  createdAt       DateTime @default(now())
}
```

### PurchaseOrder
```
model PurchaseOrder {
  id             String   @id @default(cuid())
  poNumber       String   @unique
  supplierId     String
  warehouseId    String?
  status         POStatus @default(DRAFT)
  totalAmount    Int
  currency       String   @default("USD")
  paymentTerms   String?
  expectedDate   DateTime?
  actualDate     DateTime?
  shippingMethod String?  // "sea", "air", "road"
  trackingNumber String?
  notes          String?
  approvedBy     String?
  approvedAt     DateTime?
  createdBy      String?
  metadata       Json?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  items          PurchaseOrderItem[]
  container      Container?
}
```

### PurchaseOrderItem
```
model PurchaseOrderItem {
  id              String @id @default(cuid())
  purchaseOrderId String
  productName     String
  reference       String?
  quantity        Int
  unitPrice       Int
  totalPrice      Int
  receivedQty     Int    @default(0)
  notes           String?
}
```

### Container
```
model Container {
  id              String   @id @default(cuid())
  containerNumber String   @unique
  purchaseOrderId String?  @unique
  size            String   // "20ft", "40ft", "40hq"
  status          ContainerStatus @default(LOADING)
  originPort      String
  destinationPort String
  shippingLine    String?
  vesselName      String?
  etaOrigin       DateTime?
  etaDestination  DateTime?
  departedAt      DateTime?
  arrivedAt       DateTime?
  clearedAt       DateTime?
  shippingDocs    Json?
  metadata        Json?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  customsRecord   CustomsRecord?
}
```

### CustomsRecord
```
model CustomsRecord {
  id                String @id @default(cuid())
  containerId       String @unique
  declarationNumber String?
  hsCode            String?
  cifValue          Int?
  duties            Int?
  taxes             Int?
  fees              Int?
  totalDuty         Int?
  status            CustomsStatus @default(PENDING)
  broker            String?
  brokerContact     String?
  documents         Json?
  releasedAt        DateTime?
  notes             String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

### Lead
```
model Lead {
  id         String     @id @default(cuid())
  tenantId   String
  tenant     Tenant     @relation(fields: [tenantId], references: [id])
  customerId String?
  customer   Customer?  @relation(fields: [customerId], references: [id])
  userId     String?
  user       User?      @relation(fields: [userId], references: [id])
  name       String
  email      String?
  phone      String?
  source     LeadSource
  status     LeadStatus @default(NEW)
  notes      String?
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt
}
```

### Vehicle
```
model Vehicle {
  id          String   @id @default(cuid())
  brandId     String
  brand       Brand    @relation(fields: [brandId], references: [id])
  carModelId  String?
  carModel    CarModel? @relation(fields: [carModelId], references: [id])
  name        String
  slug        String   @unique
  year        Int
  price       Int
  currency    String   @default("XOF")
  mileage     Int?     // km
  fuel        VehicleFuel?
  gearbox     VehicleGearbox?
  condition   VehicleCondition
  bodyType    String?
  color       String?
  city        String?
  country     String   @default("CI")
  description String?
  images      Json?
  active      Boolean  @default(true)
  featured    Boolean  @default(false)
  views       Int      @default(0)
  metadata    Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### VehicleListing
```
model VehicleListing {
  id          String   @id @default(cuid())
  vehicleId   String
  vehicle     Vehicle  @relation(fields: [vehicleId], references: [id])
  sellerId    String
  seller      User     @relation(fields: [sellerId], references: [id])
  status      VehicleListingStatus @default(DRAFT)
  price       Int
  currency    String   @default("XOF")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### AnalyticsEvent
```
model AnalyticsEvent {
  id         String   @id @default(cuid())
  event      String   // "page_view", "product_view", "search", "add_to_cart"
  userId     String?
  sessionId  String?
  entity     String?  // "product", "order", "page", ...
  entityId   String?
  properties Json?    // métadonnées libres de l'événement (query, product_id, price...)
  country    String?
  city       String?
  device     String?
  browser    String?
  ip         String?
  createdAt  DateTime @default(now())

  @@index([event])
  @@index([userId])
  @@index([entity, entityId])
  @@index([createdAt])
}
```
Les événements sont définis dans `09-TRACKING.md`. Le service `src/modules/analytics/analytics.service.ts` (trackEvent, listEvents, getStats) alimente le dashboard `/dashboard/analytics` (R012) via `GET /api/v1/analytics/events` (R208, R209) et `GET /api/v1/analytics/stats` (R210).

## Enums

### Role
BUYER, SELLER, ADMIN

### Condition
NEUF, OCCASION, REMANUFACTURE

### OrderStatus
PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED

### PaymentMethod
ORANGE_MONEY, MTN_MOMO, WAVE, CARD, CASH

### PaymentStatus
PENDING, COMPLETED, FAILED, REFUNDED

### LeadSource
MANUAL, WEBSITE, REFERRAL, CAMPAIGN, PHONE

### LeadStatus
NEW, CONTACTED, QUALIFIED, CONVERTED, LOST

### VehicleCondition
NEW, USED, CERTIFIED

### VehicleFuel
DIESEL, GASOLINE, HYBRID, ELECTRIC, LPG

### VehicleGearbox
MANUAL, AUTOMATIC

### VehicleListingStatus
DRAFT, ACTIVE, RESERVED, SOLD, CANCELLED

## Indexes

| Model | Index | Type |
|-------|-------|------|
| User | tenantId + email | unique |
| Product | tenantId + category | index |
| Product | tenantId + brand | index |
| Product | tenantId + isActive | index |
| Order | tenantId + status | index |
| Order | buyerId | index |
| Payment | tenantId + status | index |
| Lead | tenantId + status | index |
| Vehicle | brandId | index |
| Vehicle | active + country + city | index |
| Vehicle | price | index |
| VehicleListing | sellerId + status | index |
