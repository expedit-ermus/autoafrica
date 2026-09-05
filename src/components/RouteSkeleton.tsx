/**
 * Squelettes de route affichés pendant le rendu serveur (Next.js streaming).
 *
 * Sur les connexions lentes courantes en Afrique de l'Ouest, une page qui attend
 * la fin des requêtes base de données reste blanche plusieurs secondes. Ces
 * squelettes affichent immédiatement la structure attendue : l'utilisateur voit
 * que la page arrive, et la mise en page ne saute pas quand le contenu remplace
 * le squelette.
 */

const shimmer = 'animate-pulse bg-slate-200/80 rounded-lg';

function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      <div className={`${shimmer} aspect-square w-full rounded-xl`} />
      <div className={`${shimmer} mt-3 h-3 w-3/4`} />
      <div className={`${shimmer} mt-2 h-3 w-1/2`} />
      <div className={`${shimmer} mt-3 h-5 w-24`} />
    </div>
  );
}

/** Grille de catalogue : en-tête, filtres, puis une grille de fiches produit. */
export function CatalogSkeleton({ cards = 8 }: { cards?: number }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" aria-hidden="true">
      <div className={`${shimmer} h-8 w-64`} />
      <div className={`${shimmer} mt-3 h-4 w-96 max-w-full`} />

      <div className="mt-6 flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`${shimmer} h-9 w-28 rounded-full`} />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: cards }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/** Fiche produit : visuel à gauche, informations et prix à droite. */
export function ProductSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" aria-hidden="true">
      <div className={`${shimmer} h-3 w-72 max-w-full`} />

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className={`${shimmer} aspect-square w-full rounded-2xl`} />

        <div className="space-y-4">
          <div className={`${shimmer} h-7 w-4/5`} />
          <div className={`${shimmer} h-4 w-2/5`} />
          <div className={`${shimmer} h-10 w-44`} />
          <div className="space-y-2 pt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={`${shimmer} h-3 w-full`} />
            ))}
          </div>
          <div className={`${shimmer} h-12 w-full rounded-xl`} />
        </div>
      </div>
    </div>
  );
}

/** Message lu par les lecteurs d'écran pendant le chargement. */
export function LoadingAnnouncement({ label }: { label: string }) {
  return (
    <span role="status" aria-live="polite" className="sr-only">
      {label}
    </span>
  );
}
