import { NextRequest } from 'next/server'
import { financeService } from '@/modules/finance/finance.service'
import { requireAuth } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'

type Context = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, context: Context) {
  try {
    const { id } = await context.params
    const account = await financeService.getAccountById(id)
    return successResponse(account)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, context: Context) {
  try {
    await requireAuth(request)
    const { id } = await context.params
    const body = await request.json()
    const account = await financeService.updateAccount(id, body)
    return successResponse(account, 'Account updated')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    await requireAuth(request)
    const { id } = await context.params
    const result = await financeService.removeAccount(id)
    return successResponse(result, 'Account deleted')
  } catch (error) {
    return handleApiError(error)
  }
}
