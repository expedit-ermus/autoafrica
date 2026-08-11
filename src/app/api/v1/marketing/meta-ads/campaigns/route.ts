import { NextResponse } from 'next/server'
import { metaAdsService } from '@/modules/marketing/meta-ads.service'

export async function GET() {
  const campaigns = await metaAdsService.listCampaigns()
  const summary = await metaAdsService.getPerformanceSummary()
  return NextResponse.json({ summary, campaigns })
}

export async function POST(request: Request) {
  try {
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
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Erreur lors du lancement de la campagne Meta Ads' },
      { status: 500 }
    )
  }
}
