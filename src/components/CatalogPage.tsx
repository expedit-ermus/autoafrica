import Link from 'next/link';
import { BreadcrumbStructuredData } from '@/components/StructuredData';
import ProductCard from '@/components/ProductCard';
import { MARKETPLACE_URL, SITE_URL } from '@/lib/structured-data';
import { Product } from '@/shared/types';

interface CatalogPageProps {
  kind: 'categorie' | 'marque';
  slug: string;
  name: string;
  description: string;
  count: number;
  products: Product[];
}

function firstImage(p: Product): string {
  if (Array.isArray(p.images) && p.images.length > 0) return p.images[0];
  if (typeof p.images === 'string' && p.images) {
    try {
      const arr = JSON.parse(p.images);
      if (Array.isArray(arr) && arr.length > 0) return String(arr[0]);
    } catch {
      /* ignore */
    }
  }
  return '';
}

export default function CatalogPage({ kind, slug, name, description, count, products }: CatalogPageProps) {
  const canonicalPath = kind === 'categorie' ? `/marketplace/categorie/${slug}` : `/marketplace/marque/${slug}`;
  const fullUrl = `${SITE_URL}${canonicalPath}`;

  return (
    <div className="bg-[var(--color-bg)]">
      <BreadcrumbStructuredData
        items={[
          { name: 'AutoAfrique', url: SITE_URL },
          { name: 'Marketplace', url: MARKETPLACE_URL },
          { name, url: fullUrl },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-[var(--color-warm-muted)] mb-6" aria-label="Fil d'Ariane">
          <Link href="/" className="hover:text-[var(--color-primary)] font-medium">Accueil</Link>
          <span>›</span>
          <Link href={MARKETPLACE_URL} className="hover:text-[var(--color-primary)] font-medium">Marketplace</Link>
          <span>›</span>
          <span className="text-[var(--color-warm-faint)] font-semibold">{name}</span>
        </nav>

        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] mb-2">
            {kind === 'categorie' ? 'Catégorie AutoAfrique' : 'Constructeur AutoAfrique'}
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--color-warm-ink)] mb-4 tracking-tight">
            Pièces détachées {kind === 'categorie' ? '' : 'auto '}{name} à Abidjan
          </h1>
          <p className="text-[var(--color-warm-muted)] leading-relaxed">{description}</p>
        </div>

        <div className="mt-10">
          <p className="text-sm text-[var(--color-warm-muted)] mb-6">
            <span className="font-bold text-[var(--color-warm-ink)]">{count}</span> pièce{count !== 1 ? 's' : ''} trouvée{count !== 1 ? 's' : ''}
          </p>

          {products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[var(--color-warm-border)] p-6 sm:p-10 text-center">
              <h2 className="text-lg font-bold text-[var(--color-warm-ink)] mb-2">Catalogue en cours de préparation</h2>
              <p className="text-sm text-[var(--color-warm-muted)] mb-6 max-w-md mx-auto">
                Aucune pièce {kind === 'categorie' ? 'de la catégorie' : 'de la marque'} « {name} » n&apos;est encore disponible.
                Revenez bientôt ou parcourez le marketplace complet.
              </p>
              <Link
                href={MARKETPLACE_URL}
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-warm)] text-white font-bold transition-all shadow-lg shadow-[var(--color-primary)]/30 text-sm sm:text-base w-full sm:w-auto"
              >
                Parcourir le marketplace
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6">
                {products.map((p, index) => {
                  const conditions: ('new' | 'aftermarket' | 'used_imported' | 'used_local')[] = ['new', 'used_imported', 'aftermarket', 'used_local'];
                  return (
                    <ProductCard
                      key={p.id}
                      name={p.title}
                      reference={p.reference || ''}
                      price={p.price}
                      rating={Math.round(p._avgRating || 0)}
                      reviewCount={p._reviewCount || 0}
                      image={firstImage(p)}
                      brand={p.brand?.name || ''}
                      inStock={(p.stock ?? 0) > 0}
                      condition={conditions[index % conditions.length]}
                    />
                  );
                })}
              </div>
              <div className="text-center mt-10">
                <Link
                  href={MARKETPLACE_URL}
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-8 py-3 sm:py-4 bg-[var(--color-bg-warm)] hover:bg-[var(--color-primary)] hover:text-white text-[var(--color-warm-ink)] font-bold rounded-xl transition-all border border-[var(--color-warm-border)] text-sm sm:text-base w-full sm:w-auto"
                >
                  Voir toutes les pièces sur le marketplace
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}