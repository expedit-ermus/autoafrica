import { NextRequest } from 'next/server'
import { notificationService } from '@/modules/notifications/notifications.service'
import { requireAuth } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    const { searchParams } = new URL(request.url)
    const filters = {
      read: searchParams.get('read') || undefined,
      type: searchParams.get('type') || undefined,
      search: searchParams.get('search') || undefined,
    }
    const pagination = {
      page: Number(searchParams.get('page')) || 1,
      pageSize: Number(searchParams.get('pageSize')) || 20,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || undefined,
    }
    const result = await notificationService.listNotifications(auth.userId, filters, pagination)
    return successResponse(result)
  } catch (error) {
    return handleApiError(error)
  }
}
