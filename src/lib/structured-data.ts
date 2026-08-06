export const SITE_URL = 'https://autoafrique-saas.vercel.app'
export const MARKETPLACE_URL = `${SITE_URL}/dashboard/marketplace`
export const VEHICLES_URL = `${SITE_URL}/dashboard/vehicles`
export const PARTS_SEARCH_URL = `${SITE_URL}/dashboard/parts-search`

export interface BreadcrumbEntry {
  name: string
  url: string
}

export interface FAQEntry {
  question: string
  answer: string
}

export interface ItemListEntry {
  url: string
}

export interface ProductSchemaInput {
  name: string
  description?: string | null
  image?: string
  brand?: string
  price: number
  currency?: string
  seller?: string
  url?: string
}

const FUEL_SCHEMA: Record<string, string> = {
  DIESEL: 'https://schema.org/DieselFuel',
  GASOLINE: 'https://schema.org/Gasoline',
  HYBRID: 'https://schema.org/Hybrid',
  ELECTRIC: 'https://schema.org/ElectricFuel',
  LPG: 'https://schema.org/Propane',
}

const GEARBOX_SCHEMA: Record<string, string> = {
  MANUAL: 'https://schema.org/ManualTransmission',
  AUTOMATIC: 'https://schema.org/AutomaticTransmission',
}

const CONDITION_SCHEMA: Record<string, string> = {
  NEW: 'https://schema.org/NewCondition',
  USED: 'https://schema.org/UsedCondition',
  CERTIFIED: 'https://schema.org/UsedCondition',
}

export interface VehicleSchemaInput {
  name: string
  description?: string | null
  image?: string
  brand?: string
  model?: string
  year?: number | null
  mileage?: number | null
  fuel?: string | null
  gearbox?: string | null
  bodyType?: string | null
  color?: string | null
  condition?: string | null
  price: number
  currency?: string
  seller?: string
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AutoAfrique',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'Marketplace de pièces détachées automobile en Afrique de l\'Ouest',
    areaServed: ['CI', 'SN', 'ML', 'BF', 'NE', 'BJ', 'TG', 'GW', 'NG', 'GH'],
    sameAs: [],
  }
}

export function buildWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AutoAfrique',
    url: SITE_URL,
    description: 'Marketplace de pièces détachées automobile en Afrique de l\'Ouest',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${MARKETPLACE_URL}?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function buildProductSchema(input: ProductSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    ...(input.image ? { image: input.image } : {}),
    ...(input.brand ? { brand: { '@type': 'Brand', name: input.brand } } : {}),
    offers: {
      '@type': 'Offer',
      priceCurrency: input.currency || 'XOF',
      price: String(input.price),
      availability: 'https://schema.org/InStock',
      ...(input.seller ? { seller: { '@type': 'Organization', name: input.seller } } : {}),
      ...(input.url ? { url: input.url } : {}),
    },
  }
}

export function buildItemListSchema(items: ItemListEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: item.url,
    })),
  }
}

export function buildVehicleSchema(input: VehicleSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    ...(input.image ? { image: input.image } : {}),
    ...(input.brand ? { brand: { '@type': 'Brand', name: input.brand } } : {}),
    ...(input.model ? { model: input.model } : {}),
    ...(input.year ? { vehicleModelDate: String(input.year) } : {}),
    ...(input.mileage ? { mileageFromOdometer: { '@type': 'QuantitativeValue', value: input.mileage, unitCode: 'KMT' } } : {}),
    ...(input.color ? { color: input.color } : {}),
    ...(input.bodyType ? { bodyType: input.bodyType } : {}),
    ...(input.fuel && FUEL_SCHEMA[input.fuel] ? { fuelType: FUEL_SCHEMA[input.fuel] } : {}),
    ...(input.gearbox && GEARBOX_SCHEMA[input.gearbox] ? { vehicleTransmission: GEARBOX_SCHEMA[input.gearbox] } : {}),
    offers: {
      '@type': 'Offer',
      priceCurrency: input.currency || 'XOF',
      price: String(input.price),
      availability: 'https://schema.org/InStock',
      ...(input.condition && CONDITION_SCHEMA[input.condition] ? { itemCondition: CONDITION_SCHEMA[input.condition] } : {}),
      ...(input.seller ? { seller: { '@type': 'Organization', name: input.seller } } : {}),
    },
  }
}

export function buildBreadcrumbSchema(items: BreadcrumbEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(index < items.length - 1 ? { item: item.url } : {}),
    })),
  }
}

export function buildFAQPageSchema(items: FAQEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}
