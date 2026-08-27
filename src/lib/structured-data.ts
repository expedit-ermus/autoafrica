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
    '@type': ['Organization', 'AutoPartsStore'],
    name: 'AutoAfrique',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'Marketplace et distributeur de pièces détachées automobile neuves et d\'occasion contrôlée à Abidjan et en Afrique de l\'Ouest',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Boulevard de Marseille, Zone 4',
      addressLocality: 'Abidjan',
      addressRegion: 'Lagunes',
      addressCountry: 'CI',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 5.316667,
      longitude: -4.033333,
    },
    telephone: '+2250700000000',
    priceRange: '5000 - 500000 XOF',
    paymentAccepted: 'Cash, Wave, Orange Money, MTN Mobile Money, Moov Money, Djamo, Carte Bancaire',
    currenciesAccepted: 'XOF',
    areaServed: ['CI', 'SN', 'ML', 'BF', 'NE', 'BJ', 'TG', 'GW', 'NG', 'GH'],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '18:30',
      },
    ],
    sameAs: [],
  };
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

export interface AutoRepairSchemaInput {
  id: string
  name: string
  location: string
  rating: number
  reviewsCount: number
  url?: string
}

export function buildAutoRepairSchema(input: AutoRepairSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    '@id': `${SITE_URL}/#garage-${input.id}`,
    name: input.name,
    address: {
      '@type': 'PostalAddress',
      addressLocality: input.location,
      addressCountry: 'CI',
    },
    ...(input.url ? { url: input.url } : {}),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: input.rating,
      reviewCount: input.reviewsCount,
      bestRating: 5,
      worstRating: 1,
    },
  }
}

export function buildAutoRepairListSchema(garages: AutoRepairSchemaInput[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: garages.map((g, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: buildAutoRepairSchema(g),
    })),
  }
}

export interface ArticleSchemaInput {
  title: string
  description: string
  authorName: string
  datePublished: string
  dateModified?: string
  imageUrl?: string
  url?: string
}

export function buildArticleSchema(input: ArticleSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    author: {
      '@type': 'Person',
      name: input.authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'AutoAfrique',
      logo: {
        '@type': 'ImageObject',
        url: 'https://autoafrique-saas.vercel.app/logo.png',
      },
    },
    datePublished: input.datePublished,
    dateModified: input.dateModified || input.datePublished,
    ...(input.imageUrl ? { image: [input.imageUrl] } : {}),
    ...(input.url ? { mainEntityOfPage: input.url } : {}),
  }
}

