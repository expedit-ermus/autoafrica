import { NextResponse } from 'next/server'
import { smartReplenishmentService } from '@/modules/inventory/smart-replenishment.service'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get('tenantId') || undefined

    const predictions = await smartReplenishmentService.predictReplenishment(tenantId)

    const summary = {
      totalItems: predictions.length,
      criticalCount: predictions.filter((p) => p.urgency === 'CRITICAL').length,
      warningCount: predictions.filter((p) => p.urgency === 'WARNING').length,
      normalCount: predictions.filter((p) => p.urgency === 'NORMAL').length,
      totalEstimatedCostFcfa: predictions.reduce((sum, p) => sum + p.estimatedCostFcfa, 0),
    }

    return NextResponse.json({
      summary,
      predictions,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Erreur lors du calcul du réapprovisionnement' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { supplierId, items, notes } = body

    if (!supplierId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants (supplierId, items array)' },
        { status: 400 }
      )
    }

    const purchaseOrder = await smartReplenishmentService.generateReplenishmentPurchaseOrder(
      supplierId,
      items,
      notes
    )

    return NextResponse.json({
      success: true,
      message: 'Bon de commande suggéré généré avec succès en brouillon !',
      purchaseOrder,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Erreur lors de la génération du bon de commande' },
      { status: 500 }
    )
  }
}
