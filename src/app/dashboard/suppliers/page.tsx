'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardTopBar from '@/components/DashboardTopBar';
import { useToast } from '@/contexts/ToastContext';
import Modal from '@/components/Modal';

type Supplier = {
  id: string;
  name: string;
  companyName?: string | null;
  country: string;
  city?: string | null;
  address?: string | null;
  contactPerson?: string | null;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  website?: string | null;
  rating: number;
  leadTimeDays?: number | null;
  paymentTerms?: string | null;
  moq?: number | null;
  verified: boolean;
  metadata?: unknown;
  createdAt: string;
  _count?: { purchaseOrders: number; products: number };
};

const COUNTRY_FLAGS: Record<string, string> = {
  CN: '🇨🇳', TW: '🇹🇼', JP: '🇯🇵', KR: '🇰🇷', DE: '🇩🇪', FR: '🇫🇷', IT: '🇮🇹', ES: '🇪🇸', GB: '🇬🇧', US: '🇺🇸', AE: '🇦🇪', TR: '🇹🇷', IN: '🇮🇳', TH: '🇹🇭', MA: '🇲🇦', CI: '🇨🇮',
};
const COUNTRY_LABELS: Record<string, string> = {
  CN: 'Chine', TW: 'Taiwan', JP: 'Japon', KR: 'Coree', DE: 'Allemagne', FR: 'France', IT: 'Italie', ES: 'Espagne', GB: 'Royaume-Uni', US: 'Etats-Unis', AE: 'Emirats', TR: 'Turquie', IN: 'Inde', TH: 'Thailande', MA: 'Maroc', CI: 'Cote d\'Ivoire',
};
const PAYMENT_TERMS = ['NET30', 'NET60', 'NET90', 'LC', 'TT', 'COD'];

