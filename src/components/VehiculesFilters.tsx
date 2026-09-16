'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import RemoteImage from '@/components/RemoteImage';
import {
  FUEL_LABELS,
  GEARBOX_LABELS,
  CONDITION_LABELS,
  libelle,
  formatPrix,
} from '@/lib/vehicle-presentation';

/**
 * Vue publique d'un vehicule, telle que `toPublicVehicle` la produit. Les
 * champs optionnels le sont reellement : un vehicule sans kilometrage, sans
 * couleur ou sans ville existe en base, et la vue omet la ligne plutot que
 * d'afficher une valeur de repli (D61).
 */
export interface VehiculeVue {
  id: string;
  slug: string;
  name: string;
  year: number;
  price: number;
  currency: string;
  mileage?: number;
  fuel?: string;
  gearbox?: string;
  condition: string;
  bodyType?: string;
  color?: string;
  city?: string;
  images: string[];
  brand?: string;
  model?: string;
  listingStatus?: string;
  sellerShopName?: string;
}

export interface VehiculeFacettes {
  brands: string[];
  cities: string[];
  fuels: string[];
  gearboxes: string[];
  conditions: string[];
  bodyTypes: string[];
  minPrice?: number;
  maxPrice?: number;
}

interface Props {
  vehicules: VehiculeVue[];
  facettes: VehiculeFacettes;
}

