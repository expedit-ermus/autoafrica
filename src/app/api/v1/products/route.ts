import { NextRequest } from 'next/server'
import { productsService } from '@/modules/products/products.service'
import { requireAuth, requireActiveSeller } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filters = {
      brand: searchParams.get('brand') || undefined,
      model: searchParams.get('model') || undefined,
      category: searchParams.get('category') || undefined,
      country: searchParams.get('country') || undefined,
      search: searchParams.get('search') || undefined,
      condition: searchParams.get('condition') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    }
    const pagination = {
      page: Number(searchParams.get('page')) || 1,
      pageSize: Number(searchParams.get('pageSize')) || 20,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || undefined,
    }
    const result = await productsService.list(filters, pagination)
    const response = successResponse(result)
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    return response
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireActiveSeller(request)
    const body = await request.json()
    const product = await productsService.create(body, auth.userId)
    return successResponse(product, 'Product created', 201)
  } catch (error) {
    return handleApiError(error)
  }
}

