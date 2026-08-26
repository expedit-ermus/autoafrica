import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/structured-data';
import { BreadcrumbStructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Centre d\'aide — Pièces auto Abidjan',
  description:
    'Trouvez des réponses à vos questions sur AutoAfrique : commande, livraison, paiement Mobile Money, garantie pièces détachées auto à Abidjan et en Côte d\'Ivoire.',
  alternates: {
    canonical: `${SITE_URL}/aide`,
  },
  openGraph: {
    title: 'Centre d\'aide AutoAfrique — Pièces auto Abidjan',
    description:
      'FAQ, guides et support client pour vos commandes de pièces détachées auto à Abidjan. Livraison, paiement, retours et garantie.',
    url: `${SITE_URL}/aide`,
    type: 'website',
  },
};

export default function AideLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: 'Accueil', url: SITE_URL },
          { name: 'Centre d\'aide', url: `${SITE_URL}/aide` },
        ]}
      />
      {children}
    </>
  );
}
