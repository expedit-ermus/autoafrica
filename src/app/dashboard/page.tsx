'use client';
import { useState, useEffect } from 'react';
import RemoteImage from '@/components/RemoteImage';
import Sidebar from '@/components/Sidebar';
import DashboardTopBar from '@/components/DashboardTopBar';
import { useApp } from '@/contexts/AppContext';
import Link from 'next/link';
import BarChart, { DonutChart, SparkLine } from '@/components/Charts';
import dynamic from 'next/dynamic';
import LoadingSkeleton from '@/components/LoadingSkeleton';

const RoleServicesHub = dynamic(() => import('@/components/RoleServicesHub'), {
  ssr: false,
  loading: () => <LoadingSkeleton height="h-32" />
});

import { Product, Order, Payment } from '@/shared/types';

const PLACEHOLDER_IMAGE = '/images/placeholder.svg';

export default function DashboardPage() {
  const { t, user, locale } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const formatCFA = (n: number) => new Intl.NumberFormat('fr-FR').format(n);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [prodRes, orderRes, payRes] = await Promise.all([
          fetch('/api/v1/products?pageSize=100', { credentials: 'include' }),
          fetch('/api/v1/orders?pageSize=100', { credentials: 'include' }),
          fetch('/api/v1/payments?pageSize=100', { credentials: 'include' }),
        ]);
        const prodData = await prodRes.json();
        const orderData = await orderRes.json();
        const payData = await payRes.json();
        if (!cancelled) {
          if (prodData.success) setProducts(Array.isArray(prodData.data?.data) ? prodData.data.data as Product[] : []);
          if (orderData.success) setOrders(Array.isArray(orderData.data?.data) ? orderData.data.data as Order[] : []);
          if (payData.success) setPayments(Array.isArray(payData.data) ? payData.data as Payment[] : Array.isArray(payData.data?.data) ? payData.data.data as Payment[] : []);
        }
      } catch (err) { console.error(err); } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
  const deliveredOrders = orders.filter(o => o.status === 'DELIVERED' || o.status === 'COMPLETED').length;
  const totalRevenue = payments.filter(p => p.status === 'COMPLETED').reduce((s, p) => s + (p.amount || 0), 0);
  const escrowAmount = payments.filter(p => p.status === 'HELD').reduce((s, p) => s + (p.amount || 0), 0);
  const lowStockProducts = products.filter(p => p.stock <= 3 && p.stock > 0);
  const outOfStock = products.filter(p => p.stock === 0);
  const recentOrders = orders.slice(0, 5);

  const statusLabels: Record<string, string> = {
    PENDING: 'En attente', CONFIRMED: 'Confirmée', PAID: 'Payée', SHIPPED: 'Expédiée', DELIVERED: 'Livrée', COMPLETED: 'Terminée', CANCELLED: 'Annulée',
  };
  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700', CONFIRMED: 'bg-blue-100 text-blue-700', PAID: 'bg-green-100 text-green-700',
    SHIPPED: 'bg-purple-100 text-purple-700', DELIVERED: 'bg-green-100 text-green-700', COMPLETED: 'bg-green-100 text-green-700', CANCELLED: 'bg-red-100 text-red-700',
  };
  const statusBorderLeft: Record<string, string> = {
    PENDING: 'border-l-yellow-400', CONFIRMED: 'border-l-blue-400', PAID: 'border-l-green-400',
    SHIPPED: 'border-l-purple-400', DELIVERED: 'border-l-emerald-500', COMPLETED: 'border-l-emerald-500', CANCELLED: 'border-l-red-400',
  };

  const orderStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  const orderStatusColors = ['#EAB308', '#3B82F6', '#A855F7', '#22C55E', '#EF4444'];
  const statusDistribution = orderStatuses.map((s, i) => ({
    label: statusLabels[s] || s,
    value: orders.filter(o => o.status === s).length,
    color: orderStatusColors[i],
  })).filter(s => s.value > 0);

  const categoryCounts: Record<string, number> = {};
  products.forEach((p) => {
    const cat = p.category?.name || 'Autre';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });
  const categoryData = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, value]) => ({ label, value, color: 'bg-orange-400' }));

  const recentPayments = payments.filter(p => p.status === 'COMPLETED').slice(0, 7);
  const revenueSparkline = recentPayments.map(p => p.amount || 0);

  const methodCounts: Record<string, number> = {};
  payments.forEach((p) => { if (p.status === 'COMPLETED') methodCounts[p.method || 'N/A'] = (methodCounts[p.method || 'N/A'] || 0) + 1; });
  const methodColors: Record<string, string> = { ORANGE_MONEY: '#FF6600', MTN_MOMO: '#FFCC00', WAVE: '#00B4D8', MOOV_MONEY: '#0066CC' };
  const methodLabels: Record<string, string> = { ORANGE_MONEY: 'Orange Money', MTN_MOMO: 'MTN MoMo', WAVE: 'Wave', MOOV_MONEY: 'Moov' };
  const methodDistribution = Object.entries(methodCounts).map(([key, value]) => ({
    label: methodLabels[key] || key, value, color: methodColors[key] || '#6B7280',
  }));

  const priceRanges = [
    { label: '<10k', min: 0, max: 10000 },
    { label: '10-50k', min: 10000, max: 50000 },
    { label: '50-100k', min: 50000, max: 100000 },
    { label: '100-500k', min: 100000, max: 500000 },
    { label: '>500k', min: 500000, max: Infinity },
  ];
  const priceData = priceRanges.map(r => ({
    label: r.label,
    value: products.filter(p => p.price >= r.min && p.price < r.max).length,
    color: 'bg-blue-400',
  }));

  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return L('Bonjour', 'Good morning');
    if (h < 18) return L('Bon après-midi', 'Good afternoon');
    return L('Bonsoir', 'Good evening');
  };

  const statsCards = [
    {
      label: L('Pièces', 'Parts'),
      value: String(totalProducts),
      href: '/dashboard/inventory',
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
      ),
      gradient: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600',
      spark: priceData.map(d => d.value),
      sub: `${outOfStock.length} ${L('rupture', 'out of stock')}`,
      subColor: outOfStock.length > 0 ? 'text-red-500' : 'text-green-600',
      isCurrency: false,
    },
    {
      label: L('Commandes', 'Orders'),
      value: String(totalOrders),
      href: '/dashboard/orders',
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
      ),
      gradient: 'from-emerald-500 to-emerald-600',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600',
      spark: statusDistribution.map(d => d.value),
      sub: `${pendingOrders} ${L('en attente', 'pending')}`,
      subColor: pendingOrders > 0 ? 'text-orange-500' : 'text-green-600',
      isCurrency: false,
    },
    {
      label: L('Revenu', 'Revenue'),
      value: formatCFA(totalRevenue),
      href: '/dashboard/payments',
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      ),
      gradient: 'from-orange-500 to-amber-500',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-600',
      spark: revenueSparkline,
      sub: `${formatCFA(escrowAmount)} ${L('séquestre', 'in escrow')}`,
      subColor: 'text-blue-600',
      isCurrency: true,
    },
    {
      label: L('Taux succès', 'Success rate'),
      value: totalOrders > 0 ? `${((deliveredOrders / totalOrders) * 100).toFixed(0)}%` : '—',
      href: '/dashboard/orders',
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      ),
      gradient: 'from-violet-500 to-purple-600',
      iconBg: 'bg-violet-500/10',
      iconColor: 'text-violet-600',
      spark: [],
      sub: `${deliveredOrders}/${totalOrders} ${L('livrées', 'delivered')}`,
      subColor: 'text-green-600',
      isCurrency: false,
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-warm">
        <Sidebar />
        <div className="flex-1 min-w-0 lg:ml-[260px]">
          <DashboardTopBar />
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <div className="absolute inset-0 w-12 h-12 border-4 border-orange-200 border-t-transparent rounded-full mx-auto mb-4 animate-ping opacity-30"></div>
              </div>
              <p className="text-gray-500 font-medium">Chargement du tableau de bord...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-warm">
      <Sidebar />
      <div className="flex-1 min-w-0 lg:ml-[260px]">
        <DashboardTopBar />
        <main className="p-3 sm:p-4 lg:p-8 pb-24 lg:pb-8 max-w-[1400px] mx-auto">

          {/* ═══════════════════ HERO BANNER ═══════════════════ */}
          <div className="relative rounded-3xl overflow-hidden mb-8" style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] via-50% to-[var(--color-warm-red)]" />
            <div className="absolute inset-0 opacity-[0.07]">
              <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-orange-400 blur-[120px] translate-x-1/3 -translate-y-1/3" />
              <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-red-500 blur-[100px] translate-y-1/3" />
              <div className="absolute top-1/2 right-1/3 w-48 h-48 rounded-full bg-purple-400 blur-[80px]" />
            </div>
            <div className="relative z-10 p-4 sm:p-6 lg:p-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-400 text-xs font-semibold tracking-wide uppercase">{L('En ligne', 'Online')}</span>
                  </div>
                  <p className="text-orange-300 text-sm font-semibold mb-1 tracking-wide">{getGreeting()}</p>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-2 tracking-tight">
                    {user?.firstName || L('Vendeur', 'Seller')}
                  </h1>
                  <p className="text-gray-400 text-sm max-w-md leading-relaxed">{L('Welcome — voici un aperçu de votre activité en temps réel.', 'Welcome — here is a real-time overview of your activity.')}</p>
                  {(!user?.firstName) && (
                    <Link href="/dashboard/settings" className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-all duration-200 backdrop-blur-sm border border-white/10 hover:border-white/20">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      {L('Compléter mon profil', 'Complete my profile')}
                    </Link>
                  )}
                </div>
                <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-6 lg:gap-8 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0">
                  <div className="text-center">
                    <p className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">{totalOrders}</p>
                    <p className="text-xs text-gray-400 mt-1 font-medium">{L('Commandes', 'Orders')}</p>
                  </div>
                  <div className="w-px h-12 bg-white/10" />
                  <div className="text-center">
                    <p className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-orange-400 tracking-tight">{formatCFA(totalRevenue)}</p>
                    <p className="text-xs text-gray-400 mt-1 font-medium">FCFA</p>
                  </div>
                  <div className="w-px h-12 bg-white/10" />
                  <div className="text-center">
                    <p className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-emerald-400 tracking-tight">
                      {totalOrders > 0 ? `${((deliveredOrders / totalOrders) * 100).toFixed(0)}%` : '—'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 font-medium">{L('Succès', 'Success')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════════ ESPACE SERVICES (ACHETEUR / PRESTATAIRE) ═══════════════════ */}
          <RoleServicesHub />

          {/* ═══════════════════ STATS CARDS ═══════════════════ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {statsCards.map((s, idx) => (
              <Link
                key={idx}
                href={s.href}
                className="card-modern p-4 sm:p-5 group cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 block"
                style={{ animation: `fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + idx * 0.08}s both` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${s.iconBg} flex items-center justify-center ${s.iconColor} transition-transform duration-300 group-hover:scale-110`}>
                    {s.icon}
                  </div>
                  {s.spark.length > 1 && (
                    <div className="opacity-60 group-hover:opacity-100 transition-opacity">
                      <SparkLine data={s.spark} />
                    </div>
                  )}
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-0.5 truncate">
                  {s.value}{s.isCurrency && <span className="text-xs font-semibold text-gray-400 ml-1.5">FCFA</span>}
                </div>
                <div className="text-sm font-medium text-gray-500 mb-2">{s.label}</div>
                <div className={`text-xs font-semibold ${s.subColor}`}>{s.sub}</div>
              </Link>
            ))}
          </div>

          {/* ═══════════════════ CHARTS ROW ═══════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8" style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both' }}>
            <div className="glass-card p-4 sm:p-6 min-w-0">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{L('Stock par catégorie', 'Stock by Category')}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{L('Répartition de votre inventaire', 'Inventory Breakdown')}</p>
                </div>
                <Link href="/dashboard/inventory" className="text-xs text-orange-600 font-semibold hover:text-orange-700 transition-colors hover:underline">{L('Voir tout →', 'View all →')}</Link>
              </div>
              <BarChart data={categoryData} height={160} />
            </div>
            <div className="glass-card p-4 sm:p-6 min-w-0">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{L('Statut des commandes', 'Order Status')}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{L('Distribution des statuts', 'Status Distribution')}</p>
                </div>
                <Link href="/dashboard/orders" className="text-xs text-orange-600 font-semibold hover:text-orange-700 transition-colors hover:underline">{L('Voir tout →', 'View all →')}</Link>
              </div>
              {statusDistribution.length > 0 ? (
                <DonutChart segments={statusDistribution} />
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="mb-2 opacity-40"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  <p className="text-sm">{L('Aucune commande', 'No orders')}</p>
                </div>
              )}
            </div>
            <div className="glass-card p-4 sm:p-6 min-w-0">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{L('Répartition des prix', 'Price Distribution')}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{L('Fourchettes de prix', 'Price Ranges')}</p>
                </div>
                <Link href="/dashboard/inventory" className="text-xs text-orange-600 font-semibold hover:text-orange-700 transition-colors hover:underline">{L('Voir tout →', 'View all →')}</Link>
              </div>
              <BarChart data={priceData} height={160} format={(n) => `${n} ${L(n > 1 ? 'pièces' : 'pièce', n > 1 ? 'parts' : 'part')}`} />
            </div>
          </div>

          {/* ═══════════════════ RECENT ACTIVITY + PAYMENT METHODS ═══════════════════ */}
          <div className="grid lg:grid-cols-3 gap-5 mb-8" style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both' }}>
            <div className="glass-card p-4 sm:p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{L('Méthodes de paiement', 'Payment Methods')}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{L('Moyens utilisés', 'Methods Used')}</p>
                </div>
                <Link href="/dashboard/orders" className="text-xs text-orange-600 font-semibold hover:text-orange-700 transition-colors hover:underline">{L('Voir tout →', 'View all →')}</Link>
              </div>
              {methodDistribution.length > 0 ? (
                <DonutChart segments={methodDistribution} />
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="mb-2 opacity-40"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  <p className="text-sm">{L('Aucun paiement', 'No payments')}</p>
                </div>
              )}
            </div>

            <div className="lg:col-span-2 glass-card p-4 sm:p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{L('Commandes récentes', 'Recent Orders')}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{L('Dernières activités', 'Latest Activities')}</p>
                </div>
                <Link href="/dashboard/orders" className="text-xs text-orange-600 font-semibold hover:text-orange-700 transition-colors hover:underline">{L('Voir tout →', 'View all →')}</Link>
              </div>
              {recentOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="mb-2 opacity-40"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  <p className="text-sm">{L('Aucune commande', 'No orders')}</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {recentOrders.map((o) => (
                    <Link
                      key={o.id}
                      href={`/dashboard/orders`}
                      className={`flex items-center gap-2.5 sm:gap-4 p-2.5 sm:p-3.5 rounded-2xl hover:bg-white/80 hover:shadow-sm transition-all duration-200 border-l-4 ${statusBorderLeft[o.status] || 'border-l-gray-200'} group`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center text-sm shrink-0 group-hover:scale-105 transition-transform">
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="var(--color-primary-dark)" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm truncate group-hover:text-orange-600 transition-colors">{o.orderNumber || o.id?.slice(0, 8)}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{o.buyer?.firstName} {o.buyer?.lastName} • {o.createdAt ? new Date(o.createdAt).toLocaleDateString('fr-FR') : ''}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-orange-600 text-sm">{formatCFA(o.total || 0)} <span className="text-xs font-medium text-gray-400">FCFA</span></p>
                        <span className={`badge text-[10px] mt-1 inline-block ${statusColors[o.status] || 'bg-gray-100 text-gray-700'}`}>{statusLabels[o.status] || o.status}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ═══════════════════ QUICK ACTIONS ═══════════════════ */}
          <div className="mb-8" style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both' }}>
            <div className="mb-4">
              <h2 className="section-title text-xl text-gray-900">Actions rapides</h2>
              <p className="section-subtitle text-sm mt-0.5">Accédez rapidement aux fonctionnalités clés</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
              {[
                { href: '/dashboard/inventory', icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>, label: 'Ajouter une pièce', bg: 'from-orange-500 to-amber-500', lightBg: 'bg-orange-50', textColor: 'text-orange-600' },
                { href: '/dashboard/marketplace', icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>, label: 'Marketplace', bg: 'from-blue-500 to-blue-600', lightBg: 'bg-blue-50', textColor: 'text-blue-600' },
                { href: '/dashboard/orders', icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>, label: `${pendingOrders} commandes`, bg: 'from-emerald-500 to-emerald-600', lightBg: 'bg-emerald-50', textColor: 'text-emerald-600' },
                { href: '/dashboard/cart', icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>, label: 'Mon panier', bg: 'from-violet-500 to-purple-600', lightBg: 'bg-violet-50', textColor: 'text-violet-600' },
                { href: '/dashboard/payments', icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>, label: 'Voir paiements', bg: 'from-rose-500 to-red-500', lightBg: 'bg-rose-50', textColor: 'text-rose-600' },
              ].map((a, idx) => (
                <Link
                  key={`${a.href}-${idx}`}
                  href={a.href}
                  className="card-modern p-3 sm:p-5 flex flex-col items-center gap-2 sm:gap-3 text-center group cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-2xl ${a.lightBg} flex items-center justify-center ${a.textColor} transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                    {a.icon}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors leading-tight">{a.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* ═══════════════════ PRODUCTS + STOCK ALERTS ═══════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8" style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.7s both' }}>
            <div className="lg:col-span-2 card-modern p-4 sm:p-6 min-w-0">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-bold text-gray-900 text-sm">Dernières pièces</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Produits les plus récents</p>
                </div>
                <Link href="/dashboard/inventory" className="text-xs text-orange-600 font-semibold hover:text-orange-700 transition-colors hover:underline">Voir tout →</Link>
              </div>
              {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="mb-3 opacity-30"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  <p className="text-sm font-medium">Aucune pièce</p>
                  <p className="text-xs text-gray-400 mt-1">Ajoutez votre première pièce pour commencer</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {products.slice(0, 5).map((p) => (
                    <Link key={p.id} href={`/dashboard/inventory`} className="flex items-center gap-2.5 sm:gap-4 p-2.5 sm:p-3.5 rounded-2xl hover:bg-orange-50/60 hover:shadow-sm transition-all duration-200 group cursor-pointer">
                      <RemoteImage src={PLACEHOLDER_IMAGE} alt={p.title} width={48} height={48} className="w-12 h-12 rounded-xl object-cover shadow-sm group-hover:shadow-md transition-shadow" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm truncate group-hover:text-orange-600 transition-colors">{p.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{p.brand?.name || ''} • {p.reference || 'N/A'}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-orange-600 text-sm">{formatCFA(p.price)} <span className="text-xs font-medium text-gray-400">FCFA</span></p>
                        <p className={`text-xs font-semibold mt-0.5 ${p.stock > 5 ? 'text-emerald-600' : p.stock > 0 ? 'text-amber-500' : 'text-red-500'}`}>Stock: {p.stock}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Stock Alerts */}
            <div className="space-y-5 min-w-0">
              {(lowStockProducts.length > 0 || outOfStock.length > 0) && (
                <div className="card-modern p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#DC2626" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <h2 className="font-bold text-gray-900 text-sm">Alertes stock</h2>
                  </div>
                  <div className="space-y-2">
                    {outOfStock.slice(0, 3).map((p) => (
                      <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-red-50/80 border border-red-100 border-l-4 border-l-red-400">
                        <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                        <span className="text-xs font-semibold text-red-700 truncate flex-1">{p.title}</span>
                        <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2.5 py-1 rounded-full shrink-0">Rupture</span>
                      </div>
                    ))}
                    {lowStockProducts.slice(0, 3).map((p) => (
                      <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/80 border border-amber-100 border-l-4 border-l-amber-400">
                        <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                        <span className="text-xs font-semibold text-amber-700 truncate flex-1">{p.title}</span>
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2.5 py-1 rounded-full shrink-0">{p.stock} restant{p.stock > 1 ? 's' : ''}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Markets */}
              <div className="card-modern p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#3B82F6" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h2 className="font-bold text-gray-900 text-sm">Marchés Actifs</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 min-w-0 gap-2">
                  {[
                    { name: 'Côte d\'Ivoire', code: 'CI' }, { name: 'Sénégal', code: 'SN' }, { name: 'Mali', code: 'ML' }, { name: 'Burkina', code: 'BF' }, { name: 'Nigeria', code: 'NG' },
                  ].map((m, idx) => (
                    <Link key={idx} href={`/dashboard/marketplace?country=${m.code}`} className="min-w-0 text-center p-2 sm:p-3 rounded-xl bg-gray-50 hover:bg-orange-50 transition-all duration-200 cursor-pointer hover:shadow-sm group block">
                      <RemoteImage src={`https://flagcdn.com/w80/${m.code.toLowerCase()}.png`} alt={m.name} width={80} height={56} className="w-full h-7 object-cover rounded-md mb-1.5 shadow-sm group-hover:shadow-md transition-shadow" />
                      <p className="text-[10px] font-bold text-gray-600 group-hover:text-orange-600 transition-colors leading-tight">{m.name}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

