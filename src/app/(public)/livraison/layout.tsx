import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/structured-data';
import { BreadcrumbStructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Livraison pièces auto à Abidjan et Côte d\'Ivoire',
  description:
    'Livraison express 24h à Abidjan par moto (Tiak-Tiak), envoi par gare routière UTB vers Bouaké, Yamoussoukro et toute la Côte d\'Ivoire. Suivi en temps réel et tarifs en FCFA.',
  alternates: {
    canonical: `${SITE_URL}/livraison`,
  },
  openGraph: {
    title: 'Livraison pièces auto à Abidjan et Côte d\'Ivoire | AutoAfrique',
    description:
      'Livraison express 24h Abidjan, envoi gare routière Bouaké, Yamoussoukro, San Pedro. Tarifs transparents en FCFA.',
    url: `${SITE_URL}/livraison`,
    type: 'website',
  },
};

export default function LivraisonLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: 'Accueil', url: SITE_URL },
          { name: 'Livraison', url: `${SITE_URL}/livraison` },
        ]}
      />
      {children}
    </>
  );
}
