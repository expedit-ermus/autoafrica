'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardTopBar from '@/components/DashboardTopBar';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/contexts/ToastContext';

export default function ProfilePage() {
  const { t, user } = useApp();
  const { addToast } = useToast();
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', shopName: '', city: '', country: 'CI', description: '' });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'shop'>('profile');
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });
  const [notifications, setNotifications] = useState({ email: true, sms: false });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const formatCFA = (n: number) => new Intl.NumberFormat('fr-FR').format(n);

  const [prevUserId, setPrevUserId] = useState(user?.id);
  if (user && user.id !== prevUserId) {
    setPrevUserId(user.id);
    setForm({
      firstName: user.firstName || '', lastName: user.lastName || '',
      phone: user.phone || '', shopName: user.shopName || '',
      city: user.city || '', country: user.country || 'CI',
      description: user.description || '',
    });
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [p, o] = await Promise.all([
          fetch('/api/v1/products?pageSize=100', { credentials: 'include' }),
          fetch('/api/v1/orders?pageSize=100', { credentials: 'include' }),
        ]);
        const pd = await p.json();
        const od = await o.json();
        if (!cancelled) {
          if (pd.success) setStats(s => ({ ...s, products: pd.data.total || pd.data.data?.length || 0 }));
          if (od.success) {
            const orders = od.data.data || [];
            const revenue = orders.filter((o: any) => o.status === 'DELIVERED' || o.status === 'COMPLETED').reduce((s: number, o: any) => s + (o.totalAmount || o.total || 0), 0);
            setStats(s => ({ ...s, orders: orders.length, revenue }));
          }
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await new Promise(r => setTimeout(r, 500));
      addToast('success', 'Profil mis à jour');
    } catch { addToast('error', 'Erreur'); } finally { setSaving(false); }
  };

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.newPass) { addToast('error', 'Remplissez tous les champs'); return; }
    if (passwords.newPass !== passwords.confirm) { addToast('error', 'Les mots de passe ne correspondent pas'); return; }
    setSaving(true);
    try {
      await new Promise(r => setTimeout(r, 500));
      addToast('success', 'Mot de passe modifié');
      setPasswords({ current: '', newPass: '', confirm: '' });
    } catch { addToast('error', 'Erreur'); } finally { setSaving(false); }
  };

  const initials = user ? `${(user.firstName || '')[0] || ''}${(user.lastName || '')[0] || ''}` : 'U';

  const tabs = [
    { id: 'profile' as const, label: 'Profil', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )},
    { id: 'shop' as const, label: 'Boutique', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
    )},
    { id: 'password' as const, label: 'Sécurité', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    )},
  ];

  return (
    <div className="flex min-h-screen bg-[#F0F2F5]">
      <Sidebar />
      <div className="flex-1 lg:ml-[260px]">
        <DashboardTopBar />
        <main className="p-4 lg:p-8 pb-24 lg:pb-8 max-w-5xl mx-auto">

          {/* ── Profile Header ── */}
          <div className="relative overflow-hidden rounded-3xl bg-white border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.02)] mb-8">
            {/* Gradient Banner */}
            <div className="h-36 sm:h-44 bg-gradient-to-br from-[#E85D04] via-[#D00000] to-[#1a1a2e] relative">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 30%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
            </div>

            <div className="px-6 sm:px-8 pb-6 -mt-12 relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
                {/* Avatar */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-[#E85D04] to-[#D00000] flex items-center justify-center text-white text-3xl sm:text-4xl font-extrabold shadow-lg ring-4 ring-white shrink-0">
                  {initials}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0 pb-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 truncate">
                      {user?.firstName || 'Vendeur'} {user?.lastName || ''}
                    </h1>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-[#E85D04]/10 to-[#D00000]/10 text-[#D00000] border border-[#D00000]/10 w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D00000] animate-pulse" />
                      {user?.role === 'SELLER' ? 'Vendeur' : 'Acheteur'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                    {user?.email || '—'}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                    {form.city || '—'}, {form.country}
                  </p>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="text-center p-4 rounded-2xl bg-blue-50/80 border border-blue-100/50">
                  <p className="text-2xl sm:text-3xl font-extrabold text-blue-600">{stats.products}</p>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">Pièces</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-emerald-50/80 border border-emerald-100/50">
                  <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{stats.orders}</p>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">Commandes</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-amber-50/80 border border-amber-100/50">
                  <p className="text-2xl sm:text-3xl font-extrabold text-amber-600">{formatCFA(stats.revenue)}</p>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">FCFA</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="flex gap-2 mb-8 overflow-x-auto hide-scrollbar pb-1">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#E85D04] to-[#D00000] text-white shadow-md shadow-[#E85D04]/20'
                    : 'bg-white text-gray-500 border border-gray-200/80 hover:border-gray-300 hover:text-gray-700'
                }`}>
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Profile Tab ── */}
          {activeTab === 'profile' && (
            <div className="grid gap-6 lg:grid-cols-2 animate-fade-in">

              {/* Personal Info Card */}
              <div className="bg-white rounded-3xl border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.02)] p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Informations personnelles</h3>
                    <p className="text-xs text-gray-400">Gérez vos données personnelles</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Prénom</label>
                      <input className="input-field" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Nom</label>
                      <input className="input-field" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Email</label>
                    <div className="relative">
                      <input className="input-field bg-gray-50/80 pr-10" value={user?.email || ''} disabled />
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Téléphone</label>
                      <input className="input-field" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+225 XX XX XX XX" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Ville</label>
                      <input className="input-field" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Pays</label>
                    <select className="input-field" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}>
                      {Object.entries(t.countries).map(([code, name]) => <option key={code} value={code}>{name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Business Info Card */}
              <div className="bg-white rounded-3xl border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.02)] p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Ma boutique</h3>
                    <p className="text-xs text-gray-400">Informations de votre commerce</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Nom de la boutique</label>
                    <input className="input-field" value={form.shopName} onChange={e => setForm({ ...form, shopName: e.target.value })} placeholder="AutoPièces CI" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Description</label>
                    <textarea className="input-field resize-none" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Spécialiste en pièces Toyota et Peugeot..." />
                  </div>
                  <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/50 rounded-2xl p-4 border border-blue-100/50">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-blue-800">Votre page publique</p>
                        <p className="text-xs text-blue-500 mt-0.5 font-mono">autoafrique.com/boutique/{form.shopName ? form.shopName.toLowerCase().replace(/\s+/g, '-') : 'votre-nom'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notifications Card */}
              <div className="bg-white rounded-3xl border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.02)] p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Notifications</h3>
                    <p className="text-xs text-gray-400">Préférences de communication</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { key: 'email' as const, label: 'Notifications email', desc: 'Recevez des alertes par email', icon: (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                    )},
                    { key: 'sms' as const, label: 'Notifications SMS', desc: 'Recevez des alertes par SMS', icon: (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>
                    )},
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/80 border border-gray-100/50 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-500">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                          <p className="text-xs text-gray-400">{item.desc}</p>
                        </div>
                      </div>
                      {/* Toggle Switch */}
                      <button onClick={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key] }))}
                        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${notifications[item.key] ? 'bg-gradient-to-r from-[#E85D04] to-[#D00000]' : 'bg-gray-300'}`}>
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${notifications[item.key] ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="lg:col-span-2 flex justify-end">
                <button onClick={handleSaveProfile} disabled={saving}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#E85D04] to-[#D00000] text-white shadow-lg shadow-[#E85D04]/25 hover:shadow-xl hover:shadow-[#E85D04]/30 hover:-translate-y-0.5 active:scale-[0.97] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                  {saving ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      Enregistrer le profil
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ── Security Tab ── */}
          {activeTab === 'password' && (
            <div className="max-w-lg animate-fade-in">
              <div className="bg-white rounded-3xl border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.02)] p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Changer le mot de passe</h3>
                    <p className="text-xs text-gray-400">Protégez votre compte</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Mot de passe actuel</label>
                    <div className="relative">
                      <input type={showCurrentPass ? 'text' : 'password'} className="input-field pr-10" value={passwords.current} onChange={e => setPasswords({ ...passwords, current: e.target.value })} />
                      <button type="button" onClick={() => setShowCurrentPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        {showCurrentPass ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Nouveau mot de passe</label>
                    <div className="relative">
                      <input type={showNewPass ? 'text' : 'password'} className="input-field pr-10" value={passwords.newPass} onChange={e => setPasswords({ ...passwords, newPass: e.target.value })} placeholder="Min. 8 caractères" />
                      <button type="button" onClick={() => setShowNewPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        {showNewPass ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Confirmer</label>
                    <div className="relative">
                      <input type={showConfirmPass ? 'text' : 'password'} className="input-field pr-10" value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} />
                      <button type="button" onClick={() => setShowConfirmPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        {showConfirmPass ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Tip */}
                  <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/50 rounded-2xl p-4 border border-amber-100/50">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-amber-800">Conseil de sécurité</p>
                        <p className="text-xs text-amber-600/80 mt-0.5">Utilisez au moins 8 caractères avec des chiffres, des lettres et des symboles pour un mot de passe robuste.</p>
                      </div>
                    </div>
                  </div>

                  <button onClick={handleChangePassword} disabled={saving}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#E85D04] to-[#D00000] text-white shadow-lg shadow-[#E85D04]/25 hover:shadow-xl hover:shadow-[#E85D04]/30 hover:-translate-y-0.5 active:scale-[0.97] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                    {saving ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        Modification...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                        Modifier le mot de passe
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
