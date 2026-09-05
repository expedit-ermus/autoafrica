import {
  buildArticleSchema,
  buildAutoRepairListSchema,
  buildBreadcrumbSchema,
  buildFAQPageSchema,
  buildItemListSchema,
  buildOrganizationSchema,
  buildProductSchema,
  buildVehicleSchema,
  buildWebsiteSchema,
  AutoRepairSchemaInput,
  BreadcrumbEntry,
  FAQEntry,
  ItemListEntry,
  VehicleSchemaInput,
} from '@/lib/structured-data'

interface JsonLd {
  '@context': string
  [key: string]: unknown
}

function JsonLdScript({ id, data }: { id: string; data: JsonLd }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationStructuredData() {
  return <JsonLdScript id="organization-schema" data={buildOrganizationSchema()} />;
}

export function WebsiteStructuredData() {
  return <JsonLdScript id="website-schema" data={buildWebsiteSchema()} />;
}

interface ProductStructuredDataProps {
  name: string;
  description?: string | null;
  image?: string;
  brand?: string;
  price: number;
  currency?: string;
  seller?: string;
  url?: string;
}

export function ProductStructuredData({
  name,
  description,
  image,
  brand,
  price,
  currency,
  seller,
  url,
}: ProductStructuredDataProps) {
  return (
    <JsonLdScript
      id="product-schema"
      data={buildProductSchema({ name, description, image, brand, price, currency, seller, url })}
    />
  );
}

interface ItemListStructuredDataProps {
  items: ItemListEntry[];
}

export function ItemListStructuredData({ items }: ItemListStructuredDataProps) {
  if (items.length === 0) return null;
  return <JsonLdScript id="itemlist-schema" data={buildItemListSchema(items)} />;
}

type VehicleStructuredDataProps = VehicleSchemaInput;

export function VehicleStructuredData(props: VehicleStructuredDataProps) {
  return <JsonLdScript id="vehicle-schema" data={buildVehicleSchema(props)} />;
}

interface AutoRepairListStructuredDataProps {
  garages: AutoRepairSchemaInput[];
}

export function AutoRepairListStructuredData({ garages }: AutoRepairListStructuredDataProps) {
  if (garages.length === 0) return null;
  return <JsonLdScript id="autorepair-schema" data={buildAutoRepairListSchema(garages)} />;
}

interface BreadcrumbStructuredDataProps {
  items: BreadcrumbEntry[];
}

export function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  if (items.length === 0) return null;
  return <JsonLdScript id="breadcrumb-schema" data={buildBreadcrumbSchema(items)} />;
}

interface FAQStructuredDataProps {
  items: FAQEntry[];
}

export function FAQStructuredData({ items }: FAQStructuredDataProps) {
  if (items.length === 0) return null;
  return <JsonLdScript id="faq-schema" data={buildFAQPageSchema(items)} />;
}

export function ArticleStructuredData(props: {
  title: string
  description: string
  authorName: string
  datePublished: string
  dateModified?: string
  imageUrl?: string
  url?: string
}) {

  return <JsonLdScript id="article-schema" data={buildArticleSchema(props)} />
}

