import { NextRequest } from 'next/server'
import { purchaseOrdersService } from '@/modules/purchase-orders/purchase-orders.service'
import { requireAuth } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filters = {
      search: searchParams.get('search') || undefined,
      supplierId: searchParams.get('supplierId') || undefined,
      status: searchParams.get('status') || undefined,
      minAmount: searchParams.get('minAmount') || undefined,
      maxAmount: searchParams.get('maxAmount') || undefined,
    }
    const pagination = {
      page: Number(searchParams.get('page')) || 1,
      pageSize: Number(searchParams.get('pageSize')) || 20,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || undefined,
    }
    const result = await purchaseOrdersService.list(filters, pagination)
    return successResponse(result)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    const body = await request.json()
    const order = await purchaseOrdersService.create(body, auth.userId)
    return successResponse(order, 'Purchase order created', 201)
  } catch (error) {
    return handleApiError(error)
  }
}
