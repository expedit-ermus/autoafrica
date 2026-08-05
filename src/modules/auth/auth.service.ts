import { prisma } from '@/lib/prisma'
import { hashPassword, verifyPassword, generateToken } from '@/lib/auth'
import { ConflictError, UnauthorizedError, NotFoundError } from '@/shared/errors'
import { generateRefreshToken, generateOtp } from './auth.utils'

interface RegisterInput {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  country: string
  city?: string
  shopName?: string
  role?: 'SELLER' | 'BUYER'
}

interface LoginInput {
  email: string
  password: string
}

export class AuthService {
  async register(data: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) throw new ConflictError('Email already registered')

    const hashedPassword = await hashPassword(data.password)
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        country: data.country,
        city: data.city,
        shopName: data.shopName,
        role: data.role || 'BUYER',
      },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        role: true, country: true, city: true, shopName: true,
      },
    })

    const token = generateToken(user.id, user.role)
    const refreshToken = await generateRefreshToken(user.id)

    return { user, token, refreshToken }
  }

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: data.email } })
    if (!user) throw new UnauthorizedError('Invalid credentials')

    const isValid = await verifyPassword(data.password, user.password)
    if (!isValid) throw new UnauthorizedError('Invalid credentials')

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    const token = generateToken(user.id, user.role)
    const refreshToken = await generateRefreshToken(user.id)

    const { password, ...userWithoutPassword } = user
    void password
    return { user: userWithoutPassword, token, refreshToken }
  }

  async refresh(refreshToken: string) {
    const stored = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    })

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedError('Invalid refresh token')
    }

    await prisma.refreshToken.delete({ where: { id: stored.id } })

    const newToken = generateToken(stored.userId, stored.user.role)
    const newRefreshToken = await generateRefreshToken(stored.userId)

    return { token: newToken, refreshToken: newRefreshToken }
  }

  async logout(userId: string) {
    await prisma.refreshToken.deleteMany({ where: { userId } })
    return { success: true }
  }

  async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        phone: true, country: true, city: true, shopName: true,
        role: true, status: true, mfaEnabled: true, createdAt: true,
        sellerEnabled: true,
        sellerProfile: {
          select: {
            id: true, businessName: true, displayName: true,
            city: true, phoneForOrders: true, payoutMethod: true,
            payoutNumber: true, verified: true, rating: true, reviewCount: true,
          },
        },
      },
    })
    if (!user) throw new NotFoundError('User', userId)
    return user
  }

  async enableMfa(userId: string) {
    const secret = generateOtp()
    await prisma.user.update({
      where: { id: userId },
      data: { mfaSecret: secret },
    })
    return { secret }
  }

  async verifyMfa(userId: string, code: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user || !user.mfaSecret) throw new UnauthorizedError('MFA not enabled')
    if (user.mfaSecret !== code) throw new UnauthorizedError('Invalid MFA code')
    await prisma.user.update({
      where: { id: userId },
      data: { mfaEnabled: true },
    })
    return { success: true }
  }
}

export const authService = new AuthService()
