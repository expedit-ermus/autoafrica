'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { track } from '@/lib/tracking';
import { useDialogBehavior } from '@/lib/useDialogBehavior';

const categoryNav = [
  { name: { fr: 'Catalogue complet', en: 'Full catalogue' }, icon: '🔍', href: '/catalogue', highlight: true },
  { name: { fr: 'Recherche par véhicule', en: 'Search by vehicle' }, icon: '🚗', href: '/recherche-pieces' },
  { name: { fr: 'Tarifs & Abonnements', en: 'Pricing' }, icon: '🏷️', href: '/tarifs' },
  { name: { fr: 'Pneus & Jantes', en: 'Tyres & Rims' }, icon: '🛞', href: '/categories/pneus-jantes' },
  { name: { fr: 'Freinage', en: 'Brakes' }, icon: '🔴', href: '/categories/frein' },
  { name: { fr: 'Moteur', en: 'Engine' }, icon: '⚙️', href: '/categories/moteur' },
  { name: { fr: 'Filtres', en: 'Filters' }, icon: '🔧', href: '/categories/filtre' },
  { name: { fr: 'Suspension', en: 'Suspension' }, icon: '🚙', href: '/categories/suspension' },
  { name: { fr: 'Huiles & Fluides', en: 'Engine oil' }, icon: '🛢️', href: '/categories/huiles-fluides' },
  { name: { fr: 'Électricité', en: 'Electricity' }, icon: '⚡', href: '/categories/electricite' },
];

