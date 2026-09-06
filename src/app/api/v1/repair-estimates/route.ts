import { NextResponse } from 'next/server'
import { repairEstimatorService, RepairLeadPayload } from '@/modules/repair-estimator/repair-estimator.service'
import { handleApiError } from '@/shared/utils/response'

export async function GET() {
  const options = repairEstimatorService.getOptions()
  const garages = repairEstimatorService.getGarages()
  return NextResponse.json({ options, garages })
}

export async function POST(request: Request) {
  try {
    const body: RepairLeadPayload = await request.json()

    if (!body.customerName || !body.customerPhone || !body.issueId) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants (nom, téléphone, problème)' },
        { status: 400 }
      )
    }

    const result = await repairEstimatorService.captureRepairLead(body)

    return NextResponse.json({
      success: true,
      message: 'Votre devis a été validé et votre RDV est enregistré !',
      data: result,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
