import { NextRequest } from 'next/server'
import { authService } from '@/modules/auth/auth.service'
import { requireAuth } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    await authService.logout(auth.userId)
    const response = successResponse({ success: true }, 'Logged out')
    response.cookies.set('token', '', { maxAge: 0 })
    return response
  } catch (error) {
    return handleApiError(error)
  }
}
