'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/contexts/ToastContext';
import { PaymentLogo } from '@/components/PaymentLogos';

export default function Footer() {
  const { locale } = useApp();
  const { addToast } = useToast();
  const router = useRouter();
  const [nlEmail, setNlEmail] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('ci');
  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const handleCountryChange = (code: string) => {
    setSelectedCountry(code);
    addToast('info', `Marché changé : ${countries.find(c => c.code === code)?.name || code}`);
    router.push(`/dashboard/marketplace?country=${code.toUpperCase()}`);
  };

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
    <footer className="bg-slate-950 text-white border-t border-slate-800/80">
      {/* ── Value Proposition Top Banner ── */}
      <div className="bg-slate-900 py-10 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <h3 className="text-white font-black text-xl sm:text-2xl mb-2 tracking-tight">
                {L('Réparer sa voiture n\'a jamais été aussi simple', 'Fixing your car has never been easier')}
              </h3>
              <p className="text-slate-400 text-sm sm:text-base font-medium">{L('Rejoignez le 1er réseau de pièces auto garanties & garagistes en Côte d\'Ivoire', 'Join the #1 guaranteed auto parts and mechanics network in Ivory Coast')}</p>
            </div>
            <div className="text-center md:text-right">
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-white">Auto<span className="text-orange-500">Afrique</span></div>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 font-semibold uppercase tracking-widest">{L('La marketplace des pièces auto en Afrique de l\'Ouest', 'The West African auto parts marketplace')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5-Column Navigation Grid ── */}
      <div className="py-14 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div>
              <h4 className="text-white font-black mb-5 text-xs uppercase tracking-widest text-orange-400">{L('À PROPOS D\'AUTOAFRIQUE', 'ABOUT AUTOAFRIQUE')}</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link href="/a-propos" className="hover:text-orange-400 transition-colors font-medium">{L('Qui sommes-nous ?', 'About us?')}</Link></li>
                <li><Link href="/tarifs" className="hover:text-orange-400 transition-colors font-medium">{L('Tarifs & Abonnements SaaS', 'Pricing & Subscriptions')}</Link></li>
                <li><Link href="/catalogue" className="hover:text-orange-400 transition-colors font-medium">{L('Catalogue de pièces', 'Parts Catalogue')}</Link></li>
                <li><Link href="/devenir-vendeur" className="hover:text-orange-400 transition-colors font-medium">{L('Devenir Vendeur', 'Become a Seller')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black mb-5 text-xs uppercase tracking-widest text-orange-400">{L('AIDE ET GUIDES', 'HELP & GUIDES')}</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link href="/blog" className="hover:text-orange-400 transition-colors font-medium">{L('Blog & Guides Auto', 'Blog & Auto Guides')}</Link></li>
                <li><Link href="/manuels-reparation" className="hover:text-orange-400 transition-colors font-medium">{L('Manuels de réparation', 'Repair manuals')}</Link></li>
                <li><Link href="/estimation-devis" className="hover:text-orange-400 transition-colors font-medium">{L('Estimateur de Devis', 'Quote Estimator')}</Link></li>
                <li><a href="/downloads/autoafrique-extension.zip" download className="hover:text-orange-400 transition-colors font-medium flex items-center gap-1.5 text-orange-400 font-bold"><span>🧩</span> {L('Extension Chrome Vendeur', 'Chrome Extension')}</a></li>
                <li><Link href="/conditions-generales" className="hover:text-orange-400 transition-colors font-medium">{L('Conditions générales', 'Terms & Conditions')}</Link></li>
                <li><Link href="/politique-de-confidentialite" className="hover:text-orange-400 transition-colors font-medium">{L('Confidentialité', 'Privacy Policy')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black mb-5 text-xs uppercase tracking-widest text-orange-400">{L('SERVICE CLIENTS', 'CUSTOMER SERVICE')}</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link href="/aide" className="hover:text-orange-400 transition-colors font-medium">{L('Centre d\'aide', 'Help center')}</Link></li>
                <li><Link href="/paiement" className="hover:text-orange-400 transition-colors font-medium">{L('Paiement Mobile Money', 'Mobile Money Payment')}</Link></li>
                <li><Link href="/livraison" className="hover:text-orange-400 transition-colors font-medium">{L('Livraison 24h & Gares', '24h Delivery & Stations')}</Link></li>
                <li><Link href="/retours" className="hover:text-orange-400 transition-colors font-medium">{L('Garantie & Retours 48h', '48h Returns & Warranty')}</Link></li>
                <li><Link href="/contact" className="hover:text-orange-400 transition-colors font-medium">{L('Contactez-nous', 'Contact us')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black mb-5 text-xs uppercase tracking-widest text-orange-400">{L('CATÉGORIES DE PIÈCES', 'PARTS CATEGORIES')}</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link href="/categories/moteur" className="hover:text-orange-400 transition-colors font-medium">{L('Moteur', 'Engine')}</Link></li>
                <li><Link href="/categories/frein" className="hover:text-orange-400 transition-colors font-medium">{L('Freinage', 'Brakes')}</Link></li>
                <li><Link href="/categories/filtre" className="hover:text-orange-400 transition-colors font-medium">{L('Filtres', 'Filters')}</Link></li>
                <li><Link href="/categories/suspension" className="hover:text-orange-400 transition-colors font-medium">{L('Suspension & Direction', 'Suspension & Steering')}</Link></li>
                <li><Link href="/categories/pneus-jantes" className="hover:text-orange-400 transition-colors font-medium">{L('Pneus & Jantes', 'Tyres & Rims')}</Link></li>
                <li><Link href="/categories/huiles-fluides" className="hover:text-orange-400 transition-colors font-medium">{L('Huiles & Fluides', 'Oils & Fluids')}</Link></li>
                <li><Link href="/categories/electricite" className="hover:text-orange-400 transition-colors font-medium">{L('Électricité', 'Electricity')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black mb-5 text-xs uppercase tracking-widest text-orange-400">{L('MARQUES VÉHICULES', 'CAR BRANDS')}</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link href="/marques/toyota" className="hover:text-orange-400 transition-colors font-medium">Pièces Toyota</Link></li>
                <li><Link href="/marques/hyundai" className="hover:text-orange-400 transition-colors font-medium">Pièces Hyundai</Link></li>
                <li><Link href="/marques/peugeot" className="hover:text-orange-400 transition-colors font-medium">Pièces Peugeot</Link></li>
                <li><Link href="/marques/suzuki" className="hover:text-orange-400 transition-colors font-medium">Pièces Suzuki</Link></li>
                <li><Link href="/marques/nissan" className="hover:text-orange-400 transition-colors font-medium">Pièces Nissan</Link></li>
                <li><Link href="/marques/renault" className="hover:text-orange-400 transition-colors font-medium">Pièces Renault</Link></li>
                <li><Link href="/marques/mercedes-benz" className="hover:text-orange-400 transition-colors font-medium">Pièces Mercedes-Benz</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── Newsletter & Payment Methods ── */}
      <div className="bg-slate-900/90 py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-white font-black mb-3 text-base">
                {L('Abonnez-vous pour suivre l\'actualité AutoAfrique', 'Subscribe to follow AutoAfrique news')}
              </h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={nlEmail}
                  onChange={(e) => setNlEmail(e.target.value)}
                  placeholder={L('Votre adresse email', 'Your email address')}
                  className="flex-1 min-w-0 px-5 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-orange-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (nlEmail.includes('@')) {
                      addToast('success', L('Merci ! Vous êtes inscrit à la newsletter AutoAfrique.', 'Thanks! You are subscribed to AutoAfrique newsletter.'));
                      setNlEmail('');
                    } else {
                      addToast('error', L('Veuillez entrer une adresse email valide.', 'Please enter a valid email address.'));
                    }
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black rounded-2xl transition-all text-sm shadow-lg shadow-orange-950/30 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  {L('S\'abonner', 'Subscribe')}
                </button>
              </div>
              <p className="text-slate-400 text-xs mt-2">
                {L('En vous abonnant, vous acceptez notre politique de confidentialité.', 'By subscribing, you agree to our privacy policy.')}
              </p>
            </div>

            <div>
              <h4 className="text-white font-black mb-3 text-xs uppercase tracking-wider text-slate-400">
                {L('Paiements 100% sécurisés sous séquestre', '100% Secure Escrow Payments')}
              </h4>
              <div className="flex flex-wrap gap-2.5 mb-5">
                {[
                  { name: 'Wave', key: 'wave' },
                  { name: 'Djamo', key: 'djamo' },
                  { name: 'Orange Money', key: 'orange' },
                  { name: 'MTN MoMo', key: 'mtn' },
                  { name: 'Moov Money', key: 'moov' },
                  { name: 'Visa / MC', key: 'visa' },
                ].map((p) => (
                  <Link
                    key={p.name}
                    href="/paiement"
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 rounded-xl text-xs text-white font-bold border border-slate-700/80 transition-all cursor-pointer hover:scale-105"
                  >
                    <PaymentLogo name={p.key} size={20} />
                    {p.name}
                  </Link>
                ))}
              </div>
              <h4 className="text-white font-black mb-2 text-xs uppercase tracking-wider text-slate-400">
                {L('Modes d\'expédition', 'Shipping options')}
              </h4>
              <div className="flex flex-wrap gap-2.5">
                <Link
                  href="/livraison"
                  className="px-3.5 py-1.5 bg-slate-800/80 hover:bg-slate-800 rounded-xl text-xs text-slate-200 font-semibold border border-slate-700/80 transition-all hover:scale-105"
                >
                  ⚡ {L('Moto Express Abidjan (1h - 4h)', 'Express Motorbike Abidjan (1h - 4h)')}
                </Link>
                <Link
                  href="/livraison"
                  className="px-3.5 py-1.5 bg-slate-800/80 hover:bg-slate-800 rounded-xl text-xs text-slate-200 font-semibold border border-slate-700/80 transition-all hover:scale-105"
                >
                  🚌 {L('Gares Routières UTB / STIF (Intérieur CI)', 'Bus Stations (National)')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sub-Footer Bar ── */}
      <div className="bg-slate-950 border-t border-slate-800/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs text-slate-400 text-center sm:text-left">
              <span>© {new Date().getFullYear()} AutoAfrique. Tous droits réservés.</span>
              <span className="hidden sm:inline text-slate-700">|</span>
              <span className="font-bold text-emerald-400">
                {L('Support client Abidjan : Lun-Sam 08h00 - 19h00 (GMT)', 'Customer service: Mon-Sat 08:00 - 19:00 (GMT)')}
              </span>
            </div>
            
            {/* Sélecteur de Pays */}
            <select
              aria-label={L('Sélectionner le pays', 'Select country')}
              value={selectedCountry}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="bg-slate-900 text-white border border-slate-700 rounded-xl px-4 py-2 text-xs focus:outline-none font-bold cursor-pointer hover:bg-slate-850 transition-colors"
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code} className="bg-slate-900 text-white py-1">
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
