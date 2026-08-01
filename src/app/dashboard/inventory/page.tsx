'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardTopBar from '@/components/DashboardTopBar';
import { useToast } from '@/contexts/ToastContext';
import Modal from '@/components/Modal';
import { Product } from '@/shared/types';

type Warehouse = {
  id: string;
  name: string;
  code?: string | null;
  type: string;
  country: string;
  city: string;
  address?: string | null;
  capacity?: number | null;
  active: boolean;
  _count?: { inventories: number; purchaseOrders: number };
};

type StockLine = {
  id: string;
  productId: string;
  warehouseId: string;
  quantity: number;
  reserved: number;
  available: number;
  binLocation?: string | null;
  lotNumber?: string | null;
  costBasis?: number | null;
  updatedAt: string;
  product?: { id: string; title: string; reference?: string | null; sku?: string | null } | null;
  warehouse?: { id: string; name: string; city: string; country: string } | null;
};

type Movement = {
  id: string;
  type: string;
  quantity: number;
  reference?: string | null;
  notes?: string | null;
  createdAt: string;
  product?: { id: string; title: string; reference?: string | null } | null;
  fromWarehouse?: { id: string; name: string; city: string } | null;
  toWarehouse?: { id: string; name: string; city: string } | null;
};

const WAREHOUSE_TYPES = ['STANDARD', 'COLD_STORAGE', 'HAZMAT', 'BULK', 'CROSS_DOCK'];
const TYPE_LABELS: Record<string, string> = {
  STANDARD: 'Standard', COLD_STORAGE: 'Froid', HAZMAT: 'Dangereux', BULK: 'Vrac', CROSS_DOCK: 'Cross-dock',
};
const MOVEMENT_LABELS: Record<string, string> = {
  RECEIVED: 'Recu', TRANSFERRED: 'Transfere', SOLD: 'Vendu', RETURNED: 'Retour',
  ADJUSTED: 'Ajustement', DAMAGED: 'Abime', RESERVED: 'Reserve', UNRESERVED: 'Libere',
};
const MOVEMENT_COLORS: Record<string, string> = {
  RECEIVED: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  TRANSFERRED: 'bg-blue-50 text-blue-600 border-blue-200',
  SOLD: 'bg-purple-50 text-purple-600 border-purple-200',
  RETURNED: 'bg-amber-50 text-amber-600 border-amber-200',
  ADJUSTED: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  DAMAGED: 'bg-red-50 text-red-600 border-red-200',
  RESERVED: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  UNRESERVED: 'bg-gray-100 text-gray-600 border-gray-200',
};

