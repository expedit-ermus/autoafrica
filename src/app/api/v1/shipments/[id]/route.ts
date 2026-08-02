import { NextRequest } from 'next/server'
import { deliveryService } from '@/modules/delivery/delivery.service'
import { requireAuth } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'
import { ValidationError } from '@/shared/errors'

type Context = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, context: Context) {
  try {
    const { id } = await context.params
    const shipment = await deliveryService.getShipmentById(id)
    return successResponse(shipment)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, context: Context) {
  try {
    await requireAuth(request)
    const { id } = await context.params
    const body = await request.json()
    const shipment = await deliveryService.updateShipment(id, body)
    return successResponse(shipment, 'Shipment updated')
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
    const shipment = await deliveryService.updateShipmentStatus(id, body.status)
    return successResponse(shipment, 'Shipment status updated')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    await requireAuth(request)
    const { id } = await context.params
    const result = await deliveryService.removeShipment(id)
    return successResponse(result, 'Shipment deleted')
  } catch (error) {
    return handleApiError(error)
  }
}
