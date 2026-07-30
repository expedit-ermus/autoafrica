import { NextRequest } from 'next/server'
import { paymentsService } from '@/modules/payments/payments.service'
import { requireAuth } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    const body = await request.json()
    const result = await paymentsService.process(body, auth.userId)
    return successResponse(result, 'Payment processed')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    const payments = await paymentsService.list(auth.userId)
    const response = successResponse(payments)
    response.headers.set('Cache-Control', 'private, s-maxage=30, stale-while-revalidate=120')
    return response
  } catch (error) {
    return handleApiError(error)
  }
}
