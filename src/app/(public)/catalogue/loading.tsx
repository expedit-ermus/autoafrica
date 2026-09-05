import { CatalogSkeleton, LoadingAnnouncement } from '@/components/RouteSkeleton';

export default function Loading() {
  return (
    <>
      <LoadingAnnouncement label="Chargement du catalogue" />
      <CatalogSkeleton />
    </>
  );
}
