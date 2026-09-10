import { Suspense } from 'react';
import type { Metadata } from 'next';
import RetourPaiementContenu from './RetourPaiementContenu';

// Le statut depend d'une notification recue entre-temps : rien ne doit etre
// mis en cache, et la page ne doit pas etre prerendue.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Retour de paiement',
  // Page de transaction personnelle : elle n'a rien a faire dans un index.
  robots: { index: false, follow: false },
};

export default function RetourPaiementPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <RetourPaiementContenu />
    </Suspense>
  );
}
