import { NextRequest, NextResponse } from 'next/server'
import { paymentsService } from '@/modules/payments/payments.service'
import { verifyWebhookSignature } from '@/lib/webhook-signature'
import { enforceRateLimit } from '@/lib/rate-limit'
import { handleApiError } from '@/shared/utils/response'

export async function POST(req: NextRequest) {
  try {
    const limited = enforceRateLimit(req, 'webhook')
    if (limited) return limited

    // Corps brut requis : le HMAC porte sur les octets reçus, pas sur un JSON re-sérialisé.
    const rawBody = await req.text()

    const verification = verifyWebhookSignature(req.headers, rawBody)
    if (!verification.ok) {
      // Pas de détail renvoyé à l'appelant : inutile de l'aider à forger une signature.
      console.warn(`[webhook] Rejeté — ${verification.reason}`)
      return NextResponse.json({ error: 'Webhook non autorisé' }, { status: verification.status })
    }

    let payload: Record<string, unknown> & { data?: Record<string, unknown> }
    try {
      payload = JSON.parse(rawBody)
    } catch {
      return NextResponse.json({ error: 'Corps JSON invalide' }, { status: 400 })
    }

    // Support both standardized & operator-specific webhook payloads
    const paymentId = payload.paymentId || payload.reference || payload.order_id || payload.data?.reference
    const status = payload.status === 'COMPLETED' || payload.status === 'SUCCESSFUL' || payload.type === 'payment.succeeded' ? 'COMPLETED' : 'FAILED'
    const transactionId = payload.transactionId || payload.id || payload.data?.id
    const failureReason = payload.failureReason || payload.error_message || payload.error

    if (!paymentId) {
      return NextResponse.json({ error: 'Missing payment reference in webhook payload' }, { status: 400 })
    }

    const result = await paymentsService.handleWebhook({
      paymentId: String(paymentId),
      status,
      transactionId: transactionId ? String(transactionId) : undefined,
      failureReason: failureReason ? String(failureReason) : undefined,
      rawPayload: payload,
    })

    return NextResponse.json({ success: true, result }, { status: 200 })
  } catch (error) {
    return handleApiError(error)
  }
}
