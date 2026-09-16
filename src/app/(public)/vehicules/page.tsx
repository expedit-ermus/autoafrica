import { Suspense } from 'react';
import type { Metadata } from 'next';
import { CatalogSkeleton } from '@/components/RouteSkeleton';
import { BreadcrumbStructuredData } from '@/components/StructuredData';
import { SITE_URL } from '@/lib/structured-data';
import { vehiclesService } from '@/modules/vehicles/vehicles.service';
import VehiculesFilters, { type VehiculeVue } from '@/components/VehiculesFilters';

/**
 * Meme fraicheur que le catalogue de pieces : une annonce publiee doit
 * apparaitre sans redeploiement, sans rendre la page a chaque requete.
 */
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Véhicules d’occasion à vendre en Côte d’Ivoire',
  description:
    "Annonces de véhicules d'occasion publiées par les vendeurs AutoAfrique : filtrez par marque, ville, carburant, boîte de vitesses et budget.",
  alternates: { canonical: '/vehicules' },
};

export default function VehiculesPage() {
  return (
    <div className="bg-[#F8FAFC] text-slate-900 min-h-screen">
      <BreadcrumbStructuredData
        items={[
          { name: 'Accueil', url: SITE_URL },
          { name: 'Véhicules', url: `${SITE_URL}/vehicules` },
        ]}
      />

      <div className="bg-gradient-to-b from-white via-slate-50 to-[#F8FAFC] pt-8 pb-0 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pb-8 max-w-2xl">
            <p className="text-xs font-black uppercase tracking-wider text-orange-600 mb-2">
              Annonces AutoAfrique
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
              Véhicules d&apos;occasion en Côte d&apos;Ivoire
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Les annonces publiées par les vendeurs de la plateforme. Chaque fiche affiche
              uniquement ce que le vendeur a renseigné.
            </p>
          </div>
        </div>
      </div>

      <Suspense fallback={<CatalogSkeleton />}>
        <GrilleVehicules />
      </Suspense>
    </div>
  );
}

/**
 * Le service ne renvoie que les vehicules actifs portant une annonce vivante :
 * une vitrine vide s'affiche comme telle, elle n'est jamais remplie d'exemples.
 */
async function GrilleVehicules() {
  const [resultat, facettes] = await Promise.all([
    vehiclesService.listPublic({}, { page: 1, pageSize: 100 }),
    vehiclesService.publicFacets(),
  ]);

  const vehicules = (resultat.data || []) as unknown as VehiculeVue[];

  return <VehiculesFilters vehicules={vehicules} facettes={facettes} />;
}
