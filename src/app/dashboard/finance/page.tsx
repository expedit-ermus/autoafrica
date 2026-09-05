'use client';
import { useState, useEffect, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardTopBar from '@/components/DashboardTopBar';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/contexts/ToastContext';
import Modal from '@/components/Modal';

type Invoice = {
  id: string;
  invoiceNumber: string;
  orderId?: string | null;
  sellerId: string;
  buyerId: string;
  status: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  dueDate?: string | null;
  paidAt?: string | null;
  notes?: string | null;
  createdAt: string;
  order?: { id: string; total: number; currency: string; status: string } | null;
};

type Account = {
  id: string;
  code: string;
  name: string;
  type: string;
  parentId?: string | null;
  balance: number;
  currency: string;
  active: boolean;
  createdAt: string;
  parent?: { id: string; code: string; name: string } | null;
  _count?: { children: number; transactions: number };
};

type Txn = {
  id: string;
  accountId: string;
  type: string;
  amount: number;
  balance: number;
  description?: string | null;
  reference?: string | null;
  date: string;
  account?: { id: string; code: string; name: string; type: string; currency: string } | null;
};

const INVOICE_STATUS: Record<string, string> = {
  DRAFT: 'Brouillon', SENT: 'Envoyée', VIEWED: 'Consultée', PAID: 'Payée',
  PARTIALLY_PAID: 'Partiellement payée', OVERDUE: 'En retard', CANCELLED: 'Annulée',
};
const INVOICE_COLORS: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-600 border-gray-200',
  SENT: 'bg-blue-50 text-blue-600 border-blue-200',
  VIEWED: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  PAID: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  PARTIALLY_PAID: 'bg-amber-50 text-amber-600 border-amber-200',
  OVERDUE: 'bg-red-50 text-red-600 border-red-200',
  CANCELLED: 'bg-gray-100 text-gray-400 border-gray-200',
};
const ACCOUNT_TYPES: Record<string, string> = {
  asset: 'Actif', liability: 'Passif', equity: 'Capitaux propres', revenue: 'Produit', expense: 'Charge',
};
const ACCOUNT_COLORS: Record<string, string> = {
  asset: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  liability: 'bg-amber-50 text-amber-600 border-amber-200',
  equity: 'bg-violet-50 text-violet-600 border-violet-200',
  revenue: 'bg-blue-50 text-blue-600 border-blue-200',
  expense: 'bg-red-50 text-red-600 border-red-200',
};

