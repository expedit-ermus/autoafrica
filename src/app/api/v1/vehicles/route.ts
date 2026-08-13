import { NextRequest } from 'next/server'
import { vehiclesService } from '@/modules/vehicles/vehicles.service'
import { requireAuth, requireActiveSeller } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filters = {
      brand: searchParams.get('brand') || undefined,
      model: searchParams.get('model') || undefined,
      country: searchParams.get('country') || undefined,
      city: searchParams.get('city') || undefined,
      search: searchParams.get('search') || undefined,
      condition: searchParams.get('condition') || undefined,
      fuel: searchParams.get('fuel') || undefined,
      gearbox: searchParams.get('gearbox') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      minYear: searchParams.get('minYear') ? Number(searchParams.get('minYear')) : undefined,
      maxYear: searchParams.get('maxYear') ? Number(searchParams.get('maxYear')) : undefined,
    }
    const pagination = {
      page: Number(searchParams.get('page')) || 1,
      pageSize: Number(searchParams.get('pageSize')) || 20,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || undefined,
    }
    const result = await vehiclesService.list(filters, pagination)
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
    const vehicle = await vehiclesService.create(body, auth.userId)
    return successResponse(vehicle, 'Vehicle created', 201)
  } catch (error) {
    return handleApiError(error)
  }
}

