'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardTopBar from '@/components/DashboardTopBar';
import { useToast } from '@/contexts/ToastContext';
import { useApp } from '@/contexts/AppContext';
import Modal from '@/components/Modal';

type CustomsRecord = {
  id: string;
  containerId: string;
  container?: { id: string; containerNumber: string; size: string; status: string; destinationPort: string } | null;
  declarationNumber?: string | null;
  hsCode?: string | null;
  cifValue?: number | null;
  duties?: number | null;
  taxes?: number | null;
  fees?: number | null;
  totalDuty?: number | null;
  status: string;
  broker?: string | null;
  brokerContact?: string | null;
  releasedAt?: string | null;
  notes?: string | null;
  createdAt: string;
};

type ContainerOption = { id: string; containerNumber: string };

const CUSTOMS_STATUSES = ['PENDING', 'DOCUMENTS_REQUIRED', 'UNDER_REVIEW', 'DUTY_ASSESSED', 'DUTY_PAID', 'INSPECTION', 'RELEASED', 'HELD'];
const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-600 border-gray-200',
  DOCUMENTS_REQUIRED: 'bg-amber-50 text-amber-600 border-amber-200',
  UNDER_REVIEW: 'bg-blue-50 text-blue-600 border-blue-200',
  DUTY_ASSESSED: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  DUTY_PAID: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  INSPECTION: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  RELEASED: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  HELD: 'bg-red-50 text-red-600 border-red-200',
};

