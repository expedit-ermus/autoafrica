import { prisma } from '@/lib/prisma'
import { PaymentMethod } from '@/generated/prisma/client'
import { NotFoundError, ValidationError, PaymentError } from '@/shared/errors'

interface ProcessPaymentInput {
  orderId: string
  method: string
  phone: string
  amount: number
}

export class PaymentsService {
  async process(input: ProcessPaymentInput, userId: string) {
    const order = await prisma.order.findUnique({ where: { id: input.orderId } })
    if (!order) throw new NotFoundError('Order', input.orderId)
    if (order.buyerId !== userId) throw new ValidationError('Not your order')
    if (order.status === 'PAID') throw new ValidationError('Order already paid')

    const result = await this.processMobileMoney(input.method)

    if (!result.success) throw new PaymentError(result.error || 'Payment failed')

    const payment = await prisma.payment.create({
      data: {
        orderId: input.orderId,
        userId,
        method: input.method as PaymentMethod,
        amount: input.amount,
        currency: order.currency,
        status: 'COMPLETED',
        transactionId: result.transactionId,
        phone: input.phone,
        processedAt: new Date(),
      },
    })

    await prisma.order.update({
      where: { id: input.orderId },
      data: { status: 'PAID', paymentStatus: 'PAID' },
    })

    await prisma.orderTimeline.create({
      data: { orderId: input.orderId, status: 'PAID', message: `Payment via ${input.method}`, actor: userId },
    })

    return { success: true, payment, transactionId: result.transactionId }
  }

  private async processMobileMoney(method: string) {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const success = Math.random() > 0.05
    if (success) {
      return {
        success: true,
        transactionId: `${method}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      }
    }
    return { success: false, error: 'Payment failed. Please try again.' }
  }

  async getStatus(paymentId: string) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: { select: { id: true, orderNumber: true, totalAmount: true, status: true } } },
    })
    if (!payment) throw new NotFoundError('Payment', paymentId)
    return payment
  }

  async list(userId: string) {
    return prisma.payment.findMany({
      where: { userId },
      include: { order: { select: { id: true, orderNumber: true, totalAmount: true, status: true } } },
      orderBy: { createdAt: 'desc' },
    })
  }

  async refund(paymentId: string, reason: string) {
    const payment = await prisma.payment.findUnique({ where: { id: paymentId } })
    if (!payment) throw new NotFoundError('Payment', paymentId)
    if (payment.status !== 'COMPLETED') throw new ValidationError('Cannot refund non-completed payment')

    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'REFUNDED', refundedAmount: payment.amount, refundedAt: new Date() },
    })

    await prisma.refund.create({
      data: { paymentId, amount: payment.amount, reason, status: 'completed' },
    })

    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: 'REFUNDED', paymentStatus: 'REFUNDED' },
    })

    return { success: true }
  }
}

export const paymentsService = new PaymentsService()
