import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
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

interface UpdateLeadInput {
  name?: string
  phone?: string
  email?: string
  source?: string
  value?: number
  notes?: string
  status?: string
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

    const where: Prisma.CustomerWhereInput = {}
    if (filters.type) where.type = filters.type
    if (filters.country) where.country = filters.country
    if (filters.segment) where.segment = filters.segment
    if (filters.search) {
      const searchFilter = { contains: filters.search }
      where.OR = [
        { name: searchFilter },
        { phone: searchFilter },
        { email: searchFilter },
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
      } satisfies Prisma.CustomerCreateInput,
    })
  }

  async updateCustomer(id: string, data: Partial<CreateCustomerInput>) {
    const customer = await prisma.customer.findUnique({ where: { id } })
    if (!customer) throw new NotFoundError('Customer', id)
    return prisma.customer.update({ where: { id }, data: data as Prisma.CustomerUpdateInput })
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
      } satisfies Prisma.CustomerInteractionUncheckedCreateInput,
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

    const where: Prisma.LeadWhereInput = {}
    if (filters.status) where.status = filters.status
    if (filters.search) {
      const searchFilter = { contains: filters.search }
      where.OR = [
        { name: searchFilter },
        { phone: searchFilter },
        { email: searchFilter },
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
      } satisfies Prisma.LeadUncheckedCreateInput,
    })
  }

  /**
   * Met a jour un lead. Le passage au statut `converted` materialise l'etape 3
   * du cycle lead de `14-CRM.md` : un client est cree a partir des donnees du
   * prospect et rattache au lead. Sans cela, la conversion se limitait a un
   * libelle et le client n'apparaissait jamais dans la liste des contacts.
   */
  async updateLead(id: string, data: UpdateLeadInput) {
    const lead = await prisma.lead.findUnique({ where: { id } })
    if (!lead) throw new NotFoundError('Lead', id)

    let customerId = lead.customerId
    const becomesConverted = data.status === 'converted' && lead.status !== 'converted'
    if (becomesConverted && !customerId) {
      const customer = await prisma.customer.create({
        data: {
          name: data.name ?? lead.name,
          phone: data.phone ?? lead.phone,
          email: data.email ?? lead.email,
          // Le formulaire de lead ne collecte ni type ni pays : on reprend les
          // valeurs par defaut du formulaire de contact du CRM plutot que
          // d'inventer une segmentation.
          type: 'garage',
          country: 'CI',
          segment: 'new',
          source: data.source ?? lead.source ?? 'web',
          notes: data.notes ?? lead.notes,
        } satisfies Prisma.CustomerUncheckedCreateInput,
      })
      customerId = customer.id
    }

    return prisma.lead.update({
      where: { id },
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        source: data.source,
        value: data.value,
        notes: data.notes,
        status: data.status,
        customerId: customerId ?? undefined,
      },
    })
  }

  /** @deprecated Utiliser `updateLead`, qui gere aussi la conversion en client. */
  async updateLeadStatus(id: string, status: string) {
    return this.updateLead(id, { status })
  }

  async deleteLead(id: string) {
    const lead = await prisma.lead.findUnique({ where: { id } })
    if (!lead) throw new NotFoundError('Lead', id)
    await prisma.lead.delete({ where: { id } })
    return { success: true }
  }

  // ── Stats ──

  async getStats() {
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
