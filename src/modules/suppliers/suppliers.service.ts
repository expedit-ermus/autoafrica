import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { NotFoundError, ValidationError } from '@/shared/errors'
import { getPaginationParams, buildPaginatedResponse } from '@/shared/utils/pagination'
import { PaginationParams } from '@/shared/types'

interface CreateSupplierInput {
  name: string
  companyName?: string
  country: string
  city?: string
  address?: string
  contactPerson?: string
  email?: string
  phone?: string
  whatsapp?: string
  website?: string
  leadTimeDays?: number
  paymentTerms?: string
  moq?: number
  verified?: boolean
}

interface SupplierFilters {
  search?: string
  country?: string
  verified?: string
  minRating?: string
}

export class SuppliersService {
  async list(filters: SupplierFilters, pagination: PaginationParams) {
    const { page, pageSize, skip, orderBy } = getPaginationParams(pagination)

    const where: Prisma.SupplierWhereInput = {}
    if (filters.country) where.country = filters.country
    if (filters.verified) where.verified = filters.verified === 'true'
    if (filters.minRating) {
      const min = Number(filters.minRating)
      if (!Number.isNaN(min)) where.rating = { gte: min }
    }
    if (filters.search) {
      const searchFilter = { contains: filters.search, mode: 'insensitive' as const }
      where.OR = [
        { name: searchFilter },
        { companyName: searchFilter },
        { contactPerson: searchFilter },
        { email: searchFilter },
        { phone: searchFilter },
      ]
    }

    const [suppliers, total] = await Promise.all([
      prisma.supplier.findMany({
        where,
        include: {
          _count: { select: { purchaseOrders: true, products: true } },
        },
        skip,
        take: pageSize,
        orderBy,
      }),
      prisma.supplier.count({ where }),
    ])

    return buildPaginatedResponse(suppliers, total, page, pageSize)
  }

  async getById(id: string) {
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        products: { orderBy: { createdAt: 'desc' }, take: 50 },
        purchaseOrders: { orderBy: { createdAt: 'desc' }, take: 20 },
      },
    })
    if (!supplier) throw new NotFoundError('Supplier', id)
    return supplier
  }

  async create(data: CreateSupplierInput) {
    if (!data.name || !data.country) {
      throw new ValidationError('Nom et pays sont requis')
    }
    return prisma.supplier.create({ data: { ...data, verified: data.verified ?? false } })
  }

  async update(id: string, data: Partial<CreateSupplierInput>) {
    const existing = await prisma.supplier.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('Supplier', id)
    return prisma.supplier.update({ where: { id }, data })
  }

  async remove(id: string) {
    const existing = await prisma.supplier.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('Supplier', id)
    await prisma.supplier.delete({ where: { id } })
    return { success: true }
  }
}

export const suppliersService = new SuppliersService()
