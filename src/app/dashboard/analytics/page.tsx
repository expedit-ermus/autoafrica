'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardTopBar from '@/components/DashboardTopBar';
import BarChart, { DonutChart, SparkLine } from '@/components/Charts';
import { Order, Payment, Product } from '@/shared/types';

export default function AnalyticsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [period, setPeriod] = useState('month');

  const formatCFA = (n: number) => new Intl.NumberFormat('fr-FR').format(n);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [p, o, pay] = await Promise.all([
          fetch('/api/v1/products?pageSize=200', { credentials: 'include' }),
          fetch('/api/v1/orders?pageSize=200', { credentials: 'include' }),
          fetch('/api/v1/payments?pageSize=200', { credentials: 'include' }),
        ]);
        const pd = await p.json(); const od = await o.json(); const payd = await pay.json();
        if (!cancelled) {
          if (pd.success) setProducts(pd.data.data);
          if (od.success) setOrders(od.data.data);
          if (payd.success) setPayments(payd.data.data);
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, []);

  const totalRevenue = payments.filter(p => p.status === 'COMPLETED').reduce((s, p) => s + (p.amount || 0), 0);
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'DELIVERED' || o.status === 'COMPLETED');
  const cancelledOrders = orders.filter(o => o.status === 'CANCELLED');
  const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;
  const conversionRate = totalOrders > 0 ? ((completedOrders.length / totalOrders) * 100).toFixed(1) : '0.0';
  const avgRating = 4.7;
  const totalReviews = 0;

  // Revenue by payment method
  const methodRevenues: Record<string, number> = {};
  payments.filter(p => p.status === 'COMPLETED').forEach(p => {
    const m = p.method || 'N/A';
    methodRevenues[m] = (methodRevenues[m] || 0) + (p.amount || 0);
  });
  const methodColors: Record<string, string> = { ORANGE_MONEY: '#FF6600', MTN_MOMO: '#FFCC00', WAVE: '#00B4D8', MOOV_MONEY: '#0066CC' };
  const methodLabels: Record<string, string> = { ORANGE_MONEY: 'Orange Money', MTN_MOMO: 'MTN MoMo', WAVE: 'Wave', MOOV_MONEY: 'Moov' };
  const methodData = Object.entries(methodRevenues).map(([k, v]) => ({ label: methodLabels[k] || k, value: v, color: methodColors[k] || '#6B7280' }));

  // Top products by order count
  const productOrderCount: Record<string, { count: number; revenue: number; title: string }> = {};
  orders.forEach(o => {
    o.items?.forEach(item => {
      const pid = item.productId || item.product?.id;
      if (pid) {
        if (!productOrderCount[pid]) productOrderCount[pid] = { count: 0, revenue: 0, title: item.product?.title || 'Pièce' };
        productOrderCount[pid].count += item.quantity || 1;
        productOrderCount[pid].revenue += item.totalPrice || 0;
      }
    });
  });
  const topProducts = Object.entries(productOrderCount)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 5)
    .map(([id, data]) => ({ id, ...data }));

  // Order status distribution
  const statusCounts: Record<string, number> = {};
  orders.forEach(o => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });
  const statusLabels: Record<string, string> = { PENDING: 'En attente', CONFIRMED: 'Confirmée', PAID: 'Payée', SHIPPED: 'Expédiée', DELIVERED: 'Livrée', COMPLETED: 'Terminée', CANCELLED: 'Annulée' };
  const statusColors: Record<string, string> = { PENDING: '#EAB308', CONFIRMED: '#3B82F6', PAID: '#22C55E', SHIPPED: '#A855F7', DELIVERED: '#22C55E', COMPLETED: '#22C55E', CANCELLED: '#EF4444' };
  const statusData = Object.entries(statusCounts).map(([k, v]) => ({ label: statusLabels[k] || k, value: v, color: statusColors[k] || '#6B7280' }));

  // Stock health
  const inStock = products.filter(p => p.stock > 5).length;
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outOfStock = products.filter(p => p.stock === 0).length;
  const stockData = [
    { label: 'En stock', value: inStock, color: '#22C55E' },
    { label: 'Stock bas', value: lowStock, color: '#F97316' },
    { label: 'Rupture', value: outOfStock, color: '#EF4444' },
  ].filter(d => d.value > 0);

  // Category performance
  const catRevenues: Record<string, number> = {};
  const catCounts: Record<string, number> = {};
  orders.forEach(o => {
    o.items?.forEach(item => {
      const cat = products.find(p => p.id === item.productId)?.category?.name || 'Autre';
      catRevenues[cat] = (catRevenues[cat] || 0) + (item.totalPrice || 0);
      catCounts[cat] = (catCounts[cat] || 0) + (item.quantity || 1);
    });
  });
  const catData = Object.entries(catRevenues)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, value]) => ({ label: label.substring(0, 6), value, color: 'bg-orange-400' }));

  // Revenue sparkline
  const recentPayments = payments.filter(p => p.status === 'COMPLETED').slice(0, 14);
  const sparkData = recentPayments.map(p => p.amount || 0);

  // Country distribution
  const countryOrders: Record<string, number> = {};
  orders.forEach(o => {
    const c = o.buyer?.country || 'N/A';
    countryOrders[c] = (countryOrders[c] || 0) + 1;
  });
  const countryData = Object.entries(countryOrders)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value, color: 'bg-blue-400' }));

  const countryFlags: Record<string, string> = {
    'CI': '🇨🇮', 'SN': '🇸🇳', 'ML': '🇲🇱', 'BF': '🇧🇫', 'NE': '🇳🇪', 'TG': '🇹🇬', 'BJ': '🇧🇯', 'CM': '🇨🇲',
    'Sénégal': '🇸🇳', "Côte d'Ivoire": '🇨🇮', 'Mali': '🇲🇱', 'Burkina Faso': '🇧🇫', 'Niger': '🇳🇪',
    'Togo': '🇹🇬', 'Bénin': '🇧🇯', 'Cameroun': '🇨🇲',
  };

  const periods = [
    { key: 'week', label: '7J' },
    { key: 'month', label: '30J' },
    { key: 'quarter', label: '3M' },
    { key: 'year', label: '1A' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <DashboardTopBar />
        <main className="p-4 lg:p-8 pb-24 lg:pb-8">

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">Analytics</h1>
              <p className="text-sm text-gray-500 mt-1">Vue d&apos;ensemble de votre activité</p>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-xl px-1.5 py-1.5 shadow-sm border border-gray-100">
              {periods.map(p => (
                <button
                  key={p.key}
                  onClick={() => setPeriod(p.key)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    period === p.key
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: 'Revenu total',
                value: formatCFA(totalRevenue),
                suffix: 'FCFA',
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                trend: '+12.5%',
                trendUp: true,
                bg: 'bg-emerald-50',
                iconBg: 'bg-emerald-100',
                iconColor: 'text-emerald-600',
                spark: sparkData,
              },
              {
                label: 'Commandes',
                value: String(totalOrders),
                suffix: '',
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                ),
                trend: `${completedOrders.length} livrées`,
                trendUp: true,
                bg: 'bg-blue-50',
                iconBg: 'bg-blue-100',
                iconColor: 'text-blue-600',
                spark: null,
              },
              {
                label: 'Panier moyen',
                value: formatCFA(avgOrderValue),
                suffix: 'FCFA',
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                trend: `${conversionRate}% conversion`,
                trendUp: true,
                bg: 'bg-purple-50',
                iconBg: 'bg-purple-100',
                iconColor: 'text-purple-600',
                spark: null,
              },
              {
                label: 'Satisfaction',
                value: `${avgRating}`,
                suffix: '/5',
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                ),
                trend: `${totalReviews} avis`,
                trendUp: true,
                bg: 'bg-amber-50',
                iconBg: 'bg-amber-100',
                iconColor: 'text-amber-600',
                spark: null,
              },
            ].map((k, idx) => (
              <div
                key={k.label}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 animate-fade-in"
                style={{ animationDelay: `${idx * 75}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${k.iconBg} ${k.iconColor} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                    {k.icon}
                  </div>
                  {k.spark && k.spark.length > 1 && (
                    <div className="opacity-60 group-hover:opacity-100 transition-opacity">
                      <SparkLine data={k.spark} />
                    </div>
                  )}
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-gray-900 tracking-tight">{k.value}</span>
                  {k.suffix && <span className="text-xs font-medium text-gray-400">{k.suffix}</span>}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-medium text-gray-500">{k.label}</span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${k.trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {k.trendUp && '↑ '}{k.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row 1 — Revenue by Method & Order Status */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Revenus par méthode</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Répartition des paiements</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
              </div>
              {methodData.length > 0 ? (
                <div className="flex justify-center">
                  <DonutChart segments={methodData} size={160} thickness={20} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-400">Aucun revenu</p>
                </div>
              )}
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Statut des commandes</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Répartition par état</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
              </div>
              {statusData.length > 0 ? (
                <div className="flex justify-center">
                  <DonutChart segments={statusData} size={160} thickness={20} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-400">Aucune commande</p>
                </div>
              )}
            </div>
          </div>

          {/* Charts Row 2 — Category & Country */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Revenus par catégorie</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Performance des catégories</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-1.243 1.007-2.25 2.25-2.25h13.5" />
                  </svg>
                </div>
              </div>
              {catData.length > 0 ? (
                <BarChart data={catData} height={180} format={(n) => formatCFA(n)} />
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-400">Aucune donnée</p>
                </div>
              )}
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Commandes par pays</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Distribution géographique</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                </div>
              </div>
              {countryData.length > 0 ? (
                <div className="space-y-3">
                  {countryData.slice(0, 6).map((c) => {
                    const maxVal = countryData[0]?.value || 1;
                    const pct = (c.value / maxVal) * 100;
                    return (
                      <div key={c.label} className="group">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2.5">
                            <span className="text-lg leading-none">{countryFlags[c.label] || '🌍'}</span>
                            <span className="text-sm font-medium text-gray-700">{c.label}</span>
                          </div>
                          <span className="text-sm font-bold text-gray-900">{c.value}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-400">Aucune donnée</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Products & Stock Health */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Stock Health */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Santé du stock</h3>
                  <p className="text-xs text-gray-400 mt-0.5">État de l&apos;inventaire</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              {stockData.length > 0 ? (
                <>
                  <div className="flex justify-center mb-5">
                    <DonutChart segments={stockData} size={140} thickness={18} />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/80">
                      <div className="flex items-center gap-2.5">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="text-sm font-medium text-gray-700">En stock</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{inStock}</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-orange-50/80">
                      <div className="flex items-center gap-2.5">
                        <div className="w-3 h-3 rounded-full bg-orange-500" />
                        <span className="text-sm font-medium text-gray-700">Stock bas</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{lowStock}</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-red-50/80">
                      <div className="flex items-center gap-2.5">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-sm font-medium text-gray-700">Rupture</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{outOfStock}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-400">Aucun produit</p>
                </div>
              )}
            </div>

            {/* Top Products */}
            <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6 animate-fade-in" style={{ animationDelay: '500ms' }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Top produits</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Classement par revenu</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0116.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.003 6.003 0 01-3.52 1.063" />
                  </svg>
                </div>
              </div>
              {topProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-400">Aucune donnée</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4">#</th>
                        <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4">Produit</th>
                        <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4">Marque</th>
                        <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4">Revenu</th>
                        <th className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider pb-3 pr-4">Ventes</th>
                        <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider pb-3">Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {topProducts.map((p, i) => {
                        const product = products.find((pr) => pr.id === p.id);
                        return (
                          <tr key={p.id} className="group hover:bg-gray-50/50 transition-colors">
                            <td className="py-3.5 pr-4">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                                i === 0 ? 'bg-amber-100 text-amber-700' :
                                i === 1 ? 'bg-gray-100 text-gray-600' :
                                i === 2 ? 'bg-orange-100 text-orange-600' :
                                'bg-gray-50 text-gray-500'
                              }`}>
                                {i + 1}
                              </div>
                            </td>
                            <td className="py-3.5 pr-4">
                              <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{p.title}</p>
                            </td>
                            <td className="py-3.5 pr-4">
                              <span className="text-xs text-gray-500">{product?.brand?.name || '—'}</span>
                            </td>
                            <td className="py-3.5 pr-4 text-right">
                              <span className="text-sm font-bold text-gray-900">{formatCFA(p.revenue)}</span>
                              <span className="text-[10px] text-gray-400 ml-0.5">FCFA</span>
                            </td>
                            <td className="py-3.5 pr-4 text-center">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                {p.count}
                              </span>
                            </td>
                            <td className="py-3.5 text-right">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                (product?.stock || 0) > 5 ? 'bg-emerald-50 text-emerald-700' :
                                (product?.stock || 0) > 0 ? 'bg-orange-50 text-orange-700' :
                                'bg-red-50 text-red-700'
                              }`}>
                                {product?.stock ?? 0}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '600ms' }}>
            {[
              { label: 'Produits actifs', value: String(products.length), icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              ), bg: 'bg-gray-50', iconColor: 'text-gray-500' },
              { label: 'Revenus confirmés', value: formatCFA(totalRevenue), suffix: ' FCFA', icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ), bg: 'bg-emerald-50', iconColor: 'text-emerald-500' },
              { label: 'Commandes livrées', value: String(completedOrders.length), icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ), bg: 'bg-blue-50', iconColor: 'text-blue-500' },
              { label: 'Taux d\'annulation', value: totalOrders > 0 ? ((cancelledOrders.length / totalOrders) * 100).toFixed(1) + '%' : '0%', icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ), bg: 'bg-red-50', iconColor: 'text-red-500' },
            ].map(s => (
              <div key={s.label} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-4 text-center hover:shadow-md transition-shadow duration-200">
                <div className={`w-8 h-8 rounded-lg ${s.bg} ${s.iconColor} flex items-center justify-center mx-auto mb-2.5`}>
                  {s.icon}
                </div>
                <p className="text-lg font-extrabold text-gray-900 tracking-tight">
                  {s.value}{s.suffix && <span className="text-xs font-medium text-gray-400">{s.suffix}</span>}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
