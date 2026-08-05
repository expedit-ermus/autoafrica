import { prisma } from '@/lib/prisma'
import { NotFoundError } from '@/shared/errors'
import { ActivateSellerInput, UpdateSellerProfileInput } from './dto/seller.dto'

const SELLER_PROFILE_SELECT = {
  id: true,
  userId: true,
  businessName: true,
  displayName: true,
  businessType: true,
  city: true,
  phoneForOrders: true,
  payoutMethod: true,
  payoutNumber: true,
  verified: true,
  rating: true,
  reviewCount: true,
  totalSales: true,
  totalRevenue: true,
} as const

export class SellerService {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        shopName: true,
        country: true,
        city: true,
        sellerEnabled: true,
        sellerProfile: { select: SELLER_PROFILE_SELECT },
      },
    })
    if (!user) throw new NotFoundError('User', userId)
    return user
  }

  async activate(userId: string, data: ActivateSellerInput) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new NotFoundError('User', userId)

    const sellerProfile = await prisma.sellerProfile.upsert({
      where: { userId },
      create: {
        userId,
        businessName: data.displayName,
        displayName: data.displayName,
        city: data.city,
        phoneForOrders: data.phoneForOrders,
        payoutMethod: data.payoutMethod,
        payoutNumber: data.payoutNumber,
      },
      update: {
        displayName: data.displayName,
        businessName: data.displayName,
        city: data.city,
        phoneForOrders: data.phoneForOrders,
        payoutMethod: data.payoutMethod,
        payoutNumber: data.payoutNumber,
      },
      select: SELLER_PROFILE_SELECT,
    })

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { sellerEnabled: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        shopName: true,
        country: true,
        city: true,
        role: true,
        sellerEnabled: true,
      },
    })

    return { user: updatedUser, sellerProfile }
  }

  async updateProfile(userId: string, data: UpdateSellerProfileInput) {
    const existing = await prisma.sellerProfile.findUnique({ where: { userId } })
    if (!existing) throw new NotFoundError('SellerProfile', userId)

    const sellerProfile = await prisma.sellerProfile.update({
      where: { userId },
      data: {
        displayName: data.displayName,
        city: data.city,
        phoneForOrders: data.phoneForOrders,
        payoutMethod: data.payoutMethod,
        payoutNumber: data.payoutNumber,
      },
      select: SELLER_PROFILE_SELECT,
    })

    return sellerProfile
  }
}

export const sellerService = new SellerService()
