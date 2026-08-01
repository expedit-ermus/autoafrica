import { NextRequest } from 'next/server'
import { financeService } from '@/modules/finance/finance.service'
import { requireAuth } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'
import { ValidationError } from '@/shared/errors'

type Context = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, context: Context) {
  try {
    const { id } = await context.params
    const invoice = await financeService.getInvoiceById(id)
    return successResponse(invoice)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, context: Context) {
  try {
    await requireAuth(request)
    const { id } = await context.params
    const body = await request.json()
    const invoice = await financeService.updateInvoice(id, body)
    return successResponse(invoice, 'Invoice updated')
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
    const invoice = await financeService.updateInvoiceStatus(id, body.status)
    return successResponse(invoice, 'Invoice status updated')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    await requireAuth(request)
    const { id } = await context.params
    const result = await financeService.removeInvoice(id)
    return successResponse(result, 'Invoice deleted')
  } catch (error) {
    return handleApiError(error)
  }
}
