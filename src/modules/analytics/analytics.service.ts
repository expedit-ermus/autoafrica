import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { ValidationError } from '@/shared/errors'

export const TRACKABLE_EVENTS = [
  'page_view',
  'scroll_depth',
  'time_on_page',
  'search_vehicle',
  'click_category',
  'click_brand',
  'click_cta_register',
  'click_cta_login',
  'search_product',
  'filter_product',
  'view_product',
  'add_to_cart',
  'remove_from_cart',
  'checkout_start',
  'payment_method',
  'payment_success',
  'payment_fail',
  'order_complete',
  'lead_created',
  'lead_converted',
  'customer_created',
  'login',
  'register',
  'logout',
] as const

export type TrackableEvent = (typeof TRACKABLE_EVENTS)[number]

export interface TrackEventInput {
  event: string
  userId?: string | null
  sessionId?: string | null
  entity?: string | null
  entityId?: string | null
  properties?: Record<string, unknown> | null
  country?: string | null
  city?: string | null
  device?: string | null
  browser?: string | null
  ip?: string | null
}

export interface StatsPeriod {
  from?: Date
  to?: Date
}

export interface AnalyticsStats {
  totalEvents: number
  uniqueSessions: number
  byEvent: Record<string, number>
  funnel: {
    searches: number
    productViews: number
    addToCarts: number
    checkouts: number
    orders: number
  }
  series: { date: string; count: number }[]
}

const MAX_LIST_LIMIT = 200

export class AnalyticsService {
  async trackEvent(data: TrackEventInput) {
    if (!data.event || data.event.trim() === '') {
      throw new ValidationError('Un nom d\'événement est requis')
    }
    if (!(TRACKABLE_EVENTS as readonly string[]).includes(data.event)) {
      throw new ValidationError(`Événement non reconnu : ${data.event}`)
    }
    if (data.properties !== undefined && data.properties !== null && typeof data.properties !== 'object') {
      throw new ValidationError('Les propriétés de l\'événement doivent être un objet')
    }

    return prisma.analyticsEvent.create({
      data: {
        event: data.event,
        userId: data.userId || undefined,
        sessionId: data.sessionId || undefined,
        entity: data.entity || undefined,
        entityId: data.entityId || undefined,
        properties: data.properties ? JSON.stringify(data.properties) : Prisma.DbNull,
        country: data.country || undefined,
        city: data.city || undefined,
        device: data.device || undefined,
        browser: data.browser || undefined,
        ip: data.ip || undefined,
      },
    })
  }

  async listEvents(filters: {
    userId?: string
    event?: string
    entity?: string
    entityId?: string
    from?: string
    to?: string
    limit?: number
  }) {
    const where: Prisma.AnalyticsEventWhereInput = {}
    if (filters.userId) where.userId = filters.userId
    if (filters.event) where.event = filters.event
    if (filters.entity) where.entity = filters.entity
    if (filters.entityId) where.entityId = filters.entityId
    if (filters.from || filters.to) {
      where.createdAt = {}
      if (filters.from) where.createdAt.gte = new Date(filters.from)
      if (filters.to) where.createdAt.lte = new Date(filters.to)
    }

    const limit = Math.min(MAX_LIST_LIMIT, Math.max(1, filters.limit || 50))

    const [events, total] = await Promise.all([
      prisma.analyticsEvent.findMany({ where, orderBy: { createdAt: 'desc' }, take: limit }),
      prisma.analyticsEvent.count({ where }),
    ])

    return { data: events, total }
  }

  async getStats(period?: StatsPeriod): Promise<AnalyticsStats> {
    const where: Prisma.AnalyticsEventWhereInput = {}
    if (period?.from || period?.to) {
      where.createdAt = {}
      if (period.from) where.createdAt.gte = period.from
      if (period.to) where.createdAt.lte = period.to
    }

    const events = await prisma.analyticsEvent.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      take: 5000,
    })

    const byEvent: Record<string, number> = {}
    const sessions = new Set<string>()
    const funnel = { searches: 0, productViews: 0, addToCarts: 0, checkouts: 0, orders: 0 }
    const daily: Record<string, number> = {}

    for (const e of events) {
      byEvent[e.event] = (byEvent[e.event] || 0) + 1
      if (e.sessionId) sessions.add(e.sessionId)
      if (e.event === 'search_product') funnel.searches++
      if (e.event === 'view_product') funnel.productViews++
      if (e.event === 'add_to_cart') funnel.addToCarts++
      if (e.event === 'checkout_start') funnel.checkouts++
      if (e.event === 'order_complete') funnel.orders++
      const day = e.createdAt.toISOString().slice(0, 10)
      daily[day] = (daily[day] || 0) + 1
    }

    const series = Object.entries(daily)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, count]) => ({ date, count }))

    return {
      totalEvents: events.length,
      uniqueSessions: sessions.size,
      byEvent,
      funnel,
      series,
    }
  }
}

export const analyticsService = new AnalyticsService()
