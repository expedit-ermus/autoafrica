import { NextRequest } from 'next/server'
import { authService } from '@/modules/auth/auth.service'
import { loginDto } from '@/modules/auth/dto/auth.dto'
import { enforceRateLimit } from '@/lib/rate-limit'
import { successResponse, handleApiError } from '@/shared/utils/response'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = loginDto.parse(body)

    // Freine le bourrage de mots de passe. La cle combine IP et e-mail vise :
    // changer d'IP ne relance pas le compteur du compte attaque.
    const limited = enforceRateLimit(request, 'login', data.email)
    if (limited) return limited

    const result = await authService.login(data)
    const response = successResponse(result, 'Login successful')
    response.cookies.set('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      // Aligne sur la duree de vie du JWT (24 h) : un cookie plus long
      // laissait l'utilisateur avec une session qui semble active mais rejetee.
      maxAge: 24 * 60 * 60,
    })
    return response
  } catch (error) {
    return handleApiError(error)
  }
}
