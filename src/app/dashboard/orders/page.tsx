'use client';
import { useState, useEffect, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardTopBar from '@/components/DashboardTopBar';
import { useToast } from '@/contexts/ToastContext';
import Modal from '@/components/Modal';
import { Order } from '@/shared/types';

const TRACKING_STEPS = [
  { key: 'PENDING', label: 'Commande reçue', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
  ) },
  { key: 'CONFIRMED', label: 'Confirmée', color: 'text-blue-600', bg: 'bg-blue-100', icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
  ) },
  { key: 'PAID', label: 'Payée', color: 'text-green-600', bg: 'bg-green-100', icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
  ) },
  { key: 'SHIPPED', label: 'Expédiée', color: 'text-purple-600', bg: 'bg-purple-100', icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25" /></svg>
  ) },
  { key: 'DELIVERED', label: 'Livrée', color: 'text-green-600', bg: 'bg-green-100', icon: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
  ) },
];

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  PENDING:     { label: 'En attente',   bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400' },
  CONFIRMED:   { label: 'Confirmée',    bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-400' },
  PAID:        { label: 'Payée',        bg: 'bg-green-50',   text: 'text-green-700',   dot: 'bg-green-400' },
  PROCESSING:  { label: 'En cours',     bg: 'bg-purple-50',  text: 'text-purple-700',  dot: 'bg-purple-400' },
  SHIPPED:     { label: 'Expédiée',     bg: 'bg-violet-50',  text: 'text-violet-700',  dot: 'bg-violet-400' },
  DELIVERED:   { label: 'Livrée',       bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  COMPLETED:   { label: 'Terminée',     bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  CANCELLED:   { label: 'Annulée',      bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-400' },
};

const PAYMENT_STATUS: Record<string, { label: string; bg: string; text: string }> = {
  PENDING:   { label: 'En attente', bg: 'bg-amber-50',  text: 'text-amber-600' },
  PAID:      { label: 'Payé',       bg: 'bg-green-50',  text: 'text-green-600' },
  FAILED:    { label: 'Échoué',     bg: 'bg-red-50',    text: 'text-red-600' },
  REFUNDED:  { label: 'Remboursé',  bg: 'bg-gray-50',   text: 'text-gray-600' },
};

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

export default function OrdersPage() {
  const { addToast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // New state for search, date range, pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const params = new URLSearchParams();
        if (filter !== 'all') params.set('status', filter);
        const res = await fetch(`/api/v1/orders?${params}`, { credentials: 'include' });
        const data = await res.json();
        if (!cancelled && data.success) setOrders(data.data.data as Order[]);
      } catch (err) { console.error(err); } finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [filter, refreshKey]);

  const formatCFA = (n: number) => new Intl.NumberFormat('fr-FR').format(n);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/v1/orders/${orderId}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      addToast('success', `Commande mise à jour: ${STATUS_CONFIG[status]?.label || status}`);
      setRefreshKey(k => k + 1);
    } catch (err) { addToast('error', err instanceof Error ? err.message : 'Erreur'); }
  };

  // Derived stats
  const totalRevenue = orders
    .filter(o => o.status === 'DELIVERED' || o.status === 'COMPLETED' || o.status === 'PAID')
    .reduce((s, o) => s + (o.totalAmount || o.total || 0), 0);
  const pendingCount = orders.filter(o => o.status === 'PENDING').length;
  const shippedCount = orders.filter(o => o.status === 'SHIPPED').length;

  const getTrackingIndex = (status: string) => {
    const idx = TRACKING_STEPS.findIndex(s => s.key === status);
    return idx >= 0 ? idx : -1;
  };

  // Filtered and searched orders
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Search by order ID or customer name/phone
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(o =>
        (o.orderNumber && String(o.orderNumber).toLowerCase().includes(q)) ||
        (o.id && String(o.id).toLowerCase().includes(q)) ||
        (o.buyer?.firstName && o.buyer.firstName.toLowerCase().includes(q)) ||
        (o.buyer?.lastName && o.buyer.lastName.toLowerCase().includes(q)) ||
        (o.buyer?.phone && o.buyer.phone.includes(q)) ||
        (o.buyer?.email && o.buyer.email.toLowerCase().includes(q))
      );
    }

    // Date range filter
    if (dateFrom) {
      const from = new Date(dateFrom);
      from.setHours(0, 0, 0, 0);
      result = result.filter(o => new Date(o.createdAt) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      result = result.filter(o => new Date(o.createdAt) <= to);
    }

    return result;
  }, [orders, searchQuery, dateFrom, dateTo]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  const showingFrom = filteredOrders.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const showingTo = Math.min(currentPage * itemsPerPage, filteredOrders.length);

  // Reset to page 1 when filters change
  const filtersKey = `${searchQuery}|${dateFrom}|${dateTo}|${filter}|${itemsPerPage}`;
  const [prevFiltersKey, setPrevFiltersKey] = useState(filtersKey);
  if (filtersKey !== prevFiltersKey) {
    setPrevFiltersKey(filtersKey);
    setCurrentPage(1);
  }

  // Status filter counts
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length };
    orders.forEach(o => { counts[o.status] = (counts[o.status] || 0) + 1; });
    return counts;
  }, [orders]);

  const filterButtons = [
    { key: 'all', label: 'Toutes' },
    { key: 'PENDING', label: 'En attente' },
    { key: 'CONFIRMED', label: 'Confirmées' },
    { key: 'SHIPPED', label: 'Expédiées' },
    { key: 'DELIVERED', label: 'Livrées' },
    { key: 'CANCELLED', label: 'Annulées' },
  ];

  return (
    <div className="flex min-h-screen bg-warm">
      <Sidebar />
      <div className="flex-1 min-w-0 lg:ml-[260px]">
        <DashboardTopBar />
        <main className="p-4 lg:p-8 pb-24 lg:pb-8 max-w-7xl mx-auto">

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Commandes</h1>
                <p className="mt-1 text-sm text-gray-500">
                  {filteredOrders.length} commande{filteredOrders.length !== 1 ? 's' : ''} trouvée{filteredOrders.length !== 1 ? 's' : ''}
                  {searchQuery && <span className="text-orange-500 font-medium"> — Recherche active</span>}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Revenus totaux</p>
                  <p className="text-xl font-bold text-gray-900">{formatCFA(totalRevenue)} <span className="text-sm font-normal text-gray-400">FCFA</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {[
              { label: 'Total', value: orders.length, color: 'from-blue-500 to-blue-600', icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
              ) },
              { label: 'En attente', value: pendingCount, color: 'from-amber-500 to-amber-600', icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              ) },
              { label: 'En transit', value: shippedCount, color: 'from-violet-500 to-violet-600', icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25" /></svg>
              ) },
              { label: 'Revenus', value: formatCFA(totalRevenue), suffix: ' FCFA', color: 'from-emerald-500 to-emerald-600', icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              ) },
            ].map(s => (
              <div key={s.label} className="card-modern p-4 sm:p-5 flex items-center gap-4">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-sm shrink-0`}>{s.icon}</div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                  <p className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight truncate">{s.value}{s.suffix && <span className="text-sm font-normal text-gray-400 ml-1">{s.suffix}</span>}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filters Bar */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 space-y-4">
            {/* Status Chips */}
            <div className="flex flex-wrap gap-2">
              {filterButtons.map(btn => {
                const isActive = filter === btn.key;
                const count = statusCounts[btn.key] || 0;
                return (
                  <button
                    key={btn.key}
                    onClick={() => setFilter(btn.key)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${isActive
                        ? 'bg-orange-500 text-white shadow-sm shadow-orange-200'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                  >
                    {btn.label}
                    {count > 0 && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${isActive ? 'bg-white/20 text-white' : 'bg-gray-200/80 text-gray-500'}`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Search + Date Range */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  aria-label="Rechercher une commande"
                  placeholder="Rechercher par ID, client, téléphone..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <input
                    type="date"
                    aria-label="Date de début"
                    value={dateFrom}
                    onChange={e => setDateFrom(e.target.value)}
                    className="w-full sm:w-[150px] px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition"
                    placeholder="Du"
                  />
                </div>
                <span className="flex items-center text-gray-400 text-sm">à</span>
                <div className="relative">
                  <input
                    type="date"
                    aria-label="Date de fin"
                    value={dateTo}
                    onChange={e => setDateTo(e.target.value)}
                    className="w-full sm:w-[150px] px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition"
                    placeholder="Au"
                  />
                </div>
                {(dateFrom || dateTo) && (
                  <button onClick={() => { setDateFrom(''); setDateTo(''); }} className="px-2.5 py-2.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition" title="Effacer les dates">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="bg-white rounded-xl h-16 animate-pulse flex items-center gap-4 px-5 border border-gray-100">
                  <div className="w-16 h-4 bg-gray-200 rounded"></div>
                  <div className="flex-1 h-4 bg-gray-200 rounded"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  <div className="w-16 h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-xl border border-gray-100 py-16 px-6 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-5">
                <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {searchQuery || dateFrom || dateTo ? 'Aucun résultat' : 'Aucune commande'}
              </h3>
              <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                {searchQuery || dateFrom || dateTo
                  ? 'Aucune commande ne correspond à vos critères de recherche. Essayez de modifier vos filtres.'
                  : 'Les commandes apparaîtront ici une fois que les clients commenceront à acheter.'}
              </p>
              {(searchQuery || dateFrom || dateTo) ? (
                <button
                  onClick={() => { setSearchQuery(''); setDateFrom(''); setDateTo(''); }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Effacer les filtres
                </button>
              ) : (
                <a href="/dashboard/inventory" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition shadow-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Commencer à vendre
                </a>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block bg-white rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Commande</th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Client</th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Montant</th>
                      <th className="text-center px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Statut</th>
                      <th className="text-center px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Paiement</th>
                      <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginatedOrders.map(order => {
                      const st = STATUS_CONFIG[order.status] || { label: order.status, bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-400' };
                      const ps = PAYMENT_STATUS[order.paymentStatus || ''] || (order.status === 'PAID' || order.status === 'DELIVERED' || order.status === 'COMPLETED'
                        ? PAYMENT_STATUS.PAID
                        : PAYMENT_STATUS.PENDING);
                      return (
                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors duration-150 group">
                          <td className="px-5 py-3.5">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="font-semibold text-gray-900 hover:text-orange-600 transition-colors"
                            >
                              #{order.orderNumber || order.id?.slice(0, 8)}
                            </button>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-xs font-bold text-orange-700 shrink-0">
                                {(order.buyer?.firstName || 'C')[0]}{(order.buyer?.lastName || '')[0]}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{order.buyer?.firstName} {order.buyer?.lastName}</p>
                                <p className="text-xs text-gray-400 truncate">{order.buyer?.phone || order.buyer?.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="text-sm text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <span className="text-sm font-bold text-gray-900">{formatCFA(order.totalAmount || order.total || 0)} <span className="text-xs font-normal text-gray-400">FCFA</span></span>
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${st.bg} ${st.text}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}></span>
                              {st.label}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${ps.bg} ${ps.text}`}>
                              {ps.label}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {order.status === 'PENDING' && (
                                <>
                                  <button
                                    onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')}
                                    className="px-2.5 py-1.5 rounded-md bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition inline-flex items-center gap-1"
                                    title="Confirmer"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                    Confirmer
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                                    className="px-2 py-1.5 rounded-md bg-red-50 text-red-500 text-xs font-medium hover:bg-red-100 transition inline-flex items-center justify-center"
                                    title="Annuler"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                  </button>
                                </>
                              )}
                              {order.status === 'CONFIRMED' && (
                                <button
                                  onClick={() => handleUpdateStatus(order.id, 'PAID')}
                                  className="px-2.5 py-1.5 rounded-md bg-green-50 text-green-600 text-xs font-medium hover:bg-green-100 transition inline-flex items-center gap-1"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                  Marquer payée
                                </button>
                              )}
                              {order.status === 'PAID' && (
                                <button
                                  onClick={() => handleUpdateStatus(order.id, 'SHIPPED')}
                                  className="px-2.5 py-1.5 rounded-md bg-violet-50 text-violet-600 text-xs font-medium hover:bg-violet-100 transition inline-flex items-center gap-1"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25" /></svg>
                                  Expédier
                                </button>
                              )}
                              {order.status === 'SHIPPED' && (
                                <button
                                  onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                                  className="px-2.5 py-1.5 rounded-md bg-emerald-50 text-emerald-600 text-xs font-medium hover:bg-emerald-100 transition inline-flex items-center gap-1"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                  Marquer livrée
                                </button>
                              )}
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="px-2.5 py-1.5 rounded-md text-gray-500 hover:text-orange-600 hover:bg-orange-50 text-xs font-medium transition"
                              >
                                Détails
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-3">
                {paginatedOrders.map(order => {
                  const st = STATUS_CONFIG[order.status] || { label: order.status, bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-400' };
                  const ps = PAYMENT_STATUS[order.paymentStatus || ''] || (order.status === 'PAID' || order.status === 'DELIVERED' || order.status === 'COMPLETED'
                    ? PAYMENT_STATUS.PAID
                    : PAYMENT_STATUS.PENDING);
                  return (
                    <div key={order.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200">
                      {/* Card Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="font-bold text-gray-900 hover:text-orange-600 transition-colors"
                          >
                            #{order.orderNumber || order.id?.slice(0, 8)}
                          </button>
                          <p className="text-xs text-gray-400 mt-0.5">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${st.bg} ${st.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}></span>
                          {st.label}
                        </span>
                      </div>

                      {/* Customer */}
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-[10px] font-bold text-orange-700 shrink-0">
                          {(order.buyer?.firstName || 'C')[0]}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{order.buyer?.firstName} {order.buyer?.lastName}</p>
                          <p className="text-xs text-gray-400">{order.buyer?.phone || order.buyer?.country}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-base font-bold text-gray-900">{formatCFA(order.totalAmount || order.total || 0)} <span className="text-xs font-normal text-gray-400">FCFA</span></p>
                        </div>
                      </div>

                      {/* Payment + Items */}
                      <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-gray-400 uppercase tracking-wide">Paiement:</span>
                          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${ps.bg} ${ps.text}`}>
                            {ps.label}
                          </span>
                        </div>
                        {order.items && order.items.length > 0 && (
                          <span className="text-[10px] text-gray-400">{order.items.length} article{order.items.length > 1 ? 's' : ''}</span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {order.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')}
                              className="flex-1 px-3 py-2 rounded-lg bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-1"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                              Confirmer
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                              className="px-3 py-2 rounded-lg bg-red-50 text-red-500 text-xs font-medium hover:bg-red-100 transition inline-flex items-center justify-center"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </>
                        )}
                        {order.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'PAID')}
                            className="flex-1 px-3 py-2 rounded-lg bg-green-500 text-white text-xs font-medium hover:bg-green-600 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-1"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                            Marquer payée
                          </button>
                        )}
                        {order.status === 'PAID' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'SHIPPED')}
                            className="flex-1 px-3 py-2 rounded-lg bg-violet-500 text-white text-xs font-medium hover:bg-violet-600 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-1"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25" /></svg>
                            Expédier
                          </button>
                        )}
                        {order.status === 'SHIPPED' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                            className="flex-1 px-3 py-2 rounded-lg bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-1"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                            Marquer livrée
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-2 rounded-lg text-gray-500 hover:text-orange-600 hover:bg-orange-50 text-xs font-medium transition"
                        >
                          Détails →
                        </button>
                        <a
                          href={`/api/v1/orders/${order.id}/invoice`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-2 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 transition inline-flex items-center justify-center gap-1"
                          title="Télécharger la Facture PDF / HTML"
                        >
                          📄 Facture
                        </a>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl border border-gray-100 px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    Affichage de <span className="font-semibold text-gray-900">{showingFrom}</span> à <span className="font-semibold text-gray-900">{showingTo}</span> sur <span className="font-semibold text-gray-900">{filteredOrders.length}</span>
                  </span>
                  <select
                    value={itemsPerPage}
                    onChange={e => setItemsPerPage(Number(e.target.value))}
                    className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  >
                    {ITEMS_PER_PAGE_OPTIONS.map(n => (
                      <option key={n} value={n}>{n} par page</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    ← Précédent
                  </button>

                  {(() => {
                    const pages: (number | '...')[] = [];
                    const maxVisible = 5;
                    if (totalPages <= maxVisible) {
                      for (let i = 1; i <= totalPages; i++) pages.push(i);
                    } else {
                      pages.push(1);
                      if (currentPage > 3) pages.push('...');
                      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                        pages.push(i);
                      }
                      if (currentPage < totalPages - 2) pages.push('...');
                      pages.push(totalPages);
                    }
                    return pages.map((page, idx) =>
                      page === '...' ? (
                        <span key={`ellipsis-${idx}`} className="px-1.5 text-gray-400 text-sm">…</span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                            currentPage === page
                              ? 'bg-orange-500 text-white shadow-sm shadow-orange-200'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    );
                  })()}

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Suivant →
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Detail Modal */}
          <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`Commande #${selectedOrder?.orderNumber || ''}`} size="lg">
            {selectedOrder && (
              <div className="space-y-5">
                {/* Summary Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3.5">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Statut</p>
                    {(() => { const s = STATUS_CONFIG[selectedOrder.status]; return s ? (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
                        {s.label}
                      </span>
                    ) : <span className="text-xs text-gray-500">{selectedOrder.status}</span>; })()}
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3.5">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Total</p>
                    <p className="font-bold text-gray-900 text-sm">{formatCFA(selectedOrder.totalAmount || selectedOrder.total || 0)} <span className="text-xs font-normal text-gray-400">FCFA</span></p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3.5">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Paiement</p>
                    {(() => { const ps = PAYMENT_STATUS[selectedOrder.paymentStatus || ''] || (selectedOrder.status === 'PAID' || selectedOrder.status === 'DELIVERED' ? PAYMENT_STATUS.PAID : PAYMENT_STATUS.PENDING); return (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${ps.bg} ${ps.text}`}>{ps.label}</span>
                    ); })()}
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3.5">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Articles</p>
                    <p className="font-bold text-gray-900 text-sm">{selectedOrder.items?.length || 0}</p>
                  </div>
                </div>

                {/* Tracking Timeline */}
                {selectedOrder.status !== 'CANCELLED' && (
                  <div className="bg-gray-50 rounded-xl p-5">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Suivi de la commande</p>
                    <div className="flex items-center gap-1">
                      {TRACKING_STEPS.map((step, i) => {
                        const currentIdx = getTrackingIndex(selectedOrder.status);
                        const isCompleted = currentIdx >= i;
                        const isCurrent = currentIdx === i;
                        return (
                          <div key={step.key} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all ${isCompleted ? `${step.bg} ${step.color}` : 'bg-gray-200 text-gray-400'} ${isCurrent ? 'ring-2 ring-offset-2 ring-orange-300 scale-110' : ''}`}>
                                {isCompleted && i < currentIdx ? '✓' : step.icon}
                              </div>
                              <span className={`text-[10px] mt-1.5 text-center leading-tight font-medium ${isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>{step.label}</span>
                            </div>
                            {i < TRACKING_STEPS.length - 1 && (
                              <div className={`h-0.5 w-full mx-0.5 mt-[-14px] rounded ${currentIdx > i ? 'bg-orange-400' : 'bg-gray-200'}`}></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {selectedOrder.status === 'CANCELLED' && (
                  <div className="bg-red-50 rounded-xl p-4 text-center border border-red-100">
                    <span className="text-sm font-medium text-red-600 inline-flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      Commande annulée
                    </span>
                  </div>
                )}

                {/* Items List */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Articles</p>
                  <div className="divide-y divide-gray-100">
                    {selectedOrder.items?.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-xs shrink-0">
                            <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{item.product?.title || 'Pièce'}</p>
                            <p className="text-xs text-gray-400">Qté: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-gray-900 shrink-0 ml-3">{formatCFA(item.totalPrice)} <span className="text-xs font-normal text-gray-400">FCFA</span></span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Buyer Info */}
                {selectedOrder.buyer && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Client</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-sm font-bold text-orange-700">{(selectedOrder.buyer.firstName || 'C')[0]}</div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{selectedOrder.buyer.firstName} {selectedOrder.buyer.lastName}</p>
                        <p className="text-xs text-gray-500">{selectedOrder.buyer.email} • {selectedOrder.buyer.country}</p>
                        {selectedOrder.buyer.phone && <p className="text-xs text-gray-400 mt-0.5">{selectedOrder.buyer.phone}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Timeline History */}
                {selectedOrder.timeline && selectedOrder.timeline.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Historique</p>
                    <div className="space-y-2.5">
                      {selectedOrder.timeline.map((tl) => (
                        <div key={tl.id} className="flex gap-3 py-2 border-b border-gray-100 last:border-0 last:pb-0">
                          <span className="text-[10px] text-gray-400 w-20 shrink-0 pt-0.5">{new Date(tl.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                          <span className="text-xs text-gray-600">{tl.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Actions in Modal */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                  <a
                    href={`/api/v1/invoices/${selectedOrder.id}/download`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-1.5"
                  >
                    📄 Facture PDF
                  </a>
                  {selectedOrder.status === 'PENDING' && (
                    <>
                      <button onClick={() => { handleUpdateStatus(selectedOrder.id, 'CONFIRMED'); setSelectedOrder(null); }} className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        Confirmer
                      </button>
                      <button onClick={() => { handleUpdateStatus(selectedOrder.id, 'CANCELLED'); setSelectedOrder(null); }} className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition inline-flex items-center justify-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        Annuler
                      </button>
                    </>
                  )}
                  {selectedOrder.status === 'CONFIRMED' && <button onClick={() => { handleUpdateStatus(selectedOrder.id, 'PAID'); setSelectedOrder(null); }} className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    Marquer payée</button>}
                  {selectedOrder.status === 'PAID' && <button onClick={() => { handleUpdateStatus(selectedOrder.id, 'SHIPPED'); setSelectedOrder(null); }} className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-violet-500 text-white text-sm font-medium hover:bg-violet-600 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25" /></svg>
                    Expédier</button>}
                  {selectedOrder.status === 'SHIPPED' && <button onClick={() => { handleUpdateStatus(selectedOrder.id, 'DELIVERED'); setSelectedOrder(null); }} className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                    Marquer livrée</button>}
                </div>
              </div>
            )}
          </Modal>
        </main>
      </div>
    </div>
  );
}

