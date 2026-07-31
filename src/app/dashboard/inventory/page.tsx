'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardTopBar from '@/components/DashboardTopBar';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/contexts/ToastContext';
import Modal from '@/components/Modal';
import BarChart from '@/components/Charts';
import ImageUpload from '@/components/ImageUpload';

const partImages: Record<string, string> = {
  'Moteur': 'https://images.unsplash.com/photo-1763848843613-f8c2ca3a31a1?w=200&h=150&fit=crop',
  'Frein': 'https://images.unsplash.com/photo-1770656505709-fd97236989b9?w=200&h=150&fit=crop',
  'Suspension': 'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=200&h=150&fit=crop',
  'Carrosserie': 'https://images.unsplash.com/photo-1766650189458-bb0e7969ba5d?w=200&h=150&fit=crop',
  'default': 'https://images.unsplash.com/photo-1763848843613-f8c2ca3a31a1?w=200&h=150&fit=crop',
};

export default function InventoryPage() {
  const { t } = useApp();
  const { addToast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [showAdd, setShowAdd] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showBulk, setShowBulk] = useState(false);
  const [bulkValue, setBulkValue] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', reference: '', brand: 'Toyota', model: '',
    category: 'Moteur', price: 0, stock: 0, condition: 'USED',
    yearStart: 2015, yearEnd: 2024, images: [] as string[],
  });
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const ITEMS_PER_PAGE = 12;

  const brands = ['Toyota', 'Peugeot', 'Hyundai', 'Kia', 'Mercedes', 'Renault', 'Nissan', 'Volkswagen'];
  const categories = ['Moteur', 'Frein', 'Suspension', 'Carrosserie', 'Électrique', 'Transmission', 'Échappement', 'Pneumatique', 'Refroidissement', 'Direction'];

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/v1/products?pageSize=200', { credentials: 'include' });
        const data = await res.json();
        if (!cancelled && data.success) setProducts(data.data.data);
      } catch (err) { console.error(err); } finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [refreshKey]);

  const filtered = products.filter(p => {
    const matchSearch = `${p.title} ${p.brand?.name || ''} ${p.reference || ''}`.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'low' && p.stock <= 10 && p.stock > 0) || (filter === 'out' && p.stock === 0) || (filter === 'in' && p.stock > 10);
    const matchBrand = brandFilter === 'all' || p.brand?.name === brandFilter;
    const matchCategory = categoryFilter === 'all' || p.category?.name === categoryFilter;
    return matchSearch && matchFilter && matchBrand && matchCategory;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const formatCFA = (n: number) => new Intl.NumberFormat('fr-FR').format(n);

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Rupture', color: 'text-red-600', bg: 'bg-red-50', dot: 'bg-red-500' };
    if (stock <= 10) return { label: 'Stock bas', color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-500' };
    return { label: 'En stock', color: 'text-emerald-600', bg: 'bg-emerald-50', dot: 'bg-emerald-500' };
  };

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case 'NEW': return { label: 'Neuf', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'USED': return { label: 'Occasion', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'REFURBISHED': return { label: 'Recond.', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      default: return { label: condition, bg: 'bg-gray-50 text-gray-700 border-gray-200' };
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.price) { addToast('error', 'Titre et prix requis'); return; }
    setSaving(true);
    try {
      const url = editProduct ? `/api/v1/products/${editProduct.id}` : '/api/v1/products';
      const method = editProduct ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ ...form, condition: form.condition.toUpperCase(), images: form.images }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      addToast('success', editProduct ? 'Produit modifié !' : 'Produit ajouté !');
      setShowAdd(false); setEditProduct(null);
      setForm({ title: '', description: '', reference: '', brand: 'Toyota', model: '', category: 'Moteur', price: 0, stock: 0, condition: 'USED', yearStart: 2015, yearEnd: 2024, images: [] });
      setRefreshKey(k => k + 1);
    } catch (err: any) { addToast('error', err.message); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return;
    try {
      const res = await fetch(`/api/v1/products/${id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) { addToast('success', 'Produit supprimé'); setRefreshKey(k => k + 1); }
    } catch (err) { addToast('error', 'Erreur suppression'); }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const selectAll = () => {
    if (selected.size === paginated.length) { setSelected(new Set()); } else { setSelected(new Set(paginated.map(p => p.id))); }
  };

  const handleBulkUpdate = async () => {
    const val = Number(bulkValue);
    if (isNaN(val)) return;
    let count = 0;
    for (const id of selected) {
      try {
        await fetch(`/api/v1/products/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
          body: JSON.stringify({ stock: val }),
        });
        count++;
      } catch {}
    }
    addToast('success', `${count} produit${count > 1 ? 's' : ''} mis à jour`);
    setSelected(new Set()); setShowBulk(false); setBulkValue('');
    setRefreshKey(k => k + 1);
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Supprimer ${selected.size} produit${selected.size > 1 ? 's' : ''} ?`)) return;
    let count = 0;
    for (const id of selected) {
      try {
        const res = await fetch(`/api/v1/products/${id}`, { method: 'DELETE', credentials: 'include' });
        if (res.ok) count++;
      } catch {}
    }
    addToast('success', `${count} produit${count > 1 ? 's' : ''} supprimé${count > 1 ? 's' : ''}`);
    setSelected(new Set());
    setRefreshKey(k => k + 1);
  };

  const exportCSV = () => {
    const headers = ['Titre', 'Marque', 'Référence', 'Catégorie', 'Prix', 'Stock', 'Condition'];
    const rows = filtered.map(p => [p.title, p.brand?.name || '', p.reference || '', p.category?.name || '', p.price, p.stock, p.condition]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `inventaire_${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
    addToast('success', 'CSV exporté');
  };

  const openEdit = (p: any) => {
    setEditProduct(p);
    setForm({ title: p.title, description: p.description || '', reference: p.reference || '', brand: p.brand?.name || 'Toyota', model: p.model || '', category: p.category?.slug || 'Moteur', price: p.price, stock: p.stock, condition: p.condition?.toLowerCase() || 'used', yearStart: p.yearStart || 2015, yearEnd: p.yearEnd || 2024, images: p.images || [] });
    setShowAdd(true);
  };

  const categoryStats = categories.map(c => ({ label: c.substring(0, 4), value: products.filter(p => p.category?.name === c || p.category?.slug === c).length, color: 'bg-orange-400' })).filter(d => d.value > 0);

  const stats = [
    { label: 'Total', value: products.length, icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
    ), bg: 'bg-slate-50', text: 'text-slate-600' },
    { label: 'En stock', value: products.filter(p => p.stock > 10).length, icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
    ), bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { label: 'Stock bas', value: products.filter(p => p.stock > 0 && p.stock <= 10).length, icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
    ), bg: 'bg-amber-50', text: 'text-amber-600' },
    { label: 'Rupture', value: products.filter(p => p.stock === 0).length, icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
    ), bg: 'bg-red-50', text: 'text-red-600' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <DashboardTopBar />
        <main className="p-4 lg:p-6 xl:p-8 pb-28 lg:pb-8">

          {/* Page Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{t.inventory.title}</h1>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="font-semibold text-gray-700">{products.length}</span> pièces dans votre inventaire
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={exportCSV}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <span className="hidden sm:inline">Exporter CSV</span>
                </button>
                <button
                  onClick={() => { setEditProduct(null); setShowAdd(true); }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Ajouter
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
            {stats.map(s => (
              <div key={s.label} className={`${s.bg} rounded-2xl p-4 lg:p-5 border border-white/50`}>
                <div className={`flex items-center justify-center w-9 h-9 rounded-xl ${s.text} bg-white/70 mb-3`}>
                  {s.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                <div className="text-xs font-medium text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Category Chart */}
          {categoryStats.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Répartition par catégorie</h3>
              <BarChart data={categoryStats} height={100} format={(n) => `${n}`} />
            </div>
          )}

          {/* Search & Filters Bar */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-3">
              {/* Search */}
              <div className="flex-1 relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
                  placeholder="Rechercher par nom, marque ou référence..."
                />
              </div>

              {/* Filter Selects */}
              <div className="flex flex-wrap gap-2">
                <select
                  value={filter}
                  onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all cursor-pointer"
                >
                  <option value="all">Tout stock</option>
                  <option value="in">En stock (&gt;10)</option>
                  <option value="low">Stock bas (1-10)</option>
                  <option value="out">Rupture (0)</option>
                </select>

                <select
                  value={brandFilter}
                  onChange={(e) => { setBrandFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all cursor-pointer"
                >
                  <option value="all">Toutes marques</option>
                  {brands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all cursor-pointer"
                >
                  <option value="all">Toutes catégories</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                {/* View Toggle */}
                <div className="flex rounded-xl border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-2.5 text-sm transition-all ${viewMode === 'table' ? 'bg-orange-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2.5 text-sm transition-all ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Category Chips */}
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => { setCategoryFilter('all'); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  categoryFilter === 'all'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Toutes
              </button>
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => { setCategoryFilter(c); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    categoryFilter === c
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selected.size > 0 && (
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white text-sm font-bold">
                  {selected.size}
                </div>
                <span className="text-sm font-semibold text-orange-800">
                  produit{selected.size > 1 ? 's' : ''} sélectionné{selected.size > 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowBulk(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-orange-200 text-orange-700 text-xs font-semibold hover:bg-orange-50 transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  Ajuster stock
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  Supprimer
                </button>
                <button
                  onClick={() => setSelected(new Set())}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 transition-all"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
              <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500 text-sm font-medium">Chargement de l&apos;inventaire...</p>
            </div>
          ) : viewMode === 'table' ? (
            /* TABLE VIEW */
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-4 py-3.5 w-10">
                        <input
                          type="checkbox"
                          checked={selected.size === paginated.length && paginated.length > 0}
                          onChange={selectAll}
                          className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500/20"
                        />
                      </th>
                      <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Produit</th>
                      <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Réf</th>
                      <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden xl:table-cell">Catégorie</th>
                      <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Marque</th>
                      <th className="text-right px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Prix</th>
                      <th className="text-center px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                      <th className="text-center px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Cond.</th>
                      <th className="text-right px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginated.map(p => {
                      const stockStatus = getStockStatus(p.stock);
                      const condition = getConditionBadge(p.condition);
                      return (
                        <tr
                          key={p.id}
                          className={`hover:bg-gray-50/50 transition-colors ${selected.has(p.id) ? 'bg-orange-50/50' : ''}`}
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selected.has(p.id)}
                              onChange={() => toggleSelect(p.id)}
                              className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500/20"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.images?.[0] || partImages[p.category?.name] || partImages.default}
                                alt=""
                                className="w-10 h-10 rounded-xl object-cover border border-gray-100 hidden sm:block"
                                loading="lazy"
                              />
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-900 text-sm truncate max-w-[220px]">{p.title}</p>
                                <p className="text-xs text-gray-400 mt-0.5 truncate sm:hidden">{p.brand?.name || ''} {p.model || ''}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500 font-mono hidden lg:table-cell">
                            {p.reference || <span className="text-gray-300">—</span>}
                          </td>
                          <td className="px-4 py-3 hidden xl:table-cell">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 text-xs font-medium text-gray-600">
                              {p.category?.name || '—'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 hidden sm:table-cell">{p.brand?.name || '—'}</td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-sm font-bold text-gray-900">{formatCFA(p.price)}</span>
                            <span className="text-xs text-gray-400 ml-0.5">FCFA</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${stockStatus.dot}`}></span>
                              <span className={`text-sm font-semibold ${stockStatus.color}`}>{p.stock}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center hidden md:table-cell">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${condition.bg}`}>
                              {condition.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => openEdit(p)}
                                className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                title="Modifier"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                              </button>
                              <button
                                onClick={() => handleDelete(p.id)}
                                className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                                title="Supprimer"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filtered.length === 0 && (
                <div className="py-16 px-4 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Aucune pièce trouvée</h3>
                  <p className="text-sm text-gray-500 mb-4">Essayez de modifier vos filtres ou ajoutez un nouveau produit.</p>
                  <button
                    onClick={() => { setEditProduct(null); setShowAdd(true); }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Ajouter un produit
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* GRID VIEW */
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginated.map(p => {
                const stockStatus = getStockStatus(p.stock);
                const condition = getConditionBadge(p.condition);
                return (
                  <div
                    key={p.id}
                    className={`group bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 ${
                      selected.has(p.id) ? 'border-orange-300 ring-2 ring-orange-100' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={p.images?.[0] || partImages[p.category?.name] || partImages.default}
                        alt={p.title}
                        className="w-full h-36 object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <input
                        type="checkbox"
                        checked={selected.has(p.id)}
                        onChange={() => toggleSelect(p.id)}
                        className="absolute top-3 left-3 w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500/20"
                      />
                      <div className={`absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold text-white ${stockStatus.dot.replace('bg-', 'bg-')}`}>
                        <span className={`w-1.5 h-1.5 rounded-full bg-white`}></span>
                        {p.stock}
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => openEdit(p)}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur text-xs font-semibold text-gray-700 hover:bg-white transition-all text-center"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur text-xs font-semibold text-red-600 hover:bg-white transition-all"
                          >
                            Suppr.
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">{p.title}</h3>
                          <p className="text-xs text-gray-400 mt-1">{p.brand?.name} {p.model || ''}</p>
                        </div>
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${condition.bg} shrink-0`}>
                          {condition.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <div>
                          <span className="text-base font-bold text-gray-900">{formatCFA(p.price)}</span>
                          <span className="text-xs text-gray-400 ml-0.5">FCFA</span>
                        </div>
                        <div className={`flex items-center gap-1.5 text-xs font-semibold ${stockStatus.color}`}>
                          <span className={`w-2 h-2 rounded-full ${stockStatus.dot}`}></span>
                          {stockStatus.label}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4 py-16 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Aucune pièce trouvée</h3>
                  <p className="text-sm text-gray-500 mb-4">Essayez de modifier vos filtres ou ajoutez un nouveau produit.</p>
                  <button
                    onClick={() => { setEditProduct(null); setShowAdd(true); }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Ajouter un produit
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {filtered.length > ITEMS_PER_PAGE && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} sur {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let page: number;
                  if (totalPages <= 7) {
                    page = i + 1;
                  } else if (currentPage <= 4) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 3) {
                    page = totalPages - 6 + i;
                  } else {
                    page = currentPage - 3 + i;
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-lg text-xs font-semibold transition-all ${
                        currentPage === page
                          ? 'bg-orange-500 text-white shadow-sm'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          )}

          {/* Mobile FAB */}
          <div className="lg:hidden fixed bottom-6 right-6 z-50">
            <button
              onClick={() => { setEditProduct(null); setShowAdd(true); }}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-xl shadow-orange-500/30 flex items-center justify-center hover:from-orange-600 hover:to-orange-700 transition-all active:scale-95"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            </button>
          </div>

          {/* Add/Edit Modal */}
          <Modal isOpen={showAdd} onClose={() => { setShowAdd(false); setEditProduct(null); }} title={editProduct ? 'Modifier la pièce' : 'Ajouter une pièce'}>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Titre *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all" placeholder="Filtre à huile Toyota Hilux" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Marque</label>
                  <select value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all cursor-pointer">
                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Catégorie</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all cursor-pointer">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Référence OEM</label>
                <input value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all" placeholder="04152-YZZA1" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Prix (FCFA) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all" min="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all" min="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Condition</label>
                  <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all cursor-pointer">
                    <option value="new">Neuf</option>
                    <option value="used">Occasion</option>
                    <option value="refurbished">Recond.</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Année début</label>
                  <input type="number" value={form.yearStart} onChange={(e) => setForm({ ...form, yearStart: Number(e.target.value) })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all" min="1990" max="2030" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Année fin</label>
                  <input type="number" value={form.yearEnd} onChange={(e) => setForm({ ...form, yearEnd: Number(e.target.value) })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all" min="1990" max="2030" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all resize-none" rows={3} placeholder="Description..." />
              </div>
              <ImageUpload images={form.images} onChange={(images) => setForm({ ...form, images })} maxImages={5} />
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={saving} className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                  {saving && <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>}
                  {saving ? 'Enregistrement...' : editProduct ? 'Modifier' : 'Ajouter'}
                </button>
                <button onClick={() => { setShowAdd(false); setEditProduct(null); }} className="px-5 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
                  Annuler
                </button>
              </div>
            </div>
          </Modal>

          {/* Bulk Update Modal */}
          <Modal isOpen={showBulk} onClose={() => setShowBulk(false)} title={`Ajuster le stock (${selected.size} produits)`}>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Définir le stock pour {selected.size} produit{selected.size > 1 ? 's' : ''} sélectionné{selected.size > 1 ? 's' : ''}</p>
              <input
                type="number"
                value={bulkValue}
                onChange={(e) => setBulkValue(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
                min="0"
                placeholder="Nouveau stock"
              />
              <div className="flex gap-3">
                <button onClick={handleBulkUpdate} className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25 transition-all">
                  Appliquer
                </button>
                <button onClick={() => setShowBulk(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
                  Annuler
                </button>
              </div>
            </div>
          </Modal>
        </main>
      </div>
    </div>
  );
}