export default function SuppliersPage() {
  const { addToast } = useToast();

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');
  const [verifiedFilter, setVerifiedFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const [detail, setDetail] = useState<Supplier | null>(null);

  const [form, setForm] = useState({
    name: '', companyName: '', country: 'CN', city: '', address: '',
    contactPerson: '', email: '', phone: '', whatsapp: '', website: '',
    leadTimeDays: '', paymentTerms: 'NET30', moq: '', verified: false,
  });

  const formatDate = useCallback((d: string) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }), []);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/v1/suppliers', { credentials: 'include' });
        const data = await res.json();
        if (!cancelled) {
          if (data.success) setSuppliers(data.data?.data || data.data || []);
          else addToast('error', 'Erreur lors du chargement des fournisseurs');
        }
      } catch (err) {
        console.error('Failed to fetch suppliers', err);
        if (!cancelled) addToast('error', 'Erreur lors du chargement des fournisseurs');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [refreshKey, addToast]);

  const stats = useMemo(() => {
    const verified = suppliers.filter(s => s.verified).length;
    const totalPo = suppliers.reduce((acc, s) => acc + (s._count?.purchaseOrders || 0), 0);
    const avgRating = suppliers.length ? suppliers.reduce((acc, s) => acc + s.rating, 0) / suppliers.length : 0;
    const countries = new Set(suppliers.map(s => s.country)).size;
    return { total: suppliers.length, verified, totalPo, avgRating: Number(avgRating.toFixed(1)), countries };
  }, [suppliers]);

  const countries = useMemo(() => Array.from(new Set(suppliers.map(s => s.country))).sort(), [suppliers]);

  const filtered = useMemo(() => suppliers.filter(s => {
    const matchSearch = `${s.name} ${s.companyName || ''} ${s.contactPerson || ''} ${s.email || ''} ${s.phone || ''}`
      .toLowerCase().includes(search.toLowerCase());
    const matchCountry = countryFilter === 'all' || s.country === countryFilter;
    const matchVerified = verifiedFilter === 'all' || String(s.verified) === verifiedFilter;
    return matchSearch && matchCountry && matchVerified;
  }), [suppliers, search, countryFilter, verifiedFilter]);

  const resetForm = () => setForm({
    name: '', companyName: '', country: 'CN', city: '', address: '',
    contactPerson: '', email: '', phone: '', whatsapp: '', website: '',
    leadTimeDays: '', paymentTerms: 'NET30', moq: '', verified: false,
  });

  const payload = () => ({
    name: form.name,
    companyName: form.companyName || undefined,
    country: form.country,
    city: form.city || undefined,
    address: form.address || undefined,
    contactPerson: form.contactPerson || undefined,
    email: form.email || undefined,
    phone: form.phone || undefined,
    whatsapp: form.whatsapp || undefined,
    website: form.website || undefined,
    leadTimeDays: form.leadTimeDays ? Number(form.leadTimeDays) : undefined,
    paymentTerms: form.paymentTerms || undefined,
    moq: form.moq ? Number(form.moq) : undefined,
    verified: form.verified,
  });

  const handleAdd = async () => {
    if (!form.name || !form.country) { addToast('error', 'Nom et pays sont requis'); return; }
    try {
      const res = await fetch('/api/v1/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload()),
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', `${form.name} ajoute aux fournisseurs`);
        setShowAdd(false);
        resetForm();
        setRefreshKey(k => k + 1);
      } else {
        addToast('error', data.message || 'Erreur lors de la creation');
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur lors de la creation du fournisseur');
    }
  };

  const handleUpdate = async () => {
    if (!editSupplier) return;
    try {
      const res = await fetch(`/api/v1/suppliers/${editSupplier.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload()),
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', 'Fournisseur mis a jour');
        setEditSupplier(null);
        resetForm();
        setRefreshKey(k => k + 1);
      } else {
        addToast('error', data.message || 'Erreur lors de la mise a jour');
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur lors de la mise a jour du fournisseur');
    }
  };

  const handleDelete = async (s: Supplier) => {
    if (!window.confirm(`Supprimer le fournisseur ${s.name} ?`)) return;
    try {
      const res = await fetch(`/api/v1/suppliers/${s.id}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        addToast('success', 'Fournisseur supprime');
        if (detail?.id === s.id) setDetail(null);
        setRefreshKey(k => k + 1);
      } else {
        addToast('error', data.message || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur lors de la suppression');
    }
  };

  const openEdit = (s: Supplier) => {
    setEditSupplier(s);
    setForm({
      name: s.name,
      companyName: s.companyName || '',
      country: s.country,
      city: s.city || '',
      address: s.address || '',
      contactPerson: s.contactPerson || '',
      email: s.email || '',
      phone: s.phone || '',
      whatsapp: s.whatsapp || '',
      website: s.website || '',
      leadTimeDays: s.leadTimeDays != null ? String(s.leadTimeDays) : '',
      paymentTerms: s.paymentTerms || 'NET30',
      moq: s.moq != null ? String(s.moq) : '',
      verified: s.verified,
    });
    setShowAdd(true);
  };

  const inputCls = 'w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-400 text-sm';
  const labelCls = 'block text-xs font-medium text-gray-500 mb-1';

  return (
    <div className="min-h-screen bg-[#F6F8FB]">
      <Sidebar />
      <div className="lg:pl-[72px] lg:group-hover:pl-[240px] transition-all duration-300">
        <DashboardTopBar />
        <main className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Fournisseurs</h1>
              <p className="text-sm text-gray-500 mt-1">Gerer vos fournisseurs de pieces automobiles</p>
            </div>
            <button
              onClick={() => { setEditSupplier(null); resetForm(); setShowAdd(true); }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold shadow-lg shadow-orange-500/25 hover:opacity-95 transition-opacity"
            >
              + Nouveau fournisseur
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-28 rounded-2xl bg-white animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Fournisseurs</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Verifies</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.verified}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Bons de commande</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalPo}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Pays</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.countries}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Rechercher un fournisseur (nom, contact, email...)"
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-400 text-sm"
                  />
                  <select value={countryFilter} onChange={e => setCountryFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white">
                    <option value="all">Tous les pays</option>
                    {countries.map(c => <option key={c} value={c}>{COUNTRY_LABELS[c] || c} ({c})</option>)}
                  </select>
                  <select value={verifiedFilter} onChange={e => setVerifiedFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white">
                    <option value="all">Tous statuts</option>
                    <option value="true">Verifies</option>
                    <option value="false">Non verifies</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                        <th className="px-4 py-3 font-medium">Fournisseur</th>
                        <th className="px-4 py-3 font-medium">Contact</th>
                        <th className="px-4 py-3 font-medium">Pays</th>
                        <th className="px-4 py-3 font-medium">Delai</th>
                        <th className="px-4 py-3 font-medium">Note</th>
                        <th className="px-4 py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                            Aucun fournisseur trouve
                          </td>
                        </tr>
                      )}
                      {filtered.map(s => (
                        <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                {s.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <button onClick={() => setDetail(s)} className="font-semibold text-gray-900 hover:text-orange-600 text-left">
                                  {s.name}
                                  {s.verified && <span className="ml-1.5 text-emerald-500" title="Verifie">✓</span>}
                                </button>
                                {s.companyName && <p className="text-xs text-gray-400">{s.companyName}</p>}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {s.contactPerson && <p className="text-gray-700">{s.contactPerson}</p>}
                            {s.phone && <p className="text-xs text-gray-400">{s.phone}</p>}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-lg">{COUNTRY_FLAGS[s.country] || '🏳️'}</span>
                            <span className="ml-1 text-xs text-gray-500">{COUNTRY_LABELS[s.country] || s.country}</span>
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {s.leadTimeDays != null ? `${s.leadTimeDays} j` : '—'}
                            <span className="ml-2 text-xs text-gray-400">{s.paymentTerms || ''}</span>
                          </td>
                          <td className="px-4 py-3">
                            {s.rating > 0 ? (
                              <span className="inline-flex items-center gap-1 text-amber-500 font-medium">
                                <span>★</span> {s.rating.toFixed(1)}
                              </span>
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button onClick={() => setDetail(s)} className="text-gray-400 hover:text-orange-600 text-xs font-medium">Voir</button>
                              <button onClick={() => openEdit(s)} className="text-gray-400 hover:text-blue-600 text-xs font-medium">Modifier</button>
                              <button onClick={() => handleDelete(s)} className="text-gray-400 hover:text-red-600 text-xs font-medium">Suppr.</button>
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
            <div className="p-6 max-w-lg">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {editSupplier ? 'Modifier le fournisseur' : 'Nouveau fournisseur'}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={labelCls}>Nom *</label>
                  <input className={inputCls} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="ex: Guangzhou Parts Co." />
                </div>
                <div>
                  <label className={labelCls}>Raison sociale</label>
                  <input className={inputCls} value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Pays *</label>
                  <select className={inputCls} value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}>
                    <option value="CN">Chine</option>
                    <option value="TW">Taiwan</option>
                    <option value="JP">Japon</option>
                    <option value="KR">Coree</option>
                    <option value="DE">Allemagne</option>
                    <option value="FR">France</option>
                    <option value="AE">Emirats</option>
                    <option value="TR">Turquie</option>
                    <option value="MA">Maroc</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Ville</label>
                  <input className={inputCls} value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Adresse</label>
                  <input className={inputCls} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Personne de contact</label>
                  <input className={inputCls} value={form.contactPerson} onChange={e => setForm({ ...form, contactPerson: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Telephone</label>
                  <input className={inputCls} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Email</label>
                  <input className={inputCls} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>WhatsApp</label>
                  <input className={inputCls} value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Delai moyen (jours)</label>
                  <input className={inputCls} type="number" min="0" value={form.leadTimeDays} onChange={e => setForm({ ...form, leadTimeDays: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Conditions de paiement</label>
                  <select className={inputCls} value={form.paymentTerms} onChange={e => setForm({ ...form, paymentTerms: e.target.value })}>
                    {PAYMENT_TERMS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>MOQ (quantite min.)</label>
                  <input className={inputCls} type="number" min="0" value={form.moq} onChange={e => setForm({ ...form, moq: e.target.value })} />
                </div>
                <div className="col-span-2 flex items-center gap-2 pt-1">
                  <input id="supplier-verified" type="checkbox" checked={form.verified} onChange={e => setForm({ ...form, verified: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                  <label htmlFor="supplier-verified" className="text-sm text-gray-600">Fournisseur verifie</label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAdd(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50">
                  Annuler
                </button>
                <button onClick={editSupplier ? handleUpdate : handleAdd} className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold shadow-lg shadow-orange-500/25">
                  {editSupplier ? 'Enregistrer' : 'Creer le fournisseur'}
                </button>
              </div>
            </div>
          </Modal>

          <Modal isOpen={!!detail} onClose={() => setDetail(null)}>
            {detail && (
              <div className="p-6 max-w-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white font-bold text-lg">
                      {detail.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        {detail.name}
                        {detail.verified && <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-medium">Verifie</span>}
                      </h2>
                      {detail.companyName && <p className="text-sm text-gray-500">{detail.companyName}</p>}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-gray-900">{detail._count?.purchaseOrders ?? 0}</p>
                    <p className="text-xs text-gray-400">Bons de commande</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-gray-900">{detail._count?.products ?? 0}</p>
                    <p className="text-xs text-gray-400">Produits</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-amber-500">
                      {detail.rating > 0 ? `★ ${detail.rating.toFixed(1)}` : '—'}
                    </p>
                    <p className="text-xs text-gray-400">Note</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Pays</span>
                    <span className="font-medium text-gray-900">{COUNTRY_FLAGS[detail.country] || ''} {COUNTRY_LABELS[detail.country] || detail.country}</span>
                  </div>
                  {detail.city && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Ville</span>
                      <span className="font-medium text-gray-900">{detail.city}</span>
                    </div>
                  )}
                  {detail.address && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Adresse</span>
                      <span className="font-medium text-gray-900">{detail.address}</span>
                    </div>
                  )}
                  {detail.contactPerson && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Contact</span>
                      <span className="font-medium text-gray-900">{detail.contactPerson}</span>
                    </div>
                  )}
                  {detail.phone && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Telephone</span>
                      <span className="font-medium text-gray-900">{detail.phone}</span>
                    </div>
                  )}
                  {detail.email && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Email</span>
                      <span className="font-medium text-gray-900">{detail.email}</span>
                    </div>
                  )}
                  {detail.whatsapp && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">WhatsApp</span>
                      <span className="font-medium text-gray-900">{detail.whatsapp}</span>
                    </div>
                  )}
                  {detail.leadTimeDays != null && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Delai moyen</span>
                      <span className="font-medium text-gray-900">{detail.leadTimeDays} jours</span>
                    </div>
                  )}
                  {detail.paymentTerms && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Conditions</span>
                      <span className="font-medium text-gray-900">{detail.paymentTerms}</span>
                    </div>
                  )}
                  {detail.moq != null && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">MOQ</span>
                      <span className="font-medium text-gray-900">{detail.moq}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Ajoute le</span>
                    <span className="font-medium text-gray-900">{formatDate(detail.createdAt)}</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setDetail(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50">
                    Fermer
                  </button>
                  <button onClick={() => { setDetail(null); openEdit(detail); }} className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold shadow-lg shadow-orange-500/25">
                    Modifier
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
