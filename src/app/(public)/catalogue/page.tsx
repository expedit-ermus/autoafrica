import type { Metadata } from 'next';
import CatalogPage from '@/components/CatalogPage';
import { productsService } from '@/modules/products/products.service';
import { Product } from '@/shared/types';

export const metadata: Metadata = {
  title: 'Catalogue des pièces détachées auto | AutoAfrique',
  description: 'Catalogue complet de pièces détachées neuves et d\'occasion contrôlée pour Toyota, Peugeot, Hyundai, Kia, Nissan, Renault à Abidjan et Afrique de l\'Ouest.',
  alternates: { canonical: '/catalogue' },
};

export default async function PublicCataloguePage() {
  const result = await productsService.list({}, { page: 1, pageSize: 20 });
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

  return (
    <div>
      <CatalogPage
        kind="categorie"
        slug="catalogue"
        name="Catalogue de Pièces Auto"
        description="Explorez l'intégralité de notre catalogue de pièces détachées neuves et d'occasion pour tous véhicules en Afrique de l'Ouest."
        count={products.length}
        products={products}
      />
    </div>
  );
}
