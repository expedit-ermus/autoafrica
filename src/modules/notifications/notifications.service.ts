import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { ValidationError } from '@/shared/errors'
import { getPaginationParams, buildPaginatedResponse } from '@/shared/utils/pagination'
import { PaginationParams } from '@/shared/types'

const NOTIFICATION_TYPES = ['order', 'payment', 'stock', 'promo', 'system']

interface CreateNotificationInput {
  userId: string
  title: string
  message: string
  type?: string
  link?: string
  metadata?: Record<string, unknown>
}

interface NotificationFilters {
  read?: string
  type?: string
  search?: string
}

export class NotificationService {
  async listNotifications(userId: string, filters: NotificationFilters, pagination: PaginationParams) {
    const { page, pageSize, skip, orderBy } = getPaginationParams(pagination)

    const where: Prisma.NotificationWhereInput = { userId }
    if (filters.read !== undefined && filters.read !== '') where.read = filters.read === 'true'
    if (filters.type) where.type = filters.type
    if (filters.search) {
      const searchFilter = { contains: filters.search, mode: 'insensitive' as const }
      where.OR = [
        { title: searchFilter },
        { message: searchFilter },
      ]
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({ where, skip, take: pageSize, orderBy }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId, read: false } }),
    ])

    return {
      ...buildPaginatedResponse(notifications, total, page, pageSize),
      unreadCount,
    }
  }

  async getUnreadCount(userId: string) {
    return prisma.notification.count({ where: { userId, read: false } })
  }

  async markAsRead(userId: string, ids: string[]) {
    if (!ids || ids.length === 0) {
      throw new ValidationError('Au moins un identifiant de notification est requis')
    }

    const result = await prisma.notification.updateMany({
      where: { id: { in: ids }, userId },
      data: { read: true, readAt: new Date() },
    })

    return { count: result.count }
  }

  async markAllAsRead(userId: string) {
    const result = await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true, readAt: new Date() },
    })

    return { count: result.count }
  }

  async createNotification(data: CreateNotificationInput) {
    if (!data.userId || !data.title || !data.message) {
      throw new ValidationError('Utilisateur, titre et message sont requis')
    }
    if (data.type && !NOTIFICATION_TYPES.includes(data.type)) {
      throw new ValidationError('Type de notification invalide (order, payment, stock, promo, system)')
    }

    return prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type || 'system',
        link: data.link,
        metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
      },
    })
  }
}

export const notificationService = new NotificationService()
