import { describe, it, expect, vi, beforeEach } from 'vitest'
import { smartReplenishmentService } from './smart-replenishment.service'
import { prisma } from '@/lib/prisma'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: vi.fn(),
    },
    purchaseOrder: {
      create: vi.fn(),
    },
  },
}))

describe('SmartReplenishmentService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calculates seasonal multipliers for rainy season (June - August)', () => {
    const juneDate = new Date('2026-07-15')
    const result = smartReplenishmentService.getSeasonalFactor('Pneumatique & Freinage', juneDate)

    expect(result.factor).toBe(1.45)
    expect(result.reason).toContain('Saison des pluies')
  })

  it('calculates seasonal multipliers for holiday travel (December)', () => {
    const decDate = new Date('2026-12-20')
    const result = smartReplenishmentService.getSeasonalFactor('Entretien Moteur & Vidange', decDate)

    expect(result.factor).toBe(1.35)
    expect(result.reason).toContain('Grandes traversées')
  })

  it('predicts stockouts and ranks CRITICAL items first', async () => {
    const mockProducts = [
      {
        id: 'p1',
        name: 'Filtre à Huile Toyota Hilux',
        sku: 'TOY-FIL-01',
        category: 'Entretien & Vidange',
        stock: 2,
        minStock: 10,
        price: 8000,
        supplier: { name: 'SOGEA Auto Abidjan' },
      },
      {
        id: 'p2',
        name: 'Plaquettes de Frein Peugeot 308',
        sku: 'PEU-FRE-02',
        category: 'Freinage',
        stock: 50,
        minStock: 5,
        price: 25000,
        supplier: { name: 'Ferraille N’Dotré' },
      },
    ]

    vi.mocked(prisma.product.findMany).mockResolvedValue(mockProducts as any)

    const predictions = await smartReplenishmentService.predictReplenishment()

    expect(predictions.length).toBe(2)
    expect(predictions[0].productId).toBe('p1')
    expect(predictions[0].urgency).toBe('CRITICAL')
    expect(predictions[0].suggestedQuantity).toBeGreaterThan(0)
  })

  it('creates draft purchase order automatically', async () => {
    const mockPO = {
      id: 'po-123',
      poNumber: 'BC-SMART-999999',
      supplierId: 'sup-1',
      status: 'DRAFT',
      totalAmount: 150000,
    }

    vi.mocked(prisma.purchaseOrder.create).mockResolvedValue(mockPO as any)

    const result = await smartReplenishmentService.generateReplenishmentPurchaseOrder('sup-1', [
      { productId: 'p1', quantity: 20, unitPrice: 7500 },
    ])

    expect(result.id).toBe('po-123')
    expect(result.status).toBe('DRAFT')
    expect(prisma.purchaseOrder.create).toHaveBeenCalledOnce()
  })
})
