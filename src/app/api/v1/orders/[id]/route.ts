import { NextRequest } from 'next/server'
import { ordersService } from '@/modules/orders/orders.service'
import { requireAuth } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const order = await ordersService.getById(id)
    return successResponse(order)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuth(request)
    const { id } = await params
    const body = await request.json()
    if (body.status) {
      const order = await ordersService.updateStatus(id, body.status, auth.userId)
      return successResponse(order)
    }
    if (body.cancel) {
      await ordersService.cancel(id, auth.userId, body.reason || '')
      return successResponse({ success: true }, 'Order cancelled')
    }
    return successResponse({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}
