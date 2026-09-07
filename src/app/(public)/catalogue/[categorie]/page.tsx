import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import CatalogPage from '@/components/CatalogPage';
import { resolveCategory } from '@/lib/marketplace-catalog';
import { productsService } from '@/modules/products/products.service';
import { Product } from '@/shared/types';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ categorie: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorie } = await params;
  const cat = resolveCategory(categorie);
  if (!cat) return {};
  return {
    title: `Pièces détachées ${cat.name} à Abidjan`,
    description: `${cat.description} Pièces neuves et d'occasion contrôlées. Paiement Mobile Money, livraison Abidjan.`,
    // Meme contenu que /categories/{slug}, qui porte la version canonique et
    // figure seule au sitemap. Le fil d'Ariane JSON-LD de CatalogPage designe
    // deja cette URL : la balise canonique s'aligne dessus.
    alternates: { canonical: `/categories/${cat.slug}` },
  };
}

export default async function PublicCategoryCataloguePage({ params }: Props) {
  const { categorie } = await params;
  const cat = resolveCategory(categorie);
  if (!cat) notFound();

  const result = await productsService.list({ category: cat.slug }, { page: 1, pageSize: 20 });
  const products = (result.data || []) as unknown as Product[];

  return (
    <CatalogPage
      kind="categorie"
      slug={cat.slug}
      name={cat.name}
      description={cat.description}
      count={products.length}
      products={products}
    />
  );
}
