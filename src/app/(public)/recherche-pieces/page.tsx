import type { Metadata } from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { SITE_URL, PARTS_SEARCH_URL } from '@/lib/structured-data';
import { BreadcrumbStructuredData } from '@/components/StructuredData';
import { marquesPourvues } from '@/modules/products/marques-pourvues';

const VehiclePartsSearch = dynamic(() => import('@/components/VehiclePartsSearch'), {
  loading: () => <LoadingSkeleton height="h-64" />,
});

export const metadata: Metadata = {
  title: 'Pièces détachées par marque de véhicule',
  description:
    "Choisissez la marque de votre voiture pour ne voir que les pièces référencées pour elle. Neuf et occasion contrôlée, livraison rapide en Afrique de l'Ouest.",
  alternates: { canonical: PARTS_SEARCH_URL },
  openGraph: {
    title: 'Pièces détachées par marque de véhicule | AutoAfrique',
    description:
      "Choisissez la marque de votre voiture pour ne voir que les pièces référencées pour elle.",
    url: PARTS_SEARCH_URL,
    type: 'website',
  },
};

/**
 * Meme fraicheur que le catalogue : une marque qui se pourvoit apparait sans
 * redeploiement.
 */
export const revalidate = 60;

export default async function RecherchePiecesPage() {
  const marques = await marquesPourvues();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <BreadcrumbStructuredData
        items={[
          { name: 'AutoAfrique', url: SITE_URL },
          { name: 'Recherche de pièces', url: PARTS_SEARCH_URL },
        ]}
      />

      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500" aria-label="Fil d'Ariane">
        <Link href="/" className="transition hover:text-orange-600">AutoAfrique</Link>
        <span>/</span>
        <Link href="/catalogue" className="transition hover:text-orange-600">Catalogue</Link>
        <span>/</span>
        <span className="font-medium text-gray-900" aria-current="page">Recherche de pièces</span>
      </nav>

      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
        Trouvez les pièces pour votre véhicule
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600">
        Choisissez la marque de votre voiture : seules les pièces référencées pour cette
        marque vous sont proposées.
      </p>

      <div className="mt-8">
        <VehiclePartsSearch marques={marques} />
      </div>
    </div>
  );
}
