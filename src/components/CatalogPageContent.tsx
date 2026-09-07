import CatalogPage from '@/components/CatalogPage';
import { CatalogSkeleton, LoadingAnnouncement } from '@/components/RouteSkeleton';
import { productsService } from '@/modules/products/products.service';
import { Product } from '@/shared/types';

interface CatalogPageContentProps {
  kind: 'categorie' | 'marque';
  slug: string;
  name: string;
  description: string;
  /**
   * Filtre API : `category = slug` pour une categorie, `brand = nom exact`
   * pour une marque (cf. `15-CATALOGUE.md`).
   */
  filter: { category: string } | { brand: string };
  /**
   * Repli des routes catalogue historiques : afficher un echantillon large
   * quand le filtre ne remonte rien. Conserve tel quel par ce chantier, mais
   * il affiche des pieces hors categorie sous un titre de categorie (cf. D60).
   */
  fallbackToAllProducts?: boolean;
  pageSize?: number;
}

/**
 * Partie lente d'une page de catalogue : la seule qui interroge la base.
 * Isolee du composant de page pour que `notFound()` s'execute avant tout
 * envoi de reponse, faute de quoi le statut 200 est emis avant le 404 (D60).
 */
export default async function CatalogPageContent({
  kind,
  slug,
  name,
  description,
  filter,
  fallbackToAllProducts = false,
  pageSize = 24,
}: CatalogPageContentProps) {
  const res = await productsService.list(filter, { page: 1, pageSize });
  let products = (res.data || []) as unknown as Product[];

  if (products.length === 0 && fallbackToAllProducts) {
    const fallbackRes = await productsService.list({}, { page: 1, pageSize: 50 });
    products = (fallbackRes.data || []) as unknown as Product[];
  }

  return (
    <CatalogPage
      kind={kind}
      slug={slug}
      name={name}
      description={description}
      count={products.length}
      products={products}
    />
  );
}

/** Squelette affiche pendant le chargement des pieces, sans bloquer le 404. */
export function CatalogPageFallback({ label }: { label: string }) {
  return (
    <>
      <LoadingAnnouncement label={label} />
      <CatalogSkeleton />
    </>
  );
}
