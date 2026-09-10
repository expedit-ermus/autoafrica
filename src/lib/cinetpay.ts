import crypto from 'crypto'

/**
 * Intégration CinetPay — vérification des notifications de paiement.
 *
 * CinetPay ne signe pas le corps brut de la requête, contrairement à la
 * convention Stripe : la notification arrive en `application/x-www-form-urlencoded`
 * et le jeton `x-token` est le HMAC-SHA256 de la **concaténation des valeurs
 * postées**, sans séparateur. Le SDK PHP de référence l'écrit
 * `hash_hmac('SHA256', implode('', $_POST), $secret_key)`.
 *
 * Deux conséquences pratiques :
 * - la vérification doit se faire sur les champs de formulaire, pas sur `rawBody` ;
 * - l'ordre des valeurs est celui d'arrivée, puisque `implode('', $_POST)` suit
 *   l'ordre de sérialisation choisi par CinetPay.
 */

/** Nom de l'en-tête portant le HMAC. CinetPay l'envoie en minuscules. */
const TOKEN_HEADER = 'x-token'

/**
 * Ordre documenté des champs de notification, utilisé en repli si la
 * concaténation dans l'ordre d'arrivée ne correspond pas — par exemple si un
 * intermédiaire réordonne le corps du formulaire.
 */
const DOCUMENTED_FIELD_ORDER = [
  'cpm_site_id',
  'cpm_trans_id',
  'cpm_trans_date',
  'cpm_amount',
  'cpm_currency',
  'signature',
  'payment_method',
  'cel_phone_num',
  'cpm_phone_prefixe',
  'cpm_language',
  'cpm_version',
  'cpm_payment_config',
  'cpm_page_action',
  'cpm_custom',
  'cpm_designation',
  'cpm_error_message',
]

export type CinetPayVerification =
  | { ok: true; reason: 'verified' | 'skipped-dev'; transactionId: string }
  | { ok: false; status: number; reason: string }

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8')
  const bufB = Buffer.from(b, 'utf8')
  // timingSafeEqual exige des longueurs égales : on compare d'abord la taille.
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}

function hmac(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload, 'utf8').digest('hex')
}

/**
 * Vérifie le jeton `x-token` d'une notification CinetPay.
 *
 * @param headers en-têtes de la requête
 * @param fields  champs du formulaire, dans l'ordre où ils ont été reçus
 */
export function verifyCinetPayToken(
  headers: Headers,
  fields: [string, string][],
): CinetPayVerification {
  const secret = process.env.CINETPAY_SECRET_KEY
  const transactionId = fields.find(([key]) => key === 'cpm_trans_id')?.[1] ?? ''

  if (!secret) {
    // Fail closed en production : mieux vaut refuser des notifications
    // légitimes que d'accepter de faux encaissements.
    if (process.env.NODE_ENV === 'production') {
      return {
        ok: false,
        status: 503,
        reason: 'CINETPAY_SECRET_KEY non configurée : notification refusée',
      }
    }
    return { ok: true, reason: 'skipped-dev', transactionId }
  }

  const provided = headers.get(TOKEN_HEADER)
  if (!provided) {
    return { ok: false, status: 401, reason: 'Jeton x-token absent' }
  }

  const received = provided.trim().toLowerCase()

  const inArrivalOrder = fields.map(([, value]) => value).join('')
  if (safeEqual(received, hmac(inArrivalOrder, secret))) {
    return { ok: true, reason: 'verified', transactionId }
  }

  const posted = new Map(fields)
  const inDocumentedOrder = DOCUMENTED_FIELD_ORDER.map((key) => posted.get(key) ?? '').join('')
  if (safeEqual(received, hmac(inDocumentedOrder, secret))) {
    return { ok: true, reason: 'verified', transactionId }
  }

  return { ok: false, status: 401, reason: 'Jeton x-token invalide' }
}

const CHECK_ENDPOINT = 'https://api-checkout.cinetpay.com/v2/payment/check'

export interface CinetPayTransaction {
  /** `ACCEPTED` est le seul statut qui vaut encaissement. */
  status: string
  /** Montant en unité entière (XOF n'a pas de sous-unité). */
  amount: number
  currency: string
  paymentMethod?: string
  operatorId?: string
}

export type CinetPayCheck =
  | { ok: true; transaction: CinetPayTransaction }
  | { ok: false; reason: string }

/**
 * Interroge CinetPay pour connaître le statut réel d'une transaction.
 *
 * Étape indispensable : le jeton `x-token` prouve l'origine de la notification,
 * pas son contenu métier. CinetPay recommande explicitement de ne jamais
 * encaisser sur la foi du corps reçu, mais de rappeler cette API — c'est elle
 * qui fait autorité.
 */
