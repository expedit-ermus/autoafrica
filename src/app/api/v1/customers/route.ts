import { NextRequest, NextResponse } from 'next/server'
import { crmService } from '@/modules/crm/crm.service'
import { requireAuth } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filters = {
      search: searchParams.get('search') || undefined,
      type: searchParams.get('type') || undefined,
      country: searchParams.get('country') || undefined,
      segment: searchParams.get('segment') || undefined,
    }
    const pagination = {
      page: Number(searchParams.get('page')) || 1,
      pageSize: Number(searchParams.get('pageSize')) || 50,
    }
    const result = await crmService.listCustomers(filters, pagination)
    return successResponse(result)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth(request)
    const body = await request.json()
    const customer = await crmService.createCustomer(body)
    return successResponse(customer, 'Customer created', 201)
  } catch (error) {
    return handleApiError(error)
  }
}
