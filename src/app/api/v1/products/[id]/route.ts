import { NextRequest } from 'next/server'
import { productsService } from '@/modules/products/products.service'
import { requireAuth } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const product = await productsService.getById(id)
    const response = successResponse(product)
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
    const product = await productsService.update(id, body, auth.userId)
    return successResponse(product)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuth(request)
    const { id } = await params
    await productsService.delete(id, auth.userId)
    return successResponse({ success: true }, 'Product deleted')
  } catch (error) {
    return handleApiError(error)
  }
}
