'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';

const categoryNav = [
  { name: { fr: 'Pneus', en: 'Tyres' }, icon: '🛞', href: '/dashboard/marketplace' },
  { name: { fr: 'Frein', en: 'Brakes' }, icon: '🔴', href: '/dashboard/marketplace' },
  { name: { fr: 'Moteur', en: 'Engine' }, icon: '⚙️', href: '/dashboard/marketplace' },
  { name: { fr: 'Filtre', en: 'Filters' }, icon: '🔧', href: '/dashboard/marketplace' },
  { name: { fr: 'Huile moteur', en: 'Engine oil' }, icon: '🛢️', href: '/dashboard/marketplace' },
  { name: { fr: 'Jantes', en: 'Rims' }, icon: '⭕', href: '/dashboard/marketplace' },
  { name: { fr: 'Accessoires', en: 'Accessories' }, icon: '📦', href: '/dashboard/marketplace' },
  { name: { fr: 'Outillage', en: 'Tools' }, icon: '🔨', href: '/dashboard/marketplace' },
];

export default function Header() {
  const { t, locale, setLocale, user } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount] = useState(0);

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-[var(--color-warm-navy-deep)] text-white text-xs py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-[var(--color-primary)] transition-colors font-bold tracking-wide">
              {L('BOUTIQUE', 'SHOP')}
            </Link>
            <span className="text-white/30">|</span>
            <Link href="/dashboard" className="hover:text-[var(--color-primary)] transition-colors font-medium">
              {L('CLUB', 'CLUB')}
            </Link>
            <span className="text-white/30">|</span>
            <Link href="/dashboard/vehicles" className="hover:text-[var(--color-primary)] transition-colors font-medium">
              {L('VÉHICULES', 'VEHICLES')}
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-4 text-white/70">
            <span className="flex items-center gap-1.5">
              <span className="text-[var(--color-primary)]">●</span>
              {L('Livraison gratuite dès 50 000 FCFA', 'Free delivery from 50,000 FCFA')}
            </span>
            <span className="text-white/30">|</span>
            <span className="flex items-center gap-1.5">
              <span className="text-[var(--color-warm-teal)]">●</span>
              {L('Mobile Money accepté', 'Mobile Money accepted')}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent-warm)] flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/30">
                <span className="text-white font-bold text-xl">🔧</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-extrabold text-white tracking-tight">Auto</span>
                <span className="text-xl font-extrabold text-[var(--color-primary)] tracking-tight">Afrique</span>
              </div>
            </Link>

            <div className="hidden md:block flex-1 max-w-2xl min-w-0">
              <div className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={L('Rechercher une pièce (ex: filtre Toyota Hilux)', 'Search for a part (ex: filter Toyota Hilux)')}
                  className="flex-1 px-5 py-3 rounded-l-xl text-base text-[var(--color-warm-ink)] placeholder-[var(--color-warm-muted)] focus:outline-none border-2 border-transparent focus:border-[var(--color-primary)]"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-warm)] hover:from-[var(--color-orange-hover)] hover:to-[var(--color-primary-dark)] text-white font-bold rounded-r-xl transition-all flex items-center gap-2 shadow-lg shadow-[var(--color-primary)]/30">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="hidden sm:inline">{L('Rechercher', 'Search')}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <div className="hidden md:block text-left">
                  <div className="text-xs text-white/60">{L('Mon Garage', 'My Garage')}</div>
                  <div className="text-xs font-bold">{L('Ajouter un véhicule', 'Add a vehicle')}</div>
                </div>
              </Link>

              <Link
                href={user ? '/dashboard' : '/auth/login'}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div className="hidden md:block text-left">
                  <div className="text-xs text-white/60">AutoAfrique</div>
                  <div className="text-xs font-bold">{user ? t.nav.dashboard : L('Se connecter', 'Log in')}</div>
                </div>
              </Link>

              <Link
                href="/dashboard/cart"
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white relative"
              >
                <div className="relative">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-[var(--color-primary)] text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-md">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs text-white/60">{cartCount} {L('article(s)', 'item(s)')}</div>
                  <div className="text-xs font-bold">0 FCFA</div>
                </div>
              </Link>

              <button
                onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
              >
                {locale === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-secondary-hover)] border-t border-[var(--color-primary)]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2.5 scrollbar-hide">
            {categoryNav.map((cat) => (
              <Link
                key={cat.name.fr}
                href={cat.href}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-white/75 hover:text-white hover:bg-[var(--color-primary)]/15 transition-all whitespace-nowrap font-medium"
              >
                <span className="text-base">{cat.icon}</span>
                <span>{cat.name[locale as 'fr' | 'en']}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );

  function L(fr: string, en: string) {
    return locale === 'fr' ? fr : en;
  }
}
