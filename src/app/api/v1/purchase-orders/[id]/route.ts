import { NextRequest } from 'next/server'
import { purchaseOrdersService } from '@/modules/purchase-orders/purchase-orders.service'
import { requireAuth } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'
import { ValidationError } from '@/shared/errors'

type Context = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, context: Context) {
  try {
    const { id } = await context.params
    const order = await purchaseOrdersService.getById(id)
    return successResponse(order)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, context: Context) {
  try {
    await requireAuth(request)
    const { id } = await context.params
    const body = await request.json()
    const order = await purchaseOrdersService.update(id, body)
    return successResponse(order, 'Purchase order updated')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  try {
    const auth = await requireAuth(request)
    const { id } = await context.params
    const body = await request.json()
    if (!body.status) {
      return handleApiError(new ValidationError('Status is required'))
    }
    const order = await purchaseOrdersService.updateStatus(id, body.status, auth.userId)
    return successResponse(order, 'Purchase order status updated')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    await requireAuth(request)
    const { id } = await context.params
    const result = await purchaseOrdersService.remove(id)
    return successResponse(result, 'Purchase order deleted')
  } catch (error) {
    return handleApiError(error)
  }
}
