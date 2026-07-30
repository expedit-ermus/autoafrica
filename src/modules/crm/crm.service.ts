import { prisma } from '@/lib/prisma'
import { NotFoundError } from '@/shared/errors'

interface CreateCustomerInput {
  name: string
  phone?: string
  email?: string
  type: string
  country: string
  city?: string
  segment?: string
  tags?: string[]
  notes?: string
  source?: string
}

interface CreateLeadInput {
  name: string
  phone: string
  email?: string
  source?: string
  value?: number
  notes?: string
  customerId?: string
}

interface CreateInteractionInput {
  customerId: string
  type: string
  subject?: string
  content?: string
  outcome?: string
  nextAction?: string
  nextDate?: string
}

export class CrmService {
  // ── Customers ──

  async listCustomers(filters: { search?: string; type?: string; country?: string; segment?: string }, pagination: { page: number; pageSize: number }) {
    const { page, pageSize } = pagination
    const skip = (page - 1) * pageSize

    const where: any = {}
    if (filters.type) where.type = filters.type
    if (filters.country) where.country = filters.country
    if (filters.segment) where.segment = filters.segment
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({ where, skip, take: pageSize, orderBy: { createdAt: 'desc' } }),
      prisma.customer.count({ where }),
    ])

    return {
      data: customers,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    }
  }

  async getCustomer(id: string) {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: { interactions: { orderBy: { createdAt: 'desc' }, take: 20 }, leads: true },
    })
    if (!customer) throw new NotFoundError('Customer', id)
    return customer
  }

  async createCustomer(data: CreateCustomerInput) {
    return prisma.customer.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        type: data.type,
        country: data.country,
        city: data.city,
        segment: data.segment || 'new',
        tags: data.tags || [],
        notes: data.notes,
        source: data.source || 'web',
      } as any,
    })
  }

  async updateCustomer(id: string, data: Partial<CreateCustomerInput>) {
    const customer = await prisma.customer.findUnique({ where: { id } })
    if (!customer) throw new NotFoundError('Customer', id)
    return prisma.customer.update({ where: { id }, data: data as any })
  }

  async deleteCustomer(id: string) {
    const customer = await prisma.customer.findUnique({ where: { id } })
    if (!customer) throw new NotFoundError('Customer', id)
    await prisma.customer.delete({ where: { id } })
    return { success: true }
  }

  // ── Interactions ──

  async listInteractions(customerId: string) {
    return prisma.customerInteraction.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async createInteraction(data: CreateInteractionInput, userId?: string) {
    const customer = await prisma.customer.findUnique({ where: { id: data.customerId } })
    if (!customer) throw new NotFoundError('Customer', data.customerId)

    const interaction = await prisma.customerInteraction.create({
      data: {
        customerId: data.customerId,
        type: data.type,
        subject: data.subject,
        content: data.content,
        outcome: data.outcome,
        nextAction: data.nextAction,
        nextDate: data.nextDate ? new Date(data.nextDate) : undefined,
        userId,
      } as any,
    })

    await prisma.customer.update({
      where: { id: data.customerId },
      data: { lastOrderAt: new Date() },
    })

    return interaction
  }

  // ── Leads ──

  async listLeads(filters: { status?: string; search?: string }, pagination: { page: number; pageSize: number }) {
    const { page, pageSize } = pagination
    const skip = (page - 1) * pageSize

    const where: any = {}
    if (filters.status) where.status = filters.status
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({ where, skip, take: pageSize, orderBy: { createdAt: 'desc' } }),
      prisma.lead.count({ where }),
    ])

    return {
      data: leads,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    }
  }

  async createLead(data: CreateLeadInput) {
    return prisma.lead.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        source: data.source || 'web',
        value: data.value,
        notes: data.notes,
        customerId: data.customerId,
      } as any,
    })
  }

  async updateLeadStatus(id: string, status: string) {
    const lead = await prisma.lead.findUnique({ where: { id } })
    if (!lead) throw new NotFoundError('Lead', id)
    return prisma.lead.update({ where: { id }, data: { status } })
  }

  async deleteLead(id: string) {
    const lead = await prisma.lead.findUnique({ where: { id } })
    if (!lead) throw new NotFoundError('Lead', id)
    await prisma.lead.delete({ where: { id } })
    return { success: true }
  }

  // ── Stats ──

  async getStats(userId: string) {
    const [totalCustomers, totalLeads, newLeads, activeLeads, convertedLeads] = await Promise.all([
      prisma.customer.count(),
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'new' } }),
      prisma.lead.count({ where: { status: { in: ['contacted', 'qualified'] } } }),
      prisma.lead.count({ where: { status: 'converted' } }),
    ])

    return { totalCustomers, totalLeads, newLeads, activeLeads, convertedLeads }
  }
}

export const crmService = new CrmService()
