import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { RepairEstimator } from '@/components/RepairEstimator'

export const metadata: Metadata = {
  title: 'Estimateur de Devis & Panne Express | AutoAfrique',
  description:
    'Calculez le prix de votre réparation auto en 30 secondes. Tarifs transparents pour pièces (Venantes ou Neuves) et main d’œuvre Maître Garagiste à Abidjan et Dakar.',
  alternates: {
    canonical: '/estimation-devis',
  },
}

export default function RepairEstimatorPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between">
      <Header />
      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RepairEstimator />
        </div>
      </main>
      <Footer />
    </div>
  )
}
