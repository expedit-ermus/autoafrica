'use client';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useApp } from '@/contexts/AppContext';
import CarSelector from '@/components/CarSelector';
import PromoBanner from '@/components/PromoBanner';
import PartsCatalog from '@/components/PartsCatalog';
import BrandGrid from '@/components/BrandGrid';

// Lazy-load heavy components below the fold to reduce initial bundle & improve LCP
const VtcCircuitCourtSection = dynamic(() => import('@/components/VtcCircuitCourtSection'), { ssr: true });
const DiagnosticEstimator = dynamic(() => import('@/components/DiagnosticEstimator'), { ssr: true });
const AbidjanDeliveryZones = dynamic(() => import('@/components/AbidjanDeliveryZones'), { ssr: true });

const trustFeatures = [
  {
    icon: '⚡',
    gradient: 'from-orange-500 to-amber-500',
    title: { fr: 'Livraison Express 24h', en: '24h Express Delivery' },
    desc: { fr: 'Par coursier moto à Abidjan & gares vers l\'intérieur', en: 'By courier in Abidjan & bus stations to regions' },
    href: '/livraison',
  },
  {
    icon: '📱',
    gradient: 'from-blue-600 to-cyan-500',
    title: { fr: 'Séquestre Mobile Money', en: 'Mobile Money Escrow' },
    desc: { fr: 'Wave, Orange Money, MTN MoMo, Moov, Djamo & CB', en: 'Wave, Orange Money, MTN MoMo, Moov, Djamo & Cards' },
    href: '/paiement',
  },
  {
    icon: '🛡️',
    gradient: 'from-emerald-500 to-teal-500',
    title: { fr: 'Garantie Conformité 48h', en: '48h Fit Guarantee' },
    desc: { fr: 'Testez avec votre mécanicien, satisfait ou remboursé', en: 'Test with your mechanic, satisfaction or refund' },
    href: '/retours',
  },
  {
    icon: '👨‍🔧',
    gradient: 'from-violet-600 to-indigo-500',
    title: { fr: 'Support Expert Abidjan', en: 'Abidjan Expert Support' },
    desc: { fr: 'Assistance WhatsApp 6j/7 pour trouver les pièces rares', en: 'WhatsApp help 6d/7 to find rare parts' },
    href: '/contact',
  },
];

