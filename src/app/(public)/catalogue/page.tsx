import type { Metadata } from 'next';
import CatalogueFilters from '@/components/CatalogueFilters';
import { productsService } from '@/modules/products/products.service';
import { Product } from '@/shared/types';

export const metadata: Metadata = {
  title: 'Catalogue des pièces détachées auto | AutoAfrique',
  description:
    "Catalogue complet de pièces détachées neuves et d'occasion contrôlée pour Toyota, Peugeot, Hyundai, Kia, Nissan, Renault à Abidjan et Afrique de l'Ouest.",
  alternates: { canonical: '/catalogue' },
};

export default async function PublicCataloguePage() {
  const result = await productsService.list({}, { page: 1, pageSize: 100 });
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
    <div className="bg-[var(--color-bg)]">
      {/* Hero section */}
      <div className="bg-gradient-to-b from-[var(--color-bg-warm)] to-white pt-8 pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pb-8 max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-wider text-orange-500 mb-2">
              Catalogue AutoAfrique
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
              Pièces détachées auto — Afrique de l&apos;Ouest
            </h1>
            <p className="text-gray-500 leading-relaxed">
              Trouvez les pièces compatibles avec votre véhicule. Filtrez par marque, modèle et condition. Pièces neuves et d&apos;occasion contrôlée disponibles.
            </p>
          </div>
        </div>
      </div>

      {/* Filtres + Grille de produits */}
      <CatalogueFilters products={products} />
    </div>
  );
}
