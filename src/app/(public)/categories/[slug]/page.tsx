import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { resolveCategory } from '@/lib/marketplace-catalog';
import { productsService } from '@/modules/products/products.service';
import CatalogPage from '@/components/CatalogPage';
import { Product } from '@/shared/types';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cat = resolveCategory(slug);
  if (!cat) return {};
  return {
    title: `Pièces détachées ${cat.name} à Abidjan`,
    description: `${cat.description} Pièces neuves et d'occasion contrôlées. Paiement Mobile Money, livraison Abidjan.`,
    alternates: { canonical: `/categories/${cat.slug}` },
  };
}

export default async function CategorieAliasPage({ params }: PageProps) {
  const { slug } = await params;
  const cat = resolveCategory(slug);
  if (!cat) notFound();

  const res = await productsService.list({ category: cat.slug }, { page: 1, pageSize: 24 });
  let productsList = (res.data || []) as unknown as Product[];

  if (productsList.length === 0) {
    const fallbackRes = await productsService.list({}, { page: 1, pageSize: 50 });
    productsList = (fallbackRes.data || []) as unknown as Product[];
  }

  return (
    <CatalogPage
      kind="categorie"
      slug={cat.slug}
      name={cat.name}
      description={cat.description}
      count={productsList.length}
      products={productsList}
    />
  );
}
