# CRM

## Vision

Le CRM AutoAfrique gère les clients, les leads et les interactions pour la fidélisation et la conversion. Il complète le cycle commercial : un lead peut être converti en client, les interactions sont tracées, et le pipeline est suivi.

## Modèle

| Modèle | Description |
|--------|-------------|
| `Customer` | Client (name, email, phone, address, city, country, notes) |
| `Lead` | Prospect (name, email, phone, source, status, notes, valeur) |
| `CustomerInteraction` | Interaction tracée (type, subject, content, outcome, nextAction) |

## Cycle lead

1. Création d'un lead (source : MANUAL, WEBSITE, REFERRAL, CAMPAIGN, PHONE)
2. Suivi du statut : NEW → CONTACTED → QUALIFIED → CONVERTED → LOST
3. Conversion en client
4. Interactions et actions de suivi

## Service

`src/modules/crm/crm.service.ts` (classe `CrmService`) :

### Customers
- `listCustomers({ search, page, pageSize })` — paginé, tri par `createdAt` desc
- `getCustomer(id)`
- `createCustomer(data)` — name, phone, email, type, country, city, segment, tags, notes, source
- `updateCustomer(id, data)`
- `deleteCustomer(id)` — 404 si absent

### Interactions
- `listInteractions(customerId)`
- `createInteraction(customerId, data)` — type, subject, content, outcome, nextAction, nextDate
- Mise à jour du `lastInteractionAt` du client

### Leads
- `listLeads({ status, source, search, page, pageSize })`
- `createLead(data)` — name, phone, email, source, value, notes, customerId
- `updateLeadStatus(id, status)`
- `deleteLead(id)` — 404 si absent

### KPIs
- `getDashboard()` — total clients, total leads, leads nouveaux, leads en cours, leads convertis

## Pages

- `/dashboard/crm` — vue multi-onglets Clients / Leads / KPIs avec modales de création
- `/dashboard/help` — FAQ et support (schéma FAQPage)

## Endpoints

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/v1/customers` | Public | Liste clients |
| POST | `/api/v1/customers` | Requise | Créer client |
| GET | `/api/v1/customers/[id]` | Public | Détail client |
| PUT | `/api/v1/customers/[id]` | Requise | Modifier client |
| DELETE | `/api/v1/customers/[id]` | Requise | Supprimer client |
| GET | `/api/v1/leads` | Public | Liste leads |
| POST | `/api/v1/leads` | Requise | Créer lead |
| PUT | `/api/v1/leads/[id]` | Requise | Modifier lead (statut) |
| DELETE | `/api/v1/leads/[id]` | Requise | Supprimer lead |

## Tracking

- `lead_created` (source), `lead_converted` (lead_id, value)
- `customer_created` (source)

## Règles

- Pagination via `getPaginationParams({ page, pageSize, sortBy, sortOrder })`
- Erreurs : `NotFoundError` si ressource absente
- Pas de faux clients ni de faux témoignages dans le seed
