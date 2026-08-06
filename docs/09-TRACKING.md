# Analytics et tracking

## Schema de tracking

### Evenements de page

| Evenement | Trigger | Parametres |
|-----------|---------|------------|
| `page_view` | Chargement page | `page`, `title`, `url` |
| `scroll_depth` | Scroll 25/50/75/100% | `page`, `depth` |
| `time_on_page` | Quitte page | `page`, `duration` |

### Evenements landing

| Evenement | Trigger | Parametres |
|-----------|---------|------------|
| `search_vehicle` | CTA "Trouver" | `brand`, `model` |
| `click_category` | Clic categorie | `category_name` |
| `click_brand` | Clic marque | `brand_name` |
| `click_cta_register` | Clic "Ouvrir ma boutique" | `source` |
| `click_cta_login` | Clic "Se connecter" | `source` |

### Evenements marketplace

| Evenement | Trigger | Parametres |
|-----------|---------|------------|
| `search_product` | Recherche | `query`, `results_count` |
| `filter_product` | Filtre applique | `filter_type`, `filter_value` |
| `view_product` | Clic produit | `product_id`, `product_name`, `price` |
| `add_to_cart` | Ajout panier | `product_id`, `price`, `quantity` |
| `remove_from_cart` | Retrait panier | `product_id` |

### Evenements commande

| Evenement | Trigger | Parametres |
|-----------|---------|------------|
| `checkout_start` | Debut checkout | `cart_value`, `items_count` |
| `payment_method` | Selection methode | `method` |
| `payment_success` | Paiement OK | `order_id`, `amount`, `method` |
| `payment_fail` | Paiement echoue | `method`, `error` |
| `order_complete` | Commande confirmee | `order_id`, `total` |

### Evenements CRM

| Evenement | Trigger | Parametres |
|-----------|---------|------------|
| `lead_created` | Creation lead | `source` |
| `lead_converted` | Conversion lead | `lead_id`, `value` |
| `customer_created` | Creation client | `source` |

### Evenements auth

| Evenement | Trigger | Parametres |
|-----------|---------|------------|
| `login` | Connexion reussie | `method` |
| `register` | Inscription reussie | `role` (`BUYER` par defaut, `SELLER` si choisi a l'inscription), `country` |
| `logout` | Deconnexion | - |

## KPIs business

### Acquisition
- Utilisateurs inscrits (par jour/semaine/mois)
- Nouveaux vendeurs vs acheteurs
- Sources d'inscription
- Couts d'acquisition (CAC)

### Engagement
- Recherches par jour
- Vues produits par jour
- Taux d'ajout au panier
- Temps moyen sur catalogue

### Conversion
- Taux de conversion (visit -> achat)
- Panier moyen (FCFA)
- Valeur moyenne commande
- Taux d'abandon panier

### Revenue
- Chiffre d'affaires (j/m/a)
- Nombre de commandes
- Ticket moyen
- Marge brute

### Retention
- Taux de retour (7j, 30j, 90j)
- Commandes par utilisateur
- LTV (Lifetime Value)
- NPS (Net Promoter Score)

## Outils

### Google Analytics 4
- Tracking automatique des pages
- Evenements custom via gtag
- Conversion tracking

#### Implementation GA4 (gtag.js)

Le tag GA4 est charge cote client par `src/components/GoogleAnalytics.tsx`, branche dans le layout racine `src/app/layout.tsx`. Il necessite la variable d'environnement `NEXT_PUBLIC_GA_MEASUREMENT_ID` (ex. `G-46T65CMVH0`), documentee dans `.env.example`.

Comportement :
- `page_view` : envoye a chaque navigation (y compris routage cote client) via `gtag('config', id, { page_path })` ; `send_page_view: false` dans l'init pour eviter un doublon sur le premier chargement.
- Evenements custom : le module `src/lib/tracking.ts` (`track`) renvoie automatiquement chaque evenement du schema vers GA4 via `gtag('event', ...)` (module `src/lib/gtag.ts`, `trackGAEvent`). L'evenement `page_view` est exclu du renvoi car deja gere par `gtag('config')`.
- Consentement : `setGAConsent` pousse le mode `analytics_storage: granted` / `ad_storage: denied` (aucune publicite ciblee).

#### Conversions GA4

Les evenements de conversion marques dans la propriete GA4 `autoafrique-saas` (`properties/548619763`) via l'API Admin sont :

| Evenement | Import conversion | Comptage | Supression autorisee |
|-----------|-------------------|----------|----------------------|
| `purchase` | oui | `ONCE_PER_EVENT` | non |
| `close_convert_lead` | oui | `ONCE_PER_EVENT` | oui |
| `qualify_lead` | oui | `ONCE_PER_EVENT` | oui |
| `order_complete` | oui | `ONCE_PER_EVENT` | oui |
| `add_to_cart` | oui | `ONCE_PER_EVENT` | oui |
| `checkout_start` | oui | `ONCE_PER_EVENT` | oui |
| `login` | oui | `ONCE_PER_EVENT` | oui |
| `register` | oui | `ONCE_PER_EVENT` | oui |

Ces marques ont ete creees via `https://www.googleapis.com/auth/analytics.edit` (script local `create_conversions.py`) ; toute modification de la liste doit passer par le flux OAuth decrit dans `09-TRACKING.md` / `DECISIONS.md`. La creation d'une nouvelle conversion est une action admin GA4 (scope `analytics.edit`), distincte de l'emission d'un evenement.

### Metriques internes
- Tableau de bord `/dashboard/analytics`
- Graphiques par periode
- Export CSV

## Implementation (module analytics)

Les evenements sont persistes dans le modele `AnalyticsEvent` (voir `18-DATABASE.md`) via le service `src/modules/analytics/analytics.service.ts` et les routes API documentees dans `02-ROUTES.md` :

- `POST /api/v1/analytics/events` (R208) — enregistre un evenement ; public pour permettre le tracking anonyme du marketplace, `userId` rattache si un cookie JWT est present
- `GET /api/v1/analytics/events` (R209) — liste les evenements (filtres `event`, `entity`, `entityId`, `from`, `to`, `limit` ≤ 200), auth requise
- `GET /api/v1/analytics/stats` (R210) — statistiques agregees (total, sessions uniques, `byEvent`, entonnoir `funnel`, serie temporelle `series`), auth requise

Le tracking cote client est assure par `src/lib/tracking.ts` (`track`, `trackPageView`, `getSessionId`) : fire-and-forget vers R208 avec un `sessionId` persiste dans `localStorage`. Le marketplace branche `search_product`, `filter_product`, `view_product`, `add_to_cart`, `checkout_start` et `order_complete`. Le dashboard `/dashboard/analytics` (R012) consomme R210 pour les metriques d'engagement et l'entonnoir de conversion.
