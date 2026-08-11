import { NextRequest, NextResponse } from 'next/server'
import { uemoaCustomsCalculator, CategoryCode } from '@/modules/customs-records/uemoa-customs.calculator'
import { handleApiError } from '@/shared/utils/response'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const cifValue = parseFloat(searchParams.get('cifValue') || '1000000')
    const category = (searchParams.get('category') || 'ENGINE_PARTS') as CategoryCode
    const incoterm = (searchParams.get('incoterm') || 'DDP') as 'DDU' | 'DDP'

    const breakdown = uemoaCustomsCalculator.calculateDuties(cifValue, category, incoterm)

    return NextResponse.json({
      success: true,
      breakdown,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const cifValue = parseFloat(body.cifValue || body.cifValueXof || '0')
    const category = (body.category || 'ENGINE_PARTS') as CategoryCode
    const incoterm = (body.incoterm || 'DDP') as 'DDU' | 'DDP'

    const breakdown = uemoaCustomsCalculator.calculateDuties(cifValue, category, incoterm)

    return NextResponse.json({
      success: true,
      message: 'Calcul des droits de douane UEMOA (DDU/DDP) effectué avec succès',
      breakdown,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
