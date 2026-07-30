import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    const body = await request.json()

    if (body.id) {
      await prisma.notification.updateMany({
        where: { id: body.id, userId: auth.userId },
        data: { read: true, readAt: new Date() },
      })
    } else {
      await prisma.notification.updateMany({
        where: { userId: auth.userId, read: false },
        data: { read: true, readAt: new Date() },
      })
    }

    return successResponse({ success: true })
  } catch (error) {
    return handleApiError(error)
  }
}
