'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardTopBar from '@/components/DashboardTopBar';
import { useToast } from '@/contexts/ToastContext';
import { useApp } from '@/contexts/AppContext';
import Modal from '@/components/Modal';

type PurchaseOrder = {
  id: string;
  poNumber: string;
  supplierId: string;
  supplier?: { id: string; name: string; country: string; verified: boolean } | null;
  warehouse?: { id: string; name: string; city: string } | null;
  status: string;
  totalAmount: number;
  currency: string;
  paymentTerms?: string | null;
  expectedDate?: string | null;
  shippingMethod?: string | null;
  trackingNumber?: string | null;
  notes?: string | null;
  approvedBy?: string | null;
  approvedAt?: string | null;
  createdAt: string;
  _count?: { items: number };
  items?: PurchaseOrderItem[];
};

type PurchaseOrderItem = {
  id: string;
  productName: string;
  reference?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

type Supplier = { id: string; name: string; country: string; paymentTerms?: string | null };

const PO_STATUSES = ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'ORDERED', 'SHIPPED', 'IN_TRANSIT', 'CUSTOMS', 'DELIVERED', 'COMPLETED', 'CANCELLED'];
const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-600 border-gray-200',
  PENDING_APPROVAL: 'bg-amber-50 text-amber-600 border-amber-200',
  APPROVED: 'bg-blue-50 text-blue-600 border-blue-200',
  ORDERED: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  SHIPPED: 'bg-purple-50 text-purple-600 border-purple-200',
  IN_TRANSIT: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  CUSTOMS: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  DELIVERED: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  COMPLETED: 'bg-green-50 text-green-600 border-green-200',
  CANCELLED: 'bg-red-50 text-red-600 border-red-200',
};
const SHIPPING_METHODS = ['sea', 'air', 'road'];

type FormItem = { productName: string; reference: string; quantity: string; unitPrice: string };

