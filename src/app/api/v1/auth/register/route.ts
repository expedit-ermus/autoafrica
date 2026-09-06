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
    const response = successResponse(result, 'Registration successful', 201)
    // Meme contrat de session que /auth/login : sans ce cookie, le nouvel
    // inscrit etait renvoye vers le formulaire de connexion par le middleware
    // des l'arrivee sur /dashboard.
    response.cookies.set('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
    })
    return response
  } catch (error) {
    return handleApiError(error)
  }
}
