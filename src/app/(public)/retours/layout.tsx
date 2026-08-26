import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'Retours et garantie pièces auto à Abidjan',
  description:
    'Politique de retour et garantie conformité 48h AutoAfrique. Remboursement par Mobile Money, échange gratuit et procédure simplifiée pour vos pièces détachées à Abidjan.',
  alternates: {
    canonical: `${SITE_URL}/retours`,
  },
  openGraph: {
    title: 'Retours et garantie pièces auto à Abidjan | AutoAfrique',
    description:
      'Garantie conformité 48h, remboursement Mobile Money et échange gratuit. Politique de retour transparente à Abidjan.',
    url: `${SITE_URL}/retours`,
    type: 'website',
  },
};

export default function RetoursLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
