import { NextRequest } from 'next/server'
import { sellerService } from '@/modules/seller/seller.service'
import { updateSellerProfileDto } from '@/modules/seller/dto/seller.dto'
import { requireAuth } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    const profile = await sellerService.getProfile(auth.userId)
    return successResponse(profile)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    const body = await request.json()
    const data = updateSellerProfileDto.parse(body)
    const profile = await sellerService.updateProfile(auth.userId, data)
    return successResponse(profile, 'Seller profile updated')
  } catch (error) {
    return handleApiError(error)
  }
}
