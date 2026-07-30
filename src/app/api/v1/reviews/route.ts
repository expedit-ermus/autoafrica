import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    if (!productId) return successResponse({ data: [], total: 0, averageRating: 0 })

    const reviews = await prisma.review.findMany({
      where: { productId, active: true },
      orderBy: { createdAt: 'desc' },
    })

    const userIds = [...new Set(reviews.map((r: any) => r.userId))]
    const users = userIds.length > 0 ? await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, firstName: true, lastName: true, shopName: true },
    }) : []
    const userMap = new Map(users.map((u: any) => [u.id, u]))

    const enriched = reviews.map((r: any) => ({
      ...r,
      author: userMap.get(r.userId) || { firstName: 'Utilisateur', lastName: '' },
    }))

    const avg = reviews.length > 0 ? reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length : 0

    return successResponse({ data: enriched, total: reviews.length, averageRating: Math.round(avg * 10) / 10 })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    const body = await request.json()

    const existing = await prisma.review.findFirst({
      where: { productId: body.productId, userId: auth.userId },
    })
    if (existing) return handleApiError(new Error('Vous avez déjà laissé un avis'))

    const review = await prisma.review.create({
      data: {
        productId: body.productId,
        userId: auth.userId,
        rating: body.rating,
        title: body.title || '',
        content: body.comment || '',
      },
    })

    return successResponse(review, 'Avis publié', 201)
  } catch (error) {
    return handleApiError(error)
  }
}
