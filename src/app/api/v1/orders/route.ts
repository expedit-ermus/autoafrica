import { NextRequest } from 'next/server'
import { ordersService } from '@/modules/orders/orders.service'
import { requireAuth } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    const { searchParams } = new URL(request.url)
    const filters = {
      status: searchParams.get('status') || undefined,
      paymentStatus: searchParams.get('paymentStatus') || undefined,
    }
    const pagination = {
      page: Number(searchParams.get('page')) || 1,
      pageSize: Number(searchParams.get('pageSize')) || 20,
    }

    const result = auth.role === 'SELLER'
      ? await ordersService.getSellerOrders(auth.userId, pagination)
      : await ordersService.list(filters, pagination)
    const response = successResponse(result)
    response.headers.set('Cache-Control', 'private, s-maxage=30, stale-while-revalidate=120')
    return response
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    const body = await request.json()
    const order = await ordersService.create(body, auth.userId)
    return successResponse(order, 'Order created', 201)
  } catch (error) {
    return handleApiError(error)
  }
}
