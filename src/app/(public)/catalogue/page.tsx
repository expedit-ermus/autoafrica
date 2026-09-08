import { Suspense } from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { CatalogSkeleton } from '@/components/RouteSkeleton';

const CatalogueFilters = dynamic(() => import('@/components/CatalogueFilters'), {
  loading: () => <LoadingSkeleton height="h-96" />
});
import { BreadcrumbStructuredData } from '@/components/StructuredData';
import { SITE_URL } from '@/lib/structured-data';
import { productsService } from '@/modules/products/products.service';
import { Product } from '@/shared/types';

/**
 * La page etait entierement prerendue au build : une piece publiee ensuite
 * n'apparaissait jamais au catalogue public. La revalidation reprend la
 * fraicheur deja retenue pour les reponses API dans `21-PERFORMANCE.md` (60 s),
 * ce qui reflete le catalogue reel sans rendre la page a chaque requete.
 */
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Catalogue pièces détachées auto Abidjan',
  description:
    "Catalogue complet de pièces détachées neuves et d'occasion contrôlée pour Toyota, Peugeot, Hyundai, Kia, Nissan, Renault à Abidjan et Afrique de l'Ouest.",
  alternates: { canonical: '/catalogue' },
};

export default function PublicCataloguePage() {
  return (
    <div className="bg-[#F8FAFC] text-slate-900">
      <BreadcrumbStructuredData
        items={[
          { name: 'Accueil', url: SITE_URL },
          { name: 'Catalogue', url: `${SITE_URL}/catalogue` },
        ]}
      />
      {/* Hero section */}
      <div className="bg-gradient-to-b from-white via-slate-50 to-[#F8FAFC] pt-8 pb-0 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pb-8 max-w-2xl">
            <p className="text-xs font-black uppercase tracking-wider text-orange-600 mb-2">
              Catalogue AutoAfrique Abidjan
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
              Pièces détachées auto à Abidjan & Afrique de l&apos;Ouest
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Trouvez les pièces compatibles avec votre véhicule. Filtrez par marque, modèle et condition. Pièces neuves et d&apos;occasion contrôlée disponibles.
            </p>
          </div>
        </div>
      </div>

      {/* Filtres + Grille de produits */}
      <Suspense fallback={<CatalogSkeleton />}>
        <CatalogueGrid />
      </Suspense>
    </div>
  );
}

/**
 * Grille du catalogue. Le `loading.tsx` de ce segment couvrait aussi la route
 * enfant `/catalogue/[categorie]` et l'empechait de renvoyer un 404 (D60) : la
 * frontiere Suspense est donc portee par la page, sous l'en-tete, qui s'affiche
 * desormais immediatement au lieu d'etre remplace par le squelette.
 */
async function CatalogueGrid() {
  const result = await productsService.list({}, { page: 1, pageSize: 100 });
  // Aucune valeur de repli inventee : `Product.rating` et `Product.reviewCount`
  // valent 0 par defaut au schema, si bien qu'un `||` substituait une note et un
  // nombre d'avis fabriques a *tout* produit reellement sans avis. Meme travers
  // pour la marque, la categorie, l'etat et le stock (D61).
  const products = (result.data || []) as unknown as Product[];

  return <CatalogueFilters products={products} />;
}
