import { prisma } from '@/lib/prisma'
import { Prisma, ContainerStatus } from '@/generated/prisma/client'
import { NotFoundError, ValidationError } from '@/shared/errors'
import { getPaginationParams, buildPaginatedResponse } from '@/shared/utils/pagination'
import { PaginationParams } from '@/shared/types'

interface CreateContainerInput {
  containerNumber: string
  purchaseOrderId?: string
  size: string
  status?: string
  originPort: string
  destinationPort: string
  shippingLine?: string
  vesselName?: string
  etaOrigin?: string
  etaDestination?: string
  departedAt?: string
  arrivedAt?: string
  clearedAt?: string
  shippingDocs?: Record<string, unknown>
}

interface ContainerFilters {
  search?: string
  status?: string
  originPort?: string
  destinationPort?: string
}

export class ContainersService {
  async list(filters: ContainerFilters, pagination: PaginationParams) {
    const { page, pageSize, skip, orderBy } = getPaginationParams(pagination)

    const where: Prisma.ContainerWhereInput = {}
    if (filters.status) where.status = filters.status as ContainerStatus
    if (filters.originPort) where.originPort = filters.originPort
    if (filters.destinationPort) where.destinationPort = filters.destinationPort
    if (filters.search) {
      const searchFilter = { contains: filters.search, mode: 'insensitive' as const }
      where.OR = [
        { containerNumber: searchFilter },
        { vesselName: searchFilter },
        { shippingLine: searchFilter },
        { purchaseOrder: { poNumber: searchFilter } },
      ]
    }

    const [containers, total] = await Promise.all([
      prisma.container.findMany({
        where,
        include: {
          purchaseOrder: { select: { id: true, poNumber: true, totalAmount: true, currency: true, status: true } },
          customsRecord: { select: { id: true, status: true } },
        },
        skip,
        take: pageSize,
        orderBy,
      }),
      prisma.container.count({ where }),
    ])

    return buildPaginatedResponse(containers, total, page, pageSize)
  }

  async getById(id: string) {
    const container = await prisma.container.findUnique({
      where: { id },
      include: {
        purchaseOrder: true,
        customsRecord: true,
      },
    })
    if (!container) throw new NotFoundError('Container', id)
    return container
  }

  async create(data: CreateContainerInput) {
    if (!data.containerNumber || !data.size || !data.originPort || !data.destinationPort) {
      throw new ValidationError('Numero de conteneur, taille, port d\'origine et port de destination sont requis')
    }

    const existing = await prisma.container.findUnique({ where: { containerNumber: data.containerNumber } })
    if (existing) throw new ValidationError('Un conteneur avec ce numero existe deja')

    if (data.purchaseOrderId) {
      const po = await prisma.purchaseOrder.findUnique({ where: { id: data.purchaseOrderId } })
      if (!po) throw new NotFoundError('PurchaseOrder', data.purchaseOrderId)
    }

    return prisma.container.create({
      data: {
        containerNumber: data.containerNumber,
        purchaseOrderId: data.purchaseOrderId,
        size: data.size,
        status: (data.status as ContainerStatus) || 'LOADING',
        originPort: data.originPort,
        destinationPort: data.destinationPort,
        shippingLine: data.shippingLine,
        vesselName: data.vesselName,
        etaOrigin: data.etaOrigin ? new Date(data.etaOrigin) : undefined,
        etaDestination: data.etaDestination ? new Date(data.etaDestination) : undefined,
        departedAt: data.departedAt ? new Date(data.departedAt) : undefined,
        arrivedAt: data.arrivedAt ? new Date(data.arrivedAt) : undefined,
        clearedAt: data.clearedAt ? new Date(data.clearedAt) : undefined,
        shippingDocs: data.shippingDocs ? JSON.stringify(data.shippingDocs) : undefined,
      },
      include: { purchaseOrder: { select: { id: true, poNumber: true } } },
    })
  }

  async updateStatus(id: string, status: string) {
    const existing = await prisma.container.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('Container', id)

    const data: Prisma.ContainerUpdateInput = { status: status as ContainerStatus }
    if (status === 'SHIPPED' && !existing.departedAt) data.departedAt = new Date()
    if (status === 'ARRIVED_PORT' && !existing.arrivedAt) data.arrivedAt = new Date()
    if (status === 'CUSTOMS_CLEARED' && !existing.clearedAt) data.clearedAt = new Date()
    if (status === 'COMPLETED' && !existing.clearedAt) data.clearedAt = new Date()

    return prisma.container.update({ where: { id }, data })
  }

  async update(id: string, data: Partial<CreateContainerInput>) {
    const existing = await prisma.container.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('Container', id)

    if (data.containerNumber) {
      const dup = await prisma.container.findFirst({ where: { containerNumber: data.containerNumber, id: { not: id } } })
      if (dup) throw new ValidationError('Un conteneur avec ce numero existe deja')
    }

    if (data.purchaseOrderId) {
      const po = await prisma.purchaseOrder.findUnique({ where: { id: data.purchaseOrderId } })
      if (!po) throw new NotFoundError('PurchaseOrder', data.purchaseOrderId)
    }

    return prisma.container.update({
      where: { id },
      data: {
        containerNumber: data.containerNumber,
        purchaseOrderId: data.purchaseOrderId,
        size: data.size,
        status: data.status ? (data.status as ContainerStatus) : undefined,
        originPort: data.originPort,
        destinationPort: data.destinationPort,
        shippingLine: data.shippingLine,
        vesselName: data.vesselName,
        etaOrigin: data.etaOrigin ? new Date(data.etaOrigin) : undefined,
        etaDestination: data.etaDestination ? new Date(data.etaDestination) : undefined,
        departedAt: data.departedAt ? new Date(data.departedAt) : undefined,
        arrivedAt: data.arrivedAt ? new Date(data.arrivedAt) : undefined,
        clearedAt: data.clearedAt ? new Date(data.clearedAt) : undefined,
        shippingDocs: data.shippingDocs ? JSON.stringify(data.shippingDocs) : undefined,
      },
      include: { purchaseOrder: { select: { id: true, poNumber: true } } },
    })
  }

  async remove(id: string) {
    const existing = await prisma.container.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('Container', id)
    await prisma.container.delete({ where: { id } })
    return { success: true }
  }
}

export const containersService = new ContainersService()
