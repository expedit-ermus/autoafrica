# Pages et templates

## Modèle : Landing Page (`/`)

### Routes concernées
- `/`

### Objectif utilisateur
Découvrir AutoAfrique, comprendre l'offre, trouver des pièces

### Objectif commercial
Inscription vendeur/acheteur

### Action principale
"Ouvrir ma boutique gratuitement" ou "Trouver une pièce"

### Action secondaire
"Se connecter"

### Sections obligatoires
1. Header sombre avec recherche et navigation catégories
2. Hero split : Sélecteur véhicule (gauche) + Bannières promo (droite)
3. Catalogue pièces (12 catégories avec images)
4. Marques populaires (12 logos constructeurs)
5. Barre de confiance (Livraison, Paiement sécurisé, Retour, Support)
6. Best-sellers (6 produits avec prix)
7. Texte SEO
8. Footer e-commerce

### Composants
- Header (dark)
- CarSelector
- PromoBanner
- PartsCatalog
- BrandGrid
- ProductCard
- Footer

### Données attendues

| Champ | Type | Obligatoire | Source | Fallback |
|-------|------|-------------|--------|----------|
| carBrands | array | oui | i18n | aucun |
| categories | array | oui | statique | aucun |
| products | array | oui | API | aucun |
| brands | array | oui | API | aucun |

### SEO
- Un seul H1 : "AutoAfrique — Pièces Auto Marketplace Afrique de l'Ouest"
- Title : "AutoAfrique : Pièces détachées auto & Marketplace Afrique de l'Ouest"
- Meta description : "Achetez pièces détachées auto neuves et occasion à Abidjan, Côte d'Ivoire. Prix transparents, garantie incluse, paiement Mobile Money, Afrique de l'Ouest."
- URL canonique : `/`
- Données structurées : Organization, WebSite
- Fil d'Ariane : non (page d'accueil)

### Tracking
- `view_home` (vue page)
- `click_cta_register` (clic inscription)
- `click_cta_marketplace` (clic marketplace)
- `search_vehicle` (recherche véhicule)

### États
- Chargement : Skeleton
- Contenu : affiché
- Erreur : fallback gracieux

---

## Modèle : Marketplace (`/dashboard/marketplace`)

### Routes concernées
- `/dashboard/marketplace`
- `/dashboard/marketplace?category=...`
- `/dashboard/marketplace?search=...`
- `/dashboard/marketplace?brand=...`

### Objectif utilisateur
Trouver et acheter des pièces détachées

### Objectif commercial
Générer des ventes

### Action principale
Ajouter au panier

### Action secondaire
Contacter le vendeur

### Sections obligatoires
1. Fil d'Ariane
2. Barre de recherche
3. Filtres (marque, modèle, condition, prix)
4. Grille de produits
5. Pagination

### Données attendues

| Champ | Type | Obligatoire | Source | Fallback |
|-------|------|-------------|--------|----------|
| products | array | oui | API /api/v1/products | aucun |
| brands | array | oui | API | aucun |
| categories | array | oui | statique | aucun |
| filters | object | oui | URL params | aucun |

### SEO
- Title dynamique selon filtres
- URL canonique elle-même
- Données structurées : ItemList, Product

---

## Modèle : Produit (détail via modal/panneau)

### Objectif utilisateur
Consulter les détails d'une pièce

### Objectif commercial
Conversion en ajout au panier

### Sections obligatoires
1. Image produit
2. Titre et référence
3. Prix (FCFA)
4. Disponibilité et localisation
5. Description
6. Caractéristiques techniques
7. Compatibilité véhicule
8. Avis clients
9. CTA "Ajouter au panier"

---

## Modèle : Panier (`/dashboard/cart`)

### Objectif utilisateur
Voir les articles sélectionnés

### Objectif commercial
Finaliser l'achat

### Sections obligatoires
1. Liste des articles
2. Sous-total
3. Frais de livraison estimés
4. Total
5. CTA "Passer la commande"

---

## Modèle : Connexion (`/auth/login`)

### Objectif utilisateur
Se connecter à son compte

### Objectif commercial
Connexion → Rétention

