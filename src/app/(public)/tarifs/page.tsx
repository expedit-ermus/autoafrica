'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';

export default function TarifsPage() {
  const { t } = useApp();
  const [annualBilling, setAnnualBilling] = useState(false);
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({});

  const toggleFaq = (index: number) => {
    setFaqOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const plans = [
    {
      key: 'free',
      data: t.pricing.free,
      monthlyPrice: '0 FCFA',
      annualPrice: '0 FCFA',
      badge: 'Test & Découverte',
      badgeBg: 'bg-gray-100 text-gray-800 border-gray-300',
      buttonBg: 'bg-gray-900 text-white hover:bg-gray-800',
      popular: false,
    },
    {
      key: 'starter',
      data: t.pricing.starter,
      monthlyPrice: '15 000 FCFA',
      annualPrice: '12 750 FCFA',
      badge: 'Garages & Casseaurs',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      buttonBg: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-200',
      popular: false,
    },
    {
      key: 'pro',
      data: t.pricing.pro,
      monthlyPrice: '45 000 FCFA',
      annualPrice: '38 250 FCFA',
      badge: t.pricing.pro.popular || 'Recommandé',
      badgeBg: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold border-amber-400 shadow-sm',
      buttonBg: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-indigo-200',
      popular: true,
    },
    {
      key: 'enterprise',
      data: t.pricing.enterprise,
      monthlyPrice: '120 000 FCFA',
      annualPrice: '102 000 FCFA',
      badge: 'Importateurs & Flottes',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
      buttonBg: 'bg-gray-900 text-white hover:bg-black shadow-md',
      popular: false,
    },
  ];

  const faqs = [
    {
      q: "Comment s'effectue le paiement des abonnements en Afrique de l'Ouest ?",
      a: "Vous pouvez régler votre abonnement mensuel ou annuel directement via Mobile Money (Orange Money, MTN MoMo, Wave, Moov Money) ou par Carte Bancaire (Visa, Mastercard). Aucun compte bancaire requis."
    },
    {
      q: "Comment fonctionne la commission sur la Marketplace AutoAfrique ?",
      a: "La commission est prélevée uniquement sur les ventes réalisées avec succès via la Marketplace. Plus votre formule SaaS est élevée, plus votre taux de commission diminue (8% en Free, 5% en Starter, 3% en Pro, et 1,5% négocié en Enterprise)."
    },
    {
      q: "Puis-je changer d'offre ou annuler mon abonnement à tout moment ?",
      a: "Oui, vous pouvez surclasser (upgrade) votre formule à tout moment pour bénéficier de plus de stock, d'utilisateurs ou d'entrepôts. L'abonnement est sans engagement de durée."
    },
    {
      q: "Que se passe-t-il si je dépasse la limite de pièces de mon plan ?",
      a: "Une alerte vous préviendra lorsque vous atteindrez 90% de votre quota. Vous pourrez facilement passer au palier supérieur sans interruption de votre activité."
    },
    {
      q: "Est-ce que le système gère les devises locales (FCFA, XOF, USD) ?",
      a: "Absolument. AutoAfrique est conçu nativement pour le marché ouest-africain. Tous les montants, factures et statistiques sont affichés en FCFA (XOF) avec possibilité de conversion en USD pour les importations."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="max-w-5xl mx-auto text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Offres SaaS & Marketplace ERP
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
          {t.pricing.title}
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          {t.pricing.subtitle}
        </p>

        {/* Toggle Annual / Monthly */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <span className={`text-sm font-medium ${!annualBilling ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
            Paiement Mensuel
          </span>
          <button
            type="button"
            onClick={() => setAnnualBilling(!annualBilling)}
            className={`relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              annualBilling ? 'bg-emerald-600' : 'bg-slate-300'
            }`}
            aria-label="Basculer facturation annuelle"
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                annualBilling ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-sm font-medium flex items-center gap-2 ${annualBilling ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
            Paiement Annuel
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              -15% (-2 mois)
            </span>
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="max-w-7xl mx-auto mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
        {plans.map((plan) => (
          <div
            key={plan.key}
            className={`relative rounded-2xl bg-white p-5 sm:p-6 shadow-sm border transition-all duration-300 flex flex-col justify-between hover:shadow-xl ${
              plan.popular ? 'border-2 border-amber-400 ring-2 ring-amber-400/20 lg:scale-105 z-10' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            {/* Top Badge */}
            {plan.badge && (
              <div className="mb-4">
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${plan.badgeBg}`}>
                  {plan.badge}
                </span>
              </div>
            )}

            <div>
              <h2 className="text-xl font-bold text-slate-900">{plan.data.name}</h2>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                  {annualBilling ? plan.annualPrice : plan.monthlyPrice}
                </span>
                <span className="text-slate-500 text-sm ml-1">{plan.data.period}</span>
              </div>
              {annualBilling && plan.key !== 'free' && (
                <p className="text-xs text-emerald-600 font-medium mt-1">
                  Facturé annuellement (économie de 15%)
                </p>
              )}

              {/* Feature List */}
              <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6 text-sm text-slate-600">
                {plan.data.features.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <div className="mt-8 pt-4">
              <Link
                href={plan.key === 'enterprise' ? '/contact' : `/auth/register?plan=${plan.key}`}
                className={`w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-semibold rounded-xl transition-all duration-150 ${plan.buttonBg}`}
              >
                {plan.data.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Comparison Table Highlight */}
      <div className="max-w-5xl mx-auto mt-12 md:mt-20 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Pourquoi choisir le SaaS ERP AutoAfrique ?</h2>
          <p className="text-slate-600 mt-2">La seule plateforme conçue spécifiquement pour le commerce automobile africain.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl mb-3">
              📱
            </div>
            <h3 className="font-bold text-slate-900 text-base">Mobile Money & Escrow</h3>
            <p className="text-xs text-slate-600 mt-1">
              Encaissez par Orange Money, MTN MoMo et Wave avec déblocage sécurisé des fonds à la livraison.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl mb-3">
              📦
            </div>
            <h3 className="font-bold text-slate-900 text-base">Multi-Entrepôts & Casse</h3>
            <p className="text-xs text-slate-600 mt-1">
              Gérez plusieurs magasins, ateliers ou hangars de pièces de réemploi avec suivi d&apos;emplacement précis.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xl mb-3">
              🚢
            </div>
            <h3 className="font-bold text-slate-900 text-base">Approvisionnement & Douanes</h3>
            <p className="text-xs text-slate-600 mt-1">
              Suivez vos conteneurs de pièces de Chine, Dubaï ou Europe, de l&apos;embarquement jusqu&apos;au dédouanement à Abidjan ou Dakar.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto mt-12 md:mt-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Foire Aux Questions (FAQ)</h2>
          <p className="text-slate-600 mt-2">Tout ce que vous devez savoir sur nos formules d&apos;abonnement et de paiement.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-200 rounded-xl bg-white overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-4 text-left font-semibold text-slate-900 flex justify-between items-center focus:outline-none hover:bg-slate-50"
              >
                <span>{faq.q}</span>
                <span className="text-xl text-slate-400 font-bold ml-2">
                  {faqOpen[idx] ? '−' : '+'}
                </span>
              </button>
              {faqOpen[idx] && (
                <div className="px-6 pb-4 text-sm text-slate-600 border-t border-slate-100 pt-3 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-5xl mx-auto mt-12 md:mt-20 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center text-white shadow-xl">
        <h2 className="text-2xl sm:text-4xl font-extrabold mb-4">
          Prêt à digitaliser votre garage ou magasin de pièces ?
        </h2>
        <p className="text-emerald-100 text-base sm:text-lg max-w-2xl mx-auto mb-8">
          Rejoignez des centaines de garagistes, casseaurs et revendeurs en Côte d&apos;Ivoire, au Sénégal et dans toute l&apos;Afrique de l&apos;Ouest.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/auth/register"
            className="px-8 py-3.5 bg-white text-emerald-800 font-bold rounded-xl shadow-lg hover:bg-emerald-50 transition-all"
          >
            Créer mon compte Vendeur / Garage
          </Link>
          <Link
            href="/contact"
            className="px-8 py-3.5 bg-emerald-800/60 text-white font-semibold rounded-xl border border-emerald-400/40 hover:bg-emerald-800 transition-all"
          >
            Demander une démonstration
          </Link>
        </div>
      </div>
    </div>
  );
}
