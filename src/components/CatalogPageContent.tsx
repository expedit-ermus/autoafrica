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
  pageSize = 24,
}: CatalogPageContentProps) {
  // Un filtre qui ne remonte rien affichait auparavant un echantillon de tout
  // le catalogue : la page annoncait « Pieces detachees Embrayage » et listait
  // des pieces d'autres categories. `CatalogueFilters` porte deja un etat vide
  // honnete, qui remplace ce repli (D62).
  const res = await productsService.list(filter, { page: 1, pageSize });
  const products = (res.data || []) as unknown as Product[];

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
