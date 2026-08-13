import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, ['SUPER_ADMIN', 'TENANT_ADMIN', 'MODERATOR', 'SUPPORT'])

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const pageSize = parseInt(searchParams.get('pageSize') || '50', 10)

    const where: Record<string, unknown> = {}
    if (role) where.role = role
    if (status) where.status = status
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { shopName: { contains: search } },
      ]
    }

    const users = await prisma.user.findMany({
      where,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        status: true,
        country: true,
        city: true,
        shopName: true,
        sellerEnabled: true,
        createdAt: true,
        updatedAt: true,
        sellerProfile: {
          select: {
            businessName: true,
            displayName: true,
            businessType: true,
            city: true,
            phoneForOrders: true,
            payoutMethod: true,
            payoutNumber: true,
            verified: true,
          },
        },
      },
    })

    return successResponse({ data: users, total: users.length })
  } catch (error) {
    return handleApiError(error)
  }
}
