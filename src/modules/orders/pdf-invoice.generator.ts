import { formatPrice, CurrencyCode } from '@/shared/utils/currency'

export interface InvoiceLineItem {
  id: string
  title: string
  partNumber?: string | null
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface InvoiceData {
  invoiceNumber: string
  orderId: string
  orderDate: string | Date
  status: 'PAID' | 'PENDING' | 'CANCELLED' | 'REFUNDED'
  paymentMethod?: string | null
  paymentRef?: string | null
  currency?: CurrencyCode
  seller: {
    name: string
    address?: string | null
    city?: string | null
    country?: string | null
    phone?: string | null
    nifRccm?: string | null
  }
  buyer: {
    name: string
    email: string
    phone?: string | null
    address?: string | null
    city?: string | null
    country?: string | null
  }
  items: InvoiceLineItem[]
  subtotal: number
  taxTva: number
  shippingFee: number
  totalTtc: number
}

export function generateInvoiceHtml(data: InvoiceData): string {
  const currency = data.currency || 'XOF'
  const dateFormatted = new Date(data.orderDate).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const statusBg = data.status === 'PAID' ? '#d1fae5' : data.status === 'PENDING' ? '#fef3c7' : '#fee2e2'
  const statusColor = data.status === 'PAID' ? '#065f46' : data.status === 'PENDING' ? '#92400e' : '#991b1b'
  const statusLabel = data.status === 'PAID' ? 'PAYÉE' : data.status === 'PENDING' ? 'EN ATTENTE' : 'ANNULÉE'

  const itemRows = data.items
    .map(
      (item) => `
    <tr style="border-bottom: 1px solid #f3f4f6;">
      <td style="padding: 12px; text-align: left; font-size: 13px; font-weight: 500; color: #111827;">
        ${item.title}
        ${item.partNumber ? `<br/><span style="font-size: 11px; color: #6b7280;">Réf: ${item.partNumber}</span>` : ''}
      </td>
      <td style="padding: 12px; text-align: center; font-size: 13px; color: #374151;">${item.quantity}</td>
      <td style="padding: 12px; text-align: right; font-size: 13px; color: #374151;">${formatPrice(item.unitPrice, currency)}</td>
      <td style="padding: 12px; text-align: right; font-size: 13px; font-weight: 600; color: #111827;">${formatPrice(item.totalPrice, currency)}</td>
    </tr>
  `
    )
    .join('')

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Facture ${data.invoiceNumber}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1f2937; margin: 0; padding: 40px; background: #ffffff; }
    .container { max-width: 800px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 16px; padding: 36px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 24px; border-bottom: 2px solid #f3f4f6; }
    .logo { font-size: 24px; font-weight: 800; color: #ea580c; text-transform: uppercase; letter-spacing: -0.5px; }
    .logo-sub { font-size: 12px; color: #6b7280; font-weight: 500; }
    .invoice-title { text-align: right; }
    .invoice-title h1 { margin: 0; font-size: 22px; color: #111827; }
    .invoice-title p { margin: 4px 0 0 0; font-size: 12px; color: #6b7280; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; background: ${statusBg}; color: ${statusColor}; margin-top: 8px; }
    .addresses { display: flex; justify-content: space-between; margin: 28px 0; gap: 24px; }
    .address-box { flex: 1; background: #f9fafb; padding: 16px; border-radius: 12px; border: 1px solid #f3f4f6; }
    .address-box h3 { margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; color: #9ca3af; letter-spacing: 0.5px; }
    .address-box p { margin: 2px 0; font-size: 13px; color: #374151; }
    table { width: 100%; border-collapse: collapse; margin: 24px 0; }
    th { background: #f9fafb; padding: 12px; font-size: 11px; text-transform: uppercase; color: #6b7280; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb; }
    .totals { width: 300px; margin-left: auto; margin-top: 20px; font-size: 13px; }
    .totals div { display: flex; justify-content: space-between; padding: 6px 0; color: #4b5563; }
    .totals .grand-total { border-top: 2px solid #111827; padding-top: 10px; font-size: 16px; font-weight: 800; color: #111827; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #f3f4f6; text-align: center; font-size: 11px; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <div class="logo">AutoAfrique</div>
        <div class="logo-sub">SaaS ERP & Marketplace Automobile Ouest-Africain</div>
      </div>
      <div class="invoice-title">
        <h1>FACTURE N° ${data.invoiceNumber}</h1>
        <p>Date : ${dateFormatted}</p>
        <p>Réf Commande : ${data.orderId}</p>
        <span class="badge">${statusLabel}</span>
      </div>
    </div>

    <div class="addresses">
      <div class="address-box">
        <h3>Vendeur / Fournisseur</h3>
        <p><strong>${data.seller.name}</strong></p>
        <p>${data.seller.address || 'Adresse non renseignée'}</p>
        <p>${data.seller.city || ''} ${data.seller.country ? `• ${data.seller.country}` : ''}</p>
        ${data.seller.phone ? `<p>Contact : ${data.seller.phone}</p>` : ''}
        ${data.seller.nifRccm ? `<p style="font-size: 11px; color: #6b7280;">NIF/RCCM : ${data.seller.nifRccm}</p>` : ''}
      </div>
      <div class="address-box">
        <h3>Client / Acheteur</h3>
        <p><strong>${data.buyer.name}</strong></p>
        <p>${data.buyer.email}</p>
        ${data.buyer.phone ? `<p>Tél : ${data.buyer.phone}</p>` : ''}
        <p>${data.buyer.address || ''} ${data.buyer.city || ''} ${data.buyer.country ? `(${data.buyer.country})` : ''}</p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="text-align: left;">Désignation / Article</th>
          <th style="text-align: center;">Qté</th>
          <th style="text-align: right;">Prix Unitaire</th>
          <th style="text-align: right;">Total HT</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
      </tbody>
    </table>

    <div class="totals">
      <div><span>Sous-total HT :</span> <span>${formatPrice(data.subtotal, currency)}</span></div>
      <div><span>TVA (18% UEMOA) :</span> <span>${formatPrice(data.taxTva, currency)}</span></div>
      <div><span>Frais de livraison :</span> <span>${formatPrice(data.shippingFee, currency)}</span></div>
      <div class="grand-total"><span>Total TTC :</span> <span>${formatPrice(data.totalTtc, currency)}</span></div>
    </div>

    ${
      data.paymentRef
        ? `
    <div style="margin-top: 24px; padding: 14px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; font-size: 12px; color: #065f46;">
      <strong>💳 Informations de Règlement Mobile Money</strong><br/>
      Moyen de paiement : ${data.paymentMethod || 'Mobile Money'}<br/>
      Référence Transaction : <strong>${data.paymentRef}</strong>
    </div>
    `
        : ''
    }

    <div class="footer">
      Facture générée automatiquement par AutoAfrique SaaS Platform • Document Officiel UEMOA / CEMAC
    </div>
  </div>
</body>
</html>
`
}
