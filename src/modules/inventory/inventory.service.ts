import { prisma } from '@/lib/prisma'
import { Prisma, WarehouseType, MovementType } from '@/generated/prisma/client'
import { NotFoundError, ValidationError } from '@/shared/errors'
import { getPaginationParams, buildPaginatedResponse } from '@/shared/utils/pagination'
import { PaginationParams } from '@/shared/types'

interface CreateWarehouseInput {
  name: string
  code?: string
  type?: string
  country: string
  city: string
  address?: string
  latitude?: number
  longitude?: number
  capacity?: number
  managerId?: string
  active?: boolean
}

interface CreateInventoryInput {
  productId: string
  warehouseId: string
  quantity?: number
  reserved?: number
  binLocation?: string
  lotNumber?: string
  expiryDate?: string
  costBasis?: number
}

interface WarehouseFilters {
  search?: string
  country?: string
  type?: string
  active?: string
}

interface InventoryFilters {
  search?: string
  warehouseId?: string
  productId?: string
  stockStatus?: string
}

interface MovementFilters {
  type?: string
  warehouseId?: string
  productId?: string
  search?: string
}

export class InventoryService {
  // ==================== WAREHOUSES ====================

  async listWarehouses(filters: WarehouseFilters, pagination: PaginationParams) {
    const { page, pageSize, skip, orderBy } = getPaginationParams(pagination)

    const where: Prisma.WarehouseWhereInput = {}
    if (filters.country) where.country = filters.country
    if (filters.type) where.type = filters.type as WarehouseType
    if (filters.active) where.active = filters.active === 'true'
    if (filters.search) {
      const searchFilter = { contains: filters.search }
      where.OR = [
        { name: searchFilter },
        { code: searchFilter },
        { city: searchFilter },
        { address: searchFilter },
      ]
    }

    const [warehouses, total] = await Promise.all([
      prisma.warehouse.findMany({
        where,
        include: {
          _count: { select: { inventories: true, purchaseOrders: true } },
        },
        skip,
        take: pageSize,
        orderBy,
      }),
      prisma.warehouse.count({ where }),
    ])

    return buildPaginatedResponse(warehouses, total, page, pageSize)
  }

  async getWarehouseById(id: string) {
    const warehouse = await prisma.warehouse.findUnique({
      where: { id },
      include: {
        inventories: { include: { product: { select: { id: true, title: true, reference: true } } } },
      },
    })
    if (!warehouse) throw new NotFoundError('Warehouse', id)
    return warehouse
  }

  async createWarehouse(data: CreateWarehouseInput) {
    if (!data.name || !data.country || !data.city) {
      throw new ValidationError('Nom, pays et ville sont requis')
    }

    return prisma.warehouse.create({
      data: {
        name: data.name,
        code: data.code,
        type: (data.type as WarehouseType) || 'STANDARD',
        country: data.country,
        city: data.city,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        capacity: data.capacity,
        managerId: data.managerId,
        active: data.active ?? true,
      },
    })
  }

  async updateWarehouse(id: string, data: Partial<CreateWarehouseInput>) {
    const existing = await prisma.warehouse.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('Warehouse', id)

    return prisma.warehouse.update({
      where: { id },
      data: {
        name: data.name,
        code: data.code,
        type: data.type ? (data.type as WarehouseType) : undefined,
        country: data.country,
        city: data.city,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        capacity: data.capacity,
        managerId: data.managerId,
        active: data.active,
      },
    })
  }

  async removeWarehouse(id: string) {
    const existing = await prisma.warehouse.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('Warehouse', id)
    await prisma.warehouse.delete({ where: { id } })
    return { success: true }
  }

  // ==================== INVENTORY ====================

