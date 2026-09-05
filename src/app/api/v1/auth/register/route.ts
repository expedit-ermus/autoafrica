import { NextRequest } from 'next/server'
import { authService } from '@/modules/auth/auth.service'
import { registerDto } from '@/modules/auth/dto/auth.dto'
import { enforceRateLimit } from '@/lib/rate-limit'
import { successResponse, handleApiError } from '@/shared/utils/response'

export async function POST(request: NextRequest) {
  try {
    const limited = enforceRateLimit(request, 'register')
    if (limited) return limited

    const body = await request.json()
    const data = registerDto.parse(body)
    const result = await authService.register(data)
    return successResponse(result, 'Registration successful', 201)
  } catch (error) {
    return handleApiError(error)
  }
}
