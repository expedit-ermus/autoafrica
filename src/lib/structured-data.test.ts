import { describe, expect, it } from 'vitest'
import {
  buildBreadcrumbSchema,
  buildFAQPageSchema,
  buildItemListSchema,
  buildOrganizationSchema,
  buildProductSchema,
  buildWebsiteSchema,
  MARKETPLACE_URL,
  SITE_URL,
} from './structured-data'

describe('buildOrganizationSchema', () => {
  it('returns a valid Organization schema matching the documentation', () => {
    const schema = buildOrganizationSchema()

    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toBe('Organization')
    expect(schema.name).toBe('AutoAfrique')
    expect(schema.url).toBe(SITE_URL)
    expect(schema.logo).toBe(`${SITE_URL}/logo.png`)
  })

  it('lists all served countries from the documentation', () => {
    const schema = buildOrganizationSchema()

    expect(schema.areaServed).toEqual(['SN', 'CI', 'ML', 'BF', 'NE', 'GM', 'GN', 'BJ', 'TG', 'GH'])
  })

  it('contains no fake social profiles', () => {
    const schema = buildOrganizationSchema()

    expect(schema.sameAs).toEqual([])
  })
})

describe('buildWebsiteSchema', () => {
  it('returns a valid WebSite schema', () => {
    const schema = buildWebsiteSchema()

    expect(schema['@type']).toBe('WebSite')
    expect(schema.name).toBe('AutoAfrique')
    expect(schema.url).toBe(SITE_URL)
  })

  it('points the SearchAction at the real marketplace search param', () => {
    const schema = buildWebsiteSchema()

    expect(schema.potentialAction).toEqual({
      '@type': 'SearchAction',
      target: `${MARKETPLACE_URL}?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    })
    expect(schema.potentialAction.target).not.toContain('?q=')
  })
})

describe('buildProductSchema', () => {
  it('returns a valid Product schema with XOF offer', () => {
    const schema = buildProductSchema({
      name: 'Filtre à huile Toyota Hilux',
      description: 'Filtre d\'origine',
      image: 'https://example.com/filter.jpg',
      brand: 'Toyota',
      price: 8500,
      currency: 'XOF',
      seller: 'Garage Moussa',
    })

    expect(schema['@type']).toBe('Product')
    expect(schema.name).toBe('Filtre à huile Toyota Hilux')
    expect(schema.brand).toEqual({ '@type': 'Brand', name: 'Toyota' })
    expect(schema.offers.priceCurrency).toBe('XOF')
    expect(schema.offers.price).toBe('8500')
    expect(schema.offers.availability).toBe('https://schema.org/InStock')
    expect(schema.offers.seller).toEqual({ '@type': 'Organization', name: 'Garage Moussa' })
  })

  it('defaults to XOF currency and omits optional fields', () => {
    const schema = buildProductSchema({ name: 'Plaquettes', price: 18000 })

    expect(schema.offers.priceCurrency).toBe('XOF')
    expect(schema.offers.price).toBe('18000')
    expect(schema.description).toBeUndefined()
    expect(schema.image).toBeUndefined()
    expect(schema.brand).toBeUndefined()
    expect(schema.offers.seller).toBeUndefined()
  })
})

describe('buildItemListSchema', () => {
  it('builds sequential positions for each item', () => {
    const schema = buildItemListSchema([
      { url: `${MARKETPLACE_URL}?product=a` },
      { url: `${MARKETPLACE_URL}?product=b` },
    ])

    expect(schema['@type']).toBe('ItemList')
    expect(schema.itemListElement).toHaveLength(2)
    expect(schema.itemListElement[0]).toEqual({ '@type': 'ListItem', position: 1, url: `${MARKETPLACE_URL}?product=a` })
    expect(schema.itemListElement[1].position).toBe(2)
  })

  it('returns an empty list for no items', () => {
    const schema = buildItemListSchema([])

    expect(schema.itemListElement).toEqual([])
  })
})

describe('buildBreadcrumbSchema', () => {
  it('marks the last item as the current page (no item url)', () => {
    const schema = buildBreadcrumbSchema([
      { name: 'Accueil', url: SITE_URL },
      { name: 'Marketplace', url: MARKETPLACE_URL },
    ])

    expect(schema['@type']).toBe('BreadcrumbList')
    expect(schema.itemListElement[0]).toEqual({ '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL })
    expect(schema.itemListElement[1]).toEqual({ '@type': 'ListItem', position: 2, name: 'Marketplace' })
    expect(schema.itemListElement[1].item).toBeUndefined()
  })
})

describe('buildFAQPageSchema', () => {
  it('maps questions and answers into mainEntity', () => {
    const schema = buildFAQPageSchema([
      { question: 'Comment ajouter une pièce ?', answer: 'Allez dans Inventaire.' },
      { question: 'Comment payer ?', answer: 'Orange Money, MTN MoMo.' },
    ])

    expect(schema['@type']).toBe('FAQPage')
    expect(schema.mainEntity).toHaveLength(2)
    expect(schema.mainEntity[0]).toEqual({
      '@type': 'Question',
      name: 'Comment ajouter une pièce ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Allez dans Inventaire.' },
    })
  })
})
