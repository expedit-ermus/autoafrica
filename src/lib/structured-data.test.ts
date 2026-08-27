import { describe, expect, it } from 'vitest'
import {
  buildAutoRepairListSchema,
  buildAutoRepairSchema,
  buildBreadcrumbSchema,
  buildFAQPageSchema,
  buildItemListSchema,
  buildOrganizationSchema,
  buildProductSchema,
  buildVehicleSchema,
  buildWebsiteSchema,
  MARKETPLACE_URL,
  SITE_URL,
} from './structured-data'

describe('buildOrganizationSchema', () => {
  it('returns a valid Organization schema matching the documentation', () => {
    const schema = buildOrganizationSchema()

    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toEqual(['Organization', 'AutoPartsStore'])
    expect(schema.name).toBe('AutoAfrique')
    expect(schema.url).toBe(SITE_URL)
    expect(schema.logo).toBe(`${SITE_URL}/logo.png`)
  })

  it('lists all served countries from the documentation', () => {
    const schema = buildOrganizationSchema()

    expect(schema.areaServed).toEqual(['CI', 'SN', 'ML', 'BF', 'NE', 'BJ', 'TG', 'GW', 'NG', 'GH'])
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

describe('buildVehicleSchema', () => {
  it('returns a valid Vehicle schema with XOF offer and odometer', () => {
    const schema = buildVehicleSchema({
      name: 'Toyota Corolla 2021',
      brand: 'Toyota',
      model: 'Corolla',
      year: 2021,
      mileage: 62000,
      fuel: 'DIESEL',
      gearbox: 'AUTOMATIC',
      bodyType: 'Berline',
      color: 'Gris métal',
      condition: 'USED',
      price: 11500000,
      currency: 'XOF',
      seller: 'Garage Moussa',
    })

    expect(schema['@type']).toBe('Vehicle')
    expect(schema.name).toBe('Toyota Corolla 2021')
    expect(schema.brand).toEqual({ '@type': 'Brand', name: 'Toyota' })
    expect(schema.vehicleModelDate).toBe('2021')
    expect(schema.mileageFromOdometer).toEqual({ '@type': 'QuantitativeValue', value: 62000, unitCode: 'KMT' })
    expect(schema.fuelType).toBe('https://schema.org/DieselFuel')
    expect(schema.vehicleTransmission).toBe('https://schema.org/AutomaticTransmission')
    expect(schema.offers.priceCurrency).toBe('XOF')
    expect(schema.offers.price).toBe('11500000')
    expect(schema.offers.itemCondition).toBe('https://schema.org/UsedCondition')
  })

  it('maps new condition to NewCondition and omits missing fields', () => {
    const schema = buildVehicleSchema({ name: 'Hilux', price: 24000000, condition: 'NEW' })

    expect(schema.offers.itemCondition).toBe('https://schema.org/NewCondition')
    expect(schema.mileageFromOdometer).toBeUndefined()
    expect(schema.fuelType).toBeUndefined()
    expect(schema.vehicleTransmission).toBeUndefined()
    expect(schema.color).toBeUndefined()
  })

  it('maps certified to UsedCondition', () => {
    const schema = buildVehicleSchema({ name: 'C180', price: 19500000, condition: 'CERTIFIED' })

    expect(schema.offers.itemCondition).toBe('https://schema.org/UsedCondition')
  })
})

describe('buildAutoRepairSchema', () => {
  it('returns a valid AutoRepair schema with AggregateRating', () => {
    const schema = buildAutoRepairSchema({
      id: 'g-diallo',
      name: 'Maître Garage Diallo',
      location: 'Yopougon Selmer, Abidjan',
      rating: 4.9,
      reviewsCount: 128,
      url: 'https://example.com/garage-diallo',
    })

    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toBe('AutoRepair')
    expect(schema['@id']).toBe(`${SITE_URL}/#garage-g-diallo`)
    expect(schema.name).toBe('Maître Garage Diallo')
    expect(schema.url).toBe('https://example.com/garage-diallo')
    expect(schema.address).toEqual({
      '@type': 'PostalAddress',
      addressLocality: 'Yopougon Selmer, Abidjan',
      addressCountry: 'CI',
    })
    expect(schema.aggregateRating).toEqual({
      '@type': 'AggregateRating',
      ratingValue: 4.9,
      reviewCount: 128,
      bestRating: 5,
      worstRating: 1,
    })
  })

  it('omits url when not provided', () => {
    const schema = buildAutoRepairSchema({
      id: 'g-diallo',
      name: 'Maître Garage Diallo',
      location: 'Yopougon Selmer, Abidjan',
      rating: 4.9,
      reviewsCount: 128,
    })

    expect(schema.url).toBeUndefined()
  })
})

describe('buildAutoRepairListSchema', () => {
  it('builds an ItemList of AutoRepair entries with sequential positions', () => {
    const schema = buildAutoRepairListSchema([
      {
        id: 'g-1',
        name: 'Garage 1',
        location: 'Abidjan',
        rating: 4.8,
        reviewsCount: 50,
      },
      {
        id: 'g-2',
        name: 'Garage 2',
        location: 'Dakar',
        rating: 4.9,
        reviewsCount: 80,
      },
    ])

    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toBe('ItemList')
    expect(schema.itemListElement).toHaveLength(2)
    expect(schema.itemListElement[0].position).toBe(1)
    expect(schema.itemListElement[0].item['@type']).toBe('AutoRepair')
    expect(schema.itemListElement[0].item.name).toBe('Garage 1')
    expect(schema.itemListElement[1].position).toBe(2)
    expect(schema.itemListElement[1].item.name).toBe('Garage 2')
  })
})