export default function LandingPage() {
  const { locale } = useApp();
  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <div className="overflow-x-hidden bg-[#080C14] text-slate-100">
      {/* ── Modern 10K Luxury Hero Section ── */}
      <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 bg-radial from-[#1A1F2C] via-[#0B0F19] to-[#080C14] border-b border-white/10 overflow-hidden">
        {/* Ambient Glow Orbs with Parallax */}
        <div className="parallax-glow absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-r from-orange-500/20 via-amber-500/15 to-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="parallax-glow-fast absolute top-1/3 right-10 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Ambient Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 font-extrabold text-xs uppercase tracking-widest mb-6 shadow-lg shadow-orange-500/10 backdrop-blur-md">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-ping shrink-0" />
              <span>⚡</span> {L('Marketplace N°1 Pièces Auto & Garages à Abidjan', 'Top Auto Parts & Garage Marketplace in Abidjan')}
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-6 font-heading">
              {locale === 'fr' ? (
                <>
                  Trouvez vos pièces auto <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent drop-shadow-sm">neuves & d'occasion contrôlée</span> à Abidjan
                </>
              ) : (
                <>
                  Find new & certified used <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent drop-shadow-sm">auto parts</span> in Abidjan
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
              {L(
                'Prix fixes transparents, garantie 48h, paiement Mobile Money sécurisé et livraison express en 24h par moto dans toutes les communes.',
                'Transparent fixed prices, 48h warranty, secure Mobile Money payment, and express 24h motorcycle delivery across all communes.'
              )}
            </p>

            {/* Quick Metrics Bar */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-bold text-slate-300">
              <Link href="/catalogue" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-500/40 px-4 py-2 rounded-2xl backdrop-blur-md transition-all">
                <span className="text-orange-400 text-base">📦</span>
                <span>+15 000 pièces certifiées</span>
              </Link>
              <Link href="/retours" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/40 px-4 py-2 rounded-2xl backdrop-blur-md transition-all">
                <span className="text-emerald-400 text-base">🛡️</span>
                <span>99.4% compatibilité garantie</span>
              </Link>
              <Link href="/livraison" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/40 px-4 py-2 rounded-2xl backdrop-blur-md transition-all">
                <span className="text-cyan-400 text-base">⚡</span>
                <span>Livraison 24h Abidjan</span>
              </Link>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-3 min-w-0 order-first">
              <PromoBanner />
            </div>
            <div className="lg:col-span-2 min-w-0">
              <CarSelector />
            </div>
          </div>
        </div>
      </section>

      {/* ── Modern 10K Trust Badges Strip ── */}
      <section className="parallax-reveal py-10 sm:py-12 bg-[#0C121E] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {trustFeatures.map((feat, i) => (
              <Link
                key={i}
                href={feat.href}
                className="flex items-center gap-4 p-5 rounded-3xl bg-slate-900/60 hover:bg-slate-800/90 transition-all duration-300 border border-white/10 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10 group cursor-pointer"
              >
                <div className={`shrink-0 w-13 h-13 rounded-2xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                  {feat.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-sm sm:text-base font-extrabold text-white leading-tight font-heading group-hover:text-orange-400 transition-colors flex items-center gap-1.5">
                    <span>{feat.title[locale as 'fr' | 'en']}</span>
                    <span className="text-xs text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">→</span>
                  </div>
                  <div className="text-xs text-slate-400 font-medium mt-1 leading-snug">
                    {feat.desc[locale as 'fr' | 'en']}
                  </div>
                </div>
              </Link>
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
            <div className="group bg-gradient-to-br from-slate-50 to-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden mb-5 bg-slate-100">
                <Image
                  src="/images/pieces-neuves-oem.jpg"
                  alt={L('Pièces neuves d\'origine et adaptables', 'New OEM & aftermarket parts')}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute top-3 left-3 px-3 py-1 bg-blue-600/90 backdrop-blur-md text-white font-extrabold text-xs rounded-full shadow-lg">
                  ✨ {L('100% Neuves d\'Origine', '100% Brand New OEM')}
                </div>
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

            <div className="group bg-gradient-to-br from-amber-50/40 to-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden mb-5 bg-amber-50">
                <Image
                  src="/images/pieces-occasion-controlee.jpg"
                  alt={L('Pièces d\'occasion contrôlée (Venantes)', 'Certified used parts (Venantes)')}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute top-3 left-3 px-3 py-1 bg-amber-600/90 backdrop-blur-md text-white font-extrabold text-xs rounded-full shadow-lg">
                  🔧 {L('Contrôlées & Certifiées', 'Inspected & Certified')}
                </div>
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
            <dl className="space-y-6">
              <div className="border-b border-slate-100 pb-5">
                <dt className="font-extrabold text-slate-900 mb-2 text-base">
                  {L('Comment savoir si une pièce auto est compatible avec mon véhicule ?', 'How do I know if an auto part fits my vehicle?')}
                </dt>
                <dd className="text-sm md:text-base text-slate-600 leading-relaxed">
                  {L(
                    'Utilisez la recherche par numéro d\'immatriculation ou sélectionnez la marque et le modèle de votre véhicule : nous ne proposons que des pièces référencées pour votre voiture.',
                    'Use the licence plate search or select your vehicle\'s brand and model: we only list parts referenced for your car.'
                  )}
                </dd>
              </div>
              <div className="border-b border-slate-100 pb-5">
                <dt className="font-extrabold text-slate-900 mb-2 text-base">
                  {L('Quelle est la différence entre pièce d\'origine, pièce neuve et pièce d\'occasion contrôlée ?', 'What is the difference between an OEM part, a new part and a certified used part?')}
                </dt>
                <dd className="text-sm md:text-base text-slate-600 leading-relaxed">
                  {L(
                    'La pièce d\'origine est fabriquée par le constructeur. La pièce neuve est une pièce de remplacement neuve, garantie. L\'occasion contrôlée est une pièce de récupération inspectée et testée par AutoAfrique, avec sa propre garantie de 48h.',
                    'An OEM part is made by the manufacturer. A new part is a new replacement part, under warranty. A certified used part is a recovery part inspected and tested by AutoAfrique, with its own 48h warranty.'
                  )}
                </dd>
              </div>
              <div>
                <dt className="font-extrabold text-slate-900 mb-2 text-base">
                  {L('Comment payer mes pièces auto sur AutoAfrique ?', 'How do I pay for my auto parts on AutoAfrique?')}
                </dt>
                <dd className="text-sm md:text-base text-slate-600 leading-relaxed">
                  {L(
                    'Le paiement se fait par Mobile Money (Wave, Djamo, Orange Money, MTN MoMo, Moov Money), directement et en toute sécurité grâce au compte séquestre qui protège vos fonds jusqu\'à la validation du montage.',
                    'Payment is made by Mobile Money (Wave, Djamo, Orange Money, MTN MoMo, Moov Money), directly and securely through an escrow account that protects your funds until parts are tested.'
                  )}
                </dd>
              </div>
            </dl>
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
