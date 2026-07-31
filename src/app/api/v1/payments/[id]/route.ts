import { NextRequest } from 'next/server'
import { paymentsService } from '@/modules/payments/payments.service'
import { successResponse, handleApiError } from '@/shared/utils/response'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const payment = await paymentsService.getStatus(id)
    return successResponse(payment)
  } catch (error) {
    return handleApiError(error)
  }
}
