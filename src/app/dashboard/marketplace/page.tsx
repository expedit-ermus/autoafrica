'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import DashboardTopBar from '@/components/DashboardTopBar';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/contexts/ToastContext';
import Modal from '@/components/Modal';
import StarRating, { ProductReviews } from '@/components/StarRating';
import {
  BreadcrumbStructuredData,
  ItemListStructuredData,
  ProductStructuredData,
} from '@/components/StructuredData';
import { MARKETPLACE_URL, SITE_URL } from '@/lib/structured-data';
import { Product } from '@/shared/types';
import { track, trackPageView } from '@/lib/tracking';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

interface CartItem {
  id: string;
  productId: string;
  title: string;
  brand: string;
  reference: string;
  price: number;
  quantity: number;
  image: string;
}

const partImages: Record<string, string[]> = {
  'Moteur': [
    'https://images.unsplash.com/photo-1763848843613-f8c2ca3a31a1?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=450&fit=crop',
  ],
  'Frein': [
    'https://images.unsplash.com/photo-1770656505709-fd97236989b9?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=600&h=450&fit=crop',
  ],
  'Suspension': [
    'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1763848843613-f8c2ca3a31a1?w=600&h=450&fit=crop',
  ],
  'Carrosserie': [
    'https://images.unsplash.com/photo-1766650189458-bb0e7969ba5d?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1533833406613-0058ceea5d1a?w=600&h=450&fit=crop',
  ],
  'Électrique': [
    'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=450&fit=crop',
  ],
  'Transmission': [
    'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=450&fit=crop',
  ],
  'default': [
    'https://images.unsplash.com/photo-1763848843613-f8c2ca3a31a1?w=600&h=450&fit=crop',
    'https://images.unsplash.com/photo-1770656505709-fd97236989b9?w=600&h=450&fit=crop',
  ],
};

const relatedSuggestions: Record<string, string[]> = {
  'Moteur': ['Filtre à huile', 'Courroie', 'Bougie', 'Pompe à eau'],
  'Frein': ['Plaquettes', 'Disques', 'Liquide de frein', 'Étrier'],
  'Suspension': ['Amortisseurs', 'Ressorts', 'Rotules', 'Barre stabilisatrice'],
  'Carrosserie': ['Pare-chocs', 'Rétroviseur', 'Phare', 'Calandre'],
};

