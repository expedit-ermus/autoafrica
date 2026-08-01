import { prisma } from '@/lib/prisma'
import { Prisma, InvoiceStatus } from '@/generated/prisma/client'
import { NotFoundError, ValidationError } from '@/shared/errors'
import { getPaginationParams, buildPaginatedResponse } from '@/shared/utils/pagination'
import { PaginationParams } from '@/shared/types'

const ACCOUNT_TYPES = ['asset', 'liability', 'equity', 'revenue', 'expense']

function nextInvoiceNumber() {
  return 'INV-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase()
}

interface CreateInvoiceInput {
  invoiceNumber?: string
  orderId?: string
  sellerId: string
  buyerId: string
  status?: string
  subtotal: number
  taxRate?: number
  taxAmount?: number
  totalAmount?: number
  currency?: string
  dueDate?: string
  notes?: string
}

interface InvoiceFilters {
  search?: string
  status?: string
  currency?: string
  sellerId?: string
  buyerId?: string
}

interface CreateAccountInput {
  code: string
  name: string
  type: string
  parentId?: string
  balance?: number
  currency?: string
  tenantId?: string
  active?: boolean
}

interface AccountFilters {
  search?: string
  type?: string
  active?: string
}

interface TransactionFilters {
  search?: string
  accountId?: string
  type?: string
}

interface RecordTransactionInput {
  accountId: string
  type: string
  amount: number
  description?: string
  reference?: string
  date?: string
}

export class FinanceService {
  // ==================== INVOICES ====================

