import { prisma } from '@/lib/prisma'
import { Prisma, CustomsStatus } from '@/generated/prisma/client'
import { NotFoundError, ValidationError } from '@/shared/errors'
import { getPaginationParams, buildPaginatedResponse } from '@/shared/utils/pagination'
import { PaginationParams } from '@/shared/types'

interface CreateCustomsRecordInput {
  containerId: string
  declarationNumber?: string
  hsCode?: string
  cifValue?: number
  duties?: number
  taxes?: number
  fees?: number
  totalDuty?: number
  status?: string
  broker?: string
  brokerContact?: string
  documents?: unknown
  releasedAt?: string
  notes?: string
}

interface CustomsRecordFilters {
  search?: string
  status?: string
  containerId?: string
  broker?: string
}

export class CustomsRecordsService {
  async list(filters: CustomsRecordFilters, pagination: PaginationParams) {
    const { page, pageSize, skip, orderBy } = getPaginationParams(pagination)

    const where: Prisma.CustomsRecordWhereInput = {}
    if (filters.status) where.status = filters.status as CustomsStatus
    if (filters.containerId) where.containerId = filters.containerId
    if (filters.broker) where.broker = { contains: filters.broker }
    if (filters.search) {
      const searchFilter = { contains: filters.search }
      where.OR = [
        { declarationNumber: searchFilter },
        { hsCode: searchFilter },
        { broker: searchFilter },
        { container: { containerNumber: searchFilter } },
      ]
    }

    const [records, total] = await Promise.all([
      prisma.customsRecord.findMany({
        where,
        include: {
          container: { select: { id: true, containerNumber: true, size: true, status: true, destinationPort: true } },
        },
        skip,
        take: pageSize,
        orderBy,
      }),
      prisma.customsRecord.count({ where }),
    ])

    return buildPaginatedResponse(records, total, page, pageSize)
  }

  async getById(id: string) {
    const record = await prisma.customsRecord.findUnique({
      where: { id },
      include: {
        container: true,
      },
    })
    if (!record) throw new NotFoundError('CustomsRecord', id)
    return record
  }

  async create(data: CreateCustomsRecordInput) {
    if (!data.containerId) {
      throw new ValidationError('Conteneur requis')
    }

    const existing = await prisma.customsRecord.findUnique({ where: { containerId: data.containerId } })
    if (existing) throw new ValidationError('Un dossier douane existe deja pour ce conteneur')

    const container = await prisma.container.findUnique({ where: { id: data.containerId } })
    if (!container) throw new NotFoundError('Container', data.containerId)

    return prisma.customsRecord.create({
      data: {
        containerId: data.containerId,
        declarationNumber: data.declarationNumber,
        hsCode: data.hsCode,
        cifValue: data.cifValue,
        duties: data.duties,
        taxes: data.taxes,
        fees: data.fees,
        totalDuty: data.totalDuty,
        status: (data.status as CustomsStatus) || 'PENDING',
        broker: data.broker,
        brokerContact: data.brokerContact,
        documents: data.documents !== undefined ? JSON.stringify(data.documents) : undefined,
        releasedAt: data.releasedAt ? new Date(data.releasedAt) : undefined,
        notes: data.notes,
      },
      include: { container: { select: { id: true, containerNumber: true } } },
    })
  }

  async updateStatus(id: string, status: string) {
    const existing = await prisma.customsRecord.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('CustomsRecord', id)

    const data: Prisma.CustomsRecordUpdateInput = { status: status as CustomsStatus }
    if (status === 'RELEASED' && !existing.releasedAt) data.releasedAt = new Date()

    return prisma.customsRecord.update({ where: { id }, data })
  }

  async update(id: string, data: Partial<CreateCustomsRecordInput>) {
    const existing = await prisma.customsRecord.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('CustomsRecord', id)

    return prisma.customsRecord.update({
      where: { id },
      data: {
        declarationNumber: data.declarationNumber,
        hsCode: data.hsCode,
        cifValue: data.cifValue,
        duties: data.duties,
        taxes: data.taxes,
        fees: data.fees,
        totalDuty: data.totalDuty,
        status: data.status ? (data.status as CustomsStatus) : undefined,
        broker: data.broker,
        brokerContact: data.brokerContact,
        documents: data.documents !== undefined ? JSON.stringify(data.documents) : undefined,
        releasedAt: data.releasedAt ? new Date(data.releasedAt) : undefined,
        notes: data.notes,
      },
      include: { container: { select: { id: true, containerNumber: true } } },
    })
  }

  async remove(id: string) {
    const existing = await prisma.customsRecord.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('CustomsRecord', id)
    await prisma.customsRecord.delete({ where: { id } })
    return { success: true }
  }
}

export const customsRecordsService = new CustomsRecordsService()
