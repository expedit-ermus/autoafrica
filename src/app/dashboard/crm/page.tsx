'use client';
import { useState, useEffect, useMemo } from 'react';
import RemoteImage from '@/components/RemoteImage';
import Sidebar from '@/components/Sidebar';
import DashboardTopBar from '@/components/DashboardTopBar';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/contexts/ToastContext';
import Modal from '@/components/Modal';
import QRCodeDisplay from '@/components/QRCodeDisplay';

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  type: string;
  notes: string;
  source: string;
  createdAt: string;
};

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  value: number;
  notes: string;
  status: string;
  createdAt: string;
};

const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'converted', 'lost'];
const LEAD_STATUS_LABELS: Record<string, string> = {
  new: 'Nouveau',
  contacted: 'Contacte',
  qualified: 'Qualifie',
  converted: 'Converti',
  lost: 'Perdu',
};
const CUSTOMER_TYPES = ['garage', 'revendeur', 'particulier', 'flotte'];
const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-50 text-blue-600 border-blue-200',
  contacted: 'bg-amber-50 text-amber-600 border-amber-200',
  qualified: 'bg-purple-50 text-purple-600 border-purple-200',
  converted: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  lost: 'bg-red-50 text-red-600 border-red-200',
};
const STATUS_DOTS: Record<string, string> = {
  new: 'bg-blue-500',
  contacted: 'bg-amber-500',
  qualified: 'bg-purple-500',
  converted: 'bg-emerald-500',
  lost: 'bg-red-500',
};
const TYPE_COLORS: Record<string, string> = {
  garage: 'bg-orange-50 text-orange-600 border-orange-200',
  revendeur: 'bg-blue-50 text-blue-600 border-blue-200',
  particulier: 'bg-gray-100 text-gray-600 border-gray-200',
  flotte: 'bg-purple-50 text-purple-600 border-purple-200',
};
const AVATAR_COLORS = [
  'from-orange-400 to-red-500',
  'from-blue-400 to-indigo-500',
  'from-emerald-400 to-teal-500',
  'from-purple-400 to-pink-500',
  'from-amber-400 to-orange-500',
  'from-cyan-400 to-blue-500',
];
const COUNTRY_FLAGS: Record<string, string> = {
  CI: 'ci', SN: 'sn', ML: 'ml', BF: 'bf', GH: 'gh', CM: 'cm', NE: 'ne', TG: 'tg', BJ: 'bj', GN: 'gn',
};
const SOURCE_LABELS: Record<string, string> = {
  web: 'Site web', phone: 'Telephone', referral: 'Recommandation', social: 'Reseau social', event: 'Evenement', other: 'Autre',
};

