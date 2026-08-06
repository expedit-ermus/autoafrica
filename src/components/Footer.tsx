'use client';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';

export default function Footer() {
  const { locale } = useApp();
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
    <footer className="bg-[var(--color-secondary)] text-white">
      <div className="bg-[var(--color-warm-navy-deep)] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <h3 className="text-white font-extrabold text-xl mb-3">
                {L('Réparer sa voiture n\'a jamais été aussi simple', 'Fixing your car has never been easier')}
              </h3>
              <p className="text-white/70 text-base">{L('Rejoignez les garagistes en Afrique de l\'Ouest', 'Join the mechanic community in West Africa')}</p>
            </div>
            <div className="text-center md:text-right">
              <div className="text-3xl font-extrabold tracking-tight">Auto<span className="text-[var(--color-primary)]">Afrique</span></div>
              <p className="text-white/50 text-sm mt-2 font-medium">{L('La marketplace des pièces auto', 'The auto parts marketplace')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-bold mb-5 text-sm tracking-wide">{L('À PROPOS D\'AUTAFRIQUE', 'ABOUT AUTAFRIQUE')}</h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li><Link href="/a-propos" className="hover:text-[var(--color-primary)] transition-colors font-medium">{L('Qui sommes-nous ?', 'About us?')}</Link></li>
                <li><Link href="/tarifs" className="hover:text-[var(--color-primary)] transition-colors font-medium">{L('Tarifs & Abonnements SaaS', 'Pricing & Subscriptions')}</Link></li>
                <li><Link href="/dashboard/marketplace" className="hover:text-[var(--color-primary)] transition-colors font-medium">{L('Marketplace', 'Marketplace')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-5 text-sm tracking-wide">{L('AIDE ET SOUTIEN', 'HELP & SUPPORT')}</h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li><Link href="/blog" className="hover:text-[var(--color-primary)] transition-colors font-medium">{L('Blog', 'Blog')}</Link></li>
                <li><Link href="/manuels-reparation" className="hover:text-[var(--color-primary)] transition-colors font-medium">{L('Manuels de réparation', 'Repair manuals')}</Link></li>
                <li><Link href="/conditions-generales" className="hover:text-[var(--color-primary)] transition-colors font-medium">{L('Conditions générales', 'Terms & conditions')}</Link></li>
                <li><Link href="/politique-de-confidentialite" className="hover:text-[var(--color-primary)] transition-colors font-medium">{L('Politique de confidentialité', 'Privacy policy')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-5 text-sm tracking-wide">{L('SERVICE CLIENTS', 'CUSTOMER SERVICE')}</h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li><Link href="/aide" className="hover:text-[var(--color-primary)] transition-colors font-medium">{L('Centre d\'aide', 'Help center')}</Link></li>
                <li><Link href="/paiement" className="hover:text-[var(--color-primary)] transition-colors font-medium">{L('Paiement', 'Payment')}</Link></li>
                <li><Link href="/livraison" className="hover:text-[var(--color-primary)] transition-colors font-medium">{L('Livraison', 'Delivery')}</Link></li>
                <li><Link href="/contact" className="hover:text-[var(--color-primary)] transition-colors font-medium">{L('Nous contacter', 'Contact us')}</Link></li>
                <li><Link href="/retours" className="hover:text-[var(--color-primary)] transition-colors font-medium">{L('Retours', 'Returns')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-5 text-sm tracking-wide">{L('PRODUITS', 'PRODUCTS')}</h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li><Link href="/marketplace/categorie/pneus-jantes" className="hover:text-[var(--color-primary)] transition-colors font-medium">{L('Pneus & Jantes', 'Tyres & Rims')}</Link></li>
                <li><Link href="/marketplace/categorie/frein" className="hover:text-[var(--color-primary)] transition-colors font-medium">{L('Frein', 'Brakes')}</Link></li>
                <li><Link href="/marketplace/categorie/moteur" className="hover:text-[var(--color-primary)] transition-colors font-medium">{L('Moteur', 'Engine')}</Link></li>
                <li><Link href="/marketplace/categorie/filtre" className="hover:text-[var(--color-primary)] transition-colors font-medium">{L('Filtres', 'Filters')}</Link></li>
                <li><Link href="/marketplace/categorie/huiles-fluides" className="hover:text-[var(--color-primary)] transition-colors font-medium">{L('Huiles & fluides', 'Oils & fluids')}</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-warm-navy-deep)] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-white font-bold mb-4 text-base">
                {L('Abonnez-vous pour suivre l\'actualité AutoAfrique', 'Subscribe to follow AutoAfrique news')}
              </h4>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder={L('Votre adresse email', 'Your email address')}
                  className="flex-1 min-w-0 px-5 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/50 text-base focus:outline-none focus:border-[var(--color-primary)] focus:bg-white/15 transition-all"
                />
                <button className="px-8 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-warm)] hover:from-[var(--color-orange-hover)] hover:to-[var(--color-primary-dark)] text-white font-bold rounded-xl transition-all text-base shadow-lg shadow-[var(--color-primary)]/30">
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
                  { name: 'Moov Money', color: '#0066CC', icon: '🔷' },
                  { name: 'Wave', color: '#00B4D8', icon: '🔵' },
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
                <div className="px-4 py-2 bg-white/10 rounded-xl text-sm text-white/85 font-semibold border border-white/10">
                  {L('Livraison locale partenaire', 'Local partner delivery')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-warm-navy-deep)] border-t border-white/10 py-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-white/50">
              <span>© {new Date().getFullYear()} AutoAfrique.</span>
              <span>{L('Service client : horaires à confirmer avant la mise en production', 'Customer service: hours to be confirmed before launch')}</span>
            </div>
            <select className="bg-white/10 border border-white/15 rounded-xl px-4 py-2 text-sm text-white/85 focus:outline-none font-medium">
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
}
