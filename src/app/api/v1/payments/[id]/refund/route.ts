import { NextRequest } from 'next/server'
import { paymentsService } from '@/modules/payments/payments.service'
import { requireAuth } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth(request)
    const { id } = await params
    const body = await request.json()
    const result = await paymentsService.refund(id, body.reason || 'Refund requested')
    return successResponse(result, 'Refund processed')
  } catch (error) {
    return handleApiError(error)
  }
}