  async listInventory(filters: InventoryFilters, pagination: PaginationParams) {
    const { page, pageSize, skip } = getPaginationParams(pagination)

    const where: Prisma.InventoryWhereInput = {}
    if (filters.warehouseId) where.warehouseId = filters.warehouseId
    if (filters.productId) where.productId = filters.productId
    if (filters.stockStatus === 'low') where.available = { lte: 10, gt: 0 }
    if (filters.stockStatus === 'out') where.available = 0
    if (filters.stockStatus === 'in') where.available = { gt: 10 }
    if (filters.search) {
      const searchFilter = { contains: filters.search }
      where.OR = [
        { binLocation: searchFilter },
        { lotNumber: searchFilter },
        { product: { title: searchFilter } },
        { product: { reference: searchFilter } },
      ]
    }

    const [items, total] = await Promise.all([
      prisma.inventory.findMany({
        where,
        include: {
          product: { select: { id: true, title: true, reference: true, sku: true } },
          warehouse: { select: { id: true, name: true, city: true, country: true } },
          _count: { select: { movements: true } },
        },
        skip,
        take: pageSize,
        orderBy: { updatedAt: 'desc' as const },
      }),
      prisma.inventory.count({ where }),
    ])

    return buildPaginatedResponse(items, total, page, pageSize)
  }

  async getInventoryById(id: string) {
    const item = await prisma.inventory.findUnique({
      where: { id },
      include: {
        product: true,
        warehouse: true,
        movements: { orderBy: { createdAt: 'desc' as const } },
      },
    })
    if (!item) throw new NotFoundError('Inventory', id)
    return item
  }

  async createInventory(data: CreateInventoryInput, userId?: string) {
    if (!data.productId || !data.warehouseId) {
      throw new ValidationError('Produit et entrepôt sont requis')
    }

    const product = await prisma.product.findUnique({ where: { id: data.productId } })
    if (!product) throw new NotFoundError('Product', data.productId)
    const warehouse = await prisma.warehouse.findUnique({ where: { id: data.warehouseId } })
    if (!warehouse) throw new NotFoundError('Warehouse', data.warehouseId)

    const existing = await prisma.inventory.findUnique({
      where: { productId_warehouseId: { productId: data.productId, warehouseId: data.warehouseId } },
    })
    if (existing) throw new ValidationError('Une ligne de stock existe déjà pour ce produit dans cet entrepôt')

    const quantity = data.quantity ?? 0
    const reserved = data.reserved ?? 0

    const item = await prisma.inventory.create({
      data: {
        productId: data.productId,
        warehouseId: data.warehouseId,
        quantity,
        reserved,
        available: quantity - reserved,
        binLocation: data.binLocation,
        lotNumber: data.lotNumber,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
        costBasis: data.costBasis,
      },
    })

    await this.recordMovement({
      productId: data.productId,
      inventoryId: item.id,
      warehouseId: data.warehouseId,
      type: 'RECEIVED',
      quantity,
      notes: data.lotNumber ? `Création stock — lot ${data.lotNumber}` : 'Création stock',
      createdBy: userId,
    })

    return item
  }

  async adjustInventory(id: string, data: { quantity?: number; reserved?: number; binLocation?: string; lotNumber?: string; costBasis?: number }, userId?: string) {
    const existing = await prisma.inventory.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('Inventory', id)

    const quantity = data.quantity !== undefined ? data.quantity : existing.quantity
    const reserved = data.reserved !== undefined ? data.reserved : existing.reserved
    if (quantity < 0 || reserved < 0) throw new ValidationError('Quantités invalides')
    if (reserved > quantity) throw new ValidationError('La quantité réservée ne peut dépasser la quantité totale')

    const delta = quantity - existing.quantity

    const item = await prisma.inventory.update({
      where: { id },
      data: {
        quantity,
        reserved,
        available: quantity - reserved,
        binLocation: data.binLocation,
        lotNumber: data.lotNumber,
        costBasis: data.costBasis,
      },
    })

    if (delta !== 0) {
      await this.recordMovement({
        productId: existing.productId,
        inventoryId: id,
        warehouseId: existing.warehouseId,
        type: 'ADJUSTED',
        quantity: Math.abs(delta),
        notes: delta > 0 ? 'Ajustement à la hausse' : 'Ajustement à la baisse',
        createdBy: userId,
      })
    }

    return item
  }

  async removeInventory(id: string) {
    const existing = await prisma.inventory.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('Inventory', id)
    await prisma.inventory.delete({ where: { id } })
    return { success: true }
  }

