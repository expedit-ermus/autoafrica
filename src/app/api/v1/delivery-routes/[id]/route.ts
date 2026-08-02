import { NextRequest } from 'next/server'
import { deliveryService } from '@/modules/delivery/delivery.service'
import { requireAuth } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'
import { ValidationError } from '@/shared/errors'

type Context = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, context: Context) {
  try {
    const { id } = await context.params
    const route = await deliveryService.getRouteById(id)
    return successResponse(route)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, context: Context) {
  try {
    await requireAuth(request)
    const { id } = await context.params
    const body = await request.json()
    const route = await deliveryService.updateRoute(id, body)
    return successResponse(route, 'Delivery route updated')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  try {
    await requireAuth(request)
    const { id } = await context.params
    const body = await request.json()
    if (!body.status) {
      return handleApiError(new ValidationError('Status is required'))
    }
    const route = await deliveryService.updateRouteStatus(id, body.status)
    return successResponse(route, 'Delivery route status updated')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    await requireAuth(request)
    const { id } = await context.params
    const result = await deliveryService.removeRoute(id)
    return successResponse(result, 'Delivery route deleted')
  } catch (error) {
    return handleApiError(error)
  }
}
