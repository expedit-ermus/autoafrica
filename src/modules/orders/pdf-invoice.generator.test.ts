import { describe, it, expect } from 'vitest'
import { generateInvoiceHtml, InvoiceData } from './pdf-invoice.generator'

describe('PDF Invoice Generator', () => {
  it('generates a valid HTML invoice document', () => {
    const mockData: InvoiceData = {
      invoiceNumber: 'FAC-2026-001',
      orderId: 'AAF-1002',
      orderDate: new Date('2026-08-13'),
      status: 'PAID',
      paymentMethod: 'Orange Money',
      paymentRef: 'OM_9988776655',
      currency: 'XOF',
      seller: {
        name: 'Garage Central Abidjan',
        address: 'Boulevard VGE',
        city: 'Abidjan',
        country: 'Côte d\'Ivoire',
        phone: '+225 0707070707',
        nifRccm: 'CI-ABJ-2024-B-12345',
      },
      buyer: {
        name: 'Koffi Kouassi',
        email: 'koffi@gmail.com',
        phone: '+225 0505050505',
        city: 'Bouaké',
        country: 'Côte d\'Ivoire',
      },
      items: [
        {
          id: 'item_1',
          title: 'Filtre à Huile Toyota Hilux',
          partNumber: '15601-33021',
          quantity: 2,
          unitPrice: 12000,
          totalPrice: 24000,
        },
      ],
      subtotal: 24000,
      taxTva: 4320,
      shippingFee: 3000,
      totalTtc: 31320,
    }

    const html = generateInvoiceHtml(mockData)

    expect(html).toContain('FACTURE N° FAC-2026-001')
    expect(html).toContain('Garage Central Abidjan')
    expect(html).toContain('Koffi Kouassi')
    expect(html).toContain('OM_9988776655')
    expect(html).toContain('PAYÉE')
    expect(html).toContain('Filtre à Huile Toyota Hilux')
  })
})
