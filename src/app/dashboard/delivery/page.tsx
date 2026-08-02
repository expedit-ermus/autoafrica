'use client';
import { useState, useEffect, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardTopBar from '@/components/DashboardTopBar';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/contexts/ToastContext';
import Modal from '@/components/Modal';

type Shipment = {
  id: string;
  orderId: string;
  trackingNumber?: string | null;
  carrier?: string | null;
  method?: string | null;
  status: string;
  currentLocation?: string | null;
  estimatedDelivery?: string | null;
  actualDelivery?: string | null;
  signedBy?: string | null;
  createdAt: string;
  order?: { id: string; orderNumber: string; totalAmount: number; currency: string; status: string } | null;
};

type Route = {
  id: string;
  name: string;
  driverId?: string | null;
  vehicleId?: string | null;
  country: string;
  city?: string | null;
  date: string;
  status: string;
  distance?: number | null;
  duration?: number | null;
  completedAt?: string | null;
  createdAt: string;
};

type Vehicle = {
  id: string;
  plateNumber: string;
  type: string;
  brand?: string | null;
  model?: string | null;
  year?: number | null;
  capacity?: number | null;
  driverId?: string | null;
  status: string;
  createdAt: string;
};

type OrderRef = {
  id: string;
  orderNumber: string;
  totalAmount: number;
  currency: string;
  status: string;
};

const SHIPMENT_STATUS: Record<string, string> = {
  PENDING: 'En attente', PICKED_UP: 'Ramassée', IN_TRANSIT: 'En transit',
  OUT_FOR_DELIVERY: 'En cours de livraison', DELIVERED: 'Livrée',
  FAILED_DELIVERY: 'Échec livraison', RETURNED: 'Retournée',
};
const SHIPMENT_COLORS: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-600 border-gray-200',
  PICKED_UP: 'bg-blue-50 text-blue-600 border-blue-200',
  IN_TRANSIT: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  OUT_FOR_DELIVERY: 'bg-amber-50 text-amber-600 border-amber-200',
  DELIVERED: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  FAILED_DELIVERY: 'bg-red-50 text-red-600 border-red-200',
  RETURNED: 'bg-gray-100 text-gray-400 border-gray-200',
};
const ROUTE_STATUS: Record<string, string> = {
  planned: 'Planifiée', active: 'En cours', completed: 'Terminée',
};
const ROUTE_COLORS: Record<string, string> = {
  planned: 'bg-gray-100 text-gray-600 border-gray-200',
  active: 'bg-blue-50 text-blue-600 border-blue-200',
  completed: 'bg-emerald-50 text-emerald-600 border-emerald-200',
};
const VEHICLE_STATUS: Record<string, string> = {
  active: 'Actif', maintenance: 'En maintenance', inactive: 'Inactif',
};
const VEHICLE_STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  maintenance: 'bg-amber-50 text-amber-600 border-amber-200',
  inactive: 'bg-gray-100 text-gray-400 border-gray-200',
};
const VEHICLE_TYPES: Record<string, string> = {
  moto: 'Moto', voiture: 'Voiture', camion: 'Camion', van: 'Van',
};
const SHIPMENT_METHOD: Record<string, string> = {
  standard: 'Standard', express: 'Express', pickup: 'Retrait',
};

