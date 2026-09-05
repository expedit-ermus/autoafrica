import { NextRequest, NextResponse } from 'next/server'
import { subscriptionsService, SAAS_PLANS } from '@/modules/subscriptions/subscriptions.service'
import { requireAuth, resolveTenantId } from '@/modules/auth/auth.guard'
import { handleApiError } from '@/shared/utils/response'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    // Abonnement du locataire de la session : plus de 'demo-tenant-id' ni de parametre client.
    const tenantId = await resolveTenantId(auth)

    // Un compte non rattache a une organisation peut consulter les offres :
    // refuser l'ecran entier bloquerait la souscription initiale.
    const subscriptionInfo = tenantId
      ? await subscriptionsService.getTenantSubscription(tenantId)
      : null

    return NextResponse.json({
      success: true,
      availablePlans: SAAS_PLANS,
      currentSubscription: subscriptionInfo,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