### Sections obligatoires
1. Formulaire email + mot de passe
2. Lien "Mot de passe oublié"
3. Lien "Créer un compte"
4. Bouton connexion

---

## Modèle : Inscription (`/auth/register`)

### Objectif utilisateur
Créer un compte

### Objectif commercial
Inscription → Activation

### Sections obligatoires
1. Sélection du type de compte (cartes Acheteur / Vendeur, même page)
2. Formulaire (nom, email, téléphone, mot de passe)
3. Sélection pays
4. Conditions d'utilisation
5. CTA "S'inscrire"

> Sélection du type de compte à l'inscription : deux cartes « Acheteur » / « Vendeur » sur la même page. « Vendeur » enregistre `role=SELLER` immédiatement ; le profil boutique se complète ensuite dans « Mon compte ».

## Modèle : Page informationnelle (`/a-propos`, `/conditions-generales`, `/politique-de-confidentialite`, `/aide`, `/paiement`, `/livraison`, `/contact`, `/retours`, `/blog`, `/manuels-reparation`)

### Objectif utilisateur
Lire une information de confiance, obtenir de l'aide ou contacter l'équipe.

### Objectif commercial
Instaurer la confiance, réduire le besoin de support, améliorer le maillage interne et l'indexation (routes R023-R032).

### Sections obligatoires
1. Layout public partagé (`src/app/(public)/layout.tsx` : Header + Footer)
2. Titre de page (H1)
3. Date de dernière mise à jour
4. Disclaimer pour les documents à teneur légale
5. Contenu en français, formaté en sections-bloc

### Composants
- `LegalPage` : composant serveur réutilisable (titre, date, avertissement juriste optionnel, sections). Utilisé par toutes les pages sauf `/contact`.
- `ContactForm` : composant client, ouvre la messagerie (mailto) avec une adresse de support provisoire clairement indiquée comme « à confirmer » ; aucun envoi automatique (service non encore en place).

### Données attendues
- Aucune donnée dynamique : contenu statique.

### SEO
- Routes `index, follow` ; canonical auto (URL de la page) ; sitemap oui (priorité 0.6).
- Titres/descriptions dédiés par page (`06-SEO.md`).
- Contenu honnête : pas de numéro de téléphone, d'adresse email ni de coordonnées inventées ; les canaux de contact sont présentés comme « à confirmer avant mise en production ».

### Tracking
- `page_view` via le `TrackingProvider` global (aucun événement dédié).

### États
- Statique, sans état vide/erreur applicatif.

## Modèle : Page catalogue SEO (`/marketplace/categorie/[slug]`, `/marketplace/marque/[slug]`)

### Routes concernées
- R033-R044 (`/marketplace/categorie/{slug}` — 12 catégories)
- R045-R057 (`/marketplace/marque/{slug}` — 13 marques)

### Objectif utilisateur
Trouver des pièces détachées par catégorie ou par marque sur une page indexable.

### Objectif commercial
Acquisition SEO (mots-clés « pièces {catégorie/marque} Abidjan »), maillage interne vers le marketplace.

### Sections obligatoires
1. Fil d'Ariane (Accueil › Marketplace › {nom})
2. H1 « Pièces détachées {X} à Abidjan »
3. Description
4. Décompte de pièces
5. Grille de `ProductCard`
6. État vide « Catalogue en cours de préparation » + CTA vers `/dashboard/marketplace`
7. CTA « Voir toutes les pièces sur le marketplace »

### Données attendues
- Produits filtrés depuis le catalogue réel : `productsService.list({ category: slug })` ou `list({ brand: <nom> })`.

### SEO
- Routes `index, follow`, pages serveur `force-dynamic`, `generateMetadata` par page (titre + description + canonical), sitemap oui.
- Titre/H1 mentionnent Abidjan ; slog mapping centralisé dans `src/lib/marketplace-catalog.ts`.

### Tracking
- `page_view` via le `TrackingProvider` global (aucun événement dédié).

### États
- Chargement : rendu serveur (pas de squelette). Vide : état honnête « Catalogue en cours de préparation ». Erreur : slug inconnu → `notFound()` (404).

