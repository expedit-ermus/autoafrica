'use client';
import { useState, useEffect } from 'react';
import RemoteImage from '@/components/RemoteImage';
import Sidebar from '@/components/Sidebar';
import DashboardTopBar from '@/components/DashboardTopBar';
import Modal from '@/components/Modal';
import {
  BreadcrumbStructuredData,
  ItemListStructuredData,
  VehicleStructuredData,
} from '@/components/StructuredData';
import { SITE_URL, VEHICLES_URL } from '@/lib/structured-data';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

const formatCFA = (n: number) => new Intl.NumberFormat('fr-FR').format(n);

const IVORIAN_CITIES = ['Abidjan', 'Bouaké', 'Yamoussoukro', 'Korhogo', 'San-Pédro', 'Daloa', 'Man', 'Gagnoa'];

const DEFAULT_IMAGE = '/images/placeholder.svg';

interface VehicleSeller {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  shopName?: string | null;
  phone?: string | null;
  city?: string | null;
  country?: string | null;
}

interface VehicleListing {
  id: string;
  status: string;
  price: number;
  seller: VehicleSeller;
}

interface Vehicle {
  id: string;
  name: string;
  year: number;
  price: number;
  currency: string;
  mileage?: number | null;
  fuel?: string | null;
  gearbox?: string | null;
  condition?: string | null;
  bodyType?: string | null;
  color?: string | null;
  city?: string | null;
  country?: string | null;
  description?: string | null;
  images?: string[] | string | null;
  views?: number;
  brand?: { name?: string; slug?: string } | null;
  carModel?: { name?: string; bodyType?: string | null; engine?: string | null } | null;
  listings?: VehicleListing[];
}

