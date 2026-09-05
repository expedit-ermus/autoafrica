import { ProductSkeleton, LoadingAnnouncement } from '@/components/RouteSkeleton';

export default function Loading() {
  return (
    <>
      <LoadingAnnouncement label="Chargement de la pièce" />
      <ProductSkeleton />
    </>
  );
}
