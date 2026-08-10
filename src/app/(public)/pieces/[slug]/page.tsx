import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import PieceDetailCTA from '@/components/PieceDetailCTA';
import { ProductStructuredData, BreadcrumbStructuredData } from '@/components/StructuredData';
import { SITE_URL } from '@/lib/structured-data';
import { productsService } from '@/modules/products/products.service';
import { Product } from '@/shared/types';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await productsService.list({}, { page: 1, pageSize: 50 });
  const rawProducts = (result.data || []) as unknown as Product[];
  const product = rawProducts.find((p) => p.id === slug || (p.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug) || rawProducts[0];

  if (!product) return { title: 'Pièce non trouvée | AutoAfrique' };

  const brandName = product.brand?.name || 'Toyota';

  return {
    title: `${product.title} — Pièce auto ${brandName} | AutoAfrique`,
    description: `Achetez ${product.title} (${product.condition || 'Neuf'}) pour ${brandName} à ${product.price.toLocaleString()} FCFA à Abidjan. Livraison 24-72h et garantie.`,
    alternates: { canonical: `/pieces/${slug}` },
  };
}

export default async function PieceDetailPage({ params }: Props) {
  const { slug } = await params;
  const result = await productsService.list({}, { page: 1, pageSize: 50 });
  const rawProducts = (result.data || []) as unknown as Product[];
  const product = rawProducts.find((p) => p.id === slug || (p.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug) || rawProducts[0];

  if (!product) notFound();

  const brandName = product.brand?.name || 'Toyota';
  const categoryName = product.category?.name || 'Pièces Auto';

  const related = rawProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const imagesArr = Array.isArray(product.images) ? product.images : [];
  const firstImg = imagesArr.length > 0 ? String(imagesArr[0]) : '';

  return (
    <div className="bg-[var(--color-bg)] min-h-screen">
      <ProductStructuredData
        name={product.title}
        description={`Pièce ${product.title} pour ${brandName} ${product.model || ''}.`}
        brand={brandName}
        price={product.price}
        currency="XOF"
        image={firstImg}
      />

      <BreadcrumbStructuredData
        items={[
          { name: 'AutoAfrique', url: SITE_URL },
          { name: 'Catalogue', url: `${SITE_URL}/catalogue` },
          { name: product.title, url: `${SITE_URL}/pieces/${slug}` },
        ]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Fil d'ariane */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-6" aria-label="Fil d'Ariane">
          <Link href="/" className="hover:text-emerald-600">Accueil</Link>
          <span>›</span>
          <Link href="/catalogue" className="hover:text-emerald-600">Catalogue</Link>
          <span>›</span>
          <span className="font-bold text-gray-900 truncate">{product.title}</span>
        </nav>

        {/* Fiche Produit Principale */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          
          {/* Image Produit */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <div className="w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center text-7xl bg-white rounded-2xl shadow-inner border border-gray-200">
              ⚙️
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                {product.condition || 'Neuf OEM'}
              </span>
              <span className="text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                Stock : {product.stock > 0 ? `${product.stock} dispo` : 'À confirmer'}
              </span>
            </div>
          </div>

          {/* Détails & Compatibilité */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600">
                {categoryName}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
                {product.title}
              </h1>
              <p className="text-sm text-gray-500 mt-1">Référence : {product.reference || product.id}</p>
            </div>

            {/* Prix & Dispo */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-700 font-bold block">Prix final en FCFA</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-900">
                  {product.price.toLocaleString()} FCFA
                </span>
              </div>
              <span className="text-xs font-bold bg-emerald-600 text-white px-3 py-1.5 rounded-xl">
                Garantie 30 jours
              </span>
            </div>

            {/* Compatibilité Véhicule (Visible sans action supplémentaire) */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <h3 className="text-xs font-extrabold uppercase text-gray-700 mb-2 flex items-center gap-1.5">
                <span>🚗</span> Compatibilité Véhicule Garantie
              </h3>
              <p className="text-sm font-bold text-gray-900">
                {brandName} {product.model || 'Tous modèles'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Convient pour les motorisations Diesel & Essence en Afrique de l&apos;Ouest.
              </p>
            </div>

            {/* CTA Contact Vendeur & Paiement Séquestre Interactif */}
            <PieceDetailCTA
              productId={product.id}
              title={product.title}
              brand={brandName}
              reference={product.reference || product.id}
              price={product.price}
              image={firstImg}
              stock={product.stock}
            />
          </div>
        </div>

        {/* Fiche Vendeur (Vendeur & Réassurance) */}
        <div className="mt-8 bg-white rounded-3xl p-6 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center text-xl">
              🏪
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-base">Magasin Ferraille N&apos;Dotré Pro</h3>
              <p className="text-xs text-gray-500">Vendeur Vérifié AutoAfrique • Abidjan, Côte d&apos;Ivoire ⭐ 4.9 (128 avis)</p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            ✓ Pièce disponible en gare routière ou livraison Tiak-Tiak
          </span>
        </div>

        {/* Pièces Similaires */}
        <div className="mt-12">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-6">
            Pièces similaires & compatibles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((rel) => {
              const relImages = Array.isArray(rel.images) ? rel.images : [];
              const relImg = relImages.length > 0 ? String(relImages[0]) : '';
              return (
                <ProductCard
                  key={rel.id}
                  id={rel.id}
                  name={rel.title}
                  reference={rel.reference || rel.id}
                  price={rel.price}
                  rating={rel.rating || 4.8}
                  reviewCount={rel.reviewCount || 12}
                  image={relImg}
                  brand={rel.brand?.name || 'Toyota'}
                  inStock={rel.stock > 0}
                />
              );
            })}
          </div>
        </div>
      </main>

    </div>
  );
}
