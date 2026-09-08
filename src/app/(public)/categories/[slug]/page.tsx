import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { resolveCategory } from '@/lib/marketplace-catalog';
import CatalogPageContent, { CatalogPageFallback } from '@/components/CatalogPageContent';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = resolveCategory(slug);
  if (!entry) return {};
  return {
    title: `Pièces détachées ${entry.name} à Abidjan`,
    description: `${entry.description} Pièces neuves et d'occasion contrôlées. Paiement Mobile Money, livraison Abidjan.`,
    alternates: { canonical: `/categories/${entry.slug}` },
  };
}

// `notFound()` doit s'executer avant tout envoi de reponse : le chargement des
// pieces est donc isole sous Suspense plutot que dans un `loading.tsx`, qui
// faisait emettre un 200 avant que le slug ne soit valide (D60).
export default async function CategorieAliasPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = resolveCategory(slug);
  if (!entry) notFound();

  return (
    <Suspense fallback={<CatalogPageFallback label="Chargement de la catégorie" />}>
      <CatalogPageContent
        kind="categorie"
        slug={entry.slug}
        name={entry.name}
        description={entry.description}
        filter={{ category: entry.slug }}
        fallbackToAllProducts
      />
    </Suspense>
  );
}
