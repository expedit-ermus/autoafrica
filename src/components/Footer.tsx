'use client';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';

export default function Footer() {
  const { t, locale } = useApp();
  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const countries = [
    { code: 'ci', name: 'Côte d\'Ivoire' },
    { code: 'sn', name: 'Sénégal' },
    { code: 'ml', name: 'Mali' },
    { code: 'bf', name: 'Burkina Faso' },
    { code: 'ne', name: 'Niger' },
    { code: 'bj', name: 'Bénin' },
    { code: 'tg', name: 'Togo' },
    { code: 'gw', name: 'Guinée-Bissau' },
    { code: 'ng', name: 'Nigeria' },
    { code: 'gh', name: 'Ghana' },
  ];

  return (
    <footer className="bg-[#1E3A5F] text-white">
      <div className="bg-[#0A1929] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-white font-extrabold text-xl mb-3">
                {L('Réparer sa voiture n\'a jamais été aussi simple', 'Fixing your car has never been easier')}
              </h3>
              <p className="text-white/70 text-base">{L('Rejoignez des milliers de garagistes en Afrique de l\'Ouest', 'Join thousands of mechanics in West Africa')}</p>
            </div>
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-[#FF6B35] to-[#FF8C00] rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-lg shadow-[#FF6B35]/30">
                  <span className="text-white text-2xl">📱</span>
                </div>
                <div className="text-sm text-white/70 font-medium">{L('Appli Mobile', 'Mobile App')}</div>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-lg">
                  <span className="text-white text-2xl">▶️</span>
                </div>
                <div className="text-sm text-white/70 font-medium">YouTube</div>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-pink-500 rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-lg">
                  <span className="text-white text-2xl">📷</span>
                </div>
                <div className="text-sm text-white/70 font-medium">Instagram</div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-3xl font-extrabold tracking-tight">Auto<span className="text-[#FF6B35]">Afrique</span></div>
              <p className="text-white/50 text-sm mt-2 font-medium">{L('La marketplace n°1 des pièces auto', '#1 auto parts marketplace')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-bold mb-5 text-sm tracking-wide">{L('À PROPOS D\'AUTOFRIQUE', 'ABOUT AUTAFRIQUE')}</h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li><a href="#" className="hover:text-[#FF6B35] transition-colors font-medium">{L('Qui sommes-nous ?', 'About us?')}</a></li>
                <li><a href="#" className="hover:text-[#FF6B35] transition-colors font-medium">{L('Programme Bonus', 'Bonus Program')}</a></li>
                <li><a href="#" className="hover:text-[#FF6B35] transition-colors font-medium">{L('Appli AutoAfrique', 'AutoAfrique App')}</a></li>
                <li><a href="#" className="hover:text-[#FF6B35] transition-colors font-medium">{L('Marketplace', 'Marketplace')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-5 text-sm tracking-wide">{L('AIDE ET SOUTIEN', 'HELP & SUPPORT')}</h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li><a href="#" className="hover:text-[#FF6B35] transition-colors font-medium">{L('Blog', 'Blog')}</a></li>
                <li><a href="#" className="hover:text-[#FF6B35] transition-colors font-medium">{L('Manuels de réparation', 'Repair manuals')}</a></li>
                <li><a href="#" className="hover:text-[#FF6B35] transition-colors font-medium">{L('Conditions générales', 'Terms & conditions')}</a></li>
                <li><a href="#" className="hover:text-[#FF6B35] transition-colors font-medium">{L('Politique de confidentialité', 'Privacy policy')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-5 text-sm tracking-wide">{L('SERVICE CLIENTS', 'CUSTOMER SERVICE')}</h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li><a href="#" className="hover:text-[#FF6B35] transition-colors font-medium">{L('Centre d\'aide', 'Help center')}</a></li>
                <li><a href="#" className="hover:text-[#FF6B35] transition-colors font-medium">{L('Paiement', 'Payment')}</a></li>
                <li><a href="#" className="hover:text-[#FF6B35] transition-colors font-medium">{L('Livraison', 'Delivery')}</a></li>
                <li><a href="#" className="hover:text-[#FF6B35] transition-colors font-medium">{L('Nous contacter', 'Contact us')}</a></li>
                <li><a href="#" className="hover:text-[#FF6B35] transition-colors font-medium">{L('Retours', 'Returns')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-5 text-sm tracking-wide">{L('PRODUITS', 'PRODUCTS')}</h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li><a href="#" className="hover:text-[#FF6B35] transition-colors font-medium">{L('Pneus & Jantes', 'Tyres & Rims')}</a></li>
                <li><a href="#" className="hover:text-[#FF6B35] transition-colors font-medium">{L('Frein', 'Brakes')}</a></li>
                <li><a href="#" className="hover:text-[#FF6B35] transition-colors font-medium">{L('Moteur', 'Engine')}</a></li>
                <li><a href="#" className="hover:text-[#FF6B35] transition-colors font-medium">{L('Filtres', 'Filters')}</a></li>
                <li><a href="#" className="hover:text-[#FF6B35] transition-colors font-medium">{L('Huiles & fluides', 'Oils & fluids')}</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0A1929] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-white font-bold mb-4 text-base">
                {L('Abonnez-vous et recevez 5 000 FCFA de réduction', 'Subscribe and get 5,000 FCFA off')}
              </h4>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder={L('Votre adresse email', 'Your email address')}
                  className="flex-1 px-5 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/50 text-base focus:outline-none focus:border-[#FF6B35] focus:bg-white/15 transition-all"
                />
                <button className="px-8 py-3 bg-gradient-to-r from-[#FF6B35] to-[#FF8C00] hover:from-[#FF5520] hover:to-[#E85D04] text-white font-bold rounded-xl transition-all text-base shadow-lg shadow-[#FF6B35]/30">
                  {L('S\'abonner', 'Subscribe')}
                </button>
              </div>
              <p className="text-white/50 text-sm mt-3">
                {L('En vous abonnant, vous acceptez notre politique de confidentialité.', 'By subscribing, you agree to our privacy policy.')}
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 text-base">
                {L('Moyens de paiement', 'Payment methods')}
              </h4>
              <div className="flex flex-wrap gap-2.5 mb-5">
                {[
                  { name: 'Orange Money', color: '#FF6600', icon: '🟠' },
                  { name: 'MTN MoMo', color: '#FFCC00', icon: '🟡' },
                  { name: 'Wave', color: '#00B4D8', icon: '🔵' },
                  { name: 'Visa', color: '#1A1F71', icon: '💳' },
                  { name: 'Mastercard', color: '#EB001B', icon: '💳' },
                ].map((p) => (
                  <div
                    key={p.name}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-sm text-white/85 font-semibold border border-white/10"
                  >
                    <span>{p.icon}</span>
                    {p.name}
                  </div>
                ))}
              </div>
              <h4 className="text-white font-bold mb-4 text-base">
                {L('Transporteurs', 'Carriers')}
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {['DHL', 'UPS', 'GLS', 'Chronopost'].map((c) => (
                  <div key={c} className="px-4 py-2 bg-white/10 rounded-xl text-sm text-white/85 font-semibold border border-white/10">
                    {c}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0A1929] border-t border-white/10 py-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-white/50">
              <span>© {new Date().getFullYear()} AutoAfrique.</span>
              <span>{L('Service client : Lun-Ven 8h-20h, Sam 8h-17h', 'Customer service: Mon-Fri 8am-8pm, Sat 8am-5pm')}</span>
            </div>
            <div className="flex items-center gap-4">
              <select className="bg-white/10 border border-white/15 rounded-xl px-4 py-2 text-sm text-white/85 focus:outline-none font-medium">
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-3">
                <a href="#" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#FF6B35]/20 flex items-center justify-center transition-all border border-white/10">
                  <svg className="w-5 h-5 text-white/70" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#FF6B35]/20 flex items-center justify-center transition-all border border-white/10">
                  <svg className="w-5 h-5 text-white/70" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#FF6B35]/20 flex items-center justify-center transition-all border border-white/10">
                  <svg className="w-5 h-5 text-white/70" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.757-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
