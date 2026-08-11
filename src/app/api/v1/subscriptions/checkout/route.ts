import { NextResponse } from 'next/server'
import { subscriptionsService } from '@/modules/subscriptions/subscriptions.service'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tenantId, userId, planId, billingCycle, paymentMethod, phone } = body

    if (!tenantId || !userId || !planId || !paymentMethod || !phone) {
      return NextResponse.json(
        { error: 'Champs requis manquants (tenantId, userId, planId, paymentMethod, phone)' },
        { status: 400 }
      )
    }

    const result = await subscriptionsService.subscribeWithMobileMoney({
      tenantId,
      userId,
      planId,
      billingCycle: billingCycle || 'monthly',
      paymentMethod,
      phone,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Erreur lors du règlement de l’abonnement SaaS' },
      { status: 500 }
    )
  }
}
