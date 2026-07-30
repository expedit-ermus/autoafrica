import { NextRequest } from 'next/server'
import { crmService } from '@/modules/crm/crm.service'
import { requireAuth } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth(request)
    const { id } = await params
    const body = await request.json()
    const lead = await crmService.updateLeadStatus(id, body.status)
    return successResponse(lead)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth(request)
    const { id } = await params
    await crmService.deleteLead(id)
    return successResponse({ success: true }, 'Lead deleted')
  } catch (error) {
    return handleApiError(error)
  }
}
