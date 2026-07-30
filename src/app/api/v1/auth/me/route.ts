import { NextRequest } from 'next/server'
import { authService } from '@/modules/auth/auth.service'
import { requireAuth } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    const user = await authService.me(auth.userId)
    return successResponse(user)
  } catch (error) {
    return handleApiError(error)
  }
}
