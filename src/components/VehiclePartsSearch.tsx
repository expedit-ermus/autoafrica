'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface VehicleRegistration {
  plate: string;
  country: string;
  brand: string;
  model: string;
  year: number;
  engine: string;
  fuel: string;
  vin?: string;
  color?: string;
  bodyType?: string;
  registrationDate?: string;
  nextInspection?: string;
}

const COUNTRIES = [
  { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮', pattern: '^[A-Z]{2}-\\d{3}-[A-Z]{2}$' },
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳', pattern: '^\\d{2}[A-Z]{2}\\d{4}$' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', pattern: '^[A-Z]{2}-\\d{4}[A-Z]{2}$' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱', pattern: '^[A-Z]{2}\\d{3}[A-Z]{2}$' },
  { code: 'BJ', name: 'Bénin', flag: '🇧🇯', pattern: '^[A-Z]{2}\\d{4}[A-Z]{2}$' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬', pattern: '^[A-Z]{2}-\\d{4}[A-Z]{2}$' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', pattern: '^[A-Z]{2}-\\d{4}-[A-Z]{2}$' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', pattern: '^[A-Z]{3}-\\d{3}[A-Z]{1}$' },
];

interface VehicleModel {
  brand: string;
  models: Array<{
    name: string;
    years: number[];
    engines: Array<{
      code: string;
      label: string;
      fuel: string;
      displacement: string;
    }>;
  }>;
}

const VEHICLE_DB: VehicleModel[] = [
  {
    brand: 'Suzuki',
    models: [
      {
        name: 'Alto',
        years: [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015],
        engines: [
          { code: 'K10B', label: '1.0L K-Series (K10B)', fuel: 'Essence', displacement: '996 cm³' },
          { code: 'F10D', label: '1.0L Essence (F10D)', fuel: 'Essence', displacement: '970 cm³' },
          { code: 'K12M', label: '1.2L VVT (K12M)', fuel: 'Essence', displacement: '1242 cm³' },
        ],
      },
      {
        name: 'Desire',
        years: [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017],
        engines: [
          { code: 'K12M', label: '1.2L VVT (K12M)', fuel: 'Essence', displacement: '1242 cm³' },
          { code: 'K10C', label: '1.0L BoosterJet (K10C)', fuel: 'Essence', displacement: '998 cm³' },
        ],
      },
      {
        name: 'Carry',
        years: [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016],
        engines: [
          { code: 'F10D', label: '1.0L Essence (F10D)', fuel: 'Essence', displacement: '970 cm³' },
          { code: 'K10B', label: '1.0L K-Series (K10B)', fuel: 'Essence', displacement: '996 cm³' },
        ],
      },
      {
        name: 'Swift',
        years: [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017],
        engines: [
          { code: 'K12M', label: '1.2L VVT (K12M)', fuel: 'Essence', displacement: '1242 cm³' },
          { code: 'K10C', label: '1.0L BoosterJet (K10C)', fuel: 'Essence', displacement: '998 cm³' },
        ],
      },
    ],
  },
  {
    brand: 'Toyota',
    models: [
      {
        name: 'Corolla',
        years: [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015],
        engines: [
          { code: '1ZR-FAE', label: '1.8L Essence (1ZR-FAE)', fuel: 'Essence', displacement: '1798 cm³' },
          { code: '2ZR-FAE', label: '1.8L Hybrid (2ZR-FXE)', fuel: 'Hybride', displacement: '1798 cm³' },
          { code: '1NR-FE', label: '1.3L Essence (1NR-FE)', fuel: 'Essence', displacement: '1329 cm³' },
        ],
      },
      {
        name: 'Camry',
        years: [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017],
        engines: [
          { code: '2AR-FE', label: '2.5L Essence (2AR-FE)', fuel: 'Essence', displacement: '2494 cm³' },
          { code: '2GR-FKS', label: '3.5L V6 (2GR-FKS)', fuel: 'Essence', displacement: '3456 cm³' },
          { code: 'A25A-FXS', label: '2.5L Hybrid (A25A-FXS)', fuel: 'Hybride', displacement: '2487 cm³' },
        ],
      },
      {
        name: 'Hilux',
        years: [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015],
        engines: [
          { code: '2GD-FTV', label: '2.4L Diesel (2GD-FTV)', fuel: 'Diesel', displacement: '2393 cm³' },
          { code: '1GD-FTV', label: '2.8L Diesel (1GD-FTV)', fuel: 'Diesel', displacement: '2755 cm³' },
          { code: '2TR-FE', label: '2.7L Essence (2TR-FE)', fuel: 'Essence', displacement: '2694 cm³' },
        ],
      },
      {
        name: 'RAV4',
        years: [2024, 2023, 2022, 2021, 2020, 2019],
        engines: [
          { code: 'A25A-FXS', label: '2.5L Hybrid (A25A-FXS)', fuel: 'Hybride', displacement: '2487 cm³' },
          { code: 'A25A-FKS', label: '2.5L Essence (A25A-FKS)', fuel: 'Essence', displacement: '2487 cm³' },
        ],
      },
      {
        name: 'Land Cruiser',
        years: [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016],
        engines: [
          { code: '1VD-FTV', label: '4.5L V8 Diesel (1VD-FTV)', fuel: 'Diesel', displacement: '4461 cm³' },
          { code: '1GR-FE', label: '4.0L V6 Essence (1GR-FE)', fuel: 'Essence', displacement: '3956 cm³' },
        ],
      },
      {
        name: 'Yaris',
        years: [2024, 2023, 2022, 2021, 2020, 2019, 2018],
        engines: [
          { code: '1NR-FE', label: '1.3L Essence (1NR-FE)', fuel: 'Essence', displacement: '1329 cm³' },
          { code: '1KR-FE', label: '1.0L Essence (1KR-FE)', fuel: 'Essence', displacement: '998 cm³' },
        ],
      },
    ],
  },
  {
    brand: 'Renault',
    models: [
      {
        name: 'Duster',
        years: [2024, 2023, 2022, 2021, 2020, 2019, 2018],
        engines: [
          { code: 'H4M', label: '1.6L Essence (H4M)', fuel: 'Essence', displacement: '1598 cm³' },
          { code: 'K9K', label: '1.5L Diesel (K9K)', fuel: 'Diesel', displacement: '1461 cm³' },
          { code: 'H5F', label: '1.2L TCe (H5F)', fuel: 'Essence', displacement: '1197 cm³' },
        ],
      },
      {
        name: 'Logan',
        years: [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017],
        engines: [
          { code: 'K7M', label: '1.6L Essence (K7M)', fuel: 'Essence', displacement: '1598 cm³' },
          { code: 'K9K', label: '1.5L Diesel (K9K)', fuel: 'Diesel', displacement: '1461 cm³' },
          { code: 'H4B', label: '1.0L SCe (H4B)', fuel: 'Essence', displacement: '999 cm³' },
        ],
      },
      {
        name: 'Kwid',
        years: [2024, 2023, 2022, 2021, 2020],
        engines: [
          { code: 'BR10', label: '1.0L Essence (BR10)', fuel: 'Essence', displacement: '999 cm³' },
        ],
      },
    ],
  },
  {
    brand: 'Peugeot',
    models: [
      {
        name: '308',
        years: [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017],
        engines: [
          { code: 'EP6', label: '1.2L PureTech (EP6)', fuel: 'Essence', displacement: '1199 cm³' },
          { code: 'DV6', label: '1.5L BlueHDi (DV6)', fuel: 'Diesel', displacement: '1499 cm³' },
          { code: 'DW10', label: '2.0L BlueHDi (DW10)', fuel: 'Diesel', displacement: '1997 cm³' },
        ],
      },
      {
        name: '207',
        years: [2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013],
        engines: [
          { code: 'TU5', label: '1.4L Essence (TU5)', fuel: 'Essence', displacement: '1360 cm³' },
          { code: 'DV4', label: '1.6L HDi (DV4)', fuel: 'Diesel', displacement: '1560 cm³' },
        ],
      },
      {
        name: '2008',
        years: [2024, 2023, 2022, 2021, 2020, 2019, 2018],
        engines: [
          { code: 'EB2', label: '1.2L PureTech (EB2)', fuel: 'Essence', displacement: '1199 cm³' },
          { code: 'DV6', label: '1.5L BlueHDi (DV6)', fuel: 'Diesel', displacement: '1499 cm³' },
        ],
      },
    ],
  },
  {
    brand: 'Nissan',
    models: [
      {
        name: 'Qashqai',
        years: [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017],
        engines: [
          { code: 'MR20DD', label: '2.0L Essence (MR20DD)', fuel: 'Essence', displacement: '1997 cm³' },
          { code: 'R9M', label: '1.5L Diesel (R9M)', fuel: 'Diesel', displacement: '1461 cm³' },
          { code: 'HR13DDT', label: '1.3L DIG-T (HR13DDT)', fuel: 'Essence', displacement: '1332 cm³' },
        ],
      },
      {
        name: 'X-Trail',
        years: [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017],
        engines: [
          { code: 'MR20DD', label: '2.0L Essence (MR20DD)', fuel: 'Essence', displacement: '1997 cm³' },
          { code: 'R9M', label: '1.5L Diesel (R9M)', fuel: 'Diesel', displacement: '1461 cm³' },
          { code: 'QR25DE', label: '2.5L Essence (QR25DE)', fuel: 'Essence', displacement: '2488 cm³' },
        ],
      },
      {
        name: 'Navara',
        years: [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016],
        engines: [
          { code: 'YD25', label: '2.3L Diesel (YD25)', fuel: 'Diesel', displacement: '2298 cm³' },
          { code: 'QR25DE', label: '2.5L Essence (QR25DE)', fuel: 'Essence', displacement: '2488 cm³' },
        ],
      },
    ],
  },
  {
    brand: 'Mitsubishi',
    models: [
      {
        name: 'L200',
        years: [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017],
        engines: [
          { code: '4D56', label: '2.5L DI-D (4D56)', fuel: 'Diesel', displacement: '2477 cm³' },
          { code: '4N15', label: '2.4L DI-D (4N15)', fuel: 'Diesel', displacement: '2442 cm³' },
        ],
      },
      {
        name: 'Pajero',
        years: [2021, 2020, 2019, 2018, 2017, 2016, 2015],
        engines: [
          { code: '4M41', label: '3.2L DI-D (4M41)', fuel: 'Diesel', displacement: '3200 cm³' },
          { code: '6G72', label: '3.0L V6 (6G72)', fuel: 'Essence', displacement: '2972 cm³' },
        ],
      },
    ],
  },
  {
    brand: 'Dacia',
    models: [
      {
        name: 'Logan',
        years: [2024, 2023, 2022, 2021, 2020, 2019, 2018],
        engines: [
          { code: 'K7M', label: '1.6L Essence (K7M)', fuel: 'Essence', displacement: '1598 cm³' },
          { code: 'K9K', label: '1.5L Diesel (K9K)', fuel: 'Diesel', displacement: '1461 cm³' },
        ],
      },
    ],
  },
  {
    brand: 'Hyundai',
    models: [
      {
        name: 'Tucson',
        years: [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017],
        engines: [
          { code: 'G4FD', label: '2.0L Essence (G4FD)', fuel: 'Essence', displacement: '1999 cm³' },
          { code: 'D4FD', label: '1.6L CRDi (D4FD)', fuel: 'Diesel', displacement: '1598 cm³' },
          { code: 'G4FL', label: '1.6L T-GDi (G4FL)', fuel: 'Essence', displacement: '1591 cm³' },
        ],
      },
      {
        name: 'i10',
        years: [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017],
        engines: [
          { code: 'G3LA', label: '1.0L MPI (G3LA)', fuel: 'Essence', displacement: '998 cm³' },
          { code: 'G3LB', label: '1.2L MPI (G3LB)', fuel: 'Essence', displacement: '1197 cm³' },
        ],
      },
      {
        name: 'Santa Fe',
        years: [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017],
        engines: [
          { code: 'G4KH', label: '2.4L Essence (G4KH)', fuel: 'Essence', displacement: '2359 cm³' },
          { code: 'D4FD', label: '1.6L CRDi (D4FD)', fuel: 'Diesel', displacement: '1598 cm³' },
          { code: 'G4FP', label: '1.6L T-GDi Hybrid', fuel: 'Hybride', displacement: '1591 cm³' },
        ],
      },
    ],
  },
];

const POPULAR_PARTS = [
  { id: 'filter-oil', label: 'Filtre à huile', icon: '🛢️', category: 'moteur' },
  { id: 'filter-air', label: 'Filtre à air', icon: '💨', category: 'moteur' },
  { id: 'filter-fuel', label: 'Filtre à carburant', icon: '⛽', category: 'moteur' },
  { id: 'filter-cabin', label: 'Filtre habitacle', icon: '🌬️', category: 'confort' },
  { id: 'brake-pads-front', label: 'Plaquettes frein AV', icon: '🛑', category: 'freinage' },
  { id: 'brake-pads-rear', label: 'Plaquettes frein AR', icon: '🛑', category: 'freinage' },
  { id: 'brake-discs-front', label: 'Disques frein AV', icon: '🔄', category: 'freinage' },
  { id: 'brake-discs-rear', label: 'Disques frein AR', icon: '🔄', category: 'freinage' },
  { id: 'timing-belt', label: 'Kit distribution', icon: '⚙️', category: 'moteur' },
  { id: 'spark-plugs', label: 'Bougies d\'allumage', icon: '⚡', category: 'allumage' },
  { id: 'shock-absorbers-front', label: 'Amortisseurs AV', icon: '🔧', category: 'suspension' },
  { id: 'shock-absorbers-rear', label: 'Amortisseurs AR', icon: '🔧', category: 'suspension' },
  { id: 'battery', label: 'Batterie', icon: '🔋', category: 'électricité' },
  { id: 'alternator', label: 'Alternateur', icon: '🔌', category: 'électricité' },
  { id: 'starter', label: 'Démarreur', icon: '🔄', category: 'électricité' },
  { id: 'wiper-blades', label: 'Balais d\'essuie-glace', icon: '🌧️', category: 'visibilité' },
  { id: 'headlight', label: 'Phares', icon: '💡', category: 'éclairage' },
  { id: 'mirror', label: 'Rétroviseurs', icon: '🪞', category: 'carrosserie' },
  { id: 'bumper', label: 'Pare-chocs', icon: '🛡️', category: 'carrosserie' },
];

export default function VehiclePartsSearch() {
  const [searchMode, setSearchMode] = useState<'plate' | 'model'>('plate');
  const [selectedCountry, setSelectedCountry] = useState('CI');
  const [plateNumber, setPlateNumber] = useState('');
  const [plateError, setPlateError] = useState('');
  const [searching, setSearching] = useState(false);
  const [vehicleFound, setVehicleFound] = useState<VehicleRegistration | null>(null);
  
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | ''>('');
  const [selectedEngine, setSelectedEngine] = useState('');

  const brands = VEHICLE_DB.map(v => v.brand);
  const models = selectedBrand ? VEHICLE_DB.find(v => v.brand === selectedBrand)?.models || [] : [];
  const years = selectedModel ? models.find(m => m.name === selectedModel)?.years || [] : [];
  const engines = selectedYear ? models.find(m => m.name === selectedModel)?.engines || [] : [];

  const country = COUNTRIES.find(c => c.code === selectedCountry);
  const isPlateValid = country ? new RegExp(country.pattern).test(plateNumber.replace(/\s/g, '').toUpperCase()) : false;

  const handlePlateSearch = async () => {
    if (!isPlateValid) {
      setPlateError('Format d\'immatriculation invalide');
      return;
    }
    setSearching(true);
    setPlateError('');
    
    try {
      const response = await fetch(`/api/v1/vehicles/lookup?plate=${encodeURIComponent(plateNumber)}&country=${selectedCountry}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Erreur de recherche');
      }
      
      setVehicleFound(data.vehicle);
    } catch (error) {
      setPlateError(error instanceof Error ? error.message : 'Erreur de recherche');
    } finally {
      setSearching(false);
    }
  };

  const router = useRouter();

  const handleModelSearch = () => {
    if (selectedBrand) {
      const slug = selectedBrand.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      router.push(`/marques/${slug}`);
    } else {
      router.push('/catalogue');
    }
  };

  const resetSearch = () => {
    setPlateNumber('');
    setPlateError('');
    setVehicleFound(null);
    setSelectedBrand('');
    setSelectedModel('');
    setSelectedYear('');
    setSelectedEngine('');
  };

  return (
    <section className="py-10 bg-[var(--color-bg)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--color-warm-ink)] mb-4">
            Trouvez les pièces pour votre véhicule
          </h1>
          <p className="text-lg text-[var(--color-warm-muted)] max-w-2xl mx-auto">
            Recherchez par numéro d&apos;immatriculation ou sélectionnez votre modèle pour voir les pièces compatibles
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[var(--color-warm-border)] p-6 mb-8 shadow-sm">
          <div className="flex gap-2 mb-6" role="tablist">
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
              🔍 Par immatriculation
            </button>
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
              🚗 Par modèle
            </button>
          </div>

          {searchMode === 'plate' && (
            <form onSubmit={(e) => { e.preventDefault(); handlePlateSearch(); }} className="space-y-4" role="tabpanel">
              <div className="flex gap-2">
                <select
                  value={selectedCountry}
                  onChange={e => setSelectedCountry(e.target.value)}
                  className="w-24 px-4 py-3.5 rounded-xl border border-[var(--color-warm-border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] text-sm"
                  aria-label="Pays"
                >
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={plateNumber}
                    onChange={e => {
                      const val = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
                      setPlateNumber(val);
                      if (plateError) setPlateError('');
                    }}
                    placeholder={country?.code === 'CI' ? 'AB-123-CD' : 'Immatriculation'}
                    className={`w-full pl-4 pr-12 py-3.5 rounded-xl border border-[var(--color-warm-border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] text-sm ${plateError ? 'border-red-400' : ''}`}
                    aria-label="Numéro d'immatriculation"
                    maxLength={15}
                  />
                  {plateNumber && (
                    <button
                      type="button"
                      onClick={() => { setPlateNumber(''); setPlateError(''); }}
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
              <div className="text-xs text-[var(--color-warm-muted)] flex items-center gap-2">
                <span>💡</span>
                <span>Format CI : AB-123-CD</span>
              </div>
              <button
                type="submit"
                onClick={handlePlateSearch}
                disabled={!isPlateValid || searching}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-warm)] text-white font-bold hover:from-[var(--color-orange-hover)] hover:to-[var(--color-primary-dark)] transition-all shadow-lg shadow-[var(--color-primary)]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {searching ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                    Recherche...
                  </>
                ) : (
                  '🔍 Rechercher'
                )}
              </button>
            </form>
          )}

          {searchMode === 'model' && (
            <form onSubmit={(e) => { e.preventDefault(); handleModelSearch(); }} className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4" role="tabpanel">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-warm-muted)] mb-2">
                  Marque
                </label>
                <select
                  value={selectedBrand}
                  onChange={e => { setSelectedBrand(e.target.value); setSelectedModel(''); setSelectedYear(''); setSelectedEngine(''); }}
                  className="w-full px-4 py-3.5 rounded-xl border border-[var(--color-warm-border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] text-sm appearance-none"
                >
                  <option value="">Sélectionner la marque</option>
                  {brands.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-warm-muted)] mb-2">
                  Modèle
                </label>
                <select
                  value={selectedModel}
                  onChange={e => { setSelectedModel(e.target.value); setSelectedYear(''); setSelectedEngine(''); }}
                  disabled={!selectedBrand}
                  className="w-full px-4 py-3.5 rounded-xl border border-[var(--color-warm-border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] text-sm appearance-none"
                >
                  <option value="">Sélectionner le modèle</option>
                  {models.map(m => (
                    <option key={m.name} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-warm-muted)] mb-2">
                  Année
                </label>
                <select
                  value={selectedYear}
                  onChange={e => { setSelectedYear(Number(e.target.value)); setSelectedEngine(''); }}
                  disabled={!selectedModel}
                  className="w-full px-4 py-3.5 rounded-xl border border-[var(--color-warm-border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] text-sm appearance-none"
                >
                  <option value="">Sélectionner l&apos;année</option>
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-warm-muted)] mb-2">
                  Motorisation
                </label>
                <select
                  value={selectedEngine}
                  onChange={e => setSelectedEngine(e.target.value)}
                  disabled={!selectedYear}
                  className="w-full px-4 py-3.5 rounded-xl border border-[var(--color-warm-border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] text-sm appearance-none"
                >
                  <option value="">Sélectionner le moteur</option>
                  {engines.map(e => (
                    <option key={e.code} value={e.code}>{e.label} ({e.fuel})</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                onClick={handleModelSearch}
                disabled={!selectedBrand || !selectedModel || !selectedYear || !selectedEngine}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-warm)] text-white font-bold hover:from-[var(--color-orange-hover)] hover:to-[var(--color-primary-dark)] transition-all shadow-lg shadow-[var(--color-primary)]/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🔍 Voir les pièces compatibles
              </button>
            </form>
          )}
        </div>

        {(vehicleFound || (selectedBrand && selectedModel && selectedYear && selectedEngine)) && (
          <div className="bg-white rounded-2xl border border-[var(--color-primary)]/20 p-6 shadow-sm animate-fade-in">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent-warm)] flex items-center justify-center text-2xl">
                🚗
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-[var(--color-warm-ink)]">
                  {vehicleFound 
                    ? `${vehicleFound.brand} ${vehicleFound.model} ${vehicleFound.year}`
                    : `${selectedBrand} ${selectedModel} ${selectedYear}`}
                </h3>
                <p className="text-[var(--color-warm-muted)] text-sm">
                  {vehicleFound 
                    ? `Immatriculation: ${vehicleFound.plate} • Pays: ${COUNTRIES.find(c => c.code === vehicleFound?.country)?.flag} ${vehicleFound?.country}`
                    : `Moteur: ${engines.find(e => e.code === selectedEngine)?.label} • ${engines.find(e => e.code === selectedEngine)?.fuel}`}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleModelSearch}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:bg-[var(--color-orange-hover)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                🔧 Voir toutes les pièces compatibles
              </button>
              <button onClick={resetSearch} className="px-6 py-3 rounded-xl border border-[var(--color-warm-border)] text-[var(--color-warm-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all">
                Nouvelle recherche
              </button>
            </div>
          </div>
        )}

        {!vehicleFound && !selectedBrand && (
          <div>
            <h3 className="text-lg font-bold text-[var(--color-warm-ink)] mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">⚡</span>
              Pièces les plus recherchées
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {POPULAR_PARTS.map(part => (
                <button
                  key={part.id}
                  onClick={() => router.push('/catalogue')}
                  className="group relative p-4 bg-white rounded-xl border border-[var(--color-warm-border)] hover:border-[var(--color-primary)]/40 hover:shadow-xl hover:shadow-[var(--color-primary)]/10 transition-all duration-300 text-center cursor-pointer"
                >
                  <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">{part.icon}</span>
                  <span className="text-sm font-medium text-[var(--color-warm-ink)] group-hover:text-[var(--color-primary)] transition-colors">{part.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export type { VehicleRegistration, VehicleModel };
export { VEHICLE_DB, POPULAR_PARTS, COUNTRIES };