import { NextRequest } from 'next/server'
import { deliveryService } from '@/modules/delivery/delivery.service'
import { requireAuth } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filters = {
      search: searchParams.get('search') || undefined,
      status: searchParams.get('status') || undefined,
      country: searchParams.get('country') || undefined,
    }
    const pagination = {
      page: Number(searchParams.get('page')) || 1,
      pageSize: Number(searchParams.get('pageSize')) || 20,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || undefined,
    }
    const result = await deliveryService.listRoutes(filters, pagination)
    return successResponse(result)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request)
    const body = await request.json()
    const route = await deliveryService.createRoute(body)
    return successResponse(route, 'Delivery route created', 201)
  } catch (error) {
    return handleApiError(error)
  }
}
