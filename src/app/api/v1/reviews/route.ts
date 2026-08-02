import { NextRequest } from 'next/server'
import { reviewsService } from '@/modules/reviews/reviews.service'
import { requireAuth } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId') || ''
    const pagination = {
      page: Number(searchParams.get('page')) || 1,
      pageSize: Number(searchParams.get('pageSize')) || 20,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || undefined,
    }
    const result = await reviewsService.listReviews(productId, pagination)
    return successResponse(result)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    const body = await request.json()

    const review = await reviewsService.createReview({
      userId: auth.userId,
      productId: body.productId,
      rating: Number(body.rating),
      title: body.title,
      content: body.comment || body.content,
    })

    return successResponse(review, 'Avis publié', 201)
  } catch (error) {
    return handleApiError(error)
  }
}