---

# Templates de pages

## Template : Landing Page

### Structure

```
Header (dark)
├── Logo
├── Barre de recherche
├── Icônes (panier, profil)
└── Navigation catégories

Hero split
├── Gauche : CarSelector
│   ├── Label "Trouvez la pièce qu'il vous faut"
│   ├── Select marque
│   ├── Select modèle
│   └── CTA "Trouver"
└── Droite : PromoBanner (carousel 4 slides, neutres)

PartsCatalog (12 catégories)

BrandGrid (12 marques)

TrustBar (4 items)

BestSellers (6 produits ProductCard)

SEOText

Footer (e-commerce)
```

### Données à charger

- CarSelector : marques et modèles (statique)
- PromoBanner : 4 slides neutres et véridiques (aucun chiffre/offre inventé, aucune image distante)
- PartsCatalog : 12 catégories (vignettes dégradé + icône SVG, aucune image distante)
- BrandGrid : 13 logos officiels de marques (Wikimedia) — sans compteurs inventés
- TrustBar : 4 items (statique)
- BestSellers : désactivé (retourne `null`, TODO) — réactiver quand des ventes réelles (`salesCount`) et des images validées existent (voir `DECISIONS.md` D37)
- Footer : contenu i18n

---

## Template : Marketplace

### Structure

```
Header (app)
├── Logo
├── Recherche
└── Navigation

Sidebar (app)
├── Logo
├── Navigation items
└── Déconnexion

Contenu principal
├── Fil d'Ariane
├── Filtres
│   ├── Recherche texte
│   ├── Marque (select)
│   ├── Modèle (select)
│   ├── Condition (select)
│   └── Prix (range)
├── Grille produits (ProductCard × N)
└── Pagination

Footer (light)
```

### Données à charger

- Products : API /api/v1/products (avec filtres)
- Brands : API /api/v1/brands
- Categories : statique
- Filters : URL params

---

## Template : Détail Produit (Modal)

### Structure

```
Overlay (bg-black/50)
└── Conteneur
    ├── Image produit (gauche)
    ├── Infos produit (droite)
    │   ├── Badge (neuf/occasion)
    │   ├── Titre
    │   ├── Référence
    │   ├── Prix (FCFA)
    │   ├── Disponibilité
    │   ├── Localisation
    │   ├── Description
    │   ├── Caractéristiques
    │   ├── Compatibilité
    │   └── Avis clients
    ├── CTA "Ajouter au panier"
    └── Fermer (×)
```

---

## Template : Panier

### Structure

```
Header (app)

Contenu principal
├── Titre "Mon panier"
├── Liste articles
│   ├── Image
│   ├── Titre
│   ├── Prix
│   ├── Quantité
│   └── Supprimer
├── Sous-total
├── Frais de livraison
├── Total
└── CTA "Passer la commande"

Footer (light)
```

---

## Template : Commandes

### Structure

```
Header (app)

Contenu principal
├── Titre "Mes commandes"
├── Filtres (statut, date)
├── Liste commandes
│   ├── Numéro
│   ├── Date
│   ├── Statut (badge)
│   ├── Montant
│   └── Détails
└── Pagination

Footer (light)
```

---

## Template : Connexion

### Structure

```
Header (landing)

Conteneur centré
├── Logo
├── Titre "Connexion"
├── Formulaire
│   ├── Email
│   ├── Mot de passe
│   ├── Se souvenir de moi
│   └── CTA "Se connecter"
├── Lien "Mot de passe oublié ?"
├── Séparateur "ou"
└── Lien "Créer un compte"

Footer (landing)
```

---

## Template : Inscription

### Structure

```
Header (landing)

Conteneur centré
├── Logo
├── Titre "Inscription"
├── Formulaire
│   ├── Nom complet
│   ├── Email
│   ├── Téléphone
│   ├── Pays (select)
│   ├── Mot de passe
│   ├── Confirmer mot de passe
│   ├── Conditions d'utilisation
│   └── CTA "S'inscrire"
├── Lien "Déjà un compte ? Se connecter"

Footer (landing)
```

---

## Template : Dashboard

### Structure

