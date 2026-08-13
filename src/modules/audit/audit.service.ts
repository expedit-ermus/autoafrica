import { prisma } from '@/lib/prisma'

export interface CreateAuditLogInput {
  userId?: string
  tenantId?: string
  action: string
  entity: string
  entityId?: string
  oldValues?: Record<string, unknown>
  newValues?: Record<string, unknown>
  ip?: string
  userAgent?: string
}

export class AuditService {
  async log(data: CreateAuditLogInput) {
    try {
      return await prisma.auditLog.create({
        data: {
          userId: data.userId,
          tenantId: data.tenantId,
          action: data.action,
          entity: data.entity,
          entityId: data.entityId,
          oldValues: data.oldValues ? JSON.stringify(data.oldValues) : undefined,
          newValues: data.newValues ? JSON.stringify(data.newValues) : undefined,
          ip: data.ip,
          userAgent: data.userAgent,
        },
      })
    } catch (err) {
      console.error('❌ AuditLog Error:', err)
      return null
    }
  }

  async list(filters: { userId?: string; entity?: string; action?: string }, pageSize = 50) {
    const where: Record<string, unknown> = {}
    if (filters.userId) where.userId = filters.userId
    if (filters.entity) where.entity = filters.entity
    if (filters.action) where.action = filters.action

    return prisma.auditLog.findMany({
      where,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true, role: true },
        },
      },
    })
  }
}

export const auditService = new AuditService()