export default function CustomsPage() {
  const { addToast } = useToast();
  const { locale } = useApp();
  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const STATUS_LABELS: Record<string, string> = {
    PENDING: L('En attente', 'Pending'), DOCUMENTS_REQUIRED: L('Documents requis', 'Documents required'), UNDER_REVIEW: L('En examen', 'Under review'),
    DUTY_ASSESSED: L('Taxes évaluées', 'Duty assessed'), DUTY_PAID: L('Taxes payées', 'Duty paid'), INSPECTION: L('Inspection', 'Inspection'),
    RELEASED: L('Libéré', 'Released'), HELD: L('Retenu', 'Held'),
  };

  const [records, setRecords] = useState<CustomsRecord[]>([]);
  const [containers, setContainers] = useState<ContainerOption[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [detail, setDetail] = useState<CustomsRecord | null>(null);

  const [form, setForm] = useState({
    containerId: '', declarationNumber: '', hsCode: '', cifValue: '',
    duties: '', taxes: '', fees: '', totalDuty: '', status: 'PENDING',
    broker: '', brokerContact: '', notes: '',
  });

  const formatMoney = useCallback((n: number) =>
    new Intl.NumberFormat('fr-FR').format(n) + ' XOF', []);
  const formatDate = useCallback((d?: string | null) =>
    d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—', []);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [cRes, ctnRes] = await Promise.all([
          fetch('/api/v1/customs-records', { credentials: 'include' }),
          fetch('/api/v1/containers?pageSize=100', { credentials: 'include' }),
        ]);
        const cData = await cRes.json();
        const ctnData = await ctnRes.json();
        if (!cancelled) {
          if (cData.success) setRecords(cData.data?.data || cData.data || []);
          if (ctnData.success) setContainers(ctnData.data?.data || ctnData.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch customs records', err);
        if (!cancelled) addToast('error', 'Erreur lors du chargement des dossiers douane');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [refreshKey, addToast]);

  const stats = useMemo(() => {
    const total = records.length;
    const pending = records.filter(r => ['PENDING', 'DOCUMENTS_REQUIRED', 'UNDER_REVIEW', 'INSPECTION'].includes(r.status)).length;
    const cleared = records.filter(r => r.status === 'RELEASED').length;
    const held = records.filter(r => r.status === 'HELD').length;
    return { total, pending, cleared, held };
  }, [records]);

  const totalDuty = useMemo(() => records.reduce((acc, r) => acc + (r.totalDuty || 0), 0), [records]);

  const filtered = useMemo(() => records.filter(r => {
    const matchSearch = `${r.declarationNumber || ''} ${r.container?.containerNumber || ''} ${r.broker || ''} ${r.hsCode || ''}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  }), [records, search, statusFilter]);

  const resetForm = () => {
    setForm({
      containerId: '', declarationNumber: '', hsCode: '', cifValue: '',
      duties: '', taxes: '', fees: '', totalDuty: '', status: 'PENDING',
      broker: '', brokerContact: '', notes: '',
    });
  };

  const handleAdd = async () => {
    if (!form.containerId) {
      addToast('error', 'Conteneur requis');
      return;
    }
    try {
      const res = await fetch('/api/v1/customs-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          containerId: form.containerId,
          declarationNumber: form.declarationNumber || undefined,
          hsCode: form.hsCode || undefined,
          cifValue: form.cifValue ? Number(form.cifValue) : undefined,
          duties: form.duties ? Number(form.duties) : undefined,
          taxes: form.taxes ? Number(form.taxes) : undefined,
          fees: form.fees ? Number(form.fees) : undefined,
          totalDuty: form.totalDuty ? Number(form.totalDuty) : undefined,
          status: form.status,
          broker: form.broker || undefined,
          brokerContact: form.brokerContact || undefined,
          notes: form.notes || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', `Dossier douane cree`);
        setShowAdd(false);
        resetForm();
        setRefreshKey(k => k + 1);
      } else {
        addToast('error', data.message || 'Erreur lors de la creation');
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur lors de la creation du dossier douane');
    }
  };

  const handleStatusChange = async (r: CustomsRecord, status: string) => {
    try {
      const res = await fetch(`/api/v1/customs-records/${r.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', `${r.container?.containerNumber || r.id} -> ${STATUS_LABELS[status] || status}`);
        setRefreshKey(k => k + 1);
      } else {
        addToast('error', data.message || 'Erreur lors du changement de statut');
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur lors du changement de statut');
    }
  };

  const handleDelete = async (r: CustomsRecord) => {
    if (!window.confirm(`Supprimer le dossier douane ${r.declarationNumber || r.id} ?`)) return;
    try {
      const res = await fetch(`/api/v1/customs-records/${r.id}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        addToast('success', 'Dossier douane supprime');
        if (detail?.id === r.id) setDetail(null);
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
              <h1 className="text-2xl font-bold text-gray-900">Douanes</h1>
              <p className="text-sm text-gray-500 mt-1">Suivi des dossiers de dedouanement</p>
            </div>
            <button
              onClick={() => { resetForm(); setShowAdd(true); }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold shadow-lg shadow-orange-500/25 hover:opacity-95 transition-opacity"
            >
              + Nouveau dossier douane
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
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Dossiers</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">En cours</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Liberes</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.cleared}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Droits de douane</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{formatMoney(totalDuty)}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 flex flex-col sm:flex-row gap-3 border-b border-gray-100">
                  <input aria-label="Rechercher (declaration, conteneur, courtier...)"
                    type="text"
                    placeholder="Rechercher (declaration, conteneur, courtier...)"
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
                    {CUSTOMS_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s] || s}</option>)}
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                        <th className="px-4 py-3 font-medium">Conteneur</th>
                        <th className="px-4 py-3 font-medium">Declaration</th>
                        <th className="px-4 py-3 font-medium">Courtier</th>
                        <th className="px-4 py-3 font-medium">Droits</th>
                        <th className="px-4 py-3 font-medium">Statut</th>
                        <th className="px-4 py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(r => (
                        <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="px-4 py-3">
                            <p className="font-semibold text-gray-800">{r.container?.containerNumber || '—'}</p>
                            <p className="text-xs text-gray-400">{r.container?.destinationPort || ''}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-gray-700">{r.declarationNumber || '—'}</span>
                            {r.hsCode && <p className="text-xs text-gray-400">SH {r.hsCode}</p>}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-gray-700">{r.broker || '—'}</span>
                            {r.brokerContact && <p className="text-xs text-gray-400">{r.brokerContact}</p>}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-gray-700">{r.totalDuty != null ? formatMoney(r.totalDuty) : '—'}</span>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={r.status}
                              onChange={e => handleStatusChange(r, e.target.value)}
                              className={`px-2.5 py-1 rounded-full border text-xs font-medium focus:outline-none ${STATUS_COLORS[r.status] || ''}`}
                            >
                              {CUSTOMS_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s] || s}</option>)}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button onClick={() => setDetail(r)} className="text-orange-600 hover:text-orange-700 text-xs font-medium">Voir</button>
                              <button onClick={() => handleDelete(r)} className="text-red-500 hover:text-red-600 text-xs font-medium">Supprimer</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filtered.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-10 text-center text-gray-400">Aucun dossier douane trouve</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Nouveau dossier douane">
            <div className="space-y-4">
              <div>
                <label htmlFor="conteneur" className={labelCls}>Conteneur *</label>
                <select id="conteneur" value={form.containerId} onChange={e => setForm({ ...form, containerId: e.target.value })} className={inputCls}>
                  <option value="">— Selectionner —</option>
                  {containers.map(c => <option key={c.id} value={c.id}>{c.containerNumber}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="numero-de-declaration" className={labelCls}>Numero de declaration</label>
                  <input id="numero-de-declaration" type="text" value={form.declarationNumber} onChange={e => setForm({ ...form, declarationNumber: e.target.value })} className={inputCls} placeholder="Ex : D2024-001" />
                </div>
                <div>
                  <label htmlFor="code-sh" className={labelCls}>Code SH</label>
                  <input id="code-sh" type="text" value={form.hsCode} onChange={e => setForm({ ...form, hsCode: e.target.value })} className={inputCls} placeholder="Ex : 8708" />
                </div>
              </div>
              <div>
                <label htmlFor="statut" className={labelCls}>Statut</label>
                <select id="statut" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={inputCls}>
                  {CUSTOMS_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s] || s}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="valeur-cif-xof" className={labelCls}>Valeur CIF (XOF)</label>
                  <input id="valeur-cif-xof" type="number" inputMode="numeric" value={form.cifValue} onChange={e => setForm({ ...form, cifValue: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="total-droits-xof" className={labelCls}>Total droits (XOF)</label>
                  <input id="total-droits-xof" type="number" inputMode="numeric" value={form.totalDuty} onChange={e => setForm({ ...form, totalDuty: e.target.value })} className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label htmlFor="droits" className={labelCls}>Droits</label>
                  <input id="droits" type="number" inputMode="numeric" value={form.duties} onChange={e => setForm({ ...form, duties: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="taxes" className={labelCls}>Taxes</label>
                  <input id="taxes" type="number" inputMode="numeric" value={form.taxes} onChange={e => setForm({ ...form, taxes: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="frais" className={labelCls}>Frais</label>
                  <input id="frais" type="number" inputMode="numeric" value={form.fees} onChange={e => setForm({ ...form, fees: e.target.value })} className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="courtier" className={labelCls}>Courtier</label>
                  <input id="courtier" type="text" value={form.broker} onChange={e => setForm({ ...form, broker: e.target.value })} className={inputCls} placeholder="Ex : SGS" />
                </div>
                <div>
                  <label htmlFor="contact-courtier" className={labelCls}>Contact courtier</label>
                  <input id="contact-courtier" type="text" value={form.brokerContact} onChange={e => setForm({ ...form, brokerContact: e.target.value })} className={inputCls} />
                </div>
              </div>
              <div>
                <label htmlFor="notes" className={labelCls}>Notes</label>
                <textarea id="notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className={inputCls} rows={2} />
              </div>
              <button onClick={handleAdd} className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold hover:opacity-95 transition-opacity">
                Creer le dossier douane
              </button>
            </div>
          </Modal>

          <Modal isOpen={!!detail} onClose={() => setDetail(null)} title={detail ? `Dossier douane ${detail.declarationNumber || detail.id}` : ''}>
            {detail && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{detail.container?.containerNumber || '—'}</p>
                    <p className="text-sm text-gray-500">{detail.container?.destinationPort || ''}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full border text-xs font-medium ${STATUS_COLORS[detail.status] || ''}`}>
                    {STATUS_LABELS[detail.status] || detail.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm mb-5">
                  <div className="flex justify-between"><span className="text-gray-500">Declaration</span><span className="font-medium">{detail.declarationNumber || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Code SH</span><span className="font-medium">{detail.hsCode || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Valeur CIF</span><span className="font-medium">{detail.cifValue != null ? formatMoney(detail.cifValue) : '—'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Droits</span><span className="font-medium">{detail.duties != null ? formatMoney(detail.duties) : '—'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Taxes</span><span className="font-medium">{detail.taxes != null ? formatMoney(detail.taxes) : '—'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Frais</span><span className="font-medium">{detail.fees != null ? formatMoney(detail.fees) : '—'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Total</span><span className="font-medium">{detail.totalDuty != null ? formatMoney(detail.totalDuty) : '—'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Courtier</span><span className="font-medium">{detail.broker || '—'}</span></div>
                  {detail.releasedAt && <div className="flex justify-between"><span className="text-gray-500">Libere le</span><span className="font-medium">{formatDate(detail.releasedAt)}</span></div>}
                  {detail.notes && <div className="flex justify-between"><span className="text-gray-500">Notes</span><span className="font-medium">{detail.notes}</span></div>}
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
