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
- Aligne le code sur `docs/19-SECURITY.md` (Secret : variable d'environnement JWT_SECRET)
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

**Impact** : Nouveau schema (migration), nouvelles routes `/api/v1/vehicles` et `/api/v1/vehicles/[id]`, nouvelle page annonces. Les routes sont documentees dans `03-ROUTES-MATRIX.md` et les modeles dans `11-DATA-MODELS.md`.

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

**Impact** : Nouvelles routes `/api/v1/suppliers`, `/api/v1/purchase-orders`, `/api/v1/containers`, `/api/v1/customs-records` et pages `/dashboard/suppliers`, `/dashboard/purchase-orders`, `/dashboard/containers`, `/dashboard/customs`. Routes documentees dans `03-ROUTES-MATRIX.md` (R018-R021, R136-R150). Les modules `Fournisseurs` et `Approvisionnement` (PurchaseOrder) sont construits. Restent `Conteneurs` et `Douanes`.

