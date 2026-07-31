'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardTopBar from '@/components/DashboardTopBar';
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  country?: string;
  createdAt: string;
}

interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: string;
  country: string;
  currency: string;
  active: boolean;
  createdAt: string;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'tenants' | 'settings'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTenants: 0,
    activeTenants: 0,
    pendingUsers: 0,
  });

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [usersRes, tenantsRes] = await Promise.all([
          fetch('/api/v1/users?pageSize=100', { credentials: 'include' }),
          fetch('/api/v1/tenants?pageSize=100', { credentials: 'include' }),
        ]);

        const usersData = await usersRes.json();
        const tenantsData = await tenantsRes.json();

        if (!cancelled) {
          if (usersData.success) {
            setUsers(usersData.data.data);
            setStats(prev => ({
              ...prev,
              totalUsers: usersData.data.data.length,
              pendingUsers: usersData.data.data.filter((u: User) => u.status === 'PENDING_VERIFICATION').length,
            }));
          }

          if (tenantsData.success) {
            setTenants(tenantsData.data.data);
            setStats(prev => ({
              ...prev,
              totalTenants: tenantsData.data.data.length,
              activeTenants: tenantsData.data.data.filter((t: Tenant) => t.active).length,
            }));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [refreshKey]);

  const handleUserAction = async (userId: string, action: 'activate' | 'suspend' | 'delete') => {
    try {
      const res = await fetch(`/api/v1/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: action === 'activate' ? 'ACTIVE' : action === 'suspend' ? 'SUSPENDED' : 'INACTIVE' }),
      });

      if (res.ok) {
        setRefreshKey(k => k + 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTenantAction = async (tenantId: string, action: 'activate' | 'deactivate') => {
    try {
      const res = await fetch(`/api/v1/tenants/${tenantId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ active: action === 'activate' }),
      });

      if (res.ok) {
        setRefreshKey(k => k + 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const roleLabels: Record<string, string> = {
    SUPER_ADMIN: 'Super Admin',
    TENANT_ADMIN: 'Admin Tenant',
    SELLER: 'Vendeur',
    BUYER: 'Acheteur',
    WAREHOUSE_MANAGER: 'Gestionnaire Stock',
    DELIVERY_AGENT: 'Livreur',
    ACCOUNTANT: 'Comptable',
    SUPPORT: 'Support',
    MODERATOR: 'Modérateur',
  };

  const roleColors: Record<string, string> = {
    SUPER_ADMIN: 'bg-red-100 text-red-700',
    TENANT_ADMIN: 'bg-purple-100 text-purple-700',
    SELLER: 'bg-blue-100 text-blue-700',
    BUYER: 'bg-green-100 text-green-700',
    WAREHOUSE_MANAGER: 'bg-yellow-100 text-yellow-700',
    DELIVERY_AGENT: 'bg-indigo-100 text-indigo-700',
    ACCOUNTANT: 'bg-pink-100 text-pink-700',
    SUPPORT: 'bg-cyan-100 text-cyan-700',
    MODERATOR: 'bg-gray-100 text-gray-700',
  };

  const statusLabels: Record<string, string> = {
    ACTIVE: 'Actif',
    INACTIVE: 'Inactif',
    SUSPENDED: 'Suspendu',
    PENDING_VERIFICATION: 'En attente',
  };

  const statusColors: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-700',
    INACTIVE: 'bg-gray-100 text-gray-700',
    SUSPENDED: 'bg-red-100 text-red-700',
    PENDING_VERIFICATION: 'bg-yellow-100 text-yellow-700',
  };

  const planLabels: Record<string, string> = {
    FREE: 'Gratuit',
    STARTER: 'Starter',
    PRO: 'Pro',
    ENTERPRISE: 'Entreprise',
  };

  const planColors: Record<string, string> = {
    FREE: 'bg-gray-100 text-gray-700',
    STARTER: 'bg-blue-100 text-blue-700',
    PRO: 'bg-purple-100 text-purple-700',
    ENTERPRISE: 'bg-amber-100 text-amber-700',
  };

  const tabs: Array<{ key: 'overview' | 'users' | 'tenants' | 'settings'; label: string; icon: string }> = [
    { key: 'overview', label: 'Vue d\'ensemble', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { key: 'users', label: 'Utilisateurs', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { key: 'tenants', label: 'Tenants', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { key: 'settings', label: 'Paramètres', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <DashboardTopBar />
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500 font-medium">Chargement de l&apos;administration...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <DashboardTopBar />
        <main className="p-4 lg:p-8 pb-24 lg:pb-8 max-w-[1400px] mx-auto">

          {/* Header */}
          <div className="mb-8" style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Administration</h1>
                <p className="text-sm text-gray-500">Gestion de la plateforme AutoAfrique</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl mb-8 overflow-x-auto" style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both' }}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }`}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6" style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both' }}>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="card-modern p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#3B82F6" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-gray-900">{stats.totalUsers}</p>
                      <p className="text-xs text-gray-500 font-medium">Utilisateurs</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">{stats.pendingUsers} en attente de vérification</div>
                </div>

                <div className="card-modern p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#A855F7" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-gray-900">{stats.totalTenants}</p>
                      <p className="text-xs text-gray-500 font-medium">Tenants</p>
                    </div>
                  </div>
                  <div className="text-xs text-emerald-600 font-semibold">{stats.activeTenants} actifs</div>
                </div>

                <div className="card-modern p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#22C55E" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-gray-900">{stats.activeTenants}</p>
                      <p className="text-xs text-gray-500 font-medium">Tenants actifs</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">{((stats.activeTenants / stats.totalTenants) * 100).toFixed(0)}% du total</div>
                </div>

                <div className="card-modern p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#F59E0B" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-gray-900">{stats.pendingUsers}</p>
                      <p className="text-xs text-gray-500 font-medium">En attente</p>
                    </div>
                  </div>
                  <div className="text-xs text-amber-600 font-semibold">Vérification requise</div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-5">
                <div className="card-modern p-6">
                  <h3 className="font-bold text-gray-900 text-sm mb-4">Derniers utilisateurs</h3>
                  <div className="space-y-3">
                    {users.slice(0, 5).map((u) => (
                      <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">
                            {u.firstName?.[0]}{u.lastName?.[0]}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{u.firstName} {u.lastName}</p>
                          <p className="text-xs text-gray-500 truncate">{u.email}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${roleColors[u.role] || 'bg-gray-100 text-gray-700'}`}>
                          {roleLabels[u.role] || u.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-modern p-6">
                  <h3 className="font-bold text-gray-900 text-sm mb-4">Derniers tenants</h3>
                  <div className="space-y-3">
                    {tenants.slice(0, 5).map((t) => (
                      <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">{t.name?.[0]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{t.name}</p>
                          <p className="text-xs text-gray-500 truncate">{t.country} • {t.currency}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${planColors[t.plan] || 'bg-gray-100 text-gray-700'}`}>
                          {planLabels[t.plan] || t.plan}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6" style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both' }}>
              <div className="card-modern overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">Gestion des utilisateurs</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{users.length} utilisateurs au total</p>
                    </div>
                    <button className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors">
                      + Ajouter
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Utilisateur</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rôle</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pays</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Inscription</th>
                        <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs font-bold">
                                  {u.firstName?.[0]}{u.lastName?.[0]}
                                </span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">{u.firstName} {u.lastName}</p>
                                <p className="text-xs text-gray-500">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${roleColors[u.role] || 'bg-gray-100 text-gray-700'}`}>
                              {roleLabels[u.role] || u.role}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusColors[u.status] || 'bg-gray-100 text-gray-700'}`}>
                              {statusLabels[u.status] || u.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-600">{u.country || '—'}</td>
                          <td className="px-5 py-4 text-sm text-gray-500">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString('fr-FR') : '—'}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-2">
                              {u.status === 'ACTIVE' ? (
                                <button
                                  onClick={() => handleUserAction(u.id, 'suspend')}
                                  className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                >
                                  Suspendre
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUserAction(u.id, 'activate')}
                                  className="px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                >
                                  Activer
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tenants Tab */}
          {activeTab === 'tenants' && (
            <div className="space-y-6" style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both' }}>
              <div className="card-modern overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">Gestion des tenants</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{tenants.length} tenants au total</p>
                    </div>
                    <button className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors">
                      + Ajouter
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tenant</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pays</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Devise</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {tenants.map((t) => (
                        <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs font-bold">{t.name?.[0]}</span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                                <p className="text-xs text-gray-500">{t.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${planColors[t.plan] || 'bg-gray-100 text-gray-700'}`}>
                              {planLabels[t.plan] || t.plan}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-600">{t.country}</td>
                          <td className="px-5 py-4 text-sm text-gray-600">{t.currency}</td>
                          <td className="px-5 py-4">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${t.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {t.active ? 'Actif' : 'Inactif'}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-2">
                              {t.active ? (
                                <button
                                  onClick={() => handleTenantAction(t.id, 'deactivate')}
                                  className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                >
                                  Désactiver
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleTenantAction(t.id, 'activate')}
                                  className="px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                >
                                  Activer
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6" style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both' }}>
              <div className="card-modern p-6">
                <h3 className="font-bold text-gray-900 mb-4">Paramètres de la plateforme</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Maintenance mode</p>
                      <p className="text-xs text-gray-500">Désactiver l&apos;accès public au site</p>
                    </div>
                    <button className="w-12 h-6 bg-gray-300 rounded-full relative transition-colors">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow transition-transform"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Nouveaux inscriptions</p>
                      <p className="text-xs text-gray-500">Autoriser les nouvelles inscriptions</p>
                    </div>
                    <button className="w-12 h-6 bg-green-500 rounded-full relative transition-colors">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow transition-transform"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Notifications email</p>
                      <p className="text-xs text-gray-500">Envoyer des emails de notification</p>
                    </div>
                    <button className="w-12 h-6 bg-green-500 rounded-full relative transition-colors">
                      <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow transition-transform"></div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="card-modern p-6">
                <h3 className="font-bold text-gray-900 mb-4">Informations système</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Version</p>
                    <p className="font-semibold text-gray-900">1.0.0</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Environnement</p>
                    <p className="font-semibold text-gray-900">Production</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Base de données</p>
                    <p className="font-semibold text-gray-900">SQLite</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Dernière mise à jour</p>
                    <p className="font-semibold text-gray-900">{new Date().toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
