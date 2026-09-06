import { NextRequest, NextResponse } from 'next/server'
import { metaAdsService } from '@/modules/marketing/meta-ads.service'
import { requireRole } from '@/modules/auth/auth.guard'
import { handleApiError } from '@/shared/utils/response'

const MARKETING_ROLES = ['SUPER_ADMIN', 'TENANT_ADMIN']

export async function GET(request: NextRequest) {
  try {
    // Budgets et performances des campagnes : admins uniquement.
    await requireRole(request, MARKETING_ROLES)

    const campaigns = await metaAdsService.listCampaigns()
    const summary = await metaAdsService.getPerformanceSummary()
    return NextResponse.json({ summary, campaigns })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    // Lancer une campagne engage un budget journalier reel : admins uniquement.
    await requireRole(request, MARKETING_ROLES)

    const body = await request.json()
    const { name, targetCity, dailyBudget } = body

    if (!name || !dailyBudget || dailyBudget <= 0) {
      return NextResponse.json(
        { error: 'Nom de campagne et budget journalier positif requis' },
        { status: 400 }
      )
    }

    const campaign = await metaAdsService.createCampaign({
      name,
      targetCity: targetCity || 'Abidjan',
      dailyBudget: Number(dailyBudget),
    })

    return NextResponse.json({
      success: true,
      message: 'Campagne Meta Ads lancée avec succès !',
      campaign,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
