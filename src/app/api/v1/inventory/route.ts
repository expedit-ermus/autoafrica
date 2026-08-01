import { NextRequest } from 'next/server'
import { inventoryService } from '@/modules/inventory/inventory.service'
import { requireAuth } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filters = {
      search: searchParams.get('search') || undefined,
      warehouseId: searchParams.get('warehouseId') || undefined,
      productId: searchParams.get('productId') || undefined,
      stockStatus: searchParams.get('stockStatus') || undefined,
    }
    const pagination = {
      page: Number(searchParams.get('page')) || 1,
      pageSize: Number(searchParams.get('pageSize')) || 20,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || undefined,
    }
    const result = await inventoryService.listInventory(filters, pagination)
    return successResponse(result)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    const body = await request.json()
    const item = await inventoryService.createInventory(body, auth.userId)
    return successResponse(item, 'Inventory line created', 201)
  } catch (error) {
    return handleApiError(error)
  }
}
