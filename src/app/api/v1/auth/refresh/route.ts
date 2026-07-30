import { NextRequest } from 'next/server'
import { authService } from '@/modules/auth/auth.service'
import { refreshTokenDto } from '@/modules/auth/dto/auth.dto'
import { successResponse, handleApiError } from '@/shared/utils/response'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = refreshTokenDto.parse(body)
    const result = await authService.refresh(data.refreshToken)
    return successResponse(result)
  } catch (error) {
    return handleApiError(error)
  }
}
