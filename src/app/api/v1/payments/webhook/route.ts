import { NextRequest, NextResponse } from 'next/server'
import { paymentsService } from '@/modules/payments/payments.service'
import { handleApiError } from '@/shared/utils/response'

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()

    // Support both standardized & operator-specific webhook payloads
    const paymentId = payload.paymentId || payload.reference || payload.order_id || payload.data?.reference
    const status = payload.status === 'COMPLETED' || payload.status === 'SUCCESSFUL' || payload.type === 'payment.succeeded' ? 'COMPLETED' : 'FAILED'
    const transactionId = payload.transactionId || payload.id || payload.data?.id
    const failureReason = payload.failureReason || payload.error_message || payload.error

    if (!paymentId) {
      return NextResponse.json({ error: 'Missing payment reference in webhook payload' }, { status: 400 })
    }

    const result = await paymentsService.handleWebhook({
      paymentId,
      status,
      transactionId,
      failureReason,
      rawPayload: payload,
    })

    return NextResponse.json({ success: true, result }, { status: 200 })
  } catch (error) {
    return handleApiError(error)
  }
}
