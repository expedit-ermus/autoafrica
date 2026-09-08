import { prisma } from '@/lib/prisma'
import { Prisma, POStatus } from '@/generated/prisma/client'
import { NotFoundError, ValidationError } from '@/shared/errors'
import { getPaginationParams, buildPaginatedResponse } from '@/shared/utils/pagination'
import { PaginationParams } from '@/shared/types'

interface PurchaseOrderItemInput {
  productName: string
  reference?: string
  quantity: number
  unitPrice: number
  notes?: string
}

interface CreatePurchaseOrderInput {
  supplierId: string
  warehouseId?: string
  status?: string
  currency?: string
  paymentTerms?: string
  expectedDate?: string
  shippingMethod?: string
  trackingNumber?: string
  notes?: string
  items: PurchaseOrderItemInput[]
}

interface PurchaseOrderFilters {
  search?: string
  supplierId?: string
  status?: string
  minAmount?: string
  maxAmount?: string
}

export class PurchaseOrdersService {
  async list(filters: PurchaseOrderFilters, pagination: PaginationParams) {
    const { page, pageSize, skip, orderBy } = getPaginationParams(pagination)

    const where: Prisma.PurchaseOrderWhereInput = {}
    if (filters.supplierId) where.supplierId = filters.supplierId
    if (filters.status) where.status = filters.status as POStatus
    if (filters.minAmount || filters.maxAmount) {
      const amountFilter: Prisma.IntFilter = {}
      if (filters.minAmount) amountFilter.gte = Number(filters.minAmount)
      if (filters.maxAmount) amountFilter.lte = Number(filters.maxAmount)
      where.totalAmount = amountFilter
    }
    if (filters.search) {
      const searchFilter = { contains: filters.search }
      where.OR = [
        { poNumber: searchFilter },
        { trackingNumber: searchFilter },
        { supplier: { name: searchFilter } },
      ]
    }

    const [orders, total] = await Promise.all([
      prisma.purchaseOrder.findMany({
        where,
        include: {
          supplier: { select: { id: true, name: true, country: true, verified: true } },
          warehouse: { select: { id: true, name: true, city: true } },
          _count: { select: { items: true } },
        },
        skip,
        take: pageSize,
        orderBy,
      }),
      prisma.purchaseOrder.count({ where }),
    ])

    return buildPaginatedResponse(orders, total, page, pageSize)
  }

  async getById(id: string) {
    const order = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        supplier: true,
        warehouse: true,
        items: true,
        container: true,
      },
    })
    if (!order) throw new NotFoundError('PurchaseOrder', id)
    return order
  }

  async create(data: CreatePurchaseOrderInput, userId: string) {
    if (!data.supplierId || !Array.isArray(data.items) || data.items.length === 0) {
      throw new ValidationError('Fournisseur et au moins un article sont requis')
    }
    for (const item of data.items) {
      if (!item.productName || !item.quantity || item.quantity <= 0 || !item.unitPrice || item.unitPrice < 0) {
        throw new ValidationError('Chaque article doit avoir un nom, une quantite positive et un prix')
      }
    }

    const supplier = await prisma.supplier.findUnique({ where: { id: data.supplierId } })
    if (!supplier) throw new NotFoundError('Supplier', data.supplierId)

    const totalAmount = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
    const poNumber = 'PO-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase()
    const currency = data.currency || 'USD'

    return prisma.purchaseOrder.create({
      data: {
        poNumber,
        supplierId: data.supplierId,
        warehouseId: data.warehouseId,
        status: (data.status as POStatus) || 'DRAFT',
        totalAmount,
        currency,
        paymentTerms: data.paymentTerms || supplier.paymentTerms || undefined,
        expectedDate: data.expectedDate ? new Date(data.expectedDate) : undefined,
        shippingMethod: data.shippingMethod,
        trackingNumber: data.trackingNumber,
        notes: data.notes,
        createdBy: userId,
        items: {
          create: data.items.map(item => ({
            productName: item.productName,
            reference: item.reference,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
            notes: item.notes,
          })),
        },
      },
      include: { items: true, supplier: { select: { id: true, name: true } } },
    })
  }

  async updateStatus(id: string, status: string, userId: string) {
    const existing = await prisma.purchaseOrder.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('PurchaseOrder', id)

    const data: Prisma.PurchaseOrderUpdateInput = { status: status as POStatus }
    if (status === 'APPROVED' && !existing.approvedAt) {
      data.approvedBy = userId
      data.approvedAt = new Date()
    }
    if (status === 'COMPLETED') {
      data.actualDate = new Date()
    }

    return prisma.purchaseOrder.update({ where: { id }, data })
  }

  async update(id: string, data: Partial<CreatePurchaseOrderInput>) {
    const existing = await prisma.purchaseOrder.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('PurchaseOrder', id)

    let totalAmount: number | undefined
    const itemUpdate = data.items
      ? { deleteMany: {}, create: data.items.map(item => ({ productName: item.productName, reference: item.reference, quantity: item.quantity, unitPrice: item.unitPrice, totalPrice: item.quantity * item.unitPrice, notes: item.notes })) }
      : undefined
    if (data.items && data.items.length > 0) {
      totalAmount = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
    }

    return prisma.purchaseOrder.update({
      where: { id },
      data: {
        warehouseId: data.warehouseId,
        status: data.status ? (data.status as POStatus) : undefined,
        currency: data.currency,
        paymentTerms: data.paymentTerms,
        expectedDate: data.expectedDate ? new Date(data.expectedDate) : undefined,
        shippingMethod: data.shippingMethod,
        trackingNumber: data.trackingNumber,
        notes: data.notes,
        totalAmount,
        items: itemUpdate,
      },
      include: { items: true },
    })
  }

  async remove(id: string) {
    const existing = await prisma.purchaseOrder.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('PurchaseOrder', id)
    await prisma.purchaseOrder.delete({ where: { id } })
    return { success: true }
  }
}

export const purchaseOrdersService = new PurchaseOrdersService()
