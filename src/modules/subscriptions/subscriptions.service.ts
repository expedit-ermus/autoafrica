import { prisma } from '@/lib/prisma'
import { paymentProviders } from '@/modules/payments/providers/registry'
import { smsWhatsAppProvider } from '@/modules/notifications/providers/sms-whatsapp.provider'

export type SaaSPlanType = 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE'

export interface PlanConfig {
  id: SaaSPlanType
  name: string
  priceMonthly: number // FCFA (XOF)
  priceYearly: number // FCFA (XOF) - avec 2 mois offerts
  maxListings: number // -1 = illimité
  maxWarehouses: number
  hasVinDecoder: boolean
  hasSmartReplenishment: boolean
  hasMetaAdsAutomation: boolean
  hasContainerTracking: boolean
  hasUemoaCustomsCalc: boolean
  supportTier: 'COMMUNITY' | 'STANDARD' | 'PRIORITY' | 'DEDICATED'
}

export const SAAS_PLANS: Record<SaaSPlanType, PlanConfig> = {
  FREE: {
    id: 'FREE',
    name: 'Gratuit (Découverte)',
    priceMonthly: 0,
    priceYearly: 0,
    maxListings: 10,
    maxWarehouses: 1,
    hasVinDecoder: false,
    hasSmartReplenishment: false,
    hasMetaAdsAutomation: false,
    hasContainerTracking: false,
    hasUemoaCustomsCalc: true,
    supportTier: 'COMMUNITY',
  },
  STARTER: {
    id: 'STARTER',
    name: 'Starter Garagiste',
    priceMonthly: 15000,
    priceYearly: 150000,
    maxListings: 100,
    maxWarehouses: 2,
    hasVinDecoder: true,
    hasSmartReplenishment: false,
    hasMetaAdsAutomation: false,
    hasContainerTracking: false,
    hasUemoaCustomsCalc: true,
    supportTier: 'STANDARD',
  },
  PRO: {
    id: 'PRO',
    name: 'Pro Vendeur & Grossiste',
    priceMonthly: 45000,
    priceYearly: 450000,
    maxListings: 1000,
    maxWarehouses: 5,
    hasVinDecoder: true,
    hasSmartReplenishment: true,
    hasMetaAdsAutomation: true,
    hasContainerTracking: false,
    hasUemoaCustomsCalc: true,
    supportTier: 'PRIORITY',
  },
  ENTERPRISE: {
    id: 'ENTERPRISE',
    name: 'Enterprise Import-Export',
    priceMonthly: 120000,
    priceYearly: 1200000,
    maxListings: -1,
    maxWarehouses: 99,
    hasVinDecoder: true,
    hasSmartReplenishment: true,
    hasMetaAdsAutomation: true,
    hasContainerTracking: true,
    hasUemoaCustomsCalc: true,
    supportTier: 'DEDICATED',
  },
}

