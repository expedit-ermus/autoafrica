import { prisma } from '@/lib/prisma'
import { PaymentMethod, PaymentTransactionStatus } from '@/generated/prisma/client'
import { NotFoundError, ValidationError, PaymentError } from '@/shared/errors'
import { paymentProviders } from './providers/registry'
import { smsWhatsAppProvider } from '../notifications/providers/sms-whatsapp.provider'

/** Violation de contrainte d'unicite Prisma (P2002). */
function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === 'P2002'
  )
}

interface ProcessPaymentInput {
  orderId: string
  method: string
  phone: string
  /**
   * Montant annoncé par le client, facultatif. Il n'est JAMAIS utilisé pour
   * débiter : le montant réel vient toujours de `order.totalAmount`. S'il est
   * fourni et diffère, la demande est rejetée — signe que le panier affiché
   * n'est plus à jour, ou d'une tentative de sous-paiement.
   */
  amount?: number
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

    // Le montant fait autorite cote serveur. Sans ce garde-fou, un acheteur
    // pouvait poster `amount: 100` sur une commande de 500 000 FCFA et la faire
    // passer en payee : le montant client n'etait jamais compare a la commande.
    const amount = order.totalAmount
    if (input.amount !== undefined && input.amount !== amount) {
      throw new ValidationError(
        `Montant incorrect : la commande s'élève à ${amount} ${order.currency}.`,
      )
    }

    // `Payment.orderId` est unique : deux demandes simultanees sur la meme
    // commande (double appui sur un reseau instable) ne peuvent pas creer deux
    // paiements. La seconde est rejetee proprement plutot qu'en erreur 500.
    let payment
    try {
      payment = await prisma.payment.create({
        data: {
          orderId: input.orderId,
          userId,
          method: input.method as PaymentMethod,
          amount,
          currency: order.currency,
          status: PaymentTransactionStatus.PENDING,
          phone: input.phone,
          providerRef: provider.shortCode,
        },
      })
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ValidationError(
          'Un paiement est déjà en cours pour cette commande. Vérifiez son statut avant de réessayer.',
        )
      }
      throw error
    }

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
      amount,
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

    await smsWhatsAppProvider.sendPaymentConfirmation({
      phone: input.phone,
      orderNumber: order.orderNumber,
      amount,
      currency: order.currency,
      method: provider.name,
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

      if (payment.phone) {
        await smsWhatsAppProvider.sendPaymentConfirmation({
          phone: payment.phone,
          orderNumber: payment.orderId,
          amount: payment.amount,
          currency: payment.currency,
          method: payment.providerRef || payment.method,
        })
      }

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