export default function CRMPage() {
  const { t } = useApp();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<'contacts' | 'leads'>('contacts');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);

  const [showAdd, setShowAdd] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [showDetail, setShowDetail] = useState<Customer | Lead | null>(null);
  const [detailType, setDetailType] = useState<'customer' | 'lead'>('customer');

  const [form, setForm] = useState({ name: '', email: '', phone: '', country: 'CI', type: 'garage', notes: '', source: 'web' });
  const [leadForm, setLeadForm] = useState({ name: '', phone: '', email: '', source: 'web', value: 0, notes: '' });

  const formatCFA = (n: number) => new Intl.NumberFormat('fr-FR').format(n);

  const filteredCustomers = customers.filter(c => {
    const matchSearch = `${c.name} ${c.email} ${c.phone}`.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || c.type === typeFilter;
    const matchCountry = countryFilter === 'all' || c.country === countryFilter;
    return matchSearch && matchType && matchCountry;
  });

  const filteredLeads = leads.filter(l => {
    const matchSearch = `${l.name} ${l.email} ${l.phone}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [cRes, lRes] = await Promise.all([
          fetch('/api/v1/customers', { credentials: 'include' }),
          fetch('/api/v1/leads', { credentials: 'include' }),
        ]);
        const cData = await cRes.json();
        const lData = await lRes.json();
        if (!cancelled) {
          if (cData.success) setCustomers(cData.data?.data || cData.data || []);
          if (lData.success) setLeads(lData.data?.data || lData.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch CRM data', err);
        if (!cancelled) addToast('error', 'Erreur lors du chargement des contacts');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [refreshKey, addToast]);

  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const totalLeads = leads.length;
    const newLeads = leads.filter(l => l.status === 'new').length;
    const activeLeads = leads.filter(l => l.status === 'new' || l.status === 'contacted' || l.status === 'qualified').length;
    const convertedLeads = leads.filter(l => l.status === 'converted').length;
    return { totalCustomers, totalLeads, newLeads, activeLeads, convertedLeads };
  }, [customers, leads]);

  const handleAddCustomer = async () => {
    if (!form.name || !form.email) { addToast('error', 'Nom et email requis'); return; }
    try {
      const res = await fetch('/api/v1/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', `${form.name} ajouté aux contacts`);
        setShowAdd(false);
        setForm({ name: '', email: '', phone: '', country: 'CI', type: 'garage', notes: '', source: 'web' });
        setRefreshKey(k => k + 1);
      } else {
        addToast('error', data.message || 'Erreur lors de la création');
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur lors de la création du contact');
    }
  };

  const handleUpdateCustomer = async () => {
    if (!editCustomer) return;
    try {
      const res = await fetch(`/api/v1/customers/${editCustomer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', 'Contact mis à jour');
        setEditCustomer(null);
        setForm({ name: '', email: '', phone: '', country: 'CI', type: 'garage', notes: '', source: 'web' });
        setRefreshKey(k => k + 1);
      } else {
        addToast('error', data.message || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur lors de la mise à jour');
    }
  };

  const handleDeleteCustomer = async (id: string, name: string) => {
    if (!confirm(`Supprimer ${name} ?`)) return;
    try {
      const res = await fetch(`/api/v1/customers/${id}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        addToast('success', `${name} supprimé`);
        setRefreshKey(k => k + 1);
      } else {
        addToast('error', data.message || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur lors de la suppression');
    }
  };

  const handleAddLead = async () => {
    if (!leadForm.name || !leadForm.phone) { addToast('error', 'Nom et téléphone requis'); return; }
    try {
      const res = await fetch('/api/v1/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...leadForm, status: 'new' }),
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', `Lead "${leadForm.name}" créé`);
        setShowAdd(false);
        setLeadForm({ name: '', phone: '', email: '', source: 'web', value: 0, notes: '' });
        setRefreshKey(k => k + 1);
      } else {
        addToast('error', data.message || 'Erreur lors de la création');
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur lors de la création du lead');
    }
  };

  const handleUpdateLeadStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/v1/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', 'Statut mis à jour');
        setRefreshKey(k => k + 1);
      } else {
        addToast('error', data.message || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur lors de la mise à jour du statut');
    }
  };

  const handleUpdateLead = async () => {
    if (!editLead) return;
    try {
      const res = await fetch(`/api/v1/leads/${editLead.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(leadForm),
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', 'Lead mis à jour');
        setEditLead(null);
        setLeadForm({ name: '', phone: '', email: '', source: 'web', value: 0, notes: '' });
        setRefreshKey(k => k + 1);
      } else {
        addToast('error', data.message || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur lors de la mise à jour du lead');
    }
  };

  const handleCall = (phone: string) => {
    window.open('tel:' + phone, '_self');
    addToast('info', 'Appel vers ' + phone);
  };

  const handleWhatsApp = (phone: string, name: string) => {
    const msg = encodeURIComponent('Bonjour ' + name + ', je vous contacte depuis AutoAfrique.');
    window.open('https://wa.me/' + phone.replace(/[^0-9]/g, '') + '?text=' + msg, '_blank');
    addToast('info', 'Ouverture de WhatsApp...');
  };

  const handleEmail = (email: string, name: string) => {
    window.open('mailto:' + email + '?subject=AutoAfrique&body=Bonjour ' + name + ',');
    addToast('info', 'Ouverture de l\'email...');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  };

  const formatDate = (d: string) => {
    if (!d) return '';
    try { return new Date(d).toLocaleDateString('fr-FR'); } catch { return d; }
  };

  const getUniqueCountries = () => {
    const countries = [...new Set(customers.map(c => c.country))];
    return countries.filter(Boolean);
  };

  return (
    <div className="flex min-h-screen bg-[#f0f2f5]">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <DashboardTopBar />
        <main className="p-4 lg:p-8 pb-24 lg:pb-8">

          {/* ═══════════════════════════════════════════════════════
              PAGE HEADER
              ═══════════════════════════════════════════════════════ */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-warm-red)] flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">{t.nav.crm}</h1>
                </div>
                <p className="text-sm text-gray-500 ml-[52px]">Gestion de la relation client & leads</p>
              </div>

              {/* Stats chips */}
              <div className="flex items-center gap-2 flex-wrap ml-[52px] sm:ml-0">
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-primary-dark)]"></div>
                  <span className="text-xs font-semibold text-gray-700">{stats.totalCustomers} contacts</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-xs font-semibold text-gray-700">{stats.totalLeads} leads</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-semibold text-gray-700">{stats.convertedLeads} convertis</span>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-dark)]/20 focus:border-[var(--color-primary-dark)] transition-all shadow-sm"
                  placeholder={activeTab === 'contacts' ? 'Rechercher un contact par nom, email ou telephone...' : 'Rechercher un lead par nom, email ou telephone...'}
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  if (activeTab === 'contacts') {
                    setForm({ name: '', email: '', phone: '', country: 'CI', type: 'garage', notes: '', source: 'web' });
                  } else {
                    setLeadForm({ name: '', phone: '', email: '', source: 'web', value: 0, notes: '' });
                  }
                  setShowAdd(true);
                }}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-warm-red)] text-white rounded-xl font-semibold text-sm shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5 active:scale-[0.98] transition-all whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Ajouter un</span> {activeTab === 'contacts' ? 'contact' : 'lead'}
              </button>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════
              TABS
              ═══════════════════════════════════════════════════════ */}
          <div className="flex items-center gap-1 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('contacts')}
              className={`relative px-5 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'contacts' ? 'text-[var(--color-primary-dark)]' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Contacts
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === 'contacts' ? 'bg-[var(--color-primary-dark)]/10 text-[var(--color-primary-dark)]' : 'bg-gray-100 text-gray-500'
                }`}>
                  {stats.totalCustomers}
                </span>
              </span>
              {activeTab === 'contacts' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-warm-red)] rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`relative px-5 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'leads' ? 'text-[var(--color-primary-dark)]' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Leads
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === 'leads' ? 'bg-[var(--color-primary-dark)]/10 text-[var(--color-primary-dark)]' : 'bg-gray-100 text-gray-500'
                }`}>
                  {stats.totalLeads}
                </span>
              </span>
              {activeTab === 'leads' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-warm-red)] rounded-full" />
              )}
            </button>
          </div>

          {/* ═══════════════════════════════════════════════════════
              FILTERS
              ═══════════════════════════════════════════════════════ */}
          <div className="flex flex-wrap gap-2 mb-6">
            {activeTab === 'contacts' ? (
              <>
                <button onClick={() => setTypeFilter('all')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    typeFilter === 'all'
                      ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}>
                  Tous
                </button>
                {CUSTOMER_TYPES.map(tp => (
                  <button key={tp} onClick={() => setTypeFilter(tp)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border capitalize ${
                      typeFilter === tp
                        ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}>
                    {tp}
                  </button>
                ))}
                <div className="w-px bg-gray-200 mx-1 hidden sm:block"></div>
                <select
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-600 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-dark)]/20 focus:border-[var(--color-primary-dark)] transition-all appearance-none pr-8 cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em 1.2em' }}
                >
                  <option value="all">Tous les pays</option>
                  {getUniqueCountries().map(c => (
                    <option key={c} value={c}>
                      {t.countries[c as keyof typeof t.countries] || c}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <>
                <button onClick={() => setStatusFilter('all')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    statusFilter === 'all'
                      ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}>
                  Tous
                </button>
                {LEAD_STATUSES.map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      statusFilter === s
                        ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}>
                    <span className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOTS[s]}`}></span>
                      {LEAD_STATUS_LABELS[s]}
                    </span>
                  </button>
                ))}
              </>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════
              CONTACTS TAB
              ═══════════════════════════════════════════════════════ */}
          {activeTab === 'contacts' && (
            <>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-200"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                          <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-100 rounded w-full"></div>
                        <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredCustomers.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
                    <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Aucun contact pour le moment</h3>
                  <p className="text-sm text-gray-500 mb-5 text-center max-w-xs">
                    Commencez par ajouter votre premier contact pour gerer vos relations client.
                  </p>
                  <button
                    onClick={() => {
                      setForm({ name: '', email: '', phone: '', country: 'CI', type: 'garage', notes: '', source: 'web' });
                      setShowAdd(true);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-warm-red)] text-white rounded-xl font-semibold text-sm shadow-lg shadow-orange-500/25 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Ajouter votre premier contact
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredCustomers.map((c, idx) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setDetailType('customer');
                        setShowDetail(c);
                        setForm({ name: c.name, email: c.email, phone: c.phone, country: c.country, type: c.type, notes: c.notes, source: c.source });
                      }}
                      className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      {/* Header: Avatar + Name + Type */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getAvatarColor(c.name)} flex items-center justify-center text-white text-sm font-bold shadow-md flex-shrink-0`}>
                          {getInitials(c.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-sm truncate group-hover:text-[var(--color-primary-dark)] transition-colors">{c.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border capitalize ${TYPE_COLORS[c.type] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                              {c.type}
                            </span>
                            {COUNTRY_FLAGS[c.country] && (
                              <span className="flex items-center gap-1 text-[10px] text-gray-500">
                                <RemoteImage src={`https://flagcdn.com/w20/${c.country.toLowerCase()}.png`} alt={c.country} width={20} height={14} className="w-3.5 h-2.5 rounded-sm" />
                                {t.countries[c.country as keyof typeof t.countries] || c.country}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-2 mb-4">
                        {c.phone && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="truncate">{c.phone}</span>
                          </div>
                        )}
                        {c.email && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="truncate">{c.email}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 pt-3 border-t border-gray-100">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleCall(c.phone); }}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-all"
                          title="Appeler"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          Appeler
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleWhatsApp(c.phone, c.name); }}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-semibold hover:bg-emerald-100 transition-all"
                          title="WhatsApp"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          WhatsApp
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEmail(c.email, c.name); }}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gray-50 text-gray-600 text-xs font-semibold hover:bg-gray-100 transition-all"
                          title="Email"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Email
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ═══════════════════════════════════════════════════════
              LEADS TAB - PIPELINE VIEW
              ═══════════════════════════════════════════════════════ */}
          {activeTab === 'leads' && (
            <>
              {loading ? (
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {LEAD_STATUSES.map(s => (
                    <div key={s} className="flex-shrink-0 w-72">
                      <div className="bg-gray-50 rounded-2xl p-4 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-20 mb-4"></div>
                        <div className="space-y-3">
                          {[1, 2].map(i => (
                            <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredLeads.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
                    <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Aucun lead pour le moment</h3>
                  <p className="text-sm text-gray-500 mb-5 text-center max-w-xs">
                    Ajoutez votre premier lead pour demarrer votre pipeline de ventes.
                  </p>
                  <button
                    onClick={() => {
                      setLeadForm({ name: '', phone: '', email: '', source: 'web', value: 0, notes: '' });
                      setShowAdd(true);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-warm-red)] text-white rounded-xl font-semibold text-sm shadow-lg shadow-orange-500/25 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Ajouter votre premier lead
                  </button>
                </div>
              ) : (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {LEAD_STATUSES.map(status => {
                    const columnLeads = filteredLeads.filter(l => l.status === status);
                    return (
                      <div key={status} className="flex-shrink-0 w-72 lg:w-80">
                        {/* Column Header */}
                        <div className="flex items-center justify-between mb-3 px-1">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${STATUS_DOTS[status]}`}></div>
                            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">{LEAD_STATUS_LABELS[status]}</h3>
                          </div>
                          <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                            {columnLeads.length}
                          </span>
                        </div>

                        {/* Column Content */}
                        <div className="space-y-3 min-h-[120px] bg-gray-50/80 rounded-2xl p-3 border border-gray-100/50">
                          {columnLeads.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                              <svg className="w-6 h-6 mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                              <span className="text-xs">Vide</span>
                            </div>
                          ) : (
                            columnLeads.map(lead => (
                              <div
                                key={lead.id}
                                onClick={() => {
                                  setDetailType('lead');
                                  setShowDetail(lead);
                                  setLeadForm({ name: lead.name, phone: lead.phone, email: lead.email, source: lead.source, value: lead.value, notes: lead.notes });
                                }}
                                className="group bg-white rounded-xl p-4 border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                              >
                                {/* Drag indicator */}
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <div className="flex gap-0.5">
                                        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                      </div>
                                      <div className="flex gap-0.5">
                                        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                      </div>
                                      <div className="flex gap-0.5">
                                        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                      </div>
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-sm group-hover:text-[var(--color-primary-dark)] transition-colors">{lead.name}</h4>
                                  </div>
                                </div>

                                {/* Lead Info */}
                                <div className="space-y-1.5 mb-3">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">Source</span>
                                    <span className="text-xs text-gray-600 font-medium">{SOURCE_LABELS[lead.source] || lead.source}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">Valeur</span>
                                    <span className="text-xs font-bold text-gray-900">{formatCFA(lead.value)} FCFA</span>
                                  </div>
                                </div>

                                {/* Status Badge + Actions */}
                                <div className="flex items-center justify-between">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${STATUS_COLORS[lead.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                    {LEAD_STATUS_LABELS[lead.status]}
                                  </span>
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={(e) => { e.stopPropagation(); handleCall(lead.phone); }}
                                      className="p-1.5 rounded-md hover:bg-blue-50 text-blue-500 transition-colors"
                                      title="Appeler"
                                    >
                                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); handleWhatsApp(lead.phone, lead.name); }}
                                      className="p-1.5 rounded-md hover:bg-emerald-50 text-emerald-500 transition-colors"
                                      title="WhatsApp"
                                    >
                                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                      </svg>
                                    </button>
                                    <select
                                      value={lead.status}
                                      onChange={(e) => { e.stopPropagation(); handleUpdateLeadStatus(lead.id, e.target.value); }}
                                      onClick={(e) => e.stopPropagation()}
                                      className="p-1.5 rounded-md border-0 text-[10px] font-semibold cursor-pointer bg-gray-50 text-gray-500 hover:bg-gray-100 focus:ring-2 focus:ring-[var(--color-primary-dark)]/20"
                                    >
                                      {LEAD_STATUSES.map(s => (
                                        <option key={s} value={s}>{LEAD_STATUS_LABELS[s]}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* ═══════════════════════════════════════════════════════
              ADD MODAL - CUSTOMER
              ═══════════════════════════════════════════════════════ */}
          {activeTab === 'contacts' && (
            <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Nouveau contact">
              <div className="space-y-4">
                <div>
                  <label htmlFor="crm-name" className="block text-xs font-semibold text-gray-700 mb-1.5">Nom complet *</label>
                  <input id="crm-name" className="input-field" placeholder="Ex: Kouame Jean" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="crm-email" className="block text-xs font-semibold text-gray-700 mb-1.5">Email *</label>
                  <input id="crm-email" className="input-field" type="email" placeholder="Ex: jean@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="crm-phone" className="block text-xs font-semibold text-gray-700 mb-1.5">Telephone</label>
                  <input id="crm-phone" className="input-field" placeholder="Ex: +225 07 07 07 07" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="crm-country" className="block text-xs font-semibold text-gray-700 mb-1.5">Pays</label>
                    <select id="crm-country" className="input-field" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
                      {Object.entries(t.countries).map(([code, name]) => <option key={code} value={code}>{name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="crm-type" className="block text-xs font-semibold text-gray-700 mb-1.5">Type</label>
                    <select id="crm-type" className="input-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                      <option value="garage">Garage</option>
                      <option value="revendeur">Revendeur</option>
                      <option value="particulier">Particulier</option>
                      <option value="flotte">Flotte</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="crm-notes" className="block text-xs font-semibold text-gray-700 mb-1.5">Notes</label>
                  <textarea id="crm-notes" className="input-field" rows={2} placeholder="Informations complementaires..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={handleAddCustomer} className="btn-primary flex-1 text-sm !py-3">Enregistrer</button>
                  <button onClick={() => setShowAdd(false)} className="btn-outline text-sm !py-3">Annuler</button>
                </div>
              </div>
            </Modal>
          )}

          {/* ═══════════════════════════════════════════════════════
              ADD MODAL - LEAD
              ═══════════════════════════════════════════════════════ */}
          {activeTab === 'leads' && (
            <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Nouveau lead">
              <div className="space-y-4">
                <div>
                  <label htmlFor="lead-name" className="block text-xs font-semibold text-gray-700 mb-1.5">Nom complet *</label>
                  <input id="lead-name" className="input-field" placeholder="Ex: Amadou Diallo" value={leadForm.name} onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="lead-phone" className="block text-xs font-semibold text-gray-700 mb-1.5">Telephone *</label>
                  <input id="lead-phone" className="input-field" placeholder="Ex: +225 05 05 05 05" value={leadForm.phone} onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="lead-email" className="block text-xs font-semibold text-gray-700 mb-1.5">Email</label>
                  <input id="lead-email" className="input-field" type="email" placeholder="Ex: amadou@example.com" value={leadForm.email} onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="lead-value" className="block text-xs font-semibold text-gray-700 mb-1.5">Valeur (FCFA)</label>
                    <input id="lead-value" className="input-field" type="number" placeholder="Ex: 500000" value={leadForm.value || ''} onChange={(e) => setLeadForm({ ...leadForm, value: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label htmlFor="lead-source" className="block text-xs font-semibold text-gray-700 mb-1.5">Source</label>
                    <select id="lead-source" className="input-field" value={leadForm.source} onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value })}>
                      {Object.entries(SOURCE_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="lead-notes" className="block text-xs font-semibold text-gray-700 mb-1.5">Notes</label>
                  <textarea id="lead-notes" className="input-field" rows={2} placeholder="Informations complementaires..." value={leadForm.notes} onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={handleAddLead} className="btn-primary flex-1 text-sm !py-3">Enregistrer</button>
                  <button onClick={() => setShowAdd(false)} className="btn-outline text-sm !py-3">Annuler</button>
                </div>
              </div>
            </Modal>
          )}

          {/* ═══════════════════════════════════════════════════════
              EDIT MODAL - CUSTOMER
              ═══════════════════════════════════════════════════════ */}
          <Modal isOpen={!!editCustomer} onClose={() => setEditCustomer(null)} title="Modifier le contact">
            {editCustomer && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="editcrm-name" className="block text-xs font-semibold text-gray-700 mb-1.5">Nom complet</label>
                  <input id="editcrm-name" className="input-field" placeholder="Nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="editcrm-email" className="block text-xs font-semibold text-gray-700 mb-1.5">Email</label>
                  <input id="editcrm-email" className="input-field" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="editcrm-phone" className="block text-xs font-semibold text-gray-700 mb-1.5">Telephone</label>
                  <input id="editcrm-phone" className="input-field" placeholder="Telephone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="editcrm-country" className="block text-xs font-semibold text-gray-700 mb-1.5">Pays</label>
                    <select id="editcrm-country" className="input-field" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
                      {Object.entries(t.countries).map(([code, name]) => <option key={code} value={code}>{name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="editcrm-type" className="block text-xs font-semibold text-gray-700 mb-1.5">Type</label>
                    <select id="editcrm-type" className="input-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                      <option value="garage">Garage</option>
                      <option value="revendeur">Revendeur</option>
                      <option value="particulier">Particulier</option>
                      <option value="flotte">Flotte</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="editcrm-notes" className="block text-xs font-semibold text-gray-700 mb-1.5">Notes</label>
                  <textarea id="editcrm-notes" className="input-field" rows={2} placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={handleUpdateCustomer} className="btn-primary flex-1 text-sm !py-3">Mettre a jour</button>
                  <button onClick={() => setEditCustomer(null)} className="btn-outline text-sm !py-3">Annuler</button>
                </div>
              </div>
            )}
          </Modal>

          {/* ═══════════════════════════════════════════════════════
              EDIT MODAL - LEAD
              ═══════════════════════════════════════════════════════ */}
          <Modal isOpen={!!editLead} onClose={() => setEditLead(null)} title="Modifier le lead">
            {editLead && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="editlead-name" className="block text-xs font-semibold text-gray-700 mb-1.5">Nom complet</label>
                  <input id="editlead-name" className="input-field" placeholder="Nom" value={leadForm.name} onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="editlead-phone" className="block text-xs font-semibold text-gray-700 mb-1.5">Telephone</label>
                  <input id="editlead-phone" className="input-field" placeholder="Telephone" value={leadForm.phone} onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="editlead-email" className="block text-xs font-semibold text-gray-700 mb-1.5">Email</label>
                  <input id="editlead-email" className="input-field" type="email" placeholder="Email" value={leadForm.email} onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="editlead-value" className="block text-xs font-semibold text-gray-700 mb-1.5">Valeur (FCFA)</label>
                    <input id="editlead-value" className="input-field" type="number" placeholder="Valeur" value={leadForm.value || ''} onChange={(e) => setLeadForm({ ...leadForm, value: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label htmlFor="editlead-source" className="block text-xs font-semibold text-gray-700 mb-1.5">Source</label>
                    <select id="editlead-source" className="input-field" value={leadForm.source} onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value })}>
                      {Object.entries(SOURCE_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="editlead-notes" className="block text-xs font-semibold text-gray-700 mb-1.5">Notes</label>
                  <textarea id="editlead-notes" className="input-field" rows={2} placeholder="Notes" value={leadForm.notes} onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={handleUpdateLead} className="btn-primary flex-1 text-sm !py-3">Mettre a jour</button>
                  <button onClick={() => setEditLead(null)} className="btn-outline text-sm !py-3">Annuler</button>
                </div>
              </div>
            )}
          </Modal>

          {/* ═══════════════════════════════════════════════════════
              DETAIL MODAL
              ═══════════════════════════════════════════════════════ */}
          <Modal isOpen={!!showDetail} onClose={() => setShowDetail(null)} title={detailType === 'customer' ? 'Fiche client' : 'Fiche lead'} size="lg">
            {showDetail && (
              <div className="space-y-5">
                {/* Profile Header */}
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getAvatarColor(showDetail.name)} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                    {getInitials(showDetail.name)}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-extrabold text-gray-900">{showDetail.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      {detailType === 'customer' && (
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${TYPE_COLORS[(showDetail as Customer).type] || 'bg-gray-100 text-gray-600 border-gray-200'} capitalize`}>
                          {(showDetail as Customer).type}
                        </span>
                      )}
                      {detailType === 'lead' && (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${STATUS_COLORS[(showDetail as Lead).status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOTS[(showDetail as Lead).status]}`}></span>
                          {LEAD_STATUS_LABELS[(showDetail as Lead).status]}
                        </span>
                      )}
                      {detailType === 'customer' && COUNTRY_FLAGS[(showDetail as Customer).country] && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <RemoteImage src={`https://flagcdn.com/w20/${(showDetail as Customer).country.toLowerCase()}.png`} alt={(showDetail as Customer).country} width={20} height={14} className="w-4 h-3 rounded-sm" />
                          {t.countries[(showDetail as Customer).country as keyof typeof t.countries] || (showDetail as Customer).country}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <button onClick={() => handleCall(showDetail.phone)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-50 text-blue-600 font-semibold text-sm hover:bg-blue-100 transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Appeler
                  </button>
                  <button onClick={() => handleWhatsApp(showDetail.phone, showDetail.name)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 text-emerald-600 font-semibold text-sm hover:bg-emerald-100 transition-all">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </button>
                  <button onClick={() => handleEmail(showDetail.email, showDetail.name)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm hover:bg-gray-200 transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                  </button>
                </div>

                {/* Info Section */}
                <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Informations</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Email</span>
                    <span className="text-sm font-semibold text-gray-900">{showDetail.email || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Telephone</span>
                    <span className="text-sm font-semibold text-gray-900">{showDetail.phone}</span>
                  </div>
                  {detailType === 'customer' && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Pays</span>
                      <span className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                        <RemoteImage src={`https://flagcdn.com/w20/${(showDetail as Customer).country.toLowerCase()}.png`} alt={(showDetail as Customer).country} width={20} height={14} className="w-4 h-3 rounded-sm" />
                        {t.countries[(showDetail as Customer).country as keyof typeof t.countries] || (showDetail as Customer).country}
                      </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Type</span>
                        <span className="text-sm font-semibold text-gray-900 capitalize">{(showDetail as Customer).type}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Source</span>
                        <span className="text-sm font-semibold text-gray-900">{SOURCE_LABELS[(showDetail as Customer).source] || (showDetail as Customer).source}</span>
                      </div>
                    </>
                  )}
                  {detailType === 'lead' && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Valeur</span>
                        <span className="text-sm font-bold text-gray-900">{formatCFA((showDetail as Lead).value)} FCFA</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Source</span>
                        <span className="text-sm font-semibold text-gray-900">{SOURCE_LABELS[(showDetail as Lead).source] || (showDetail as Lead).source}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Cree le</span>
                    <span className="text-sm font-semibold text-gray-900">{formatDate(showDetail.createdAt)}</span>
                  </div>
                </div>

                {/* Notes */}
                {showDetail.notes && (
                  <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                    <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">Notes</h3>
                    <p className="text-sm text-amber-800">{showDetail.notes}</p>
                  </div>
                )}

                {/* QR Code */}
                <div className="text-center pt-2 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">QR Code Contact</p>
                  <QRCodeDisplay data={'tel:' + showDetail.phone} title={showDetail.name} subtitle={showDetail.phone} size={120} showDownload={false} />
                </div>

                {/* Action Buttons for edit/delete */}
                <div className="flex gap-2 pt-2">
                  {detailType === 'customer' && (
                    <>
                      <button
                        onClick={() => {
                          setShowDetail(null);
                          setEditCustomer(showDetail as Customer);
                          setForm({ name: (showDetail as Customer).name, email: (showDetail as Customer).email, phone: (showDetail as Customer).phone, country: (showDetail as Customer).country, type: (showDetail as Customer).type, notes: (showDetail as Customer).notes, source: (showDetail as Customer).source });
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Modifier
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Supprimer ${showDetail.name} ?`)) {
                            handleDeleteCustomer(showDetail.id, showDetail.name);
                            setShowDetail(null);
                          }
                        }}
                        className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </>
                  )}
                  {detailType === 'lead' && (
                    <button
                      onClick={() => {
                        setShowDetail(null);
                        setEditLead(showDetail as Lead);
                        setLeadForm({ name: (showDetail as Lead).name, phone: (showDetail as Lead).phone, email: (showDetail as Lead).email, source: (showDetail as Lead).source, value: (showDetail as Lead).value, notes: (showDetail as Lead).notes });
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Modifier
                    </button>
                  )}
                </div>
              </div>
            )}
          </Modal>

        </main>

        {/* ═══════════════════════════════════════════════════════
            MOBILE FAB
            ═══════════════════════════════════════════════════════ */}
        <button
          onClick={() => {
            if (activeTab === 'contacts') {
              setForm({ name: '', email: '', phone: '', country: 'CI', type: 'garage', notes: '', source: 'web' });
            } else {
              setLeadForm({ name: '', phone: '', email: '', source: 'web', value: 0, notes: '' });
            }
            setShowAdd(true);
          }}
          className="lg:hidden fixed bottom-24 right-5 w-14 h-14 rounded-full bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-warm-red)] text-white shadow-xl shadow-orange-500/30 flex items-center justify-center hover:shadow-2xl hover:-translate-y-1 active:scale-90 transition-all z-40"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
