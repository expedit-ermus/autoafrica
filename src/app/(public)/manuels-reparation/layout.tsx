import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'Manuels de réparation auto à Abidjan',
  description:
    'Guides et manuels de réparation automobile gratuits : entretien moteur, freins, suspension, électricité. Fiches techniques pour garagistes à Abidjan et en Afrique de l\'Ouest.',
  alternates: {
    canonical: `${SITE_URL}/manuels-reparation`,
  },
  openGraph: {
    title: 'Manuels de réparation auto à Abidjan | AutoAfrique',
    description:
      'Fiches techniques et guides de réparation automobile pour garagistes à Abidjan. Moteur, freins, suspension, électricité auto.',
    url: `${SITE_URL}/manuels-reparation`,
    type: 'website',
  },
};

export default function ManuelsReparationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
