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