export default function MarketplacePage() {
  const { t } = useApp();
  const { addToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [conditionFilter, setConditionFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showBuy, setShowBuy] = useState<Product | null>(null);
  const [buying, setBuying] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [detailImageIdx, setDetailImageIdx] = useState(0);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('recentlyViewed');
    return saved ? JSON.parse(saved) : [];
  });
  const [quantity, setQuantity] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const brands = ['Toyota', 'Peugeot', 'Hyundai', 'Kia', 'Mercedes', 'Renault', 'Nissan', 'Volkswagen'];
  const categories = ['Moteur', 'Frein', 'Suspension', 'Carrosserie', 'Électrique', 'Transmission', 'Échappement', 'Pneumatique', 'Refroidissement', 'Direction'];

  const [refreshKey, setRefreshKey] = useState(0);

  useDocumentTitle(
    detailProduct ? detailProduct.title : null,
    'Marketplace — Pièces détachées automobile | AutoAfrique',
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const params = new URLSearchParams();
        if (brandFilter !== 'all') params.set('brand', brandFilter);
        if (categoryFilter !== 'all') params.set('category', categoryFilter);
        if (conditionFilter !== 'all') params.set('condition', conditionFilter);
        if (search) params.set('search', search);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        params.set('page', String(page));
        params.set('pageSize', '12');
        const sortMap: Record<string, { sortBy: string; sortOrder: string }> = {
          newest: { sortBy: 'createdAt', sortOrder: 'desc' },
          price_asc: { sortBy: 'price', sortOrder: 'asc' },
          price_desc: { sortBy: 'price', sortOrder: 'desc' },
          popular: { sortBy: 'views', sortOrder: 'desc' },
        };
        const sort = sortMap[sortBy] || sortMap.newest;
        params.set('sortBy', sort.sortBy);
        params.set('sortOrder', sort.sortOrder);
        const res = await fetch(`/api/v1/products?${params}`);
        const data = await res.json();
        if (!cancelled && data.success) {
          setProducts(data.data.data);
          setTotalPages(data.data.pagination.totalPages);
          setTotal(data.data.pagination.total);
        }
      } catch (err) { console.error(err); } finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [brandFilter, categoryFilter, conditionFilter, sortBy, page, search, minPrice, maxPrice, refreshKey]);

  const handleSearch = () => {
    setPage(1);
    track('search_product', { query: search, results_count: total });
  };

  const firstRender = useRef(true);

  useEffect(() => {
    trackPageView();
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    track('filter_product', {
      filter_type: 'filters',
      filter_value: JSON.stringify({
        brand: brandFilter, category: categoryFilter, condition: conditionFilter, minPrice, maxPrice,
      }),
    });
  }, [brandFilter, categoryFilter, conditionFilter, minPrice, maxPrice]);

  const getImages = (p: Product): string[] => {
    if (Array.isArray(p.images) && p.images.length > 0) return p.images;
    return partImages[p.category?.name || 'default'];
  };

  const openDetail = (p: Product) => {
    setDetailProduct(p);
    setDetailImageIdx(0);
    setQuantity(1);
    track('view_product', {
      entity: 'product', entityId: p.id, product_id: p.id, product_name: p.title, price: p.price,
    });
    const viewed = [p, ...recentlyViewed.filter(v => v.id !== p.id)].slice(0, 6);
    setRecentlyViewed(viewed);
    localStorage.setItem('recentlyViewed', JSON.stringify(viewed));
  };

  const addToCart = (product: Product, qty: number = 1) => {
    track('add_to_cart', {
      entity: 'product', entityId: product.id, product_id: product.id, price: product.price, quantity: qty,
    });
    const saved = localStorage.getItem('cart');
    const cart: CartItem[] = saved ? JSON.parse(saved) : [];
    const existing = cart.find(item => item.productId === product.id);
    if (existing) { existing.quantity += qty; } else {
      cart.push({
        id: Date.now().toString(), productId: product.id, title: product.title,
        brand: product.brand?.name || '', reference: product.reference || '',
        price: product.price, quantity: qty,
        image: getImages(product)[0],
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    addToast('success', `${qty}× ${product.title} ajouté au panier`);
  };

  const confirmBuy = async () => {
    if (!showBuy) return;
    setBuying(true);
    track('checkout_start', { cart_value: showBuy.price * quantity, items_count: 1 });
    try {
      const res = await fetch('/api/v1/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ items: [{ productId: showBuy.id, quantity }], shippingMethod: 'standard' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order failed');
      track('order_complete', {
        entity: 'order', entityId: data.data.orderNumber, order_id: data.data.orderNumber, total: data.data.totalAmount,
      });
      addToast('success', `Commande ${data.data.orderNumber} créée !`);
      setShowBuy(null);
      setDetailProduct(null);
      setRefreshKey(k => k + 1);
    } catch (err) { addToast('error', err instanceof Error ? err.message : 'Erreur'); } finally { setBuying(false); }
  };

  const formatCFA = (n: number) => new Intl.NumberFormat('fr-FR').format(n);
  const clearFilters = () => {
    setSearch(''); setBrandFilter('all'); setCategoryFilter('all');
    setConditionFilter('all'); setSortBy('newest'); setMinPrice(''); setMaxPrice(''); setPage(1);
  };
  const hasFilters = search || brandFilter !== 'all' || categoryFilter !== 'all' || conditionFilter !== 'all' || minPrice || maxPrice;

  const activeFilterChips = () => {
    const chips: { label: string; onRemove: () => void }[] = [];
    if (search) chips.push({ label: `"${search}"`, onRemove: () => { setSearch(''); setPage(1); } });
    if (brandFilter !== 'all') chips.push({ label: brandFilter, onRemove: () => { setBrandFilter('all'); setPage(1); } });
    if (categoryFilter !== 'all') chips.push({ label: categoryFilter, onRemove: () => { setCategoryFilter('all'); setPage(1); } });
    if (conditionFilter !== 'all') chips.push({ label: conditionFilter === 'NEW' ? 'Neuf' : conditionFilter === 'USED' ? 'Occasion' : 'Reconditionné', onRemove: () => { setConditionFilter('all'); setPage(1); } });
    if (minPrice) chips.push({ label: `Min ${minPrice} FCFA`, onRemove: () => { setMinPrice(''); setPage(1); } });
    if (maxPrice) chips.push({ label: `Max ${maxPrice} FCFA`, onRemove: () => { setMaxPrice(''); setPage(1); } });
    return chips;
  };

  const ProductCard = ({ p }: { p: Product }) => {
    const imgs = getImages(p);
    return (
      <div
        className="group bg-white rounded-2xl border border-gray-100/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
        onClick={() => openDetail(p)}
      >
        <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          <Image
            src={imgs[0]}
            alt={p.title}
            fill
            sizes="(max-width: 640px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-[11px] font-semibold text-gray-700 shadow-sm">
            {p.brand?.name || 'Pièce'}
          </span>
          <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[11px] font-semibold backdrop-blur-sm shadow-sm ${
            p.condition === 'NEW' ? 'bg-emerald-500/90 text-white' :
            p.condition === 'USED' ? 'bg-amber-500/90 text-white' :
            'bg-sky-500/90 text-white'
          }`}>
            {p.condition === 'NEW' ? 'Neuf' : p.condition === 'USED' ? 'Occasion' : 'Reconditionné'}
          </span>
          {imgs.length > 1 && (
            <div className="absolute bottom-3 right-3 flex gap-1">
              {imgs.map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === 0 ? 'bg-white' : 'bg-white/40'}`} />
              ))}
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 mb-1 group-hover:text-orange-600 transition-colors">
            {p.title}
          </h3>
          {p.reference && (
            <p className="text-[11px] text-gray-400 font-mono mb-1">Réf: {p.reference}</p>
          )}
          <p className="text-[11px] text-gray-500 mb-2">{p.category?.name || ''}</p>

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${
                p.stock > 5 ? 'bg-emerald-500' : p.stock > 0 ? 'bg-amber-500' : 'bg-red-400'
              }`} />
              <span className={`text-[11px] font-medium ${
                p.stock > 5 ? 'text-emerald-600' : p.stock > 0 ? 'text-amber-600' : 'text-red-500'
              }`}>
                {p.stock > 5 ? 'En stock' : p.stock > 0 ? `${p.stock} restant${p.stock > 1 ? 's' : ''}` : 'Rupture'}
              </span>
            </div>
            {(p.views || 0) > 0 && (
              <span className="text-[10px] text-gray-400">{p.views} vues</span>
            )}
          </div>

          {(p._avgRating || 0) > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              <StarRating rating={p._avgRating || 0} size="sm" />
              <span className="text-[10px] text-gray-400">({p._reviewCount || 0})</span>
            </div>
          )}

          <div className="mt-auto">
            <p className="text-lg font-extrabold text-gray-900 mb-1">
              {formatCFA(p.price)} <span className="text-xs font-normal text-gray-400">FCFA</span>
            </p>
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => addToCart(p)}
                className="flex items-center justify-center gap-1.5 flex-1 px-3 py-2.5 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-all duration-200 text-xs font-semibold"
                title="Ajouter au panier"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                Ajouter
              </button>
              <button
                onClick={() => { setShowBuy(p); setQuantity(1); }}
                className="flex-1 px-3 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transition-all duration-200 text-xs font-semibold shadow-sm hover:shadow-md text-center"
              >
                Acheter
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ProductListCard = ({ p }: { p: Product }) => {
    const imgs = getImages(p);
    return (
      <div
        className="group bg-white rounded-2xl border border-gray-100/80 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-row"
        onClick={() => openDetail(p)}
      >
        <div className="relative w-48 min-h-[140px] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex-shrink-0">
          <Image src={imgs[0]} alt={p.title} fill sizes="192px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-sm text-[10px] font-semibold text-gray-700">
            {p.brand?.name || 'Pièce'}
          </span>
          <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-semibold backdrop-blur-sm ${
            p.condition === 'NEW' ? 'bg-emerald-500/90 text-white' :
            p.condition === 'USED' ? 'bg-amber-500/90 text-white' :
            'bg-sky-500/90 text-white'
          }`}>
            {p.condition === 'NEW' ? 'Neuf' : p.condition === 'USED' ? 'Occasion' : 'Reconditionné'}
          </span>
        </div>
        <div className="p-4 flex flex-col flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-1 group-hover:text-orange-600 transition-colors">{p.title}</h3>
          <p className="text-[11px] text-gray-500 mt-0.5">{p.category?.name || ''} {p.reference ? `• Réf: ${p.reference}` : ''}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`w-2 h-2 rounded-full ${p.stock > 5 ? 'bg-emerald-500' : p.stock > 0 ? 'bg-amber-500' : 'bg-red-400'}`} />
            <span className={`text-[11px] font-medium ${p.stock > 5 ? 'text-emerald-600' : p.stock > 0 ? 'text-amber-600' : 'text-red-500'}`}>
              {p.stock > 5 ? 'En stock' : p.stock > 0 ? `${p.stock} restant${p.stock > 1 ? 's' : ''}` : 'Rupture'}
            </span>
            {(p._avgRating || 0) > 0 && <div className="ml-2"><StarRating rating={p._avgRating || 0} size="sm" /></div>}
          </div>
          <div className="flex items-center justify-between mt-auto pt-2">
            <p className="text-lg font-extrabold text-gray-900">{formatCFA(p.price)} <span className="text-xs font-normal text-gray-400">FCFA</span></p>
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => addToCart(p)} className="px-3 py-2 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition text-xs font-semibold">Panier</button>
              <button onClick={() => { setShowBuy(p); setQuantity(1); }} className="px-3 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transition text-xs font-semibold">Acheter</button>
            </div>
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
        <div className="flex items-center gap-2">
          <div className="h-3 bg-gray-200 rounded-lg w-16" />
          <div className="h-3 bg-gray-200 rounded-lg w-12" />
        </div>
        <div className="h-6 bg-gray-200 rounded-lg w-1/3" />
        <div className="flex gap-2">
          <div className="h-10 bg-gray-200 rounded-xl flex-1" />
          <div className="h-10 bg-gray-200 rounded-xl flex-1" />
        </div>
      </div>
    </div>
  );

  const chips = activeFilterChips();

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <DashboardTopBar />
        <main className="p-4 lg:p-8 pb-24 lg:pb-8 max-w-[1600px] mx-auto">
          <BreadcrumbStructuredData items={[{ name: 'AutoAfrique', url: SITE_URL }, { name: 'Marketplace', url: MARKETPLACE_URL }]} />

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                  {t.marketplace.title}
                </h1>
                <p className="text-gray-500 mt-1 text-sm">{t.marketplace.subtitle}</p>
              </div>
              <div className="hidden md:flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Paiement sécurisé
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Vendeurs vérifiés
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-100 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  Livraison 10 pays
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex gap-3">
              <div className="flex-1 relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all shadow-sm"
                  placeholder="Rechercher une pièce (référence, marque, modèle)..."
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm hover:from-orange-600 hover:to-amber-600 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
              >
                Rechercher
              </button>
            </div>
          </div>

          {/* Mobile Filter Chips */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-4 -mx-4 px-4 scrollbar-hide">
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                showFilters ? 'bg-orange-500 text-white border-orange-500 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
              }`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              Filtres
              {hasFilters && <span className="w-5 h-5 rounded-full bg-orange-600 text-white text-[10px] flex items-center justify-center">!</span>}
            </button>
            {brandFilter !== 'all' && (
              <button onClick={() => { setBrandFilter('all'); setPage(1); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-orange-50 text-orange-600 text-xs font-medium whitespace-nowrap border border-orange-200 hover:bg-orange-100 transition">
                {brandFilter}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
            {categoryFilter !== 'all' && (
              <button onClick={() => { setCategoryFilter('all'); setPage(1); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-blue-50 text-blue-600 text-xs font-medium whitespace-nowrap border border-blue-200 hover:bg-blue-100 transition">
                {categoryFilter}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
            {conditionFilter !== 'all' && (
              <button onClick={() => { setConditionFilter('all'); setPage(1); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-purple-50 text-purple-600 text-xs font-medium whitespace-nowrap border border-purple-200 hover:bg-purple-100 transition">
                {conditionFilter === 'NEW' ? 'Neuf' : conditionFilter === 'USED' ? 'Occasion' : 'Reconditionné'}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
            {chips.filter(c => !['brandFilter', 'categoryFilter', 'conditionFilter'].includes(c.label)).map((chip, i) => (
              <button key={i} onClick={chip.onRemove}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gray-100 text-gray-600 text-xs font-medium whitespace-nowrap border border-gray-200 hover:bg-gray-200 transition">
                {chip.label}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            ))}
          </div>

          <div className="flex gap-6">

            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-5">
                {/* Filter Header */}
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-sm">Filtres</h3>
                  {hasFilters && (
                    <button onClick={clearFilters} className="text-xs text-orange-500 hover:text-orange-600 font-medium transition-colors">
                      Tout effacer
                    </button>
                  )}
                </div>

                {/* Brand */}
                <div className="bg-white rounded-2xl border border-gray-100/80 p-4 shadow-sm">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Marque</h4>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    <button
                      onClick={() => { setBrandFilter('all'); setPage(1); }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                        brandFilter === 'all' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      Toutes les marques
                    </button>
                    {brands.map(b => (
                      <button
                        key={b}
                        onClick={() => { setBrandFilter(b); setPage(1); }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                          brandFilter === b ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div className="bg-white rounded-2xl border border-gray-100/80 p-4 shadow-sm">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Catégorie</h4>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    <button
                      onClick={() => { setCategoryFilter('all'); setPage(1); }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                        categoryFilter === 'all' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      Toutes les catégories
                    </button>
                    {categories.map(c => (
                      <button
                        key={c}
                        onClick={() => { setCategoryFilter(c); setPage(1); }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                          categoryFilter === c ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Condition */}
                <div className="bg-white rounded-2xl border border-gray-100/80 p-4 shadow-sm">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">État</h4>
                  <div className="space-y-1.5">
                    {[
                      { value: 'all', label: 'Tous les états' },
                      { value: 'NEW', label: 'Neuf' },
                      { value: 'USED', label: 'Occasion' },
                      { value: 'REFURBISHED', label: 'Reconditionné' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => { setConditionFilter(opt.value); setPage(1); }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                          conditionFilter === opt.value ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="bg-white rounded-2xl border border-gray-100/80 p-4 shadow-sm">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Fourchette de prix</h4>
                  <div className="space-y-3">
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="Prix minimum (FCFA)"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
                    />
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="Prix maximum (FCFA)"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
                    />
                    <button
                      onClick={() => setPage(1)}
                      className="w-full px-4 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors"
                    >
                      Appliquer le prix
                    </button>
                  </div>
                </div>

                {/* Active Filters */}
                {hasFilters && chips.length > 0 && (
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-100 p-4">
                    <h4 className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-3">Filtres actifs</h4>
                    <div className="flex flex-wrap gap-2">
                      {chips.map((chip, i) => (
                        <button
                          key={i}
                          onClick={chip.onRemove}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/80 text-orange-700 text-[11px] font-medium border border-orange-200 hover:bg-white transition"
                        >
                          {chip.label}
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Mobile Filter Panel */}
              {showFilters && (
                <div className="lg:hidden mb-4 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100/80 p-5 shadow-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 text-sm">Filtres avancés</h3>
                    {hasFilters && (
                      <button onClick={clearFilters} className="text-xs text-orange-500 hover:text-orange-600 font-medium">Tout effacer</button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <select value={brandFilter} onChange={(e) => { setBrandFilter(e.target.value); setPage(1); }}
                      className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20">
                      <option value="all">Toutes marques</option>
                      {brands.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                      className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20">
                      <option value="all">Toutes catégories</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select value={conditionFilter} onChange={(e) => { setConditionFilter(e.target.value); setPage(1); }}
                      className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20">
                      <option value="all">Tous états</option>
                      <option value="NEW">Neuf</option>
                      <option value="USED">Occasion</option>
                      <option value="REFURBISHED">Reconditionné</option>
                    </select>
                    <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Prix min"
                      className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
                    <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Prix max"
                      className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
                    <button onClick={() => { setPage(1); setShowFilters(false); }}
                      className="px-4 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors">
                      Appliquer
                    </button>
                  </div>
                </div>
              )}

              {/* Toolbar */}
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-900">{total}</span> pièce{total !== 1 ? 's' : ''} trouvée{total !== 1 ? 's' : ''}
                </p>
                <div className="flex items-center gap-3">
                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                    className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
                  >
                    <option value="newest">Plus récents</option>
                    <option value="price_asc">Prix croissant</option>
                    <option value="price_desc">Prix décroissant</option>
                    <option value="popular">Populaires</option>
                  </select>
                  {/* View Toggle */}
                  <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-orange-50 text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                      title="Vue grille"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-orange-50 text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                      title="Vue liste"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className={viewMode === 'grid' ? 'grid sm:grid-cols-2 xl:grid-cols-3 gap-5' : 'space-y-4'}>
                  {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
                </div>
              ) : products.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune pièce trouvée</h3>
                  <p className="text-gray-500 mb-6 max-w-sm">
                    Essayez de modifier vos filtres ou votre recherche pour trouver ce que vous cherchez.
                  </p>
                  {hasFilters && (
                    <button
                      onClick={clearFilters}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm hover:from-orange-600 hover:to-amber-600 transition-all shadow-md hover:shadow-lg"
                    >
                      Effacer tous les filtres
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Product Grid / List */}
                  <div className={viewMode === 'grid'
                    ? 'grid sm:grid-cols-2 xl:grid-cols-3 gap-5'
                    : 'space-y-4'
                  }>
                    {products.map(p =>
                      viewMode === 'grid'
                        ? <ProductCard key={p.id} p={p} />
                        : <ProductListCard key={p.id} p={p} />
                    )}
                  </div>

                  <ItemListStructuredData items={products.map(() => ({ url: MARKETPLACE_URL }))} />

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2.5 rounded-xl text-sm font-medium bg-white border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-all shadow-sm"
                      >
                        ← Préc
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                        const num = start + i;
                        if (num > totalPages) return null;
                        return (
                          <button
                            key={num}
                            onClick={() => setPage(num)}
                            className={`w-10 h-10 rounded-xl text-sm font-medium transition-all shadow-sm ${
                              page === num
                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            {num}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2.5 rounded-xl text-sm font-medium bg-white border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-all shadow-sm"
                      >
                        Suiv →
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* Recently Viewed */}
              {recentlyViewed.length > 0 && !loading && (
                <div className="mt-12">
                  <h2 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Récemment consulté</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {recentlyViewed.map(p => (
                      <div
                        key={p.id}
                        className="bg-white rounded-xl border border-gray-100/80 p-3 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                        onClick={() => openDetail(p)}
                      >
                        <div className="relative h-20 overflow-hidden rounded-lg mb-2">
                          <Image
                            src={getImages(p)[0]}
                            alt={p.title}
                            fill
                            sizes="(max-width: 640px) 50vw, 16vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <p className="text-xs font-bold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">{p.title}</p>
                        <p className="text-xs font-bold text-orange-600 mt-1">{formatCFA(p.price)} FCFA</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Detail Modal */}
          <Modal isOpen={!!detailProduct} onClose={() => setDetailProduct(null)} title="">
            {detailProduct && (() => {
              const imgs = getImages(detailProduct);
              const related = relatedSuggestions[detailProduct.category?.name || ''] || [];
              return (
                <div className="space-y-4">
                  <ProductStructuredData
                    name={detailProduct.title}
                    description={detailProduct.description}
                    image={imgs[0]}
                    brand={detailProduct.brand?.name}
                    price={detailProduct.price}
                    currency={detailProduct.currency || 'XOF'}
                    seller={detailProduct.seller?.shopName || detailProduct.seller?.firstName || undefined}
                  />
                  <div className="relative h-64 rounded-xl overflow-hidden bg-gray-100">
                    <Image src={imgs[detailImageIdx]} alt={detailProduct.title} fill sizes="100vw" className="object-cover" />
                    {imgs.length > 1 && (
                      <>
                        <button onClick={() => setDetailImageIdx(i => (i - 1 + imgs.length) % imgs.length)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition">←</button>
                        <button onClick={() => setDetailImageIdx(i => (i + 1) % imgs.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition">→</button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {imgs.map((_, i) => <div key={i} className={`w-2 h-2 rounded-full transition ${i === detailImageIdx ? 'bg-white' : 'bg-white/40'}`}></div>)}
                        </div>
                      </>
                    )}
                    <span className={`absolute top-3 right-3 badge text-xs ${detailProduct.condition === 'NEW' ? 'bg-green-500 text-white' : detailProduct.condition === 'USED' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'}`}>
                      {detailProduct.condition === 'NEW' ? 'Neuf' : detailProduct.condition === 'USED' ? 'Occasion' : 'Reconditionné'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900">{detailProduct.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{detailProduct.brand?.name} • {detailProduct.category?.name}</p>
                    {detailProduct.reference && <p className="text-xs text-gray-400 font-mono mt-1">Réf: {detailProduct.reference}</p>}
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="text-2xl font-extrabold text-orange-600">{formatCFA(detailProduct.price)} FCFA</p>
                    <span className={`text-sm font-medium ${detailProduct.stock > 5 ? 'text-green-600' : detailProduct.stock > 0 ? 'text-orange-500' : 'text-red-500'}`}>
                      {detailProduct.stock > 5 ? '✓ En stock' : detailProduct.stock > 0 ? `⚡ ${detailProduct.stock} restant${detailProduct.stock > 1 ? 's' : ''}` : '✕ Rupture'}
                    </span>
                  </div>

                  {detailProduct.seller && (
                    <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">
                        {(detailProduct.seller.firstName || 'V')[0]}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">{detailProduct.seller.shopName || `${detailProduct.seller.firstName} ${detailProduct.seller.lastName || ''}`}</p>
                        <p className="text-xs text-gray-500">📍 {detailProduct.seller.country}</p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => { const phone = detailProduct.seller?.phone || '+22507080910'; window.open(`tel:${phone}`, '_self'); }}
                          className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm">📞</button>
                        <button onClick={() => { const phone = detailProduct.seller?.phone || '+22507080910'; const msg = encodeURIComponent(`Bonjour, je suis intéressé par ${detailProduct.title}`); window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank'); }}
                          className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center text-sm">💬</button>
                      </div>
                    </div>
                  )}

                  {detailProduct.description && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs font-medium text-gray-500 mb-1">Description</p>
                      <p className="text-sm text-gray-700">{detailProduct.description}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700">Qté:</label>
                    <div role="group" aria-label="Quantité" className="flex items-center border border-gray-200 rounded-xl">
                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-l-xl">-</button>
                      <span className="w-10 text-center text-sm font-bold">{quantity}</span>
                      <button onClick={() => setQuantity(q => Math.min(detailProduct.stock, q + 1))} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-r-xl">+</button>
                    </div>
                    <span className="text-sm text-gray-500">{formatCFA(detailProduct.price * quantity)} FCFA</span>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => { addToCart(detailProduct, quantity); setDetailProduct(null); }}
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-orange-500 text-orange-600 font-bold text-sm hover:bg-orange-50 transition text-center">
                      🛒 Ajouter au panier
                    </button>
                    <button onClick={() => { setShowBuy(detailProduct); setDetailProduct(null); }} disabled={detailProduct.stock === 0}
                      className="flex-1 btn-primary text-sm !py-3 text-center disabled:opacity-50">
                      Acheter maintenant
                    </button>
                  </div>

                  {related.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-2">Pièces similaires</p>
                      <div className="flex flex-wrap gap-2">
                        {related.map((r: string) => (
                          <span key={r} className="px-3 py-1.5 rounded-full bg-gray-100 text-xs text-gray-600 hover:bg-orange-50 hover:text-orange-600 cursor-pointer transition">{r}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t border-gray-100 pt-4 mt-2">
                    <h4 className="font-bold text-gray-900 text-sm mb-3">Avis clients</h4>
                    <ProductReviews productId={detailProduct.id} />
                  </div>
                </div>
              );
            })()}
          </Modal>

          {/* Quick Buy Modal */}
          <Modal isOpen={!!showBuy} onClose={() => setShowBuy(null)} title="Acheter cette pièce">
            {showBuy && (
              <div className="space-y-4">
                <div className="bg-orange-50 rounded-xl p-4 text-center">
                  <p className="font-bold text-gray-900 text-lg">{showBuy.title}</p>
                  <p className="text-xs text-gray-500 mt-1">Réf: {showBuy.reference || 'N/A'} • {showBuy.brand?.name}</p>
                  <p className="text-2xl font-extrabold text-orange-600 mt-2">{formatCFA(showBuy.price * quantity)} FCFA</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700">🛡️ Paiement sécurisé. Les fonds seront libérés après confirmation de livraison.</div>
                <div className="space-y-2">
                  <p className="text-sm font-bold text-gray-700">Moyen de paiement :</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[{ name: 'Orange Money', color: '#FF6600', icon: 'OM' }, { name: 'MTN MoMo', color: '#FFCC00', icon: 'MTN' }, { name: 'Wave', color: '#00B4D8', icon: 'W' }, { name: 'Moov Money', color: '#0066CC', icon: 'M' }].map(pm => (
                      <button key={pm.name} className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-orange-300 transition">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold" style={{ background: pm.color }}>{pm.icon}</div>
                        <span className="text-sm font-medium">{pm.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={confirmBuy} disabled={buying} className="btn-primary w-full text-center !py-3 disabled:opacity-50">
                  {buying ? 'Commande en cours...' : `Payer ${formatCFA(showBuy.price * quantity)} FCFA`}
                </button>
              </div>
            )}
          </Modal>
        </main>
      </div>
    </div>
  );
}
