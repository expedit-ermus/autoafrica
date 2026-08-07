import Link from 'next/link';
import { BreadcrumbStructuredData } from '@/components/StructuredData';
import CatalogueFilters from '@/components/CatalogueFilters';
import { SITE_URL } from '@/lib/structured-data';
import { Product } from '@/shared/types';

interface CatalogPageProps {
  kind: 'categorie' | 'marque';
  slug: string;
  name: string;
  description: string;
  count: number;
  products: Product[];
}

export default function CatalogPage({ kind, slug, name, description, count, products }: CatalogPageProps) {
  const canonicalPath = kind === 'categorie' ? `/marketplace/categorie/${slug}` : `/marketplace/marque/${slug}`;
  const fullUrl = `${SITE_URL}${canonicalPath}`;

  return (
    <div className="bg-[var(--color-bg)] min-h-screen">
      <BreadcrumbStructuredData
        items={[
          { name: 'AutoAfrique', url: SITE_URL },
          { name: 'Catalogue', url: `${SITE_URL}/catalogue` },
          { name, url: fullUrl },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-[var(--color-warm-muted)] mb-6" aria-label="Fil d'Ariane">
          <Link href="/" className="hover:text-orange-600 font-medium">Accueil</Link>
          <span>›</span>
          <Link href="/catalogue" className="hover:text-orange-600 font-medium">Catalogue</Link>
          <span>›</span>
          <span className="text-gray-900 font-bold">{name}</span>
        </nav>

        <div className="max-w-3xl mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-2">
            {kind === 'categorie' ? 'Catégorie AutoAfrique' : 'Constructeur AutoAfrique'}
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Pièces détachées {kind === 'categorie' ? '' : 'auto '}{name} à Abidjan
          </h1>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{description}</p>
        </div>
      </div>

      {/* Intégration du composant interactif de catalogue et filtres */}
      <CatalogueFilters products={products} />
    </div>
  );
}