```
Header (app)

Sidebar (app)

Contenu principal
├── Titre page
├── Breadcrumb
├── Statistiques (4 cards)
├── Contenu spécifique
└── Actions

Footer (light)
```

---

## Template : Aide

### Structure

```
Header (app)

Contenu principal
├── Titre "Aide"
├── Barre de recherche
├── Catégories d'aide
│   ├── Général
│   ├── Compte
│   ├── Commandes
│   ├── Paiements
│   └── Livraison
├── FAQ accordéon
└── Contact support

Footer (light)
```

---

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
| password | password | oui | Min 8, 1 maj, 1 chiffre | Mot de passe trop faible |
| confirmPassword | password | oui | = password | Les mots de passe ne correspondent pas |
| acceptTerms | checkbox | oui | Coche | Acceptez les conditions |

### Actions
- Inscription via POST /api/v1/auth/register
- Redirection vers /dashboard (connexion directe)

---

## Mon compte (`/dashboard/profile`)

### Objectif utilisateur
Gérer ses deux espaces (acheteur et vendeur) depuis un seul compte

### Objectif commercial
Activation de la vente → publication de produits

### Sections obligatoires
1. **Espace Acheteur** (toujours actif) : informations personnelles, commandes, véhicules
2. **Espace Vendeur** (à activer) : état vide clair « Vous n'avez pas encore activé la vente » + CTA « Vendre sur AutoAfrique » → mini-formulaire (nom affiché, ville, téléphone, méthode de paiement Mobile Money, numéro) → `sellerEnabled=true` + création du `SellerProfile`
3. Une fois activée, l'espace Vendeur affiche le résumé du profil vendeur (nom, ville, paiement)

### Formulaires

#### Activation vendeur

| Champ | Type | Obligatoire | Validation |
|-------|------|-------------|------------|
| displayName | text | oui | Min 1 caractere (nom affiché aux acheteurs) |
| city | text | non | - |
| phoneForOrders | tel | non | Format international |
| payoutMethod | select | oui | ORANGE_MONEY, MTN_MOMO, WAVE |
| payoutNumber | text | oui | Min 4 caracteres |

### Actions
- Activation via POST /api/v1/seller/activate
- Lecture via GET /api/v1/seller/profile
- Mise à jour via PUT /api/v1/seller/profile

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

---

# Rédaction et contenu

## Ton et voix

### Valeurs de marque
- **Professionnel** : Crédibilité dans l'industrie automobile
- **Accessible** : Compréhensible par tous les niveaux
- **Fiable** : Transparence sur les prix et délais
- **Panafricain** : Respectueux des cultures locales

### Ton par page

| Page | Ton | Niveau |
|------|-----|--------|
| Landing | Accueillant, énergique | Grand public |
| Catalogue | Technique mais clair | Mécaniciens |
| Dashboard | Professionnel, efficace | Utilisateurs connectés |
| Aide | Patient, pédagogique | Tous niveaux |
| Auth | Simple, rassurant | Tous niveaux |

## Style rédactionnel

### Règles
- Phrases courtes (max 25 mots)
- Verbes d'action à l'impératif ou infinitif
- Éviter le jargon technique inutile
- Utiliser "vous" (formel) ou "tu" (informel)
- Chiffres en lettres si < 10, en chiffres si ≥ 10
- Monnaie : FCFA (pas F CFA ni frs CFA)
- Pas d'anglicismes sauf termes techniques établis

### Exemples

| À éviter | À privilégier |
|----------|---------------|
| "Optimisez votre chaîne logistique" | "Gérez vos commandes facilement" |
| "Notre solution SaaS de bout en bout" | "AutoAfrique, vos pièces en ligne" |
| "Vous pouvez également" | "Vous pouvez aussi" |
| "Click here" | "Cliquez ici" |

## Contenus

### Landing Page

#### Hero
- Titre : "Trouvez la pièce qu'il vous faut"
- Sous-titre : "Pièces détachées neuves et occasion pour Toyota, Hyundai, Kia, Peugeot"
- CTA : "Trouver une pièce"

