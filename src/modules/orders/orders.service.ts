import { prisma } from '@/lib/prisma'
import { Prisma, OrderStatus, PaymentStatus } from '@/generated/prisma/client'
import { NotFoundError, ValidationError, ForbiddenError } from '@/shared/errors'
import { getPaginationParams, buildPaginatedResponse } from '@/shared/utils/pagination'
import { PaginationParams } from '@/shared/types'
import { generateOrderNumber } from '../auth/auth.utils'

interface CreateOrderInput {
  items: Array<{ productId: string; quantity: number }>
  shippingAddress?: Prisma.InputJsonValue
  billingAddress?: Prisma.InputJsonValue
  notes?: string
  shippingMethod?: string
}

interface OrderFilters {
  status?: string
  paymentStatus?: string
  buyerId?: string
  sellerId?: string
  dateFrom?: string
  dateTo?: string
}

export class OrdersService {
  async list(filters: OrderFilters, pagination: PaginationParams) {
    const { page, pageSize, skip, orderBy } = getPaginationParams(pagination)
    const where: Prisma.OrderWhereInput = {}

    if (filters.buyerId) where.buyerId = filters.buyerId
    if (filters.sellerId) {
      where.items = { some: { sellerId: filters.sellerId } }
    }
    if (filters.status) where.status = filters.status as OrderStatus
    if (filters.paymentStatus) where.paymentStatus = filters.paymentStatus as PaymentStatus
    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {
        ...(filters.dateFrom ? { gte: new Date(filters.dateFrom) } : {}),
        ...(filters.dateTo ? { lte: new Date(filters.dateTo) } : {}),
      }
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: { select: { id: true, title: true, brand: true, images: true } },
            },
          },
          buyer: { select: { id: true, firstName: true, lastName: true, phone: true, country: true } },
          payment: true,
          shipment: true,
        },
        skip,
        take: pageSize,
        orderBy,
      }),
      prisma.order.count({ where }),
    ])

    return buildPaginatedResponse(orders, total, page, pageSize)
  }

  async getById(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: {
                seller: { select: { id: true, firstName: true, lastName: true, shopName: true } },
              },
            },
          },
        },
        buyer: true,
        payment: true,
        shipment: true,
        invoice: true,
        timeline: { orderBy: { createdAt: 'desc' } },
      },
    })
    if (!order) throw new NotFoundError('Order', id)
    return order
  }

  async create(data: CreateOrderInput, buyerId: string) {
    let totalAmount = 0
    const orderItems: Prisma.OrderItemUncheckedCreateWithoutOrderInput[] = []

    for (const item of data.items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } })
      if (!product) throw new NotFoundError('Product', item.productId)
      if (product.stock < item.quantity) throw new ValidationError(`Insufficient stock for ${product.title}`)

      const itemTotal = product.price * item.quantity
      totalAmount += itemTotal
      orderItems.push({
        productId: product.id,
        sellerId: product.sellerId,
        quantity: item.quantity,
        unitPrice: product.price,
        totalPrice: itemTotal,
      })
    }

    const orderNumber = generateOrderNumber()
    const taxAmount = Math.round(totalAmount * 0.18)

    const order = await prisma.order.create({
      data: {
        orderNumber,
        buyerId,
        subtotal: totalAmount,
        taxAmount,
        totalAmount: totalAmount + taxAmount,
        shippingAddress: data.shippingAddress,
        billingAddress: data.billingAddress,
        notes: data.notes,
        shippingMethod: data.shippingMethod,
        items: { create: orderItems },
        timeline: {
          create: { status: 'PENDING', message: 'Order created', actor: buyerId },
        },
      },
      include: { items: true },
    })

    for (const item of data.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity }, salesCount: { increment: item.quantity } },
      })
    }

    return order
  }

  async updateStatus(id: string, status: string, actor: string) {
    const order = await prisma.order.findUnique({ where: { id } })
    if (!order) throw new NotFoundError('Order', id)

    const updated = await prisma.order.update({
      where: { id },
      data: { status: status as OrderStatus },
      include: { items: true },
    })

    await prisma.orderTimeline.create({
      data: { orderId: id, status, message: `Status updated to ${status}`, actor },
    })

    return updated
  }

  async cancel(id: string, userId: string, reason: string) {
    const order = await prisma.order.findUnique({ where: { id } })
    if (!order) throw new NotFoundError('Order', id)
    if (order.buyerId !== userId) throw new ForbiddenError('Not your order')
    if (!['PENDING', 'CONFIRMED'].includes(order.status)) throw new ValidationError('Order cannot be cancelled')

    await prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED', cancelledAt: new Date(), cancelReason: reason },
    })

    for (const item of await prisma.orderItem.findMany({ where: { orderId: id } })) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      })
    }

    return { success: true }
  }

  async getSellerOrders(sellerId: string, pagination: PaginationParams) {
    return this.list({ sellerId }, pagination)
  }

  async getBuyerOrders(buyerId: string, pagination: PaginationParams) {
    return this.list({ buyerId }, pagination)
  }
}

export const ordersService = new OrdersService()
