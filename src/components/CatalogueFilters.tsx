'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/shared/types';
import RemoteImage from '@/components/RemoteImage';

interface CatalogueFiltersProps {
  products: Product[];
}

const MAKES_POPULAR = ['Toyota', 'Hyundai', 'Kia', 'Peugeot', 'Mitsubishi', 'Nissan', 'Renault', 'Dacia', 'Suzuki'];
const MAKES_ALL = [...MAKES_POPULAR, 'Mercedes-Benz', 'Ford', 'Volkswagen', 'BMW', 'Citroën', 'Opel', 'Honda', 'Mazda'];

const MODELS_BY_MAKE: Record<string, string[]> = {
  Toyota: ['Hilux', 'Corolla', 'Land Cruiser', 'RAV4', 'Camry', 'Yaris', 'Avanza', 'Fortuner', 'Prado'],
  Hyundai: ['Tucson', 'i10', 'i20', 'i30', 'Santa Fe', 'Creta', 'Elantra', 'Sonata'],
  Kia: ['Sportage', 'Picanto', 'Rio', 'Sorento', 'Cerato', 'Stonic'],
  Peugeot: ['308', '208', '3008', '5008', '206', '207', '407', '2008'],
  Mitsubishi: ['Pajero', 'L200', 'Eclipse Cross', 'ASX', 'Outlander'],
  Nissan: ['Navara', 'Pathfinder', 'X-Trail', 'Qashqai', 'Micra', 'Altima'],
  Renault: ['Duster', 'Sandero', 'Logan', 'Megane', 'Clio', 'Captur', 'Kwid'],
  Dacia: ['Duster', 'Sandero', 'Logan', 'Spring', 'Jogger'],
  Suzuki: ['Jimny', 'Swift', 'Vitara', 'Dzire', 'SX4'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE', 'Sprinter', 'Actros'],
  Ford: ['Ranger', 'Transit', 'Escape', 'Explorer'],
  Volkswagen: ['Polo', 'Golf', 'Tiguan', 'Touareg', 'T-Roc'],
  BMW: ['Série 3', 'Série 5', 'X3', 'X5'],
  Citroën: ['C3', 'C4', 'Berlingo', 'Dispatch'],
  Opel: ['Corsa', 'Astra', 'Mokka'],
};

const CATEGORIES = ['Toutes', 'Freinage', 'Moteur & Filtration', 'Suspension & Direction', 'Éclairage & Électricité', 'Carrosserie & Habillage', 'Transmission & Échappement'];
const CONDITIONS = ['Tous', 'Neuf', 'Occasion', 'Reconditionné'];

function firstImage(p: Product): string {
  if (Array.isArray(p.images) && p.images.length > 0) return p.images[0];
  if (typeof p.images === 'string' && p.images) {
    try {
      const arr = JSON.parse(p.images);
      if (Array.isArray(arr) && arr.length > 0) return String(arr[0]);
    } catch { /* ignore */ }
  }
  return '/images/placeholder.svg';
}

const ITEMS_PER_PAGE = 12;

function CatalogueFiltersContent({ products }: CatalogueFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initial State from URL
  const [selectedMake, setSelectedMake] = useState<string>(searchParams.get('marque') || '');
  const [selectedModel, setSelectedModel] = useState<string>(searchParams.get('modele') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('categorie') || 'Toutes');
  const [selectedCondition, setSelectedCondition] = useState<string>(searchParams.get('condition') || 'Tous');
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [minPrice, setMinPrice] = useState<string>(searchParams.get('minPrix') || '');
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get('maxPrix') || '');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(searchParams.get('enStock') === '1');
  const sortParam = searchParams.get('sort');
  const initialSort: 'recent' | 'price-asc' | 'price-desc' | 'rating' =
    sortParam === 'price-asc' || sortParam === 'price-desc' || sortParam === 'rating'
      ? sortParam
      : 'recent';
  const [sortBy, setSortBy] = useState<'recent' | 'price-asc' | 'price-desc' | 'rating'>(initialSort);
  const [showAllMakes, setShowAllMakes] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync state to URL searchParams
  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('q', search.trim());
    if (selectedMake) params.set('marque', selectedMake);
    if (selectedModel) params.set('modele', selectedModel);
    if (selectedCategory !== 'Toutes') params.set('categorie', selectedCategory);
    if (selectedCondition !== 'Tous') params.set('condition', selectedCondition);
    if (minPrice) params.set('minPrix', minPrice);
    if (maxPrice) params.set('maxPrix', maxPrice);
    if (onlyInStock) params.set('enStock', '1');
    if (sortBy !== 'recent') params.set('sort', sortBy);

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [search, selectedMake, selectedModel, selectedCategory, selectedCondition, minPrice, maxPrice, onlyInStock, sortBy, pathname, router]);

  const availableModels = selectedMake ? (MODELS_BY_MAKE[selectedMake] || []) : [];

  // Filtered & Sorted Products
  const filtered = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.reference?.toLowerCase().includes(q) ||
        p.brand?.name?.toLowerCase().includes(q) ||
        p.category?.name?.toLowerCase().includes(q)
      );
    }

    if (selectedMake) {
      result = result.filter(p =>
        p.brand?.name?.toLowerCase() === selectedMake.toLowerCase()
      );
    }

    if (selectedCategory !== 'Toutes') {
      result = result.filter(p => p.category?.name?.toLowerCase().includes(selectedCategory.toLowerCase()));
    }

    if (selectedCondition !== 'Tous') {
      result = result.filter(p => p.condition === selectedCondition);
    }

    if (onlyInStock) {
      result = result.filter(p => (p.stock || 0) > 0);
    }

    const minVal = parseFloat(minPrice);
    if (!isNaN(minVal)) {
      result = result.filter(p => (p.price || 0) >= minVal);
    }

    const maxVal = parseFloat(maxPrice);
    if (!isNaN(maxVal)) {
      result = result.filter(p => (p.price || 0) <= maxVal);
    }

    // Sort
    if (sortBy === 'price-asc') result.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sortBy === 'price-desc') result.sort((a, b) => (b.price || 0) - (a.price || 0));
    else if (sortBy === 'rating') result.sort((a, b) => ((b as Product & { rating?: number }).rating || 5) - ((a as Product & { rating?: number }).rating || 5));

    return result;
  }, [products, search, selectedMake, selectedCategory, selectedCondition, minPrice, maxPrice, onlyInStock, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const formatCFA = (n: number) => new Intl.NumberFormat('fr-FR').format(n);

  const resetFilters = () => {
    setSelectedMake('');
    setSelectedModel('');
    setSelectedCategory('Toutes');
    setSelectedCondition('Tous');
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setOnlyInStock(false);
    setSortBy('recent');
    setCurrentPage(1);
  };

  const hasFilters = Boolean(
    selectedMake ||
    selectedCategory !== 'Toutes' ||
    selectedCondition !== 'Tous' ||
    search.trim() ||
    minPrice ||
    maxPrice ||
    onlyInStock
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
              <span>{filtered.length} pièce{filtered.length !== 1 ? 's' : ''} disponible{filtered.length !== 1 ? 's' : ''}</span>
              {onlyInStock && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">En stock uniquement</span>}
            </h2>
            {hasFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-orange-600 hover:text-orange-700 font-semibold mt-0.5 hover:underline cursor-pointer"
              >
                Réinitialiser tous les filtres ×
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-500 whitespace-nowrap">Trier par :</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 font-medium text-gray-700 focus:outline-none focus:border-orange-400 bg-white cursor-pointer shadow-sm"
            >
              <option value="recent">Plus récents</option>
              <option value="price-asc">Prix croissant ⬆</option>
              <option value="price-desc">Prix décroissant ⬇</option>
              <option value="rating">Meilleures notes ★</option>
            </select>
          </div>
        </div>

        {/* Search input */}
        <div className="relative mb-5">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Rechercher une pièce (ex: Plaquette Hilux, Filtre à huile, Bougie...)"
            className="w-full pl-10 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-orange-400 transition-colors bg-white shadow-sm placeholder-gray-400"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg font-bold"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Filter Box */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 mb-6">
        {/* Mobile Toggle */}
        <div className="sm:hidden mb-3">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 shadow-sm"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filtres {hasFilters ? '(Actifs)' : ''}
            </span>
            <span className="text-xs text-orange-600">{showMobileFilters ? 'Cacher ▲' : 'Afficher ▼'}</span>
          </button>
        </div>

        <div className={`${showMobileFilters ? 'block' : 'hidden sm:block'} space-y-4`}>
          {/* Category Pills */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
              Catégorie de pièce
            </label>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-0.5 pb-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-orange-500 text-white shadow-sm ring-2 ring-orange-400/30'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 border-t border-gray-100">
            {/* Make */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                Marque du véhicule
              </label>
              <div className="relative">
                <select
                  value={selectedMake}
                  onChange={e => { setSelectedMake(e.target.value); setSelectedModel(''); setCurrentPage(1); }}
                  className="w-full pl-3 pr-8 py-2 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-orange-400 transition-colors bg-white cursor-pointer appearance-none"
                >
                  <option value="">Toutes les marques</option>
                  <optgroup label="Populaires en Afrique">
                    {MAKES_POPULAR.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </optgroup>
                  {showAllMakes && (
                    <optgroup label="Autres marques">
                      {MAKES_ALL.filter(m => !MAKES_POPULAR.includes(m)).map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </optgroup>
                  )}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-orange-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <button
                onClick={() => setShowAllMakes(!showAllMakes)}
                className="inline-flex items-center gap-1 text-[11px] text-orange-600 hover:text-orange-700 font-semibold mt-1.5 transition-colors cursor-pointer"
              >
                <span>{showAllMakes ? 'Voir moins' : 'Plus de marques'}</span>
                <svg className={`w-3 h-3 transition-transform ${showAllMakes ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Model */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                Modèle
              </label>
              <div className="relative">
                <select
                  value={selectedModel}
                  onChange={e => { setSelectedModel(e.target.value); setCurrentPage(1); }}
                  disabled={!selectedMake}
                  className={`w-full pl-3 pr-8 py-2 border-2 rounded-xl text-sm font-medium focus:outline-none transition-colors bg-white appearance-none ${
                    selectedMake
                      ? 'border-gray-200 text-gray-900 cursor-pointer focus:border-orange-400'
                      : 'border-gray-100 text-gray-400 cursor-not-allowed bg-gray-50'
                  }`}
                >
                  <option value="">{selectedMake ? 'Tous les modèles' : 'Sélectionnez une marque'}</option>
                  {availableModels.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 ${selectedMake ? 'text-orange-500' : 'text-gray-300'}`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                Prix (FCFA)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={e => { setMinPrice(e.target.value); setCurrentPage(1); }}
                  className="w-full px-2.5 py-1.5 border-2 border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-orange-400 bg-white"
                />
                <span className="text-gray-400 font-bold">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={e => { setMaxPrice(e.target.value); setCurrentPage(1); }}
                  className="w-full px-2.5 py-1.5 border-2 border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-orange-400 bg-white"
                />
              </div>
            </div>

            {/* Condition & Stock */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                Disponibilité & État
              </label>
              <div className="flex flex-col gap-2">
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={e => { setOnlyInStock(e.target.checked); setCurrentPage(1); }}
                    className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-400 accent-orange-500"
                  />
                  En stock seulement
                </label>

                <div className="flex flex-wrap gap-1">
                  {CONDITIONS.map(c => (
                    <button
                      key={c}
                      onClick={() => { setSelectedCondition(c); setCurrentPage(1); }}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                        selectedCondition === c
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-gray-100">
            <span className="text-xs font-semibold text-gray-400">Filtres actifs :</span>
            {selectedMake && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-bold">
                Marque: {selectedMake}
                <button onClick={() => { setSelectedMake(''); setSelectedModel(''); }} className="hover:text-orange-900 cursor-pointer">×</button>
              </span>
            )}
            {selectedModel && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                Modèle: {selectedModel}
                <button onClick={() => setSelectedModel('')} className="hover:text-blue-900 cursor-pointer">×</button>
              </span>
            )}
            {selectedCategory !== 'Toutes' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold">
                Catégorie: {selectedCategory}
                <button onClick={() => setSelectedCategory('Toutes')} className="hover:text-purple-900 cursor-pointer">×</button>
              </span>
            )}
            {selectedCondition !== 'Tous' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                Condition: {selectedCondition}
                <button onClick={() => setSelectedCondition('Tous')} className="hover:text-emerald-900 cursor-pointer">×</button>
              </span>
            )}
            {minPrice && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
                Min: {formatCFA(Number(minPrice))} FCFA
                <button onClick={() => setMinPrice('')} className="hover:text-amber-900 cursor-pointer">×</button>
              </span>
            )}
            {maxPrice && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
                Max: {formatCFA(Number(maxPrice))} FCFA
                <button onClick={() => setMaxPrice('')} className="hover:text-amber-900 cursor-pointer">×</button>
              </span>
            )}
            {onlyInStock && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-bold">
                Stock garanti
                <button onClick={() => setOnlyInStock(false)} className="hover:text-teal-900 cursor-pointer">×</button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Aucune pièce ne correspond à vos critères</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
            Essayez de relâcher un filtre de prix, de changer de catégorie ou d&apos;élargir la recherche textuelle.
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer shadow-sm"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {paginatedProducts.map((p) => {
              const img = firstImage(p);
              const conditionBadge =
                p.condition === 'Neuf'
                  ? 'bg-emerald-100 text-emerald-700'
                  : p.condition === 'Occasion'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-amber-100 text-amber-700';
              return (
                <Link
                  key={p.id}
                  href={`/pieces/${p.id}`}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col"
                >
                  <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
                    {img ? (
                      <RemoteImage
                        src={img}
                        alt={p.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                    )}
                    <span className={`absolute top-2 left-2 text-[10px] font-extrabold px-2.5 py-1 rounded-full ${conditionBadge}`}>
                      {p.condition || 'Neuf'}
                    </span>
                  </div>
                  <div className="p-3 sm:p-4 flex flex-col flex-1">
                    <p className="text-xs text-gray-400 font-semibold mb-0.5 truncate">
                      {p.brand?.name || 'Marque'} {selectedModel ? `• ${selectedModel}` : ''}
                    </p>
                    <h3 className="font-bold text-gray-900 text-sm leading-tight mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors flex-1">
                      {p.title}
                    </h3>
                    <div className="flex items-end justify-between mt-auto">
                      <div>
                        <p className="text-base font-extrabold text-orange-600">{formatCFA(p.price || 0)}</p>
                        <p className="text-[10px] text-gray-400 font-medium">FCFA</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                        (p.stock || 0) > 5 ? 'bg-emerald-50 text-emerald-700' :
                        (p.stock || 0) > 0 ? 'bg-amber-50 text-amber-600' :
                        'bg-red-50 text-red-600'
                      }`}>
                        {(p.stock || 0) > 5 ? 'En stock' : (p.stock || 0) > 0 ? `${p.stock} restant${(p.stock || 0) > 1 ? 's' : ''}` : 'Rupture'}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Précédent
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                      currentPage === page
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Suivant →
              </button>
            </div>
          )}
        </>
      )}

      {/* CTA Devenir Vendeur */}
      <div className="mt-10 p-6 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl text-white text-center shadow-sm">
        <h3 className="font-extrabold text-lg mb-1.5">Vous êtes fournisseur ou garagiste ?</h3>
        <p className="text-sm text-white/90 mb-4">Vendez directement vos pièces neuves et d&apos;occasion sur AutoAfrique.</p>
        <Link
          href="/devenir-vendeur"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-colors text-sm shadow-sm"
        >
          Devenir vendeur agréé →
        </Link>
      </div>
    </div>
  );
}

export default function CatalogueFilters(props: CatalogueFiltersProps) {
  return (
    <Suspense fallback={<div className="text-center py-12 text-gray-500 font-medium">Chargement du catalogue...</div>}>
      <CatalogueFiltersContent {...props} />
    </Suspense>
  );
}
