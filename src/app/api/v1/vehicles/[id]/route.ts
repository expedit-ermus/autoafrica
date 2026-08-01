import { NextRequest } from 'next/server'
import { vehiclesService } from '@/modules/vehicles/vehicles.service'
import { requireAuth } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const vehicle = await vehiclesService.getById(id)
    const response = successResponse(vehicle)
    response.headers.set('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=600')
    return response
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuth(request)
    const { id } = await params
    const body = await request.json()
    const vehicle = await vehiclesService.update(id, body, auth.userId)
    return successResponse(vehicle)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuth(request)
    const { id } = await params
    await vehiclesService.delete(id, auth.userId)
    return successResponse({ success: true }, 'Vehicle deleted')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuth(request)
    const { id } = await params
    const body = await request.json()
    const result = await vehiclesService.setStatus(id, body.status, auth.userId)
    return successResponse(result)
  } catch (error) {
    return handleApiError(error)
  }
}
