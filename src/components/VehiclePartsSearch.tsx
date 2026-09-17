'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  COUNTRY_PLATE_SPECS,
  SUPPORTED_COUNTRIES,
  validateLicensePlate,
  type SupportedCountryCode,
} from '@/modules/vehicles/license-plate.validator';

/**
 * Recherche de pieces par vehicule.
 *
 * Le composant portait `VEHICLE_DB`, une taxonomie de marques et de modeles
 * ecrite en dur. Elle avait derive de la base, comme les categories en D62 et
 * les marques du sitemap en D66 : elle proposait Suzuki, Dacia et Mitsubishi —
 * zero piece en stock, et les deux dernieres absentes de la table `Brand` —
 * tout en omettant Kia, Mercedes et Volkswagen, qui portent seize des
 * cinquante et une pieces du catalogue. Un acheteur avec une Kia ne pouvait
 * pas selectionner sa voiture.
 *
 * Les marques viennent desormais de la base, filtrees sur le stock reel.
 *
 * Le choix du modele, de l'annee et de la motorisation a ete retire : le tunnel
 * les collectait puis les jetait — `handleModelSearch` poussait vers
 * `/marques/{slug}`, qui ne filtre que sur la marque. Et rien ne pourrait les
 * honorer : `CarModel` et `ProductCompat` sont vides, aucune piece n'est
 * rattachee a un modele. Le modele saisi alimente la recherche texte du
 * catalogue, qui, elle, cherche reellement dans les intitules.
 */

const FUEL_LABELS: Record<string, string> = {
  DIESEL: 'Diesel',
  GASOLINE: 'Essence',
  HYBRID: 'Hybride',
  ELECTRIC: 'Électrique',
  LPG: 'GPL',
};

const GEARBOX_LABELS: Record<string, string> = {
  MANUAL: 'Manuelle',
  AUTOMATIC: 'Automatique',
};

// Une valeur inconnue est rendue telle quelle plutot que rangee dans un
// fourre-tout : un ajout au schema doit se voir.
const libelle = (table: Record<string, string>, v?: string) => (v ? table[v] ?? v : undefined);

/** Caracteristiques reellement renseignees, dans l'ordre d'affichage. */
const caracteristiques = (v: VehiculeIdentifie): string[] =>
  [v.engine, libelle(FUEL_LABELS, v.fuel), libelle(GEARBOX_LABELS, v.gearbox)].filter(
    (c): c is string => Boolean(c),
  );

interface Props {
  /** Marques ayant au moins une piece active, dans l'ordre du stock. */
  marques: string[];
}

const POPULAR_PARTS = [
  { id: 'filter-oil', label: 'Filtre à huile', icon: '🛢️' },
  { id: 'filter-air', label: 'Filtre à air', icon: '💨' },
  { id: 'filter-fuel', label: 'Filtre à carburant', icon: '⛽' },
  { id: 'brake-pads', label: 'Plaquettes de frein', icon: '🛑' },
  { id: 'brake-discs', label: 'Disques de frein', icon: '🔄' },
  { id: 'timing-belt', label: 'Kit distribution', icon: '⚙️' },
  { id: 'spark-plugs', label: 'Bougies d\'allumage', icon: '⚡' },
  { id: 'shock-absorbers', label: 'Amortisseurs', icon: '🔧' },
  { id: 'battery', label: 'Batterie', icon: '🔋' },
  { id: 'alternator', label: 'Alternateur', icon: '🔌' },
  { id: 'starter', label: 'Démarreur', icon: '🔄' },
  { id: 'headlight', label: 'Phares', icon: '💡' },
];

interface VehiculeIdentifie {
  brand: string;
  model?: string;
  year?: number;
  fuel?: string;
  gearbox?: string;
  engine?: string;
  nickname?: string;
}

interface ResultatPlaque {
  plate: string;
  countryName: string;
  officialSystem: string;
  identified: boolean;
  /** Present seulement quand la plaque n'a identifie aucun vehicule. */
  message?: string;
  vehicle?: VehiculeIdentifie;
}

