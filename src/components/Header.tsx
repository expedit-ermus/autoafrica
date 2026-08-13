'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { track } from '@/lib/tracking';

const categoryNav = [
  { name: { fr: 'Catalogue complet', en: 'Full catalogue' }, icon: '🔍', href: '/catalogue', highlight: true },
  { name: { fr: 'Tarifs & Abonnements', en: 'Pricing' }, icon: '🏷️', href: '/tarifs' },
  { name: { fr: 'Pneus', en: 'Tyres' }, icon: '🛞', href: '/marketplace/categorie/pneus-jantes' },
  { name: { fr: 'Frein', en: 'Brakes' }, icon: '🔴', href: '/marketplace/categorie/frein' },
  { name: { fr: 'Moteur', en: 'Engine' }, icon: '⚙️', href: '/marketplace/categorie/moteur' },
  { name: { fr: 'Filtre', en: 'Filters' }, icon: '🔧', href: '/marketplace/categorie/filtre' },
  { name: { fr: 'Huile moteur', en: 'Engine oil' }, icon: '🛢️', href: '/marketplace/categorie/huiles-fluides' },
  { name: { fr: 'Jantes', en: 'Rims' }, icon: '⭕', href: '/marketplace/categorie/pneus-jantes' },
  { name: { fr: 'Accessoires', en: 'Accessories' }, icon: '📦', href: '/marketplace/categorie/autres' },
];

