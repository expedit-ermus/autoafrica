import { NextRequest, NextResponse } from 'next/server'
import { containerTrackingService } from '@/modules/containers/container-tracking.service'
import { handleApiError } from '@/shared/utils/response'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const number = searchParams.get('number') || searchParams.get('containerNumber') || 'CMAU9876543'

    const info = await containerTrackingService.trackContainer(number)

    return NextResponse.json({
      success: true,
      info,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const containerNumber = body.containerNumber || body.number

    if (!containerNumber) {
      return NextResponse.json(
        { success: false, message: 'Le numéro de conteneur est requis' },
        { status: 400 },
      )
    }

    const info = await containerTrackingService.trackContainer(containerNumber)

    return NextResponse.json({
      success: true,
      info,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
