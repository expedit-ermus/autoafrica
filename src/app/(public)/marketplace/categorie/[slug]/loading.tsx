import { CatalogSkeleton, LoadingAnnouncement } from '@/components/RouteSkeleton';

export default function Loading() {
  return (
    <>
      <LoadingAnnouncement label="Chargement de la catégorie" />
      <CatalogSkeleton />
    </>
  );
}
