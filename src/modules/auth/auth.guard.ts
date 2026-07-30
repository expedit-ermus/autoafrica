import { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { UnauthorizedError, ForbiddenError } from '@/shared/errors'

export async function requireAuth(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  if (!token) throw new UnauthorizedError('Authentication required')

  const payload = verifyToken(token)
  if (!payload) throw new UnauthorizedError('Invalid token')

  return payload
}

export async function requireRole(request: NextRequest, roles: string[]) {
  const auth = await requireAuth(request)
  if (!roles.includes(auth.role || '')) {
    throw new ForbiddenError(`Required role: ${roles.join(' or ')}`)
  }
  return auth
}

export async function optionalAuth(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  if (!token) return null
  const payload = verifyToken(token)
  return payload
}
