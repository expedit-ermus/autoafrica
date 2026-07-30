import { NextRequest } from 'next/server'
import { crmService } from '@/modules/crm/crm.service'
import { requireAuth } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const customer = await crmService.getCustomer(id)
    return successResponse(customer)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth(request)
    const { id } = await params
    const body = await request.json()
    const customer = await crmService.updateCustomer(id, body)
    return successResponse(customer)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth(request)
    const { id } = await params
    await crmService.deleteCustomer(id)
    return successResponse({ success: true }, 'Customer deleted')
  } catch (error) {
    return handleApiError(error)
  }
}
