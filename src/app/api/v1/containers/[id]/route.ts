import { NextRequest } from 'next/server'
import { containersService } from '@/modules/containers/containers.service'
import { requireAuth } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'
import { ValidationError } from '@/shared/errors'

type Context = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, context: Context) {
  try {
    const { id } = await context.params
    const container = await containersService.getById(id)
    return successResponse(container)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, context: Context) {
  try {
    await requireAuth(request)
    const { id } = await context.params
    const body = await request.json()
    const container = await containersService.update(id, body)
    return successResponse(container, 'Container updated')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  try {
    await requireAuth(request)
    const { id } = await context.params
    const body = await request.json()
    if (!body.status) {
      return handleApiError(new ValidationError('Status is required'))
    }
    const container = await containersService.updateStatus(id, body.status)
    return successResponse(container, 'Container status updated')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    await requireAuth(request)
    const { id } = await context.params
    const result = await containersService.remove(id)
    return successResponse(result, 'Container deleted')
  } catch (error) {
    return handleApiError(error)
  }
}
