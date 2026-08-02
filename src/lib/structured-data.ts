export const SITE_URL = 'https://autoafrique-saas.vercel.app'
export const MARKETPLACE_URL = `${SITE_URL}/dashboard/marketplace`

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

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AutoAfrique',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'Marketplace de pièces détachées automobile en Afrique de l\'Ouest',
    areaServed: ['SN', 'CI', 'ML', 'BF', 'NE', 'GM', 'GN', 'BJ', 'TG', 'GH'],
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
