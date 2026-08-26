import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/structured-data';
import { BreadcrumbStructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Paiement Mobile Money — Pièces auto Abidjan',
  description:
    'Payez vos pièces auto en toute sécurité par Wave, Orange Money, MTN MoMo, Moov Money ou Djamo Visa à Abidjan. Système de séquestre et reçu électronique inclus.',
  alternates: {
    canonical: `${SITE_URL}/paiement`,
  },
  openGraph: {
    title: 'Paiement Mobile Money sécurisé — AutoAfrique Abidjan',
    description:
      'Wave, Orange Money, MTN MoMo, Moov Money, Djamo : payez vos pièces détachées auto à Abidjan avec séquestre sécurisé.',
    url: `${SITE_URL}/paiement`,
    type: 'website',
  },
};

export default function PaiementLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: 'Accueil', url: SITE_URL },
          { name: 'Paiement', url: `${SITE_URL}/paiement` },
        ]}
      />
      {children}
    </>
  );
}
