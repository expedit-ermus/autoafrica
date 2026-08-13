import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/modules/auth/auth.guard'
import { handleApiError } from '@/shared/utils/response'
import { NotFoundError, ForbiddenError } from '@/shared/errors'
import { generateInvoiceHtml, InvoiceData } from '@/modules/orders/pdf-invoice.generator'

type Context = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, context: Context) {
  try {
    const auth = await requireAuth(request)
    const { id } = await context.params

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: { select: { title: true, reference: true } },
          },
        },
        buyer: { select: { firstName: true, lastName: true, email: true, phone: true, address: true, city: true, country: true } },
        payment: true,
      },
    })

    if (!order) {
      throw new NotFoundError('Commande non trouvée')
    }

    // Accessible par l'acheteur de la commande ou par un Admin
    if (order.buyerId !== auth.userId && !['SUPER_ADMIN', 'TENANT_ADMIN'].includes(auth.role || '')) {
      throw new ForbiddenError('Accès non autorisé à cette facture')
    }

    const invoiceData: InvoiceData = {
      invoiceNumber: `FAC-${order.id.slice(-6).toUpperCase()}`,
      orderId: order.orderNumber || order.id,
      orderDate: order.createdAt,
      status: order.paymentStatus === 'PAID' ? 'PAID' : order.status === 'CANCELLED' ? 'CANCELLED' : 'PENDING',
      paymentMethod: order.payment?.method || order.paymentMethod || 'Mobile Money',
      paymentRef: order.payment?.providerRef || order.payment?.transactionId || order.payment?.id || undefined,
      seller: {
        name: 'AutoAfrique Marketplace',
        address: 'Boulevard du 07 Décembre, Marcory',
        city: 'Abidjan',
        country: 'Côte d\'Ivoire',
        phone: '+225 27 21 00 00 00',
        nifRccm: 'CI-ABJ-2024-B-99887',
      },
      buyer: {
        name: `${order.buyer.firstName} ${order.buyer.lastName}`,
        email: order.buyer.email,
        phone: order.buyer.phone || undefined,
        address: order.buyer.address || undefined,
        city: order.buyer.city || undefined,
        country: order.buyer.country || undefined,
      },
      items: order.items.map((item) => ({
        id: item.id,
        title: item.product?.title || 'Pièce Automobile',
        partNumber: item.product?.reference || undefined,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
      subtotal: Math.round(order.totalAmount * 0.82),
      taxTva: Math.round(order.totalAmount * 0.18),
      shippingFee: order.shippingAmount || 0,
      totalTtc: order.totalAmount,
    }

    const htmlContent = generateInvoiceHtml(invoiceData)

    return new NextResponse(htmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
