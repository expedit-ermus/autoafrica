'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'next/navigation';
import { track } from '@/lib/tracking';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'stock' | 'promo' | 'system';
  read: boolean;
  time: string;
}

interface SearchProduct {
  id: string;
  title: string;
  price: number;
  brand?: { name?: string } | null;
}

interface PendingOrder {
  id: string;
  status?: string;
  orderNumber?: string;
  totalAmount?: number;
  total?: number;
  createdAt?: string;
  buyer?: { firstName?: string };
}

interface LowStockProduct {
  id: string;
  title: string;
  stock: number;
}

const formatCFA = (n: number) => new Intl.NumberFormat('fr-FR').format(n);

export default function DashboardTopBar() {
  const { locale, setLocale, sidebarOpen, setSidebarOpen, user } = useApp();
  // Memorise : l'effet de notifications en depend, la dependance doit etre stable.
  const L = useCallback((fr: string, en: string) => (locale === 'fr' ? fr : en), [locale]);
  const router = useRouter();
  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showMobileSearch && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [showMobileSearch]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setShowUserMenu(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearch(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const generateFallbackNotifications = async () => {
      try {
        const [ordersRes, prodRes] = await Promise.all([
          fetch('/api/v1/orders?pageSize=5', { credentials: 'include' }),
          fetch('/api/v1/products?pageSize=100', { credentials: 'include' }),
        ]);
        const ordersData = await ordersRes.json();
        const prodData = await prodRes.json();
        const notifs: Notification[] = [];
        if (ordersData.success) {
          const pending =
            ordersData.data.data?.filter((o: PendingOrder) => o.status === 'PENDING') || [];
          pending.slice(0, 2).forEach((o: PendingOrder) => {
            notifs.push({
              id: `order-${o.id}`,
              title: L('Nouvelle commande', 'New order'),
              message: L(`Commande ${o.orderNumber || o.id} reçue`, `Order ${o.orderNumber || o.id} received`),
              type: 'order',
              read: false,
              time: L('Il y a 10 min', '10 min ago'),
            });
          });
        }
        if (prodData.success) {
          const low =
            prodData.data.data?.filter(
              (p: LowStockProduct) => p.stock <= 3 && p.stock > 0
            ) || [];
          low.slice(0, 2).forEach((p: LowStockProduct) => {
            notifs.push({
              id: `stock-${p.id}`,
              title: L('Stock faible', 'Low stock'),
              message: L(`Plus que ${p.stock} unités de ${p.title}`, `Only ${p.stock} units left of ${p.title}`),
              type: 'stock',
              read: false,
              time: L('Il y a 1h', '1 hour ago'),
            });
          });
        }
        if (notifs.length === 0) {
          notifs.push({
            id: 'welcome',
            title: L('Bienvenue sur AutoAfrique', 'Welcome to AutoAfrique'),
            message: L('Votre tableau de bord SaaS est prêt.', 'Your SaaS dashboard is ready.'),
            type: 'system',
            read: true,
            time: L('Aujourd\'hui', 'Today'),
          });
        }
        if (!cancelled) {
          setNotifications(notifs);
          setUnreadCount(notifs.filter((n) => !n.read).length);
        }
      } catch {}
    };

    generateFallbackNotifications();
    return () => {
      cancelled = true;
    };
  }, [L]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleSearch = async (q: string) => {
    setSearch(q);
    if (q.trim().length < 2) {
      setSearchResults([]);
      setShowSearch(false);
      return;
    }
    try {
      const res = await fetch(
        `/api/v1/products?search=${encodeURIComponent(q)}&pageSize=5`
      );
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.data.data as SearchProduct[]);
        setShowSearch(true);
      }
    } catch {}
  };

  const notifIcons: Record<string, { icon: string; color: string; border: string }> = {
    order: { icon: '🛒', color: 'bg-blue-500', border: 'border-l-blue-500' },
    payment: { icon: '💰', color: 'bg-emerald-500', border: 'border-l-emerald-500' },
    stock: { icon: '⚠️', color: 'bg-amber-500', border: 'border-l-amber-500' },
    promo: { icon: '🎁', color: 'bg-purple-500', border: 'border-l-purple-500' },
    system: { icon: '🔔', color: 'bg-gray-400', border: 'border-l-gray-400' },
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST' });
    } catch {}
    track('logout');
    window.location.href = '/auth/login';
  };

  const initials = user
    ? `${(user.firstName || '')[0] || ''}${(user.lastName || '')[0] || ''}`
    : 'U';

  const renderNotificationDropdown = (className = '') => (
    <div className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/8 border border-white/60 z-50 overflow-hidden ${className}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-100/80">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-900 text-sm">{L('Notifications', 'Notifications')}</h3>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold">
              {unreadCount}
            </span>
          )}
        </div>
        <button
          onClick={handleMarkAllRead}
          className="text-xs text-orange-600 font-semibold hover:text-orange-700 transition px-2 py-1 rounded-lg hover:bg-orange-50"
        >
          {L('Tout lire', 'Mark all read')}
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-xl mx-auto mb-3">
              🔕
            </div>
            <p className="text-gray-400 text-sm font-medium">{L('Aucune notification', 'No notifications')}</p>
          </div>
        ) : (
          notifications.map((n) => {
            const ni = notifIcons[n.type] || notifIcons.system;
            return (
              <div
                key={n.id}
                className={`flex items-start gap-3 p-3 mx-2 my-1 rounded-xl border-l-[3px] ${ni.border} transition-all duration-200 ${
                  n.read
                    ? 'bg-white/50 hover:bg-gray-50/80'
                    : 'bg-orange-50/60 hover:bg-orange-50'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl ${ni.color} bg-opacity-10 flex items-center justify-center text-sm shrink-0`}
                >
                  <span className="text-base">{ni.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p
                      className={`text-xs font-bold ${
                        n.read ? 'text-gray-600' : 'text-gray-900'
                      }`}
                    >
                      {n.title}
                    </p>
                    {!n.read && (
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5 leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1 font-medium">{n.time}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-black/[0.04] h-14 lg:h-16">
        <div className="flex items-center justify-between h-full px-4 lg:px-8">
          {/* Left: hamburger */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2.5 rounded-xl hover:bg-gray-100/80 transition-all duration-200 active:scale-95"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Mobile center: title with logo */}
          <div className="lg:hidden flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-sm shadow-orange-500/20">
              <span className="text-white text-xs font-black">A</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              AutoAfrique
            </span>
          </div>

          {/* Desktop center: search */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4" ref={searchRef}>
            <div className="relative w-full group">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={L('Rechercher pièces, commandes...', 'Search parts, orders...')}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/80 border border-gray-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-300 focus:bg-white transition-all duration-200 placeholder:text-gray-400"
                onFocus={() => searchResults.length > 0 && setShowSearch(true)}
              />
            </div>
            {showSearch && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/8 border border-white/60 overflow-hidden z-50 max-h-80 overflow-y-auto">
                <div className="p-2">
                  <p className="text-[10px] text-gray-400 px-3 py-1.5 uppercase font-bold tracking-wider">
                    {L('Produits', 'Products')}
                  </p>
                  {searchResults.map((p: SearchProduct) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setShowSearch(false);
                        setSearch('');
                        router.push('/dashboard/marketplace');
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-orange-50/80 transition-all duration-200 text-left group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-gray-100 group-hover:bg-orange-100 flex items-center justify-center text-sm transition-colors duration-200">
                        📦
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {p.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {p.brand?.name} • {formatCFA(p.price)} FCFA
                        </p>
                      </div>
                      <svg className="w-4 h-4 text-gray-300 group-hover:text-orange-400 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right */}
          <div className="flex items-center gap-1.5">
            {/* Language toggle - desktop only */}
            <button
              onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')}
              className="hidden lg:flex px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-100/80 hover:bg-gray-200/80 transition-all duration-200 border border-gray-200/50 active:scale-95"
            >
              {locale === 'fr' ? 'EN' : 'FR'}
            </button>

            {/* Notification bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setShowNotif(!showNotif);
                  setShowUserMenu(false);
                }}
                className={`relative p-2.5 rounded-xl hover:bg-gray-100/80 transition-all duration-200 active:scale-95 ${
                  unreadCount > 0 ? 'animate-pulse' : ''
                }`}
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-30 animate-ping"></span>
                    <span className="relative w-5 h-5 rounded-full bg-red-500 ring-2 ring-white text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  </span>
                )}
              </button>

              {/* Desktop notification dropdown */}
              {showNotif && (
                <div className="hidden lg:block absolute right-0 top-full mt-2 w-80">
                  {renderNotificationDropdown()}
                </div>
              )}
            </div>

            {/* Language toggle */}
            <button
              onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-100/80 hover:bg-gray-200/80 text-gray-700 transition border border-gray-200/60 cursor-pointer"
              title={locale === 'fr' ? 'Switch to English' : 'Changer en Français'}
            >
              <span>{locale === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN'}</span>
            </button>

            {/* User avatar */}
            <div className="relative" ref={userRef}>
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotif(false);
                }}
                className="flex items-center gap-2.5 lg:pl-3 lg:border-l lg:border-gray-200/60 hover:bg-gray-50/80 rounded-xl p-1.5 pr-2 transition-all duration-200 active:scale-[0.98]"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold shadow-sm shadow-orange-500/20">
                    {initials}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"></div>
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold text-gray-900 leading-tight">
                    {user?.firstName || L('Vendeur', 'Seller')} {user?.lastName || ''}
                  </p>
                  <p className="text-[11px] text-gray-500 leading-tight">
                    {user?.role === 'SELLER'
                      ? L('Vendeur', 'Seller')
                      : user?.role === 'BUYER'
                        ? L('Acheteur', 'Buyer')
                        : L('Admin', 'Admin')}
                  </p>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-400 hidden lg:block transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/8 border border-white/60 z-50 overflow-hidden">
                  {/* Profile section */}
                  <div className="px-4 py-4 border-b border-gray-100/80 bg-gradient-to-br from-orange-50/50 to-white/50">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold shadow-sm shadow-orange-500/20">
                          {initials}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {user?.firstName || L('Vendeur', 'Seller')} {user?.lastName || ''}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email || ''}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="p-1.5">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        router.push('/dashboard/settings');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100/80 rounded-xl transition-all duration-200"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm">
                        ⚙️
                      </div>
                      {L('Mon profil', 'My Profile')}
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        router.push('/dashboard/orders');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100/80 rounded-xl transition-all duration-200"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm">
                        🛒
                      </div>
                      {L('Mes commandes', 'My Orders')}
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        router.push('/dashboard/cart');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100/80 rounded-xl transition-all duration-200"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm">
                        🧺
                      </div>
                      {L('Mon panier', 'My Cart')}
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-100/80 p-1.5">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50/80 rounded-xl transition-all duration-200"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-100/80 flex items-center justify-center text-sm">
                        🚪
                      </div>
                      {L('Déconnexion', 'Log Out')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile notification dropdown - full width */}
      {showNotif && (
        <div className="lg:hidden fixed inset-x-0 top-14 z-40 px-4">
          {renderNotificationDropdown('rounded-b-2xl')}
        </div>
      )}

      {/* Mobile full-screen search overlay */}
      {showMobileSearch && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white/95 backdrop-blur-xl flex flex-col">
          <div className="flex items-center gap-2 p-3 border-b border-gray-100/80 bg-white/80 backdrop-blur-xl">
            <button
              onClick={() => {
                setShowMobileSearch(false);
                setSearch('');
                setSearchResults([]);
              }}
              className="p-2.5 rounded-xl hover:bg-gray-100/80 transition-all duration-200 shrink-0 active:scale-95"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div className="relative flex-1">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input aria-label="Rechercher pièces, commandes"
                ref={mobileSearchInputRef}
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Rechercher pièces, commandes..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/80 border border-gray-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-300 transition-all duration-200 placeholder:text-gray-400"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {searchResults.length > 0 ? (
              <div className="p-2">
                <p className="text-[10px] text-gray-400 px-3 py-1.5 uppercase font-bold tracking-wider">
                  Produits
                </p>
                {searchResults.map((p: SearchProduct) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setShowMobileSearch(false);
                      setSearch('');
                      setSearchResults([]);
                      router.push('/dashboard/marketplace');
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50/80 transition-all duration-200 text-left group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-orange-100 flex items-center justify-center text-sm transition-colors duration-200">
                      📦
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {p.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {p.brand?.name} • {formatCFA(p.price)} FCFA
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : search.length >= 2 ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-xl mx-auto mb-3">
                  🔍
                </div>
                <p className="text-gray-400 text-sm font-medium">Aucun résultat</p>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-xl mx-auto mb-3">
                  ✨
                </div>
                <p className="text-gray-400 text-sm font-medium">Tapez pour rechercher...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile search trigger: tapping notification bell or avatar opens search */}
      {/* (handled via state in their respective onClick handlers above) */}
    </>
  );
}
