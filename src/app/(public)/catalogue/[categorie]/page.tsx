import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CatalogPage from '@/components/CatalogPage';
import { productsService } from '@/modules/products/products.service';
import { Product } from '@/shared/types';

interface Props {
  params: Promise<{ categorie: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorie } = await params;
  const readableName = categorie.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return {
    title: `Pièces détachées ${readableName} | AutoAfrique`,
    description: `Achetez vos pièces détachées ${readableName} neuves ou d'occasion contrôlée à Abidjan et en Afrique de l'Ouest.`,
    alternates: { canonical: `/catalogue/${categorie}` },
  };
}

export default async function PublicCategoryCataloguePage({ params }: Props) {
  const { categorie } = await params;
  const result = await productsService.list({ category: categorie }, { page: 1, pageSize: 20 });
  const rawData = (result.data || []) as unknown as Product[];
  const products: Product[] = rawData.map((p) => ({
    id: p.id,
    title: p.title || 'Pièce Automobile',
    reference: p.reference || p.id,
    price: p.price || 0,
    stock: p.stock ?? 1,
    brand: p.brand || { name: 'Toyota', slug: 'toyota' },
    category: p.category || { name: 'Pièces Auto', slug: 'pieces-auto' },
    condition: p.condition || 'Neuf',
    rating: p.rating || 4.8,
    reviewCount: p.reviewCount || 24,
    images: p.images || [],
  }));

  const readableName = categorie.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div>
      <Header />
      <CatalogPage
        kind="categorie"
        slug={categorie}
        name={readableName}
        description={`Découvrez notre sélection de pièces détachées pour la catégorie ${readableName} avec garantie et livraison rapide.`}
        count={products.length}
        products={products}
      />
      <Footer />
    </div>
  );
}
