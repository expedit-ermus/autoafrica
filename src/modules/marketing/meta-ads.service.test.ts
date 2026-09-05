import { describe, it, expect, vi, beforeEach } from 'vitest'
import { metaAdsService } from './meta-ads.service'
import { prisma } from '@/lib/prisma'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: vi.fn(),
    },
  },
}))

describe('MetaAdsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates and lists Meta Ads campaigns with ROAS metrics', async () => {
    const newCamp = await metaAdsService.createCampaign({
      name: 'Campagne Ciblée Garagistes Yopougon',
      targetCity: 'Abidjan',
      dailyBudget: 25000,
    })

    expect(newCamp.id).toContain('meta_camp_')
    expect(newCamp.dailyBudget).toBe(25000)

    const summary = await metaAdsService.getPerformanceSummary()
    expect(summary.activeCampaignsCount).toBeGreaterThanOrEqual(3)
    expect(summary.overallRoas).toBeGreaterThan(0)
  })

  it('generates Meta Commerce Automotive Catalog Feed XML compliant with Facebook/Instagram Shops', async () => {
    const mockProducts = [
      {
        id: 'prod-meta-1',
        title: 'Injecteur Moteur Toyota Hilux 2.4 D-4D',
        description: 'Injecteur d’origine reconditionné',
        stock: 12,
        condition: 'RECONDITIONED',
        price: 45000,
        slug: 'injecteur-toyota-hilux-2-4d',
        image: 'https://autoafrique-saas.vercel.app/hilux.jpg',
        reference: 'TOY-23670-0L020',
        brand: { name: 'Toyota' },
        category: { name: 'Moteur & Injection' },
      },
    ]

    // Mock volontairement partiel : seuls les champs lus par le service sont fournis.
    vi.mocked(prisma.product.findMany).mockResolvedValue(
      mockProducts as unknown as Awaited<ReturnType<typeof prisma.product.findMany>>,
    )

    const xmlFeed = await metaAdsService.generateMetaCatalogFeedXML()

    expect(xmlFeed).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(xmlFeed).toContain('<g:id>prod-meta-1</g:id>')
    expect(xmlFeed).toContain('<g:title><![CDATA[Injecteur Moteur Toyota Hilux 2.4 D-4D]]></g:title>')
    expect(xmlFeed).toContain('<g:price>45000 XOF</g:price>')
    expect(xmlFeed).toContain('<g:google_product_category>Vehicles &amp; Parts &gt; Vehicle Parts &amp; Accessories</g:google_product_category>')
  })

  it('builds Meta Conversions API (CAPI) event payload', () => {
    const event = metaAdsService.buildConversionsApiEvent(
      'Purchase',
      { email: 'GARAGE.DIALLO@GMAIL.COM', phone: '+225 0707070707' },
      { value: 150000, currency: 'XOF' }
    )

    expect(event.data[0].event_name).toBe('Purchase')
    expect(event.data[0].user_data.em).toEqual(['garage.diallo@gmail.com'])
    expect(event.data[0].user_data.ph).toEqual(['2250707070707'])
  })
})
