import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateToken, hashPassword } from '@/lib/auth'
import { successResponse, handleApiError } from '@/shared/utils/response'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const provider = body.provider || 'google'
    const role = body.role || 'BUYER'

    // Mock social profile payload if not provided (for Seamless OAuth demo)
    const email = body.email || `user.${provider}.${Date.now()}@gmail.com`
    const name = body.name || (provider === 'google' ? 'Utilisateur Google' : 'Utilisateur Facebook')
    const [firstName, ...lastNameParts] = name.split(' ')
    const lastName = lastNameParts.join(' ') || 'Social'

    let user: { id: string; email: string; firstName: string; lastName: string; role: string; status: string; country: string }

    try {
      let dbUser = await prisma.user.findUnique({
        where: { email },
      })

      if (!dbUser) {
        const dummyPassword = await hashPassword(`social_${Date.now()}_${Math.random()}`)
        dbUser = await prisma.user.create({
          data: {
            email,
            password: dummyPassword,
            firstName,
            lastName,
            role,
            status: role === 'SELLER' ? 'PENDING_VERIFICATION' : 'ACTIVE',
            sellerEnabled: role === 'SELLER',
            emailVerified: true,
            country: 'CI',
          },
        })
      }

      user = {
        id: dbUser.id,
        email: dbUser.email,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        role: dbUser.role,
        status: dbUser.status,
        country: dbUser.country,
      }
    } catch (dbError) {
      console.warn('DB write warning during social auth (using fallback profile):', dbError)
      user = {
        id: `usr_social_${Date.now()}`,
        email,
        firstName,
        lastName,
        role,
        status: role === 'SELLER' ? 'PENDING_VERIFICATION' : 'ACTIVE',
        country: 'CI',
      }
    }

    const token = generateToken(user.id, user.role, user.status)

    const response = successResponse({ user, token }, `Connexion avec ${provider === 'google' ? 'Google' : 'Facebook'} réussie`)

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (error) {
    return handleApiError(error)
  }
}
