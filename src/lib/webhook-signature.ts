import crypto from 'crypto'

/**
 * Vérification de signature des webhooks de paiement (Mobile Money).
 *
 * Sans cette vérification, n'importe qui peut appeler le webhook avec
 * `{ paymentId, status: "COMPLETED" }` et faire passer une commande en payée
 * sans qu'aucun franc CFA n'ait été encaissé.
 *
 * Convention retenue : HMAC-SHA256 du corps brut de la requête, encodé en
 * hexadécimal, transmis dans un en-tête. Les en-têtes des principaux agrégateurs
 * ouest-africains sont acceptés pour éviter une adaptation par opérateur.
 */

const SIGNATURE_HEADERS = [
  'x-autoafrique-signature',
  'x-webhook-signature',
  'x-paydunya-signature',
  'x-cinetpay-signature',
  'x-wave-signature',
  'verif-hash', // Flutterwave
]

const TIMESTAMP_HEADERS = ['x-autoafrique-timestamp', 'x-webhook-timestamp']

/** Fenêtre de tolérance anti-rejeu, en secondes. */
const MAX_SKEW_SECONDS = 300

export type WebhookVerification =
  | { ok: true; reason: 'verified' | 'skipped-dev' }
  | { ok: false; status: number; reason: string }

function readHeader(headers: Headers, names: string[]): string | null {
  for (const name of names) {
    const value = headers.get(name)
    if (value) return value
  }
  return null
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8')
  const bufB = Buffer.from(b, 'utf8')
  // timingSafeEqual exige des longueurs égales : on compare d'abord la taille.
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}

/**
 * @param rawBody corps brut de la requête (indispensable : un JSON re-sérialisé
 *                ne produit pas le même HMAC que celui signé par l'émetteur).
 */
export function verifyWebhookSignature(headers: Headers, rawBody: string): WebhookVerification {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET

  if (!secret) {
    // Fail closed en production : mieux vaut refuser des webhooks légitimes
    // que d'accepter de faux encaissements.
    if (process.env.NODE_ENV === 'production') {
      return {
        ok: false,
        status: 503,
        reason: 'PAYMENT_WEBHOOK_SECRET non configuré : webhook refusé',
      }
    }
    return { ok: true, reason: 'skipped-dev' }
  }

  const provided = readHeader(headers, SIGNATURE_HEADERS)
  if (!provided) {
    return { ok: false, status: 401, reason: 'Signature absente' }
  }

  const timestamp = readHeader(headers, TIMESTAMP_HEADERS)
  if (timestamp) {
    const sent = Number(timestamp)
    if (!Number.isFinite(sent)) {
      return { ok: false, status: 401, reason: 'Horodatage invalide' }
    }
    const skew = Math.abs(Date.now() / 1000 - sent)
    if (skew > MAX_SKEW_SECONDS) {
      return { ok: false, status: 401, reason: 'Horodatage hors fenêtre (rejeu probable)' }
    }
  }

  // Signé sur `timestamp.body` quand l'horodatage est fourni, sinon sur le corps seul.
  const signedPayload = timestamp ? `${timestamp}.${rawBody}` : rawBody
  const expected = crypto.createHmac('sha256', secret).update(signedPayload, 'utf8').digest('hex')

  // Tolère un préfixe de type "sha256=..." utilisé par certains émetteurs.
  const normalized = provided.includes('=') ? provided.split('=').pop()!.trim() : provided.trim()

  if (!safeEqual(normalized.toLowerCase(), expected)) {
    return { ok: false, status: 401, reason: 'Signature invalide' }
  }

  return { ok: true, reason: 'verified' }
}
