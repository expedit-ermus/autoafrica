'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardTopBar from '@/components/DashboardTopBar';
import { useToast } from '@/contexts/ToastContext';
import { useApp } from '@/contexts/AppContext';
import Modal from '@/components/Modal';

type Container = {
  id: string;
  containerNumber: string;
  purchaseOrderId?: string | null;
  purchaseOrder?: { id: string; poNumber: string; totalAmount: number; currency: string; status: string } | null;
  size: string;
  status: string;
  originPort: string;
  destinationPort: string;
  shippingLine?: string | null;
  vesselName?: string | null;
  etaOrigin?: string | null;
  etaDestination?: string | null;
  departedAt?: string | null;
  arrivedAt?: string | null;
  clearedAt?: string | null;
  createdAt: string;
  customsRecord?: { id: string; status: string } | null;
};

type PurchaseOrder = { id: string; poNumber: string };

const CONTAINER_STATUSES = ['LOADING', 'SHIPPED', 'IN_TRANSIT', 'ARRIVED_PORT', 'CUSTOMS_PROCESSING', 'CUSTOMS_CLEARED', 'DELIVERED_TO_WAREHOUSE', 'COMPLETED'];
const STATUS_COLORS: Record<string, string> = {
  LOADING: 'bg-gray-100 text-gray-600 border-gray-200',
  SHIPPED: 'bg-purple-50 text-purple-600 border-purple-200',
  IN_TRANSIT: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  ARRIVED_PORT: 'bg-blue-50 text-blue-600 border-blue-200',
  CUSTOMS_PROCESSING: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  CUSTOMS_CLEARED: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  DELIVERED_TO_WAREHOUSE: 'bg-green-50 text-green-600 border-green-200',
  COMPLETED: 'bg-green-100 text-green-700 border-green-300',
};

const SIZES = ['20ft', '40ft', '40hq'];

