import { NextRequest } from 'next/server'
import { analyticsService } from '@/modules/analytics/analytics.service'
import { requireAuth } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request)
    const { searchParams } = new URL(request.url)
    const from = searchParams.get('from') ? new Date(searchParams.get('from') as string) : undefined
    const to = searchParams.get('to') ? new Date(searchParams.get('to') as string) : undefined

    const stats = await analyticsService.getStats({ from, to })
    return successResponse(stats)
  } catch (error) {
    return handleApiError(error)
  }
}
