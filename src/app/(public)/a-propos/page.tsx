'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';
import { WebsiteStructuredData } from '@/components/StructuredData';

export default function AboutPage() {
  const { locale } = useApp();
  const L = (fr: string, en: string) => locale === 'fr' ? fr : en;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <WebsiteStructuredData />
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-warm-navy)] via-[var(--color-secondary)] to-orange-950 text-white py-24 sm:py-32 rounded-b-3xl">
        <div className="absolute inset-0 bg-[url('/pattern-grid.svg')] opacity-10"></div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <span className="inline-flex items-center rounded-full bg-orange-500/10 px-3 py-1 text-sm font-semibold text-orange-400 ring-1 ring-inset ring-orange-500/20 mb-6">
            {L('À Propos d\'AutoAfrique', 'About AutoAfrique')}
          </span>
          <h1 className="max-w-4xl mx-auto text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            {L('Digitaliser le commerce auto en Afrique de l\'Ouest', 'Digitalizing Auto Commerce in West Africa')}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300">
            {L(
              'Notre mission est de moderniser et structurer le marché informel de la pièce détachée et la gestion des garages, avec des solutions SaaS et une marketplace de confiance.',
              'Our mission is to modernize and structure the informal auto parts market and garage management with trusted SaaS solutions and a marketplace.'
            )}
          </p>
        </div>
      </section>

      {/* 2. Notre Mission */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-[var(--color-primary)]">
              {L('Notre Mission', 'Our Mission')}
            </h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {L('Trois piliers pour transformer l\'industrie', 'Three pillars to transform the industry')}
            </p>
          </div>
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {/* Card 1 */}
              <div className="flex flex-col bg-gray-50 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold leading-7 text-gray-900 mb-3">
                  {L('Marketplace de Pièces', 'Auto Parts Marketplace')}
                </h3>
                <p className="flex-auto text-base leading-7 text-gray-600">
                  {L('Connecter les acheteurs (garagistes, particuliers) aux vendeurs (casseurs, revendeurs) avec un catalogue unifié et transparent.', 'Connecting buyers (mechanics, individuals) to sellers (scrapyards, resellers) with a unified and transparent catalog.')}
                </p>
              </div>
              {/* Card 2 */}
              <div className="flex flex-col bg-gray-50 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold leading-7 text-gray-900 mb-3">
                  {L('ERP & Gestion Garage', 'ERP & Garage Management')}
                </h3>
                <p className="flex-auto text-base leading-7 text-gray-600">
                  {L('Des outils SaaS puissants pour gérer les devis, les stocks multi-entrepôts, les importations, et la relation client.', 'Powerful SaaS tools to manage quotes, multi-warehouse inventory, imports, and customer relationships.')}
                </p>
              </div>
              {/* Card 3 */}
              <div className="flex flex-col bg-gray-50 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold leading-7 text-gray-900 mb-3">
                  {L('Paiement Mobile Money', 'Mobile Money Payments')}
                </h3>
                <p className="flex-auto text-base leading-7 text-gray-600">
                  {L('Transactions sécurisées avec système de séquestre via Wave, Djamo, Orange Money, MTN MoMo et Moov Money.', 'Secure transactions with escrow system via Wave, Djamo, Orange Money, MTN MoMo and Moov Money.')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Le Problème que nous résolvons */}
      <section className="py-24 bg-[var(--color-warm-navy)] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-orange-900/20 mix-blend-multiply"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {L('Le Problème que nous résolvons', 'The Problem We Solve')}
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              {L('Le marché de la pièce automobile en Afrique de l\'Ouest souffre de plusieurs maux qui freinent son développement et créent un manque de confiance :', 'The auto parts market in West Africa suffers from several issues that hinder its development and create a lack of trust:')}
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-4">
            <div className="bg-white/5 p-8 rounded-3xl backdrop-blur-sm border border-white/10">
              <h3 className="text-lg font-bold text-white mb-2">{L('Opacité des prix', 'Price Opacity')}</h3>
              <p className="text-gray-400">{L('Aucune grille tarifaire standard, les prix varient "à la tête du client".', 'No standard pricing, prices vary "by the look of the customer".')}</p>
            </div>
            <div className="bg-white/5 p-8 rounded-3xl backdrop-blur-sm border border-white/10">
              <h3 className="text-lg font-bold text-white mb-2">{L('Aucune garantie', 'No Guarantees')}</h3>
              <p className="text-gray-400">{L('L\'acheteur prend tous les risques sur la qualité et la compatibilité de la pièce.', 'The buyer takes all the risks on the quality and compatibility of the part.')}</p>
            </div>
            <div className="bg-white/5 p-8 rounded-3xl backdrop-blur-sm border border-white/10">
              <h3 className="text-lg font-bold text-white mb-2">{L('Tout en cash', 'All Cash')}</h3>
              <p className="text-gray-400">{L('Transactions en espèces dangereuses et difficiles à tracer pour les garagistes.', 'Dangerous cash transactions that are hard for mechanics to track.')}</p>
            </div>
            <div className="bg-white/5 p-8 rounded-3xl backdrop-blur-sm border border-white/10">
              <h3 className="text-lg font-bold text-white mb-2">{L('Pas de traçabilité', 'No Traceability')}</h3>
              <p className="text-gray-400">{L('Origine des pièces incertaine, gestion des stocks archaïque.', 'Uncertain origin of parts, archaic inventory management.')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Notre Approche / Comment ça marche */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {L('Comment ça marche ?', 'How It Works?')}
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              {L('Une approche simple, fluide et sécurisée.', 'A simple, seamless, and secure approach.')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl font-black text-[var(--color-primary)] -mt-8 -mr-4">1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">{L('Publiez vos pièces', 'Publish Your Parts')}</h3>
              <p className="text-gray-600 relative z-10">{L('Catalogue rapide via l\'application web ou par message WhatsApp (photos, audio).', 'Quick cataloging via web app or WhatsApp message (photos, audio).')}</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl font-black text-[var(--color-primary)] -mt-8 -mr-4">2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">{L('Commande & Paiement', 'Order & Payment')}</h3>
              <p className="text-gray-600 relative z-10">{L('L\'acheteur commande en ligne et paye instantanément par Mobile Money.', 'The buyer orders online and pays instantly via Mobile Money.')}</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl font-black text-[var(--color-primary)] -mt-8 -mr-4">3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">{L('Séquestre sécurisé', 'Secure Escrow')}</h3>
              <p className="text-gray-600 relative z-10">{L('Les fonds sont conservés en toute sécurité jusqu\'à la réception de la pièce.', 'Funds are securely held until the part is received.')}</p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl font-black text-[var(--color-primary)] -mt-8 -mr-4">4</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">{L('Livraison & Déblocage', 'Delivery & Release')}</h3>
              <p className="text-gray-600 relative z-10">{L('Livraison par coursier ou Gare Routière (24-72h), puis paiement du vendeur.', 'Delivery by courier or bus station (24-72h), then seller payout.')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Nos Valeurs */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {L('Nos Valeurs', 'Our Values')}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 mb-6">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{L('Transparence', 'Transparency')}</h3>
              <p className="text-gray-600">{L('Des prix clairs, pas de frais cachés, une information fiable.', 'Clear prices, no hidden fees, reliable information.')}</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 mb-6">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{L('Qualité', 'Quality')}</h3>
              <p className="text-gray-600">{L('Des pièces inspectées, des vendeurs évalués, une marketplace de confiance.', 'Inspected parts, rated sellers, a trusted marketplace.')}</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 mb-6">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{L('Accessibilité', 'Accessibility')}</h3>
              <p className="text-gray-600">{L('Des outils conçus pour tous, du particulier au garagiste professionnel.', 'Tools designed for everyone, from individuals to professional mechanics.')}</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 mb-6">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{L('Innovation', 'Innovation')}</h3>
              <p className="text-gray-600">{L('Technologies modernes (SaaS, Mobile Money) adaptées aux réalités locales.', 'Modern technologies (SaaS, Mobile Money) adapted to local realities.')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Nos Marchés & L'Équipe */}
      <section className="py-24 bg-gray-50 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-6">
                {L('Nos Marchés', 'Our Markets')}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {L('AutoAfrique cible en priorité les marchés d\'Afrique de l\'Ouest francophone, avec un focus initial sur :', 'AutoAfrique primarily targets Francophone West African markets, with an initial focus on:')}
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 mr-4">🇨🇮</span>
                  <span className="text-lg font-semibold text-gray-900">{L('Côte d\'Ivoire (Abidjan)', 'Ivory Coast (Abidjan)')}</span>
                </li>
                <li className="flex items-center">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 mr-4">🇸🇳</span>
                  <span className="text-lg font-semibold text-gray-900">{L('Sénégal (Dakar)', 'Senegal (Dakar)')}</span>
                </li>
              </ul>
              <p className="text-sm text-gray-500 italic">
                {L('* Expansion prévue dans toute la zone UEMOA.', '* Planned expansion throughout the UEMOA zone.')}
              </p>
            </div>
            <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-6">
                {L('L\'Équipe', 'The Team')}
              </h2>
              <p className="text-lg text-gray-600">
                {L('AutoAfrique est propulsée par une équipe passionnée, composée de professionnels de la technologie et de l\'industrie automobile originaires d\'Afrique de l\'Ouest. Nous comprenons les défis locaux et construisons des solutions sur-mesure.', 'AutoAfrique is powered by a passionate team of tech and auto industry professionals from West Africa. We understand local challenges and build tailor-made solutions.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CTA Section */}
      <section className="relative isolate overflow-hidden bg-gradient-to-r from-[var(--color-primary)] to-orange-400 py-16 sm:py-24 lg:py-32 rounded-t-3xl">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {L('Prêt à transformer votre gestion auto ?', 'Ready to transform your auto management?')}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-orange-50">
            {L('Rejoignez la révolution de la pièce détachée en Afrique de l\'Ouest. Créez votre compte gratuitement aujourd\'hui.', 'Join the auto parts revolution in West Africa. Create your account for free today.')}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/auth/register"
              className="rounded-full bg-white px-8 py-4 text-sm font-semibold text-[var(--color-primary)] shadow-sm hover:bg-orange-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
            >
              {L('S\'inscrire maintenant', 'Register Now')}
            </Link>
            <Link href="/catalogue" className="text-sm font-semibold leading-6 text-white hover:text-orange-100 transition-colors">
              {L('Explorer la marketplace', 'Explore Marketplace')} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