  async listInvoices(filters: InvoiceFilters, pagination: PaginationParams) {
    const { page, pageSize, skip, orderBy } = getPaginationParams(pagination)

    const where: Prisma.InvoiceWhereInput = {}
    if (filters.status) where.status = filters.status as InvoiceStatus
    if (filters.currency) where.currency = filters.currency
    if (filters.sellerId) where.sellerId = filters.sellerId
    if (filters.buyerId) where.buyerId = filters.buyerId
    if (filters.search) {
      const searchFilter = { contains: filters.search, mode: 'insensitive' as const }
      where.OR = [
        { invoiceNumber: searchFilter },
        { notes: searchFilter },
        { order: { id: searchFilter } },
      ]
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          order: { select: { id: true, totalAmount: true, currency: true, status: true } },
        },
        skip,
        take: pageSize,
        orderBy,
      }),
      prisma.invoice.count({ where }),
    ])

    return buildPaginatedResponse(invoices, total, page, pageSize)
  }

  async getInvoiceById(id: string) {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { order: true },
    })
    if (!invoice) throw new NotFoundError('Invoice', id)
    return invoice
  }

  async createInvoice(data: CreateInvoiceInput) {
    if (!data.sellerId || !data.buyerId || !data.subtotal) {
      throw new ValidationError('Vendeur, acheteur et sous-total sont requis')
    }
    if (data.subtotal < 0) throw new ValidationError('Sous-total invalide')

    const subtotal = data.subtotal
    const taxRate = data.taxRate ?? 18.0
    const taxAmount = data.taxAmount ?? Math.round(subtotal * (taxRate / 100))
    const totalAmount = data.totalAmount ?? subtotal + taxAmount

    if (data.orderId) {
      const order = await prisma.order.findUnique({ where: { id: data.orderId } })
      if (!order) throw new NotFoundError('Order', data.orderId)
    }

    return prisma.invoice.create({
      data: {
        invoiceNumber: data.invoiceNumber || nextInvoiceNumber(),
        orderId: data.orderId,
        sellerId: data.sellerId,
        buyerId: data.buyerId,
        status: (data.status as InvoiceStatus) || 'DRAFT',
        subtotal,
        taxRate,
        taxAmount,
        totalAmount,
        currency: data.currency || 'XOF',
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        notes: data.notes,
      },
    })
  }

  async updateInvoice(id: string, data: Partial<CreateInvoiceInput>) {
    const existing = await prisma.invoice.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('Invoice', id)

    if (data.orderId) {
      const order = await prisma.order.findUnique({ where: { id: data.orderId } })
      if (!order) throw new NotFoundError('Order', data.orderId)
    }

    const subtotal = data.subtotal !== undefined ? data.subtotal : existing.subtotal
    const taxRate = data.taxRate !== undefined ? data.taxRate : existing.taxRate
    const taxAmount = data.taxAmount !== undefined ? data.taxAmount : Math.round(subtotal * (taxRate / 100))
    const totalAmount = data.totalAmount !== undefined ? data.totalAmount : subtotal + taxAmount

    return prisma.invoice.update({
      where: { id },
      data: {
        invoiceNumber: data.invoiceNumber,
        orderId: data.orderId,
        sellerId: data.sellerId,
        buyerId: data.buyerId,
        status: data.status ? (data.status as InvoiceStatus) : undefined,
        subtotal: data.subtotal !== undefined ? data.subtotal : undefined,
        taxRate: data.taxRate !== undefined ? data.taxRate : undefined,
        taxAmount,
        totalAmount,
        currency: data.currency,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        notes: data.notes,
      },
    })
  }

  async updateInvoiceStatus(id: string, status: string) {
    const existing = await prisma.invoice.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('Invoice', id)

    const data: Prisma.InvoiceUpdateInput = { status: status as InvoiceStatus }
    if (status === 'PAID' && !existing.paidAt) data.paidAt = new Date()
    if (status !== 'PAID' && existing.paidAt) data.paidAt = null

    return prisma.invoice.update({ where: { id }, data })
  }

  async removeInvoice(id: string) {
    const existing = await prisma.invoice.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('Invoice', id)
    await prisma.invoice.delete({ where: { id } })
    return { success: true }
  }

  // ==================== ACCOUNTS ====================

  async listAccounts(filters: AccountFilters, pagination: PaginationParams) {
    const { page, pageSize, skip, orderBy } = getPaginationParams(pagination)

    const where: Prisma.AccountWhereInput = {}
    if (filters.type) where.type = filters.type
    if (filters.active) where.active = filters.active === 'true'
    if (filters.search) {
      const searchFilter = { contains: filters.search, mode: 'insensitive' as const }
      where.OR = [{ code: searchFilter }, { name: searchFilter }]
    }

    const [accounts, total] = await Promise.all([
      prisma.account.findMany({
        where,
        include: {
          _count: { select: { children: true, transactions: true } },
        },
        skip,
        take: pageSize,
        orderBy,
      }),
      prisma.account.count({ where }),
    ])

    return buildPaginatedResponse(accounts, total, page, pageSize)
  }

  async getAccountById(id: string) {
    const account = await prisma.account.findUnique({
      where: { id },
      include: {
        parent: { select: { id: true, code: true, name: true } },
        children: { select: { id: true, code: true, name: true, balance: true, type: true } },
      },
    })
    if (!account) throw new NotFoundError('Account', id)
    return account
  }

  async createAccount(data: CreateAccountInput) {
    if (!data.code || !data.name || !data.type) {
      throw new ValidationError('Code, nom et type sont requis')
    }
    if (!ACCOUNT_TYPES.includes(data.type)) {
      throw new ValidationError('Type de compte invalide (asset, liability, equity, revenue, expense)')
    }

    const existing = await prisma.account.findFirst({ where: { code: data.code } })
    if (existing) throw new ValidationError('Un compte avec ce code existe deja')

    if (data.parentId) {
      const parent = await prisma.account.findUnique({ where: { id: data.parentId } })
      if (!parent) throw new NotFoundError('Account', data.parentId)
    }

    return prisma.account.create({
      data: {
        code: data.code,
        name: data.name,
        type: data.type,
        parentId: data.parentId,
        balance: data.balance ?? 0,
        currency: data.currency || 'XOF',
        tenantId: data.tenantId,
        active: data.active ?? true,
      },
    })
  }

  async updateAccount(id: string, data: Partial<CreateAccountInput>) {
    const existing = await prisma.account.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('Account', id)

    if (data.code) {
      const dup = await prisma.account.findFirst({ where: { code: data.code, id: { not: id } } })
      if (dup) throw new ValidationError('Un compte avec ce code existe deja')
    }
    if (data.type && !ACCOUNT_TYPES.includes(data.type)) {
      throw new ValidationError('Type de compte invalide (asset, liability, equity, revenue, expense)')
    }
    if (data.parentId) {
      if (data.parentId === id) throw new ValidationError('Un compte ne peut pas etre son propre parent')
      const parent = await prisma.account.findUnique({ where: { id: data.parentId } })
      if (!parent) throw new NotFoundError('Account', data.parentId)
    }

    return prisma.account.update({
      where: { id },
      data: {
        code: data.code,
        name: data.name,
        type: data.type,
        parentId: data.parentId,
        balance: data.balance,
        currency: data.currency,
        tenantId: data.tenantId,
        active: data.active,
      },
    })
  }

  async removeAccount(id: string) {
    const existing = await prisma.account.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('Account', id)

    const children = await prisma.account.count({ where: { parentId: id } })
    if (children > 0) throw new ValidationError('Ce compte a des comptes enfants, supprimez-les d\'abord')

    const txCount = await prisma.transaction.count({ where: { accountId: id } })
    if (txCount > 0) throw new ValidationError('Ce compte a des ecritures comptables, il ne peut pas etre supprime')

    await prisma.account.delete({ where: { id } })
    return { success: true }
  }

  // ==================== TRANSACTIONS ====================

  async listTransactions(filters: TransactionFilters, pagination: PaginationParams) {
    const { page, pageSize, skip } = getPaginationParams(pagination)
    const orderBy = pagination.sortBy
      ? { [pagination.sortBy]: pagination.sortOrder || 'desc' as const }
      : { date: 'desc' as const }

    const where: Prisma.TransactionWhereInput = {}
    if (filters.accountId) where.accountId = filters.accountId
    if (filters.type) where.type = filters.type
    if (filters.search) {
      const searchFilter = { contains: filters.search, mode: 'insensitive' as const }
      where.OR = [
        { description: searchFilter },
        { reference: searchFilter },
        { account: { name: searchFilter } },
        { account: { code: searchFilter } },
      ]
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          account: { select: { id: true, code: true, name: true, type: true, currency: true } },
        },
        skip,
        take: pageSize,
        orderBy,
      }),
      prisma.transaction.count({ where }),
    ])

    return buildPaginatedResponse(transactions, total, page, pageSize)
  }

  async recordTransaction(data: RecordTransactionInput) {
    if (!data.accountId || !data.amount || data.amount <= 0) {
      throw new ValidationError('Compte et montant positif sont requis')
    }
    if (data.type !== 'debit' && data.type !== 'credit') {
      throw new ValidationError('Type d\'ecriture invalide (debit ou credit)')
    }

    const account = await prisma.account.findUnique({ where: { id: data.accountId } })
    if (!account) throw new NotFoundError('Account', data.accountId)

    const balance = account.balance + (data.type === 'debit' ? data.amount : -data.amount)

    const [transaction] = await prisma.$transaction([
      prisma.transaction.create({
        data: {
          accountId: data.accountId,
          type: data.type,
          amount: data.amount,
          balance,
          description: data.description,
          reference: data.reference,
          date: data.date ? new Date(data.date) : undefined,
        },
        include: { account: { select: { id: true, code: true, name: true, type: true, currency: true } } },
      }),
      prisma.account.update({
        where: { id: data.accountId },
        data: { balance },
      }),
    ])

    return transaction
  }
}

export const financeService = new FinanceService()
