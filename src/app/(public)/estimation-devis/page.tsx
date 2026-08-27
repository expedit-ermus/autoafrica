import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import LoadingSkeleton from '@/components/LoadingSkeleton'

const RepairEstimator = dynamic(() => import('@/components/RepairEstimator').then(mod => mod.RepairEstimator), {
  loading: () => <LoadingSkeleton height="h-96" />
})
import { DEFAULT_GARAGES } from '@/lib/garages'
import { BreadcrumbStructuredData, AutoRepairListStructuredData } from '@/components/StructuredData'
import { SITE_URL } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: 'Estimateur de Devis & Panne Express à Abidjan',
  description:
    'Calculez le prix de votre réparation auto en 30 secondes. Tarifs transparents pour pièces (Venantes ou Neuves) et main d’œuvre Maître Garagiste à Abidjan et Dakar.',
  alternates: {
    canonical: '/estimation-devis',
  },
}

export default function RepairEstimatorPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-8 sm:py-12">
      <BreadcrumbStructuredData
        items={[
          { name: 'Accueil', url: SITE_URL },
          { name: 'Estimation & Devis', url: `${SITE_URL}/estimation-devis` },
        ]}
      />
      <AutoRepairListStructuredData
        garages={DEFAULT_GARAGES.map((g) => ({
          id: g.id,
          name: g.name,
          location: g.location,
          rating: g.rating,
          reviewsCount: g.reviewsCount,
        }))}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RepairEstimator />
      </div>
    </div>
  )
}
