import VehiclePartsSearch from '@/components/VehiclePartsSearch';
import { Metadata } from 'next';
import { SITE_URL, PARTS_SEARCH_URL } from '@/lib/structured-data';
import { BreadcrumbStructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Trouvez les pièces pour votre véhicule | AutoAfrique',
  description: 'Recherchez les pièces détachées compatibles par numéro d\'immatriculation ou en sélectionnant votre modèle. Livraison rapide en Afrique de l\'Ouest.',
  openGraph: {
    title: 'Trouvez les pièces pour votre véhicule | AutoAfrique',
    description: 'Recherchez les pièces détachées compatibles par numéro d\'immatriculation ou en sélectionnant votre modèle.',
    url: `${SITE_URL}/dashboard/parts-search`,
    type: 'website',
  },
};

export default function PartsSearchPage() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <BreadcrumbStructuredData 
          items={[
            { name: 'AutoAfrique', url: SITE_URL },
            { name: 'Recherche pièces', url: PARTS_SEARCH_URL },
          ]} 
        />
        
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500" aria-label="Fil d'Ariane">
            <a href={SITE_URL} className="hover:text-orange-500 transition">AutoAfrique</a>
            <span>/</span>
            <a href="/dashboard/marketplace" className="hover:text-orange-500 transition">Marketplace</a>
            <span>/</span>
            <span className="text-gray-900 font-medium" aria-current="page">Recherche pièces</span>
          </nav>
        </div>

        <VehiclePartsSearch />
      </div>
    </div>
  );
}