# Decisions techniques

## D1 : Framework Next.js 16

**Contexte** : Besoin d'un framework React SSR/SSG performant avec routing integre.

**Decision** : Next.js 16.2.9 avec App Router.

**Alternatives envisagees** :
- Vite + React SPA : pas de SSR, SEO limite
- Remix : moins mature, ecosysteme plus petit

**Justification** :
- App Router natif
- Server Components pour performance
- API routes pour backend
- Deploiement Vercel optimise
- Bonne communaute et documentation

**Impact** : Architecture file-based routing, Server Components par defaut.

---

## D2 : Base SQLite (libSQL)

**Contexte** : Besoin d'une base de donnees legere pour MVP, sans configuration serveur.

**Decision** : SQLite via libSQL (Turso compatible).

**Alternatives envisagees** :
- PostgreSQL : trop lourd pour MVP
- MySQL : necessite serveur
- MongoDB : schema flexible mais moins de type safety

**Justification** :
- Zero configuration
- Fichier unique, facile a deployer
- Compatible Prisma ORM
- Migration facile vers PostgreSQL si besoin

**Impact** : Limite de concurrence (1 write a la fois), pas de connection pooling.

---

## D3 : Authentification JWT

**Contexte** : Besoin d'authentification stateless pour API.

**Decision** : JWT avec HttpOnly cookies.

**Alternatives envisagees** :
- NextAuth.js : surdimensionne pour le cas d'usage
- Sessions cote serveur : necessite Redis

**Justification** :
- Simple a implementer
- Stateless, scalable
- HttpOnly cookies pour securite

**Impact** : Gestion du refresh token necessaire.

---

## D4 : Tailwind CSS 4

**Contexte** : Besoin d'un systeme de styling rapide et maintenable.

**Decision** : Tailwind CSS 4.2.1.

**Alternatives envisagees** :
- CSS Modules : moins productif
- Styled Components : runtime overhead
- Chakra UI : surdimensionne

**Justification** :
- Utility-first, tres productif
- Pas de CSS suplementaire
- Purge automatique
- Bonne integration Next.js

**Impact** : Classes dans le HTML, learning curve pour les devs.

---

## D5 : Prisma ORM

**Contexte** : Besoin d'un ORM type-safe pour TypeScript.

**Decision** : Prisma 7.8.0.

**Alternatives envisagees** :
- Drizzle : plus lightweight mais moins mature
- TypeORM : moins de type safety
- Kysely : plus complexe

**Justification** :
- Type safety complet
- Migrations automatiques
- Excellent DX
- Documentation excellente

**Impact** : Schema centralise, generate avant build.

---

## D6 : Monolingue FR par defaut

**Contexte** : Marche cible Francophone (Afrique de l'Ouest).

**Decision** : Interface en francais par defaut, support EN en option.

**Alternatives envisagees** :
- Bilingue des le depart : plus de travail
- Multi-langue : surdimensionne

**Justification** :
- Public cible francophone
- i18n preparee pour ajout EN
- Moins de contenu a traduire

**Impact** : Tous les textes en FR, traductions EN secondaires.

---

## D7 : Pas de paiement integre (MVP)

**Contexte** : MVP avec focus sur la decouverte et l'inscription.

**Decision** : Pas d'integration Mobile Money en V1. UI de checkout simulateur.

**Alternatives envisagees** :
- Integration Orange Money : necessite contrat partenariat
- Stripe : pas populaire en Afrique de l'Ouest

**Justification** :
- MVP rapide
- Validation du concept avant integrations complexes
- Partenariats paiement en V2

**Impact** : UX checkout incomplete, a valider avec utilisateurs reels.

---

## D8 : Secret JWT obligatoire (pas de fallback)

**Contexte** : Le secret JWT disposait d'un fallback hardcode (`autoafrique-secret-key-change-in-production`) dans `src/lib/auth.ts` et `docker-compose.yml`, rendant les signatures predictibles en production.

**Decision** : Supprimer tout fallback. L'application echoue au demarrage avec un message explicite si `JWT_SECRET` est absent. Un fichier `.env.example` documente les variables requises.

**Alternatives envisagees** :
- Generer un secret aleatoire au demarrage : invalide tous les tokens a chaque redemarrage
- Conserver un fallback : signature predictible, risque de forgery de token

**Justification** :
- Aligne le code sur `docs/20-SECURITY.md` (Secret : variable d'environnement JWT_SECRET)
- Fail-fast : pas d'etat de production securise par un secret connu
- `.env.example` guide la configuration locale

**Impact** : Le build et le runtime exigent `JWT_SECRET` ; la base de donnees SQLite (`*.db`) n'est plus versionnee.

---

## D9 : Alignement d'AGENTS.md sur la documentation reelle

**Contexte** : `AGENTS.md` referencait des fichiers de documentation inexistants (`06-UX-ACCESSIBILITY.md`, `07-SEO-CONTENT.md`, `08-CRAWL-INDEXATION.md`, `09-STRUCTURED-DATA.md`, `10-TRACKING-PLAN.md`, `11-PRIVACY-CONSENT.md`, `12-PERFORMANCE-BUDGET.md`, `13-SECURITY.md`, `14-TECHNICAL-ARCHITECTURE.md`, `15-TESTS-ACCEPTANCE.md`, `16-DEPLOYMENT-MONITORING.md`, `17-IMAGES-MEDIA.md`). Le dossier `docs/` contient une organisation reelle differente (`06-COMPONENTS-LAYOUT.md`, `09-SEO-SPECS.md`, `14-ANALYTICS.md`, `15-PERFORMANCE.md`, `16-TESTING.md`, `17-ACCESSIBILITY.md`, `19-SECURITY.md`, `20-DEPLOYMENT.md`, etc.), deja referencée par `.env.example` et `DECISIONS.md`.

**Decision** : Corriger `AGENTS.md` (ordre de lecture, sources de verite, section Images) pour referencer les documents reels et leurs sujets reels. Ne pas renommer les fichiers `docs/` : leurs noms decrivent exactement leur contenu et d'autres fichiers du depot y referent deja.

**Alternatives envisagees** :
- Renommer les documents reels pour correspondre aux anciens noms d'`AGENTS.md` : noms mensongers (ex. `06-COMPONENTS-LAYOUT` parle de composants, pas d'accessibilite) et casse des references existantes

**Justification** :
- Les documents reels sont la source de verite du contenu ; les noms d'`AGENTS.md` etaient obsolètes/aspirationnels
- Aucun autre fichier du depot ne referencait les anciens noms
- Les regles d'images n'ont pas de document dedie : elles sont couvertes par `15-PERFORMANCE.md` (budgets) et `17-ACCESSIBILITY.md` (texte alternatif)

**Impact** : `AGENTS.md` pointe uniquement vers des fichiers existants. Les sujets sans document dedie (consentement RGPD, JSON-LD) ne sont plus listés comme sources de verite a part entiere.

---

## D10 : Marche des vehicules (annonces CI)

**Contexte** : La vision produit evolue vers un marketplace automobile ivoirien complet : vente et achat de vehicules d'occasion/neufs, en plus des pieces detachees. Le marche CI (Abidjan, Bouake, Yamoussoukro, Korhogo, San-Pedro) est prioritaire, prix en FCFA (XOF), paiement Mobile Money (Orange Money, MTN MoMo, Moov Money).

**Decision** : Ajouter les modeles `Vehicle` (catalogue) et `VehicleListing` (annonce vendeur) au schema Prisma, un module `vehicles` (service + routes API CRUD) et une page annonces vehicules. Les annonces sont liees a un vendeur (`User`), avec photos, prix XOF, localisation par ville ivoirienne. Le paiement utilise la couche `PaymentService` existante (PENDING → PROCESSING → COMPLETED/FAILED/CANCELLED).

**Alternatives envisagees** :
- Ne garder que les pieces auto : ne repond pas a la vision annoncee
- Reutiliser le modele `Product` pour les vehicules : melange des domaines, pas de champs dedies (kilometrage, boite, carburant, etc.)

**Justification** :
- Domaines distincts (pieces vs vehicules) avec attributs differents
- Reutilise l'existant : `PaymentService`, `Brand`/`CarModel`, auth, pagination
- Le modele `Vehicle` sert de reference catalogue, `VehicleListing` porte le statut d'annonce (brouillon, active, vendue)

**Impact** : Nouveau schema (migration), nouvelles routes `/api/v1/vehicles` et `/api/v1/vehicles/[id]`, nouvelle page annonces. Les routes sont documentees dans `02-ROUTES.md` et les modeles dans `18-DATABASE.md`.

---

## D11 : Module supply chain (fournisseurs, approvisionnement, conteneurs, douanes)

**Contexte** : AutoAfrique est positionne comme ERP SaaS + marketplace B2B/B2C de pieces automobiles en Afrique de l'Ouest (CI prioritaire). La supply chain (achat depuis l'Asie/Europe, importation par conteneur, dedouanement) est le cœur de l'ERP et le principal differentiel face a une simple marketplace. Les modeles Prisma `Supplier`, `SupplierProduct`, `PurchaseOrder`, `PurchaseOrderItem`, `Container`, `CustomsRecord` existent deja dans le schema mais n'ont aucune surface applicative (ni service, ni route API, ni page, ni navigation).

**Decision** : Construire le module supply chain par etapes, en commencant par `Fournisseurs` (iteration courante : service + routes CRUD + page + navigation), puis `Approvisionnement` (PurchaseOrder) (iteration suivante : service + routes CRUD + page + navigation), puis `Conteneurs` (Container) et `Douanes` (CustomsRecord) dans des iterations suivantes. Chaque module suit le pattern existant : module dans `src/modules/*` (service + dto), routes `src/app/api/v1/*`, page `src/app/dashboard/*`, item de navigation, cle i18n, tests unitaires, documentation prealable. Le schema Prisma existant n'est pas modifie (les modeles sont complets).

**Alternatives envisagees** :
- Construire les 4 modules en une seule iteration : risque de diff trop large et de regressions
- Ne pas construire la supply chain : l'ERP reste une marketplace sans approvisionnement, en decalage avec le positionnement annonce

**Justification** :
- Iteration par module = relecture facile, tests a chaque etape, alignement avec le pattern deja valide sur vehicles/crm
- Les modeles existants evitent toute migration schema
- Le module fournisseurs est la fondation des 3 autres (les bons de commande referencent un fournisseur, les conteneurs referencent un bon de commande)

**Impact** : Nouvelles routes `/api/v1/suppliers`, `/api/v1/purchase-orders`, `/api/v1/containers`, `/api/v1/customs-records` et pages `/dashboard/suppliers`, `/dashboard/purchase-orders`, `/dashboard/containers`, `/dashboard/customs`. Routes documentees dans `02-ROUTES.md` (R018-R021, R136-R158). Les 4 modules de la supply chain sont construits : `Fournisseurs`, `Approvisionnement` (PurchaseOrder), `Conteneurs` (Container) et `Douanes` (CustomsRecord).

## D12 : Module inventaire et entrepôts

**Contexte** : Les modeles Prisma `Warehouse`, `Inventory` et `StockMovement` existent dans le schema sans surface applicative. La page `/dashboard/inventory` existante etait un simple CRUD produits reposant sur `Product.stock`, sans notion d'entrepot, de lignes de stock par produit/entrepot, ni d'historique de mouvements. Le module est la suite logique de la supply chain : apres le dedouanement, la marchandise entre dans un entrepot puis circule entre entrepots.

**Decision** : Construire le module inventaire et entrepots en une iteration : service `src/modules/inventory/inventory.service.ts` (gestion des entrepots, lignes de stock et mouvements), routes `/api/v1/warehouses` (+`[id]`) et `/api/v1/inventory` (+`[id]`, `/movements`, `/transfer`), refonte de la page `/dashboard/inventory` en vue multi-onglets (Stock / Entrepots / Mouvements) avec ajustement de stock inline et transfert entre entrepots. La page refondue remplace le CRUD produits (les produits restent geres via `/dashboard/marketplace` et `/api/v1/products`).

**Alternatives envisagees** :
- Conserver la page CRUD produits et ajouter l'inventaire comme page separee : doublon de surface UI, stock produit et lignes inventaire divergents
- Ne pas construire les mouvements de stock : aucune tracabilite (reception, transfert, ajustement)

**Justification** :
- La page multi-onglets centralise la gestion de stock sans dupliquer le CRUD produits
- Le modele `Inventory` (productId + warehouseId unique) permet un stock multi-entrepots avec `available = quantity - reserved`
- Les `StockMovement` offrent la tracabilite complete (RECEIVED, TRANSFERRED, ADJUSTED, SOLD...)

**Impact** : Nouvelles routes `/api/v1/warehouses` (R159-R163) et `/api/v1/inventory` (R164-R170) documentees dans `02-ROUTES.md`. Service `src/modules/inventory/inventory.service.ts`, routes API associees, page `/dashboard/inventory` refondue. Seed : 3 entrepots (Abidjan, port Abidjan, Bouake) + 8 lignes de stock + mouvements de reception. Tests : 17 tests unitaires.

## D13 : Module finance (factures, comptes comptables, ecritures)

**Contexte** : Les modeles Prisma `Invoice`, `Account` et `Transaction` existent dans le schema sans surface applicative. La page `/dashboard/finance` existante etait un tableau de bord de KPIs base sur les commandes et paiements (chart de revenus, donut par methode de paiement, export CSV), sans gestion reelle de la facturation ni de la comptabilite. Le module finance est la cloture logique du cycle commercial : commande -> paiement -> facture -> comptabilite (plan comptable et ecritures de journal).

**Decision** : Construire le module finance en une iteration : service `src/modules/finance/finance.service.ts` (factures, comptes comptables, ecritures de journal), routes `/api/v1/invoices` (+`[id]`), `/api/v1/accounts` (+`[id]`) et `/api/v1/finance/transactions`, refonte de la page `/dashboard/finance` en vue multi-onglets (Factures / Comptes / Ecritures) avec creation de factures, comptes et ecritures via modales et changement de statut de facture. La facture calcule TVA 18% par defaut (`taxAmount = subtotal * taxRate/100`, `totalAmount = subtotal + taxAmount`) ; le passage a PAID horodate `paidAt` ; une ecriture de journal met a jour le solde courant du compte (`debit` augmente le solde, `credit` le diminue) et stocke le running balance sur l'ecriture.

**Alternatives envisagees** :
- Conserver la page KPI et ajouter la comptabilite comme page separee : surface UI deja utilisee pour la finance, double source de verite des revenus
- Ne pas construire le plan comptable (Account/Transaction) : les factures sans comptabilite ne closent pas le cycle financier

