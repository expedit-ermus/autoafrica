import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'À propos d\'AutoAfrique — Pièces auto à Abidjan',
  description:
    'Découvrez la mission d\'AutoAfrique : digitaliser le commerce de pièces détachées automobile et la gestion des garages à Abidjan et en Afrique de l\'Ouest. SaaS, marketplace et Mobile Money.',
  alternates: {
    canonical: `${SITE_URL}/a-propos`,
  },
  openGraph: {
    title: 'À propos d\'AutoAfrique — Pièces auto à Abidjan',
    description:
      'Notre mission : moderniser le marché informel de la pièce détachée auto à Abidjan avec une marketplace de confiance et des solutions SaaS pour garagistes.',
    url: `${SITE_URL}/a-propos`,
    type: 'website',
  },
};

export default function AProposLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
