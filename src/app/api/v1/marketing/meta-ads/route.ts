import { NextRequest, NextResponse } from 'next/server'
import { metaAdsService } from '@/modules/marketing/meta-ads.service'
import { requireRole } from '@/modules/auth/auth.guard'
import { handleApiError } from '@/shared/utils/response'

export async function GET(request: NextRequest) {
  try {
    // Donnees publicitaires (budgets, performances) : admins uniquement.
    await requireRole(request, ['SUPER_ADMIN', 'TENANT_ADMIN'])

    const campaigns = await metaAdsService.listCampaigns()
    const summary = await metaAdsService.getPerformanceSummary()

    return NextResponse.json({
      success: true,
      summary,
      campaigns,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRole(req, ['SUPER_ADMIN', 'TENANT_ADMIN'])

    const body = await req.json()
    const campaign = await metaAdsService.createCampaign(body)

    return NextResponse.json({
      success: true,
      message: 'Campagne Meta Ads créée et activée avec succès via MCP',
      campaign,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
