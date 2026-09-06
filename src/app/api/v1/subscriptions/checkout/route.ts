import { NextRequest, NextResponse } from 'next/server'
import { subscriptionsService } from '@/modules/subscriptions/subscriptions.service'
import { requireAuth, requireTenantId } from '@/modules/auth/auth.guard'
import { handleApiError } from '@/shared/utils/response'

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)

    // L'identité du payeur et son organisation viennent de la session.
    // Les accepter depuis le corps de la requête permettait de souscrire
    // un abonnement Mobile Money au nom de n'importe quel utilisateur.
    const tenantId = await requireTenantId(auth)
    const userId = auth.userId

    const body = await request.json()
    const { planId, billingCycle, paymentMethod, phone } = body

    if (!planId || !paymentMethod || !phone) {
      return NextResponse.json(
        { error: 'Champs requis manquants (planId, paymentMethod, phone)' },
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
  } catch (error) {
    return handleApiError(error)
  }
}
