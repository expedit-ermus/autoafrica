'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardTopBar from '@/components/DashboardTopBar';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/contexts/ToastContext';
import UssdPaymentFlow from '@/components/UssdPaymentFlow';
import AgentNetwork from '@/components/AgentNetwork';
import InstallmentPlan from '@/components/InstallmentPlan';
import CrossBorderPayments from '@/components/CrossBorderPayments';
import WhatsAppIntegration from '@/components/WhatsAppIntegration';
import VehicleInspection from '@/components/VehicleInspection';
import { Payment } from '@/shared/types';
import { PaymentLogo } from '@/components/PaymentLogos';

export default function PaymentsPage() {
  const { t } = useApp();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'history' | 'escrow' | 'ussd' | 'agents' | 'installments' | 'crossborder' | 'whatsapp' | 'inspection'>('history');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [methodFilter, setMethodFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const formatCFA = (n: number) => new Intl.NumberFormat('fr-FR').format(n);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/v1/payments?pageSize=100', { credentials: 'include' });
        const data = await res.json();
        if (!cancelled && data.success) setPayments(Array.isArray(data.data) ? data.data : Array.isArray(data.data?.data) ? data.data.data : []);
      } catch (err) { console.error(err); } finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, []);

  const completed = payments.filter(p => p.status === 'COMPLETED');
  const held = payments.filter(p => p.status === 'HELD');
  const pending = payments.filter(p => p.status === 'PENDING');
  const refunded = payments.filter(p => p.status === 'REFUNDED');

  const totalVolume = completed.reduce((s, p) => s + (p.amount || 0), 0);
  const escrowVolume = held.reduce((s, p) => s + (p.amount || 0), 0);
  const pendingVolume = pending.reduce((s, p) => s + (p.amount || 0), 0);
  const refundedVolume = refunded.reduce((s, p) => s + (p.amount || 0), 0);
  const successRate = payments.length > 0 ? ((completed.length / payments.length) * 100).toFixed(1) : '0.0';

  const filtered = payments.filter(p => {
    const matchMethod = methodFilter === 'all' || p.method === methodFilter;
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    let matchDate = true;
    if (dateFrom && p.createdAt) matchDate = matchDate && new Date(p.createdAt) >= new Date(dateFrom);
    if (dateTo && p.createdAt) matchDate = matchDate && new Date(p.createdAt) <= new Date(dateTo + 'T23:59:59');
    return matchMethod && matchStatus && matchDate;
  });

  const methodConfig: Record<string, { color: string; bgColor: string; label: string; icon: string }> = {
    ORANGE_MONEY: { color: '#FF6600', bgColor: 'bg-orange-500', label: 'Orange Money', icon: 'OM' },
    MTN_MOMO: { color: '#FFCC00', bgColor: 'bg-yellow-500', label: 'MTN MoMo', icon: 'MTN' },
    WAVE: { color: '#00B4D8', bgColor: 'bg-cyan-500', label: 'Wave', icon: 'W' },
    MOOV_MONEY: { color: '#0066CC', bgColor: 'bg-blue-600', label: 'Moov Money', icon: 'M' },
  };

  const getMethodStats = (method: string) => {
    const methodPayments = payments.filter(p => p.method === method);
    const methodCompleted = methodPayments.filter(p => p.status === 'COMPLETED');
    const total = methodCompleted.reduce((s, p) => s + (p.amount || 0), 0);
    return { count: methodPayments.length, total };
  };

  const statusLabels: Record<string, string> = {
    COMPLETED: 'Payé', PENDING: 'En attente', HELD: 'Séquestre', FAILED: 'Échoué', REFUNDED: 'Remboursé',
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'PENDING': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'HELD': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'FAILED': return 'bg-red-50 text-red-700 border border-red-200';
      case 'REFUNDED': return 'bg-purple-50 text-purple-700 border border-purple-200';
      default: return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const tabs = [
    { id: 'history' as const, label: 'Historique', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    )},
    { id: 'escrow' as const, label: 'Séquestre', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    )},
    { id: 'installments' as const, label: 'Paiement différé', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    )},
    { id: 'ussd' as const, label: 'USSD', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
    )},
    { id: 'agents' as const, label: 'Agents', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
    )},
    { id: 'crossborder' as const, label: 'Transfrontalier', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )},
    { id: 'whatsapp' as const, label: 'WhatsApp', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
    )},
    { id: 'inspection' as const, label: 'Inspection', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
    )},
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 lg:ml-64 min-w-0">
        <DashboardTopBar />
        <main className="p-4 lg:p-8 pb-24 lg:pb-8 max-w-7xl mx-auto">

          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{t.nav.payments}</h1>
                <p className="text-sm text-slate-500 mt-1">
                  Gérez vos paiements et suivez vos transactions
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Total reçu</p>
                  <p className="text-2xl font-bold text-emerald-600">{formatCFA(totalVolume)} <span className="text-sm font-normal text-slate-500">FCFA</span></p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total reçu', value: formatCFA(totalVolume), suffix: 'FCFA', icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              ), color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
              { label: 'En attente', value: formatCFA(pendingVolume), suffix: 'FCFA', icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              ), color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
              { label: 'Remboursé', value: formatCFA(refundedVolume), suffix: 'FCFA', icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
              ), color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
              { label: 'Taux succès', value: successRate + '%', suffix: '', icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              ), color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
            ].map((stat, i) => (
              <div key={i} className={`rounded-xl ${stat.bg} ${stat.border} border p-5 transition-all hover:shadow-md`}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center`}>
                    {stat.icon}
                  </div>
                </div>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value} <span className="text-sm font-normal opacity-70">{stat.suffix}</span></p>
                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Méthodes de paiement</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(methodConfig).map(([key, config]) => {
                const stats = getMethodStats(key);
                const isActive = stats.count > 0;
                return (
                  <div key={key} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg transition-all duration-200 group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <PaymentLogo name={key} size={44} />
                        <div>
                          <p className="font-semibold text-slate-900">{config.label}</p>
                          <p className="text-xs text-slate-500">{stats.count} transactions</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                        {isActive ? 'Actif' : 'Inactif'}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-100">
                      <p className="text-2xl font-bold text-slate-900">{formatCFA(stats.total)} <span className="text-sm font-normal text-slate-500">FCFA</span></p>
                      <p className="text-xs text-slate-500 mt-1">Total reçu</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {activeTab === 'history' && (
            <>
              <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Méthode</label>
                    <div role="group" aria-label="Méthode" className="flex gap-2 flex-wrap">
                      {['all', 'ORANGE_MONEY', 'MTN_MOMO', 'WAVE', 'MOOV_MONEY'].map(m => (
                        <button key={m} onClick={() => setMethodFilter(m)}
                          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${methodFilter === m ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                          {m === 'all' ? 'Toutes' : methodConfig[m]?.label || m.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Statut</label>
                    <div role="group" aria-label="Statut" className="flex gap-2 flex-wrap">
                      {['all', 'COMPLETED', 'PENDING', 'HELD', 'FAILED', 'REFUNDED'].map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${statusFilter === s ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                          {s === 'all' ? 'Tous' : statusLabels[s] || s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 items-end">
                    <div>
                      <label htmlFor="pay-dateFrom" className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Du</label>
                      <input id="pay-dateFrom" type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400" />
                    </div>
                    <div>
                      <label htmlFor="pay-dateTo" className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Au</label>
                      <input id="pay-dateTo" type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">Paiements récents</h3>
                  <span className="text-sm text-slate-500">{filtered.length} transaction{filtered.length !== 1 ? 's' : ''}</span>
                </div>

                {loading ? (
                  <div className="p-6 space-y-4">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="flex items-center gap-4 animate-pulse">
                        <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                          <div className="h-3 bg-slate-200 rounded w-1/6"></div>
                        </div>
                        <div className="h-4 bg-slate-200 rounded w-20"></div>
                      </div>
                    ))}
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <p className="text-slate-500 font-medium">Aucune transaction trouvée</p>
                    <p className="text-sm text-slate-400 mt-1">Modifiez vos filtres pour voir plus de résultats</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Date</th>
                          <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Commande</th>
                          <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Client</th>
                          <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Montant</th>
                          <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Méthode</th>
                          <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Statut</th>
                          <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filtered.map(p => {
                          const mi = methodConfig[p.method] || { color: '#6B7280', bgColor: 'bg-slate-500', label: 'Inconnu', icon: '?' };
                          return (
                            <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4">
                                <p className="text-sm text-slate-900">{p.createdAt ? new Date(p.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{p.createdAt ? new Date(p.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}</p>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-sm font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded">{p.orderId?.slice(0, 8) || '—'}</span>
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-sm text-slate-900">{p.customerName || 'Client'}</p>
                                <p className="text-xs text-slate-400">{p.customerPhone || ''}</p>
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-sm font-semibold text-slate-900">{formatCFA(p.amount)} <span className="text-xs font-normal text-slate-500">FCFA</span></p>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold" style={{ background: mi.color }}>
                                    {mi.icon}
                                  </div>
                                  <span className="text-sm text-slate-700">{mi.label}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(p.status)}`}>
                                  {statusLabels[p.status] || p.status}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-end gap-2">
                                  <button onClick={() => addToast('info', `Paiement #${p.id.slice(0,8)} — ${p.amount.toLocaleString()} FCFA via ${mi.label} — Statut: ${statusLabels[p.status] || p.status}`)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer" title="Voir">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                  </button>
                                  {(p.status === 'COMPLETED' || p.status === 'PENDING') && (
                                    <button onClick={() => addToast('warning', `Demande de remboursement envoyée pour ${p.amount.toLocaleString()} FCFA. Le vendeur sera notifié.`)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer" title="Rembourser">
                                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'escrow' && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900">Fonds en séquestre</h3>
                <p className="text-sm text-slate-500 mt-1">Montant total: {formatCFA(escrowVolume)} FCFA</p>
              </div>
              {held.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <p className="text-slate-500 font-medium">Aucun fonds en séquestre</p>
                  <p className="text-sm text-slate-400 mt-1">Les paiements en attente de validation apparaîtront ici</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Transaction</th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Commande</th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Montant</th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {held.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-sm font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded">{p.id?.slice(0, 8)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded">{p.orderId?.slice(0, 8)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-semibold text-blue-600">{formatCFA(p.amount)} FCFA</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-slate-700">{p.createdAt ? new Date(p.createdAt).toLocaleDateString('fr-FR') : '—'}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'installments' && <InstallmentPlan vehicleName="Pièces détachées" vehiclePrice={0} onPlanSelected={() => {}} />}
          {activeTab === 'ussd' && <UssdPaymentFlow />}
          {activeTab === 'agents' && <AgentNetwork />}
          {activeTab === 'crossborder' && <CrossBorderPayments />}
          {activeTab === 'whatsapp' && <WhatsAppIntegration />}
          {activeTab === 'inspection' && <VehicleInspection vehicleName="Véhicule" vehicleId="N/A" />}
        </main>
      </div>
    </div>
  );
}