import { NextRequest } from 'next/server'
import { suppliersService } from '@/modules/suppliers/suppliers.service'
import { requireAuth } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'

type Context = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, context: Context) {
  try {
    const { id } = await context.params
    const supplier = await suppliersService.getById(id)
    return successResponse(supplier)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, context: Context) {
  try {
    await requireAuth(request)
    const { id } = await context.params
    const body = await request.json()
    const supplier = await suppliersService.update(id, body)
    return successResponse(supplier, 'Supplier updated')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    await requireAuth(request)
    const { id } = await context.params
    const result = await suppliersService.remove(id)
    return successResponse(result, 'Supplier deleted')
  } catch (error) {
    return handleApiError(error)
  }
}
