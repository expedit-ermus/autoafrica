import { NextRequest } from 'next/server'
import { notificationService } from '@/modules/notifications/notifications.service'
import { requireAuth } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    const body = await request.json().catch(() => ({}))
    const ids = Array.isArray(body?.ids) ? body.ids : []
    const result =
      ids.length > 0
        ? await notificationService.markAsRead(auth.userId, ids)
        : await notificationService.markAllAsRead(auth.userId)
    return successResponse(result, 'Marked as read')
  } catch (error) {
    return handleApiError(error)
  }
}
