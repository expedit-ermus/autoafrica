import dynamic from 'next/dynamic';
import LoadingSkeleton from '@/components/LoadingSkeleton';

const VehiclePartsSearch = dynamic(() => import('@/components/VehiclePartsSearch'), {
  loading: () => <LoadingSkeleton height="h-64" />
});
import { Metadata } from 'next';

// Outil interne au tableau de bord : la version indexable de cette recherche
// vit sur /recherche-pieces. Ici, /dashboard est bloque par robots.txt et
// protege par le middleware : le referencement n'aurait aucun effet.
export const metadata: Metadata = {
  title: 'Recherche de pièces',
  robots: { index: false, follow: false },
};

export default function PartsSearchPage() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500" aria-label="Fil d'Ariane">
            <a href="/dashboard" className="hover:text-orange-500 transition">Tableau de bord</a>
            <span>/</span>
            <a href="/dashboard/marketplace" className="hover:text-orange-500 transition">Marketplace</a>
            <span>/</span>
            <span className="text-gray-900 font-medium" aria-current="page">Recherche pièces</span>
          </nav>
        </div>

        <main>
          <VehiclePartsSearch />
        </main>
      </div>
    </div>
  );
}