#### Barre de confiance
- Livraison 24-72h
- Paiement sécurisé
- Retour 30 jours
- Support (délais et coordonnées à confirmer avant la mise en production)

#### Texte SEO (bas de page)
> AutoAfrique est une plateforme de pièces détachées automobile en Afrique de l'Ouest. Nous connectons directement les acheteurs aux fournisseurs. Que vous cherchiez des freins, des filtres, de l'électronique ou des pièces moteur, notre catalogue couvre plusieurs catégories pour les marques populaires du marché africain : Toyota, Hyundai, Kia, Peugeot, Mercedes, Renault et d'autres. Payez par Mobile Money — Orange Money, MTN MoMo, Moov Money ou Wave — et recevez vos pièces en 24 à 72 heures en Afrique de l'Ouest.

### Catégories

| Catégorie | Description courte |
|-----------|-------------------|
| Pneus & Jantes | Pneus été/hiver, jantes alu et acier |
| Frein | Disques, plaquettes, étriers, câbles |
| Moteur | Pièces moteur, joints, pistons |
| Courroies | Courroies distribution, galets tendeurs |
| Embrayage | Kits, disques, récepteurs |
| Amortissement | Amortisseurs, supports, biellettes |
| Suspension | Ressorts, baladeurs, barres |
| Filtres | Huile, air, carburant, habitacle |
| Carrosserie | Pare-chocs, rétroviseurs, phares |
| Huiles | Huile moteur, liquides |
| Électricité | Alternateur, démarreur, bougies |
| Accessoires | Divers |

### Badges produits

| Badge | Signification |
|-------|---------------|
| Neuf | Pièce neuve d'origine |
| Occasion | Pièce d'occasion vérifiée |
| Remanufaturé | Pièce reconditionnée |
| Promo | En promotion |

### Erreurs

| Erreur | Message |
|--------|---------|
| 404 | "Page introuvable" |
| 500 | "Erreur serveur, réessayez" |
| Recherche vide | "Aucun résultat pour [terme]" |
| Panier vide | "Votre panier est vide" |
| Hors stock | "Rupture de stock" |

## Localisation FR

### Expressions courantes

| EN | FR |
|----|----|
| Add to cart | Ajouter au panier |
| Checkout | Passer la commande |
| Sign up | S'inscrire |
| Log in | Se connecter |
| Search | Rechercher |
| Filter | Filtrer |
| Sort by | Trier par |
| In stock | En stock |
| Out of stock | Rupture de stock |
| Free shipping | Livraison gratuite |
| Total | Total |
| Subtotal | Sous-total |

---

# Internationalisation

## Configuration

### Langues supportees
- **FR** (francais) — langue par defaut
- **EN** (anglais)

### Fichier principal
`src/lib/i18n.ts`

### Detection
- URL prefix : non (single locale)
- Cookie : `locale=fr|en`
- Navigator : `navigator.language`
- Default : `fr`

## Structure des cles

```
landing.*
  hero.*
  trust.*
  catalog.*
  brands.*
  bestsellers.*
  seoText.*

auth.*
  login.*
  register.*

marketplace.*
  filters.*
  product.*
  cart.*

dashboard.*
  sidebar.*
  stats.*
  orders.*
  inventory.*
  crm.*
  payments.*
  finance.*
  analytics.*
  settings.*
  help.*
  profile.*
  notifications.*

common.*
  buttons.*
  labels.*
  messages.*
  errors.*
```

## Traductions principales

### Landing

| Cle | FR | EN |
|-----|----|----|
| landing.hero.title | Trouvez la piece qu'il vous faut | Find the part you need |
| landing.hero.subtitle | Pieces detachees neuves et occasion pour Toyota, Hyundai, Kia, Peugeot | New and used parts for Toyota, Hyundai, Kia, Peugeot |
| landing.hero.cta | Trouver une piece | Find a part |
| landing.trust.shipping | Livraison 24-72h | Delivery 24-72h |
| landing.trust.payment | Paiement securise | Secure payment |
| landing.trust.return | Retour 30 jours | 30-day returns |
| landing.trust.support | Support (coordonnees a confirmer) | Support (contact details to be confirmed) |
| landing.cta.register | Ouvrir ma boutique gratuitement | Open my shop for free |
| landing.cta.login | Se connecter | Log in |
| landing.footer.description | Marketplace de pieces auto en Afrique de l'Ouest | Auto parts marketplace in West Africa |

