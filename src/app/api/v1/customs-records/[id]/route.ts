import { NextRequest } from 'next/server'
import { customsRecordsService } from '@/modules/customs-records/customs-records.service'
import { requireAuth } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'
import { ValidationError } from '@/shared/errors'

type Context = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, context: Context) {
  try {
    const { id } = await context.params
    const record = await customsRecordsService.getById(id)
    return successResponse(record)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, context: Context) {
  try {
    await requireAuth(request)
    const { id } = await context.params
    const body = await request.json()
    const record = await customsRecordsService.update(id, body)
    return successResponse(record, 'Customs record updated')
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
    const record = await customsRecordsService.updateStatus(id, body.status)
    return successResponse(record, 'Customs record status updated')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    await requireAuth(request)
    const { id } = await context.params
    const result = await customsRecordsService.remove(id)
    return successResponse(result, 'Customs record deleted')
  } catch (error) {
    return handleApiError(error)
  }
}
