import { NextRequest, NextResponse } from 'next/server'
import { smartReplenishmentService, type ReplenishmentSummary } from '@/modules/inventory/smart-replenishment.service'
import { requireAuth, requireRole, resolveTenantId } from '@/modules/auth/auth.guard'
import { handleApiError } from '@/shared/utils/response'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    // Le locataire vient de la session, jamais de la query string.
    const tenantId = (await resolveTenantId(auth)) ?? undefined

    const predictions = await smartReplenishmentService.predictReplenishment(tenantId)

    const summary: ReplenishmentSummary = {
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
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    // Creation d'un bon de commande : reserve aux vendeurs et admins.
    await requireRole(request, ['SELLER', 'SUPER_ADMIN', 'TENANT_ADMIN'])

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
  } catch (error) {
    return handleApiError(error)
  }
}
