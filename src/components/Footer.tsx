'use client';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';

export default function Footer() {
  const { t, locale } = useApp();

  return (
    <footer id="contact" className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">🔧</span>
              </div>
              <div>
                <span className="text-xl font-bold text-white">Auto<span className="text-orange-400">Afrique</span></span>
                <p className="text-xs text-gray-500">{locale === 'fr' ? 'Pièces Détachées' : 'Auto Parts'}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6">{t.footer.description}</p>
            <div className="flex gap-2 flex-wrap">
              {['Orange Money', 'MTN', 'Wave', 'Moov'].map((p) => (
                <div key={p} className="px-3 py-1.5 rounded-lg bg-gray-800 text-xs font-medium text-gray-400">{p}</div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.product}</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/#features" className="hover:text-orange-400 transition">{t.nav.inventory}</Link></li>
              <li><Link href="/#features" className="hover:text-orange-400 transition">{t.nav.marketplace}</Link></li>
              <li><Link href="/#features" className="hover:text-orange-400 transition">{t.nav.payments}</Link></li>
              <li><Link href="/#features" className="hover:text-orange-400 transition">{t.nav.crm}</Link></li>
              <li><Link href="/#features" className="hover:text-orange-400 transition">{t.nav.finance}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.company}</h3>
            <ul className="space-y-2.5 text-sm">
              <li><span className="hover:text-orange-400 transition cursor-pointer">{t.footer.about}</span></li>
              <li><span className="hover:text-orange-400 transition cursor-pointer">{t.footer.blog}</span></li>
              <li><span className="hover:text-orange-400 transition cursor-pointer">{t.footer.careers}</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.support}</h3>
            <ul className="space-y-2.5 text-sm">
              <li><span className="hover:text-orange-400 transition cursor-pointer">{t.footer.helpCenter}</span></li>
              <li><span className="hover:text-orange-400 transition cursor-pointer">{t.footer.contact}</span></li>
              <li><span className="hover:text-orange-400 transition cursor-pointer">{t.footer.privacy}</span></li>
              <li><span className="hover:text-orange-400 transition cursor-pointer">{t.footer.terms}</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">&copy; 2026 AutoAfrique. {t.footer.rights}</p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {['Abidjan', 'Dakar', 'Lagos', 'Accra'].map((city, i) => (
              <span key={city} className="flex items-center gap-3">
                {i > 0 && <span className="text-gray-700">|</span>}
                <span>{city}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