export class SubscriptionsService {
  /**
   * Retrieves active subscription & quotas for a tenant
   */
  async getTenantSubscription(tenantId: string) {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })

    const activePlanId: SaaSPlanType = (tenant?.plan as SaaSPlanType) || 'FREE'
    const planConfig = SAAS_PLANS[activePlanId] || SAAS_PLANS.FREE

    const currentSub = tenant?.subscriptions[0] || null

    // Quotas usage calculation
    const [listingsCount, warehousesCount] = await Promise.all([
      prisma.product.count({ where: { tenantId } }),
      prisma.warehouse.count({ where: { tenantId } }),
    ])

    return {
      tenantId,
      tenantName: tenant?.name || 'Garage Vendeur',
      plan: planConfig,
      subscription: currentSub,
      usage: {
        listingsCount,
        maxListings: planConfig.maxListings,
        listingsUsagePercent:
          planConfig.maxListings > 0
            ? Math.min(100, Math.round((listingsCount / planConfig.maxListings) * 100))
            : 0,
        warehousesCount,
        maxWarehouses: planConfig.maxWarehouses,
      },
    }
  }

  /**
   * Checks if tenant can perform action based on plan limits (Feature Gating)
   */
  async checkFeaturePermission(
    tenantId: string,
    feature: 'add_product' | 'add_warehouse' | 'vin_decoder' | 'smart_replenishment' | 'meta_ads' | 'container_tracking'
  ) {
    const subInfo = await this.getTenantSubscription(tenantId)
    const { plan, usage } = subInfo

    switch (feature) {
      case 'add_product':
        if (plan.maxListings > 0 && usage.listingsCount >= plan.maxListings) {
          return {
            allowed: false,
            reason: `Quota d'annonces atteint (${usage.listingsCount}/${plan.maxListings}). Passez au plan supérieur.`,
          }
        }
        return { allowed: true }

      case 'add_warehouse':
        if (usage.warehousesCount >= plan.maxWarehouses) {
          return {
            allowed: false,
            reason: `Limite d'entrepôts atteinte (${usage.warehousesCount}/${plan.maxWarehouses}). Passez au plan Pro ou Enterprise.`,
          }
        }
        return { allowed: true }

      case 'vin_decoder':
        return plan.hasVinDecoder
          ? { allowed: true }
          : { allowed: false, reason: 'Le décodeur VIN nécessite un abonnement Starter, Pro ou Enterprise.' }

      case 'smart_replenishment':
        return plan.hasSmartReplenishment
          ? { allowed: true }
          : { allowed: false, reason: 'Le réapprovisionnement intelligent IA nécessite un abonnement Pro ou Enterprise.' }

      case 'meta_ads':
        return plan.hasMetaAdsAutomation
          ? { allowed: true }
          : { allowed: false, reason: 'L’automatisation des publicités Meta Ads nécessite un abonnement Pro ou Enterprise.' }

      case 'container_tracking':
        return plan.hasContainerTracking
          ? { allowed: true }
          : { allowed: false, reason: 'Le suivi des conteneurs maritimes nécessite un abonnement Enterprise.' }

      default:
        return { allowed: true }
    }
  }

  /**
   * Upgrades or subscribes tenant to a SaaS plan via Mobile Money payment
   */
  async subscribeWithMobileMoney(params: {
    tenantId: string
    userId: string
    planId: SaaSPlanType
    billingCycle: 'monthly' | 'yearly'
    paymentMethod: 'ORANGE_MONEY' | 'MTN_MOMO' | 'WAVE' | 'MOOV_MONEY'
    phone: string
  }) {
    const targetPlan = SAAS_PLANS[params.planId]
    if (!targetPlan) throw new Error('Plan SaaS invalide')

    const amount =
      params.billingCycle === 'yearly' ? targetPlan.priceYearly : targetPlan.priceMonthly

    if (amount <= 0 && params.planId === 'FREE') {
      await prisma.tenant.update({
        where: { id: params.tenantId },
        data: { plan: 'FREE' },
      })
      return { success: true, message: 'Plan rétrogradé en version Gratuite' }
    }

    // Process Mobile Money payment via Provider Registry
    const provider = paymentProviders.get(params.paymentMethod)
    const paymentResult = await provider.initiate({
      phone: params.phone,
      amount,
      currency: 'XOF',
      reference: `SUB-${params.tenantId.slice(-6)}-${Date.now().toString().slice(-6)}`,
      description: `Abonnement SaaS ${targetPlan.name}`,
    })

    if (!paymentResult.success) {
      throw new Error(`Paiement Mobile Money échoué : ${paymentResult.error || 'Transaction refusée'}`)
    }

    // Calculate billing end date
    const startDate = new Date()
    const endDate = new Date(startDate)
    if (params.billingCycle === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1)
    } else {
      endDate.setMonth(endDate.getMonth() + 1)
    }

    // Record subscription in DB
    const subscription = await prisma.subscription.create({
      data: {
        tenantId: params.tenantId,
        plan: params.planId,
        status: 'ACTIVE',
        amount,
        currency: 'XOF',
        billingCycle: params.billingCycle,
        startDate,
        endDate,
        nextBilling: endDate,
        paymentMethod: params.paymentMethod,
      },
    })

    // Update Tenant Plan
    await prisma.tenant.update({
      where: { id: params.tenantId },
      data: { plan: params.planId },
    })

    // Send SMS & WhatsApp Notification
    await smsWhatsAppProvider.sendSms(
      params.phone,
      `AutoAfrique: Félicitations ! Votre abonnement SaaS ${targetPlan.name} est activé jusqu'au ${endDate.toLocaleDateString('fr-FR')}. Merci de votre confiance !`
    )

    return {
      success: true,
      subscription,
      message: `Abonnement ${targetPlan.name} activé avec succès par ${params.paymentMethod} !`,
    }
  }

  /**
   * Generates a printable SaaS Invoice PDF structure
   */
  async generateSaaSInvoicePDF(subscriptionId: string) {
    const sub = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: { tenant: true },
    })

    if (!sub) throw new Error('Abonnement introuvable')

    const planConfig = SAAS_PLANS[sub.plan as SaaSPlanType]

    return {
      invoiceNumber: `INV-SAAS-${sub.id.slice(-6).toUpperCase()}`,
      issueDate: sub.createdAt.toLocaleDateString('fr-FR'),
      tenantName: sub.tenant.name,
      planName: planConfig.name,
      billingCycle: sub.billingCycle === 'yearly' ? 'Annuel' : 'Mensuel',
      amountFcfa: sub.amount,
      taxAmountFcfa: Math.round(sub.amount * 0.18), // TVA 18% UEMOA
      totalFcfa: Math.round(sub.amount * 1.18),
      paymentMethod: sub.paymentMethod,
      status: sub.status,
    }
  }
}

export const subscriptionsService = new SubscriptionsService()
