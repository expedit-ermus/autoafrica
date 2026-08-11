import { prisma } from '@/lib/prisma'

export interface ReplenishmentPrediction {
  productId: string
  productName: string
  sku: string | null
  category: string
  currentStock: number
  reorderPoint: number
  suggestedQuantity: number
  avgDailySales: number
  leadTimeDays: number
  daysUntilStockout: number
  seasonalFactor: number
  seasonalReason: string
  urgency: 'CRITICAL' | 'WARNING' | 'NORMAL'
  estimatedCostFcfa: number
  supplierName?: string
}

export interface SeasonalFactorResult {
  factor: number
  reason: string
}

export class SmartReplenishmentService {
  /**
   * Calculates seasonal demand multiplier based on month and part category in West Africa.
   */
  getSeasonalFactor(categoryName: string, date: Date = new Date()): SeasonalFactorResult {
    const month = date.getMonth() + 1 // 1-12
    const catLower = categoryName.toLowerCase()

    // Saison des pluies (Juin - Août) : Forte demande de balais d'essuie-glace, pneus, freins, amortisseurs
    if ([6, 7, 8].includes(month)) {
      if (
        catLower.includes('pneu') ||
        catLower.includes('frein') ||
        catLower.includes('essuie') ||
        catLower.includes('suspension') ||
        catLower.includes('amortisseur')
      ) {
        return {
          factor: 1.45,
          reason: 'Saison des pluies en Afrique de l’Ouest (Sur-consommation freinage, pneus & essuie-glaces)',
        }
      }
    }

    // Grandes Vacances & Fêtes de Fin d'Année (Décembre & Août) : Départs en voyage, vidanges, moteurs
    if ([8, 12].includes(month)) {
      if (
        catLower.includes('entretien') ||
        catLower.includes('huile') ||
        catLower.includes('filtr') ||
        catLower.includes('moteur') ||
        catLower.includes('refroidissement')
      ) {
        return {
          factor: 1.35,
          reason: 'Grandes traversées & Fêtes (Révisons intenses & vidanges pré-voyage)',
        }
      }
    }

    return {
      factor: 1.0,
      reason: 'Consommation standard',
    }
  }

  /**
   * Predicts stockout dates, reorder points, and replenishment suggestions for tenant inventory.
   */
  async predictReplenishment(tenantId?: string): Promise<ReplenishmentPrediction[]> {
    const where: any = {}
    if (tenantId) where.tenantId = tenantId

    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: { name: true },
        },
      },
    })

    const predictions: ReplenishmentPrediction[] = products.map((p) => {
      const categoryName = p.category?.name || 'Général'
      const seasonal = this.getSeasonalFactor(categoryName)
      const minStock = p.lowStockAlert || 5

      // Historical average daily sales simulation (or derived from orders)
      const baseDailySales = Math.max(0.5, minStock > 0 ? minStock / 15 : 1)
      const adjustedDailySales = Number((baseDailySales * seasonal.factor).toFixed(2))

      const leadTimeDays = categoryName.toLowerCase().includes('moteur') ? 30 : 7 // 30j import vs 7j local
      const safetyStock = Math.ceil(adjustedDailySales * 3)

      // Reorder Point = (Daily Sales * Lead Time) + Safety Stock
      const reorderPoint = Math.ceil(adjustedDailySales * leadTimeDays + safetyStock)

      const daysUntilStockout = adjustedDailySales > 0 ? Math.floor(p.stock / adjustedDailySales) : 999

      let urgency: 'CRITICAL' | 'WARNING' | 'NORMAL' = 'NORMAL'
      if (p.stock <= minStock || daysUntilStockout <= 3) {
        urgency = 'CRITICAL'
      } else if (p.stock <= reorderPoint || daysUntilStockout <= leadTimeDays) {
        urgency = 'WARNING'
      }

      // Suggested Reorder Quantity = (ROP * 2) - Current Stock
      const targetStock = reorderPoint * 2
      const suggestedQuantity = Math.max(10, Math.ceil(targetStock - p.stock))

      const purchaseUnitPrice = Math.round((p.price || 10000) * 0.65) // 65% of selling price
      const estimatedCostFcfa = suggestedQuantity * purchaseUnitPrice

      return {
        productId: p.id,
        productName: p.title,
        sku: p.sku,
        category: categoryName,
        currentStock: p.stock,
        reorderPoint,
        suggestedQuantity,
        avgDailySales: adjustedDailySales,
        leadTimeDays,
        daysUntilStockout,
        seasonalFactor: seasonal.factor,
        seasonalReason: seasonal.reason,
        urgency,
        estimatedCostFcfa,
        supplierName: 'Fournisseur Agréé AutoAfrique',
      }
    })

    // Sort by urgency: CRITICAL first, then WARNING, then daysUntilStockout ascending
    return predictions.sort((a, b) => {
      const urgencyRank = { CRITICAL: 0, WARNING: 1, NORMAL: 2 }
      if (urgencyRank[a.urgency] !== urgencyRank[b.urgency]) {
        return urgencyRank[a.urgency] - urgencyRank[b.urgency]
      }
      return a.daysUntilStockout - b.daysUntilStockout
    })
  }

  /**
   * Generates a draft Purchase Order (Bon de Commande) for items requiring replenishment.
   */
  async generateReplenishmentPurchaseOrder(
    supplierId: string,
    items: { productId: string; productName?: string; quantity: number; unitPrice: number }[],
    notes?: string
  ) {
    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
    const poNumber = `BC-SMART-${Date.now().toString().slice(-6)}`

    const purchaseOrder = await prisma.purchaseOrder.create({
      data: {
        poNumber,
        supplierId,
        status: 'DRAFT',
        totalAmount,
        notes: notes || 'Généré automatiquement par l’Estimateur de Réapprovisionnement Intelligent AutoAfrique',
        items: {
          create: items.map((i) => ({
            productName: i.productName || 'Produit AutoAfrique',
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            totalPrice: i.quantity * i.unitPrice,
          })),
        },
      },
      include: {
        supplier: true,
        items: true,
      },
    })

    return purchaseOrder
  }
}

export const smartReplenishmentService = new SmartReplenishmentService()
