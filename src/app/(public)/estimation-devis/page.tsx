import type { Metadata } from 'next'
import { RepairEstimator } from '@/components/RepairEstimator'

export const metadata: Metadata = {
  title: 'Estimateur de Devis & Panne Express à Abidjan | AutoAfrique',
  description:
    'Calculez le prix de votre réparation auto en 30 secondes. Tarifs transparents pour pièces (Venantes ou Neuves) et main d’œuvre Maître Garagiste à Abidjan et Dakar.',
  alternates: {
    canonical: '/estimation-devis',
  },
}

export default function RepairEstimatorPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RepairEstimator />
      </div>
    </div>
  )
}
