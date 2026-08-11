import { NextResponse } from 'next/server'
import { subscriptionsService, SAAS_PLANS } from '@/modules/subscriptions/subscriptions.service'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tenantId = searchParams.get('tenantId') || 'demo-tenant-id'

  const subscriptionInfo = await subscriptionsService.getTenantSubscription(tenantId)

  return NextResponse.json({
    success: true,
    availablePlans: SAAS_PLANS,
    currentSubscription: subscriptionInfo,
  })
}