export default function PurchaseOrdersPage() {
  const { addToast } = useToast();
  const { locale } = useApp();
  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const STATUS_LABELS: Record<string, string> = {
    DRAFT: L('Brouillon', 'Draft'), PENDING_APPROVAL: L('En attente', 'Pending approval'), APPROVED: L('Approuvé', 'Approved'), ORDERED: L('Commandé', 'Ordered'), SHIPPED: L('Expédié', 'Shipped'),
    IN_TRANSIT: L('En transit', 'In transit'), CUSTOMS: L('Douane', 'Customs'), DELIVERED: L('Livré', 'Delivered'), COMPLETED: L('Terminé', 'Completed'), CANCELLED: L('Annulé', 'Cancelled'),
  };

  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [detail, setDetail] = useState<PurchaseOrder | null>(null);

  const [form, setForm] = useState({
    supplierId: '', warehouseId: '', status: 'DRAFT', currency: 'USD',
    paymentTerms: 'NET30', expectedDate: '', shippingMethod: 'sea', trackingNumber: '', notes: '',
  });
  const [items, setItems] = useState<FormItem[]>([{ productName: '', reference: '', quantity: '', unitPrice: '' }]);

  const formatMoney = useCallback((n: number, currency = 'USD') =>
    new Intl.NumberFormat('fr-FR').format(n) + ' ' + currency, []);
  const formatDate = useCallback((d?: string | null) =>
    d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—', []);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [oRes, sRes] = await Promise.all([
          fetch('/api/v1/purchase-orders', { credentials: 'include' }),
          fetch('/api/v1/suppliers?pageSize=100', { credentials: 'include' }),
        ]);
        const oData = await oRes.json();
        const sData = await sRes.json();
        if (!cancelled) {
          if (oData.success) setOrders(oData.data?.data || oData.data || []);
          if (sData.success) setSuppliers(sData.data?.data || sData.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch purchase orders', err);
        if (!cancelled) addToast('error', 'Erreur lors du chargement des bons de commande');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [refreshKey, addToast]);

  const stats = useMemo(() => {
    const total = orders.length;
    const open = orders.filter(o => !['COMPLETED', 'CANCELLED', 'DELIVERED'].includes(o.status)).length;
    const totalAmount = orders.reduce((acc, o) => acc + o.totalAmount, 0);
    const inTransit = orders.filter(o => ['SHIPPED', 'IN_TRANSIT', 'CUSTOMS'].includes(o.status)).length;
    return { total, open, totalAmount, inTransit };
  }, [orders]);

  const filtered = useMemo(() => orders.filter(o => {
    const matchSearch = `${o.poNumber} ${o.supplier?.name || ''} ${o.trackingNumber || ''}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  }), [orders, search, statusFilter]);

  const resetForm = () => {
    setForm({ supplierId: '', warehouseId: '', status: 'DRAFT', currency: 'USD', paymentTerms: 'NET30', expectedDate: '', shippingMethod: 'sea', trackingNumber: '', notes: '' });
    setItems([{ productName: '', reference: '', quantity: '', unitPrice: '' }]);
  };

  const payload = () => ({
    supplierId: form.supplierId,
    warehouseId: form.warehouseId || undefined,
    status: form.status,
    currency: form.currency,
    paymentTerms: form.paymentTerms || undefined,
    expectedDate: form.expectedDate || undefined,
    shippingMethod: form.shippingMethod || undefined,
    trackingNumber: form.trackingNumber || undefined,
    notes: form.notes || undefined,
    items: items
      .filter(i => i.productName.trim() && i.quantity && i.unitPrice)
      .map(i => ({ productName: i.productName, reference: i.reference || undefined, quantity: Number(i.quantity), unitPrice: Number(i.unitPrice) })),
  });

  const handleAdd = async () => {
    const p = payload();
    if (!p.supplierId) { addToast('error', 'Fournisseur requis'); return; }
    if (p.items.length === 0) { addToast('error', 'Ajoutez au moins un article'); return; }
    try {
      const res = await fetch('/api/v1/purchase-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(p),
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', `Bon de commande ${data.data.poNumber} cree`);
        setShowAdd(false);
        resetForm();
        setRefreshKey(k => k + 1);
      } else {
        addToast('error', data.message || 'Erreur lors de la creation');
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur lors de la creation du bon de commande');
    }
  };

  const handleStatusChange = async (o: PurchaseOrder, status: string) => {
    try {
      const res = await fetch(`/api/v1/purchase-orders/${o.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', `${o.poNumber} -> ${STATUS_LABELS[status] || status}`);
        setRefreshKey(k => k + 1);
      } else {
        addToast('error', data.message || 'Erreur lors du changement de statut');
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur lors du changement de statut');
    }
  };

  const handleDelete = async (o: PurchaseOrder) => {
    if (!window.confirm(`Supprimer le bon ${o.poNumber} ?`)) return;
    try {
      const res = await fetch(`/api/v1/purchase-orders/${o.id}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        addToast('success', 'Bon de commande supprime');
        if (detail?.id === o.id) setDetail(null);
        setRefreshKey(k => k + 1);
      } else {
        addToast('error', data.message || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur lors de la suppression');
    }
  };

  const inputCls = 'w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-400 text-sm';
  const labelCls = 'block text-xs font-medium text-gray-500 mb-1';

  return (
    <div className="min-h-screen bg-[#F6F8FB]">
      <Sidebar />
      <div className="lg:pl-[72px] transition-all duration-300">
        <DashboardTopBar />
        <main className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Approvisionnement</h1>
              <p className="text-sm text-gray-500 mt-1">Bons de commande fournisseurs et suivi d&apos;importation</p>
            </div>
            <button
              onClick={() => { resetForm(); setShowAdd(true); }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold shadow-lg shadow-orange-500/25 hover:opacity-95 transition-opacity"
            >
              + Nouveau bon de commande
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-28 rounded-2xl bg-white animate-pulse" />)}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Bons de commande</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">En cours</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">{stats.open}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">En transit</p>
                  <p className="text-2xl font-bold text-cyan-600 mt-1">{stats.inTransit}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Valeur totale</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{formatMoney(stats.totalAmount)}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Rechercher (n°, fournisseur, tracking...)"
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-400 text-sm"
                  />
                  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white">
                    <option value="all">Tous les statuts</option>
                    {PO_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s] || s}</option>)}
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                        <th className="px-4 py-3 font-medium">N° commande</th>
                        <th className="px-4 py-3 font-medium">Fournisseur</th>
                        <th className="px-4 py-3 font-medium">Statut</th>
                        <th className="px-4 py-3 font-medium">Montant</th>
                        <th className="px-4 py-3 font-medium">Echeance</th>
                        <th className="px-4 py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                            Aucun bon de commande trouve
                          </td>
                        </tr>
                      )}
                      {filtered.map(o => (
                        <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="px-4 py-3">
                            <button onClick={() => setDetail(o)} className="font-semibold text-gray-900 hover:text-orange-600 text-left">
                              {o.poNumber}
                            </button>
                            <p className="text-xs text-gray-400">{o._count?.items ?? 0} articles</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-gray-700">{o.supplier?.name || '—'}</span>
                            {o.supplier?.verified && <span className="ml-1 text-emerald-500 text-xs">✓</span>}
                            <p className="text-xs text-gray-400">{o.supplier?.country || ''}</p>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={o.status}
                              onChange={e => handleStatusChange(o, e.target.value)}
                              className={`px-2 py-1 rounded-full border text-xs font-medium cursor-pointer ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-600'}`}
                            >
                              {PO_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s] || s}</option>)}
                            </select>
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-900">{formatMoney(o.totalAmount, o.currency)}</td>
                          <td className="px-4 py-3 text-gray-600">{formatDate(o.expectedDate)}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button onClick={() => setDetail(o)} className="text-gray-400 hover:text-orange-600 text-xs font-medium">Voir</button>
                              <button onClick={() => handleDelete(o)} className="text-gray-400 hover:text-red-600 text-xs font-medium">Suppr.</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          <Modal isOpen={showAdd} onClose={() => setShowAdd(false)}>
            <div className="p-6 max-w-2xl">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Nouveau bon de commande</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={labelCls}>Fournisseur *</label>
                  <select className={inputCls} value={form.supplierId} onChange={e => setForm({ ...form, supplierId: e.target.value })}>
                    <option value="">Selectionner un fournisseur</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.country})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Statut</label>
                  <select className={inputCls} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    {PO_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s] || s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Devise</label>
                  <select className={inputCls} value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}>
                    <option value="USD">USD</option>
                    <option value="CNY">CNY</option>
                    <option value="EUR">EUR</option>
                    <option value="XOF">XOF</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Conditions de paiement</label>
                  <select className={inputCls} value={form.paymentTerms} onChange={e => setForm({ ...form, paymentTerms: e.target.value })}>
                    <option value="NET30">NET30</option>
                    <option value="NET60">NET60</option>
                    <option value="NET90">NET90</option>
                    <option value="LC">LC</option>
                    <option value="TT">TT</option>
                    <option value="COD">COD</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Transport</label>
                  <select className={inputCls} value={form.shippingMethod} onChange={e => setForm({ ...form, shippingMethod: e.target.value })}>
                    {SHIPPING_METHODS.map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Echeance</label>
                  <input className={inputCls} type="date" value={form.expectedDate} onChange={e => setForm({ ...form, expectedDate: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Tracking number</label>
                  <input className={inputCls} value={form.trackingNumber} onChange={e => setForm({ ...form, trackingNumber: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Notes</label>
                  <textarea className={inputCls} rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-700">Articles</p>
                  <button
                    onClick={() => setItems([...items, { productName: '', reference: '', quantity: '', unitPrice: '' }])}
                    className="text-xs font-medium text-orange-600 hover:text-orange-700"
                  >
                    + Ajouter un article
                  </button>
                </div>
                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                      <input
                        className={`${inputCls} col-span-4`}
                        placeholder="Produit"
                        value={item.productName}
                        onChange={e => { const next = [...items]; next[idx] = { ...item, productName: e.target.value }; setItems(next); }}
                      />
                      <input
                        className={`${inputCls} col-span-3`}
                        placeholder="Reference"
                        value={item.reference}
                        onChange={e => { const next = [...items]; next[idx] = { ...item, reference: e.target.value }; setItems(next); }}
                      />
                      <input
                        className={`${inputCls} col-span-2`}
                        placeholder="Qte"
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => { const next = [...items]; next[idx] = { ...item, quantity: e.target.value }; setItems(next); }}
                      />
                      <input
                        className={`${inputCls} col-span-2`}
                        placeholder="PU"
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        onChange={e => { const next = [...items]; next[idx] = { ...item, unitPrice: e.target.value }; setItems(next); }}
                      />
                      <button
                        onClick={() => setItems(items.filter((_, i) => i !== idx))}
                        className="col-span-1 text-gray-400 hover:text-red-500 text-sm"
                        aria-label="Supprimer l'article"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAdd(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50">
                  Annuler
                </button>
                <button onClick={handleAdd} className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold shadow-lg shadow-orange-500/25">
                  Creer le bon de commande
                </button>
              </div>
            </div>
          </Modal>

          <Modal isOpen={!!detail} onClose={() => setDetail(null)}>
            {detail && (
              <div className="p-6 max-w-2xl">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{detail.poNumber}</h2>
                    <p className="text-sm text-gray-500">
                      {detail.supplier?.name || 'Fournisseur inconnu'} · {formatDate(detail.createdAt)}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full border text-xs font-medium ${STATUS_COLORS[detail.status] || ''}`}>
                    {STATUS_LABELS[detail.status] || detail.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-gray-900">{detail._count?.items ?? detail.items?.length ?? 0}</p>
                    <p className="text-xs text-gray-400">Articles</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-gray-900">{formatMoney(detail.totalAmount, detail.currency)}</p>
                    <p className="text-xs text-gray-400">Montant</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-gray-900">{detail.shippingMethod ? detail.shippingMethod.toUpperCase() : '—'}</p>
                    <p className="text-xs text-gray-400">Transport</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm mb-5">
                  {detail.trackingNumber && (
                    <div className="flex justify-between"><span className="text-gray-500">Tracking</span><span className="font-medium">{detail.trackingNumber}</span></div>
                  )}
                  {detail.paymentTerms && (
                    <div className="flex justify-between"><span className="text-gray-500">Conditions</span><span className="font-medium">{detail.paymentTerms}</span></div>
                  )}
                  {detail.expectedDate && (
                    <div className="flex justify-between"><span className="text-gray-500">Echeance</span><span className="font-medium">{formatDate(detail.expectedDate)}</span></div>
                  )}
                  {detail.approvedAt && (
                    <div className="flex justify-between"><span className="text-gray-500">Approuve le</span><span className="font-medium">{formatDate(detail.approvedAt)}</span></div>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Articles ({detail.items?.length ?? 0})</p>
                  {(detail.items && detail.items.length > 0) ? (
                    <div className="space-y-2">
                      {detail.items.map((item: { id: string; productName: string; reference?: string | null; quantity: number; unitPrice: number; totalPrice: number }) => (
                        <div key={item.id} className="flex items-center justify-between text-sm bg-gray-50 rounded-lg px-3 py-2">
                          <div>
                            <p className="font-medium text-gray-800">{item.productName}</p>
                            {item.reference && <p className="text-xs text-gray-400">{item.reference}</p>}
                          </div>
                          <div className="text-right">
                            <p className="text-gray-700">{item.quantity} x {formatMoney(item.unitPrice, detail.currency)}</p>
                            <p className="font-semibold text-gray-900">{formatMoney(item.totalPrice, detail.currency)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">Pas d&apos;articles</p>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setDetail(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50">
                    Fermer
                  </button>
                </div>
              </div>
            )}
          </Modal>
        </main>
      </div>
    </div>
  );
}