export default function FinancePage() {
  const { t } = useApp();
  const { addToast } = useToast();

  const [tab, setTab] = useState<'invoices' | 'accounts' | 'transactions'>('invoices');

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Txn[]>([]);

  const [invSearch, setInvSearch] = useState('');
  const [invStatus, setInvStatus] = useState('all');
  const [accSearch, setAccSearch] = useState('');
  const [accType, setAccType] = useState('all');
  const [txSearch, setTxSearch] = useState('');
  const [txType, setTxType] = useState('all');

  const [loading, setLoading] = useState(true);

  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showAddTxn, setShowAddTxn] = useState(false);
  const [showStatus, setShowStatus] = useState<Invoice | null>(null);

  const [invForm, setInvForm] = useState({ buyerId: '', sellerId: '', subtotal: '', taxRate: '18', dueDate: '', notes: '' });
  const [accForm, setAccForm] = useState({ code: '', name: '', type: 'asset', parentId: '', balance: '0', currency: 'XOF' });
  const [txForm, setTxForm] = useState({ accountId: '', type: 'debit', amount: '', description: '', reference: '', date: '' });
  const [statusForm, setStatusForm] = useState('');

  const [refreshKey, setRefreshKey] = useState(0);

  const formatCFA = (n: number) => new Intl.NumberFormat('fr-FR').format(n);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [invRes, accRes, txRes] = await Promise.all([
          fetch('/api/v1/invoices?pageSize=100', { credentials: 'include' }),
          fetch('/api/v1/accounts?pageSize=100', { credentials: 'include' }),
          fetch('/api/v1/finance/transactions?pageSize=100', { credentials: 'include' }),
        ]);
        const invData = await invRes.json();
        const accData = await accRes.json();
        const txData = await txRes.json();
        if (!cancelled) {
          if (invData.success) setInvoices(invData.data?.data || invData.data || []);
          if (accData.success) setAccounts(accData.data?.data || accData.data || []);
          if (txData.success) setTransactions(txData.data?.data || txData.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch finance data', err);
        if (!cancelled) addToast('error', 'Erreur lors du chargement des données financières');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [refreshKey, addToast]);

  const filteredInvoices = useMemo(() => {
    let list = invoices;
    if (invStatus !== 'all') list = list.filter(i => i.status === invStatus);
    if (invSearch) {
      const q = invSearch.toLowerCase();
      list = list.filter(i =>
        i.invoiceNumber.toLowerCase().includes(q) ||
        (i.notes || '').toLowerCase().includes(q) ||
        (i.order?.id || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [invoices, invSearch, invStatus]);

  const filteredAccounts = useMemo(() => {
    let list = accounts;
    if (accType !== 'all') list = list.filter(a => a.type === accType);
    if (accSearch) {
      const q = accSearch.toLowerCase();
      list = list.filter(a => a.code.toLowerCase().includes(q) || a.name.toLowerCase().includes(q));
    }
    return list;
  }, [accounts, accSearch, accType]);

  const filteredTransactions = useMemo(() => {
    let list = transactions;
    if (txType !== 'all') list = list.filter(t => t.type === txType);
    if (txSearch) {
      const q = txSearch.toLowerCase();
      list = list.filter(t =>
        (t.description || '').toLowerCase().includes(q) ||
        (t.reference || '').toLowerCase().includes(q) ||
        (t.account?.name || '').toLowerCase().includes(q) ||
        (t.account?.code || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [transactions, txSearch, txType]);

  const handleAddInvoice = async () => {
    if (!invForm.buyerId || !invForm.sellerId || !invForm.subtotal) {
      addToast('error', 'Acheteur, vendeur et sous-total sont requis');
      return;
    }
    try {
      const res = await fetch('/api/v1/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          buyerId: invForm.buyerId,
          sellerId: invForm.sellerId,
          subtotal: Number(invForm.subtotal),
          taxRate: Number(invForm.taxRate) || 18,
          dueDate: invForm.dueDate || undefined,
          notes: invForm.notes || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', 'Facture créée');
        setShowAddInvoice(false);
        setInvForm({ buyerId: '', sellerId: '', subtotal: '', taxRate: '18', dueDate: '', notes: '' });
        setRefreshKey(k => k + 1);
      } else {
        addToast('error', data.message || 'Erreur lors de la création');
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur lors de la création de la facture');
    }
  };

  const handleAddAccount = async () => {
    if (!accForm.code || !accForm.name || !accForm.type) {
      addToast('error', 'Code, nom et type sont requis');
      return;
    }
    try {
      const res = await fetch('/api/v1/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          code: accForm.code,
          name: accForm.name,
          type: accForm.type,
          parentId: accForm.parentId || undefined,
          balance: Number(accForm.balance) || 0,
          currency: accForm.currency || 'XOF',
        }),
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', 'Compte créé');
        setShowAddAccount(false);
        setAccForm({ code: '', name: '', type: 'asset', parentId: '', balance: '0', currency: 'XOF' });
        setRefreshKey(k => k + 1);
      } else {
        addToast('error', data.message || 'Erreur lors de la création');
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur lors de la création du compte');
    }
  };

  const handleAddTxn = async () => {
    if (!txForm.accountId || !txForm.amount) {
      addToast('error', 'Compte et montant sont requis');
      return;
    }
    try {
      const res = await fetch('/api/v1/finance/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          accountId: txForm.accountId,
          type: txForm.type,
          amount: Number(txForm.amount),
          description: txForm.description || undefined,
          reference: txForm.reference || undefined,
          date: txForm.date || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', 'Écriture enregistrée');
        setShowAddTxn(false);
        setTxForm({ accountId: '', type: 'debit', amount: '', description: '', reference: '', date: '' });
        setRefreshKey(k => k + 1);
      } else {
        addToast('error', data.message || 'Erreur lors de l\'enregistrement');
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur lors de l\'enregistrement de l\'écriture');
    }
  };

  const handleStatus = async () => {
    if (!showStatus || !statusForm) return;
    try {
      const res = await fetch(`/api/v1/invoices/${showStatus.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: statusForm }),
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', 'Statut mis à jour');
        setShowStatus(null);
        setStatusForm('');
        setRefreshKey(k => k + 1);
      } else {
        addToast('error', data.message || 'Erreur lors du changement de statut');
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur lors du changement de statut');
    }
  };

  const tabs = [
    { key: 'invoices' as const, label: 'Factures', count: invoices.length },
    { key: 'accounts' as const, label: 'Comptes', count: accounts.length },
    { key: 'transactions' as const, label: 'Écritures', count: transactions.length },
  ];

  return (
    <div className="flex min-h-screen bg-[#F0F2F5]">
      <Sidebar />
      <div className="flex-1 min-w-0 lg:ml-[260px]">
        <DashboardTopBar />
        <main className="p-4 lg:p-8 pb-24 lg:pb-8 max-w-[1400px] mx-auto">

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 animate-fade-in">
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">{t.nav.finance}</h1>
              <p className="text-sm text-gray-500 mt-1">
                Facturation, plan comptable et écritures comptables
              </p>
            </div>
            <div className="flex items-center gap-2">
              {tab === 'invoices' && (
                <button onClick={() => setShowAddInvoice(true)} className="btn-primary !py-2 !px-4 !text-xs">
                  + Nouvelle facture
                </button>
              )}
              {tab === 'accounts' && (
                <button onClick={() => setShowAddAccount(true)} className="btn-primary !py-2 !px-4 !text-xs">
                  + Nouveau compte
                </button>
              )}
              {tab === 'transactions' && (
                <button onClick={() => setShowAddTxn(true)} className="btn-primary !py-2 !px-4 !text-xs">
                  + Nouvelle écriture
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-1 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 mb-6 w-fit animate-fade-in">
            {tabs.map(tb => (
              <button
                key={tb.key}
                onClick={() => setTab(tb.key)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  tab === tb.key ? 'bg-[#0F172A] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {tb.label}
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${tab === tb.key ? 'bg-white/20' : 'bg-gray-100'}`}>
                  {tb.count}
                </span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-14 rounded-xl skeleton" />)}
            </div>
          ) : (
            <>
              {tab === 'invoices' && (
                <div className="glass-card animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-6 pb-4 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <input aria-label="Rechercher facture"
                        value={invSearch}
                        onChange={e => setInvSearch(e.target.value)}
                        placeholder="Rechercher facture..."
                        className="input-field !min-h-[38px] !py-2 !text-xs w-full sm:w-64"
                      />
                      <select
                        value={invStatus}
                        onChange={e => setInvStatus(e.target.value)}
                        className="input-field !min-h-[38px] !py-2 !text-xs"
                      >
                        <option value="all">Tous les statuts</option>
                        {Object.entries(INVOICE_STATUS).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => setRefreshKey(k => k + 1)}
                      className="text-[11px] text-orange-600 font-semibold hover:text-orange-700 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Actualiser
                    </button>
                  </div>

                  {filteredInvoices.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium">Aucune facture</p>
                    </div>
                  ) : (
                    <>
                      <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-100">
                              <th className="text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">N°</th>
                              <th className="text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Vendeur</th>
                              <th className="text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Acheteur</th>
                              <th className="text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Échéance</th>
                              <th className="text-right text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Total</th>
                              <th className="text-center text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Statut</th>
                              <th className="text-right text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredInvoices.map(inv => (
                              <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                  <span className="font-mono text-xs font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded-md">{inv.invoiceNumber}</span>
                                </td>
                                <td className="px-6 py-4 text-xs text-gray-500">{inv.sellerId.slice(0, 8)}</td>
                                <td className="px-6 py-4 text-xs text-gray-500">{inv.buyerId.slice(0, 8)}</td>
                                <td className="px-6 py-4 text-xs text-gray-500">{inv.dueDate ? new Date(inv.dueDate).toISOString().split('T')[0] : '—'}</td>
                                <td className="px-6 py-4 text-right">
                                  <span className="text-sm font-bold text-gray-900">{formatCFA(inv.totalAmount)} <span className="text-[10px] font-medium text-gray-400">{inv.currency}</span></span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <span className={`badge border ${INVOICE_COLORS[inv.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                    {INVOICE_STATUS[inv.status] || inv.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button
                                    onClick={() => { setShowStatus(inv); setStatusForm(inv.status); }}
                                    className="text-[11px] font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                                  >
                                    Changer statut
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="lg:hidden p-4 space-y-3">
                        {filteredInvoices.map(inv => (
                          <div key={inv.id} className="p-4 rounded-xl border border-gray-100">
                            <div className="flex items-start justify-between mb-2">
                              <span className="font-mono text-[11px] font-semibold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">{inv.invoiceNumber}</span>
                              <span className={`badge border ${INVOICE_COLORS[inv.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                {INVOICE_STATUS[inv.status] || inv.status}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-400">
                                {inv.dueDate ? new Date(inv.dueDate).toISOString().split('T')[0] : '—'} · {inv.buyerId.slice(0, 8)}
                              </span>
                              <span className="text-sm font-bold text-gray-900">{formatCFA(inv.totalAmount)} {inv.currency}</span>
                            </div>
                            <button
                              onClick={() => { setShowStatus(inv); setStatusForm(inv.status); }}
                              className="mt-3 w-full py-1.5 text-[11px] font-semibold text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                            >
                              Changer statut
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {tab === 'accounts' && (
                <div className="glass-card animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-6 pb-4 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <input aria-label="Rechercher compte"
                        value={accSearch}
                        onChange={e => setAccSearch(e.target.value)}
                        placeholder="Rechercher compte..."
                        className="input-field !min-h-[38px] !py-2 !text-xs w-full sm:w-64"
                      />
                      <select
                        value={accType}
                        onChange={e => setAccType(e.target.value)}
                        className="input-field !min-h-[38px] !py-2 !text-xs"
                      >
                        <option value="all">Tous les types</option>
                        {Object.entries(ACCOUNT_TYPES).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {filteredAccounts.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                      <p className="text-sm font-medium">Aucun compte comptable</p>
                    </div>
                  ) : (
                    <>
                      <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-100">
                              <th className="text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Code</th>
                              <th className="text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Nom</th>
                              <th className="text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Type</th>
                              <th className="text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Parent</th>
                              <th className="text-right text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Solde</th>
                              <th className="text-right text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Écritures</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredAccounts.map(acc => (
                              <tr key={acc.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                  <span className="font-mono text-xs font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded-md">{acc.code}</span>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-700">{acc.name}</td>
                                <td className="px-6 py-4">
                                  <span className={`badge border ${ACCOUNT_COLORS[acc.type] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                    {ACCOUNT_TYPES[acc.type] || acc.type}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-xs text-gray-500">{acc.parent?.code ? `${acc.parent.code} · ${acc.parent.name}` : '—'}</td>
                                <td className="px-6 py-4 text-right">
                                  <span className={`text-sm font-bold ${acc.balance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                                    {formatCFA(acc.balance)} <span className="text-[10px] font-medium text-gray-400">{acc.currency}</span>
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right text-xs text-gray-500">{acc._count?.transactions ?? 0}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="lg:hidden p-4 space-y-3">
                        {filteredAccounts.map(acc => (
                          <div key={acc.id} className="p-4 rounded-xl border border-gray-100">
                            <div className="flex items-start justify-between mb-2">
                              <span className="font-mono text-[11px] font-semibold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">{acc.code}</span>
                              <span className={`badge border ${ACCOUNT_COLORS[acc.type] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                {ACCOUNT_TYPES[acc.type] || acc.type}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-gray-800 mb-1">{acc.name}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-400">{acc._count?.transactions ?? 0} écritures</span>
                              <span className="text-sm font-bold text-gray-900">{formatCFA(acc.balance)} {acc.currency}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {tab === 'transactions' && (
                <div className="glass-card animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-6 pb-4 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <input aria-label="Rechercher écriture"
                        value={txSearch}
                        onChange={e => setTxSearch(e.target.value)}
                        placeholder="Rechercher écriture..."
                        className="input-field !min-h-[38px] !py-2 !text-xs w-full sm:w-64"
                      />
                      <select
                        value={txType}
                        onChange={e => setTxType(e.target.value)}
                        className="input-field !min-h-[38px] !py-2 !text-xs"
                      >
                        <option value="all">Débit & crédit</option>
                        <option value="debit">Débit</option>
                        <option value="credit">Crédit</option>
                      </select>
                    </div>
                  </div>

                  {filteredTransactions.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                      <p className="text-sm font-medium">Aucune écriture comptable</p>
                    </div>
                  ) : (
                    <>
                      <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-100">
                              <th className="text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Date</th>
                              <th className="text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Compte</th>
                              <th className="text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Description</th>
                              <th className="text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Référence</th>
                              <th className="text-right text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Montant</th>
                              <th className="text-center text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Type</th>
                              <th className="text-right text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Solde</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredTransactions.map(tx => (
                              <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 text-xs text-gray-500">{new Date(tx.date).toISOString().split('T')[0]}</td>
                                <td className="px-6 py-4">
                                  <span className="font-mono text-xs font-semibold text-gray-900">{tx.account?.code}</span>
                                  <span className="text-xs text-gray-500 ml-2">{tx.account?.name}</span>
                                </td>
                                <td className="px-6 py-4 text-xs text-gray-600">{tx.description || '—'}</td>
                                <td className="px-6 py-4 text-xs text-gray-400 font-mono">{tx.reference || '—'}</td>
                                <td className="px-6 py-4 text-right">
                                  <span className={`text-sm font-bold ${tx.type === 'debit' ? 'text-red-600' : 'text-emerald-600'}`}>
                                    {tx.type === 'debit' ? '−' : '+'} {formatCFA(tx.amount)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <span className={`badge border ${tx.type === 'debit' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                                    {tx.type === 'debit' ? 'Débit' : 'Crédit'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right text-xs text-gray-500">{formatCFA(tx.balance)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="lg:hidden p-4 space-y-3">
                        {filteredTransactions.map(tx => (
                          <div key={tx.id} className="p-4 rounded-xl border border-gray-100">
                            <div className="flex items-start justify-between mb-2">
                              <span className={`badge border ${tx.type === 'debit' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                                {tx.type === 'debit' ? 'Débit' : 'Crédit'}
                              </span>
                              <span className="text-xs text-gray-400">{new Date(tx.date).toISOString().split('T')[0]}</span>
                            </div>
                            <p className="text-sm font-medium text-gray-800 mb-1">{tx.account?.name}</p>
                            <p className="text-xs text-gray-500 mb-2">{tx.description || '—'}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-400">Solde {formatCFA(tx.balance)}</span>
                              <span className={`text-sm font-bold ${tx.type === 'debit' ? 'text-red-600' : 'text-emerald-600'}`}>
                                {tx.type === 'debit' ? '−' : '+'} {formatCFA(tx.amount)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}

          {/* Add Invoice Modal */}
          <Modal isOpen={showAddInvoice} onClose={() => setShowAddInvoice(false)} title="Nouvelle facture">
            <div className="space-y-4">
              <div>
                <label htmlFor="vendeur-id" className="block text-xs font-semibold text-gray-600 mb-1.5">Vendeur (ID)</label>
                <input id="vendeur-id"
                  value={invForm.sellerId}
                  onChange={e => setInvForm(f => ({ ...f, sellerId: e.target.value }))}
                  placeholder="ID utilisateur vendeur"
                  className="input-field !text-sm"
                />
              </div>
              <div>
                <label htmlFor="acheteur-id" className="block text-xs font-semibold text-gray-600 mb-1.5">Acheteur (ID)</label>
                <input id="acheteur-id"
                  value={invForm.buyerId}
                  onChange={e => setInvForm(f => ({ ...f, buyerId: e.target.value }))}
                  placeholder="ID utilisateur acheteur"
                  className="input-field !text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="sous-total-fcfa" className="block text-xs font-semibold text-gray-600 mb-1.5">Sous-total (FCFA)</label>
                  <input id="sous-total-fcfa"
                    type="number" inputMode="numeric"
                    value={invForm.subtotal}
                    onChange={e => setInvForm(f => ({ ...f, subtotal: e.target.value }))}
                    placeholder="10000"
                    className="input-field !text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="tva" className="block text-xs font-semibold text-gray-600 mb-1.5">TVA (%)</label>
                  <input id="tva"
                    type="number" inputMode="numeric"
                    value={invForm.taxRate}
                    onChange={e => setInvForm(f => ({ ...f, taxRate: e.target.value }))}
                    placeholder="18"
                    className="input-field !text-sm"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="echeance" className="block text-xs font-semibold text-gray-600 mb-1.5">Échéance</label>
                <input id="echeance"
                  type="date"
                  value={invForm.dueDate}
                  onChange={e => setInvForm(f => ({ ...f, dueDate: e.target.value }))}
                  className="input-field !text-sm"
                />
              </div>
              <div>
                <label htmlFor="notes" className="block text-xs font-semibold text-gray-600 mb-1.5">Notes</label>
                <textarea id="notes"
                  value={invForm.notes}
                  onChange={e => setInvForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Notes internes..."
                  rows={2}
                  className="input-field !text-sm resize-none"
                />
              </div>
              <button onClick={handleAddInvoice} className="btn-primary w-full">
                Créer la facture
              </button>
            </div>
          </Modal>

          {/* Add Account Modal */}
          <Modal isOpen={showAddAccount} onClose={() => setShowAddAccount(false)} title="Nouveau compte comptable">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="code" className="block text-xs font-semibold text-gray-600 mb-1.5">Code</label>
                  <input id="code"
                    value={accForm.code}
                    onChange={e => setAccForm(f => ({ ...f, code: e.target.value }))}
                    placeholder="A1 / 411..."
                    className="input-field !text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="type" className="block text-xs font-semibold text-gray-600 mb-1.5">Type</label>
                  <select id="type"
                    value={accForm.type}
                    onChange={e => setAccForm(f => ({ ...f, type: e.target.value }))}
                    className="input-field !text-sm"
                  >
                    {Object.entries(ACCOUNT_TYPES).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="nom" className="block text-xs font-semibold text-gray-600 mb-1.5">Nom</label>
                <input id="nom"
                  value={accForm.name}
                  onChange={e => setAccForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Caisse, Banque, Ventes..."
                  className="input-field !text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="compte-parent-id" className="block text-xs font-semibold text-gray-600 mb-1.5">Compte parent (ID)</label>
                  <input id="compte-parent-id"
                    value={accForm.parentId}
                    onChange={e => setAccForm(f => ({ ...f, parentId: e.target.value }))}
                    placeholder="Optionnel"
                    className="input-field !text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="solde-initial" className="block text-xs font-semibold text-gray-600 mb-1.5">Solde initial</label>
                  <input id="solde-initial"
                    type="number" inputMode="numeric"
                    value={accForm.balance}
                    onChange={e => setAccForm(f => ({ ...f, balance: e.target.value }))}
                    placeholder="0"
                    className="input-field !text-sm"
                  />
                </div>
              </div>
              <button onClick={handleAddAccount} className="btn-primary w-full">
                Créer le compte
              </button>
            </div>
          </Modal>

          {/* Add Transaction Modal */}
          <Modal isOpen={showAddTxn} onClose={() => setShowAddTxn(false)} title="Nouvelle écriture comptable">
            <div className="space-y-4">
              <div>
                <label htmlFor="compte" className="block text-xs font-semibold text-gray-600 mb-1.5">Compte</label>
                <select id="compte"
                  value={txForm.accountId}
                  onChange={e => setTxForm(f => ({ ...f, accountId: e.target.value }))}
                  className="input-field !text-sm"
                >
                  <option value="">Sélectionner un compte...</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.code} · {acc.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="type-2" className="block text-xs font-semibold text-gray-600 mb-1.5">Type</label>
                  <select id="type-2"
                    value={txForm.type}
                    onChange={e => setTxForm(f => ({ ...f, type: e.target.value }))}
                    className="input-field !text-sm"
                  >
                    <option value="debit">Débit</option>
                    <option value="credit">Crédit</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="montant-fcfa" className="block text-xs font-semibold text-gray-600 mb-1.5">Montant (FCFA)</label>
                  <input id="montant-fcfa"
                    type="number" inputMode="numeric"
                    value={txForm.amount}
                    onChange={e => setTxForm(f => ({ ...f, amount: e.target.value }))}
                    placeholder="0"
                    className="input-field !text-sm"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="description" className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
                <input id="description"
                  value={txForm.description}
                  onChange={e => setTxForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Description de l'écriture"
                  className="input-field !text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="reference" className="block text-xs font-semibold text-gray-600 mb-1.5">Référence</label>
                  <input id="reference"
                    value={txForm.reference}
                    onChange={e => setTxForm(f => ({ ...f, reference: e.target.value }))}
                    placeholder="N° facture / PO"
                    className="input-field !text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="date" className="block text-xs font-semibold text-gray-600 mb-1.5">Date</label>
                  <input id="date"
                    type="date"
                    value={txForm.date}
                    onChange={e => setTxForm(f => ({ ...f, date: e.target.value }))}
                    className="input-field !text-sm"
                  />
                </div>
              </div>
              <button onClick={handleAddTxn} className="btn-primary w-full">
                Enregistrer l&apos;écriture
              </button>
            </div>
          </Modal>

          {/* Status Modal */}
          <Modal isOpen={!!showStatus} onClose={() => setShowStatus(null)} title="Changer le statut">
            {showStatus && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-gray-900">{showStatus.invoiceNumber}</span>
                  <span className="text-sm font-bold text-gray-900">{formatCFA(showStatus.totalAmount)} {showStatus.currency}</span>
                </div>
                <div>
                  <label htmlFor="statut" className="block text-xs font-semibold text-gray-600 mb-1.5">Statut</label>
                  <select id="statut"
                    value={statusForm}
                    onChange={e => setStatusForm(e.target.value)}
                    className="input-field !text-sm"
                  >
                    {Object.entries(INVOICE_STATUS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <button onClick={handleStatus} className="btn-primary w-full">
                  Mettre à jour
                </button>
              </div>
            )}
          </Modal>
        </main>
      </div>
    </div>
  );
}
