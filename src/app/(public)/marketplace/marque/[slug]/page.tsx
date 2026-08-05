import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { resolveBrand } from '@/lib/marketplace-catalog';
import { productsService } from '@/modules/products/products.service';
import CatalogPage from '@/components/CatalogPage';
import { Product } from '@/shared/types';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = resolveBrand(slug);
  if (!brand) return {};
  return {
    title: `Pièces détachées auto ${brand.name} à Abidjan`,
    description: `${brand.description} Paiement Mobile Money, livraison 24-72h.`,
    alternates: { canonical: `/marketplace/marque/${brand.slug}` },
  };
}

export default async function MarqueCataloguePage({ params }: PageProps) {
  const { slug } = await params;
  const brand = resolveBrand(slug);
  if (!brand) notFound();

  const res = await productsService.list({ brand: brand.name }, { page: 1, pageSize: 24 });

  return (
    <CatalogPage
      kind="marque"
      slug={brand.slug}
      name={brand.name}
      description={brand.description}
      count={res.total}
      products={res.data as unknown as Product[]}
    />
  );
}