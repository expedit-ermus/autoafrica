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
      <div className="bg-[#0A1929] text-white text-xs py-1.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-[#FF6B35] transition-colors font-medium">
              SHOP
            </Link>
            <span className="text-white/30">|</span>
            <Link href="/dashboard" className="hover:text-[#FF6B35] transition-colors">
              {L('CLUB', 'CLUB')}
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-4 text-white/60">
            <span>{L('Livraison gratuite dès 50 000 FCFA', 'Free delivery from 50,000 FCFA')}</span>
            <span className="text-white/30">|</span>
            <span>{L('Paiement sécurisé', 'Secure payment')}</span>
          </div>
        </div>
      </div>

      <div className="bg-[#1E3A5F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-10 h-10 rounded-lg bg-[#FF6B35] flex items-center justify-center shadow-lg shadow-[#FF6B35]/25">
                <span className="text-white font-bold text-xl">🔧</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-white">Auto</span>
                <span className="text-xl font-bold text-[#FF6B35]">Afrique</span>
              </div>
            </Link>

            <div className="flex-1 max-w-2xl">
              <div className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={L('Entrez le numéro ou le nom de la pièce', 'Enter part number or name')}
                  className="flex-1 px-4 py-2.5 rounded-l-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                />
                <button className="px-5 py-2.5 bg-[#FF6B35] hover:bg-[#FF5520] text-white font-semibold rounded-r-lg transition-colors flex items-center gap-2 shadow-lg shadow-[#FF6B35]/25">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="hidden sm:inline">{L('Rechercher', 'Search')}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <div className="hidden md:block text-left">
                  <div className="text-xs text-white/60">{L('Mon Garage', 'My Garage')}</div>
                  <div className="text-xs font-medium">{L('Ajouter un véhicule', 'Add a vehicle')}</div>
                </div>
              </Link>

              <Link
                href={user ? '/dashboard' : '/auth/login'}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div className="hidden md:block text-left">
                  <div className="text-xs text-white/60">AutoAfrique</div>
                  <div className="text-xs font-medium">{user ? t.nav.dashboard : L('Se connecter', 'Log in')}</div>
                </div>
              </Link>

              <Link
                href="/dashboard/cart"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-white relative"
              >
                <div className="relative">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#FF6B35] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs text-white/60">{cartCount} {L('article(s)', 'item(s)')}</div>
                  <div className="text-xs font-medium">0 FCFA</div>
                </div>
              </Link>

              <button
                onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')}
                className="px-2 py-1.5 rounded text-xs font-semibold bg-white/10 hover:bg-white/20 transition-colors"
              >
                {locale === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#162D4A] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
            {categoryNav.map((cat) => (
              <Link
                key={cat.name.fr}
                href={cat.href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all whitespace-nowrap"
              >
                <span>{cat.icon}</span>
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
