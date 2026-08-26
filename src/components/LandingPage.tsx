'use client';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';
import CarSelector from '@/components/CarSelector';
import PromoBanner from '@/components/PromoBanner';
import PartsCatalog from '@/components/PartsCatalog';
import { RepairEstimator } from '@/components/RepairEstimator';
import BrandGrid from '@/components/BrandGrid';
import Bestsellers from '@/components/Bestsellers';
import VtcCircuitCourtSection from '@/components/VtcCircuitCourtSection';
import DiagnosticEstimator from '@/components/DiagnosticEstimator';
import AbidjanDeliveryZones from '@/components/AbidjanDeliveryZones';

const trustFeatures = [
  {
    icon: '⚡',
    gradient: 'from-orange-500 to-amber-500',
    title: { fr: 'Livraison Express 24h', en: '24h Express Delivery' },
    desc: { fr: 'Par coursier moto à Abidjan & gares vers l\'intérieur', en: 'By courier in Abidjan & bus stations to regions' },
  },
  {
    icon: '📱',
    gradient: 'from-blue-600 to-cyan-500',
    title: { fr: 'Séquestre Mobile Money', en: 'Mobile Money Escrow' },
    desc: { fr: 'Wave, Orange Money, MTN MoMo, Moov, Djamo & CB', en: 'Wave, Orange Money, MTN MoMo, Moov, Djamo & Cards' },
  },
  {
    icon: '🛡️',
    gradient: 'from-emerald-500 to-teal-500',
    title: { fr: 'Garantie Conformité 48h', en: '48h Fit Guarantee' },
    desc: { fr: 'Testez avec votre mécanicien, satisfait ou remboursé', en: 'Test with your mechanic, satisfaction or refund' },
  },
  {
    icon: '👨‍🔧',
    gradient: 'from-violet-600 to-indigo-500',
    title: { fr: 'Support Expert Abidjan', en: 'Abidjan Expert Support' },
    desc: { fr: 'Assistance WhatsApp 6j/7 pour trouver les pièces rares', en: 'WhatsApp help 6d/7 to find rare parts' },
  },
];

