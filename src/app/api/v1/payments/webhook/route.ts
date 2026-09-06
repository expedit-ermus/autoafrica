import { NextRequest, NextResponse } from 'next/server'
import { paymentsService } from '@/modules/payments/payments.service'
import { verifyCinetPayToken, checkCinetPayTransaction } from '@/lib/cinetpay'
import { enforceRateLimit } from '@/lib/rate-limit'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/shared/utils/response'

/**
 * Notification de paiement CinetPay.
 *
 * Le corps arrive en `application/x-www-form-urlencoded` : on le lit en champs
 * ordonnés, car le HMAC `x-token` porte sur la concaténation des valeurs dans
 * leur ordre d'arrivée (cf. `lib/cinetpay.ts`).
 *
 * Le statut envoyé dans le corps n'est jamais cru sur parole : il ne sert qu'à
 * identifier la transaction. Le statut qui fait foi est celui renvoyé par
 * l'API de vérification de CinetPay.
 */
export async function POST(req: NextRequest) {
  try {
    const limited = enforceRateLimit(req, 'webhook')
    if (limited) return limited

    const rawBody = await req.text()
    const fields = [...new URLSearchParams(rawBody).entries()]

    const verification = verifyCinetPayToken(req.headers, fields)
    if (!verification.ok) {
      // Aucun détail renvoyé à l'appelant : inutile de l'aider à forger un jeton.
      console.warn(`[webhook cinetpay] Rejeté — ${verification.reason}`)
      return NextResponse.json({ error: 'Webhook non autorisé' }, { status: verification.status })
    }

    const transactionId = verification.transactionId
    if (!transactionId) {
      return NextResponse.json({ error: 'cpm_trans_id absent' }, { status: 400 })
    }

    // `cpm_trans_id` est l'identifiant que nous avons transmis à l'initialisation
    // du paiement, c'est-à-dire l'identifiant du Payment.
    const payment = await prisma.payment.findUnique({ where: { id: transactionId } })
    if (!payment) {
      // 200 volontaire : la notification est authentique mais ne nous concerne
      // pas. Un code d'erreur ferait rejouer CinetPay indéfiniment.
      console.warn(`[webhook cinetpay] Transaction inconnue — ${transactionId}`)
      return NextResponse.json({ success: true, ignored: 'unknown-transaction' }, { status: 200 })
    }

    // Idempotence : CinetPay rejoue la notification tant qu'il n'a pas reçu un
    // 200, et peut l'émettre plusieurs fois pour un même encaissement.
    if (payment.status === 'COMPLETED') {
      return NextResponse.json({ success: true, alreadyProcessed: true }, { status: 200 })
    }

    const check = await checkCinetPayTransaction(transactionId)
    if (!check.ok) {
      console.error(`[webhook cinetpay] ${check.reason}`)
      // 502 : l'échec vient de la vérification, pas de l'appelant. CinetPay
      // rejouera, ce qui est le comportement voulu en cas d'indisponibilité.
      return NextResponse.json({ error: 'Vérification indisponible' }, { status: 502 })
    }

    const { status, amount, currency } = check.transaction
    const accepted = status === 'ACCEPTED'

    // Un montant ou une devise qui divergent de la commande signalent une
    // transaction rattachée à tort : on refuse d'encaisser plutôt que de livrer
    // sur un paiement partiel.
    if (accepted && (amount !== payment.amount || currency !== payment.currency)) {
      console.error(
        `[webhook cinetpay] Montant divergent pour ${transactionId} — ` +
          `attendu ${payment.amount} ${payment.currency}, reçu ${amount} ${currency}`,
      )
      await paymentsService.handleWebhook({
        paymentId: payment.id,
        status: 'FAILED',
        failureReason: 'Montant ou devise non conformes à la commande',
        rawPayload: Object.fromEntries(fields),
      })
      return NextResponse.json({ success: true, mismatch: true }, { status: 200 })
    }

    const result = await paymentsService.handleWebhook({
      paymentId: payment.id,
      status: accepted ? 'COMPLETED' : 'FAILED',
      transactionId: check.transaction.operatorId,
      failureReason: accepted ? undefined : `Statut CinetPay : ${status}`,
      rawPayload: { ...Object.fromEntries(fields), verified: check.transaction },
    })

    return NextResponse.json({ success: true, result }, { status: 200 })
  } catch (error) {
    return handleApiError(error)
  }
}
