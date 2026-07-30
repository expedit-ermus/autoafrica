'use client';
import { useApp } from '@/contexts/AppContext';

export default function LanguageToggle() {
  const { locale, setLocale } = useApp();

  return (
    <div className="fixed bottom-24 lg:bottom-6 left-4 lg:left-6 z-[80] hidden lg:block">
      <button
        onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')}
        className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all group cursor-pointer"
      >
        <span className="text-lg">{locale === 'fr' ? '🇫🇷' : '🇬🇧'}</span>
        <span className="text-sm font-bold text-gray-700 group-hover:text-orange-600 transition">
          {locale === 'fr' ? 'FR' : 'EN'}
        </span>
      </button>
    </div>
  );
}
