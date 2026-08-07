import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { NotFoundError, ValidationError } from '@/shared/errors'
import { getPaginationParams, buildPaginatedResponse } from '@/shared/utils/pagination'
import { PaginationParams } from '@/shared/types'

export interface CreateReviewInput {
  userId: string
  productId: string
  rating: number
  title?: string
  content?: string
}

function validateRating(rating: number) {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new ValidationError('La note doit être un entier entre 1 et 5')
  }
}

export class ReviewsService {
  async listReviews(productId: string, pagination: PaginationParams) {
    const { page, pageSize, skip, orderBy } = getPaginationParams(pagination)

    if (!productId) {
      return {
        ...buildPaginatedResponse([], 0, page, pageSize),
        averageRating: 0,
        ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      }
    }

    const where: Prisma.ReviewWhereInput = { productId, active: true }

    const [reviews, total, agg] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
      }),
      prisma.review.count({ where }),
      prisma.review.aggregate({ where, _avg: { rating: true } }),
    ])

    const ratingCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    for (const r of reviews) {
      ratingCounts[r.rating] = (ratingCounts[r.rating] || 0) + 1
    }

    const averageRating = agg._avg.rating ? Math.round(agg._avg.rating * 10) / 10 : 0

    const userIds = [...new Set(reviews.map((r: { userId: string }) => r.userId))]
    const users = userIds.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, firstName: true, lastName: true, shopName: true },
        })
      : []
    const userMap = new Map(users.map((u: { id: string; firstName?: string; lastName?: string; shopName?: string | null }) => [u.id, u]))

    const enriched = reviews.map((r: { content?: string | null; userId: string; [key: string]: unknown }) => ({
      ...r,
      comment: r.content,
      author: userMap.get(r.userId) || { firstName: 'Utilisateur', lastName: '' },
    }))

    return {
      ...buildPaginatedResponse(enriched, total, page, pageSize),
      averageRating,
      ratingCounts,
    }
  }

  async createReview(data: CreateReviewInput) {
    if (!data.productId) throw new ValidationError('Un produit est requis')
    if (!data.userId) throw new ValidationError('Un utilisateur est requis')
    validateRating(data.rating)
    if (!data.content || data.content.trim() === '') {
      throw new ValidationError('Le commentaire est requis')
    }

    const product = await prisma.product.findUnique({ where: { id: data.productId } })
    if (!product) throw new NotFoundError('Product', data.productId)

    const existing = await prisma.review.findFirst({
      where: { productId: data.productId, userId: data.userId },
    })
    if (existing) throw new ValidationError('Vous avez déjà laissé un avis pour ce produit')

    const review = await prisma.review.create({
      data: {
        productId: data.productId,
        userId: data.userId,
        rating: data.rating,
        title: data.title || '',
        content: data.content,
        verified: false,
      },
    })

    return review
  }
}

export const reviewsService = new ReviewsService()