export default function LandingPage() {
  const { locale } = useApp();
  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <div className="overflow-x-hidden bg-[#F8FAFC]">
      {/* ── Modern Hero Section ── */}
      <section className="relative py-8 sm:py-12 bg-gradient-to-b from-white via-slate-50 to-[#F8FAFC] border-b border-slate-200/70 overflow-hidden">
        {/* Subtle Ambient Mesh Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 text-orange-700 font-extrabold text-xs uppercase tracking-wider mb-4 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping shrink-0" />
              <span>⚡</span> {L('Marketplace N°1 Pièces Auto & Garages à Abidjan', 'Top Auto Parts & Garage Marketplace in Abidjan')}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-4">
              {L(
                'Trouvez vos pièces auto neuves & d\'occasion contrôlée à Abidjan',
                'Find new and certified used auto parts in Abidjan'
              )}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {L(
                'Prix fixes transparents, garantie 48h, paiement Mobile Money sécurisé et livraison express en 24h par moto dans toutes les communes.',
                'Transparent fixed prices, 48h warranty, secure Mobile Money payment, and express 24h motorcycle delivery across all communes.'
              )}
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-6 items-start">
            <div className="lg:col-span-3 min-w-0 order-first">
              <PromoBanner />
            </div>
            <div className="lg:col-span-2 min-w-0">
              <CarSelector />
            </div>
          </div>
        </div>
      </section>

      {/* ── Modern Trust Badges Strip ── */}
      <section className="py-6 sm:py-8 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {trustFeatures.map((feat, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-slate-50/80 hover:bg-white hover:shadow-lg hover:shadow-slate-200/60 transition-all duration-300 border border-slate-200/70"
              >
                <div className={`shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center text-white text-xl shadow-md`}>
                  {feat.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
                    {feat.title[locale as 'fr' | 'en']}
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-1 leading-snug">
                    {feat.desc[locale as 'fr' | 'en']}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PartsCatalog />

      <BrandGrid />

      <VtcCircuitCourtSection />

      <DiagnosticEstimator />

      {/* ── Neuf vs Occasion ── */}
      <section className="py-12 md:py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              {L('Transparence & Qualité', 'Transparency & Quality')}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mt-3 mb-3 tracking-tight">
              {L('Neuf ou occasion contrôlée : à vous de choisir', 'New or certified used: you choose')}
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              {L('Toutes nos pièces répondent à un cahier des charges strict pour éviter les mauvaises surprises.', 'All parts meet strict specifications to prevent bad surprises.')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-bold mb-4">
                ✨
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                {L('Pièces neuves d\'origine & adaptables', 'New OEM & aftermarket parts')}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {L(
                  'Une pièce neuve sort directement d\'usine et n\'a jamais été montée. Idéale pour les composants d\'usure critique (freinage, distribution, filtration) avec garantie constructeur.',
                  'A new part comes straight from the factory and has never been fitted. Ideal for critical wear components (brakes, timing, filtration) with manufacturer warranty.'
                )}
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg">
                <span>🛡️</span> {L('Garantie Constructeur + AutoAfrique', 'Manufacturer + AutoAfrique Warranty')}
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50/40 to-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl font-bold mb-4">
                🔧
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                {L('Pièces d\'occasion contrôlée (Venantes)', 'Certified used parts (Venantes)')}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {L(
                  'Chaque pièce de réemploi est inspectée, nettoyée et testée par nos techniciens avant validation. Un choix jusqu\'à 70% moins cher, parfait pour les moteurs, boîtes et carrosseries Toyota, Peugeot, Hyundai.',
                  'Each reused part is inspected, cleaned, and tested by our technicians before validation. Up to 70% cheaper, ideal for engines, gearboxes, and bodywork.'
                )}
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-100/80 px-3 py-1 rounded-lg">
                <span>🛡️</span> {L('Garantie 48h Satisfait ou Remboursé', '48h Fit Guarantee or Refund')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Casse Auto vs AutoAfrique ── */}
      <section className="py-12 md:py-16 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl shadow-slate-900/5">
            <div className="flex items-center gap-3 mb-4">
              <span className="p-3 bg-orange-100 text-orange-600 rounded-2xl text-2xl">⚖️</span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {L('Une alternative moderne et sécurisée à la casse auto', 'A modern and secure alternative to scrapyards')}
                </h2>
                <p className="text-xs text-slate-500 font-semibold">
                  {L('Fini les arnaques et les déplacements interminables à la ferraille', 'No more scams and endless trips to scrapyards')}
                </p>
              </div>
            </div>

            <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-4 pt-2">
              <p>
                {L(
                  'Récupérer des pièces dans une casse auto à Abidjan (Adjamé, N\'Dotré, Koumassi) est souvent une corvée : prix à la tête du client, absence de garantie et risque élevé d\'incompatibilité.',
                  'Finding parts in an Abidjan scrapyard is often a hassle: arbitrary pricing, no warranty, and high risk of incompatibility.'
                )}
              </p>
              <p>
                {L(
                  'AutoAfrique standardise le marché : chaque pièce d\'occasion contrôlée dispose d\'un prix fixe affiché, d\'une facture conforme et d\'un séquestre Mobile Money. Votre argent reste bloqué tant que vous n\'avez pas reçu et validé la pièce avec votre mécanicien.',
                  'AutoAfrique standardizes the market: every certified part features a transparent fixed price, an official invoice, and Mobile Money escrow.'
                )}
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href="/blog/casse-auto-vs-autoafrique"
                className="text-orange-600 font-extrabold hover:text-orange-700 text-sm flex items-center gap-1.5"
              >
                {L('Lire le comparatif complet Casse vs AutoAfrique →', 'Read the full Scrapyard vs AutoAfrique guide →')}
              </Link>
              <Link
                href="/catalogue"
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                {L('Commander une pièce contrôlée', 'Order a tested part')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Link to full Estimateur de Devis */}
      <section className="py-10 bg-slate-900 border-t border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-3">
            {L('💡 Besoin d\'une estimation précise de réparation ?', '💡 Need a detailed repair estimate?')}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mb-6">
            {L('Utilisez notre estimateur complet de pannes et pièces (Venantes ou Neuves) avec main d\'œuvre garagiste.', 'Use our complete breakdown & parts estimator (Used or New) with mechanic labor costs.')}
          </p>
          <Link
            href="/estimation-devis"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-950/40 text-base"
          >
            {L('Calculer mon devis complet →', 'Calculate full estimate →')}
          </Link>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200 shadow-xl shadow-slate-900/5">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 mb-6">
              {L('Questions fréquentes', 'Frequently asked questions')}
            </h2>
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-extrabold text-slate-900 mb-2 text-base">
                  {L('Comment savoir si une pièce auto est compatible avec mon véhicule ?', 'How do I know if an auto part fits my vehicle?')}
                </h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                  {L(
                    'Utilisez la recherche par numéro d\'immatriculation ou sélectionnez la marque et le modèle de votre véhicule : nous ne proposons que des pièces référencées pour votre voiture.',
                    'Use the licence plate search or select your vehicle\'s brand and model: we only list parts referenced for your car.'
                  )}
                </p>
              </div>
              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-extrabold text-slate-900 mb-2 text-base">
                  {L('Quelle est la différence entre pièce d\'origine, pièce neuve et pièce d\'occasion contrôlée ?', 'What is the difference between an OEM part, a new part and a certified used part?')}
                </h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                  {L(
                    'La pièce d\'origine est fabriquée par le constructeur. La pièce neuve est une pièce de remplacement neuve, garantie. L\'occasion contrôlée est une pièce de récupération inspectée et testée par AutoAfrique, avec sa propre garantie de 48h.',
                    'An OEM part is made by the manufacturer. A new part is a new replacement part, under warranty. A certified used part is a recovery part inspected and tested by AutoAfrique, with its own 48h warranty.'
                  )}
                </p>
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 mb-2 text-base">
                  {L('Comment payer mes pièces auto sur AutoAfrique ?', 'How do I pay for my auto parts on AutoAfrique?')}
                </h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                  {L(
                    'Le paiement se fait par Mobile Money (Wave, Djamo, Orange Money, MTN MoMo, Moov Money), directement et en toute sécurité grâce au compte séquestre qui protège vos fonds jusqu\'à la validation du montage.',
                    'Payment is made by Mobile Money (Wave, Djamo, Orange Money, MTN MoMo, Moov Money), directly and securely through an escrow account that protects your funds until parts are tested.'
                  )}
                </p>
              </div>
            </div>
            <p className="mt-8 pt-6 border-t border-slate-100 text-sm md:text-base text-slate-500">
              {L(
                'Encore une question ? Parcourez le',
                'Still have a question? Browse the'
              )}{' '}
              <Link href="/catalogue" className="font-extrabold text-orange-600 hover:underline">
                {L('catalogue de pièces', 'parts catalogue')}
              </Link>
              {L(' ou recherchez une pièce compatible avec votre véhicule en ligne.', ' or search for a compatible part for your vehicle online.')}
            </p>
          </div>
        </div>
      </section>

      {/* ── Section Communes & Délais Abidjan ── */}
      <AbidjanDeliveryZones />

      <section className="py-14 bg-white border-y border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50/80 rounded-3xl p-8 md:p-10 border border-slate-200 shadow-md">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-4">
              {L('AutoAfrique — La marketplace des pièces automobiles en Afrique de l\'Ouest', 'AutoAfrique — The auto parts marketplace in West Africa')}
            </h2>
            <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-4">
              <p>
                {L(
                  'AutoAfrique est la première plateforme e-commerce dédiée aux pièces détachées automobiles certifiées en Afrique de l\'Ouest. Elle connecte les vendeurs vérifiés, les casses auto de réemploi et les automobilistes pour les marques Toyota, Hyundai, Kia, Peugeot, Mercedes, Nissan, Suzuki et Renault, dans 10 pays ouest-africains.',
                  'AutoAfrique is the premier e-commerce platform dedicated to certified auto parts in West Africa. It connects verified sellers, reuse scrapyards, and car owners for Toyota, Hyundai, Kia, Peugeot, Mercedes, Nissan, Suzuki, and Renault across 10 West African countries.'
                )}
              </p>
              <p>
                {L(
                  'Que vous soyez garagiste, gestionnaire de flotte VTC ou particulier, trouvez les pièces neuves ou d\'occasion dont vous avez besoin à prix transparents avec séquestre Mobile Money (Wave, Djamo, Orange Money, MTN MoMo, Moov). Livraison express moto en 1h-4h à Abidjan et expédition en 24h-48h par gare routière vers l\'intérieur.',
                  'Whether you are a mechanic, fleet manager, or individual, find genuine or tested used parts at transparent prices with Mobile Money escrow. Express motorcycle delivery in 1h-4h across Abidjan.'
                )}
              </p>
              <Link href="/a-propos" className="inline-flex items-center gap-1.5 text-orange-600 font-extrabold text-sm sm:text-base hover:underline transition-colors">
                {L('En savoir plus sur notre mission', 'Learn more about our mission')} <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section CTA Final (Devenir Vendeur) */}
      <section className="py-16 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-black uppercase tracking-wider bg-orange-500/20 text-orange-400 px-3.5 py-1.5 rounded-full border border-orange-500/30">
            {L('Espace Vendeurs & Garagistes', 'Sellers & Mechanics Space')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black mt-4 mb-4 text-white tracking-tight">
            {L('Vous êtes garagiste ou vendeur de pièces ?', 'Are you a mechanic or parts seller?')}
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            {L(
              'Digitalisez votre magasin de pièces neuves ou d\'occasion contrôlée à Abidjan et en Afrique de l\'Ouest. Recevez vos commandes avec séquestre Mobile Money garanti.',
              'Digitize your new or certified used parts shop in Abidjan and West Africa. Receive orders with guaranteed Mobile Money escrow.'
            )}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/devenir-vendeur"
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black rounded-2xl shadow-xl shadow-orange-950/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {L('Devenir Vendeur Partenaire', 'Become a Partner Seller')}
            </Link>
            <Link
              href="/tarifs"
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl border border-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {L('Découvrir les Tarifs & Formules SaaS', 'Discover SaaS Plans & Pricing')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
