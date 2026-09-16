import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import RemoteImage from '@/components/RemoteImage';
import { VehicleStructuredData, BreadcrumbStructuredData } from '@/components/StructuredData';
import { SITE_URL } from '@/lib/structured-data';
import { vehiclesService } from '@/modules/vehicles/vehicles.service';
// Module neutre, jamais `'use client'` : importer ces fonctions depuis
// `VehiculesFilters.tsx` faisait repondre 500 a cette page — on ne peut pas
// appeler depuis le serveur une fonction exportee par un module client.
import {
  FUEL_LABELS,
  GEARBOX_LABELS,
  CONDITION_LABELS,
  formatPrix,
  libelle,
} from '@/lib/vehicle-presentation';

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const vehicule = await vehiclesService.getPublicBySlug(slug);

  if (!vehicule) return {};

  // Ni marque ni ville ne sont substituees quand elles manquent : la mention
  // est omise plutot qu'inventee (D61).
  const localisation = vehicule.city ? ` à ${vehicule.city}` : '';
  const kilometrage = vehicule.mileage !== undefined
    ? `, ${vehicule.mileage.toLocaleString('fr-FR')} km`
    : '';

  return {
    title: `${vehicule.name} — ${formatPrix(vehicule.price, vehicule.currency)}${localisation}`,
    description:
      `${vehicule.name}, ${vehicule.year}${kilometrage}. ` +
      `${formatPrix(vehicule.price, vehicule.currency)}${localisation} sur AutoAfrique.`,
    alternates: { canonical: `/vehicules/${slug}` },
  };
}

export default async function VehiculeDetailPage({ params }: Props) {
  const { slug } = await params;
  const vehicule = await vehiclesService.getPublicBySlug(slug);

  // `getPublicBySlug` exige `active: true` et une annonce ACTIVE ou RESERVED :
  // un vehicule retire du catalogue repond 404 au lieu de rester joignable a
  // son URL directe.
  if (!vehicule) notFound();

  const photo = vehicule.images[0];
  const reserve = vehicule.listingStatus === 'RESERVED';

  /**
   * Seules les caracteristiques reellement renseignees sont listees. Une ligne
   * « Couleur : — » informerait moins que son absence, et une valeur de repli
   * mentirait.
   */
  const caracteristiques: Array<[string, string]> = [
    ['Année', String(vehicule.year)],
    vehicule.mileage !== undefined
      ? ['Kilométrage', `${vehicule.mileage.toLocaleString('fr-FR')} km`]
      : undefined,
    vehicule.fuel ? ['Carburant', libelle(FUEL_LABELS, vehicule.fuel)!] : undefined,
    vehicule.gearbox ? ['Boîte de vitesses', libelle(GEARBOX_LABELS, vehicule.gearbox)!] : undefined,
    ['État', libelle(CONDITION_LABELS, vehicule.condition)!],
    vehicule.bodyType ? ['Carrosserie', vehicule.bodyType] : undefined,
    vehicule.color ? ['Couleur', vehicule.color] : undefined,
    vehicule.model ? ['Modèle', vehicule.model] : undefined,
    vehicule.engine ? ['Motorisation', vehicule.engine] : undefined,
    vehicule.city ? ['Ville', vehicule.city] : undefined,
  ].filter(Boolean) as Array<[string, string]>;

  const messageWhatsApp = encodeURIComponent(
    `Bonjour, je suis intéressé par le véhicule "${vehicule.name}" ` +
      `(${formatPrix(vehicule.price, vehicule.currency)}) vu sur AutoAfrique.`,
  );

  return (
    <div className="bg-[#F8FAFC] text-slate-900 min-h-screen">
      <VehicleStructuredData
        name={vehicule.name}
        description={vehicule.description}
        image={photo}
        brand={vehicule.brand}
        model={vehicule.model}
        year={vehicule.year}
        mileage={vehicule.mileage}
        color={vehicule.color}
        bodyType={vehicule.bodyType}
        fuel={vehicule.fuel}
        gearbox={vehicule.gearbox}
        condition={vehicule.condition}
        price={vehicule.price}
        currency={vehicule.currency}
        listingStatus={vehicule.listingStatus}
        seller={vehicule.sellerShopName}
      />

      <BreadcrumbStructuredData
        items={[
          { name: 'AutoAfrique', url: SITE_URL },
          { name: 'Véhicules', url: `${SITE_URL}/vehicules` },
          { name: vehicule.name, url: `${SITE_URL}/vehicules/${slug}` },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-6" aria-label="Fil d'Ariane">
          <Link href="/" className="hover:text-emerald-600">Accueil</Link>
          <span>›</span>
          <Link href="/vehicules" className="hover:text-emerald-600">Véhicules</Link>
          <span>›</span>
          <span className="font-bold text-gray-900 truncate">{vehicule.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white rounded-3xl p-5 sm:p-8 border border-gray-200 shadow-sm">
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] w-full rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-100">
              {photo ? (
                <RemoteImage
                  src={photo}
                  alt={vehicule.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="text-center px-6">
                  <div className="text-6xl opacity-40 mb-3" aria-hidden="true">🚗</div>
                  <p className="text-xs text-slate-500">Aucune photo n&apos;a été fournie pour cette annonce.</p>
                </div>
              )}
            </div>

            {vehicule.images.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {vehicule.images.slice(1, 5).map((img, i) => (
                  <div key={img} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                    <RemoteImage
                      src={img}
                      alt={`${vehicule.name} — photo ${i + 2}`}
                      fill
                      sizes="25vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div>
              {vehicule.brand && (
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600">
                  {vehicule.brand}
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">{vehicule.name}</h1>
              {reserve && (
                <span className="inline-block mt-3 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-wide">
                  Réservé
                </span>
              )}
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
              <p className="text-3xl font-black text-slate-900">
                {formatPrix(vehicule.price, vehicule.currency)}
              </p>
              {vehicule.sellerShopName && (
                <p className="mt-2 text-sm text-slate-600">
                  Vendu par <span className="font-bold text-slate-800">{vehicule.sellerShopName}</span>
                  {vehicule.sellerCity ? ` — ${vehicule.sellerCity}` : ''}
                </p>
              )}
            </div>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
              {caracteristiques.map(([cle, valeur]) => (
                <div key={cle}>
                  <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{cle}</dt>
                  <dd className="text-sm font-semibold text-slate-800 mt-0.5">{valeur}</dd>
                </div>
              ))}
            </dl>

            <div className="space-y-2.5">
              {/* La prise de contact passe par le numero de la plateforme,
                  comme sur les fiches pieces. Le telephone du vendeur n'est
                  pas publie sur une page indexee. */}
              <a
                href={`https://wa.me/2250708091011?text=${messageWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
              >
                Contacter au sujet de ce véhicule
              </a>
              <Link
                href="/vehicules"
                className="block w-full text-center px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl text-sm transition-colors border border-slate-200"
              >
                Voir les autres véhicules
              </Link>
            </div>
          </div>
        </div>

        {vehicule.description && (
          <section className="mt-8 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-900 mb-3">Description du vendeur</h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {vehicule.description}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