export default function ContainersPage() {
  const { addToast } = useToast();
  const { locale } = useApp();
  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const STATUS_LABELS: Record<string, string> = {
    LOADING: L('Chargement', 'Loading'), SHIPPED: L('Expédié', 'Shipped'), IN_TRANSIT: L('En transit', 'In transit'), ARRIVED_PORT: L('Arrivé au port', 'Arrived at port'),
    CUSTOMS_PROCESSING: L('En douane', 'Customs processing'), CUSTOMS_CLEARED: L('Douane passée', 'Customs cleared'), DELIVERED_TO_WAREHOUSE: L('À l\'entrepôt', 'Delivered to warehouse'), COMPLETED: L('Terminé', 'Completed'),
  };

  const [containers, setContainers] = useState<Container[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [detail, setDetail] = useState<Container | null>(null);

  const [form, setForm] = useState({
    containerNumber: '', purchaseOrderId: '', size: '40hq', status: 'LOADING',
    originPort: '', destinationPort: '', shippingLine: '', vesselName: '',
    etaOrigin: '', etaDestination: '',
  });

  const formatDate = useCallback((d?: string | null) =>
    d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—', []);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [cRes, pRes] = await Promise.all([
          fetch('/api/v1/containers', { credentials: 'include' }),
          fetch('/api/v1/purchase-orders?pageSize=100', { credentials: 'include' }),
        ]);
        const cData = await cRes.json();
        const pData = await pRes.json();
        if (!cancelled) {
          if (cData.success) setContainers(cData.data?.data || cData.data || []);
          if (pData.success) setPurchaseOrders(pData.data?.data || pData.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch containers', err);
        if (!cancelled) addToast('error', 'Erreur lors du chargement des conteneurs');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [refreshKey, addToast]);

  const stats = useMemo(() => {
    const total = containers.length;
    const inTransit = containers.filter(c => ['SHIPPED', 'IN_TRANSIT', 'ARRIVED_PORT'].includes(c.status)).length;
    const inCustoms = containers.filter(c => ['CUSTOMS_PROCESSING', 'CUSTOMS_CLEARED'].includes(c.status)).length;
    const delivered = containers.filter(c => ['DELIVERED_TO_WAREHOUSE', 'COMPLETED'].includes(c.status)).length;
    return { total, inTransit, inCustoms, delivered };
  }, [containers]);

  const filtered = useMemo(() => containers.filter(c => {
    const matchSearch = `${c.containerNumber} ${c.originPort} ${c.destinationPort} ${c.vesselName || ''} ${c.purchaseOrder?.poNumber || ''}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  }), [containers, search, statusFilter]);

  const resetForm = () => {
    setForm({
      containerNumber: '', purchaseOrderId: '', size: '40hq', status: 'LOADING',
      originPort: '', destinationPort: '', shippingLine: '', vesselName: '',
      etaOrigin: '', etaDestination: '',
    });
  };

  const handleAdd = async () => {
    if (!form.containerNumber.trim() || !form.originPort.trim() || !form.destinationPort.trim()) {
      addToast('error', 'Numero, port d\'origine et port de destination requis');
      return;
    }
    try {
      const res = await fetch('/api/v1/containers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          containerNumber: form.containerNumber,
          purchaseOrderId: form.purchaseOrderId || undefined,
          size: form.size,
          status: form.status,
          originPort: form.originPort,
          destinationPort: form.destinationPort,
          shippingLine: form.shippingLine || undefined,
          vesselName: form.vesselName || undefined,
          etaOrigin: form.etaOrigin || undefined,
          etaDestination: form.etaDestination || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', `Conteneur ${data.data.containerNumber} cree`);
        setShowAdd(false);
        resetForm();
        setRefreshKey(k => k + 1);
      } else {
        addToast('error', data.message || 'Erreur lors de la creation');
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur lors de la creation du conteneur');
    }
  };

  const handleStatusChange = async (c: Container, status: string) => {
    try {
      const res = await fetch(`/api/v1/containers/${c.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', `${c.containerNumber} -> ${STATUS_LABELS[status] || status}`);
        setRefreshKey(k => k + 1);
      } else {
        addToast('error', data.message || 'Erreur lors du changement de statut');
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur lors du changement de statut');
    }
  };

  const handleDelete = async (c: Container) => {
    if (!window.confirm(`Supprimer le conteneur ${c.containerNumber} ?`)) return;
    try {
      const res = await fetch(`/api/v1/containers/${c.id}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        addToast('success', 'Conteneur supprime');
        if (detail?.id === c.id) setDetail(null);
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
              <h1 className="text-2xl font-bold text-gray-900">Conteneurs</h1>
              <p className="text-sm text-gray-500 mt-1">Suivi des conteneurs d&apos;importation</p>
            </div>
            <button
              onClick={() => { resetForm(); setShowAdd(true); }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold shadow-lg shadow-orange-500/25 hover:opacity-95 transition-opacity"
            >
              + Nouveau conteneur
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
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Conteneurs</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">En transit</p>
                  <p className="text-2xl font-bold text-cyan-600 mt-1">{stats.inTransit}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">En douane</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">{stats.inCustoms}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">A l&apos;entrepot</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.delivered}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 flex flex-col sm:flex-row gap-3 border-b border-gray-100">
                  <input aria-label="Rechercher (numero, port, navire, bon de commande...)"
                    type="text"
                    placeholder="Rechercher (numero, port, navire, bon de commande...)"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-400 text-sm"
                  />
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40 text-sm"
                  >
                    <option value="all">Tous les statuts</option>
                    {CONTAINER_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s] || s}</option>)}
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                        <th className="px-4 py-3 font-medium">Conteneur</th>
                        <th className="px-4 py-3 font-medium">Bon de commande</th>
                        <th className="px-4 py-3 font-medium">Trajet</th>
                        <th className="px-4 py-3 font-medium">Statut</th>
                        <th className="px-4 py-3 font-medium">Echeance</th>
                        <th className="px-4 py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(c => (
                        <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="px-4 py-3">
                            <p className="font-semibold text-gray-800">{c.containerNumber}</p>
                            <p className="text-xs text-gray-400">{c.size} · {c.shippingLine || '—'}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-gray-700">{c.purchaseOrder?.poNumber || '—'}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-gray-700">{c.originPort} → {c.destinationPort}</span>
                            {c.vesselName && <p className="text-xs text-gray-400">{c.vesselName}</p>}
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={c.status}
                              onChange={e => handleStatusChange(c, e.target.value)}
                              className={`px-2.5 py-1 rounded-full border text-xs font-medium focus:outline-none ${STATUS_COLORS[c.status] || ''}`}
                            >
                              {CONTAINER_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s] || s}</option>)}
                            </select>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{formatDate(c.etaDestination)}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button onClick={() => setDetail(c)} className="text-orange-600 hover:text-orange-700 text-xs font-medium">Voir</button>
                              <button onClick={() => handleDelete(c)} className="text-red-500 hover:text-red-600 text-xs font-medium">Supprimer</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filtered.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-10 text-center text-gray-400">Aucun conteneur trouve</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Nouveau conteneur">
            <div className="space-y-4">
              <div>
                <label htmlFor="numero-de-conteneur" className={labelCls}>Numero de conteneur *</label>
                <input id="numero-de-conteneur" type="text" value={form.containerNumber} onChange={e => setForm({ ...form, containerNumber: e.target.value })} className={inputCls} placeholder="Ex : MSKU1234567" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="taille" className={labelCls}>Taille</label>
                  <select id="taille" value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} className={inputCls}>
                    {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="statut" className={labelCls}>Statut</label>
                  <select id="statut" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={inputCls}>
                    {CONTAINER_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s] || s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="bon-de-commande" className={labelCls}>Bon de commande</label>
                <select id="bon-de-commande" value={form.purchaseOrderId} onChange={e => setForm({ ...form, purchaseOrderId: e.target.value })} className={inputCls}>
                  <option value="">— Aucun —</option>
                  {purchaseOrders.map(po => <option key={po.id} value={po.id}>{po.poNumber}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="port-d-apos-origine" className={labelCls}>Port d&apos;origine *</label>
                  <input id="port-d-apos-origine" type="text" value={form.originPort} onChange={e => setForm({ ...form, originPort: e.target.value })} className={inputCls} placeholder="Ex : Ningbo" />
                </div>
                <div>
                  <label htmlFor="port-de-destination" className={labelCls}>Port de destination *</label>
                  <input id="port-de-destination" type="text" value={form.destinationPort} onChange={e => setForm({ ...form, destinationPort: e.target.value })} className={inputCls} placeholder="Ex : Abidjan" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="ligne-maritime" className={labelCls}>Ligne maritime</label>
                  <input id="ligne-maritime" type="text" value={form.shippingLine} onChange={e => setForm({ ...form, shippingLine: e.target.value })} className={inputCls} placeholder="Ex : CMA CGM" />
                </div>
                <div>
                  <label htmlFor="navire" className={labelCls}>Navire</label>
                  <input id="navire" type="text" value={form.vesselName} onChange={e => setForm({ ...form, vesselName: e.target.value })} className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="eta-origine" className={labelCls}>ETA origine</label>
                  <input id="eta-origine" type="date" value={form.etaOrigin} onChange={e => setForm({ ...form, etaOrigin: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="eta-destination" className={labelCls}>ETA destination</label>
                  <input id="eta-destination" type="date" value={form.etaDestination} onChange={e => setForm({ ...form, etaDestination: e.target.value })} className={inputCls} />
                </div>
              </div>
              <button onClick={handleAdd} className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold hover:opacity-95 transition-opacity">
                Creer le conteneur
              </button>
            </div>
          </Modal>

          <Modal isOpen={!!detail} onClose={() => setDetail(null)} title={detail ? `Conteneur ${detail.containerNumber}` : ''}>
            {detail && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{detail.containerNumber}</p>
                    <p className="text-sm text-gray-500">{detail.size} · {detail.shippingLine || '—'} · {detail.vesselName || '—'}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full border text-xs font-medium ${STATUS_COLORS[detail.status] || ''}`}>
                    {STATUS_LABELS[detail.status] || detail.status}
                  </span>
                </div>

                {/* Progress Bar Timeline */}
                <div className="my-5 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Progression du Transit & Douanes</p>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    {[
                      { key: 'LOADING', label: 'Chargement' },
                      { key: 'IN_TRANSIT', label: 'Transit' },
                      { key: 'ARRIVED_PORT', label: 'Port' },
                      { key: 'CUSTOMS_PROCESSING', label: 'Douane' },
                      { key: 'DELIVERED_TO_WAREHOUSE', label: 'Entrepôt' },
                    ].map((step, idx, arr) => {
                      const currentIdx = CONTAINER_STATUSES.indexOf(detail.status);
                      const stepIdx = CONTAINER_STATUSES.indexOf(step.key);
                      const isDone = currentIdx >= stepIdx;

                      return (
                        <div key={step.key} className="flex-1 flex flex-col items-center relative text-center">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold z-10 transition-all ${
                            isDone ? 'bg-orange-500 text-white shadow-md shadow-orange-200' : 'bg-gray-200 text-gray-400'
                          }`}>
                            {isDone ? '✓' : idx + 1}
                          </div>
                          <span className={`text-[10px] mt-1.5 font-bold ${isDone ? 'text-orange-600' : 'text-gray-400'}`}>{step.label}</span>
                          {idx < arr.length - 1 && (
                            <div className={`h-1 w-full absolute top-3.5 left-1/2 -z-0 ${
                              currentIdx > stepIdx ? 'bg-orange-500' : 'bg-gray-200'
                            }`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2 text-sm mb-5">
                  <div className="flex justify-between"><span className="text-gray-500">Bon de commande</span><span className="font-medium">{detail.purchaseOrder?.poNumber || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Trajet</span><span className="font-medium">{detail.originPort} → {detail.destinationPort}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">ETA origine</span><span className="font-medium">{formatDate(detail.etaOrigin)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">ETA destination</span><span className="font-medium">{formatDate(detail.etaDestination)}</span></div>
                  {detail.departedAt && <div className="flex justify-between"><span className="text-gray-500">Depart</span><span className="font-medium">{formatDate(detail.departedAt)}</span></div>}
                  {detail.arrivedAt && <div className="flex justify-between"><span className="text-gray-500">Arrivee</span><span className="font-medium">{formatDate(detail.arrivedAt)}</span></div>}
                  {detail.clearedAt && <div className="flex justify-between"><span className="text-gray-500">Douane passee</span><span className="font-medium">{formatDate(detail.clearedAt)}</span></div>}
                  <div className="flex justify-between"><span className="text-gray-500">Dossier douane</span><span className="font-medium">{detail.customsRecord ? 'Lie' : 'Aucun'}</span></div>
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
