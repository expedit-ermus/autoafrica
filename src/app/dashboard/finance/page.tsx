'use client';
import { useState, useEffect, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardTopBar from '@/components/DashboardTopBar';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/contexts/ToastContext';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import Modal from '@/components/Modal';
import { DonutChart } from '@/components/Charts';
import { Order, Payment } from '@/shared/types';

interface Invoice {
  id: string;
  client: string;
  amount: number;
  status: string;
  date: string;
  method: string;
  raw: Order;
}

function paymentDate(p: Payment): Date {
  const ts = p.createdAt || p.updatedAt;
  return ts ? new Date(ts) : new Date(0);
}

export default function FinancePage() {
  const { t } = useApp();
  const { addToast } = useToast();
  const [chartView, setChartView] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [showInvoiceQR, setShowInvoiceQR] = useState<Invoice | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const formatCFA = (n: number) => new Intl.NumberFormat('fr-FR').format(n);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [ordersRes, paymentsRes] = await Promise.all([
          fetch('/api/v1/orders?pageSize=100', { credentials: 'include' }),
          fetch('/api/v1/payments?pageSize=100', { credentials: 'include' }),
        ]);
        const ordersData = await ordersRes.json();
        const paymentsData = await paymentsRes.json();
        if (!cancelled) {
          if (ordersData.success) setOrders(ordersData.data.data);
          if (paymentsData.success) setPayments(paymentsData.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [refreshKey]);

  const totalRevenue = payments
    .filter(p => p.status === 'COMPLETED')
    .reduce((s, p) => s + (p.amount || 0), 0);

  const completedOrders = orders.filter(o => o.status === 'DELIVERED' || o.status === 'COMPLETED');
  const cancelledOrders = orders.filter(o => o.status === 'CANCELLED');
  const totalOrderCount = orders.length;
  const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;
  const profitMargin = totalRevenue > 0 ? ((totalRevenue - cancelledOrders.reduce((s, o) => s + (o.total || 0), 0)) / totalRevenue * 100) : 0;

  const paymentMethods = [
    { name: 'Orange Money', color: '#FF6600', key: 'ORANGE_MONEY' },
    { name: 'Wave', color: '#00B4D8', key: 'WAVE' },
    { name: 'MTN MoMo', color: '#FFCC00', key: 'MTN_MOMO' },
    { name: 'Moov Money', color: '#0066CC', key: 'MOOV_MONEY' },
  ];

  const methodAmounts = paymentMethods.map(pm => ({
    ...pm,
    amount: payments.filter(p => p.method === pm.key && p.status === 'COMPLETED').reduce((s, p) => s + (p.amount || 0), 0),
    count: payments.filter(p => p.method === pm.key && p.status === 'COMPLETED').length,
  }));

  const donutData = methodAmounts
    .filter(m => m.amount > 0)
    .map(m => ({ label: m.name, value: m.amount, color: m.color }));

  const invoices = useMemo(() => orders.map((o): Invoice => ({
    id: o.orderNumber || o.id?.slice(0, 8),
    client: o.buyer?.firstName ? `${o.buyer.firstName} ${o.buyer.lastName || ''}` : o.buyer?.shopName || 'Client',
    amount: o.total || 0,
    status: o.status === 'DELIVERED' || o.status === 'COMPLETED' ? 'paid' : o.status === 'CANCELLED' ? 'cancelled' : o.status === 'SHIPPED' ? 'escrow' : 'pending',
    date: o.createdAt ? new Date(o.createdAt).toISOString().split('T')[0] : '',
    method: o.payments?.[0]?.method || 'N/A',
    raw: o,
  })), [orders]);

  const chartData = useMemo(() => {
    const completed = payments.filter(p => p.status === 'COMPLETED');
    const grouped: Record<string, number> = {};

    completed.forEach((p) => {
      const d = paymentDate(p);
      let key = '';
      if (chartView === 'daily') {
        key = d.toISOString().split('T')[0];
      } else if (chartView === 'weekly') {
        const startOfWeek = new Date(d);
        startOfWeek.setDate(d.getDate() - d.getDay());
        key = startOfWeek.toISOString().split('T')[0];
      } else {
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      }
      grouped[key] = (grouped[key] || 0) + (p.amount || 0);
    });

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(chartView === 'daily' ? -14 : chartView === 'weekly' ? -8 : -12);
  }, [payments, chartView]);

  const chartMax = chartData.length > 0 ? Math.max(...chartData.map(([, v]) => v)) : 1;

  const handleExportCSV = () => {
    const headers = ['Facture', 'Client', 'Montant (FCFA)', 'Date', 'Méthode', 'Statut'];
    const rows = invoices.map(inv => [
      inv.id, inv.client, String(inv.amount), inv.date, inv.method,
      inv.status === 'paid' ? 'Payé' : inv.status === 'escrow' ? 'En route' : inv.status === 'cancelled' ? 'Annulé' : 'En attente',
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('success', 'Export CSV téléchargé');
  };

  const metricCards = [
    {
      label: 'Revenus',
      value: formatCFA(totalRevenue) + ' FCFA',
      change: '+' + (completedOrders.length > 0 ? ((completedOrders.length / Math.max(totalOrderCount, 1)) * 100).toFixed(0) : '0') + '%',
      up: completedOrders.length > 0,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-emerald-500 to-emerald-600',
      bgLight: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      label: 'Commandes',
      value: String(totalOrderCount),
      change: completedOrders.length + ' livrées',
      up: true,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Panier moyen',
      value: formatCFA(avgOrderValue) + ' FCFA',
      change: totalOrderCount > 0 ? 'sur ' + totalOrderCount + ' cmd' : 'Aucune',
      up: true,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-violet-500 to-violet-600',
      bgLight: 'bg-violet-50',
      textColor: 'text-violet-600',
    },
    {
      label: 'Marge brute',
      value: profitMargin.toFixed(1) + '%',
      change: formatCFA(totalRevenue - cancelledOrders.reduce((s, o) => s + (o.total || 0), 0)) + ' FCFA',
      up: profitMargin >= 50,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: 'from-amber-500 to-orange-500',
      bgLight: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#F0F2F5]">
      <Sidebar />
      <div className="flex-1 lg:ml-[260px]">
        <DashboardTopBar />
        <main className="p-4 lg:p-8 pb-24 lg:pb-8 max-w-[1400px] mx-auto">

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 animate-fade-in">
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">{t.nav.finance}</h1>
              <p className="text-sm text-gray-500 mt-1">
                Suivez vos revenus et transactions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="date"
                value={dateRange.from}
                onChange={e => setDateRange(r => ({ ...r, from: e.target.value }))}
                className="input-field !min-h-[40px] !py-2 !text-xs w-[140px]"
              />
              <span className="text-gray-400 text-xs">→</span>
              <input
                type="date"
                value={dateRange.to}
                onChange={e => setDateRange(r => ({ ...r, to: e.target.value }))}
                className="input-field !min-h-[40px] !py-2 !text-xs w-[140px]"
              />
              <button
                onClick={handleExportCSV}
                className="btn-primary !py-2 !px-4 !text-xs flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {metricCards.map((m, i) => (
              <div
                key={m.label}
                className="glass-card p-5 card-shadow-hover animate-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center text-white shadow-sm`}>
                    {m.icon}
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${m.up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                    {m.up ? '↑' : '↓'} {m.change}
                  </span>
                </div>
                <p className="text-xl lg:text-2xl font-extrabold text-gray-900 tracking-tight">{m.value}</p>
                <p className="text-xs text-gray-500 mt-1 font-medium">{m.label}</p>
              </div>
            ))}
          </div>

          {/* Revenue Chart + Payment Donut */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">

            {/* Revenue Chart */}
            <div className="lg:col-span-2 glass-card p-6 animate-fade-in" style={{ animationDelay: '120ms' }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-gray-900">Revenus</h3>
                <div className="flex gap-1 bg-gray-100 rounded-xl p-0.5">
                  {(['daily', 'weekly', 'monthly'] as const).map(v => (
                    <button
                      key={v}
                      onClick={() => setChartView(v)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                        chartView === v ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {v === 'daily' ? 'Jour' : v === 'weekly' ? 'Semaine' : 'Mois'}
                    </button>
                  ))}
                </div>
              </div>

              {chartData.length === 0 ? (
                <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">
                  Aucune donnée de revenu
                </div>
              ) : (
                <div className="relative h-[220px]">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] text-gray-400 font-medium">
                    <span>{formatCFA(chartMax)}</span>
                    <span>{formatCFA(Math.round(chartMax * 0.75))}</span>
                    <span>{formatCFA(Math.round(chartMax * 0.5))}</span>
                    <span>{formatCFA(Math.round(chartMax * 0.25))}</span>
                    <span>0</span>
                  </div>

                  {/* Chart area */}
                  <div className="ml-12 h-full relative">
                    <svg viewBox={`0 0 ${chartData.length * 44} 200`} className="w-full h-full" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#E85D04" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#E85D04" stopOpacity="0.02" />
                        </linearGradient>
                      </defs>
                      {/* Grid lines */}
                      {[0, 50, 100, 150, 200].map(y => (
                        <line key={y} x1="0" y1={y} x2={chartData.length * 44} y2={y} stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="4 4" />
                      ))}
                      {/* Area fill */}
                      <path
                        d={`M0,${200 - (chartData[0][1] / chartMax) * 180} ` +
                          chartData.map(([, v], i) => `L${i * 44 + 22},${200 - (v / chartMax) * 180}`).join(' ') +
                          ` L${(chartData.length - 1) * 44 + 22},200 L0,200 Z`}
                        fill="url(#chartGradient)"
                        className="transition-all duration-700"
                      />
                      {/* Line */}
                      <polyline
                        points={chartData.map(([, v], i) => `${i * 44 + 22},${200 - (v / chartMax) * 180}`).join(' ')}
                        fill="none"
                        stroke="#E85D04"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-all duration-700"
                      />
                      {/* Dots */}
                      {chartData.map(([, v], i) => (
                        <g key={i}>
                          <circle
                            cx={i * 44 + 22}
                            cy={200 - (v / chartMax) * 180}
                            r="4"
                            fill="white"
                            stroke="#E85D04"
                            strokeWidth="2"
                            className="transition-all duration-300"
                          />
                        </g>
                      ))}
                    </svg>
                    {/* X-axis labels */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
                      {chartData.map(([label], i) => (
                        <span key={i} className="text-[9px] text-gray-400 font-medium truncate max-w-[44px] text-center">
                          {chartView === 'daily' ? label.slice(5) : label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method Donut */}
            <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '180ms' }}>
              <h3 className="text-sm font-bold text-gray-900 mb-4">Méthodes de paiement</h3>
              {donutData.length > 0 ? (
                <div className="flex flex-col items-center">
                  <DonutChart segments={donutData} size={160} thickness={20} />
                  <div className="w-full mt-5 space-y-2.5">
                    {methodAmounts.filter(m => m.amount > 0).map(pm => (
                      <div key={pm.name} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2.5">
                          <div className="w-3 h-3 rounded-full" style={{ background: pm.color }} />
                          <span className="text-xs font-medium text-gray-700">{pm.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-gray-900">{formatCFA(pm.amount)} FCFA</p>
                          <p className="text-[10px] text-gray-400">{pm.count} tx</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">
                  Aucune donnée
                </div>
              )}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="glass-card animate-fade-in" style={{ animationDelay: '240ms' }}>
            <div className="flex items-center justify-between p-6 pb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Transactions récentes</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">{invoices.length} facture{invoices.length !== 1 ? 's' : ''}</p>
              </div>
              <button onClick={() => setRefreshKey(k => k + 1)} className="text-[11px] text-orange-600 font-semibold hover:text-orange-700 transition-colors flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualiser
              </button>
            </div>

            {loading ? (
              <div className="p-6 pt-0 space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-14 rounded-xl skeleton" />
                ))}
              </div>
            ) : invoices.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <p className="text-sm font-medium">Aucune transaction pour le moment</p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Facture</th>
                        <th className="text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Client</th>
                        <th className="text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Date</th>
                        <th className="text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Méthode</th>
                        <th className="text-right text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Montant</th>
                        <th className="text-center text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Statut</th>
                        <th className="text-right text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((inv, i) => (
                        <tr
                          key={i}
                          className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer transition-colors"
                          onClick={() => setShowInvoiceQR(inv)}
                        >
                          <td className="px-6 py-4">
                            <span className="font-mono text-xs font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded-md">{inv.id}</span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-700">{inv.client}</td>
                          <td className="px-6 py-4 text-xs text-gray-500">{inv.date}</td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md">{inv.method}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-sm font-bold text-gray-900">{formatCFA(inv.amount)} <span className="text-[10px] font-medium text-gray-400">FCFA</span></span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`badge ${inv.status === 'paid' ? 'badge-success' : inv.status === 'escrow' ? 'badge-info' : inv.status === 'cancelled' ? 'badge-danger' : 'badge-warning'}`}>
                              {inv.status === 'paid' ? 'Payé' : inv.status === 'escrow' ? 'En route' : inv.status === 'cancelled' ? 'Annulé' : 'En attente'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                              <button
                                onClick={() => setShowInvoiceQR(inv)}
                                className="p-1.5 rounded-lg hover:bg-purple-50 text-purple-500 hover:text-purple-600 transition-colors"
                                title="QR Code"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => addToast('info', `PDF ${inv.id} en cours de génération...`)}
                                className="p-1.5 rounded-lg hover:bg-orange-50 text-gray-400 hover:text-orange-500 transition-colors"
                                title="Télécharger PDF"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden p-4 space-y-3">
                  {invoices.map((inv, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl border border-gray-100 hover:border-orange-200 transition-colors cursor-pointer"
                      onClick={() => setShowInvoiceQR(inv)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-mono text-[11px] font-semibold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">{inv.id}</span>
                        <span className={`badge ${inv.status === 'paid' ? 'badge-success' : inv.status === 'escrow' ? 'badge-info' : inv.status === 'cancelled' ? 'badge-danger' : 'badge-warning'}`}>
                          {inv.status === 'paid' ? 'Payé' : inv.status === 'escrow' ? 'En route' : inv.status === 'cancelled' ? 'Annulé' : 'En attente'}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-800 mb-1">{inv.client}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">{inv.date} · {inv.method}</span>
                        <span className="text-sm font-bold text-gray-900">{formatCFA(inv.amount)} FCFA</span>
                      </div>
                      <div className="flex gap-2 mt-3" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => setShowInvoiceQR(inv)}
                          className="flex-1 py-1.5 text-[11px] font-semibold text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                        >
                          QR Code
                        </button>
                        <button
                          onClick={() => addToast('info', `PDF ${inv.id} en cours de génération...`)}
                          className="flex-1 py-1.5 text-[11px] font-semibold text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                        >
                          PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* QR Modal */}
          <Modal isOpen={!!showInvoiceQR} onClose={() => setShowInvoiceQR(null)} title="QR Code Facture">
            {showInvoiceQR && (
              <div className="text-center">
                <QRCodeDisplay
                  data={`autoafrique:invoice:${showInvoiceQR.id}:${showInvoiceQR.amount}`}
                  title={`Facture ${showInvoiceQR.id}`}
                  subtitle={`${showInvoiceQR.client} · ${formatCFA(showInvoiceQR.amount)} FCFA`}
                  size={180}
                />
                <div className="mt-5 bg-gray-50 rounded-xl p-4 text-left space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Client</span>
                    <span className="text-sm font-semibold text-gray-900">{showInvoiceQR.client}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Montant</span>
                    <span className="text-sm font-bold text-orange-600">{formatCFA(showInvoiceQR.amount)} FCFA</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Date</span>
                    <span className="text-sm font-semibold text-gray-900">{showInvoiceQR.date}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Statut</span>
                    <span className={`badge ${showInvoiceQR.status === 'paid' ? 'badge-success' : showInvoiceQR.status === 'escrow' ? 'badge-info' : showInvoiceQR.status === 'cancelled' ? 'badge-danger' : 'badge-warning'}`}>
                      {showInvoiceQR.status === 'paid' ? 'Payé' : showInvoiceQR.status === 'escrow' ? 'En route' : showInvoiceQR.status === 'cancelled' ? 'Annulé' : 'En attente'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </Modal>
        </main>
      </div>
    </div>
  );
}