function VehiculesFiltersInner({ vehicules, facettes }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [marque, setMarque] = useState(searchParams.get('marque') || '');
  const [ville, setVille] = useState(searchParams.get('ville') || '');
  const [carburant, setCarburant] = useState(searchParams.get('carburant') || '');
  const [boite, setBoite] = useState(searchParams.get('boite') || '');
  const [etat, setEtat] = useState(searchParams.get('etat') || '');
  const [carrosserie, setCarrosserie] = useState(searchParams.get('carrosserie') || '');
  const [prixMax, setPrixMax] = useState(searchParams.get('prixMax') || '');
  const [anneeMin, setAnneeMin] = useState(searchParams.get('anneeMin') || '');
  const [recherche, setRecherche] = useState(searchParams.get('q') || '');
  const [tri, setTri] = useState(searchParams.get('tri') || 'recent');
  const [filtresMobiles, setFiltresMobiles] = useState(false);

  // L'URL porte l'etat des filtres : une recherche reste partageable et le
  // retour navigateur la retrouve. `replace` plutot que `push` pour ne pas
  // empiler une entree d'historique par frappe au clavier.
  useEffect(() => {
    const params = new URLSearchParams();
    if (marque) params.set('marque', marque);
    if (ville) params.set('ville', ville);
    if (carburant) params.set('carburant', carburant);
    if (boite) params.set('boite', boite);
    if (etat) params.set('etat', etat);
    if (carrosserie) params.set('carrosserie', carrosserie);
    if (prixMax) params.set('prixMax', prixMax);
    if (anneeMin) params.set('anneeMin', anneeMin);
    if (recherche) params.set('q', recherche);
    if (tri !== 'recent') params.set('tri', tri);
    const requete = params.toString();
    router.replace(requete ? `${pathname}?${requete}` : pathname, { scroll: false });
  }, [marque, ville, carburant, boite, etat, carrosserie, prixMax, anneeMin, recherche, tri, pathname, router]);

  const resultats = useMemo(() => {
    const plafond = prixMax ? Number(prixMax) : undefined;
    const plancher = anneeMin ? Number(anneeMin) : undefined;
    const q = recherche.trim().toLowerCase();

    const filtres = vehicules.filter((v) => {
      if (marque && v.brand !== marque) return false;
      if (ville && v.city !== ville) return false;
      if (carburant && v.fuel !== carburant) return false;
      if (boite && v.gearbox !== boite) return false;
      if (etat && v.condition !== etat) return false;
      if (carrosserie && v.bodyType !== carrosserie) return false;
      // `Number('')` vaut 0 et `Number('abc')` vaut NaN : une saisie vide ou
      // non numerique ne doit pas se transformer en plafond a zero, qui
      // masquerait tout le catalogue.
      if (plafond !== undefined && Number.isFinite(plafond) && v.price > plafond) return false;
      if (plancher !== undefined && Number.isFinite(plancher) && v.year < plancher) return false;
      if (q) {
        const foin = [v.name, v.brand, v.model, v.color, v.city].filter(Boolean).join(' ').toLowerCase();
        if (!foin.includes(q)) return false;
      }
      return true;
    });

    const ordonnes = [...filtres];
    if (tri === 'prix-asc') ordonnes.sort((a, b) => a.price - b.price);
    else if (tri === 'prix-desc') ordonnes.sort((a, b) => b.price - a.price);
    else if (tri === 'annee-desc') ordonnes.sort((a, b) => b.year - a.year);
    else if (tri === 'km-asc') {
      // Un kilometrage absent n'est pas zero. Ces vehicules sont renvoyes en
      // fin de liste au lieu d'etre presentes comme les moins roules.
      ordonnes.sort((a, b) => (a.mileage ?? Infinity) - (b.mileage ?? Infinity));
    }
    return ordonnes;
  }, [vehicules, marque, ville, carburant, boite, etat, carrosserie, prixMax, anneeMin, recherche, tri]);

  const reinitialiser = () => {
    setMarque('');
    setVille('');
    setCarburant('');
    setBoite('');
    setEtat('');
    setCarrosserie('');
    setPrixMax('');
    setAnneeMin('');
    setRecherche('');
    setTri('recent');
  };

  const filtresActifs = Boolean(
    marque || ville || carburant || boite || etat || carrosserie || prixMax || anneeMin || recherche,
  );

  // Le catalogue est vide : ce n'est pas un echec de filtrage, et proposer de
  // « relacher un filtre » enverrait l'utilisateur chercher une cause qui
  // n'existe pas. Le message dit la situation reelle.
  if (vehicules.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-5xl mb-4" aria-hidden="true">🚗</div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Aucun véhicule n&apos;est proposé pour le moment
          </h2>
          <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
            Les annonces publiées par les vendeurs apparaîtront ici dès leur mise en ligne.
            En attendant, le catalogue de pièces détachées reste ouvert.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/catalogue"
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
            >
              Voir le catalogue de pièces
            </Link>
            <Link
              href="/devenir-vendeur"
              className="px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl text-sm transition-colors border border-slate-200"
            >
              Publier une annonce
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const selectClasses =
    'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100';

  const panneauFiltres = (
    <div className="space-y-4">
      <div>
        <label htmlFor="vh-q" className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
          Recherche
        </label>
        <input
          id="vh-q"
          type="search"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Modèle, couleur, ville…"
          className={selectClasses}
        />
      </div>

      {facettes.brands.length > 0 && (
        <div>
          <label htmlFor="vh-marque" className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
            Marque
          </label>
          <select id="vh-marque" value={marque} onChange={(e) => setMarque(e.target.value)} className={selectClasses}>
            <option value="">Toutes les marques</option>
            {facettes.brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      )}

      {facettes.cities.length > 0 && (
        <div>
          <label htmlFor="vh-ville" className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
            Ville
          </label>
          <select id="vh-ville" value={ville} onChange={(e) => setVille(e.target.value)} className={selectClasses}>
            <option value="">Toutes les villes</option>
            {facettes.cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      )}

      {facettes.fuels.length > 0 && (
        <div>
          <label htmlFor="vh-carburant" className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
            Carburant
          </label>
          <select id="vh-carburant" value={carburant} onChange={(e) => setCarburant(e.target.value)} className={selectClasses}>
            <option value="">Tous</option>
            {facettes.fuels.map((f) => (
              <option key={f} value={f}>{libelle(FUEL_LABELS, f)}</option>
            ))}
          </select>
        </div>
      )}

      {facettes.gearboxes.length > 0 && (
        <div>
          <label htmlFor="vh-boite" className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
            Boîte de vitesses
          </label>
          <select id="vh-boite" value={boite} onChange={(e) => setBoite(e.target.value)} className={selectClasses}>
            <option value="">Toutes</option>
            {facettes.gearboxes.map((g) => (
              <option key={g} value={g}>{libelle(GEARBOX_LABELS, g)}</option>
            ))}
          </select>
        </div>
      )}

      {facettes.conditions.length > 0 && (
        <div>
          <label htmlFor="vh-etat" className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
            État
          </label>
          <select id="vh-etat" value={etat} onChange={(e) => setEtat(e.target.value)} className={selectClasses}>
            <option value="">Tous</option>
            {facettes.conditions.map((c) => (
              <option key={c} value={c}>{libelle(CONDITION_LABELS, c)}</option>
            ))}
          </select>
        </div>
      )}

      {facettes.bodyTypes.length > 0 && (
        <div>
          <label htmlFor="vh-carrosserie" className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
            Carrosserie
          </label>
          <select id="vh-carrosserie" value={carrosserie} onChange={(e) => setCarrosserie(e.target.value)} className={selectClasses}>
            <option value="">Toutes</option>
            {facettes.bodyTypes.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="vh-prix" className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
            Prix max
          </label>
          <input
            id="vh-prix"
            type="number"
            min={0}
            inputMode="numeric"
            value={prixMax}
            onChange={(e) => setPrixMax(e.target.value)}
            placeholder={facettes.maxPrice ? String(facettes.maxPrice) : 'FCFA'}
            className={selectClasses}
          />
        </div>
        <div>
          <label htmlFor="vh-annee" className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
            Année min
          </label>
          <input
            id="vh-annee"
            type="number"
            min={1950}
            inputMode="numeric"
            value={anneeMin}
            onChange={(e) => setAnneeMin(e.target.value)}
            placeholder="2015"
            className={selectClasses}
          />
        </div>
      </div>

      {filtresActifs && (
        <button
          onClick={reinitialiser}
          className="w-full px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
        >
          Réinitialiser les filtres
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-wide text-slate-900 mb-4">Filtrer</h2>
            {panneauFiltres}
          </div>
        </aside>

        <div className="lg:col-span-9">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <p className="text-sm text-slate-600" aria-live="polite">
              <span className="font-bold text-slate-900">{resultats.length}</span>{' '}
              {resultats.length > 1 ? 'véhicules' : 'véhicule'}
              {filtresActifs && vehicules.length !== resultats.length ? ` sur ${vehicules.length}` : ''}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFiltresMobiles((v) => !v)}
                className="lg:hidden px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700"
                aria-expanded={filtresMobiles}
              >
                Filtrer
              </button>
              <label htmlFor="vh-tri" className="sr-only">Trier</label>
              <select
                id="vh-tri"
                value={tri}
                onChange={(e) => setTri(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
              >
                <option value="recent">Plus récentes</option>
                <option value="prix-asc">Prix croissant</option>
                <option value="prix-desc">Prix décroissant</option>
                <option value="annee-desc">Année décroissante</option>
                <option value="km-asc">Kilométrage croissant</option>
              </select>
            </div>
          </div>

          {filtresMobiles && (
            <div className="lg:hidden bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mb-5">
              {panneauFiltres}
            </div>
          )}

          {resultats.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Aucun véhicule ne correspond à vos critères</h3>
              <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                Essayez de relever le prix maximum, d&apos;abaisser l&apos;année minimum ou d&apos;élargir la recherche.
              </p>
              <button
                onClick={reinitialiser}
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {resultats.map((v) => (
                <VehiculeCarte key={v.id} vehicule={v} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function VehiculeCarte({ vehicule }: { vehicule: VehiculeVue }) {
  const photo = vehicule.images[0];
  const caracteristiques = [
    String(vehicule.year),
    vehicule.mileage !== undefined ? `${vehicule.mileage.toLocaleString('fr-FR')} km` : undefined,
    libelle(FUEL_LABELS, vehicule.fuel),
    libelle(GEARBOX_LABELS, vehicule.gearbox),
  ].filter(Boolean) as string[];

  return (
    <Link
      href={`/vehicules/${vehicule.slug}`}
      className="group block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-orange-200 transition-all"
    >
      <div className="relative aspect-[4/3] bg-slate-100 flex items-center justify-center overflow-hidden">
        {photo ? (
          <RemoteImage
            src={photo}
            alt={vehicule.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          // Aucune photo : un fond neutre et un pictogramme, jamais l'image
          // d'un autre vehicule (meme regle qu'en D66 pour les categories).
          <span className="text-5xl opacity-40" aria-hidden="true">🚗</span>
        )}
        {vehicule.listingStatus === 'RESERVED' && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-500 text-white text-[11px] font-black uppercase tracking-wide">
            Réservé
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-extrabold text-slate-900 text-base leading-snug line-clamp-1 group-hover:text-orange-600 transition-colors">
          {vehicule.name}
        </h3>
        <p className="mt-1 text-xs text-slate-500 line-clamp-1">{caracteristiques.join(' · ')}</p>
        <p className="mt-3 text-lg font-black text-slate-900">{formatPrix(vehicule.price, vehicule.currency)}</p>
        {vehicule.city && <p className="mt-1 text-xs text-slate-500">📍 {vehicule.city}</p>}
      </div>
    </Link>
  );
}

/**
 * `useSearchParams` impose une frontiere Suspense, sans quoi le segment entier
 * bascule en rendu dynamique au build.
 */
export default function VehiculesFilters(props: Props) {
  return (
    <Suspense fallback={null}>
      <VehiculesFiltersInner {...props} />
    </Suspense>
  );
}
