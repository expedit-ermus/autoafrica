'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Product } from '@/shared/types';

interface CatalogueFiltersProps {
  products: Product[];
}

// Liste des marques populaires en Afrique de l'Ouest
const MAKES_POPULAR = ['Toyota', 'Hyundai', 'Kia', 'Peugeot', 'Mitsubishi', 'Nissan', 'Renault', 'Dacia', 'Suzuki'];
const MAKES_ALL = [...MAKES_POPULAR, 'Mercedes-Benz', 'Ford', 'Volkswagen', 'BMW', 'Citroën', 'Opel', 'Honda', 'Mazda'];

// Modèles par marque
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

export default function CatalogueFilters({ products }: CatalogueFiltersProps) {
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
  const [selectedCondition, setSelectedCondition] = useState<string>('Tous');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'recent'>('recent');
  const [showAllMakes, setShowAllMakes] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Modèles disponibles selon la marque sélectionnée
  const availableModels = selectedMake ? (MODELS_BY_MAKE[selectedMake] || []) : [];

  // Filtrage des produits
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

    // Sort
    if (sortBy === 'price-asc') result.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sortBy === 'price-desc') result.sort((a, b) => (b.price || 0) - (a.price || 0));

    return result;
  }, [products, search, selectedMake, selectedCategory, selectedCondition, sortBy]);

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
    setSortBy('recent');
    setCurrentPage(1);
  };

  const hasFilters = selectedMake || selectedCategory !== 'Toutes' || selectedCondition !== 'Tous' || search.trim();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* En-tête et barre de recherche */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">
              {filtered.length} pièce{filtered.length !== 1 ? 's' : ''} trouvée{filtered.length !== 1 ? 's' : ''}
            </h2>
            {hasFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-orange-600 hover:text-orange-700 font-semibold mt-0.5 hover:underline"
              >
                Réinitialiser les filtres ×
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-500 whitespace-nowrap">Trier par :</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 font-medium text-gray-700 focus:outline-none focus:border-orange-400 bg-white cursor-pointer"
            >
              <option value="recent">Plus récents</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-5">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une pièce, référence, marque..."
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-orange-400 transition-colors bg-white placeholder-gray-400"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Filtres marque/modèle + condition + catégorie */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 mb-6">
        {/* Mobile toggle button */}
        <div className="sm:hidden mb-3">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filtres {hasFilters ? '(Actifs)' : ''}
            </span>
            <span>{showMobileFilters ? '▲ Cacher' : '▼ Afficher'}</span>
          </button>
        </div>

        <div className={`${showMobileFilters ? 'block' : 'hidden sm:block'} space-y-4`}>
          {/* Catégories (Horizontal Pills) */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
              Catégorie de pièce
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
            {/* Filtre Marque */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                Marque du véhicule
              </label>
              <div className="relative">
                <select
                  value={selectedMake}
                  onChange={e => { setSelectedMake(e.target.value); setSelectedModel(''); setCurrentPage(1); }}
                  className="w-full pl-3 pr-8 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-orange-400 transition-colors bg-white cursor-pointer appearance-none"
                >
                  <option value="">Toutes les marques</option>
                  <optgroup label="Populaires en Afrique de l'Ouest">
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
                className="text-xs text-orange-600 hover:underline mt-1 font-medium"
              >
                {showAllMakes ? 'Voir moins' : 'Voir toutes les marques'}
              </button>
            </div>

            {/* Filtre Modèle */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                Modèle de véhicule
              </label>
              <div className="relative">
                <select
                  value={selectedModel}
                  onChange={e => { setSelectedModel(e.target.value); setCurrentPage(1); }}
                  disabled={!selectedMake}
                  className={`w-full pl-3 pr-8 py-2.5 border-2 rounded-xl text-sm font-medium focus:outline-none transition-colors bg-white appearance-none ${
                    selectedMake
                      ? 'border-gray-200 text-gray-900 cursor-pointer focus:border-orange-400'
                      : 'border-gray-100 text-gray-400 cursor-not-allowed bg-gray-50'
                  }`}
                >
                  <option value="">{selectedMake ? 'Tous les modèles' : 'Choisissez d\'abord une marque'}</option>
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
              {selectedMake && (
                <p className="text-xs text-gray-400 mt-1">{availableModels.length} modèles disponibles</p>
              )}
            </div>

            {/* Filtre Condition */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                Condition
              </label>
              <div className="flex flex-wrap gap-2">
                {CONDITIONS.map(c => (
                  <button
                    key={c}
                    onClick={() => { setSelectedCondition(c); setCurrentPage(1); }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                      selectedCondition === c
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-orange-300 hover:bg-orange-50/40'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chips filtres actifs */}
        {hasFilters && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
            {selectedMake && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-800 rounded-full text-xs font-bold">
                Marque: {selectedMake}
                <button onClick={() => { setSelectedMake(''); setSelectedModel(''); }} className="hover:text-orange-600 cursor-pointer">×</button>
              </span>
            )}
            {selectedModel && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                Modèle: {selectedModel}
                <button onClick={() => setSelectedModel('')} className="hover:text-blue-600 cursor-pointer">×</button>
              </span>
            )}
            {selectedCategory !== 'Toutes' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-xs font-bold">
                Catégorie: {selectedCategory}
                <button onClick={() => setSelectedCategory('Toutes')} className="hover:text-purple-600 cursor-pointer">×</button>
              </span>
            )}
            {selectedCondition !== 'Tous' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                Condition: {selectedCondition}
                <button onClick={() => setSelectedCondition('Tous')} className="hover:text-emerald-600 cursor-pointer">×</button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Grille de produits */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <svg className="w-16 h-16 mx-auto text-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Aucune pièce trouvée</h3>
          <p className="text-sm text-gray-500 mb-4">Essayez de modifier vos filtres ou de réinitialiser la recherche.</p>
          <button
            onClick={resetFilters}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
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
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={img}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
      <div className="mt-10 p-6 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl text-white text-center">
        <h3 className="font-extrabold text-lg mb-1.5">Vous êtes vendeur de pièces auto ?</h3>
        <p className="text-sm text-white/90 mb-4">Rejoignez AutoAfrique et vendez à toute l&apos;Afrique de l&apos;Ouest.</p>
        <Link
          href="/devenir-vendeur"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-colors text-sm"
        >
          Devenir vendeur →
        </Link>
      </div>
    </div>
  );
}