export default function InventoryPage() {
  const { addToast } = useToast();

  const [tab, setTab] = useState<'warehouses' | 'stock' | 'movements'>('stock');

  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [stock, setStock] = useState<StockLine[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [search, setSearch] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const [showAddWarehouse, setShowAddWarehouse] = useState(false);
  const [showAddStock, setShowAddStock] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);

  const [whForm, setWhForm] = useState({ name: '', code: '', type: 'STANDARD', country: 'CI', city: '', address: '', capacity: '' });
  const [stockForm, setStockForm] = useState({ productId: '', warehouseId: '', quantity: '', reserved: '0', binLocation: '', lotNumber: '', costBasis: '' });
  const [transferForm, setTransferForm] = useState({ productId: '', fromWarehouseId: '', toWarehouseId: '', quantity: '', notes: '' });

  const [refreshKey, setRefreshKey] = useState(0);

  const formatNumber = useCallback((n: number) => new Intl.NumberFormat('fr-FR').format(n), []);
  const formatDate = useCallback((d?: string | null) =>
    d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—', []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [wRes, sRes, mRes, pRes] = await Promise.all([
          fetch('/api/v1/warehouses?pageSize=100', { credentials: 'include' }),
          fetch('/api/v1/inventory?pageSize=100', { credentials: 'include' }),
          fetch('/api/v1/inventory/movements?pageSize=100', { credentials: 'include' }),
          fetch('/api/v1/products?pageSize=100', { credentials: 'include' }),
        ]);
        const [wData, sData, mData, pData] = await Promise.all([wRes.json(), sRes.json(), mRes.json(), pRes.json()]);
        if (!cancelled) {
          if (wData.success) setWarehouses(wData.data?.data || wData.data || []);
          if (sData.success) setStock(sData.data?.data || sData.data || []);
          if (mData.success) setMovements(mData.data?.data || mData.data || []);
          if (pData.success) setProducts(pData.data?.data || pData.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch inventory data', err);
        if (!cancelled) addToast('error', 'Erreur lors du chargement des données');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [refreshKey, addToast]);

  const stats = useMemo(() => {
    const totalValue = stock.reduce((acc, s) => acc + (s.quantity * (s.costBasis || 0)), 0);
    const lowStock = stock.filter(s => s.available > 0 && s.available <= 10).length;
    const outOfStock = stock.filter(s => s.available <= 0).length;
    const totalUnits = stock.reduce((acc, s) => acc + s.quantity, 0);
    return { totalWarehouses: warehouses.length, totalUnits, lowStock, outOfStock, totalValue };
  }, [warehouses, stock]);

  const filteredStock = useMemo(() => stock.filter(s => {
    const matchSearch = `${s.product?.title || ''} ${s.product?.reference || ''} ${s.binLocation || ''} ${s.lotNumber || ''}`.toLowerCase().includes(search.toLowerCase());
    const matchWh = warehouseFilter === 'all' || s.warehouseId === warehouseFilter;
    return matchSearch && matchWh;
  }), [stock, search, warehouseFilter]);

  const filteredMovements = useMemo(() => movements.filter(m => {
    const matchSearch = `${m.product?.title || ''} ${m.reference || ''} ${m.notes || ''}`.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  }), [movements, search]);

  const handleAddWarehouse = async () => {
    if (!whForm.name || !whForm.city) { addToast('error', 'Nom et ville requis'); return; }
    try {
      const res = await fetch('/api/v1/warehouses', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({
          name: whForm.name, code: whForm.code || undefined, type: whForm.type,
          country: whForm.country, city: whForm.city, address: whForm.address || undefined,
          capacity: whForm.capacity ? Number(whForm.capacity) : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', `Entrepôt ${data.data.name} cree`);
        setShowAddWarehouse(false);
        setWhForm({ name: '', code: '', type: 'STANDARD', country: 'CI', city: '', address: '', capacity: '' });
        setRefreshKey(k => k + 1);
      } else {
        addToast('error', data.message || 'Erreur lors de la creation');
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur lors de la creation de l\'entrepôt');
    }
  };

  const handleAddStock = async () => {
    if (!stockForm.productId || !stockForm.warehouseId) { addToast('error', 'Produit et entrepôt requis'); return; }
    try {
      const res = await fetch('/api/v1/inventory', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({
          productId: stockForm.productId, warehouseId: stockForm.warehouseId,
          quantity: Number(stockForm.quantity) || 0, reserved: Number(stockForm.reserved) || 0,
          binLocation: stockForm.binLocation || undefined, lotNumber: stockForm.lotNumber || undefined,
          costBasis: stockForm.costBasis ? Number(stockForm.costBasis) : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', 'Ligne de stock ajoutee');
        setShowAddStock(false);
        setStockForm({ productId: '', warehouseId: '', quantity: '', reserved: '0', binLocation: '', lotNumber: '', costBasis: '' });
        setRefreshKey(k => k + 1);
      } else {
        addToast('error', data.message || 'Erreur lors de la creation');
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur lors de la creation de la ligne de stock');
    }
  };

  const handleAdjust = async (s: StockLine, quantity: number) => {
    if (quantity < 0) { addToast('error', 'Quantite invalide'); return; }
    try {
      const res = await fetch(`/api/v1/inventory/${s.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ quantity }),
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', 'Stock ajuste');
        setRefreshKey(k => k + 1);
      } else {
        addToast('error', data.message || 'Erreur lors de l\'ajustement');
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur lors de l\'ajustement du stock');
    }
  };

  const handleTransfer = async () => {
    if (!transferForm.productId || !transferForm.fromWarehouseId || !transferForm.toWarehouseId || !transferForm.quantity) {
      addToast('error', 'Produit, entrepôts et quantité requis');
      return;
    }
    try {
      const res = await fetch('/api/v1/inventory/transfer', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({
          productId: transferForm.productId, fromWarehouseId: transferForm.fromWarehouseId,
          toWarehouseId: transferForm.toWarehouseId, quantity: Number(transferForm.quantity),
          notes: transferForm.notes || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', 'Stock transfere');
        setShowTransfer(false);
        setTransferForm({ productId: '', fromWarehouseId: '', toWarehouseId: '', quantity: '', notes: '' });
        setRefreshKey(k => k + 1);
      } else {
        addToast('error', data.message || 'Erreur lors du transfert');
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur lors du transfert de stock');
    }
  };

  const handleDeleteStock = async (s: StockLine) => {
    if (!window.confirm(`Supprimer la ligne de stock ${s.product?.title || s.id} ?`)) return;
    try {
      const res = await fetch(`/api/v1/inventory/${s.id}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        addToast('success', 'Ligne de stock supprimee');
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

  const tabBtn = (key: 'warehouses' | 'stock' | 'movements', label: string) => (
    <button
      onClick={() => setTab(key)}
      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === key ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F6F8FB]">
      <Sidebar />
      <div className="lg:pl-[72px] transition-all duration-300">
        <DashboardTopBar />
        <main className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inventaire & Entrepôts</h1>
              <p className="text-sm text-gray-500 mt-1">Gestion du stock multi-entrepôts et des mouvements</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowTransfer(true)} className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-all">
                Transferer
              </button>
              <button
                onClick={() => { if (tab === 'warehouses') setShowAddWarehouse(true); else setShowAddStock(true); }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold shadow-lg shadow-orange-500/25 hover:opacity-95 transition-opacity"
              >
                + {tab === 'warehouses' ? 'Nouvel entrepôt' : 'Ligne de stock'}
              </button>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            {tabBtn('stock', `Stock (${stats.totalUnits})`)}
            {tabBtn('warehouses', `Entrepôts (${stats.totalWarehouses})`)}
            {tabBtn('movements', `Mouvements (${movements.length})`)}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Unites en stock</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatNumber(stats.totalUnits)}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Valeur stock</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatNumber(stats.totalValue)} XOF</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Stock bas</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{stats.lowStock}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Ruptures</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{stats.outOfStock}</p>
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500 text-sm font-medium">Chargement de l&apos;inventaire...</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 flex flex-col sm:flex-row gap-3 border-b border-gray-100">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-400 text-sm"
                  />
                  {tab === 'stock' && (
                    <select
                      value={warehouseFilter}
                      onChange={e => setWarehouseFilter(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40 text-sm"
                    >
                      <option value="all">Tous les entrepôts</option>
                      {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                  )}
                </div>

                {tab === 'warehouses' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                          <th className="px-4 py-3 font-medium">Entrepôt</th>
                          <th className="px-4 py-3 font-medium">Type</th>
                          <th className="px-4 py-3 font-medium">Localisation</th>
                          <th className="px-4 py-3 font-medium">Stock</th>
                          <th className="px-4 py-3 font-medium">Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {warehouses.map(w => (
                          <tr key={w.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                            <td className="px-4 py-3">
                              <p className="font-semibold text-gray-800">{w.name}</p>
                              {w.code && <p className="text-xs text-gray-400 font-mono">{w.code}</p>}
                            </td>
                            <td className="px-4 py-3"><span className="text-gray-700">{TYPE_LABELS[w.type] || w.type}</span></td>
                            <td className="px-4 py-3"><span className="text-gray-700">{w.city}, {w.country}</span></td>
                            <td className="px-4 py-3"><span className="text-gray-700">{w._count?.inventories ?? 0} lignes</span></td>
                            <td className="px-4 py-3">
                              <span className={`px-2.5 py-1 rounded-full border text-xs font-medium ${w.active ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                {w.active ? 'Actif' : 'Inactif'}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {warehouses.length === 0 && (
                          <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400">Aucun entrepôt</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {tab === 'stock' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                          <th className="px-4 py-3 font-medium">Produit</th>
                          <th className="px-4 py-3 font-medium">Entrepôt</th>
                          <th className="px-4 py-3 font-medium">Total</th>
                          <th className="px-4 py-3 font-medium">Reserve</th>
                          <th className="px-4 py-3 font-medium">Disponible</th>
                          <th className="px-4 py-3 font-medium">Emplacement</th>
                          <th className="px-4 py-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStock.map(s => (
                          <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                            <td className="px-4 py-3">
                              <p className="font-semibold text-gray-800">{s.product?.title || '—'}</p>
                              {s.product?.reference && <p className="text-xs text-gray-400 font-mono">{s.product.reference}</p>}
                            </td>
                            <td className="px-4 py-3"><span className="text-gray-700">{s.warehouse?.name || '—'}</span></td>
                            <td className="px-4 py-3"><span className="font-semibold text-gray-800">{s.quantity}</span></td>
                            <td className="px-4 py-3"><span className="text-indigo-600">{s.reserved}</span></td>
                            <td className="px-4 py-3">
                              <span className={`font-semibold ${s.available <= 0 ? 'text-red-600' : s.available <= 10 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                {s.available}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-gray-700">{s.binLocation || '—'}</span>
                              {s.lotNumber && <p className="text-xs text-gray-400">Lot {s.lotNumber}</p>}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleAdjust(s, s.quantity + 1)}
                                  className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold"
                                  title="+1"
                                >+</button>
                                <button
                                  onClick={() => handleAdjust(s, Math.max(0, s.quantity - 1))}
                                  className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 font-bold"
                                  title="-1"
                                >−</button>
                                <button onClick={() => handleDeleteStock(s)} className="text-red-500 hover:text-red-600 text-xs font-medium">Suppr.</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {filteredStock.length === 0 && (
                          <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">Aucune ligne de stock</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {tab === 'movements' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                          <th className="px-4 py-3 font-medium">Type</th>
                          <th className="px-4 py-3 font-medium">Produit</th>
                          <th className="px-4 py-3 font-medium">Trajet</th>
                          <th className="px-4 py-3 font-medium">Quantite</th>
                          <th className="px-4 py-3 font-medium">Reference</th>
                          <th className="px-4 py-3 font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMovements.map(m => (
                          <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                            <td className="px-4 py-3">
                              <span className={`px-2.5 py-1 rounded-full border text-xs font-medium ${MOVEMENT_COLORS[m.type] || ''}`}>
                                {MOVEMENT_LABELS[m.type] || m.type}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-semibold text-gray-800">{m.product?.title || '—'}</p>
                              {m.product?.reference && <p className="text-xs text-gray-400 font-mono">{m.product.reference}</p>}
                            </td>
                            <td className="px-4 py-3">
                              {m.fromWarehouse && m.toWarehouse
                                ? <span className="text-gray-700">{m.fromWarehouse.name} → {m.toWarehouse.name}</span>
                                : <span className="text-gray-700">{m.fromWarehouse?.name || m.toWarehouse?.name || '—'}</span>}
                            </td>
                            <td className="px-4 py-3"><span className="font-semibold text-gray-800">{m.quantity}</span></td>
                            <td className="px-4 py-3"><span className="text-gray-500 text-xs">{m.reference || m.notes || '—'}</span></td>
                            <td className="px-4 py-3"><span className="text-gray-500 text-xs">{formatDate(m.createdAt)}</span></td>
                          </tr>
                        ))}
                        {filteredMovements.length === 0 && (
                          <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">Aucun mouvement</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          <Modal isOpen={showAddWarehouse} onClose={() => setShowAddWarehouse(false)} title="Nouvel entrepôt">
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Nom *</label>
                <input type="text" value={whForm.name} onChange={e => setWhForm({ ...whForm, name: e.target.value })} className={inputCls} placeholder="Ex : Depot Abidjan Zone Industrielle" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Code</label>
                  <input type="text" value={whForm.code} onChange={e => setWhForm({ ...whForm, code: e.target.value })} className={inputCls} placeholder="Ex : ABJ-01" />
                </div>
                <div>
                  <label className={labelCls}>Type</label>
                  <select value={whForm.type} onChange={e => setWhForm({ ...whForm, type: e.target.value })} className={inputCls}>
                    {WAREHOUSE_TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Pays *</label>
                  <input type="text" value={whForm.country} onChange={e => setWhForm({ ...whForm, country: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Ville *</label>
                  <input type="text" value={whForm.city} onChange={e => setWhForm({ ...whForm, city: e.target.value })} className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Adresse</label>
                <input type="text" value={whForm.address} onChange={e => setWhForm({ ...whForm, address: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Capacite (unites)</label>
                <input type="number" value={whForm.capacity} onChange={e => setWhForm({ ...whForm, capacity: e.target.value })} className={inputCls} />
              </div>
              <button onClick={handleAddWarehouse} className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold hover:opacity-95 transition-opacity">
                Creer l&apos;entrepôt
              </button>
            </div>
          </Modal>

          <Modal isOpen={showAddStock} onClose={() => setShowAddStock(false)} title="Nouvelle ligne de stock">
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Produit *</label>
                <select value={stockForm.productId} onChange={e => setStockForm({ ...stockForm, productId: e.target.value })} className={inputCls}>
                  <option value="">— Selectionner —</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.title} {p.reference ? `(${p.reference})` : ''}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Entrepôt *</label>
                <select value={stockForm.warehouseId} onChange={e => setStockForm({ ...stockForm, warehouseId: e.target.value })} className={inputCls}>
                  <option value="">— Selectionner —</option>
                  {warehouses.map(w => <option key={w.id} value={w.id}>{w.name} ({w.city})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Quantite</label>
                  <input type="number" value={stockForm.quantity} onChange={e => setStockForm({ ...stockForm, quantity: e.target.value })} className={inputCls} min="0" />
                </div>
                <div>
                  <label className={labelCls}>Reserve</label>
                  <input type="number" value={stockForm.reserved} onChange={e => setStockForm({ ...stockForm, reserved: e.target.value })} className={inputCls} min="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Emplacement</label>
                  <input type="text" value={stockForm.binLocation} onChange={e => setStockForm({ ...stockForm, binLocation: e.target.value })} className={inputCls} placeholder="Ex : A-01-03" />
                </div>
                <div>
                  <label className={labelCls}>Lot</label>
                  <input type="text" value={stockForm.lotNumber} onChange={e => setStockForm({ ...stockForm, lotNumber: e.target.value })} className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Cout unitaire (XOF)</label>
                <input type="number" value={stockForm.costBasis} onChange={e => setStockForm({ ...stockForm, costBasis: e.target.value })} className={inputCls} min="0" />
              </div>
              <button onClick={handleAddStock} className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold hover:opacity-95 transition-opacity">
                Ajouter la ligne de stock
              </button>
            </div>
          </Modal>

          <Modal isOpen={showTransfer} onClose={() => setShowTransfer(false)} title="Transferer du stock">
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Produit *</label>
                <select value={transferForm.productId} onChange={e => setTransferForm({ ...transferForm, productId: e.target.value })} className={inputCls}>
                  <option value="">— Selectionner —</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.title} {p.reference ? `(${p.reference})` : ''}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Depuis *</label>
                  <select value={transferForm.fromWarehouseId} onChange={e => setTransferForm({ ...transferForm, fromWarehouseId: e.target.value })} className={inputCls}>
                    <option value="">— Selectionner —</option>
                    {warehouses.map(w => <option key={w.id} value={w.id}>{w.name} ({w.city})</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Vers *</label>
                  <select value={transferForm.toWarehouseId} onChange={e => setTransferForm({ ...transferForm, toWarehouseId: e.target.value })} className={inputCls}>
                    <option value="">— Selectionner —</option>
                    {warehouses.map(w => <option key={w.id} value={w.id}>{w.name} ({w.city})</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>Quantite *</label>
                <input type="number" value={transferForm.quantity} onChange={e => setTransferForm({ ...transferForm, quantity: e.target.value })} className={inputCls} min="1" />
              </div>
              <div>
                <label className={labelCls}>Notes</label>
                <textarea value={transferForm.notes} onChange={e => setTransferForm({ ...transferForm, notes: e.target.value })} className={inputCls} rows={2} />
              </div>
              <button onClick={handleTransfer} className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold hover:opacity-95 transition-opacity">
                Transferer le stock
              </button>
            </div>
          </Modal>
        </main>
      </div>
    </div>
  );
}
