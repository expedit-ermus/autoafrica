import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { resolveBrand } from '@/lib/marketplace-catalog';
import CatalogPageContent, { CatalogPageFallback } from '@/components/CatalogPageContent';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = resolveBrand(slug);
  if (!entry) return {};
  return {
    title: `Pièces détachées auto ${entry.name} à Abidjan`,
    description: `${entry.description} Paiement Mobile Money, livraison 24-72h.`,
    alternates: { canonical: `/marques/${entry.slug}` },
  };
}

// `notFound()` doit s'executer avant tout envoi de reponse : le chargement des
// pieces est donc isole sous Suspense plutot que dans un `loading.tsx`, qui
// faisait emettre un 200 avant que le slug ne soit valide (D60).
export default async function MarqueCataloguePage({ params }: PageProps) {
  const { slug } = await params;
  const entry = resolveBrand(slug);
  if (!entry) notFound();

  return (
    <Suspense fallback={<CatalogPageFallback label="Chargement de la marque" />}>
      <CatalogPageContent
        kind="marque"
        slug={entry.slug}
        name={entry.name}
        description={entry.description}
        filter={{ brand: entry.name }}
      />
    </Suspense>
  );
}
