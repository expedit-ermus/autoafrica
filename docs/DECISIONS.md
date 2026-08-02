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