export default function Header() {
  const { t, locale, setLocale, user } = useApp();
  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);
  const { wishlist } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const router = useRouter();

  // Tiroir mobile : Échap, blocage du défilement, piège de focus, retour au bouton.
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);
  const drawerRef = useDialogBehavior<HTMLDivElement>(mobileMenuOpen, closeMobileMenu);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/catalogue?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/catalogue');
    }
    setMobileSearchOpen(false);
  };

  useEffect(() => {
    const syncCart = () => {
      if (typeof window === 'undefined') return;
      const saved = window.localStorage.getItem('cart');
      const items: { price: number; quantity: number }[] = saved ? JSON.parse(saved) : [];
      setCartCount(items.reduce((s, i) => s + i.quantity, 0));
      setCartTotal(items.reduce((s, i) => s + i.price * i.quantity, 0));
    };
    syncCart();
    window.addEventListener('aa-cart-updated', syncCart);
    window.addEventListener('storage', syncCart);
    return () => {
      window.removeEventListener('aa-cart-updated', syncCart);
      window.removeEventListener('storage', syncCart);
    };
  }, []);

  // Close mobile menu on route change / outside click
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const formatCFA = (n: number) => `${new Intl.NumberFormat('fr-FR').format(n)} FCFA`;

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* ── Top bar ── */}
      <div className="bg-slate-950 text-slate-300 text-xs py-1.5 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <nav aria-label="Liens rapides" className="flex items-center gap-3 sm:gap-4 overflow-x-auto scrollbar-hide font-medium">
            <Link href="/" className="hover:text-orange-400 transition-colors font-bold tracking-wide whitespace-nowrap text-white">
              {L('BOUTIQUE', 'SHOP')}
            </Link>
            <span className="text-slate-700">|</span>
            <Link href="/estimation-devis" className="hover:text-amber-300 font-extrabold text-amber-400 transition-colors tracking-wide whitespace-nowrap flex items-center gap-1.5 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
              <span>💡</span> {L('ESTIMATEUR DEVIS', 'QUOTE ESTIMATOR')}
            </Link>
            <span className="text-slate-700">|</span>
            <Link href="/catalogue" className="hover:text-orange-400 transition-colors font-bold tracking-wide text-orange-400 whitespace-nowrap">
              {L('CATALOGUE', 'CATALOGUE')}
            </Link>
            <span className="text-slate-700">|</span>
            <Link href="/dashboard" className="hover:text-orange-400 transition-colors font-medium whitespace-nowrap text-slate-300">
              {L('CLUB', 'CLUB')}
            </Link>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <Link href="/dashboard/vehicles" className="hover:text-orange-400 transition-colors font-medium whitespace-nowrap hidden sm:inline text-slate-300">
              {L('VÉHICULES', 'VEHICLES')}
            </Link>
          </nav>
          <div className="hidden md:flex items-center gap-4 text-slate-400 text-[11px] shrink-0 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              {L('Livraison Express Abidjan & Gares', 'Express Delivery Abidjan & Bus Stations')}
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              {L('Séquestre Mobile Money Garanti', 'Guaranteed Mobile Money Escrow')}
            </span>
          </div>
        </div>
      </div>

      {/* ── Main nav bar (10K Glassmorphism) ── */}
      <div className="bg-slate-950/90 backdrop-blur-xl border-b border-white/10 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-105 group-hover:shadow-orange-500/50 transition-all border border-white/20">
                <span className="text-white font-bold text-lg sm:text-xl drop-shadow">🔧</span>
              </div>
              <div className="hidden sm:block leading-none">
                <span className="text-xl font-black text-white tracking-tight font-heading">Auto<span className="text-orange-500">Afrique</span></span>
                <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-0.5">Marketplace & ERP</span>
              </div>
            </Link>

            {/* Search bar — desktop */}
            <div className="hidden md:flex flex-1 max-w-xl min-w-0 mx-2">
              <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex w-full items-center bg-slate-900/90 border border-white/10 rounded-2xl overflow-hidden shadow-inner focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/20 transition-all">
                <span className="pl-4 text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <label htmlFor="desktop-search" className="sr-only">Rechercher une pièce</label>
                <input
                  id="desktop-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder={L('Rechercher une pièce (ex: amortisseur Toyota Hilux, plaquettes 206...)', 'Search for a part (ex: shock absorber Hilux, brake pads...)')}
                  className="flex-1 px-3 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none bg-transparent"
                />
                <button
                  type="submit"
                  onClick={handleSearch}
                  className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-md active:scale-95"
                >
                  <span>{L('Trouver', 'Find')}</span>
                </button>
              </form>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-1 sm:gap-2">

              {/* Mobile search toggle */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="md:hidden p-2.5 rounded-xl hover:bg-slate-800 transition-colors text-white"
                aria-label="Rechercher"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Dashboard link — desktop */}
              <Link
                href="/dashboard"
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <div className="hidden lg:block text-left">
                  <div className="text-xs text-white/60">{L('Mon Garage', 'My Garage')}</div>
                  <div className="text-xs font-bold">{L('Ajouter un véhicule', 'Add a vehicle')}</div>
                </div>
              </Link>

              {/* Auth link */}
              <Link
                href={user ? '/dashboard' : '/auth/login'}
                onClick={() => { if (!user) track('click_cta_login', { source: 'header' }); }}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white"
                aria-label={user ? L('Mon tableau de bord', 'My dashboard') : L('Se connecter', 'Log in')}
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div className="hidden lg:block text-left">
                  <div className="text-xs text-white/60">AutoAfrique</div>
                  <div className="text-xs font-bold">{user ? t.nav.dashboard : L('Se connecter', 'Log in')}</div>
                </div>
              </Link>

              {/* Wishlist */}
              <Link
                href="/favoris"
                className="flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white relative"
                title={L('Mes Favoris', 'My Favorites')}
              >
                <div className="relative">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {wishlist.length > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-md">
                      {wishlist.length}
                    </span>
                  )}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs text-white/60">{wishlist.length} {L('favori(s)', 'favorite(s)')}</div>
                  <div className="text-xs font-bold">{L('Mes Favoris', 'Favorites')}</div>
                </div>
              </Link>

              {/* Cart */}
              <Link
                href="/dashboard/cart"
                className="flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white relative"
                aria-label={L('Panier', 'Cart')}
              >
                <div className="relative">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-[var(--color-primary)] text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-md">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs text-white/60">{cartCount} {L('article(s)', 'item(s)')}</div>
                  <div className="text-xs font-bold">{cartTotal > 0 ? formatCFA(cartTotal) : '0 FCFA'}</div>
                </div>
              </Link>

              {/* Lang toggle */}
              <button
                onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-white/10 hover:bg-white/20 transition-colors border border-white/15 text-white cursor-pointer"
                title={locale === 'fr' ? 'Switch to English' : 'Changer en Français'}
              >
                <span>{locale === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN'}</span>
              </button>

              {/* Hamburger — mobile only */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2.5 rounded-xl hover:bg-white/10 transition-colors text-white"
                aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile search bar (expandable) ── */}
      {mobileSearchOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-3">
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex gap-2">
            <label htmlFor="mobile-search" className="sr-only">Rechercher une pièce</label>
            <input
              id="mobile-search"
              type="text"
              aria-label={L('Rechercher une pièce détachée', 'Search for a spare part')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={L('Rechercher une pièce...', 'Search for a part...')}
              autoFocus
              className="flex-1 px-4 py-2.5 rounded-xl text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none border-2 border-transparent focus:border-orange-500"
            />
            <button
              type="submit"
              aria-label={L('Lancer la recherche', 'Submit search')}
              onClick={handleSearch}
              className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* ── Category bar ── */}
      <div className="bg-slate-950/90 border-b border-slate-800/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 overflow-x-auto py-2 scrollbar-hide">
            {categoryNav.map((cat) => (
              <Link
                key={cat.name.fr}
                href={cat.href}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  cat.highlight
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-sm shadow-orange-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700/60'
                }`}
              >
                <span className="text-sm">{cat.icon}</span>
                <span>{cat.name[locale as 'fr' | 'en']}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile menu drawer ── */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer */}
          <div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label={locale === 'fr' ? 'Menu de navigation' : 'Navigation menu'}
            className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-slate-950 border-r border-slate-800 z-50 md:hidden flex flex-col shadow-2xl overflow-y-auto"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold">🔧</span>
                </div>
                <span className="font-black text-white text-lg tracking-tight">Auto<span className="text-orange-500">Afrique</span></span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Fermer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Auth CTA */}
            <div className="px-5 py-4 border-b border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{user ? L('Compte connecté', 'Logged account') : L('Pas encore inscrit ?', 'Not registered yet?')}</span>
              </div>
              {user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white font-black shadow-md"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {L('Mon Dashboard', 'My Dashboard')}
                </Link>
              ) : (
                <div className="space-y-2.5">
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white font-black text-sm shadow-md"
                  >
                    <span>🚀</span> {L('S\'inscrire gratuitement', 'Sign up for free')}
                  </Link>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      href="/auth/register?provider=google"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white rounded-xl text-xs font-bold text-slate-900 hover:bg-slate-100 transition-all shadow-sm active:scale-[0.98]"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                      Google
                    </Link>
                    <Link
                      href="/auth/register?provider=facebook"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white rounded-xl text-xs font-bold text-gray-800 hover:bg-gray-100 transition-all shadow-sm active:scale-[0.98]"
                    >
                      <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      Facebook
                    </Link>
                  </div>
                </div>
              )}
            </div>


            {/* Navigation links */}
            <nav className="flex-1 px-5 py-4">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">{L('Navigation', 'Navigation')}</p>
              <ul className="space-y-1">
                {[
                  { href: '/', label: { fr: '🏠 Boutique', en: '🏠 Shop' } },
                  { href: '/catalogue', label: { fr: '🔍 Catalogue pièces', en: '🔍 Parts catalogue' }, highlight: true },
                  { href: '/tarifs', label: { fr: '🏷️ Tarifs & Abonnements', en: '🏷️ Pricing' } },
                  { href: '/dashboard', label: { fr: '⚡ Mon Club', en: '⚡ My Club' } },
                  { href: '/dashboard/vehicles', label: { fr: '🚗 Mes Véhicules', en: '🚗 My Vehicles' } },
                  { href: '/dashboard/cart', label: { fr: `🛒 Panier (${cartCount})`, en: `🛒 Cart (${cartCount})` } },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        item.highlight
                          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                      }`}
                    >
                      {item.label[locale as 'fr' | 'en']}
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 mt-6">{L('Catégories', 'Categories')}</p>
              <ul className="space-y-1">
                {categoryNav.filter(c => !c.highlight).map((cat) => (
                  <li key={cat.href}>
                    <Link
                      href={cat.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors font-semibold"
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name[locale as 'fr' | 'en']}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Drawer footer */}
            <div className="px-5 py-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => { setLocale(locale === 'fr' ? 'en' : 'fr'); setMobileMenuOpen(false); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black bg-slate-900 hover:bg-slate-850 transition-colors text-white border border-slate-800"
              >
                {locale === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}
              </button>
              <Link
                href="/aide"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-400 text-xs font-bold hover:text-white transition-colors"
              >
                {L('Aide & Support', 'Help & Support')}
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
