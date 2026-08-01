import { NextRequest } from 'next/server'
import { inventoryService } from '@/modules/inventory/inventory.service'
import { requireAuth } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    const body = await request.json()
    const result = await inventoryService.transferStock(body, auth.userId)
    return successResponse(result, 'Stock transferred')
  } catch (error) {
    return handleApiError(error)
  }
}
