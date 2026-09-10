# Paiements Mobile Money

## Vision

Le paiement Mobile Money est au cœur de la proposition de valeur d'AutoAfrique : en Afrique de l'Ouest, la majorité des garagistes, revendeurs et clients ne disposent pas de compte bancaire mais utilisent quotidiennement Orange Money, MTN MoMo, Moov Money ou Wave. AutoAfrique accepte ces moyens de paiement en FCFA (XOF) en plus de la carte bancaire.

## Moyens de paiement

| Méthode | Identifiant | Pays principaux |
|---------|-------------|-----------------|
| Orange Money | `ORANGE_MONEY` | Côte d'Ivoire, Sénégal, Mali, Burkina Faso, Bénin, Niger, Togo |
| MTN MoMo | `MTN_MOMO` | Côte d'Ivoire, Sénégal, Ghana, Cameroun, Nigeria |
| Moov Money | `MOOV_MONEY` | Côte d'Ivoire, Bénin, Togo, Burkina Faso |
| Wave | `WAVE` | Sénégal, Mali, Burkina Faso, Côte d'Ivoire |
| Carte | `CARD` | Visa, Mastercard |
| Espèces | `CASH` | Sur place / paiement à la livraison |

## Le tunnel réel (D67)

L'encaissement passe par la **page de paiement hébergée de CinetPay**. Les quatre
opérateurs y sont proposés ; l'acheteur choisit le sien et saisit son code
**chez son opérateur**. AutoAfrique ne voit ni ne conserve aucun code secret.

Enchaînement :

1. `POST /api/v1/orders` crée la commande.
2. `POST /api/v1/payments` crée un `Payment` en base, puis `initiate()` ouvre une
   transaction CinetPay et renvoie une `redirectUrl`.
3. Le panier redirige l'acheteur vers cette page.
4. CinetPay notifie `POST /api/v1/payments/webhook`. Le HMAC `x-token` est
   vérifié, puis l'API CinetPay est **rappelée** : c'est elle qui fait autorité,
   jamais le corps reçu. Montant et devise sont comparés à la commande.
5. C'est **seulement là** que le paiement passe à `COMPLETED`, la commande à
   `PAID`, et que partent la notification et le SMS.
6. L'acheteur revient sur `/paiement/retour?paiement=<id>`, qui lit l'état réel
   en base.

### Ce qu'une initiation réussie ne veut pas dire

`initiate()` renvoie `status: 'pending'`, **jamais** `completed`. Une initiation
ouvre une transaction : l'argent n'a pas bougé, l'acheteur n'a pas encore saisi
son code. `payments.service` ne touche donc ni au statut de la commande ni au
journal à ce moment.

C'est le point le plus facile à casser du module : `process()` marque la commande
`PAID` sur un `completed`, et un adaptateur qui renverrait `completed` à
l'initiation encaisserait dans le vide — le défaut de D65, un cran plus bas. Deux
tests le verrouillent, l'un sur l'adaptateur, l'autre sur le service.

### Sans identifiants marchands

Si `CINETPAY_API_KEY` ou `CINETPAY_SITE_ID` manquent, le paiement en ligne est
désactivé : la commande est enregistrée et l'acheteur lit « Commande enregistrée,
le vendeur vous contactera ». Rien n'est jamais annoncé comme payé.

`NEXT_PUBLIC_APP_URL` construit `notify_url` : une valeur fausse ferait encaisser
sans que la commande passe jamais à `PAID`. L'URL à déclarer côté CinetPay est
`<NEXT_PUBLIC_APP_URL>/api/v1/payments/webhook`.

### Contrainte de montant

CinetPay n'accepte que des montants **multiples de 5 XOF**. Un total non conforme
est refusé, jamais arrondi : arrondir changerait la somme réellement débitée à
l'acheteur sans qu'il en soit informé.

### Aucun code PIN sur AutoAfrique

Le panier demandait autrefois un code PIN Mobile Money — présenté comme « de
démonstration » — qu'il n'envoyait nulle part. Habituer un acheteur à saisir son
code secret sur un site tiers est le schéma exact de l'hameçonnage. La saisie
appartient à l'opérateur ; un test E2E vérifie qu'aucun champ de ce type ne
réapparaît.

## Architecture

Le module `src/modules/payments` implémente un pattern adapter : chaque fournisseur est un `PaymentProviderAdapter` enregistré dans un registre.

### Interface (types.ts)

```ts
export interface InitiatePaymentInput {
  phone: string
  amount: number
  currency: string
  reference: string
  description?: string
}

export interface InitiatePaymentResult {
  success: boolean
  transactionId?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  message: string
  ussdCode?: string
  pinRequired: boolean
  error?: string
  /** Page de paiement de l'opérateur. Présente quand `status` vaut `pending`. */
  redirectUrl?: string
}

export interface PaymentProviderAdapter {
  readonly id: PaymentMethod
  readonly name: string
  readonly shortCode: string
  readonly fees: ProviderFee
  readonly limits: ProviderLimits
  readonly countries: string[]
  initiate(input: InitiatePaymentInput): Promise<InitiatePaymentResult>
}
```

### Adaptateurs

- `base.adapter.ts` : classe abstraite `BaseMobileMoneyAdapter` (validation téléphone `^\+?[0-9]{8,15}$`, limites min/max, taux d'échec simulé 5%)
- `orange-money.adapter.ts`
- `mtn-momo.adapter.ts`
- `moov-money.adapter.ts`
- `wave.adapter.ts`

> **V1 (simulateur)** : les valeurs `fees` (`percent`, `fixed`) déclarées par chaque adaptateur sont des **placeholders de simulation, non contractuels** — jamais affichées à l'utilisateur ni appliquées au montant (le flux simule uniquement succès/échec, cf. D7). Elles seront confirmées avec les opérateurs avant la mise en production.

### Registre

`registry.ts` : mapping méthode → adaptateur. Permet d'ajouter un fournisseur sans toucher au service.

## Cycle de paiement

1. Création d'une commande (`Order`)
2. Initiation du paiement : POST `/api/v1/payments` avec `orderId`, `method`, `phone`
3. États : `PENDING` → `PROCESSING` → `COMPLETED` | `FAILED` | `CANCELLED` (voir `PaymentService`)
4. En cas d'échec : suggestion d'un autre moyen de paiement

## Endpoints

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/api/v1/payments` | Requise | Traiter un paiement |
| GET | `/api/v1/payments` | Requise | Liste des paiements |
| GET | `/api/v1/payments/[id]` | Requise | Statut d'un paiement |

## Contraintes

- Montant en FCFA (XOF), pas de conversion automatique
- Validation des limites par fournisseur (min/max)
- Le numéro de téléphone est validé avant tout appel fournisseur
- Prise en compte des frais fournisseur (`ProviderFee`)

## Décisions liées

- **D7** : pas d'intégration paiement réelle en V1 (UI de checkout simulateur), partenariats Mobile Money en V2. Les adaptateurs simulent le flux (`failureRate`, délai 1s).
- Paiement refusé → suggérer un autre moyen de paiement.
