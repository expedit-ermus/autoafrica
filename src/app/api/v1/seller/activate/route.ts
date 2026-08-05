import { NextRequest } from 'next/server'
import { sellerService } from '@/modules/seller/seller.service'
import { activateSellerDto } from '@/modules/seller/dto/seller.dto'
import { requireAuth } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    const body = await request.json()
    const data = activateSellerDto.parse(body)
    const result = await sellerService.activate(auth.userId, data)
    return successResponse(result, 'Selling enabled', 201)
  } catch (error) {
    return handleApiError(error)
  }
}
