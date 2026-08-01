import { NextRequest } from 'next/server'
import { inventoryService } from '@/modules/inventory/inventory.service'
import { requireAuth } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'

type Context = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, context: Context) {
  try {
    const { id } = await context.params
    const item = await inventoryService.getInventoryById(id)
    return successResponse(item)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  try {
    const auth = await requireAuth(request)
    const { id } = await context.params
    const body = await request.json()
    const item = await inventoryService.adjustInventory(id, body, auth.userId)
    return successResponse(item, 'Inventory updated')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    await requireAuth(request)
    const { id } = await context.params
    const result = await inventoryService.removeInventory(id)
    return successResponse(result, 'Inventory line deleted')
  } catch (error) {
    return handleApiError(error)
  }
}
