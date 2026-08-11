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

const trustFeatures = [
  {
    icon: (
      <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    title: { fr: 'Livraison rapide', en: 'Fast delivery' },
    desc: { fr: '24-72h en Afrique de l\'Ouest', en: '24-72h in West Africa' },
  },
  {
    icon: (
      <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: { fr: 'Paiement sécurisé', en: 'Secure payment' },
    desc: { fr: 'Wave, Djamo, Orange Money, MTN MoMo et Moov Money', en: 'Wave, Djamo, Orange Money, MTN MoMo and Moov Money' },
  },
  {
    icon: (
      <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: { fr: 'Retour 30 jours', en: '30-day return' },
    desc: { fr: 'Satisfait ou remboursé', en: 'Satisfaction guaranteed' },
  },
  {
    icon: (
      <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: { fr: 'Support client', en: 'Customer support' },
    desc: { fr: 'Horaires de contact à confirmer avant la mise en production', en: 'Contact hours to be confirmed before launch' },
  },
];

export default function LandingPage() {
  const { locale } = useApp();
  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <div className="overflow-x-hidden bg-[var(--color-bg)]">
      <section className="bg-gradient-to-b from-[var(--color-bg-warm)] to-[var(--color-bg)] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--color-warm-ink)] text-center mb-8">
            {L('Pièces détachées auto neuves et occasion à Abidjan — AutoAfrique', 'New and used auto parts in Abidjan — AutoAfrique')}
          </h1>
          <div className="grid lg:grid-cols-5 gap-5">
            <div className="lg:col-span-3 min-w-0 order-first">
              <PromoBanner />
            </div>
            <div className="lg:col-span-2 min-w-0">
              <CarSelector />
            </div>
          </div>
        </div>
      </section>

      <PartsCatalog />

      <BrandGrid />

      <section className="py-8 bg-white border-y border-[var(--color-warm-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {trustFeatures.map((feat, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl hover:bg-[var(--color-bg-warm)] transition-colors border border-[var(--color-warm-border)]/50">
                <div className="shrink-0 w-11 h-11 bg-[var(--color-bg-warm)] rounded-xl flex items-center justify-center">
                  {feat.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-[var(--color-warm-ink)] leading-tight">
                    {feat.title[locale as 'fr' | 'en']}
                  </div>
                  <div className="text-xs text-[var(--color-warm-muted-strong)] font-medium mt-0.5 leading-snug">
                    {feat.desc[locale as 'fr' | 'en']}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Bestsellers />

      <VtcCircuitCourtSection />

      <DiagnosticEstimator />

      <section className="py-8 md:py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--color-warm-ink)] mb-8 text-center">
            {L('Neuf ou occasion, à vous de choisir', 'New or used, you choose')}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[var(--color-bg-warm)] rounded-3xl p-8 border border-[var(--color-warm-border)]">
              <h3 className="text-lg font-extrabold text-[var(--color-warm-ink)] mb-3">
                {L('Pièces neuves', 'New parts')}
              </h3>
              <p className="text-sm md:text-base text-[var(--color-warm-faint)] leading-relaxed">
                {L(
                  'Une pièce neuve sort directement d\'usine et n\'a jamais été montée. Elle convient aux automobilistes et garagistes qui privilégient la durée de vie, avec la garantie AutoAfrique incluse.',
                  'A new part comes straight from the factory and has never been fitted. It suits car owners and mechanics who value lifespan, with the AutoAfrique warranty included.'
                )}
              </p>
            </div>
            <div className="bg-[var(--color-bg-warm)] rounded-3xl p-8 border border-[var(--color-warm-border)]">
              <h3 className="text-lg font-extrabold text-[var(--color-warm-ink)] mb-3">
                {L('Pièces d\'occasion contrôlée', 'Certified used parts')}
              </h3>
              <p className="text-sm md:text-base text-[var(--color-warm-faint)] leading-relaxed">
                {L(
                  'Chaque pièce d\'occasion est inspectée, testée et remise en état avant d\'être mise en ligne, avec sa propre garantie. Un choix économique et fiable, notamment pour les modèles Toyota, Peugeot et Renault en Afrique de l\'Ouest.',
                  'Every used part is inspected, tested and reconditioned before going online, with its own warranty. An affordable, reliable choice, especially for Toyota, Peugeot and Renault models in West Africa.'
                )}
              </p>
            </div>
          </div>
          <p className="mt-8 text-center text-sm md:text-base text-[var(--color-warm-faint)] leading-relaxed">
            {L(
              'Le prix affiché est toujours le prix final : pas de surprise au moment de payer. Règlement en Mobile Money (Wave, Djamo, Orange Money, MTN MoMo, Moov Money) et livraison en 24-72h.',
              'The displayed price is always the final price: no surprises at checkout. Pay by Mobile Money (Wave, Djamo, Orange Money, MTN MoMo, Moov Money) and get delivery in 24-72h.'
            )}
          </p>
        </div>
      </section>

      <section className="py-8 md:py-14 bg-[var(--color-bg)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-[var(--color-warm-border)] shadow-lg shadow-[var(--color-earth)]/5">
            <h2 className="text-xl md:text-2xl font-extrabold text-[var(--color-warm-ink)] mb-5">
              {L('Une alternative fiable à la casse auto', 'A reliable alternative to scrapyards')}
            </h2>
            <div className="text-base text-[var(--color-warm-faint)] leading-relaxed space-y-4">
              <p>
                {L(
                  'Récupérer des pièces dans une casse auto à Abidjan reste une pratique courante, mais les prix sont souvent négociables et la qualité variable. AutoAfrique propose une alternative plus simple : un prix fixe affiché, une pièce de récupération contrôlée ou neuve, et une garantie incluse.',
                  'Recovering parts from a scrapyard in Abidjan is still common, but prices are often negotiable and quality varies. AutoAfrique offers a simpler alternative: a fixed displayed price, a certified used or new part, and a warranty included.'
                )}
              </p>
              <p>
                {L(
                  'Que vous soyez un particulier qui cherche des pièces introuvables, un garage de débrouille qui veut s\'équiper pas cher ou un grossiste qui veut sécuriser son approvisionnement, vous gardez les mêmes prix bas qu\'au marché informel, avec en plus la traçabilité, le devis et le reçu. Trouvez votre garagiste de confiance à Abidjan ou devenez revendeur.',
                  'Whether you are a private driver looking for hard-to-find parts, a small shop that wants to stock up cheaply, or a wholesaler who wants to secure supply, you keep the same low prices as the informal market, plus traceability, a quote and a receipt. Find a trusted mechanic in Abidjan or become a reseller.'
                )}
              </p>
              <p>
                {L(
                  'Le devis de réparation est estimé en ligne et le paiement s\'effectue par Mobile Money. Bénéficiez d\'une pièce auto d\'occasion garantie, livrée en Afrique de l\'Ouest, à Abidjan comme à Dakar.',
                  'The repair quote is estimated online and payment is made by Mobile Money. Get a certified used auto part, delivered across West Africa, in Abidjan and Dakar alike.'
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Estimateur de Devis & Panne Express */}
      <section className="py-8 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RepairEstimator />
        </div>
      </section>

      <section className="py-8 md:py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-[var(--color-warm-border)] shadow-lg shadow-[var(--color-earth)]/5">
            <h2 className="text-xl md:text-2xl font-extrabold text-[var(--color-warm-ink)] mb-5">
              {L('Questions fréquentes', 'Frequently asked questions')}
            </h2>
            <div className="space-y-5">
              <div>
                <h3 className="font-bold text-[var(--color-warm-ink)] mb-1.5">
                  {L('Comment savoir si une pièce auto est compatible avec mon véhicule ?', 'How do I know if an auto part fits my vehicle?')}
                </h3>
                <p className="text-sm md:text-base text-[var(--color-warm-faint)] leading-relaxed">
                  {L(
                    'Utilisez la recherche par numéro d\'immatriculation ou sélectionnez la marque et le modèle de votre véhicule : nous ne proposons que des pièces référencées pour votre voiture.',
                    'Use the licence plate search or select your vehicle\'s brand and model: we only list parts referenced for your car.'
                  )}
                </p>
              </div>
              <div>
                <h3 className="font-bold text-[var(--color-warm-ink)] mb-1.5">
                  {L('Quelle est la différence entre pièce d\'origine, pièce neuve et pièce d\'occasion contrôlée ?', 'What is the difference between an OEM part, a new part and a certified used part?')}
                </h3>
                <p className="text-sm md:text-base text-[var(--color-warm-faint)] leading-relaxed">
                  {L(
                    'La pièce d\'origine est fabriquée par le constructeur. La pièce neuve est une pièce de remplacement neuve, garantie. L\'occasion contrôlée est une pièce de récupération inspectée et testée par AutoAfrique, avec sa propre garantie.',
                    'An OEM part is made by the manufacturer. A new part is a new replacement part, under warranty. A certified used part is a recovery part inspected and tested by AutoAfrique, with its own warranty.'
                  )}
                </p>
              </div>
              <div>
                <h3 className="font-bold text-[var(--color-warm-ink)] mb-1.5">
                  {L('Comment payer mes pièces auto sur AutoAfrique ?', 'How do I pay for my auto parts on AutoAfrique?')}
                </h3>
                <p className="text-sm md:text-base text-[var(--color-warm-faint)] leading-relaxed">
                  {L(
                    'Le paiement se fait par Mobile Money (Orange Money, MTN MoMo, Moov Money, Wave), directement et en toute sécurité, avec un reçu conservé dans votre compte.',
                    'Payment is made by Mobile Money (Orange Money, MTN MoMo, Moov Money, Wave), directly and securely, with a receipt kept in your account.'
                  )}
                </p>
              </div>
            </div>
            <p className="mt-8 text-sm md:text-base text-[var(--color-warm-faint)]">
              {L(
                'Encore une question ? Parcourez le',
                'Still have a question? Browse the'
              )}{' '}
              <Link href="/catalogue" className="font-bold text-[var(--color-primary)] hover:underline">
                {L('catalogue de pièces', 'parts catalogue')}
              </Link>
              {L(' ou recherchez une pièce compatible avec votre véhicule en ligne.', ' or search for a compatible part for your vehicle online.')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 bg-[var(--color-bg-warm)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-[var(--color-warm-border)] shadow-lg shadow-[var(--color-earth)]/5">
            <h2 className="text-xl md:text-2xl font-extrabold text-[var(--color-warm-ink)] mb-5">
              {L('AutoAfrique — La marketplace des pièces automobiles en Afrique de l\'Ouest', 'AutoAfrique — The auto parts marketplace in West Africa')}
            </h2>
            <div className="text-base text-[var(--color-warm-faint)] leading-relaxed space-y-4">
              <p>
                {L(
                  'AutoAfrique est une marketplace e-commerce dédiée aux pièces détachées automobile en Afrique de l\'Ouest. Elle connecte les vendeurs et les acheteurs pour les marques Toyota, Hyundai, Kia, Peugeot, Mercedes et Renault, dans 10 pays : Côte d\'Ivoire, Sénégal, Mali, Burkina Faso, Niger, Bénin, Togo, Guinée-Bissau, Nigeria et Ghana.',
                  'AutoAfrique is an e-commerce marketplace dedicated to auto parts in West Africa. It connects sellers and buyers for Toyota, Hyundai, Kia, Peugeot, Mercedes and Renault, across 10 countries: Ivory Coast, Senegal, Mali, Burkina Faso, Niger, Benin, Togo, Guinea-Bissau and Ghana.'
                )}
              </p>
              <p>
                {L(
                  'Que vous soyez garagiste, revendeur ou particulier, trouvez les pièces dont vous avez besoin à prix transparents. Paiement par Mobile Money (Orange Money, MTN MoMo, Moov Money, Wave). Livraison rapide en 24-72h partout en Afrique de l\'Ouest.',
                  'Whether you\'re a mechanic, dealer or individual, find the parts you need at transparent prices. Pay with Mobile Money (Orange Money, MTN MoMo, Moov Money, Wave). Fast delivery in 24-72h across West Africa.'
                )}
              </p>
              <Link href="/a-propos" className="inline-flex items-center gap-1.5 text-[var(--color-primary)] font-bold text-base hover:underline transition-colors">
                {L('Lire la suite', 'Read more')} <span aria-hidden>&#8594;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section CTA Final (Devenir Vendeur) */}
      <section className="py-14 bg-gradient-to-r from-emerald-800 to-teal-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-3.5 py-1.5 rounded-full border border-emerald-400/30">
            {L('Espace Vendeurs & Garagistes', 'Sellers & Mechanics Space')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold mt-4 mb-4">
            {L('Vous êtes garagiste ou vendeur de pièces ?', 'Are you a mechanic or parts seller?')}
          </h2>
          <p className="text-emerald-100 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            {L(
              'Digitalisez votre magasin de pièces neuves ou d\'occasion contrôlée à Abidjan et en Afrique de l\'Ouest. Recevez vos commandes avec séquestre Mobile Money garanti.',
              'Digitize your new or certified used parts shop in Abidjan and West Africa. Receive orders with guaranteed Mobile Money escrow.'
            )}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/devenir-vendeur"
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold rounded-2xl shadow-lg transition-all border border-emerald-400/30"
            >
              {L('Devenir Vendeur Partenaire', 'Become a Partner Seller')}
            </Link>
            <Link
              href="/tarifs"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/20 transition-all"
            >
              {L('Découvrir les Tarifs & Formules SaaS', 'Discover SaaS Plans & Pricing')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
