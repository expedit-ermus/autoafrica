import { NextRequest } from 'next/server'
import { authService } from '@/modules/auth/auth.service'
import { loginDto } from '@/modules/auth/dto/auth.dto'
import { successResponse, handleApiError } from '@/shared/utils/response'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = loginDto.parse(body)
    const result = await authService.login(data)
    const response = successResponse(result, 'Login successful')
    response.cookies.set('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    })
    return response
  } catch (error) {
    return handleApiError(error)
  }
}
