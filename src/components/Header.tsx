'use client';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';

export default function Header() {
  const { t, locale, setLocale, user } = useApp();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">🔧</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900 leading-tight">Auto<span className="text-gradient">Afrique</span></span>
              <span className="text-[10px] text-gray-400 font-medium leading-none hidden sm:block">{locale === 'fr' ? 'Pièces Détachées' : 'Auto Parts'}</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link href="/#features" className="text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-lg transition">
              {t.nav.home}
            </Link>
            <Link href="/#pricing" className="text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-lg transition">
              {t.pricing.title.split(' ').slice(0,2).join(' ')}
            </Link>
            <Link href="/#contact" className="text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-lg transition">
              {t.footer.contact}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-orange-50 hover:text-orange-600 transition"
            >
              <span>{locale === 'fr' ? '🇫🇷' : '🇬🇧'}</span>
              {locale === 'fr' ? 'FR' : 'EN'}
            </button>

            {user ? (
              <Link href="/dashboard" className="btn-primary text-sm !py-2 !px-5">
                {t.nav.dashboard}
              </Link>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-lg transition hidden sm:block">
                  {t.nav.login}
                </Link>
                <Link href="/auth/register" className="btn-primary text-sm !py-2 !px-5">
                  {t.nav.register}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