export default function DeliveryPage() {
  const { t } = useApp();
  const { addToast } = useToast();

  const [tab, setTab] = useState<'shipments' | 'routes' | 'fleet'>('shipments');

  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [orders, setOrders] = useState<OrderRef[]>([]);

  const [shpSearch, setShpSearch] = useState('');
  const [shpStatus, setShpStatus] = useState('all');
  const [routeSearch, setRouteSearch] = useState('');
  const [routeStatus, setRouteStatus] = useState('all');
  const [vehSearch, setVehSearch] = useState('');
  const [vehStatus, setVehStatus] = useState('all');

  const [loading, setLoading] = useState(true);

  const [showAddShipment, setShowAddShipment] = useState(false);
  const [showAddRoute, setShowAddRoute] = useState(false);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showShipmentStatus, setShowShipmentStatus] = useState<Shipment | null>(null);
  const [showRouteStatus, setShowRouteStatus] = useState<Route | null>(null);

  const [shipmentForm, setShipmentForm] = useState({ orderId: '', trackingNumber: '', carrier: '', method: 'standard', currentLocation: '', estimatedDelivery: '' });
  const [routeForm, setRouteForm] = useState({ name: '', country: 'CI', city: '', date: '', vehicleId: '', distance: '' });
  const [vehicleForm, setVehicleForm] = useState({ plateNumber: '', type: 'camion', brand: '', model: '', year: '', capacity: '' });
  const [statusForm, setStatusForm] = useState('');

  const [refreshKey, setRefreshKey] = useState(0);

  const formatCFA = (n: number) => new Intl.NumberFormat('fr-FR').format(n);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [shpRes, routeRes, vehRes, orderRes] = await Promise.all([
          fetch('/api/v1/shipments?pageSize=100', { credentials: 'include' }),
          fetch('/api/v1/delivery-routes?pageSize=100', { credentials: 'include' }),
          fetch('/api/v1/fleet-vehicles?pageSize=100', { credentials: 'include' }),
          fetch('/api/v1/orders?pageSize=100', { credentials: 'include' }),
        ]);
        const [shpData, routeData, vehData, orderData] = await Promise.all([
          shpRes.json(), routeRes.json(), vehRes.json(), orderRes.json(),
        ]);
        if (!cancelled) {
          if (shpData.success) setShipments(shpData.data?.data || shpData.data || []);
          if (routeData.success) setRoutes(routeData.data?.data || routeData.data || []);
          if (vehData.success) setVehicles(vehData.data?.data || vehData.data || []);
          if (orderData.success) setOrders(orderData.data?.data || orderData.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch delivery data', err);
        if (!cancelled) addToast('error', 'Erreur lors du chargement des données de livraison');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [refreshKey, addToast]);

  const filteredShipments = useMemo(() => {
    let list = shipments;
    if (shpStatus !== 'all') list = list.filter(s => s.status === shpStatus);
    if (shpSearch) {
      const q = shpSearch.toLowerCase();
      list = list.filter(s =>
        (s.trackingNumber || '').toLowerCase().includes(q) ||
        (s.carrier || '').toLowerCase().includes(q) ||
        (s.currentLocation || '').toLowerCase().includes(q) ||
        (s.order?.orderNumber || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [shipments, shpSearch, shpStatus]);

  const filteredRoutes = useMemo(() => {
    let list = routes;
    if (routeStatus !== 'all') list = list.filter(r => r.status === routeStatus);
    if (routeSearch) {
      const q = routeSearch.toLowerCase();
      list = list.filter(r =>
        r.name.toLowerCase().includes(q) ||
        (r.city || '').toLowerCase().includes(q) ||
        r.country.toLowerCase().includes(q)
      );
    }
    return list;
  }, [routes, routeSearch, routeStatus]);

  const filteredVehicles = useMemo(() => {
    let list = vehicles;
    if (vehStatus !== 'all') list = list.filter(v => v.status === vehStatus);
    if (vehSearch) {
      const q = vehSearch.toLowerCase();
      list = list.filter(v =>
        v.plateNumber.toLowerCase().includes(q) ||
        (v.brand || '').toLowerCase().includes(q) ||
        (v.model || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [vehicles, vehSearch, vehStatus]);

  const handleAddShipment = async () => {
    if (!shipmentForm.orderId) { addToast('error', 'Commande requise'); return; }
    try {
      const res = await fetch('/api/v1/shipments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          orderId: shipmentForm.orderId,
          trackingNumber: shipmentForm.trackingNumber || undefined,
          carrier: shipmentForm.carrier || undefined,
          method: shipmentForm.method || undefined,
          currentLocation: shipmentForm.currentLocation || undefined,
          estimatedDelivery: shipmentForm.estimatedDelivery || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', 'Livraison créée');
        setShowAddShipment(false);
        setShipmentForm({ orderId: '', trackingNumber: '', carrier: '', method: 'standard', currentLocation: '', estimatedDelivery: '' });
        setRefreshKey(k => k + 1);
      } else {
        addToast('error', data.message || 'Erreur lors de la création');
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur lors de la création de la livraison');
    }
  };

  const handleAddRoute = async () => {
    if (!routeForm.name || !routeForm.date) { addToast('error', 'Nom et date sont requis'); return; }
    try {
      const res = await fetch('/api/v1/delivery-routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: routeForm.name,
          country: routeForm.country || 'CI',
          city: routeForm.city || undefined,
          date: routeForm.date,
          vehicleId: routeForm.vehicleId || undefined,
          distance: routeForm.distance ? Number(routeForm.distance) : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', 'Tournée créée');
        setShowAddRoute(false);
        setRouteForm({ name: '', country: 'CI', city: '', date: '', vehicleId: '', distance: '' });
        setRefreshKey(k => k + 1);
      } else {
        addToast('error', data.message || 'Erreur lors de la création');
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur lors de la création de la tournée');
    }
  };

  const handleAddVehicle = async () => {
    if (!vehicleForm.plateNumber || !vehicleForm.type) { addToast('error', 'Plaque et type sont requis'); return; }
    try {
      const res = await fetch('/api/v1/fleet-vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          plateNumber: vehicleForm.plateNumber,
          type: vehicleForm.type,
          brand: vehicleForm.brand || undefined,
          model: vehicleForm.model || undefined,
          year: vehicleForm.year ? Number(vehicleForm.year) : undefined,
          capacity: vehicleForm.capacity ? Number(vehicleForm.capacity) : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', 'Véhicule ajouté');
        setShowAddVehicle(false);
        setVehicleForm({ plateNumber: '', type: 'camion', brand: '', model: '', year: '', capacity: '' });
        setRefreshKey(k => k + 1);
      } else {
        addToast('error', data.message || 'Erreur lors de la création');
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur lors de l\'ajout du véhicule');
    }
  };

  const handleShipmentStatus = async () => {
    if (!showShipmentStatus || !statusForm) return;
    try {
      const res = await fetch(`/api/v1/shipments/${showShipmentStatus.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: statusForm }),
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', 'Statut mis à jour');
        setShowShipmentStatus(null);
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

  const handleRouteStatus = async () => {
    if (!showRouteStatus || !statusForm) return;
    try {
      const res = await fetch(`/api/v1/delivery-routes/${showRouteStatus.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: statusForm }),
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', 'Statut mis à jour');
        setShowRouteStatus(null);
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
    { key: 'shipments' as const, label: 'Livraisons', count: shipments.length },
    { key: 'routes' as const, label: 'Tournées', count: routes.length },
    { key: 'fleet' as const, label: 'Flotte', count: vehicles.length },
  ];

  const formatDate = (d?: string | null) => d ? new Date(d).toISOString().split('T')[0] : '—';

  return (
    <div className="flex min-h-screen bg-[#F0F2F5]">
      <Sidebar />
      <div className="flex-1 lg:ml-[260px]">
        <DashboardTopBar />
        <main className="p-4 lg:p-8 pb-24 lg:pb-8 max-w-[1400px] mx-auto">

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 animate-fade-in">
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">{t.nav.delivery}</h1>
              <p className="text-sm text-gray-500 mt-1">
                Suivi des livraisons, tournées et véhicules de flotte
              </p>
            </div>
            <div className="flex items-center gap-2">
              {tab === 'shipments' && (
                <button onClick={() => setShowAddShipment(true)} className="btn-primary !py-2 !px-4 !text-xs">
                  + Nouvelle livraison
                </button>
              )}
              {tab === 'routes' && (
                <button onClick={() => setShowAddRoute(true)} className="btn-primary !py-2 !px-4 !text-xs">
                  + Nouvelle tournée
                </button>
              )}
              {tab === 'fleet' && (
                <button onClick={() => setShowAddVehicle(true)} className="btn-primary !py-2 !px-4 !text-xs">
                  + Ajouter véhicule
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
              {tab === 'shipments' && (
                <div className="glass-card animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-6 pb-4 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <input
                        value={shpSearch}
                        onChange={e => setShpSearch(e.target.value)}
                        placeholder="Rechercher livraison..."
                        className="input-field !min-h-[38px] !py-2 !text-xs w-full sm:w-64"
                      />
                      <select
                        value={shpStatus}
                        onChange={e => setShpStatus(e.target.value)}
                        className="input-field !min-h-[38px] !py-2 !text-xs"
                      >
                        <option value="all">Tous les statuts</option>
                        {Object.entries(SHIPMENT_STATUS).map(([k, v]) => (
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

                  {filteredShipments.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium">Aucune livraison</p>
                    </div>
                  ) : (
                    <>
                      <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-100">
                              <th className="text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">N° suivi</th>
                              <th className="text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Commande</th>
                              <th className="text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Transporteur</th>
                              <th className="text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Méthode</th>
                              <th className="text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Position</th>
                              <th className="text-center text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Statut</th>
                              <th className="text-right text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredShipments.map(s => (
                              <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                  <span className="font-mono text-xs font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded-md">{s.trackingNumber || '—'}</span>
                                </td>
                                <td className="px-6 py-4 text-xs text-gray-500">{s.order?.orderNumber || s.orderId.slice(0, 8)}</td>
                                <td className="px-6 py-4 text-xs text-gray-600 capitalize">{s.carrier || '—'}</td>
                                <td className="px-6 py-4 text-xs text-gray-600">{s.method ? (SHIPMENT_METHOD[s.method] || s.method) : '—'}</td>
                                <td className="px-6 py-4 text-xs text-gray-500">{s.currentLocation || '—'}</td>
                                <td className="px-6 py-4 text-center">
                                  <span className={`badge border ${SHIPMENT_COLORS[s.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                    {SHIPMENT_STATUS[s.status] || s.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button
                                    onClick={() => { setShowShipmentStatus(s); setStatusForm(s.status); }}
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
                        {filteredShipments.map(s => (
                          <div key={s.id} className="p-4 rounded-xl border border-gray-100">
                            <div className="flex items-start justify-between mb-2">
                              <span className="font-mono text-[11px] font-semibold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">{s.trackingNumber || s.id.slice(0, 8)}</span>
                              <span className={`badge border ${SHIPMENT_COLORS[s.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                {SHIPMENT_STATUS[s.status] || s.status}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-gray-800 mb-1">{s.order?.orderNumber || 'Commande'}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-400">
                                {s.carrier || '—'} · {s.method ? (SHIPMENT_METHOD[s.method] || s.method) : '—'}
                              </span>
                              <span className="text-xs text-gray-500">{s.currentLocation || ''}</span>
                            </div>
                            <button
                              onClick={() => { setShowShipmentStatus(s); setStatusForm(s.status); }}
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

              {tab === 'routes' && (
                <div className="glass-card animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-6 pb-4 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <input
                        value={routeSearch}
                        onChange={e => setRouteSearch(e.target.value)}
                        placeholder="Rechercher tournée..."
                        className="input-field !min-h-[38px] !py-2 !text-xs w-full sm:w-64"
                      />
                      <select
                        value={routeStatus}
                        onChange={e => setRouteStatus(e.target.value)}
                        className="input-field !min-h-[38px] !py-2 !text-xs"
                      >
                        <option value="all">Tous les statuts</option>
                        {Object.entries(ROUTE_STATUS).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {filteredRoutes.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                      <p className="text-sm font-medium">Aucune tournée</p>
                    </div>
                  ) : (
                    <>
                      <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-100">
                              <th className="text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Nom</th>
                              <th className="text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Ville</th>
                              <th className="text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Date</th>
                              <th className="text-right text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Distance</th>
                              <th className="text-center text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Statut</th>
                              <th className="text-right text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredRoutes.map(r => (
                              <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 text-sm font-medium text-gray-700">{r.name}</td>
                                <td className="px-6 py-4 text-xs text-gray-500">{r.city || r.country}</td>
                                <td className="px-6 py-4 text-xs text-gray-500">{formatDate(r.date)}</td>
                                <td className="px-6 py-4 text-right text-xs text-gray-600">{r.distance ? `${r.distance} km` : '—'}</td>
                                <td className="px-6 py-4 text-center">
                                  <span className={`badge border ${ROUTE_COLORS[r.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                    {ROUTE_STATUS[r.status] || r.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button
                                    onClick={() => { setShowRouteStatus(r); setStatusForm(r.status); }}
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
                        {filteredRoutes.map(r => (
                          <div key={r.id} className="p-4 rounded-xl border border-gray-100">
                            <div className="flex items-start justify-between mb-2">
                              <p className="text-sm font-medium text-gray-800">{r.name}</p>
                              <span className={`badge border ${ROUTE_COLORS[r.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                {ROUTE_STATUS[r.status] || r.status}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-400">{r.city || r.country} · {formatDate(r.date)}</span>
                              <span className="text-xs text-gray-600">{r.distance ? `${r.distance} km` : ''}</span>
                            </div>
                            <button
                              onClick={() => { setShowRouteStatus(r); setStatusForm(r.status); }}
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

              {tab === 'fleet' && (
                <div className="glass-card animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-6 pb-4 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <input
                        value={vehSearch}
                        onChange={e => setVehSearch(e.target.value)}
                        placeholder="Rechercher véhicule..."
                        className="input-field !min-h-[38px] !py-2 !text-xs w-full sm:w-64"
                      />
                      <select
                        value={vehStatus}
                        onChange={e => setVehStatus(e.target.value)}
                        className="input-field !min-h-[38px] !py-2 !text-xs"
                      >
                        <option value="all">Tous les statuts</option>
                        {Object.entries(VEHICLE_STATUS).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {filteredVehicles.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                      <p className="text-sm font-medium">Aucun véhicule de flotte</p>
                    </div>
                  ) : (
                    <>
                      <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-100">
                              <th className="text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Plaque</th>
                              <th className="text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Véhicule</th>
                              <th className="text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Type</th>
                              <th className="text-right text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Année</th>
                              <th className="text-right text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Capacité</th>
                              <th className="text-center text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-6 py-3">Statut</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredVehicles.map(v => (
                              <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                  <span className="font-mono text-xs font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded-md">{v.plateNumber}</span>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-700">{[v.brand, v.model].filter(Boolean).join(' ') || '—'}</td>
                                <td className="px-6 py-4 text-xs text-gray-600">{VEHICLE_TYPES[v.type] || v.type}</td>
                                <td className="px-6 py-4 text-right text-xs text-gray-500">{v.year || '—'}</td>
                                <td className="px-6 py-4 text-right text-xs text-gray-500">{v.capacity ? `${v.capacity} kg` : '—'}</td>
                                <td className="px-6 py-4 text-center">
                                  <span className={`badge border ${VEHICLE_STATUS_COLORS[v.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                    {VEHICLE_STATUS[v.status] || v.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="lg:hidden p-4 space-y-3">
                        {filteredVehicles.map(v => (
                          <div key={v.id} className="p-4 rounded-xl border border-gray-100">
                            <div className="flex items-start justify-between mb-2">
                              <span className="font-mono text-[11px] font-semibold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">{v.plateNumber}</span>
                              <span className={`badge border ${VEHICLE_STATUS_COLORS[v.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                {VEHICLE_STATUS[v.status] || v.status}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-gray-800 mb-1">{[v.brand, v.model].filter(Boolean).join(' ') || '—'}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-400">{VEHICLE_TYPES[v.type] || v.type} · {v.year || '—'}</span>
                              <span className="text-xs text-gray-500">{v.capacity ? `${v.capacity} kg` : ''}</span>
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

          {/* Add Shipment Modal */}
          <Modal isOpen={showAddShipment} onClose={() => setShowAddShipment(false)} title="Nouvelle livraison">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Commande</label>
                <select
                  value={shipmentForm.orderId}
                  onChange={e => setShipmentForm(f => ({ ...f, orderId: e.target.value }))}
                  className="input-field !text-sm"
                >
                  <option value="">Sélectionner une commande...</option>
                  {orders.map(o => (
                    <option key={o.id} value={o.id}>{o.orderNumber} · {formatCFA(o.totalAmount)} {o.currency}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">N° de suivi</label>
                  <input
                    value={shipmentForm.trackingNumber}
                    onChange={e => setShipmentForm(f => ({ ...f, trackingNumber: e.target.value }))}
                    placeholder="DHL123..."
                    className="input-field !text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Transporteur</label>
                  <input
                    value={shipmentForm.carrier}
                    onChange={e => setShipmentForm(f => ({ ...f, carrier: e.target.value }))}
                    placeholder="dhl / local / gabriel..."
                    className="input-field !text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Méthode</label>
                  <select
                    value={shipmentForm.method}
                    onChange={e => setShipmentForm(f => ({ ...f, method: e.target.value }))}
                    className="input-field !text-sm"
                  >
                    <option value="standard">Standard</option>
                    <option value="express">Express</option>
                    <option value="pickup">Retrait</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Livraison estimée</label>
                  <input
                    type="date"
                    value={shipmentForm.estimatedDelivery}
                    onChange={e => setShipmentForm(f => ({ ...f, estimatedDelivery: e.target.value }))}
                    className="input-field !text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Position actuelle</label>
                <input
                  value={shipmentForm.currentLocation}
                  onChange={e => setShipmentForm(f => ({ ...f, currentLocation: e.target.value }))}
                  placeholder="Ville / point de passage"
                  className="input-field !text-sm"
                />
              </div>
              <button onClick={handleAddShipment} className="btn-primary w-full">
                Créer la livraison
              </button>
            </div>
          </Modal>

          {/* Add Route Modal */}
          <Modal isOpen={showAddRoute} onClose={() => setShowAddRoute(false)} title="Nouvelle tournée">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nom</label>
                <input
                  value={routeForm.name}
                  onChange={e => setRouteForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Tournée Yopougon matin"
                  className="input-field !text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Ville</label>
                  <input
                    value={routeForm.city}
                    onChange={e => setRouteForm(f => ({ ...f, city: e.target.value }))}
                    placeholder="Abidjan"
                    className="input-field !text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Date</label>
                  <input
                    type="date"
                    value={routeForm.date}
                    onChange={e => setRouteForm(f => ({ ...f, date: e.target.value }))}
                    className="input-field !text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Véhicule (ID)</label>
                  <input
                    value={routeForm.vehicleId}
                    onChange={e => setRouteForm(f => ({ ...f, vehicleId: e.target.value }))}
                    placeholder="Optionnel"
                    className="input-field !text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Distance (km)</label>
                  <input
                    type="number"
                    value={routeForm.distance}
                    onChange={e => setRouteForm(f => ({ ...f, distance: e.target.value }))}
                    placeholder="0"
                    className="input-field !text-sm"
                  />
                </div>
              </div>
              <button onClick={handleAddRoute} className="btn-primary w-full">
                Créer la tournée
              </button>
            </div>
          </Modal>

          {/* Add Vehicle Modal */}
          <Modal isOpen={showAddVehicle} onClose={() => setShowAddVehicle(false)} title="Ajouter un véhicule">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Plaque</label>
                  <input
                    value={vehicleForm.plateNumber}
                    onChange={e => setVehicleForm(f => ({ ...f, plateNumber: e.target.value }))}
                    placeholder="CI-1234-AB"
                    className="input-field !text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Type</label>
                  <select
                    value={vehicleForm.type}
                    onChange={e => setVehicleForm(f => ({ ...f, type: e.target.value }))}
                    className="input-field !text-sm"
                  >
                    {Object.entries(VEHICLE_TYPES).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Marque</label>
                  <input
                    value={vehicleForm.brand}
                    onChange={e => setVehicleForm(f => ({ ...f, brand: e.target.value }))}
                    placeholder="Toyota"
                    className="input-field !text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Modèle</label>
                  <input
                    value={vehicleForm.model}
                    onChange={e => setVehicleForm(f => ({ ...f, model: e.target.value }))}
                    placeholder="Hilux"
                    className="input-field !text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Année</label>
                  <input
                    type="number"
                    value={vehicleForm.year}
                    onChange={e => setVehicleForm(f => ({ ...f, year: e.target.value }))}
                    placeholder="2022"
                    className="input-field !text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Capacité (kg)</label>
                  <input
                    type="number"
                    value={vehicleForm.capacity}
                    onChange={e => setVehicleForm(f => ({ ...f, capacity: e.target.value }))}
                    placeholder="0"
                    className="input-field !text-sm"
                  />
                </div>
              </div>
              <button onClick={handleAddVehicle} className="btn-primary w-full">
                Ajouter le véhicule
              </button>
            </div>
          </Modal>

          {/* Shipment Status Modal */}
          <Modal isOpen={!!showShipmentStatus} onClose={() => setShowShipmentStatus(null)} title="Changer le statut de livraison">
            {showShipmentStatus && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-gray-900">{showShipmentStatus.trackingNumber || showShipmentStatus.id.slice(0, 8)}</span>
                  <span className="text-xs text-gray-500">{showShipmentStatus.order?.orderNumber || ''}</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Statut</label>
                  <select
                    value={statusForm}
                    onChange={e => setStatusForm(e.target.value)}
                    className="input-field !text-sm"
                  >
                    {Object.entries(SHIPMENT_STATUS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <button onClick={handleShipmentStatus} className="btn-primary w-full">
                  Mettre à jour
                </button>
              </div>
            )}
          </Modal>

          {/* Route Status Modal */}
          <Modal isOpen={!!showRouteStatus} onClose={() => setShowRouteStatus(null)} title="Changer le statut de tournée">
            {showRouteStatus && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-900">{showRouteStatus.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{showRouteStatus.city || showRouteStatus.country} · {formatDate(showRouteStatus.date)}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Statut</label>
                  <select
                    value={statusForm}
                    onChange={e => setStatusForm(e.target.value)}
                    className="input-field !text-sm"
                  >
                    {Object.entries(ROUTE_STATUS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <button onClick={handleRouteStatus} className="btn-primary w-full">
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
