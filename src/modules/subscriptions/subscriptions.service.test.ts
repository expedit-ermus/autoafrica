import { describe, it, expect, vi, beforeEach } from 'vitest'
import { subscriptionsService } from './subscriptions.service'
import { prisma } from '@/lib/prisma'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    tenant: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    subscription: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    product: {
      count: vi.fn(),
    },
    warehouse: {
      count: vi.fn(),
    },
  },
}))

vi.mock('@/modules/payments/providers/registry', () => ({
  paymentProviders: {
    get: vi.fn().mockReturnValue({
      initiate: vi.fn().mockResolvedValue({
        success: true,
        transactionId: 'tx_sub_123',
      }),
    }),
  },
}))

describe('SubscriptionsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('retrieves active SaaS subscription and usage quotas for a tenant', async () => {
    vi.mocked(prisma.tenant.findUnique).mockResolvedValue({
      id: 'tenant-1',
      name: 'Garage Abidjan Auto',
      plan: 'STARTER',
      subscriptions: [
        {
          id: 'sub-1',
          plan: 'STARTER',
          status: 'ACTIVE',
          amount: 15000,
          currency: 'XOF',
          billingCycle: 'monthly',
          startDate: new Date(),
          endDate: new Date(),
          nextBilling: new Date(),
          paymentMethod: 'ORANGE_MONEY',
          createdAt: new Date(),
          updatedAt: new Date(),
          tenantId: 'tenant-1',
          metadata: null,
        },
      ],
    } as unknown as Awaited<ReturnType<typeof prisma.tenant.findUnique>>)

    vi.mocked(prisma.product.count).mockResolvedValue(45)
    vi.mocked(prisma.warehouse.count).mockResolvedValue(1)

    const result = await subscriptionsService.getTenantSubscription('tenant-1')

    expect(result.plan.id).toBe('STARTER')
    expect(result.usage.listingsCount).toBe(45)
    expect(result.usage.maxListings).toBe(100)
    expect(result.usage.listingsUsagePercent).toBe(45)
  })

  it('enforces feature gating based on SaaS plan limits', async () => {
    // FREE plan setup
    vi.mocked(prisma.tenant.findUnique).mockResolvedValue({
      id: 'tenant-free',
      name: 'Petit Garage',
      plan: 'FREE',
      subscriptions: [],
    } as unknown as Awaited<ReturnType<typeof prisma.tenant.findUnique>>)

    vi.mocked(prisma.product.count).mockResolvedValue(10)
    vi.mocked(prisma.warehouse.count).mockResolvedValue(1)

    const productCheck = await subscriptionsService.checkFeaturePermission('tenant-free', 'add_product')
    expect(productCheck.allowed).toBe(false)
    expect(productCheck.reason).toContain('Quota d\'annonces atteint')

    const vinCheck = await subscriptionsService.checkFeaturePermission('tenant-free', 'vin_decoder')
    expect(vinCheck.allowed).toBe(false)
    expect(vinCheck.reason).toContain('décodeur VIN nécessite un abonnement')
  })

  it('upgrades tenant subscription via Mobile Money payment', async () => {
    vi.mocked(prisma.subscription.create).mockResolvedValue({
      id: 'sub-new-1',
      tenantId: 'tenant-1',
      plan: 'PRO',
      status: 'ACTIVE',
      amount: 45000,
      currency: 'XOF',
      billingCycle: 'monthly',
      startDate: new Date(),
      endDate: new Date(),
      nextBilling: new Date(),
      paymentMethod: 'ORANGE_MONEY',
      metadata: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const upgrade = await subscriptionsService.subscribeWithMobileMoney({
      tenantId: 'tenant-1',
      userId: 'user-1',
      planId: 'PRO',
      billingCycle: 'monthly',
      paymentMethod: 'ORANGE_MONEY',
      phone: '0707070707',
    })

    expect(upgrade.success).toBe(true)
    expect(prisma.tenant.update).toHaveBeenCalledWith({
      where: { id: 'tenant-1' },
      data: { plan: 'PRO' },
    })
  })
})
