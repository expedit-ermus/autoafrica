import { prisma } from '@/lib/prisma'
import { PaymentMethod, PaymentTransactionStatus } from '@/generated/prisma/client'
import { NotFoundError, ValidationError, PaymentError } from '@/shared/errors'
import { paymentProviders } from './providers/registry'

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

    if (!paymentProviders.isSupported(input.method)) {
      throw new ValidationError(`Payment method not supported: ${input.method}`)
    }
    const provider = paymentProviders.get(input.method)

    const payment = await prisma.payment.create({
      data: {
        orderId: input.orderId,
        userId,
        method: input.method as PaymentMethod,
        amount: input.amount,
        currency: order.currency,
        status: PaymentTransactionStatus.PENDING,
        phone: input.phone,
        providerRef: provider.shortCode,
      },
    })

    await prisma.orderTimeline.create({
      data: {
        orderId: input.orderId,
        status: 'PENDING_PAYMENT',
        message: `Payment ${provider.name} initiated`,
        actor: userId,
      },
    })

    await this.updatePaymentStatus(payment.id, PaymentTransactionStatus.PROCESSING)

    const result = await provider.initiate({
      phone: input.phone,
      amount: input.amount,
      currency: order.currency,
      reference: payment.id,
      description: `Order ${order.orderNumber}`,
    })

    if (!result.success) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentTransactionStatus.FAILED,
          failureReason: result.error || result.message,
          metadata: { providerError: result.message },
        },
      })
      throw new PaymentError(result.error || 'Payment failed. Please try again.')
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentTransactionStatus.COMPLETED,
        transactionId: result.transactionId,
        metadata: { provider: provider.name, ussdCode: result.ussdCode, status: result.status },
        processedAt: new Date(),
      },
    })

    await prisma.order.update({
      where: { id: input.orderId },
      data: { status: 'PAID', paymentStatus: 'PAID' },
    })

    await prisma.orderTimeline.create({
      data: {
        orderId: input.orderId,
        status: 'PAID',
        message: `Payment via ${provider.name}`,
        actor: userId,
      },
    })

    return { success: true, payment, transactionId: result.transactionId }
  }

  async cancel(paymentId: string, userId: string, reason?: string) {
    const payment = await prisma.payment.findUnique({ where: { id: paymentId } })
    if (!payment) throw new NotFoundError('Payment', paymentId)
    if (payment.userId !== userId) throw new ValidationError('Not your payment')
    if (payment.status !== PaymentTransactionStatus.PENDING && payment.status !== PaymentTransactionStatus.PROCESSING) {
      throw new ValidationError('Cannot cancel a completed payment')
    }

    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: PaymentTransactionStatus.CANCELLED, failureReason: reason },
    })

    return { success: true, status: PaymentTransactionStatus.CANCELLED }
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
    if (payment.status !== PaymentTransactionStatus.COMPLETED) throw new ValidationError('Cannot refund non-completed payment')

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

  async handleWebhook(input: {
    paymentId: string
    status: 'COMPLETED' | 'FAILED'
    transactionId?: string
    failureReason?: string
    rawPayload?: Record<string, unknown>
  }) {
    const payment = await prisma.payment.findUnique({ where: { id: input.paymentId } })
    if (!payment) throw new NotFoundError('Payment', input.paymentId)

    const existingMeta = (payment.metadata as Record<string, unknown>) || {}
    const updatedMeta = JSON.parse(
      JSON.stringify({ ...existingMeta, webhookReceived: true, webhookPayload: input.rawPayload || {} }),
    )

    if (input.status === 'COMPLETED') {
      const updatedPayment = await prisma.payment.update({
        where: { id: input.paymentId },
        data: {
          status: PaymentTransactionStatus.COMPLETED,
          transactionId: input.transactionId || payment.transactionId,
          processedAt: new Date(),
          metadata: updatedMeta,
        },
      })

      await prisma.order.update({
        where: { id: payment.orderId },
        data: { status: 'PAID', paymentStatus: 'PAID' },
      })

      await prisma.orderTimeline.create({
        data: {
          orderId: payment.orderId,
          status: 'PAID',
          message: `Paiement confirmé via Webhook (${payment.providerRef || payment.method})`,
          actor: 'SYSTEM',
        },
      })

      await prisma.notification.create({
        data: {
          userId: payment.userId,
          title: 'Paiement confirmé',
          message: `Votre paiement de ${payment.amount} ${payment.currency} pour la commande a été confirmé avec succès.`,
          type: 'payment',
          link: `/dashboard/orders`,
        },
      })

      return { success: true, payment: updatedPayment }
    } else {
      const updatedPayment = await prisma.payment.update({
        where: { id: input.paymentId },
        data: {
          status: PaymentTransactionStatus.FAILED,
          failureReason: input.failureReason || 'Échec du paiement reçu via Webhook',
          metadata: updatedMeta,
        },
      })

      return { success: false, payment: updatedPayment }
    }
  }

  private async updatePaymentStatus(paymentId: string, status: PaymentTransactionStatus) {
    return prisma.payment.update({ where: { id: paymentId }, data: { status } })
  }
}

export const paymentsService = new PaymentsService()