export default function VehiclePartsSearch({ marques }: Props) {
  const router = useRouter();

  const [searchMode, setSearchMode] = useState<'plate' | 'model'>('model');
  const [selectedCountry, setSelectedCountry] = useState<SupportedCountryCode>('CI');
  const [plateNumber, setPlateNumber] = useState('');
  const [plateError, setPlateError] = useState('');
  const [searching, setSearching] = useState(false);
  const [resultatPlaque, setResultatPlaque] = useState<ResultatPlaque | null>(null);

  const [selectedBrand, setSelectedBrand] = useState('');
  const [modelText, setModelText] = useState('');

  const spec = COUNTRY_PLATE_SPECS[selectedCountry];
  // Le format en vigueur sert de placeholder ; les normes remplacees restent
  // acceptees et sont listees sous le champ.
  const formatEnVigueur = spec.formats[0];
  // La validation cote client utilise exactement le module que l'API utilise :
  // le formulaire ne peut plus refuser une plaque que l'API accepterait, ni
  // l'inverse.
  const isPlateValid = validateLicensePlate(plateNumber, selectedCountry).isValid;

  const handlePlateSearch = async () => {
    if (!isPlateValid) {
      setPlateError(`Format attendu : ${formatEnVigueur.formatDescription}`);
      return;
    }
    setSearching(true);
    setPlateError('');
    setResultatPlaque(null);

    try {
      const response = await fetch(
        `/api/v1/vehicles/lookup?plate=${encodeURIComponent(plateNumber)}&country=${selectedCountry}`,
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.details || data.error || 'Erreur de recherche');
      setResultatPlaque({
        plate: data.plate,
        countryName: data.countryName,
        officialSystem: data.officialSystem,
        identified: Boolean(data.identified),
        message: data.message,
        vehicle: data.vehicle,
      });
      // La marque du vehicule identifie arme la recherche : l'acheteur n'a
      // pas a la resaisir apres avoir donne sa plaque.
      if (data.vehicle?.brand) setSelectedBrand(data.vehicle.brand);
    } catch (error) {
      setPlateError(error instanceof Error ? error.message : 'Erreur de recherche');
    } finally {
      setSearching(false);
    }
  };

  /**
   * `marque` et `q` filtrent reellement le catalogue. Le parametre `modele`
   * existe dans l'URL du catalogue mais n'entre dans aucun filtre : le texte
   * saisi part donc en recherche plein texte, qui cherche dans l'intitule, la
   * reference, la marque et la categorie.
   */
  const ouvrirCatalogue = (recherche?: string) => {
    const params = new URLSearchParams();
    if (selectedBrand) params.set('marque', selectedBrand);
    const texte = recherche ?? modelText.trim();
    if (texte) params.set('q', texte);
    const requete = params.toString();
    router.push(requete ? `/catalogue?${requete}` : '/catalogue');
  };

  const resetSearch = () => {
    setPlateNumber('');
    setPlateError('');
    setResultatPlaque(null);
    setSelectedBrand('');
    setModelText('');
  };

  const champClasses =
    'w-full px-4 py-3.5 rounded-xl border border-[var(--color-warm-border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] text-sm';

  return (
    <section className="py-10 bg-[var(--color-bg)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--color-warm-ink)] mb-4">
            Trouvez les pièces pour votre véhicule
          </h1>
          {/* La page annoncait « les pièces compatibles avec votre véhicule ».
              Aucune donnee de compatibilite n'existe : `ProductCompat` est
              vide. Le catalogue se filtre par marque, et c'est ce qui est dit. */}
          <p className="text-lg text-[var(--color-warm-muted)] max-w-2xl mx-auto">
            Choisissez la marque de votre voiture pour ne voir que les pièces référencées
            pour cette marque.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[var(--color-warm-border)] p-6 mb-8 shadow-sm">
          <div className="flex gap-2 mb-6" role="tablist">
            <button
              role="tab"
              aria-selected={searchMode === 'model'}
              onClick={() => setSearchMode('model')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                searchMode === 'model'
                  ? 'bg-[var(--color-primary)] text-white shadow-md'
                  : 'text-[var(--color-warm-muted)] hover:bg-[var(--color-bg-warm)]'
              }`}
            >
              🚗 Par marque
            </button>
            <button
              role="tab"
              aria-selected={searchMode === 'plate'}
              onClick={() => setSearchMode('plate')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                searchMode === 'plate'
                  ? 'bg-[var(--color-primary)] text-white shadow-md'
                  : 'text-[var(--color-warm-muted)] hover:bg-[var(--color-bg-warm)]'
              }`}
            >
              🔍 Vérifier une immatriculation
            </button>
          </div>

          {searchMode === 'model' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ouvrirCatalogue();
              }}
              className="space-y-4"
              role="tabpanel"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="vps-marque"
                    className="block text-xs font-semibold text-[var(--color-warm-muted)] mb-2"
                  >
                    Marque
                  </label>
                  <select
                    id="vps-marque"
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className={champClasses}
                  >
                    <option value="">Toutes les marques</option>
                    {marques.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="vps-modele"
                    className="block text-xs font-semibold text-[var(--color-warm-muted)] mb-2"
                  >
                    Modèle ou pièce recherchée{' '}
                    <span className="font-normal">(facultatif)</span>
                  </label>
                  <input
                    id="vps-modele"
                    type="search"
                    value={modelText}
                    onChange={(e) => setModelText(e.target.value)}
                    placeholder="Corolla, amortisseur, référence OEM…"
                    className={champClasses}
                  />
                </div>
              </div>

              {marques.length === 0 && (
                <p className="text-sm text-[var(--color-warm-muted)]">
                  Aucune marque n&apos;a de pièce en stock pour le moment.
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-warm)] text-white font-bold hover:from-[var(--color-orange-hover)] hover:to-[var(--color-primary-dark)] transition-all shadow-lg shadow-[var(--color-primary)]/30"
              >
                🔧 Voir les pièces
              </button>
            </form>
          )}

          {searchMode === 'plate' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePlateSearch();
              }}
              className="space-y-4"
              role="tabpanel"
            >
              {/* Cet onglet verifie un format, il n'identifie pas un vehicule :
                  aucun acces au registre national n'existe. Il le dit au lieu
                  de repondre « immatriculation non enregistree », qui laissait
                  croire a un registre consulte. */}
              <p className="text-sm text-[var(--color-warm-muted)]">
                Vérifiez que votre numéro d&apos;immatriculation est au bon format.
                L&apos;identification automatique du véhicule n&apos;est pas disponible.
              </p>

              <div className="flex gap-2">
                <label htmlFor="vps-pays" className="sr-only">
                  Pays
                </label>
                <select
                  id="vps-pays"
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value as SupportedCountryCode);
                    setPlateError('');
                    setResultatPlaque(null);
                  }}
                  className="w-28 px-3 py-3.5 rounded-xl border border-[var(--color-warm-border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 text-sm"
                >
                  {SUPPORTED_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>

                <div className="flex-1 relative">
                  <label htmlFor="vps-plaque" className="sr-only">
                    Numéro d&apos;immatriculation
                  </label>
                  <input
                    id="vps-plaque"
                    type="text"
                    value={plateNumber}
                    onChange={(e) => {
                      // Les formats nationaux comportent des espaces et des
                      // tirets : les filtrer empechait de saisir « 1234 AB 01 ».
                      setPlateNumber(e.target.value.toUpperCase().replace(/[^A-Z0-9\s-]/g, ''));
                      if (plateError) setPlateError('');
                    }}
                    placeholder={formatEnVigueur.sample}
                    className={`${champClasses} pr-12 ${plateError ? 'border-red-400' : ''}`}
                    maxLength={15}
                  />
                  {plateNumber && (
                    <button
                      type="button"
                      onClick={() => {
                        setPlateNumber('');
                        setPlateError('');
                        setResultatPlaque(null);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-warm-muted)] hover:text-red-500"
                      aria-label="Effacer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {plateError && (
                <p className="text-red-500 text-sm flex items-center gap-1" role="alert">
                  ⚠️ {plateError}
                </p>
              )}

              <div className="text-xs text-[var(--color-warm-muted)] flex items-start gap-2">
                <span>💡</span>
                <div>
                  <p className="font-semibold">{spec.countryName}</p>
                  <ul className="mt-1 space-y-0.5">
                    {spec.formats.map((f) => (
                      <li key={f.sample}>
                        {f.formatDescription}
                        {f.legacy ? ' — ancienne norme, toujours acceptée' : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                type="submit"
                disabled={!isPlateValid || searching}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-warm)] text-white font-bold hover:from-[var(--color-orange-hover)] hover:to-[var(--color-primary-dark)] transition-all shadow-lg shadow-[var(--color-primary)]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {searching ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Vérification…
                  </>
                ) : (
                  '🔍 Vérifier le format'
                )}
              </button>
            </form>
          )}
        </div>

        {resultatPlaque && (
          <div className="bg-white rounded-2xl border border-[var(--color-primary)]/20 p-6 shadow-sm mb-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 shrink-0 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-2xl">
                {resultatPlaque.identified ? '🚗' : '✅'}
              </div>
              <div>
                {resultatPlaque.identified && resultatPlaque.vehicle ? (
                  <>
                    <h2 className="text-lg font-extrabold text-[var(--color-warm-ink)]">
                      {[
                        resultatPlaque.vehicle.brand,
                        resultatPlaque.vehicle.model,
                        resultatPlaque.vehicle.year,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    </h2>
                    <p className="text-sm text-[var(--color-warm-muted)] mt-1">
                      {resultatPlaque.plate}
                      {resultatPlaque.vehicle.nickname ? ` · ${resultatPlaque.vehicle.nickname}` : ''}
                    </p>
                    {/* Seules les caracteristiques renseignees sont listees : un
                        champ laisse vide au garage reste vide ici (D61). */}
                    {caracteristiques(resultatPlaque.vehicle).length > 0 && (
                      <p className="text-sm text-[var(--color-warm-muted)] mt-1">
                        {caracteristiques(resultatPlaque.vehicle).join(' · ')}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <h2 className="text-lg font-extrabold text-[var(--color-warm-ink)]">
                      {resultatPlaque.plate} — format valide
                    </h2>
                    <p className="text-sm text-[var(--color-warm-muted)] mt-1">
                      {resultatPlaque.countryName} · {resultatPlaque.officialSystem}
                    </p>
                    <p className="text-sm text-[var(--color-warm-muted)] mt-2 leading-relaxed">
                      {resultatPlaque.message}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {resultatPlaque.identified && resultatPlaque.vehicle ? (
                <button
                  onClick={() => ouvrirCatalogue()}
                  className="flex-1 min-w-[200px] py-3 px-4 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:bg-[var(--color-orange-hover)] transition-all cursor-pointer"
                >
                  🔧 Voir les pièces {resultatPlaque.vehicle.brand}
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setSearchMode('model')}
                    className="flex-1 min-w-[200px] py-3 px-4 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:bg-[var(--color-orange-hover)] transition-all cursor-pointer"
                  >
                    🚗 Choisir ma marque
                  </button>
                  <Link
                    href="/dashboard/garage"
                    className="px-6 py-3 rounded-xl border border-[var(--color-warm-border)] text-[var(--color-warm-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all"
                  >
                    Enregistrer ce véhicule
                  </Link>
                </>
              )}
              <button
                onClick={resetSearch}
                className="px-6 py-3 rounded-xl border border-[var(--color-warm-border)] text-[var(--color-warm-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all"
              >
                Nouvelle recherche
              </button>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-lg font-bold text-[var(--color-warm-ink)] mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">⚡</span>
            Pièces les plus recherchées
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {POPULAR_PARTS.map((part) => (
              <button
                key={part.id}
                // Poussait vers `/catalogue` sans aucun parametre : le libelle
                // affiche sur le bouton ne filtrait rien.
                onClick={() => ouvrirCatalogue(part.label)}
                className="group relative p-4 bg-white rounded-xl border border-[var(--color-warm-border)] hover:border-[var(--color-primary)]/40 hover:shadow-xl hover:shadow-[var(--color-primary)]/10 transition-all duration-300 text-center cursor-pointer"
              >
                <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">{part.icon}</span>
                <span className="text-sm font-medium text-[var(--color-warm-ink)] group-hover:text-[var(--color-primary)] transition-colors">
                  {part.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export { POPULAR_PARTS };