export default function Header() {
  const { t, locale, setLocale, user } = useApp();
  const { wishlist } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const router = useRouter();

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
    <header className="sticky top-0 z-50">
      {/* ── Top bar ── */}
      <div className="bg-[var(--color-warm-navy-deep)] text-white text-xs py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto scrollbar-hide">
            <Link href="/" className="hover:text-[var(--color-primary)] transition-colors font-bold tracking-wide whitespace-nowrap">
              {L('BOUTIQUE', 'SHOP')}
            </Link>
            <span className="text-white/30">|</span>
            <Link href="/estimation-devis" className="hover:text-amber-300 font-black text-amber-400 transition-colors tracking-wide whitespace-nowrap flex items-center gap-1">
              <span>💡</span> {L('ESTIMATEUR DEVIS', 'QUOTE ESTIMATOR')}
            </Link>
            <span className="text-white/30">|</span>
            <Link href="/catalogue" className="hover:text-[var(--color-primary)] transition-colors font-bold tracking-wide text-[var(--color-primary)] whitespace-nowrap">
              {L('CATALOGUE', 'CATALOGUE')}
            </Link>
            <span className="text-white/30">|</span>
            <Link href="/dashboard" className="hover:text-[var(--color-primary)] transition-colors font-medium whitespace-nowrap">
              {L('CLUB', 'CLUB')}
            </Link>
            <span className="text-white/30 hidden sm:inline">|</span>
            <Link href="/dashboard/vehicles" className="hover:text-[var(--color-primary)] transition-colors font-medium whitespace-nowrap hidden sm:inline">
              {L('VÉHICULES', 'VEHICLES')}
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-4 text-white/70 shrink-0">
            <span className="flex items-center gap-1.5">
              <span className="text-[var(--color-primary)]">●</span>
              {L('Livraison Afrique de l\'Ouest', 'West Africa Delivery')}
            </span>
            <span className="text-white/30">|</span>
            <span className="flex items-center gap-1.5">
              <span className="text-[var(--color-warm-teal)]">●</span>
              {L('Mobile Money accepté', 'Mobile Money accepted')}
            </span>
          </div>
        </div>
      </div>

      {/* ── Main nav bar ── */}
      <div className="bg-[var(--color-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent-warm)] flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/30">
                <span className="text-white font-bold text-lg sm:text-xl">🔧</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-extrabold text-white tracking-tight">Auto</span>
                <span className="text-xl font-extrabold text-[var(--color-primary)] tracking-tight">Afrique</span>
              </div>
            </Link>

            {/* Search bar — desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl min-w-0">
              <div className="flex w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={L('Rechercher une pièce (ex: filtre Toyota Hilux)', 'Search for a part (ex: filter Toyota Hilux)')}
                  className="flex-1 px-5 py-3 rounded-l-xl text-base text-[var(--color-warm-ink)] placeholder-[var(--color-warm-muted)] focus:outline-none border-2 border-transparent focus:border-[var(--color-primary)]"
                />
                <button onClick={handleSearch} className="px-5 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-warm)] hover:from-[var(--color-orange-hover)] hover:to-[var(--color-primary-dark)] text-white font-bold rounded-r-xl transition-all flex items-center gap-2 shadow-lg shadow-[var(--color-primary)]/30 cursor-pointer">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="hidden lg:inline">{L('Rechercher', 'Search')}</span>
                </button>
              </div>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-1 sm:gap-2">

              {/* Mobile search toggle */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="md:hidden p-2.5 rounded-xl hover:bg-white/10 transition-colors text-white"
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
                className="hidden sm:flex px-2.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
              >
                {locale === 'fr' ? '🇫🇷' : '🇬🇧'}
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
        <div className="md:hidden bg-[var(--color-secondary)] border-t border-white/10 px-4 pb-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={L('Rechercher une pièce...', 'Search for a part...')}
              autoFocus
              className="flex-1 px-4 py-3 rounded-xl text-sm text-[var(--color-warm-ink)] placeholder-[var(--color-warm-muted)] focus:outline-none border-2 border-transparent focus:border-[var(--color-primary)]"
            />
            <button onClick={handleSearch} className="px-4 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-warm)] text-white font-bold rounded-xl transition-all shadow-lg shadow-[var(--color-primary)]/30 cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Category bar ── */}
      <div className="bg-[var(--color-secondary-hover)] border-t border-[var(--color-primary)]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2.5 scrollbar-hide">
            {categoryNav.map((cat) => (
              <Link
                key={cat.name.fr}
                href={cat.href}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-sm transition-all whitespace-nowrap font-medium ${
                  cat.highlight
                    ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-warm)] text-white font-bold shadow-md shadow-[var(--color-primary)]/20 hover:brightness-110'
                    : 'text-white/75 hover:text-white hover:bg-[var(--color-primary)]/15'
                }`}
              >
                <span className="text-base">{cat.icon}</span>
                <span className="hidden xs:inline sm:inline">{cat.name[locale as 'fr' | 'en']}</span>
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
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer */}
          <div className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-[var(--color-secondary)] z-50 md:hidden flex flex-col shadow-2xl overflow-y-auto">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent-warm)] flex items-center justify-center">
                  <span className="text-white font-bold">🔧</span>
                </div>
                <span className="font-extrabold text-white">Auto<span className="text-[var(--color-primary)]">Afrique</span></span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Fermer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Auth CTA */}
            <div className="px-5 py-4 border-b border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>{user ? L('Compte connecté', 'Logged account') : L('Pas encore inscrit ?', 'Not registered yet?')}</span>
              </div>
              {user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-warm)] rounded-xl text-white font-bold"
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
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-warm)] rounded-xl text-white font-bold text-sm shadow-md"
                  >
                    <span>🚀</span> {L('S\'inscrire gratuitement', 'Sign up for free')}
                  </Link>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      href="/auth/register?provider=google"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white rounded-xl text-xs font-bold text-gray-800 hover:bg-gray-100 transition-all shadow-sm active:scale-[0.98]"
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
              <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">{L('Navigation', 'Navigation')}</p>
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
                      className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        item.highlight
                          ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)] font-bold'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {item.label[locale as 'fr' | 'en']}
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3 mt-6">{L('Catégories', 'Categories')}</p>
              <ul className="space-y-1">
                {categoryNav.filter(c => !c.highlight).map((cat) => (
                  <li key={cat.href}>
                    <Link
                      href={cat.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm text-white/75 hover:text-white hover:bg-white/10 transition-colors font-medium"
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name[locale as 'fr' | 'en']}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Drawer footer */}
            <div className="px-5 py-4 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => { setLocale(locale === 'fr' ? 'en' : 'fr'); setMobileMenuOpen(false); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 transition-colors text-white border border-white/10"
              >
                {locale === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}
              </button>
              <Link
                href="/aide"
                onClick={() => setMobileMenuOpen(false)}
                className="text-white/60 text-sm hover:text-white transition-colors"
              >
                {L('Aide', 'Help')}
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );

  function L(fr: string, en: string) {
    return locale === 'fr' ? fr : en;
  }
}