### Auth

| Cle | FR | EN |
|-----|----|----|
| auth.login.title | Connexion | Login |
| auth.login.email | Email | Email |
| auth.login.password | Mot de passe | Password |
| auth.login.submit | Se connecter | Log in |
| auth.login.forgot | Mot de passe oublie ? | Forgot password? |
| auth.login.noAccount | Pas encore de compte ? | Don't have an account? |
| auth.register.title | Inscription | Sign up |
| auth.register.name | Nom complet | Full name |
| auth.register.phone | Telephone | Phone |
| auth.register.country | Pays | Country |
| auth.register.password | Mot de passe | Password |
| auth.register.confirmPassword | Confirmer le mot de passe | Confirm password |
| auth.register.terms | J'accepte les conditions d'utilisation | I accept the terms of use |
| auth.register.submit | S'inscrire | Sign up |
| auth.register.sellerCta | Vendre sur AutoAfrique | Sell on AutoAfrique |
| auth.register.sellerEmpty | Vous n'avez pas encore active la vente | You have not activated selling yet |
| auth.register.sellerName | Nom affiche aux acheteurs | Name shown to buyers |
| auth.register.sellerCity | Ville | City |
| auth.register.sellerPhone | Telephone commandes | Order phone |
| auth.register.sellerPayout | Methode de paiement | Payment method |
| auth.register.sellerNumber | Numero de paiement | Payment number |

### Dashboard

| Cle | FR | EN |
|-----|----|----|
| dashboard.sidebar.dashboard | Tableau de bord | Dashboard |
| dashboard.sidebar.marketplace | Marketplace | Marketplace |
| dashboard.sidebar.inventory | Inventaire | Inventory |
| dashboard.sidebar.orders | Commandes | Orders |
| dashboard.sidebar.crm | CRM | CRM |
| dashboard.sidebar.payments | Paiements | Payments |
| dashboard.sidebar.finance | Finance | Finance |
| dashboard.sidebar.analytics | Analytics | Analytics |
| dashboard.sidebar.admin | Administration | Administration |
| dashboard.sidebar.settings | Parametres | Settings |
| dashboard.sidebar.help | Aide | Help |
| dashboard.sidebar.profile | Mon profil | My profile |
| dashboard.sidebar.logout | Deconnexion | Logout |

### Marketplace

| Cle | FR | EN |
|-----|----|----|
| marketplace.title | Marketplace | Marketplace |
| marketplace.search | Rechercher une piece... | Search for a part... |
| marketplace.filters.brand | Marque | Brand |
| marketplace.filters.model | Modele | Model |
| marketplace.filters.category | Categorie | Category |
| marketplace.filters.condition | Etat | Condition |
| marketplace.filters.price | Prix | Price |
| marketplace.filters.apply | Appliquer | Apply |
| marketplace.filters.reset | Reinitialiser | Reset |
| marketplace.product.addToCart | Ajouter au panier | Add to cart |
| marketplace.product.inStock | En stock | In stock |
| marketplace.product.outOfStock | Rupture de stock | Out of stock |
| marketplace.product.seller | Vendeur | Seller |

### Common

| Cle | FR | EN |
|-----|----|----|
| common.buttons.save | Enregistrer | Save |
| common.buttons.cancel | Annuler | Cancel |
| common.buttons.delete | Supprimer | Delete |
| common.buttons.edit | Modifier | Edit |
| common.buttons.create | Creer | Create |
| common.buttons.search | Rechercher | Search |
| common.buttons.filter | Filtrer | Filter |
| common.buttons.loading | Chargement... | Loading... |
| common.errors.server | Erreur serveur | Server error |
| common.errors.notFound | Page introuvable | Page not found |
| common.errors.unauthorized | Non autorise | Unauthorized |
| common.messages.success | Operation reussie | Operation successful |
| common.messages.confirm | Etes-vous sur ? | Are you sure? |