export async function checkCinetPayTransaction(transactionId: string): Promise<CinetPayCheck> {
  const apikey = process.env.CINETPAY_API_KEY
  const siteId = process.env.CINETPAY_SITE_ID

  if (!apikey || !siteId) {
    return { ok: false, reason: 'CINETPAY_API_KEY ou CINETPAY_SITE_ID non configurés' }
  }

  let response: Response
  try {
    response = await fetch(CHECK_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apikey, site_id: siteId, transaction_id: transactionId }),
      // Sans délai maximal, une API lente bloquerait le webhook jusqu'au timeout
      // de la plateforme, et CinetPay rejouerait la notification.
      signal: AbortSignal.timeout(10_000),
    })
  } catch (error) {
    return { ok: false, reason: `Appel de vérification impossible : ${String(error)}` }
  }

  if (!response.ok) {
    return { ok: false, reason: `Vérification CinetPay : HTTP ${response.status}` }
  }

  const body = (await response.json()) as {
    code?: string
    message?: string
    data?: {
      status?: string
      amount?: string | number
      currency?: string
      payment_method?: string
      operator_id?: string
    }
  }

  // `code` vaut "00" quand la transaction est retrouvée ; toute autre valeur
  // signale une transaction inconnue ou une erreur d'identifiants.
  if (body.code !== '00' || !body.data) {
    return { ok: false, reason: `Vérification CinetPay refusée : ${body.code} ${body.message ?? ''}`.trim() }
  }

  return {
    ok: true,
    transaction: {
      status: String(body.data.status ?? ''),
      amount: Number(body.data.amount ?? 0),
      currency: String(body.data.currency ?? ''),
      paymentMethod: body.data.payment_method,
      operatorId: body.data.operator_id,
    },
  }
}

const PAYMENT_ENDPOINT = 'https://api-checkout.cinetpay.com/v2/payment'

/**
 * XOF n'a pas de sous-unite et CinetPay impose des montants multiples de 5.
 * Un total non conforme est refuse plutot qu'arrondi : arrondir changerait la
 * somme reellement debitee a l'acheteur, sans qu'il en soit informe.
 */
const XOF_MULTIPLE = 5

export interface InitiateCinetPayInput {
  /** Identifiant de notre Payment : c'est lui qui revient en `cpm_trans_id`. */
  transactionId: string
  amount: number
  currency: string
  description: string
  customerName?: string
  customerPhone?: string
  /** Canal a presenter en premier sur la page CinetPay. */
  channels?: string
}

export type CinetPayInitiation =
  | { ok: true; paymentUrl: string; paymentToken: string }
  | { ok: false; reason: string; code?: string }

/**
 * Cree une transaction CinetPay et renvoie l'URL de paiement hebergee.
 *
 * L'acheteur choisit son operateur et saisit son code sur la page de CinetPay,
 * jamais sur AutoAfrique : nous ne voyons ni ne stockons de code secret.
 *
 * Cet appel n'encaisse rien. Il ouvre une transaction ; seule la notification
 * verifiee par `/api/v1/payments/webhook` vaut encaissement.
 */
export async function initiateCinetPayPayment(
  input: InitiateCinetPayInput,
): Promise<CinetPayInitiation> {
  const apikey = process.env.CINETPAY_API_KEY
  const siteId = process.env.CINETPAY_SITE_ID
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL

  if (!apikey || !siteId) {
    return { ok: false, reason: 'CINETPAY_API_KEY ou CINETPAY_SITE_ID non configures' }
  }
  if (!baseUrl) {
    // Sans URL publique, CinetPay ne saurait ou notifier l'encaissement : la
    // transaction serait payee sans que la commande passe jamais a PAID.
    return { ok: false, reason: 'NEXT_PUBLIC_APP_URL non configuree' }
  }
  if (input.currency === 'XOF' && input.amount % XOF_MULTIPLE !== 0) {
    return {
      ok: false,
      reason:
        `Montant non conforme : CinetPay n'accepte que des multiples de ${XOF_MULTIPLE} ${input.currency} ` +
        `(recu ${input.amount}).`,
    }
  }

  let response: Response
  try {
    response = await fetch(PAYMENT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apikey,
        site_id: siteId,
        transaction_id: input.transactionId,
        amount: input.amount,
        currency: input.currency,
        description: input.description,
        notify_url: `${baseUrl}/api/v1/payments/webhook`,
        return_url: `${baseUrl}/paiement/retour?paiement=${encodeURIComponent(input.transactionId)}`,
        channels: input.channels || 'MOBILE_MONEY',
        lang: 'fr',
        ...(input.customerName ? { customer_name: input.customerName } : {}),
        ...(input.customerPhone ? { customer_phone_number: input.customerPhone } : {}),
      }),
      signal: AbortSignal.timeout(15_000),
    })
  } catch (error) {
    return { ok: false, reason: `Appel d'initiation impossible : ${String(error)}` }
  }

  if (!response.ok) {
    return { ok: false, reason: `Initiation CinetPay : HTTP ${response.status}` }
  }

  const body = (await response.json()) as {
    code?: string
    message?: string
    description?: string
    data?: { payment_token?: string; payment_url?: string }
  }

  // `201` est le code de creation. Toute autre valeur signale un refus, des
  // identifiants invalides ou un parametre non conforme.
  if (body.code !== '201' || !body.data?.payment_url) {
    return {
      ok: false,
      code: body.code,
      reason: `Initiation CinetPay refusee : ${body.code ?? '?'} ${body.description ?? body.message ?? ''}`.trim(),
    }
  }

  return {
    ok: true,
    paymentUrl: body.data.payment_url,
    paymentToken: String(body.data.payment_token ?? ''),
  }
}

/** Vrai quand les identifiants marchands necessaires a l'initiation sont poses. */
export function cinetPayConfigured(): boolean {
  return Boolean(
    process.env.CINETPAY_API_KEY && process.env.CINETPAY_SITE_ID && process.env.NEXT_PUBLIC_APP_URL,
  )
}
