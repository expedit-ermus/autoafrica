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
    description: `${brand.description} Prix transparents, garantie occasion contrôlée, livraison Abidjan et Côte d'Ivoire.`,
    alternates: { canonical: `/marques/${brand.slug}` },
  };
}

export default async function MarqueAliasPage({ params }: PageProps) {
  const { slug } = await params;
  const brand = resolveBrand(slug);
  if (!brand) notFound();

  const res = await productsService.list({ brand: brand.name }, { page: 1, pageSize: 24 });
  let productsList = (res.data || []) as unknown as Product[];

  if (productsList.length === 0) {
    const fallbackRes = await productsService.list({}, { page: 1, pageSize: 50 });
    productsList = (fallbackRes.data || []) as unknown as Product[];
  }

  return (
    <CatalogPage
      kind="marque"
      slug={brand.slug}
      name={brand.name}
      description={brand.description}
      count={productsList.length}
      products={productsList}
    />
  );
}