const FUEL_LABELS: Record<string, string> = { DIESEL: 'Diesel', GASOLINE: 'Essence', HYBRID: 'Hybride', ELECTRIC: 'Électrique', LPG: 'GPL' };
const GEARBOX_LABELS: Record<string, string> = { MANUAL: 'Manuelle', AUTOMATIC: 'Automatique' };
const CONDITION_LABELS: Record<string, { label: string; cls: string }> = {
  NEW: { label: 'Neuf', cls: 'bg-emerald-500/90 text-white' },
  USED: { label: 'Occasion', cls: 'bg-amber-500/90 text-white' },
  CERTIFIED: { label: 'Certifié', cls: 'bg-sky-500/90 text-white' },
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [fuelFilter, setFuelFilter] = useState('all');
  const [gearboxFilter, setGearboxFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [detail, setDetail] = useState<Vehicle | null>(null);
  const [detailImageIdx, setDetailImageIdx] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useDocumentTitle(
    detail ? `${detail.brand?.name || ''} ${detail.name} ${detail.year}`.trim() : null,
    "Véhicules — Annonces Côte d'Ivoire | AutoAfrique",
  );

  const brands = ['Suzuki', 'Toyota', 'Renault', 'Peugeot', 'Nissan', 'Hyundai', 'Kia', 'Mercedes', 'Volkswagen', 'BMW', 'Honda', 'Audi', 'Citroën', 'Fiat', 'Opel', 'Skoda'];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const params = new URLSearchParams();
        if (brandFilter !== 'all') params.set('brand', brandFilter);
        if (cityFilter !== 'all') params.set('city', cityFilter);
        if (fuelFilter !== 'all') params.set('fuel', fuelFilter);
        if (gearboxFilter !== 'all') params.set('gearbox', gearboxFilter);
        if (search) params.set('search', search);
        params.set('page', String(page));
        params.set('pageSize', '12');
        const sortMap: Record<string, { sortBy: string; sortOrder: string }> = {
          newest: { sortBy: 'createdAt', sortOrder: 'desc' },
          price_asc: { sortBy: 'price', sortOrder: 'asc' },
          price_desc: { sortBy: 'price', sortOrder: 'desc' },
          year_desc: { sortBy: 'year', sortOrder: 'desc' },
        };
        const sort = sortMap[sortBy] || sortMap.newest;
        params.set('sortBy', sort.sortBy);
        params.set('sortOrder', sort.sortOrder);
        const res = await fetch(`/api/v1/vehicles?${params}`);
        const data = await res.json();
        if (!cancelled && data.success) {
          setVehicles(data.data.data);
          setTotalPages(data.data.totalPages);
          setTotal(data.data.total);
        }
      } catch (err) { console.error(err); } finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [brandFilter, cityFilter, fuelFilter, gearboxFilter, sortBy, page, search]);

  const getImages = (v: Vehicle): string[] => {
    if (Array.isArray(v.images) && v.images.length > 0) return v.images as string[];
    if (typeof v.images === 'string' && v.images) {
      try {
        const parsed = JSON.parse(v.images);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { /* ignore */ }
    }
    return [DEFAULT_IMAGE];
  };

  const getSeller = (v: Vehicle): VehicleSeller | undefined => v.listings?.[0]?.seller;

  const contactSeller = (v: Vehicle) => {
    const seller = getSeller(v);
    if (!seller?.phone) return;
    const msg = encodeURIComponent(`Bonjour, je suis intéressé par ${v.brand?.name || ''} ${v.name} ${v.year} à ${formatCFA(v.price)} FCFA sur AutoAfrique. Est-il toujours disponible ?`);
    window.open(`https://wa.me/${seller.phone.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
  };

  const VehicleCard = ({ v }: { v: Vehicle }) => {
    const imgs = getImages(v);
    const cond = CONDITION_LABELS[v.condition || 'USED'] || CONDITION_LABELS.USED;
    return (
      <div
        className="group bg-white rounded-2xl border border-gray-100/80 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
        onClick={() => { setDetail(v); setDetailImageIdx(0); }}
      >
        <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          <RemoteImage src={imgs[0]} alt={v.name} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-semibold backdrop-blur-sm ${cond.cls}`}>{cond.label}</span>
          {v.fuel && (
            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold">
              {FUEL_LABELS[v.fuel] || v.fuel}
            </span>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-1 group-hover:text-orange-600 transition-colors">
            {v.brand?.name || ''} {v.name} {v.year}
          </h3>
          <p className="text-[11px] text-gray-500 mt-1">
            {v.city ? `📍 ${v.city}` : 'Côte d\'Ivoire'}
            {v.gearbox ? ` • ${GEARBOX_LABELS[v.gearbox] || v.gearbox}` : ''}
            {typeof v.mileage === 'number' ? ` • ${formatCFA(v.mileage)} km` : ''}
          </p>
          <div className="flex items-center justify-between mt-auto pt-3">
            <p className="text-lg font-extrabold text-gray-900">{formatCFA(v.price)} <span className="text-xs font-normal text-gray-400">FCFA</span></p>
            {getSeller(v)?.phone && (
              <button
                onClick={(e) => { e.stopPropagation(); contactSeller(v); }}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transition text-xs font-semibold"
              >
                Contacter
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-gray-100/80 overflow-hidden animate-pulse">
      <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded-lg w-3/4" />
        <div className="h-3 bg-gray-200 rounded-lg w-1/2" />
        <div className="h-6 bg-gray-200 rounded-lg w-1/3" />
        <div className="h-10 bg-gray-200 rounded-xl w-1/2" />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <Sidebar />
      <div className="flex-1 lg:ml-64 min-w-0">
        <DashboardTopBar />
        <main className="p-4 lg:p-8 pb-24 lg:pb-8 max-w-[1600px] mx-auto">
          <BreadcrumbStructuredData items={[{ name: 'AutoAfrique', url: SITE_URL }, { name: 'Véhicules', url: VEHICLES_URL }]} />

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900">Véhicules d&apos;occasion & neufs 🇨🇮</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {loading ? 'Chargement des annonces...' : `${formatCFA(total)} annonces en Côte d'Ivoire`}
                </p>
              </div>
              <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700">
                Filtres
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="search"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Rechercher un véhicule (Toyota, SUV, diesel...)"
                aria-label="Rechercher un véhicule"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm shadow-sm"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Filters sidebar */}
            <aside className={`w-64 shrink-0 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-5">
                <div>
                  <label htmlFor="vf-brand" className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Marque</label>
                  <select id="vf-brand" value={brandFilter} onChange={(e) => { setBrandFilter(e.target.value); setPage(1); }} className="input-field">
                    <option value="all">Toutes les marques</option>
                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="vf-city" className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Ville</label>
                  <select id="vf-city" value={cityFilter} onChange={(e) => { setCityFilter(e.target.value); setPage(1); }} className="input-field">
                    <option value="all">Toutes les villes</option>
                    {IVORIAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="vf-fuel" className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Carburant</label>
                  <select id="vf-fuel" value={fuelFilter} onChange={(e) => { setFuelFilter(e.target.value); setPage(1); }} className="input-field">
                    <option value="all">Tous</option>
                    <option value="DIESEL">Diesel</option>
                    <option value="GASOLINE">Essence</option>
                    <option value="HYBRID">Hybride</option>
                    <option value="ELECTRIC">Électrique</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="vf-gearbox" className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Boîte</label>
                  <select id="vf-gearbox" value={gearboxFilter} onChange={(e) => { setGearboxFilter(e.target.value); setPage(1); }} className="input-field">
                    <option value="all">Toutes</option>
                    <option value="MANUAL">Manuelle</option>
                    <option value="AUTOMATIC">Automatique</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="vf-sort" className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Trier</label>
                  <select id="vf-sort" value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }} className="input-field">
                    <option value="newest">Plus récents</option>
                    <option value="price_asc">Prix croissant</option>
                    <option value="price_desc">Prix décroissant</option>
                    <option value="year_desc">Année décroissante</option>
                  </select>
                </div>
              </div>
            </aside>

            {/* Grid */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : vehicles.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                  <div className="text-5xl mb-4">🚗</div>
                  <p className="text-gray-500 font-medium">Aucune annonce ne correspond à vos critères</p>
                  <button onClick={() => { setBrandFilter('all'); setCityFilter('all'); setFuelFilter('all'); setGearboxFilter('all'); setSearch(''); }} className="mt-4 text-sm text-orange-600 font-semibold hover:underline">
                    Réinitialiser les filtres
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {vehicles.map(v => <VehicleCard key={v.id} v={v} />)}
                  </div>
                  <ItemListStructuredData items={vehicles.map(() => ({ url: VEHICLES_URL }))} />
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-8">
                      <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 disabled:opacity-40 hover:bg-gray-50">← Précédent</button>
                      <span className="text-sm text-gray-500">Page {page} / {totalPages}</span>
                      <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 disabled:opacity-40 hover:bg-gray-50">Suivant →</button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Detail modal */}
      <Modal isOpen={!!detail} onClose={() => setDetail(null)} title={detail ? `${detail.brand?.name || ''} ${detail.name} ${detail.year}` : ''} size="lg">
        {detail && (
          <div className="space-y-5">
            <VehicleStructuredData
              name={`${detail.brand?.name || ''} ${detail.name} ${detail.year}`.trim()}
              description={detail.description}
              image={getImages(detail)[0]}
              brand={detail.brand?.name}
              model={detail.name}
              year={detail.year}
              mileage={detail.mileage}
              fuel={detail.fuel}
              gearbox={detail.gearbox}
              bodyType={detail.bodyType}
              color={detail.color}
              condition={detail.condition}
              price={detail.price}
              currency={detail.currency || 'XOF'}
              seller={detail.listings?.[0]?.seller?.shopName || detail.listings?.[0]?.seller?.firstName || undefined}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
                <RemoteImage src={getImages(detail)[detailImageIdx]} alt={detail.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900">{formatCFA(detail.price)} <span className="text-sm font-normal text-gray-400">FCFA</span></p>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Année</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{detail.year}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Kilométrage</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{typeof detail.mileage === 'number' ? `${formatCFA(detail.mileage)} km` : '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Carburant</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{detail.fuel ? (FUEL_LABELS[detail.fuel] || detail.fuel) : '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Boîte</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{detail.gearbox ? (GEARBOX_LABELS[detail.gearbox] || detail.gearbox) : '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Carrosserie</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{detail.bodyType || detail.carModel?.bodyType || '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Couleur</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{detail.color || '—'}</p>
                  </div>
                </div>
                {detail.description && (
                  <p className="text-sm text-gray-600 mt-4 leading-relaxed">{detail.description}</p>
                )}
              </div>
            </div>

            {getImages(detail).length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {getImages(detail).map((img, i) => (
                  <button key={i} onClick={() => setDetailImageIdx(i)} className={`relative w-20 h-16 rounded-lg overflow-hidden shrink-0 border-2 ${detailImageIdx === i ? 'border-orange-500' : 'border-transparent'}`}>
                    <RemoteImage src={img} alt={`${detail.name} photo ${i + 1}`} fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {getSeller(detail) && (
              <div className="bg-orange-50/60 border border-orange-100 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-gray-900">{getSeller(detail)?.shopName || `${getSeller(detail)?.firstName || ''} ${getSeller(detail)?.lastName || ''}`.trim() || 'Vendeur'}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{getSeller(detail)?.city ? `📍 ${getSeller(detail)?.city}` : 'Côte d\'Ivoire'}</p>
                </div>
                {getSeller(detail)?.phone && (
                  <button onClick={() => contactSeller(detail)} className="px-4 py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:opacity-90 transition">
                    Contacter sur WhatsApp
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