  // ==================== STOCK MOVEMENTS ====================

  async listMovements(filters: MovementFilters, pagination: PaginationParams) {
    const { page, pageSize, skip, orderBy } = getPaginationParams(pagination)

    const where: Prisma.StockMovementWhereInput = {}
    if (filters.type) where.type = filters.type as MovementType
    if (filters.productId) where.productId = filters.productId
    if (filters.warehouseId) {
      where.OR = [{ fromWarehouseId: filters.warehouseId }, { toWarehouseId: filters.warehouseId }]
    }
    if (filters.search) {
      const searchFilter = { contains: filters.search }
      where.AND = [
        ...(filters.warehouseId ? [{ OR: [{ fromWarehouseId: filters.warehouseId }, { toWarehouseId: filters.warehouseId }] }] : []),
        { OR: [{ reference: searchFilter }, { notes: searchFilter }, { product: { title: searchFilter } }] },
      ]
    }

    const [movements, total] = await Promise.all([
      prisma.stockMovement.findMany({
        where,
        include: {
          product: { select: { id: true, title: true, reference: true } },
          fromWarehouse: { select: { id: true, name: true, city: true } },
          toWarehouse: { select: { id: true, name: true, city: true } },
        },
        skip,
        take: pageSize,
        orderBy,
      }),
      prisma.stockMovement.count({ where }),
    ])

    return buildPaginatedResponse(movements, total, page, pageSize)
  }

  async recordMovement(data: {
    productId: string
    inventoryId?: string
    warehouseId?: string
    fromWarehouseId?: string
    toWarehouseId?: string
    type: string
    quantity: number
    reference?: string
    notes?: string
    createdBy?: string
  }) {
    return prisma.stockMovement.create({
      data: {
        productId: data.productId,
        inventoryId: data.inventoryId,
        fromWarehouseId: data.fromWarehouseId,
        toWarehouseId: data.toWarehouseId,
        type: data.type as MovementType,
        quantity: data.quantity,
        reference: data.reference,
        notes: data.notes,
        createdBy: data.createdBy,
      },
    })
  }

  async transferStock(data: {
    productId: string
    fromWarehouseId: string
    toWarehouseId: string
    quantity: number
    notes?: string
  }, userId?: string) {
    if (!data.productId || !data.fromWarehouseId || !data.toWarehouseId || !data.quantity || data.quantity <= 0) {
      throw new ValidationError('Produit, entrepôt source, entrepôt destination et quantité sont requis')
    }
    if (data.fromWarehouseId === data.toWarehouseId) {
      throw new ValidationError('Les entrepôts source et destination doivent être différents')
    }

    const from = await prisma.inventory.findUnique({
      where: { productId_warehouseId: { productId: data.productId, warehouseId: data.fromWarehouseId } },
    })
    if (!from) throw new NotFoundError('Inventory', `from ${data.fromWarehouseId}`)
    if (from.available < data.quantity) throw new ValidationError('Stock disponible insuffisant dans l\'entrepôt source')

    const to = await prisma.inventory.findUnique({
      where: { productId_warehouseId: { productId: data.productId, warehouseId: data.toWarehouseId } },
    })
    if (!to) throw new NotFoundError('Inventory', `to ${data.toWarehouseId}`)

    await prisma.$transaction([
      prisma.inventory.update({
        where: { id: from.id },
        data: { quantity: from.quantity - data.quantity, available: from.available - data.quantity },
      }),
      prisma.inventory.update({
        where: { id: to.id },
        data: { quantity: to.quantity + data.quantity, available: to.available + data.quantity },
      }),
      prisma.stockMovement.create({
        data: {
          productId: data.productId,
          inventoryId: to.id,
          fromWarehouseId: data.fromWarehouseId,
          toWarehouseId: data.toWarehouseId,
          type: 'TRANSFERRED',
          quantity: data.quantity,
          notes: data.notes,
          createdBy: userId,
        },
      }),
    ])

    return { success: true }
  }
}

export const inventoryService = new InventoryService()
