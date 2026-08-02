'use client';
import { useState, useEffect, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardTopBar from '@/components/DashboardTopBar';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/contexts/ToastContext';
import Link from 'next/link';

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: string;
  link?: string | null;
  read: boolean;
  readAt?: string | null;
  createdAt: string;
};

const NOTIF_TYPES: Record<string, { label: string; badge: string }> = {
  order: { label: 'Commande', badge: 'bg-blue-50 text-blue-600 border-blue-200' },
  payment: { label: 'Paiement', badge: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  stock: { label: 'Stock', badge: 'bg-amber-50 text-amber-600 border-amber-200' },
  promo: { label: 'Promo', badge: 'bg-purple-50 text-purple-600 border-purple-200' },
  system: { label: 'Système', badge: 'bg-gray-100 text-gray-600 border-gray-200' },
};

const NOTIF_ICONS: Record<string, string> = {
  order: '📦', payment: '💰', stock: '⚠️', promo: '🎁', system: '🔔',
};

export default function NotificationsPage() {
  const { t } = useApp();
  const { addToast } = useToast();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/v1/notifications?pageSize=100', { credentials: 'include' });
        const data = await res.json();
        if (!cancelled) {
          if (data.success) {
            setNotifications(data.data?.data || []);
            setUnreadCount(data.data?.unreadCount || 0);
          } else {
            addToast('error', data.message || 'Erreur lors du chargement des notifications');
          }
        }
      } catch (err) {
        console.error('Failed to fetch notifications', err);
        if (!cancelled) addToast('error', 'Erreur lors du chargement des notifications');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [addToast]);

  const filtered = useMemo(() => {
    let list = notifications;
    if (filter === 'unread') list = list.filter(n => !n.read);
    if (filter === 'read') list = list.filter(n => n.read);
    if (typeFilter !== 'all') list = list.filter(n => n.type === typeFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q)
      );
    }
    return list;
  }, [notifications, filter, typeFilter, search]);

  const unreadIds = useMemo(() => notifications.filter(n => !n.read).map(n => n.id), [notifications]);

  const handleMarkRead = async (n: NotificationItem) => {
    if (n.read) return;
    try {
      const res = await fetch('/api/v1/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ids: [n.id] }),
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(list => list.map(x => x.id === n.id ? { ...x, read: true, readAt: new Date().toISOString() } : x));
        setUnreadCount(c => Math.max(0, c - 1));
      } else {
        addToast('error', data.message || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur lors de la mise à jour');
    }
  };

  const handleMarkAllRead = async () => {
    if (unreadIds.length === 0) return;
    try {
      const res = await fetch('/api/v1/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ids: unreadIds }),
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(list => list.map(n => ({ ...n, read: true, readAt: new Date().toISOString() })));
        setUnreadCount(0);
      } else {
        addToast('error', data.message || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur lors de la mise à jour');
    }
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
    if (diffDays === 0) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }
    if (diffDays === 1) return 'Hier';
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const filterTabs = [
    { key: 'all' as const, label: 'Toutes', count: notifications.length },
    { key: 'unread' as const, label: 'Non lues', count: unreadCount },
    { key: 'read' as const, label: 'Lues', count: notifications.length - unreadCount },
  ];

  return (
    <div className="flex min-h-screen bg-[#F0F2F5]">
      <Sidebar />
      <div className="flex-1 lg:ml-[260px]">
        <DashboardTopBar />
        <main className="p-4 lg:p-8 pb-24 lg:pb-8 max-w-[1400px] mx-auto">

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 animate-fade-in">
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">{t.nav.notifications}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {unreadCount > 0 ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}` : 'Aucune notification non lue'}
              </p>
            </div>
            <button
              onClick={handleMarkAllRead}
              disabled={unreadIds.length === 0}
              className="btn-primary !py-2 !px-4 !text-xs disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Tout marquer comme lu
            </button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-6 animate-fade-in">
            <div className="flex gap-1 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 w-fit">
              {filterTabs.map(tb => (
                <button
                  key={tb.key}
                  onClick={() => setFilter(tb.key)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    filter === tb.key ? 'bg-[#0F172A] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {tb.label}
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${filter === tb.key ? 'bg-white/20' : 'bg-gray-100'}`}>
                    {tb.count}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 lg:ml-auto">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher une notification..."
                className="input-field !min-h-[38px] !py-2 !text-xs w-full sm:w-64"
              />
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="input-field !min-h-[38px] !py-2 !text-xs"
              >
                <option value="all">Tous les types</option>
                {Object.entries(NOTIF_TYPES).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-16 rounded-xl skeleton" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="glass-card animate-fade-in">
              <div className="text-center py-16 text-gray-400">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                  </svg>
                </div>
                <p className="text-sm font-medium">Aucune notification</p>
              </div>
            </div>
          ) : (
            <div className="glass-card animate-fade-in overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {filtered.map(n => {
                  const nt = NOTIF_TYPES[n.type] || NOTIF_TYPES.system;
                  const icon = NOTIF_ICONS[n.type] || NOTIF_ICONS.system;
                  return (
                    <li key={n.id} className={`transition-colors ${n.read ? 'hover:bg-gray-50/50' : 'bg-orange-50/40 hover:bg-orange-50/70'}`}>
                      <div className="flex items-start gap-4 p-4 lg:px-6">
                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-lg shrink-0">
                          {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm font-semibold truncate ${n.read ? 'text-gray-600' : 'text-gray-900'}`}>{n.title}</p>
                            {!n.read && <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />}
                            <span className={`badge border hidden sm:inline-flex ${nt.badge}`}>{nt.label}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[10px] text-gray-400 font-medium">{formatDate(n.createdAt)}</span>
                            {n.link && (
                              <Link href={n.link} className="text-[11px] font-semibold text-orange-600 hover:text-orange-700 transition-colors">
                                Voir
                              </Link>
                            )}
                          </div>
                        </div>
                        <div className="shrink-0">
                          {n.read ? (
                            <span className="text-[11px] text-gray-400 hidden lg:inline">Lu</span>
                          ) : (
                            <button
                              onClick={() => handleMarkRead(n)}
                              className="text-[11px] font-semibold text-orange-600 hover:text-orange-700 transition-colors whitespace-nowrap"
                            >
                              Marquer lu
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