**Justification** :
- La page multi-onglets centralise toute la finance (factures, plan comptable, journal) sans dupliquer le tableau de bord
- Les modeles existants evitent toute migration schema
- `InvoiceStatus` et le calcul TVA standard 18% sont directement portes par le schema Prisma existant

**Impact** : Nouvelles routes `/api/v1/invoices` (R171-R176), `/api/v1/accounts` (R177-R181) et `/api/v1/finance/transactions` (R182-R183) documentees dans `02-ROUTES.md`. Service `src/modules/finance/finance.service.ts`, routes API associees, page `/dashboard/finance` refondue. Seed : 9 comptes comptables + 4 ecritures de journal + 4 factures. Tests : 20 tests unitaires (102 au total).

## D14 : Module livraison (expeditions, tournees, flotte)

**Contexte** : Les modeles Prisma `Shipment`, `DeliveryRoute` et `FleetVehicle` existent dans le schema sans surface applicative. La livraison est la cloture logique du cycle commercial : commande -> paiement -> facture -> expedier -> livrer. Le module couvre le suivi des colis lies aux commandes (tracking, transporteur, statut jusqu'a DELIVERED), l'organisation des tournees (routes de livraison) et la gestion de la flotte de vehicules de livraison.

**Decision** : Construire le module livraison en une iteration : service `src/modules/delivery/delivery.service.ts` (expeditions, tournees, vehicules de flotte), routes `/api/v1/shipments` (+`[id]`), `/api/v1/delivery-routes` (+`[id]`) et `/api/v1/fleet-vehicles` (+`[id]`), page `/dashboard/delivery` en vue multi-onglets (Livraisons / Tournees / Flotte) avec creation via modales et changement de statut. Une expedition se cree liee a une commande existante (`Order`) avec un numero de tracking unique ; le passage a DELIVERED horodate `actualDelivery`. Une tournee lie des livraisons et horodate `completedAt` a la cloture. Un vehicule de flotte a une plaque immatriculation unique et un type parmi moto / voiture / camion / van.

**Alternatives envisagees** :
- Conserver un seul modele generique (Shipment) et gerer tournees et flotte hors schema : perte de la structuration existante du schema Prisma
- Ne pas construire la flotte : la planification des tournees sans vehicules ne reflechit pas la capacite reelle de livraison

**Justification** :
- Le modele `Shipment.orderId` reference directement une `Order`, reliant la livraison au cycle commercial deja construit (paiement, facture)
- Les modeles existants evitent toute migration schema
- Les statuts et types sont directement portes par les enums Prisma existants (`ShipmentStatus`, `DeliveryRouteStatus`, `VehicleType`)

**Impact** : Nouvelles routes `/api/v1/shipments` (R184-R189), `/api/v1/delivery-routes` (R190-R195) et `/api/v1/fleet-vehicles` (R196-R203) documentees dans `02-ROUTES.md` (les routes techniques robots/sitemap/404/opengraph sont renumerees R204-R207 pour eviter la collision avec R200). Service `src/modules/delivery/delivery.service.ts`, routes API associees, page `/dashboard/delivery` refondue. Seed : 4 commandes de livraison (CMD-2026-001 a 004) + 4 expeditions (DHL-CI-88210, LOCAL-77190, GAB-55017, LOCAL-77314) + 3 tournees + 4 vehicules de flotte. Tests : 20 tests unitaires (122 au total).

## D15 : Restructuration de la documentation

**Contexte** : Le dossier `docs/` utilisait une numérotation thématique interne (`00-PROJECT-BRIEF.md`, `03-ROUTES-MATRIX.md`, `04-PAGE-SPECS.md`, `11-DATA-MODELS.md`, `12-API-SPECS.md`, etc.). Une organisation par domaine plus parlante était souhaitée, couvrant aussi les domaines construits depuis (ERP, CRM, Marketplace, Mobile Money) qui n'avaient pas de document dédié.

**Decision** : Restructurer `docs/` selon un plan de 27 fichiers : `README.md` (index), `00-VISION.md` → `23-DEPLOIEMENT.md`, plus `AGENTS.md` (à la racine) et `DECISIONS.md`. Le contenu existant est conservé et redistribué :

- `00-VISION.md` = `00-PROJECT-BRIEF.md` + `01-USERS-AND-GOALS.md` (fusion)
- `01-ARCHITECTURE.md` = `02-INFORMATION-ARCHITECTURE.md` (renommage)
- `02-ROUTES.md` = `03-ROUTES-MATRIX.md` (renommage)
- `03-PAGES.md` = `04-PAGE-SPECS.md` + `07-TEMPLATES.md` + `10-FORMS.md` + `08-CONTENT-COPYWRITING.md` + `13-I18N.md` (fusion)
- `04-DESIGN-SYSTEM.md` = `05-DESIGN-SYSTEM.md` + `06-COMPONENTS-LAYOUT.md` (fusion)
- `05-UX-ACCESSIBILITY.md` = `17-ACCESSIBILITY.md` (renommage)
- `06-SEO.md` + `07-CRAWL-INDEXATION.md` + `08-STRUCTURED-DATA.md` = `09-SEO-SPECS.md` (découpage)
- `09-TRACKING.md` = `14-ANALYTICS.md` (renommage)
- `10-AUTHENTIFICATION.md`, `11-MOBILE-MONEY.md`, `12-MARKETPLACE.md`, `13-ERP.md`, `14-CRM.md`, `15-CATALOGUE.md`, `16-PRODUITS.md`, `17-IMAGES-MEDIA.md` : documents domaine, créés à partir des modules réellement construits dans `src/modules/*` et des routes de `02-ROUTES.md`
- `18-DATABASE.md` = `11-DATA-MODELS.md` (renommage)
- `19-API.md` = `12-API-SPECS.md` + `18-ERROR-HANDLING.md` (fusion)
- `20-SECURITY.md` = `19-SECURITY.md`, `21-PERFORMANCE.md` = `15-PERFORMANCE.md`, `22-TESTS.md` = `16-TESTING.md`, `23-DEPLOIEMENT.md` = `20-DEPLOYMENT.md` (renommages)

`AGENTS.md` (ordre de lecture, sources de vérité, section Images) et `.env.example` sont mis à jour pour référencer les nouveaux noms. Les références internes de `DECISIONS.md` (D8, D10-D14) pointent désormais vers les nouveaux fichiers.

**Alternatives envisagees** :
- Conserver l'ancienne structure : les domaines (ERP, CRM, Marketplace, Mobile Money) restaient sans document dédié
- Ajouter simplement des fichiers sans renommer : mélange de deux conventions de numérotation incompatibles

**Justification** :
- Une organisation par domaine (VISION, ARCHITECTURE, ROUTES, PAGES, DESIGN, SEO, TRACKING, AUTH, MOBILE-MONEY, MARKETPLACE, ERP, CRM, CATALOGUE, PRODUITS, IMAGES, DATABASE, API, SECURITY, PERFORMANCE, TESTS, DEPLOIEMENT) est plus lisible et alignée sur les modules réellement construits
- Aucun contenu n'est perdu : tout l'existant est conservé et redistribué, avec un `README.md` indexant les sources de vérité
- `AGENTS.md` et `.env.example` sont les seuls fichiers hors `docs/` qui référençaient les anciens noms (vérifié par recherche exhaustive)

**Impact** : Les anciens noms de fichiers `docs/*` sont retirés du dépôt. `AGENTS.md` et `.env.example` pointent vers la nouvelle organisation. Le `README.md` sert d'index des sources de vérité. Cette décision s'appuie sur D9 (le contenu des documents est la source de vérité ; seuls les noms changent).

## D16 : Module notifications

**Contexte** : Le modèle Prisma `Notification` existe dans le schéma sans surface applicative. Les routes `GET /api/v1/notifications` (R126) et `POST /api/v1/notifications/read` (R127) sont documentées dans `02-ROUTES.md` et `19-API.md` mais non implémentées. La cloche de `DashboardTopBar` appelait des routes inexistantes (`/api/v1/notificaciones`) et retombait sur des notifications générées côté client, sans persistance ni vue dédiée.

**Decision** : Construire le module notifications en une iteration : service `src/modules/notifications/notifications.service.ts` (liste, compteur non lues, marquer comme lue, tout marquer comme lu, création), routes `GET /api/v1/notifications` (liste paginée filtrée par `read`, `type`, `search`, avec `unreadCount`) et `POST /api/v1/notifications/read` (body `{ ids: [...] }` ; sans `ids`, toutes les non-lues de l'utilisateur sont marquées lues), page `/dashboard/notifications` (filtres Toutes / Non lues / Lues, filtre par type, recherche, marquer comme lu et tout marquer comme lu). Les notifications sont toujours scopées à l'utilisateur authentifié (`userId` issu du token). Les types valides sont order / payment / stock / promo / system.

**Alternatives envisagees** :
- Conserver la génération de notifications côté client dans `DashboardTopBar` : aucune persistance, compteur perdu au rechargement, aucune vue dédiée
- Exposer les notifications sans auth : violation du scopage utilisateur, chaque compte verrait les notifications des autres

**Justification** :
- Le modèle `Notification` existant (userId, title, message, type, link, read, readAt, metadata, createdAt) évite toute migration schema
- `POST /api/v1/notifications/read` sans `ids` couvre le « Tout lire » de la cloche sans nouvelle route
- La correction de la typo `notificaciones` → `notifications` dans `DashboardTopBar` branche la cloche sur les vraies routes (R126, R127)

**Impact** : Nouvelles routes `GET /api/v1/notifications` (R126) et `POST /api/v1/notifications/read` (R127) implémentées. Service `src/modules/notifications/notifications.service.ts`, routes API associees, page `/dashboard/notifications`, entree de navigation (icone cloche) + cles i18n fr/en. Correction de `DashboardTopBar` (`/api/v1/notificaciones` → `/api/v1/notifications`). Seed : 8 notifications (5 non lues / 3 lues pour Moussa, 1 pour Abdoulaye, 1 pour Fatima). Tests : 10 tests unitaires (132 au total).

## D17 : Couverture de tests des services restants

**Contexte** : Les services `crm`, `orders`, `payments` et `products` etaient implementes (routes, pages, seeds) mais sans tests unitaires, contrairement aux modules construits par iteration. La Definition of Done impose des tests qui reussissent pour chaque module.

**Decision** : Ajouter des fichiers de test unitaires pour les quatre services :
- `src/modules/crm/crm.service.test.ts` — customers (list, get, create, update, delete), interactions (list, create avec `lastOrderAt`), leads (list, create, updateLeadStatus, delete), KPIs
- `src/modules/orders/orders.service.test.ts` — list avec filtres (seller, plage de dates), create (NotFound produit, stock insuffisant, TVA 18%, decrement stock, numero `AAF-`), updateStatus (timeline), cancel (Forbidden, statut non annulable, restauration du stock), delegation seller/buyer
- `src/modules/payments/payments.service.test.ts` — process (NotFound commande, commande d'autrui, deja payee, methode non supportee, succes completant le paiement et marquant PAID, echec provider → FAILED + PaymentError), cancel, getStatus, list, refund (REFUNDED + remboursement)
- `src/modules/products/products.service.test.ts` — list (brand, category, recherche OR), getById (increment views), create (slug genere, resolution brand/category), update et delete (NotFound, Forbidden, soft delete), getBrands, getCategories, search

Le test `payments.service.test.ts` mocke le registry `paymentProviders` pour injecter un fournisseur factice sans passer par les adaptateurs reels (qui simulent un delai de 1s).

**Justification** :
- Les quatre services suivent le meme pattern `prisma` mocke (`vi.hoisted` + `vi.mock('@/lib/prisma')`) que les autres modules
- La logique metier critique (TVA, stock, statuts de paiement, ownership) est desormais verifiee par des tests dedies
- Aucun changement de code applicatif : les tests documentent et verifient le comportement existant

**Impact** : 4 fichiers de test crees. 57 tests unitaires ajoutes (CRM 13, Orders 14, Payments 16, Products 14). Suite totale : 189 tests (16 fichiers) — 132 avant, 57 ajoutes.

## D18 : Module analytics / tracking

**Contexte** : Le document `09-TRACKING.md` definit un schema de tracking (page_view, search_product, view_product, add_to_cart, checkout_start, order_complete, payment_success, login, register, etc.) et le modele Prisma `AnalyticsEvent` existe dans le schema, mais aucun evenement n'est enregistre et aucune route API ne les expose. Le dashboard `/dashboard/analytics` (R012) affiche des metriques calculees depuis products/orders/payments, avec un chiffre de satisfaction code en dur (`avgRating = 4.7`, `totalReviews = 0`) qui viole la regle « aucun faux chiffre » d'AGENTS.md.

**Decision** : Construire le module analytics en une iteration :
- Service `src/modules/analytics/analytics.service.ts` : `trackEvent` (validation de l'evenement dans la liste `TRACKABLE_EVENTS`, proprietes objet, stringifiees pour le champ Json), `listEvents` (filtres event/entity/entityId/from/to, limite plafonnee a 200), `getStats` (agregation par type, sessions uniques, entonnoir de conversion, serie temporelle journaliere)
- Routes `POST /api/v1/analytics/events` (R208, publique pour le tracking anonyme du marketplace, `userId` rattache via cookie JWT si present via `optionalAuth`), `GET /api/v1/analytics/events` (R209, auth requise), `GET /api/v1/analytics/stats` (R210, auth requise)
- Utilitaire client `src/lib/tracking.ts` (`track`, `trackPageView`, `getSessionId` persiste dans localStorage) branche dans le marketplace (`search_product`, `filter_product`, `view_product`, `add_to_cart`, `checkout_start`, `order_complete`, `page_view`)
- Dashboard `/dashboard/analytics` alimente par R210 (engagement : vues pages, recherches, ajouts panier, sessions uniques, entonnoir de conversion) et par `/api/v1/reviews` pour la satisfaction reelle (note moyenne + nombre d'avis), remplacant le `avgRating = 4.7` code en dur
- Seed : ~100 evenements analytics sur les 14 derniers jours (page_view, search_product, filter_product, view_product, add_to_cart, checkout_start, order_complete, payment_success, register, login)
- Tests : `src/modules/analytics/analytics.service.test.ts` (trackEvent validation + creation, listEvents filtres + limite, getStats agregation/entonnoir/serie)

**Alternatives envisagees** :
- Integrer Google Analytics 4 (gtag) cote client : pas de persistance propre, les donnees ne sont pas revisables dans l'ERP, et la regle « aucun faux chiffre » reste non resolue pour le dashboard
- Conserver le `avgRating` code en dur : violation directe d'AGENTS.md (faux chiffre)

**Justification** :
- Le modele `AnalyticsEvent` existant evite toute migration schema
- Le tracking interne alimente le dashboard ERP sans dependance externe ; le module suit le pattern service + routes + tests + docs des iterations precedentes
- R208 publique avec `optionalAuth` respecte le flux public du marketplace (visiteurs non connectes) tout en rattachant l'identite quand elle est connue
- Le dashboard affiche desormais uniquement des donnees reelles

**Impact** : Nouvelles routes R208-R210 documentees dans `02-ROUTES.md` et `19-API.md`. `09-TRACKING.md` complete avec l'implementation du module, `18-DATABASE.md` avec le modele `AnalyticsEvent`. Dossier `src/modules/analytics/` cree. Seed : ~100 evenements. Tests : 9 tests unitaires ajoutes (198 au total, 17 fichiers).

## D19 : Module avis produits

**Contexte** : Les routes `/api/v1/reviews` GET (R128) et POST (R129) et la section « Avis produits » de `16-PRODUITS.md` documentent les avis, mais l'implementation est un fichier inline `src/app/api/v1/reviews/route.ts` sans service ni tests. De plus, le composant `ProductReviews` lit `rev.comment` alors que la route stocke `content`, donc les commentaires saisis n'etaient pas affiches ; et les cartes produits du marketplace utilisaient `_avgRating`/`_reviewCount` jamais calcules par la liste des produits.

**Decision** : Construire le module avis en une iteration :
- Service `src/modules/reviews/reviews.service.ts` : `listReviews` (avis actifs du produit, auteur enrichi, `comment` alias de `content`, `averageRating`, distribution `ratingCounts`, pagination), `createReview` (validation note entiere 1-5, commentaire requis, produit existe, un seul avis par utilisateur/produit via `@@unique`)
- Refactorisation de `src/app/api/v1/reviews/route.ts` pour utiliser le service (GET public, POST avec `requireAuth`)
- Correction du composant `ProductReviews` : affichage `rev.comment || rev.content`
- Agregation `_avgRating` et `_reviewCount` dans `list()` de `products.service.ts` (include des notes des avis actifs) pour alimenter les cartes du marketplace
- Seed : 11 avis demo sur les produits existants (verifie flag `verified` a 0 : pas de mention « achat verifie » fausse)
- Tests : `src/modules/reviews/reviews.service.test.ts` (listReviews vide/riche, createReview validation, produit manquant, doublon, succes)

**Alternatives envisagees** :
- Garder la route inline et ne rien corriger : les commentaires restent invisibles (bug) et aucun test ne couvre R128/R129
- Afficher les notes sans agregation cote liste produits : les cartes marketplace continuent de ne jamais montrer de note

**Justification** :
- Le modele `Review` existant (rating, title, content, verified, helpful, active, `@@unique([productId, userId])`) evite toute migration schema
- Le module suit le pattern service + routes + tests + docs des iterations precedentes et satisfait la Definition of Done
- `verified` reste 0 dans le seed pour respecter la regle « aucun faux chiffre / avis trompeur »

**Impact** : Route `/api/v1/reviews` refactoree (R128, R129), dossier `src/modules/reviews/` cree, `16-PRODUITS.md` et `19-API.md` mis a jour. Seed : 11 avis. Tests : 8 tests unitaires ajoutes (206 au total, 18 fichiers).

**Note (verification)** : Un bug pre-existant a ete detecte et corrige pendant la verification : le seed inserait `Product.condition` en minuscules (`new`, `used`, `refurbished`) alors que l'enum Prisma `ProductCondition` est `NEW`, `USED`, `REFURBISHED`, `OEM_AFTERMARKET`. Prisma 7 valide les enums en lecture (P2023), donc `GET /api/v1/products` echouait en 500. Correction : `p.condition.toUpperCase()` dans `prisma/seed.mjs` (le frontend et l'enum utilisaient deja les majuscules).

## D20 : Donnees structurees JSON-LD (SEO)

**Contexte** : Le document `08-STRUCTURED-DATA.md` definit les schemas JSON-LD (Organization, WebSite, Product, ItemList, FAQPage) pour R001 (accueil), R005 (marketplace) et R016 (aide). Le composant `src/components/StructuredData.tsx` existait mais n'etait importe sur aucune page (code mort) : aucun schema n'etait emis. Il contenait en outre des donnees fausses ou erronees : URLs `sameAs` inventees (facebook.com/autoafrique, twitter.com/autoafrique, etc.), faux numero de telephone, `addressCountry: "SN"` au lieu de la zone documentee, `SearchAction` ciblant `?q=` alors que le marketplace utilise le parametre `search`, et absence du schema `ItemList` pourtant documente pour R005.

**Decision** : Iteration SEO « donnees structurees » :
- Creer `src/lib/structured-data.ts` : fonctions pures `buildOrganizationSchema`, `buildWebsiteSchema`, `buildProductSchema`, `buildItemListSchema`, `buildBreadcrumbSchema`, `buildFAQPageSchema` conformes a `08-STRUCTURED-DATA.md` (testables unitairement)
- Reecrire `src/components/StructuredData.tsx` : composants legers rendant `<script type="application/ld+json">` inline (fiable pour les crawlers, compatible pages serveur et client), sans donnees fausses : `sameAs: []`, suppression du faux telephone et de l'adresse SN, ajout d'`areaServed` (10 pays)
- Brancher les schemas : R001 (`OrganizationStructuredData`, `WebsiteStructuredData` dans `src/app/page.tsx`), R005 (`ItemListStructuredData` sur la grille + `ProductStructuredData` dans la modale detail de `src/app/dashboard/marketplace/page.tsx`), R016 (`FAQStructuredData` alimente par la FAQ existante de `src/app/dashboard/help/page.tsx`)
- Corriger le `SearchAction` : cible `${SITE_URL}/dashboard/marketplace?search={search_term_string}` (parametre reel du marketplace)
- Tests : `src/lib/structured-data.test.ts` (structure Organization/WebSite/Product/ItemList/Breadcrumb/FAQPage, areaServed, sameAs vide, cible SearchAction `?search=`, positions ItemList sequentielles)

**Alternatives envisagees** :
- Utiliser `next/script` cote client pour emettre les JSON-LD : moins fiable pour l'indexation (depend de l'execution JS, hors HTML initial), donc abandonne au profit d'un `<script>` inline
- Creer une page produit dediee (`/produits/[id]`) pour des URLs ItemList significatives : route non documentee dans `02-ROUTES.md`, interdite par les regles du projet

**Justification** :
- `08-STRUCTURED-DATA.md` est la source de verite SEO ; les schemas emis suivent exactement la structure documentee
- La regle « aucune fausse preuve » impose de retirer les `sameAs`/telephone inventes et de n'exposer que des donnees reelles
- La cible `?q=` ne correspondait a aucun comportement du site : le rich-result de recherche Google pointait vers une URL invalide
- Les fonctions pures se testent sans mock, ce qui renforce la couverture SEO a cout nul

**Impact** : `08-STRUCTURED-DATA.md` (documente les schemas) et `DECISIONS.md` mis a jour. Fichiers : `src/lib/structured-data.ts` (+`structured-data.test.ts`), `src/components/StructuredData.tsx`, `src/app/page.tsx`, `src/app/dashboard/marketplace/page.tsx`, `src/app/dashboard/help/page.tsx`. Tests : 12 tests unitaires ajoutes. Limitation connue : les URLs des items ItemList pointent vers la page marketplace (pas de page produit dediee documentee) ; le schema `Vehicle` annonce dans `02-ROUTES.md` (R017) n'est pas traite ici (non defini dans `08-STRUCTURED-DATA.md`).

**Suite (corrections et extension)** :
- **Schema `Vehicle` (R017)** : ajout de `buildVehicleSchema` (schema.org `Vehicle` : marque, `vehicleModelDate`, `mileageFromOdometer` en `KMT`, `fuelType`/`vehicleTransmission` en enums schema.org, `itemCondition` New/Used selon la condition, offre XOF) et du composant `VehicleStructuredData`. Branche sur `/dashboard/vehicles` : `Vehicle` dans la modale detail + `ItemList` sur la grille. Schema documente dans `08-STRUCTURED-DATA.md`.
- **Breadcrumb JSON-LD** : `BreadcrumbStructuredData` (deja construit mais inutilise) branche sur `/dashboard/marketplace` (Accueil > Marketplace) et `/dashboard/vehicles` (Accueil > Vehicules).
- **Assets images manquants** : `logo.png` (reference par le schema Organization et `08-STRUCTURED-DATA.md`), `og-image.png` (Open Graph/Twitter du layout) et `apple-touch-icon.png` (layout) n'existaient pas (404). Generation de vrais fichiers dans `public/` via un script PNG minimal (zlib natif, pas de fausse preuve : logo geometrique aux couleurs de la marque `#FF6B35`), 5-28 KB, sous les budgets de `17-IMAGES-MEDIA.md`.
- **DRY** : le marketplace utilise desormais la constante `MARKETPLACE_URL` au lieu d'une URL en dur.

## D21 : Sitemap et robots.txt (contradiction documentaire resolue)

**Contexte** : `02-ROUTES.md` (matrice des routes, source de verite des routes) marque R001 `/` (index, sitemap oui), R005 `/dashboard/marketplace` (index, sitemap oui) et R017 `/dashboard/vehicles` (index, sitemap oui) comme les seules pages indexables ; R016 `/dashboard/help` est noindex. Or l'implementation etait incoherente : `src/app/sitemap.ts` listait les pages auth (R002/R003, noindex) et toutes les pages privees du dashboard, omettait `/dashboard/vehicles`, et incluait `/api/v1` ; `src/app/robots.ts` bloquait tout `/dashboard/` (donc aussi les pages publiques indexables). `07-CRAWL-INDEXATION.md` etait lui-meme contradictoire : il mettait `/dashboard/help` (noindex dans 02) dans le sitemap et ne mentionnait pas `/dashboard/vehicles`, tout en interdisant `/dashboard/` dans robots.txt.

**Decision** :
- Appliquer en priorite la matrice `02-ROUTES.md` (source de verite des routes) pour l'indexabilite de chaque page, conformement a la procedure de gestion des contradictions d'`AGENTS.md`
- `sitemap.ts` : ne lister que les pages « index / sitemap oui » : `/` (1.0), `/dashboard/marketplace` (0.9), `/dashboard/vehicles` (0.8)
- `robots.ts` : `Allow: /`, `/dashboard/marketplace`, `/dashboard/vehicles` (les `Allow` specifiques priment sur `Disallow: /dashboard/` par correspondance la plus longue) ; `Disallow: /dashboard/`, `/api/`, `/auth/`, `/_next/`, `/admin/`
- Mettre a jour `07-CRAWL-INDEXATION.md` pour aligner sitemap et robots.txt sur `02-ROUTES.md`
- Corriger les metas du layout : suppression de l'alternate `/en` (route inexistante, 404) et du `verification.google` placeholder « your-google-verification-code » (valeur factice)

**Contradiction signalee** : `07-CRAWL-INDEXATION.md` vs `02-ROUTES.md` (inclusion de `/dashboard/help` dans le sitemap et blocage robot de toutes les pages `/dashboard/`). Resolue en faveur de `02-ROUTES.md`, matrice exhaustive par page.

**Impact** : `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/layout.tsx`, `docs/07-CRAWL-INDEXATION.md`, `docs/DECISIONS.md`. A noter : le verificateur Google Search Console (metadonnee `verification.google`) reste a renseigner par le proprietaire avec son vrai code.

**Mise a jour (verification GSC)** : la propriete Google Search Console est desormais verifiee — meta `google-site-verification` `google67878e31d8998189` dans `src/app/layout.tsx` et fichier `/google67878e31d8998189.html` dans `public/` (cf. `07-CRAWL-INDEXATION.md`).

## D22 : Metadonnees par page (titres, canonical, robots)

**Contexte** : `06-SEO.md` documente des titres, descriptions, canonicals et directives robots par page (Landing, Marketplace, Connexion, Inscription, Dashboard). Or les pages concernes (`/dashboard/marketplace`, `/dashboard/vehicles`, `/auth/login`, `/auth/register` et le reste du dashboard) sont des composants client (`'use client'`) : ils ne peuvent pas exporter `metadata`/`generateMetadata`. Resultat avant cette decision : toutes ces pages heritaient du titre par defaut du layout racine et etaient `index,follow` par defaut (y compris les pages privees du dashboard).

**Decision** :
- Ajouter des `layout.tsx` serveur par route (les layouts sont des serveurs et peuvent exporter `metadata` meme si la page sous-jacente est cliente) :
  - `src/app/dashboard/layout.tsx` : `robots: noindex, nofollow` pour toutes les pages du dashboard (conforme `06-SEO.md` et `02-ROUTES.md` R004-R020 hors R005/R017)
  - `src/app/dashboard/marketplace/layout.tsx` : titre « Marketplace — Pièces détachées automobile », description, `canonical: /dashboard/marketplace`, `robots: index, follow`
  - `src/app/dashboard/vehicles/layout.tsx` : titre « Véhicules — Annonces Côte d'Ivoire », description, `canonical: /dashboard/vehicles`, `robots: index, follow`
  - `src/app/auth/layout.tsx` : `robots: noindex, follow` (Connexion/Inscription, conforme `06-SEO.md`)
- Le titre final respecte le template racine `%s | AutoAfrique` : « Marketplace — Pièces détachées automobile | AutoAfrique » et « Véhicules — Annonces Côte d'Ivoire | AutoAfrique » (conforme `06-SEO.md`)
- Appliquer la regle « aucun faux chiffre » : les descriptions ne reprennent PAS « 85,000+ pièces » de `06-SEO.md` (volume d'inventaire non verifie). Divergence signalee.

**Contradiction / limite** :
- `06-SEO.md` (source de verite SEO) annonce « 85,000+ pièces » dans les descriptions. Interdiction `AGENTS.md` « ne creer aucun faux chiffre » : on n'emet pas ce chiffre, descriptions redigees sans valeur numerique. Divergence documentee ici.
- `06-SEO.md` annonce `og:locale: fr_SN` (Senegal) alors que le marche cible est la Cote d'Ivoire ; le layout racine emet `fr_FR` (divergence deja traitee en D20, pas de modif ici).
- Les autres pages du dashboard (R004, R006-R020) restent en titre generique du layout racine car pages clientes sans layout dedie ; le point critique SEO (noindex/noindex) est couvert par le layout dashboard.

**Impact** : `src/app/dashboard/layout.tsx`, `src/app/dashboard/marketplace/layout.tsx`, `src/app/dashboard/vehicles/layout.tsx`, `src/app/auth/layout.tsx`, `docs/DECISIONS.md`. Pages indexables (R001, R005, R017) desormais avec titre, description, canonical et robots explicites.

## D23 : Titres dynamiques (detail produit / annonce, cote client)

**Contexte** : `generateMetadata` exige une page serveur avec `params` (route dediee), or `02-ROUTES.md` ne documente aucune route UI detail produit/annonce — le detail s'affiche dans une modal sur R005 (`/dashboard/marketplace`) et R017 (`/dashboard/vehicles`). Créer des routes (`/dashboard/marketplace/[id]`, `/dashboard/vehicles/[id]`) violerait l'interdiction « ne créer aucune route non documentee ». Decision (validee) : titre dynamique cote client a l'ouverture de la modal.

**Decision** :
- Creer `src/lib/useDocumentTitle.ts` : hook `useDocumentTitle(activeTitle, fallbackTitle)` qui applique `document.title` = `<titre> | AutoAfrique` quand une modal detail est ouverte, et restaure le titre de la page a la fermeture. Fonction pure `buildDocumentTitle` testee.
- Marketplace (R005) : `activeTitle = detailProduct.title` a l'ouverture de la modal produit ; fallback = « Marketplace — Pièces détachées automobile | AutoAfrique ».
- Vehicules (R017) : `activeTitle = "<marque> <nom> <annee>"` (ex. « Toyota RAV4 2021 ») ; fallback = « Véhicules — Annonces Côte d'Ivoire | AutoAfrique ».
- Separation `|` alignee sur le template de titre du layout racine (`%s | AutoAfrique`) de D22.

**Limitation documentee** : les titres dynamiques sont poses par JavaScript (modal client) ; ils ameliorent le titre de l'onglet/le sharing instantane mais ne sont pas indexables tels quels par les moteurs (pas de route detail dediee). Si un jour des pages detail sont documentees dans `02-ROUTES.md`, `generateMetadata`/`generateStaticParams` les remplaceront proprement.

**Impact** : `src/lib/useDocumentTitle.ts` (+ `useDocumentTitle.test.ts`, 3 tests), `src/app/dashboard/marketplace/page.tsx`, `src/app/dashboard/vehicles/page.tsx`, `docs/DECISIONS.md`, `docs/06-SEO.md` (note ajoutee).

## D24 : Pages d'erreur 404 et 500 (localisation FR)

**Contexte** : `03-PAGES.md` (section « Erreurs » et « Localisation FR ») documente les messages « Page introuvable » (404) et « Erreur serveur, réessayez » (500). Or l'application n'avait aucun `not-found.tsx`/`error.tsx` : les pages d'erreur par defaut de Next.js affichaient un message anglais (« 404 This page could not be found »), hors localisation FR documentee. Les routes techniques R204-R207 restaient fonctionnelles (verifie : `/robots.txt` 200, `/sitemap.xml` 200, `/opengraph-image` 200 image/png, `/404` et URL inconnue 404).

**Decision** :
- Creer `src/app/not-found.tsx` (composant serveur) : page 404 brandee aux couleurs du design system (`#FF6B35`), message « Page introuvable », `metadata` titre « Page introuvable | AutoAfrique » et `robots: noindex, nofollow`, CTA « Retour à l'accueil » (`/`) et « Parcourir le marketplace » (`/dashboard/marketplace`)
- Creer `src/app/error.tsx` (composant client, obligatoire pour une error boundary) : page 500 « Erreur serveur, réessayez » avec bouton « Réessayer » (`reset`)
- R206 `/404` et toute URL inconnue renvoient desormais le 404 FR brande

**Impact** : `src/app/not-found.tsx`, `src/app/error.tsx`, `docs/DECISIONS.md`. L'image Open Graph reste `/og-image.png` (conforme `06-SEO.md`) ; la route `/opengraph-image` (R207) est servie par le fichier `opengraph-image.tsx` existant (200 image/png verifie), independamment de la meta `og:image` explicite du layout.

## D25 : Alignement de la strategie de tests sur `22-TESTS.md` (couverture + E2E)

**Contexte** : `22-TESTS.md` documente des seuils de couverture (Instructions > 80 %, Branches > 70 %, Functions > 80 %, Lines > 80 %), des scripts `test:run`/`test:coverage`/`test:e2e`/`test:e2e:ui`, des tests d'integration (Vitest + Testing Library) et des tests E2E (Playwright). Etat avant : aucun provider de couverture (mesure impossible), aucun script, pas de Playwright, pas de config E2E. Mesure initiale reelle : Stmts 76.6 %, Branch 63.3 % (sous les seuils).

**Decision** :
- Installer `@vitest/coverage-v8` (provider v8) et `@playwright/test` (dependances dev, justifiees par `22-TESTS.md`)
- `vitest.config.mts` : `coverage` provider v8 + seuils (statements 80, branches 70, functions 80, lines 80) ; exclusion de `tests-e2e/**` du runner unitaire (via `defaultExclude`)
- `package.json` : scripts `test:run`, `test:coverage` (verifie les seuils), `test:e2e`, `test:e2e:ui`
- Etendre les tests unitaires des services les moins couverts pour atteindre les seuils : `auth` (login inexistant, refresh ok/expire/manquant, logout, MFA enable/verify/erreurs), `vehicles` (liste tous filtres, prix non positif, modele+images, update ok/missing, delete ok/forbidden, setStatus non-SOLD/missing), `finance` (sous-total negatif, invoice avec orderId, update ok/missing, statut/remove missing, compte parent manquant, updateAccount ok/dup/self-parent/type, removeAccount avec enfants, credit, tri+recherche transactions)
- Ajouter Playwright : `playwright.config.ts` (project chromium, `webServer` = `npm run dev`, port 3000) + `tests-e2e/core.spec.ts` (4 tests E2E des flux critiques : R001 landing H1/titre, R005 marketplace titre+grille, R017 vehicules titre, R206 404 FR « Page introuvable »)
- `.gitignore` : `/playwright-report`, `/test-results` ; eslint : ignore `coverage/**`, `playwright-report/**`, `test-results/**`

**Resultats** : 258 tests unitaires (35 ajoutes), couverture Stmts 83.9 / Branch 71.6 / Funcs 88.0 / Lines 88.4 — tous au-dessus des seuils documentes. E2E : 4 passes (21.7 s). Lint/typecheck/build OK.

**Limitation documentee** : les tests d'integration « Vitest + Testing Library » (`22-TESTS.md`) et la CI GitHub Actions ne sont pas mis en place ici (environnement local ; l'installation de `@testing-library/*` + jsdom reste a faire). Le runner unitaire reste en environnement `node` (pas de jsdom).

## D26 : Tests d'integration jsdom + Testing Library (Modal, EmptyState, StarRating, ProductReviews, useDocumentTitle)

**Contexte** : `22-TESTS.md` documente des tests d'integration « Vitest + Testing Library ». La limite D25 notait que `@testing-library/*` + jsdom n'etaient pas installes. Etat avant : aucun test des composants UI, la couverture du dossier `components` etait 0 %.

**Decision** :
- Installer (dependances dev, justifiees par `22-TESTS.md`) : `jsdom`, `@testing-library/react`, `@testing-library/dom`, `@testing-library/jest-dom`, `@testing-library/user-event`
- `vitest.setup.ts` : `import '@testing-library/jest-dom/vitest'` (remplace le contenu precedent) ; le runner garde l'environnement `node` par defaut, les fichiers de tests UI declarent `// @vitest-environment jsdom`
- `src/components/Modal.test.tsx` (4 tests) : rendu ferme/ouvert, fermeture par Escape, fermeture par le bouton (accessible via `getByLabelText('Close modal')`)
- `src/components/EmptyState.test.tsx` (3 tests) : titre/description, actions primaire et secondaire
- `src/components/StarRating.test.tsx` (4 tests composant + 3 tests `ProductReviews`) : 5 etoiles par defaut, nombre custom, mode lecture seule (pas d'`onChange`), clic interactif (`onChange(index)`), et `ProductReviews` (fetch mocke via `vi.stubGlobal`) : rendu des avis + moyenne + auteur, etat vide « Aucun avis pour le moment », soumission POST d'un avis puis rechargement de la liste
- `src/lib/useDocumentTitle.test.ts` etendu avec `renderHook` : titre applique, fallback, mise a jour au re-render (via `// @vitest-environment jsdom`)

**Resultats** : 275 tests unitaires (23 fichiers), tous verts. Couverture : Stmts 84.53 / Branch 72.39 / Funcs 88.73 / Lines 89.0 — au-dessus des seuils documentes (80/70/80/80). Premier essai echoue (comptage cumule de 5+3 etoiles sur deux rendus), corrige en separant les tests. Lint/typecheck/build OK.

**Limitation restante (D25)** : la CI GitHub Actions n'est pas mise en place (environnement local uniquement) ; la couverture du dossier `components` reste partielle (StarRating/ProductReviews completement testes, les autres composants visuels non testes).

**Impact** : `package.json` (devDeps), `vitest.setup.ts`, `src/components/Modal.test.tsx`, `src/components/EmptyState.test.tsx`, `src/components/StarRating.test.tsx`, `src/lib/useDocumentTitle.test.ts`, `docs/DECISIONS.md`.

## D27 : CI GitHub Actions alignee sur `22-TESTS.md` (tests unitaires + E2E)

**Contexte** : `22-TESTS.md` documente une CI/CD « lint au push, typecheck au push, tests unitaires au push, tests E2E au merge sur main, build verification avant deploy ». Limite notee depuis D25/D26 : seuls lint/typecheck/build/deploy etaient dans `.github/workflows/ci-cd.yml` ; les tests unitaires et E2E n'etaient pas executes en CI.

**Decision** : completer `.github/workflows/ci-cd.yml` :
- job `unit-tests` (needs lint, typecheck) : `npm ci` puis `npx vitest run` — execute au push/PR
- job `e2e` (needs build, condition `if: github.ref == 'refs/heads/main'`) : `npm ci`, `npx playwright install --with-deps chromium`, `npm run test:e2e` — au merge sur main (4 tests E2E)
- les jobs existants `lint`, `typecheck`, `build`, `deploy` (Vercel via secrets) sont conserves

**Resultats** : validation locale pre-commit : lint OK, typecheck OK, `npx vitest run` 275 verts, build OK. Workflow decoreli dans CI reversible par GitHub Actions au prochain push/PR ; les tests unitaires utilisent le fallback `JWT_SECRET='test-secret-for-vitest'` du `vitest.setup.ts` (aucune variable requise en CI).

**Limite** : l'execution reelle des runs CI depend d'un `git push` (le merge sur `main` declenche la branche E2E) ; la couverture (threads seuils) n'est pas bloquante dans AI (seuls les tests complets important).

**Impact** : `.github/workflows/ci-cd.yml`, `docs/DECISIONS.md`.

## D28 : Retrait des faux chiffres et superlatifs non verifiables (Landing/Footer/meta)

**Contexte** : audit de verification (grep sur les interdictions `AGENTS.md` : « ne creer aucun faux chiffre », « ne creer aucune fausse donnee »). Le chiffre « plus de 85 000 pieces referencees » — dont D20/D22 avaient documente le retrait pour volume d'inventaire non verifie — reapparaissait dans le blurb About de la Landing (`LandingPage.tsx`), accompagne de superlatifs marketing non verifiables (« premiere plateforme e-commerce », « marketplace n°1 / #1 ») egalement presents dans le Footer et les meta du footer (`i18n.ts`).

**Decision** :
- `src/components/LandingPage.tsx` : supprimer « plus de 85 000 pieces » et « premiere plateforme » ; reformuler sans chiffre invente ni superlatif. Le titre de section « n°1 » devient « La marketplace des pieces automobiles en Afrique de l'Ouest » (FR/EN)
- `src/components/Footer.tsx` : « La marketplace n°1 des pieces auto » devient « La marketplace des pieces auto » (FR/EN)
- `src/lib/i18n.ts` (meta footer) : « La premiere plateforme ERP Marketplace... » devient « La marketplace ERP de pieces detachees automobiles... »
- Les 10 pays et les marques possibles restent listes (tiroir sur le marche cible, pas un chiffre d'inventaire)

**Impact** : `src/components/LandingPage.tsx`, `src/components/Footer.tsx`, `src/lib/i18n.ts`, `docs/DECISIONS.md`. Lint/typecheck/275 tests verts.

## D29 : Alignement des tokens CSS sur le design system (`04-DESIGN-SYSTEM.md`)

**Contexte** : audit `globals.css` (bloc `:root`) vs `04-DESIGN-SYSTEM.md` (source de verite visuelle, `AGENTS.md`). Le bloc `:root` divergeait des tokens documentes : `--color-success` `#059669` (doc `#10B981`), `--color-danger` `#DC2626` (doc `#EF4444`), pas de `--color-info` (`#3B82F6`), pas de tokens `*-hover` (`primary-hover #E85A25`, `secondary-hover #162D4A`), pas des neutres gray, pas de `--radius-full`, et shadows/radii avec des valeurs soust-communiquees.

**Decision** : realigner `src/app/globals.css` (`:root`) sur `04-DESIGN-SYSTEM.md` : `success #10B981`, `danger #EF4444`, ajout `info #3B82F6`, ajout `--color-primary-hover #E85A25` et `--color-secondary-hover #162D4A`, ajout des neutres (`white`, `gray-50/100/200/300/500/700/900`), alignement des `shadows` et `radii` (sm .375rem, md .5rem, lg .75rem, xl 1rem, full 9999px) et `shadow-2xl`. Les tokens d'extension de marque (earth/sahel/`accent`, `bg-warm`, `primary-light/dark`, `secondary-light`, `shadow-glow/warm`) sont conserves comme jeu supplementaire. Aucun composant ne consomme ces variables (le style passe par les utilitaires Tailwind et hex inline) : changement sans impact visuel, uniquement de coherence des tokens pour le CSS/CSS cite.

**Divergence documentee (volontaire, non corrigee)** : `04-DESIGN-SYSTEM.md` definit `background`/`card-bg` `#FFFFFF` alors que le `body` utilise une surface chaude `#FFF8F0` (`--color-bg`) — peau « warm/earth » de la marque, coherente avec les `text-[#2D1B0E]`, `#8B4513`, `#FF6B35` utilises dans les composants. Conservee ; raccordement effectue ici sur le perimetre des tokens de couleur fonctionnementnels (success/danger/info/hover), pas sur le fond.

**Impact** : `src/app/globals.css`, `docs/DECISIONS.md`.

## D30 : Palette chaude de marque – tokens CSS + migration des composants (zero changement visuel)

**Contexte** : audit CSS (`04-DESIGN-SYSTEM.md` vs code). Le mode marketplace utilise une palette « chaude/warm » (`#2D1B0E`, `#9A8A7A`, `#E8DDD0`, `#FEF3E2`, `#FFBA08`, dégradés orange...) absente du design system, et `--color-primary-hover` documentait une valeur (`#E85A25`) jamais utilisee dans le code (le vrai hover utilise partout est `#E85D04`). Decision arrete avec le mentor : figer cette palette en tokens officiels et migrer les composants, SANS aucun changement de valeur pour preserver le rendu.

**Decision** :
- `globals.css` : corriger `--color-primary-hover` `#E85A25` → `#E85D04` ; ajouter dans `:root` les tokens warm : `--color-warm-ink #2D1B0E`, `--color-warm-muted #9A8A7A`, `--color-warm-muted-strong #6B5B4E`, `--color-warm-faint #4A3728`, `--color-warm-border #E8DDD0`, `--color-warm-navy-deep #0A1929`, `--color-warm-slate #0F2744`, `--color-warm-teal #00C9A7`, `--color-warm-red #D00000`, `--color-orange-hover #FF5520` (reunissant les alias existants `accent`/`accent-warm`/`primary-dark`/`bg-warm`)
- `docs/04-DESIGN-SYSTEM.md` : corriger `--color-primary-hover` ; ajouter la section « Palette chaude (mode marketplace, marque AutoAfrique) » et une section « Couleurs de marques tierces (hors tokens) » (Orange Money `#FF6600`, MTN `#FFCC00`, Wave `#00B4D8`/`#0066CC`, Visa `#1A1F71`, Mastercard `#EB001B`, Facebook `#1877F2`, WhatsApp `#25D366`) qui DOIVENT rester en literal dans le code (couleurs de marque, pas des tokens internes)
- Migrer 13 composants (`ProductCard`, `Header`, `Footer`, `LandingPage`, `CarSelector`, `PartsCatalog`, `BrandGrid`, `CTASection`, `NewsletterSignup`, `PromoBanner`, `PricingTable`, `TestimonialCarousel`, `SocialProof`) des hex en dur vers `var(--color-*)`, valeurs strictement identiques. Les couleurs tierces du `Footer` restent literales
- Tailwind v4 : les classes arbitraires `bg-[var(--color-primary)]/40` compilent nativement (emission `color-mix(in oklab, var(--color-primary) 40%, transparent)`) et vérifie via la CSS buildée

**Contrainte AGENTS.md** : les pages fonctionnelles dashboard (`crm`, `page`, `profile`, `settings`, `not-found`, `error`) utilisant aussi des hex warm/tierces restent volontairement non migrees dans cette iteration (prudence : pages metier + couleurs tierces) ; a voir en iteration suivante.

**Impact** : `src/app/globals.css`, `docs/04-DESIGN-SYSTEM.md`, `src/components/*.tsx` (13), `src/components/WhatsAppIntegration.tsx` (suppression d'un numero de support factice, cf. D28). Lint/typecheck/275 tests/build OK.
- **Complement (meme iteration)** : migration des pages fonctionnelles du dashboard (`crm`, `page`, `profile`, `settings`, `not-found`, `error`) vers les memes tokens (`#E85D04`→`--color-primary-dark`, `#D00000`→`--color-warm-red`, `#FF6B35`→`--color-primary`), pixel-identique. `#E85A25` (hover de `not-found`/`error`) n'a pas de token correspondant (distinct de `#E85D04`) : conserve en literal. Les couleurs de marques tierces restent en literal. Lint/typecheck/275 tests/build OK.

## D31 : Câblage client du tracking (evenements de page + auth), aligne sur `09-TRACKING.md`

**Contexte** : `09-TRACKING.md` documente des evenements (page_view, scroll_depth, time_on_page, et auth login/register/logout). Verifie : la whitelist backend (`TRACKABLE_EVENTS`) couvrait deja les 24 evenements, mais le câblage client ne declarcherait pas `scroll_depth`, `time_on_page` ni `login`/`register`/`logout` (seul le marketplace declenchait `page_view`, et quelques evenements marketing/commande). C'est un manque de conformite au cahier des charges.

**Decision** :
- Creer `src/components/TrackingProvider.tsx` (client, ajoute au layout racine) : déclenche `page_view` a chaque changement de route, `scroll_depth` a 25/50/75/100 %, et `time_on_page` (duree en secondes) au changement de route et au demontage. Utilise `usePathname` + effets ; init des refs dans les effets (pas de `Date.now()` au rendu, conformite `react-hooks/purity`)
- Retirer le `trackPageView` manuel du marketplace (`page.tsx`) pour eviter un doublon (le provider global couvre desormais `page_view`)
- Brancher les evenements auth documentes : `login` (method email) dans `login/page.tsx`, `register` (role, country) dans `register/page.tsx`, `logout` dans `DashboardTopBar.tsx`
- Ajouter `src/components/TrackingProvider.test.tsx` (jsdom, mock `next/navigation` + `@/lib/tracking`, 3 tests : page_view, scroll_depth, time_on_page)

**Resultats** : 278 tests (275 + 3). Lint (purity fixe), typecheck, build OK. Couverture 84.79/72.42/89.18/89.33 (seuils ok).

**Impact** : `src/components/TrackingProvider.tsx` (+ test), `src/app/layout.tsx`, `src/app/auth/login/page.tsx`, `src/app/auth/register/page.tsx`, `src/components/DashboardTopBar.tsx`, `src/app/dashboard/marketplace/page.tsx`, `docs/DECISIONS.md`.

## D32 : Correction des erreurs d'images distantes (`17-IMAGES-MEDIA` / `21-PERFORMANCE`)

**Contexte** : `npm run test:e2e` et le serveur dev affichaient `upstream image response failed for https://upload.wikimedia.org/.../Toyota.svg/200px-Toyota.svg.png 400` (proxy Next/Image bloqué par Wikimedia sur les SVG) et `404` sur des URLs Unsplash inexistantes ; un warning LCP demandait `loading="eager"` + dimensions sur l'image ci-dessus la fold. Aucune image `image.png` n'existe dans le code : l'erreur portait sur l'optimisation des images à distance.

**Decision** :
- Créer `src/components/RemoteImage.tsx` (wrapper client) : `unoptimized` par défaut pour toute source `http(s)` (contourne le proxy → Wikimedia 200, plus de 400), `onError` → retombe sur `/logo.png` local (asset généré D20) pour tout 404/400 résiduel, et transmet toutes les props (`fill`/`sizes`/`width`/`height`/`className`/`loading`/`priority`/`alt`/`style`)
- Remplacer `<Image>` → `<RemoteImage>` sur les 10 fichiers consommant une source distante (BrandGrid, PromoBanner, ProductCard, PartsCatalog, TestimonialCarousel, `dashboard/marketplace`, `vehicles`, `cart`, `page`, `crm`) ; `ImageUpload.tsx` garde `next/image` (sources locales `/uploads/` → optimisation conservée)
- LCP : propagation de `priority` (→ `loading="eager"`) sur le premier `ProductCard` des best-sellers LandingPage (image ci-dessus la fold)

**Resultats** : 4 E2E passent ; **les erreurs `upstream image response failed 400/400` ont disparu** (Wikimedia/Unsplash/flagcdn ne passent plus par le proxy). Lint, typecheck, 278 tests, build OK. Il reste des warnings dev perf (aspect-ratio / `eager` sur l'image hero du dashboard) — à traiter dans une itération `21-PERFORMANCE` dédiée ; le rendu pixel reste identique.

**Impact** : `src/components/RemoteImage.tsx` (nouveau), `src/components/{BrandGrid,PromoBanner,ProductCard,PartsCatalog,TestimonialCarousel}.tsx`, `src/app/dashboard/{marketplace,vehicles,cart,page,crm}/page.tsx`, `src/components/LandingPage.tsx`, `docs/DECISIONS.md`.

## D33 : Compte unifie acheteur/vendeur (`sellerEnabled` + `SellerProfile` fusionne)

**Contexte** : le produit vise un modele hybride (Leboncoin × Autodoc) : un particulier achete ET vend (ex. revente de pieces recuperees) depuis le meme compte, sans compte "pro" separe. Or le systeme existant reposait sur `User.role` (SELLER/BUYER) avec une inscription forçant un choix de type de compte ("Vendeur / Garagiste" + "Nom de la boutique"), et un `SellerProfile` oriente pro/garagiste (`businessName`, `rcNumber`, `taxId`, `verified`, `certifications`).

**Decision** :
- Ajouter `User.sellerEnabled` (`Boolean @default(false)`) : la vente est activable a tout moment depuis "Mon compte", pas choisie a l'inscription. Le formulaire d'inscription est reduit aux infos de base (nom, email, telephone, pays, mot de passe) — suppression du selecteur de role et du champ "Nom de la boutique".
- **Fusion dans le `SellerProfile` existant** (pas de doublon) : ajout de `displayName`, `city`, `phoneForOrders`, `payoutMethod`, `payoutNumber` (enum `PayoutMethod` : `ORANGE_MONEY`, `MTN_MOMO`, `WAVE`). Les champs pro/garagiste restent optionnels et intacts. Le profil n'est cree qu'a l'activation.
- **`role` conserve** : `role` reste le mecanisme RBAC (defaut `BUYER`, pas modifie a l'activation) ; `sellerEnabled` pilote l'etat UI vendeur. Les deux coexistent, sans changement des guards/tokens existants.
- Activation : `POST /api/v1/seller/activate` (auth) → `sellerEnabled=true` + `SellerProfile` (upsert) ; lecture `GET /api/v1/seller/profile` ; maj `PUT /api/v1/seller/profile`. `GET /api/v1/auth/me` expose desormais `sellerEnabled` et `sellerProfile`.
- UI : page "Mon compte" (`/dashboard/profile`) avec deux blocs — **Espace Acheteur** (toujours actif : infos perso, commandes, vehicules) et **Espace Vendeur** (etat vide clair "Vous n'avez pas encore active la vente" + CTA "Vendre sur AutoAfrique" → mini-formulaire nom/ville/telephone/paiement).
- Schema applique : `schema.prisma` + `src/lib/schema.sql` et `prisma/schema.sql` (ALTER TABLE idempotents pour les bases existantes) + dev.db.
- Gestion des annonces vendeur non incluse : module de publication d'annonces = tache separee (les routes produits/vehicles existantes restent independantes du statut vendeur).

**Resultats** : lint, typecheck, 281 tests (275 existants + 6 nouveau service seller), build de production OK. Aucune regression sur l'inscription (API register accepte toujours `role`/`shopName` en optionnel pour retrocompatibilite) ni sur l'espace acheteur (vehicles/orders inchanges).

**Impact** : `prisma/schema.prisma`, `prisma/schema.sql`, `src/lib/schema.sql`, `dev.db`, `src/modules/seller/*` (nouveau service + DTO + tests), `src/app/api/v1/seller/{activate,profile}/route.ts` (nouveaux), `src/modules/auth/auth.service.ts`, `src/app/auth/register/page.tsx`, `src/app/dashboard/profile/page.tsx`, `src/shared/types/index.ts`, `docs/{02-ROUTES,03-PAGES,10-AUTHENTIFICATION,12-MARKETPLACE,18-DATABASE,19-API,09-TRACKING,DECISIONS}.md`.

## D34 : Retour de la selection de role a l'inscription (acheteur/vendeur)

**Contexte** : demande produit : choisir « Acheteur » ou « Vendeur » directement a la creation de compte, sur la meme page.

**Decision** :
- Ajouter un selecteur de role (cartes « Acheteur » / « Vendeur ») sur `/auth/register`. « Vendeur » envoie `role=SELLER` a `POST /api/v1/auth/register` (deja supporte par le DTO/service) ; l'utilisateur est vendeur des l'inscription (RBAC).
- `sellerEnabled` et le `SellerProfile` restent pilotes par « Mon compte » (`POST /api/v1/seller/activate`) : l'inscription ne cree pas de `SellerProfile` (le formulaire ne collecte pas les donnees boutique).
- **Contradiction avec D33 et `10-AUTHENTIFICATION.md` (lignes 52/77) resolue** : le choix de type de compte revient a l'inscription ; le reste du modele unifie (`sellerEnabled` + `SellerProfile` fusionne) est conserve.

**Resultats** : lint, typecheck, build de production OK. Aucun changement backend (register accepte deja `role`).

**Impact** : `src/app/auth/register/page.tsx`, `src/lib/i18n.ts`, `docs/{10-AUTHENTIFICATION,03-PAGES,09-TRACKING,DECISIONS}.md`.

## D35 : Refonte accueil/layout — groupe 1 « liens légaux et de confiance »

**Contexte** : le footer et quelques composants de la landing contenaient des liens factices (`href="#"`) vers des pages légales/confiance inexistantes, des icônes réseaux sociaux sans compte réel, des transporteurs génériques (DHL/UPS/GLS/Chronopost) non contractualisés, et un lien « Contactez-nous » mort dans le sélecteur de véhicule. Regle « aucune fausse preuve » (`AGENTS.md`) et demande utilisateur : créer de vraies pages et retirer l'information trompeuse.

**Decision** (groupe 1, commit séparé) :
- Créer un layout public partagé `src/app/(public)/layout.tsx` (Header + Footer) et 10 routes publiques (R023-R032 dans `02-ROUTES.md`) : `/a-propos`, `/conditions-generales`, `/politique-de-confidentialite`, `/aide`, `/paiement`, `/livraison`, `/contact`, `/retours`, `/blog`, `/manuels-reparation`.
- Composant serveur réutilisable `src/components/LegalPage.tsx` (titre, date de mise à jour, blocs-section) ; les documents à teneur légale (`conditions-generales`, `politique-de-confidentialite`) affichent un warning « gabarit rédigé pour présenter la structure, à faire relire par un juriste avant mise en production ».
- Contact : `src/components/ContactForm.tsx` ouvre la messagerie (mailto) vers une adresse de support **provisoire**, affichée explicitement comme « à confirmer avant la mise en production » + page `/contact` sans téléphone/coordonnées inventés.
- Footer : liens `#` remplacés par les vraies routes ; retrait des 3 icônes réseaux sociaux (FB/X/IG) et du bloc Appli Mobile/YouTube/Instagram ; retrait de « Programme Bonus » ; transporteurs remplacés par « Livraison locale partenaire ».
- `CarSelector.tsx` : lien « Contactez-nous » `#` → `/contact`.
- SEO/indexation : sitemap étendu (13 URLs), `robots.ts` inchangé (`Allow: /` couvre les nouvelles routes racine), `02-ROUTES.md`, `03-PAGES.md` (modèle « Page informationnelle »), `06-SEO.md` (métadonnées R023-R032), `07-CRAWL-INDEXATION.md` (sitemap + listes).

**Contradiction signalée** : `07-CRAWL-INDEXATION.md` listait uniquement 3 pages indexables alors que `02-ROUTES.md` (source de vérité des routes, `AGENTS.md`) documente désormais les nouvelles pages publiques indexables. Résolue en faveur de la matrice : toutes les pages « index / sitemap oui » (R023-R032) sont ajoutées au sitemap et au document.

**Impact** : `src/app/(public)/layout.tsx` (nouveau), `src/app/(public)/{a-propos,conditions-generales,politique-de-confidentialite,aide,paiement,livraison,contact,retours,blog,manuels-reparation}/page.tsx` (10 nouveaux), `src/components/{LegalPage,ContactForm}.tsx` (nouveaux), `src/components/{Footer,CarSelector}.tsx`, `src/app/sitemap.ts`, docs `{02-ROUTES,03-PAGES,06-SEO,07-CRAWL-INDEXATION,DECISIONS}.md`. Effacer `check-db.cjs` (fichier temporaire) avant commit. Lint/typecheck/tests/build à valider.

## D36 : Refonte accueil/layout — groupe 2 « routes SEO par marque/catégorie »

**Contexte** : la home (PartsCatalog, BrandGrid), le footer (colonne Produits) et le header (navigation catégories) pointaient les catégories et marques vers `/dashboard/marketplace` sans URL dédiée indexable. Demande utilisateur : créer des pages SEO par catégorie et par marque avec titres uniques mentionnant Abidjan, H1 cohérents, et filtrer le catalogue existant. Slugs demandés explicitement (12 catégories, 13 marques).

**Decision** (groupe 2, commit séparé) :
- Créer `src/lib/marketplace-catalog.ts` (source de vérité du mapping slug → libellé → filtre) : `CATEGORY_SLUGS` (12) et `BRAND_SLUGS` (13) avec `name`, `description` (« aucun faux chiffre »), et helpers `resolveCategory`/`resolveBrand`.
- Routes serveur dynamiques sous `(public)` pour reutiliser le layout Header+Footer : `src/app/(public)/marketplace/categorie/[slug]/page.tsx` (R033-R044) et `src/app/(public)/marketplace/marque/[slug]/page.tsx` (R045-R057). `export const dynamic = 'force-dynamic'` (réflètent le catalogue au moment de la requête), `generateMetadata` (titre + description + canonical, mentionnent Abidjan), `notFound()` (HTTP 404) pour slug inconnu, filtre via `productsService.list({ category: slug })` / `list({ brand: name })`.
- Composant serveur réutilisable `src/components/CatalogPage.tsx` : fil d'Ariane, H1 « Pièces détachées {X} à Abidjan », description, décompte, grille `ProductCard`, état vide honnête « Catalogue en cours de préparation », CTA vers `/dashboard/marketplace`.
- Mise à jour des liens : `PartsCatalog` et `BrandGrid` (homepage), `Footer` (colonne Produits → routes catégorie), `Header` (navigation catégories → routes catégorie les plus proches). Footer converti de `<a>` à `<Link>` (`next/link`) pour satisfaire `@next/next/no-html-link-for-pages`.
- Sitemap étendu (25 URLs SEO) ; `robots.ts` inchangé (`Allow: /` couvre `/marketplace/*`).
- Docs : `02-ROUTES.md` (R033-R057), `15-CATALOGUE.md` (slug catégorie = filtre slug ; brand slug → nom pour le filtre), `06-SEO.md`, `07-CRAWL-INDEXATION.md`, `DECISIONS.md`.

**Divergence documentée** : le filtre API produits s'applique sur `brand = nom exact` (pas slug) et sur `category = slug`. Les URLs SEO utilisent les slugs demandés (`mercedes-benz`, `citroen`) ; chaque slug de marque est mappé au nom attendu par le service (ex. `mercedes-benz` → `Mercedes-Benz`, `citroen` → `Citroën`). Le mapping est centralisé dans `marketplace-catalog.ts`.

**Limite** : la base n'est pas seedée (Catégorie/Marque vides) → les pages affichent l'état vide mais sont indexables avec H1/meta corrects ; elles refléteront les pièces dès qu'un seed peuplera le catalogue.

**Resultats** : lint OK, typecheck OK, tests OK (287), build de production OK. Vérification runtime : `/marketplace/categorie/pneus-jantes` et `/marketplace/marque/toyota` → HTTP 200 ; `/marketplace/categorie/inconnu` → HTTP 404. Migration des liens `<a>` → `<Link>` dans le footer validée par lint.

**Impact** : `src/lib/marketplace-catalog.ts` (nouveau), `src/app/(public)/marketplace/{categorie,marque}/[slug]/page.tsx` (nouveaux), `src/components/{CatalogPage,Footer,Header,PartsCatalog,BrandGrid}.tsx`, `src/app/sitemap.ts`, docs `{02-ROUTES,06-SEO,07-CRAWL-INDEXATION,15-CATALOGUE,DECISIONS}.md`.

## D37 : Refonte accueil/layout — groupe 3 « contenus manquants/factices »

**Contexte** : la home affichait des contenus factices ou trompeurs : « Meilleures ventes » basé sur `sortBy=salesCount` sans ventes réelles en base (squelettes de chargement infinis), bannières promo inventées (« Jusqu'à -60 % », « Parrainez un ami, gagnez 5 000 FCFA », « Livraison gratuite dès 50 000 FCFA ») et « Téléchargez l'appli AutoAfrique » (appli inexistante, CTA « Télécharger » actif), le tout illustré par des images distantes Unsplash non validées.

**Decision** (groupe 3) :
- `PromoBanner` : suppression de toutes les images distantes (`RemoteImage`, Unsplash) et des offres inventées ; remplacement par 4 slides neutres et véridiques — catalogue, « Application mobile bientôt disponible » (CTA inactif, `<span>` non cliquable), paiement Mobile Money (Orange Money, MTN MoMo, Wave), livraison 24-72h. Intervalles de rotation 5 s, boutons de navigation avec `aria-label`.
- `Bestsellers` : composant neutralisé — retourne `null` avec TODO. Raison : pas de données de vente fiables (`salesCount`) ni d'images validées ; afficher des squelettes infinis ou des pièces imaginaires violerait « aucun faux chiffre / aucune image trompeuse ». Réactivable quand un seed peuple des produits avec ventes réelles et images conformes à `17-IMAGES-MEDIA.md`.
- Restent hors périmètre Groupe 3 : les images Unsplash de `PartsCatalog` (vignettes catégories) et des pages dashboard internes (placeholders produits), à traiter dans un lot dédié.

**Resultats** : lint OK, tsc OK, tests OK (287), build de production OK. Aucune image distante Unsplash restante dans `PromoBanner` ni `Bestsellers`.

**Impact** : `src/components/{PromoBanner,Bestsellers}.tsx`, `docs/{03-PAGES,DECISIONS}.md`.

## D38 : Refonte accueil/layout — groupe 4 « nettoyage footer »

**Contexte** : vérifier qu'il ne reste aucun transporteur générique (DHL, UPS, GLS, Chronopost, FedEx) dans le footer ni dans le site public, après la refonte du Groupe 1.

**Decision** (groupe 4 — vérification, aucun changement de code) :
- Scan `src/components/Footer.tsx` + `src/app/(public)/*` + `LandingPage.tsx` : aucun transporteur générique (le footer affiche « Livraison locale partenaire » depuis D35) et aucun résidu Lorem Ipsum. `rg -i` pour DHL/UPS/GLS/Chronopost/FedEx/lorem : 0 occurrence sur le site public.
- Le module `delivery` traite `carrier` comme un champ libre (pas d'enum hardcodé) ; les exemples « DHL123… » / « dhl / local / gabriel… » sont des placeholders du dashboard interne (`dashboard/delivery`), hors périmètre footer, et n'affirment aucun partenariat transporteur. Suivi facultatif : neutraliser ces exemples dans un lot dédié si on veut éviter toute suggestion de transporteur réel.

**Resultats** : footer et site public exempts de transporteurs génériques et de faux contenus ; lint/tsc/tests/build inchangés (aucune modification de code).

**Impact** : aucun fichier de code ; `docs/DECISIONS.md` (D38).

## D39 : Refonte accueil/layout — suite « images distantes et contenus factices restants »

**Contexte** : les groupes 3 et 4 ont laissé des résidus documentés comme suivi facultatif : images Unsplash dans `PartsCatalog` (homepage, vignettes catégories dupliquées), placeholders produits Unsplash dans les pages dashboard (`marketplace`, `vehicles`, `page`), faux compteurs de pièces dans `BrandGrid` (« 12,400+ », « 2,200+ »… présents dans les données, non affichés), et exemples « DHL123… » / « dhl / local / gabriel… » dans le formulaire du dashboard delivery. Consigne utilisateur : corriger puis poursuivre.

**Decision** (groupe 5 — nettoyage des résidus) :
- Créer `public/images/placeholder.svg` : placeholder local neutre (silhouette véhicule, palette du design system), seule source d'image de repli. Aucune image distante.
- `PartsCatalog` : suppression des vignettes Unsplash → dégradés de la palette + icône pignon (SVG inline), conservant l'identité par catégorie sans fausse preuve visuelle.
- `BrandGrid` : suppression des faux compteurs de pièces (données non affichées mais trompeuses). Les logos Wikimedia (logos officiels de marques, sources stables) sont conservés : ce sont des marques réelles, pas une preuve inventée.
- Pages dashboard `marketplace`, `vehicles`, `page` : les `partImages`/`DEFAULT_IMAGE` Unsplash sont remplacés par le placeholder local (`/images/placeholder.svg`).
- Dashboard `delivery` : placeholders neutralisés (« Ex : 1234-5678... », « Ex : partenaire / local... ») — plus aucune suggestion de transporteur générique (DHL). Les données de test du module `delivery.service.test.ts` (`carrier: 'dhl'`, recherche « DHL ») sont conservées : fixtures internes du champ libre `carrier`, sans impact utilisateur.
- Le module `delivery` garde `carrier` comme champ libre (aucun enum) ; aucune règle métier modifiée.

**Resultats** : plus aucun URL Unsplash dans le code source (seulement la mention dans les commentaires d'explication) ; plus de transporteur générique dans le contenu visible ; lint OK, tsc OK, tests OK (287), build OK. Runtime : `/` → HTTP 200 avec vignettes catégories, `has-unsplash: false`, `/images/placeholder.svg` → 200 `image/svg+xml`.

**Impact** : `public/images/placeholder.svg` (nouveau), `src/components/{PartsCatalog,BrandGrid}.tsx`, `src/app/dashboard/{marketplace,vehicles,delivery,page}.tsx`, `docs/{03-PAGES,DECISIONS}.md`.

## D40 : Nettoyage des canaux de contact factices (dashboards + chatbot + widget WhatsApp)

**Contexte** : poursuite des consolidations D35/D39 — les canaux de contact « live » du dashboard et du chatbot étaient illustrés par des numéros/emails composables inventés (`+22507080910`, `support@autoafrique.com`, `support@autoafrique-saas.vercel.app`). Consigne utilisateur : aucun canal composable factice ne doit être exposé ; remplacer par un état honnête « à confirmer avant la mise en production ».

**Decision** :
- **Aucun numéro/email composable factice** n'est plus exposé nulle part. Tous les `wa.me/<numéro>`, `mailto:<adresse invente>`, `tel:<numéro factice>` hardcodés sont supprimés du code source (sauf fixtures de tests internes, sans impact utilisateur).
- `ChatBot.tsx` : plus de faux catalogue (recherches de véhicules/pièces inventés, images démo) ; le chatbot fait désormais référence aux pages réelles du site (contact, paiement, FAQ) et bascule vers la page `/contact` pour toute demande de contact — aucun numéro de téléphone inventé.
- `WhatsAppIntegration.tsx` : suppression du chat démo et du numéro composable ; état honnête « canal en cours de mise en place — les coordonnées seront confirmées avant la mise en production ».
- `ContactForm.tsx` : suppression du `mailto:` vers l'adresse provisoire ; à la soumission, message honnête « le canal d'assistance officiel est en cours de mise en place — les coordonnées seront confirmées ».
- Dashboard `help` (`/dashboard/help`) : les blocs WhatsApp/Email deviennent des panneaux non-cliquables « coordonnées à confirmer » (fini `wa.me/22507080910` et `mailto:support@autoafrique.com`).
- Dashboard `marketplace` (fiche produit) : boutons 📞/💬 uniquement si `seller.phone` existe (donnée réelle du vendeur) — suppression du numéro de repli factice `+22507080910`. Le CRM utilise déjà les `phone`/`email` réels des leads (aucun fallback factice).
- Exception conservée : la constante de page `(public)/contact` et le CRM appellent les données réelles des utilisateurs/leads ; aucune invention.

**Resultats** : scan `rg` des canaux composables (`wa.me/[0-9]`, `tel:+[0-9]`, `mailto:<email>`) : plus aucune occurrence factice dans `src` (reste uniquement la fixture du test providers `+22507080910`, interne). Lint global OK, tsc OK (`===TSC:0===`), build de production OK.

**Impact** : `src/components/{ChatBot,WhatsAppIntegration,ContactForm}.tsx`, `src/app/dashboard/{help,marketplace}.tsx`, `docs/{03-PAGES,DECISIONS}.md`.

## D41 : Alignement de la politique de retour sur 30 jours + retrait de la certification auto-inventée

**Contexte** : audit « contenus factices » (suite de D40) — la politique de retour était contradictoire sur 4 emplacements : page d'accueil « Retour 200 jours / Satisfait ou remboursé », `docs/03-PAGES.md` (source de vérité) « Retour 30 jours », page `/retours` « 7 jours », badge panier « Retour gratuit ». Par ailleurs, `AgentNetwork` affichait des agents de dépôt inventés (noms, adresses, notes 4.x, badges « Vérifié ») alors qu'aucun réseau d'agents n'est documenté (`11-MOBILE-MONEY.md` ne mentionne aucun agent), et `VehicleInspection` octroyait un badge « Véhicule Certifié AutoAfrique » dès 80 % de checklist remplie, sans condition de qualité réelle (fausse certification).

**Decision** (validée par l'utilisateur) :
- **Politique de retour = 30 jours** partout : accueil (`LandingPage` « Retour 200 jours » → « Retour 30 jours »), badge panier (« Retour gratuit » → « Retour 30 jours »), pages `/retours` et `/aide` (« 7 jours » → « 30 jours »), meta description `/retours` de `docs/06-SEO.md`. Source de vérité appliquée : `03-PAGES.md` (lignes 716/848).
- `AgentNetwork` : suppression complète de la liste d'agents fictifs, des notes, des distances et des badges « Vérifié » ; état honnête « réseau en cours de déploiement — les points de dépôt seront annoncés avant la mise en production » (les étapes « comment ça marche » sont conservées, non trompeuses).
- `VehicleInspection` : retrait du badge « Véhicule Certifié AutoAfrique » et de « Inspecté et vérifié » ; titre neutralisé en « Inspection Véhicule AutoAfrique » ; la checklist et le score restent un outil de notation interne honnête (saisie manuelle).
- Le libellé de support « Lun-Ven 8h-20h » (accueil) est conservé : promesse plus prudente que la doc (« Support 7j/7 »), aucun risque de sur-promesse — non aligné pour ne pas étendre la portée.

**Resultats** : plus aucun agent, note ou certification inventé dans le code source ; politique de retour univoque « 30 jours » dans le code et la doc. Lint OK, tsc OK.

**Impact** : `src/components/{LandingPage,AgentNetwork,VehicleInspection}.tsx`, `src/app/dashboard/cart/page.tsx`, `src/app/(public)/{retours,aide}/page.tsx`, `docs/{06-SEO,DECISIONS}.md`.

## D42 : Neutralisation des onglets paiement « Transfrontalier » et « Paiement différé » (conditions financières inventées)

**Contexte** : suite de D40/D41 — la page `/dashboard/payments` proposait 8 onglets. La source de vérité `11-MOBILE-MONEY.md` ne documente que les moyens de paiement, le cycle de paiement, le flux USSD (`ussdCode`) et le simulateur V1 (D7). Trois onglets affichaient des règles métier **non documentées** : « Transfrontalier » (taux de change codés en dur CI-SN/NG/GH, « Frais: 0.5% », « Min. 500 FCFA », « 1:1 Zone UEMOA », règlement via PAPSS) et « Paiement différé » (taux 2,5 %–4,5 %/mois, intérêts calculés à 3,5 %).

**Decision** :
- `CrossBorderPayments.tsx` : suppression de tous les taux de change codés en dur, des frais (0,5 %), du badge « 1:1 Zone UEMOA » et des allégations PAPSS ; état honnête « service en cours de mise en place — pays, frais et taux seront confirmés avant la mise en production ».
- `InstallmentPlan.tsx` : suppression des taux 2,5–4,5 %/mois et du calculateur d'intérêts ; état honnête « paiement en plusieurs fois en cours de mise en place — taux, apport, durées à confirmer ». API du composant conservée (les imports de la page paiements restent valides).
- Conservés sans modification : onglet « Séquestre » (filtré sur de vraies données `status === HELD`, état vide honnête), onglet « USSD » (simulateur clavier — conforme à D7/V1), « Historique » (données réelles), « Agents »/« WhatsApp »/« Inspection » (déjà neutralisés D40/D41).
- Aucune règle métier n'est inventée : tout ce qui n'est pas documenté est désormais affiché comme « à confirmer avant la mise en production ».

**Resultats** : plus aucun taux/frais/condition financière inventé dans la page paiements. Lint OK, tsc OK.

**Impact** : `src/components/{CrossBorderPayments,InstallmentPlan}.tsx`, `docs/DECISIONS.md`.

## D43 : Verrouillage du seed de développement (données fictives — dev uniquement)

**Contexte** : audit permettait de confirmer que `prisma/seed.mjs` (commandé par `npm run db:seed`) injecte une **entreprise entièrement fictive** : 3 faux vendeurs/utilisateurs (dont le numéro `+22507080910`), 50+ faux produits (avec `salesCount` et `views` aléatoires), 10 faux véhicules, 7 faux fournisseurs, commandes, finances, expéditions, ~100 événements `AnalyticsEvent`, 11 avis. Ces données violent « aucun faux client » et « aucun faux chiffre » (AGENTS.md). C'est un outil de dev : aucune référence dans `23-DEPLOIEMENT.md` ni dans les scripts de build ; seule entrée = `package.json.dependencies` → `db:seed`.

**Decision** :
- Le seed reste un **outil de développement local** (les dashboards sont peuplés pour la démo), mais il est **verrouillé contre toute exécution involontaire sur une base distante/production**.
- Ajout d'un garde-fou en tête de `prisma/seed.mjs` : si `DATABASE_URL` cible une base distante (`libsql://` ou `wss://`), le script **refuse de s'exécuter** (`process.exit(1)`) et affiche un message explicite, sauf si la variable `SEED_ALLOW_REMOTE=1` est définie (réservée aux environnements non-prod voulus). En local (`dev.db`, better-sqlite3) le seed reste fonctionnel.
- En-tête commentaire « DEV-ONLY » : rappel que le script injecte des données fictives et ne doit jamais alimenter la production.
- Les données fictives n'apparaissent donc jamais en production ; la démo desktop (dashboard peuplé) reste possible en local.
- Rappel lié à D37 : `Bestsellers` reste désactivé (ne réactive que lorsque le seed populera des `salesCount` réels, pas avec les valeurs aléatoires actuelles).

**Resultats** : `node --check prisma/seed.mjs` OK ; lint/tsc inchangés ; aucun seed vers une base distante sans confirmation explicite.

**Impact** : `prisma/seed.mjs`, `docs/DECISIONS.md`.

## D44 : Alignement des « 10 pays » sur la liste canonique (00-VISION) + FAQ paiement

**Contexte** : trois listes « 10 pays » incompatibles existaient dans le code : `lib/structured-data.ts` (`areaServed` SEO : Gambie + Guinée, sans Nigeria), page d'accueil (Guinée-Bissau + Nigeria + Ghana), FAQ `/dashboard/help` (« Guinée » au lieu de « Guinée-Bissau »). La liste canonique est définie dans `docs/00-VISION.md` : Côte d'Ivoire, Sénégal, Mali, Burkina Faso, Niger, Bénin, Togo, Guinée-Bissau, Nigeria, Ghana (10). La FAQ d'accueil (`src/app/page.tsx`) listait par ailleurs 3 moyens de paiement alors que `11-MOBILE-MONEY.md` en documente 4.

**Decision** :
- `areaServed` (données structurées SEO) aligné sur la liste canonique : `['CI','SN','ML','BF','NE','BJ','TG','GW','NG','GH']` (Guinée-Bissau + Nigeria, sans Gambie/Guinée).
- FAQ `/dashboard/help` : « Guinée » → « Guinée-Bissau ».
- FAQ d'accueil paiement : ajout de **Moov Money** (Orange Money, MTN MoMo, Moov Money, Wave) — aligné sur la table des moyens de paiement de `11-MOBILE-MONEY.md`.
- Test unitaire `structured-data.test.ts` mis à jour en conséquence.

**Resultats** : une seule liste « 10 pays » cohérente sur tout le site (code + SEO) ; moyens de paiement complets dans la FAQ d'accueil. Lint OK, tsc OK, tests OK, build OK.

**Impact** : `src/lib/{structured-data,structured-data.test}.ts`, `src/app/page.tsx`, `src/app/dashboard/help/page.tsx`, `docs/DECISIONS.md`.

## D45 : Suppression des promos, tarifs et données commerciales inventés

**Contexte** : l'audit « suppression de tout contenu factice » a révélé d'autres données fabriquées restantes :
- `Footer.tsx` : « Abonnez-vous et recevez 5 000 FCFA de réduction » (offre/promo inventée).
- `lib/i18n.ts` : section `pricing` non rendue mais contenant des plans et tarifs imaginaires (Starter 15 000, Pro 45 000, Entreprise 120 000 FCFA/mois, « 500 références », « 5 000 références », « illimitées », « SLA garanti », « API complète », « White-label ») et des claims fantaisistes dans les descriptions (marketplace « des milliers d'acheteurs », CRM « Intégration WhatsApp native », finance « multi-devises (FCFA, Naira, Cedi) », « prévisions de ventes basées sur l'IA »).
- `/dashboard/help` : « Notre équipe répond en moyenne sous 24 heures » (stat de réponse inventée) et numéro de téléphone support affiché `+225 07 08 09 10` (coordonnée fabriquée).
- `dashboard/vehicles/page.tsx` : boutons « Contacter sur WhatsApp » / « Contacter » rendus même sans numéro de vendeur réel.
- `auth/login` et `auth/register` : bloc « Compte de démo » affichant des identifiants de seed dev-only (`moussa@example.com` / `abdoulaye@example.com` / password123) sur des pages publiques.
- `Header.tsx` : « Livraison gratuite dès 50 000 FCFA » (seuil d'offre inventé, sans règle commerciale réelle).

**Decision** : appliquer le même traitement que D40-D42 : état honnête « à confirmer avant la mise en production » au lieu de données inventées.
- `Footer.tsx` : sous-titre de newsletter neutre (« Abonnez-vous pour suivre l'actualité AutoAfrique »), sans montant.
- `i18n.ts` (blocs FR et EN) : pricing → « À confirmer » / « Conditions à confirmer avant la mise en production » ; descriptions marketplace/CRM/finance/analytique débarrassées des claims « milliers d'acheteurs », « WhatsApp natif », « multi-devises », « IA ». La liste des codes devises (`NGN`/`GHS`) reste (définition de données, pas une affirmation).
- `/dashboard/help` : « Nos délais de réponse seront communiqués avant la mise en production. » et « Numéro officiel à confirmer avant la mise en production » (suppression du faux numéro).
- `dashboard/vehicles/page.tsx` : boutons « Contacter » / « Contacter sur WhatsApp » rendus uniquement si le vendeur possède un numéro réel (`getSeller(v)?.phone`), cohérent avec D40.
- `auth/login` et `auth/register` : suppression du bloc « Compte de démo » (identifiants de seed dev-only).
- `Header.tsx` : « Livraison gratuite dès 50 000 FCFA » → « Livraison en Afrique de l'Ouest » (aucune offre inventée).

**Resultats** : lint OK, tsc OK, tests unitaires (287) OK, build OK, tests E2E (4) OK. Aucune donnée commerciale ou du traducteur inventée ne subsiste dans le code.

**Impact** : `src/components/{Footer,Header}.tsx`, `src/lib/i18n.ts`, `src/app/dashboard/{help,vehicles}/page.tsx`, `src/app/auth/{login,register}/page.tsx`, `docs/DECISIONS.md`.

---

## D46 — Élimination des derniers indicateurs et engagements codés en dur (audit poursuivi)

**Date** : 06/08/2026 — suite de l'audit D45.

**Problème** : lors du balayage des dashboards et pages publiques, plusieurs valeurs « inventées » subsistaient alors que le reste de la page utilisait des données réelles ou des états honnêtes :

- `dashboard/analytics/page.tsx` : la carte « Revenu total » affichait `trend: '+12.5%'` codé en dur (chiffre faux, aucun calcul d'évolution de période), alors que les trois autres cartes affichaient des valeurs réelles dérivées de l'API.
- `/dashboard/help` : le toast de contact (« Nous vous répondrons sous 24h ») et le texte du formulaire (« nous vous répondrons sous 24h ») promettaient un délai de réponse non documenté, en contradiction avec le panneau « Temps de réponse » déjà neutralisé en D45.
- `(public)/livraison` : « contactez notre service client sous 24h » imposait un délai de signalement de 24h non documenté.
- `dashboard/profile` : placeholder `+225 07 00 00 00` (payout) non normalisé.

**Décision** :
- `analytics` : KPI « Revenu total » → `trend` = `« N paiements »` (compte réel des paiements COMPLETED, `paymentCount`), aucune évolution de période n'étant calculée.
- `/dashboard/help` : toast et texte du formulaire → « Nos délais de réponse seront communiqués avant la mise en production » (alignés sur le panneau Temps de réponse).
- `(public)/livraison` : suppression de l'échéance « sous 24h », formulation « contactez notre service client via la page de contact ».
- `dashboard/profile` : placeholder payout normalisé en `+225 XX XX XX XX`.

**Conservé (documenté)** : « livraison 24-72h » (présent dans `docs/00-VISION.md`, `03-PAGES.md`, `06-SEO.md`), « garantie incluse » et « occasion contrôlée inspectée/testée » (concept documenté en `06-SEO.md` et CGV).

**Résultats** : lint OK, tsc OK, tests unitaires (287) OK. Build et E2E inchangés.

**Impact** : `src/app/dashboard/{analytics,help,profile}/page.tsx`, `src/app/(public)/livraison/page.tsx`, `docs/DECISIONS.md`.

---

## D47 — Neutralisation des chiffres marketing des docs et des horaires de support affichés

**Date** : 06/08/2026 — suite de l'audit D46.

**Problème** :
- Les documents source de vérité (`00-VISION.md`, `03-PAGES.md`, `06-SEO.md`) contenaient des chiffres marketing non vérifiés, susceptibles d'être réimplémentés par un futur agent : « 85,000+ pièces », « 70% des pièces vendues sur les marchés », « la première marketplace », « les meilleurs prix », « des milliers de références », « Support 7j/7 ».
- Le code affichait des horaires de support inventés « Lun-Ven 8h-20h, Sam 8h-17h » (LandingPage, Footer, `/aide`, `/contact`), cohérents avec aucune règle commerciale réelle.

**Décision** (consigne utilisateur : neutraliser dans tous les docs) :
- `00-VISION.md` : « 70% … » → « une grande partie des pièces… » ; « 85,000+ pièces référencées » → « Catalogue de pièces détachées neuves et d'occasion contrôlée (volume communiqué avant la mise en production) » ; parcours Google : « 85,000+ pièces, livraison 24-72h » → « Des pièces neuves et d'occasion contrôlée, livraison 24-72h ».
- `03-PAGES.md` : meta description accueil alignée sur le code ; sous-titre hero et clé `landing.hero.subtitle` → « Pièces détachées neuves et occasion… » ; texte SEO bas de page réécrit sans « première marketplace », « meilleurs prix », « milliers de références » et avec 4 moyens de paiement (ajout Moov Money) ; « Support 7j/7 » → « Support (coordonnées à confirmer) ».
- `06-SEO.md` : description `/dashboard/marketplace` sans « 85,000+ pièces ».
- Code : horaires « Lun-Ven 8h-20h, Sam 8h-17h » → « horaires à confirmer avant la mise en production » (LandingPage support client, Footer, `/contact` intro + carte Horaires, `/aide` « Autre question »).

**Conservé** : specs techniques (expiration token 24h, HSTS max-age, couverture de branches >70 % de `22-TESTS.md`, ID propriété GA4, jeton de vérification GSC), figures validées (« livraison 24-72h », « retour 30 jours », « 10 pays »), et l'historique d'audit de `DECISIONS.md`.

**Résultats** : lint OK, tsc OK, tests unitaires (287) OK, tests E2E (4) OK, build OK.

**Impact** : `docs/{00-VISION,03-PAGES,06-SEO}.md`, `src/components/{LandingPage,Footer}.tsx`, `src/lib/marketplace-catalog.ts`, `src/app/(public)/{contact,aide}/page.tsx`, `docs/DECISIONS.md`.

**Complément (même itération)** : suppression des superlatifs non vérifiables restants — « au meilleur prix » → retiré dans la description de catégorie `embrayage` (`marketplace-catalog.ts`) et « à prix transparents » dans le texte SEO garagistes (`LandingPage.tsx`, FR/EN).

---

## D48 — Clarification des constantes du simulateur de paiement V1

**Date** : 06/08/2026 — audit des constantes métier (`src/modules`, `src/contexts`).

**Constat** :
- Les adaptateurs Mobile Money (`src/modules/payments/providers/*.adapter.ts`) déclarent des frais `fees = { percent: 1.0 / 1.5 / 1.8, fixed: 0 }` et `failureRate = 0.05`.
- `failureRate` (5 %) et le contrat `ProviderFee` sont **documentés** (`11-MOBILE-MONEY.md`, D7) → conservés.
- Les **pourcentages de frais spécifiques ne sont documentés nulle part** et constituent des valeurs de simulation non contractuelles. Vérification : ils ne sont **ni affichés** dans l'UI (aucune lecture de `fees.percent` hors adaptateurs/tests) **ni appliqués** au montant (`payments.service.ts` utilise `input.amount` directement).

**Décision** : aucune donnée inventée n'étant exposée, les constantes sont conservées (contrat d'adaptateur documenté, test `fees.percent > 0`). La documentation est rendue explicite : note dans `11-MOBILE-MONEY.md` (section Adaptateurs) précisant que les valeurs `fees` sont des placeholders de simulation, non contractuels, jamais affichés ni appliqués, à confirmer avec les opérateurs avant la mise en production.

**Conservé** : TVA 18 % (documentée `13-ERP.md` et DECISIONS, taux standard ivoirien), `failureRate` 5 % (D7), contrat `ProviderFee`.

**Résultats** : lint OK, tsc OK, tests unitaires (287) OK. Aucune modification de code.

**Impact** : `docs/11-MOBILE-MONEY.md`, `docs/DECISIONS.md`.

---

## D49 — Routes de pages manquantes dans la matrice (documentation)

**Date** : 06/08/2026 — vérification de conformité AGENTS.md « les routes sont définies exclusivement dans `02-ROUTES.md` ».

**Constat** : deux routes de pages fonctionnelles n'apparaissaient pas dans la matrice `docs/02-ROUTES.md` (le code les expose, le build passe, elles sont liées depuis la navigation/le SEO) :
- `/dashboard/notifications` (page Notifications, alimentée par R126/R127)
- `/dashboard/parts-search` (recherche de pièces par immatriculation/modèle, `VehiclePartsSearch`)

**Décision** : conformément à l'interdiction « ne créer aucune route non documentée » et au principe « ne supprimer aucune route sans consigne », les deux routes sont **documentées** dans `02-ROUTES.md` (nouvelles lignes R058 et R059, privées, `noindex`, hors sitemap) plutôt que supprimées. Aucune autre route du code n'est manquante (recensement code ↔ matrice vérifié : 21 pages dashboard = 19 documentées + 2 ajoutées).

**Résultats** : lint OK, tsc OK, tests (287) OK, build OK — aucune modification de code.

**Impact** : `docs/02-ROUTES.md`, `docs/DECISIONS.md`.

---

## D50 — Alignement titre SEO `/a-propos` + vérification méta/couverture

**Date** : 06/08/2026 — vérification de conformité des métadonnées (source de vérité `06-SEO.md`) et de la couverture de tests (`22-TESTS.md`).

**Constat** :
- La page `/a-propos` avait un H1 « Qui sommes-nous ? » mais un titre meta « Qui sommes-nous » — divergence avec `06-SEO.md` (l.52 « Qui sommes-nous ? | AutoAfrique »).

**Décision** :
- Titre meta `/a-propos` → « Qui sommes-nous ? » (aligné sur le H1 et la doc).
- Vérification globale des titres de toutes les routes publiques (R023-R032, accueil, marketplace, véhicules, catégories/marques) : tous cohérents avec `06-SEO.md` (les pages utilisent le template racine `%s | AutoAfrique`).

**Couverture (22-TESTS.md : branches > 70 %)** : Branches 72,25 % ✓, Statements 85 %, Functions 89,56 %, Lines 89,71 %.

**Résultats** : lint OK, tsc OK.

**Impact** : `src/app/(public)/a-propos/page.tsx`, `docs/DECISIONS.md`.

## D51 — Câblage des événements de tracking manquants (audit de conformité 09-TRACKING.md)

**Date** : 06/08/2026 — vérification de conformité du schéma de tracking (`09-TRACKING.md`) par rapport aux appels `track(...)` dans le code client.

**Constat** :
- Le module `src/lib/tracking.ts` (`track`, `trackPageView`) et le `TrackingProvider` couvrent bien les événements de page (`page_view`, `scroll_depth`, `time_on_page`).
- En revanche, 12 événements du schéma documenté n'étaient pas émis depuis l'UI :
  - landing : `search_vehicle`, `click_category`, `click_brand`, `click_cta_register`, `click_cta_login` ;
  - marketplace : `remove_from_cart` ;
  - commande : `payment_method`, `payment_success`, `payment_fail` ;
  - CRM : `lead_created`, `lead_converted`, `customer_created`.

**Décision** (câbler ce qui possède un point d'appel réel, sans inventer d'UI) :
- `search_vehicle` : les deux boutons de recherche du `CarSelector` (immatriculation et marque/modèle), avec `brand`/`model` résolus (vides si non sélectionnés).
- `click_category` : clic sur une carte catégorie de `PartsCatalog`.
- `click_brand` : clic sur une marque de `BrandGrid`.
- `click_cta_login` : lien « Se connecter » du `Header` (uniquement si l'utilisateur n'est pas connecté, `source: 'header'`).
- `click_cta_register` : **aucun point d'appel** — le CTA « Ouvrir ma boutique » n'existe pas dans l'UI (l'inscription passe par `/auth/register`, couverte par l'événement `register`). Non câblé, documenté.
- `remove_from_cart` : suppression d'un article dans `/dashboard/cart` (`product_id`).
- `payment_method` / `payment_success` : flux USSD (`UssdPaymentFlow`) — émis à la sélection d'un opérateur et à la confirmation PIN ; `payment_success` avec `order_id` (référence générée), `amount`, `method`.
- `payment_fail` : **aucun chemin d'échec** dans le flux de paiement actuel (le simulateur ne produit pas d'échec). Non câblé, documenté.
- CRM : `customer_created` (`source`) à la création d'un contact, `lead_created` (`source`) à la création d'un lead, `lead_converted` (`lead_id`, `value`) lors du passage d'un lead au statut `converted`.

**Résultats** : lint OK, tsc OK, 287/287 tests OK, build production OK.

**Impact** : `src/components/{CarSelector,PartsCatalog,BrandGrid,Header,UssdPaymentFlow}.tsx`, `src/app/dashboard/{cart,crm}/page.tsx`, `docs/DECISIONS.md`.

## D52 — Mise en conformité globale aux consignes de développement et Definition of Done (DoD)

**Date** : 07/08/2026 — audit et mise en conformité du projet par rapport aux règles de sécurité, de qualité de code, d'accessibilité et aux spécifications des 5 modèles de pages.

**Constats & Actions** :
1. **Sécurité JWT & Données** :
   - Suppression du fallback en dur `'autoafrique-secret-key-change-in-production'` dans `src/lib/auth.ts`.
   - Vérification du fichier `.env.example` et de la non-traçabilité de la base SQLite `dev.db` (`*.db` ignorés dans `.gitignore`).
2. **Qualité React 19 / Next.js 16 & TypeScript** :
   - Correction des avertissements ESLint `react-hooks/set-state-in-effect` dans `Sidebar.tsx` et `StarRating.tsx` (dérivation d'état au rendu).
   - Suppression de tous les usages de `any` dans le code métier et des variables inutilisées (`makeTxRef`, `vi`).
   - Échappement strict des entités JSX (`&apos;`) dans l'ensemble des composants et pages.
   - **Score ESLint : 0 erreur, 0 avertissement** (`npx eslint .`).
   - **Score TypeScript : 0 erreur** (`npx tsc --noEmit`).
3. **Modèles de Pages Fonctionnels** :
   - Mise en conformité des 5 modèles de pages spécifiés : Accueil (`/`), Catalogue (`/catalogue`, `/catalogue/[categorie]`), Fiche Pièce (`/pieces/[slug]`), Devenir Vendeur (`/devenir-vendeur`) et Admin (`/admin`).
   - Ajout des données structurées (`Organization`, `WebSite`, `Product`, `Offer`, `BreadcrumbList`, `FAQPage`).
   - Respect de l'accessibilité au clavier, de la réassurance Mobile Money/Gare Routière et de la traçabilité des pièces d'occasion contrôlée.
4. **Validation des Tests & Build** :
   - **Tests unitaires (Vitest)** : 341/341 tests validés (41/41 fichiers au vert).
   - **Build de production (Next.js)** : 100% de réussite sur les 97 routes de l'application.

---

## D16 : Refonte des Pages Publiques & Module Blog / À Propos / Aide / Livraison / Retours / Manuels

**Contexte** : Besoin d'aligner l'ensemble des pages publiques sur la charte graphique officielle AutoAfrique (#F97316 & Warm Navy), d'enrichir le contenu éditorial/SEO et d'ajouter des outils interactifs d'aide à la conversion (simulateur de livraison, diagnostiqueur de retours, filtres de manuels de réparation, blog avec articles complets et page À Propos).

**Décision** : Implémentation de composants réutilisables bilingues (`L(fr, en)` via `useApp`), intégration de `ArticlePageTemplate`, création de 3 articles de blog rédigés, de la page À Propos complète (3 piliers, abonnements SaaS, Mobile Money), du centre d'aide interactif (`/aide`), du simulateur de livraison 11 villes (`/livraison`), du diagnostiqueur de retour sous 48h (`/retours`) et du hub de manuels de réparation (`/manuels-reparation`).

**Impact** :
- **Complétude** : 23/23 modules de la documentation/Notion validés.
- **Performance & Compétitivité** : Build Next.js 16 (Turbopack) 100% propre (97 routes compilées, **0 erreur**).
- **Fiabilité** : **341 / 341 tests unitaires passés avec succès**.

---

## D17 : H1 de la page d’accueil, image d’en-tête des articles et fiabilisation des tests E2E

**Date** : 05/09/2026 — exécution de la chaîne de vérification complète d’`AGENTS.md` (lint, typecheck, tests unitaires, build, E2E). Lint, TypeScript, 389 tests unitaires et le build de production étaient au vert ; la suite Playwright rapportait 5 échecs sur 13.

**Contradiction relevée** : `03-PAGES.md` imposait pour `/` un H1 de marque ("AutoAfrique — Pièces Auto Marketplace Afrique de l’Ouest"), alors que `src/components/LandingPage.tsx` affiche depuis les refontes visuelles `fb1f660` puis `cadd9e5` un H1 orienté requête : "Trouvez vos pièces auto neuves & d’occasion contrôlée à Abidjan". `06-SEO.md` ne spécifie pas de H1 pour la page d’accueil : il n’y a donc pas de conflit entre documents SEO, mais un écart entre `03-PAGES.md` et le code.

**Décision** : conserver le H1 implémenté et mettre `03-PAGES.md` en conformité. Le H1 orienté requête reprend les termes du `<title>` documenté dans `06-SEO.md` ("Pièces détachées auto Abidjan, neuf & occasion") ; la marque reste portée par le `<title>`, le logo du header et `og:site_name`. Le choix a été posé délibérément à deux reprises côté code : le revenir aurait été une régression SEO non demandée.

**Correctifs applicatifs** :
1. **Hiérarchie des titres — `/estimation-devis`** : la page ne comportait aucun `h1` (le titre de tête de `RepairEstimator` était un `h2`), en violation de `05-UX-ACCESSIBILITY.md` et `06-SEO.md`. Le composant n’étant monté que par cette route, son titre de tête est promu en `h1`.
2. **Image d’en-tête des articles de blog** : les 9 articles référençaient `/images/hero-bg.jpg`, fichier absent de `public/images/` — l’optimiseur Next échouait ("isn’t a valid image"), l’image de tête ne s’affichait pas et la propriété `image` du schéma `Article` de `/blog/ou-trouver-pieces-detachees-auto-abidjan` pointait dans le vide. Chaque article est remappé vers la photographie ouest-africaine réelle correspondant à son sujet (`pieces-occasion-controlee.jpg`, `pieces-neuves-oem.jpg`, `hero-diagnostic-workshop.jpg`, `livraison-express-abidjan.jpg`, `sequestre-mobile-money.jpg`, `vtc-taxis-abidjan.jpg`), avec un texte alternatif décrivant fidèlement la photographie retenue conformément à `17-IMAGES-MEDIA.md`. Une bannière générique `og-image.png` a été écartée : elle aurait contredit les textes alternatifs spécifiques de chaque article.

**Corrections de tests** (assertions périmées, application conforme) :
- `a[aria-label*="WhatsApp"]` : le widget flottant est un `button` depuis `90cd1ad` (il ouvre le formulaire de demande express avant `wa.me`), plus un lien. Locator aligné sur le rôle `button`.
- `/tarifs` et `/blog/verifier-compatibilite-piece-auto-vehicule` : `getByText` résolvait 2 nœuds (titre + lien de sommaire ou CTA), d’où une violation du mode strict Playwright. Assertions basculées sur le rôle `heading`.
- `/` : l’assertion de marque est remplacée par l’unicité du `h1` et la présence du marqueur géographique, conformément au H1 documenté ci-dessus.

**Écart de couverture signalé (non traité)** : `22-TESTS.md` exige des tests E2E sur 4 flux critiques — inscription, achat avec paiement Mobile Money, gestion produit vendeur et CRM. Les 13 scénarios Playwright existants ne couvrent que le rendu de pages publiques ; aucun de ces 4 flux n’est testé de bout en bout.
