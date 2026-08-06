'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';

export default function VtcCircuitCourtSection() {
  const { locale } = useApp();
  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <section className="py-10 md:py-16 bg-gradient-to-br from-amber-500/5 via-emerald-500/5 to-blue-500/5 border-y border-[var(--color-warm-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête de section */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-200">
            <span>🌱</span>
            {L('Circuit Court Économique Ouest-Africain', 'West African Local Supply Chain')}
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-[var(--color-warm-ink)] tracking-tight">
            {L('Passerelle VTC, Flottes & Garantie SAV', 'VTC Passerelle, Fleets & Warranty')}
          </h2>
          <p className="mt-3 text-sm md:text-base text-[var(--color-warm-muted-strong)] leading-relaxed">
            {L(
              'Un réseau solidaire et ultra-rapide reliant les ferrailles locales (N\'Dotré, Camp Pénal), les Maîtres Garagistes de quartier et les professionnels du transport.',
              'A fast, solidarity network connecting local scrapyards, neighborhood master mechanics, and transport professionals.'
            )}
          </p>
        </div>

        {/* Grille 3 piliers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Carte 1: VTC & Taxis */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[var(--color-warm-border)] shadow-md shadow-amber-900/5 flex flex-col justify-between hover:border-amber-400 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl font-bold mb-5">
                🚕
              </div>
              <h3 className="text-lg font-extrabold text-[var(--color-warm-ink)] mb-2">
                {L('Pack Chauffeurs VTC & Taxis', 'VTC & Taxi Driver Pack')}
              </h3>
              <p className="text-xs md:text-sm text-[var(--color-warm-faint)] leading-relaxed mb-4">
                {L(
                  'Immobilisation zéro ! Priorité d\'approvisionnement express sur les pièces d\'usure (amortisseurs, embrayage, rotules) avec garantie de remplacement sous 4h.',
                  'Zero downtime! Express priority supply for wear parts with a guaranteed 4h replacement.'
                )}
              </p>
              <ul className="space-y-2 text-xs font-medium text-gray-700 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> {L('Entretien régulier & vidanges programmées', 'Regular maintenance & scheduled oil changes')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> {L('Garantie Totale : Pièce ET Main d\'œuvre', 'Full Warranty: Parts AND Labor')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> {L('Tarifs préférentiels VTC (Yango, Uber, Taxis)', 'Preferential VTC rates')}
                </li>
              </ul>
            </div>
            <Link
              href="/tarifs"
              className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors shadow-md shadow-amber-200"
            >
              {L('Découvrir l\'offre VTC', 'Discover VTC Offer')} →
            </Link>
          </div>

          {/* Carte 2: Circuit Court & Indigène */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[var(--color-warm-border)] shadow-md shadow-emerald-900/5 flex flex-col justify-between hover:border-emerald-400 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-bold mb-5">
                ♻️
              </div>
              <h3 className="text-lg font-extrabold text-[var(--color-warm-ink)] mb-2">
                {L('Circuit Court Économique', 'Local Economic Loop')}
              </h3>
              <p className="text-xs md:text-sm text-[var(--color-warm-faint)] leading-relaxed mb-4">
                {L(
                  '100% de la valeur réinjectée dans la sous-région. Valorisation des ferrailles de réemploi et création d\'emplois pour les livreurs et garagistes locaux.',
                  '100% of value reinjected locally. Valorizing reusable scrapyard parts and creating jobs for local mechanics and couriers.'
                )}
              </p>
              <ul className="space-y-2 text-xs font-medium text-gray-700 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> {L('Traçabilité des pièces "Venantes"', 'Traceability of "Venant" parts')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> {L('Réseau des Maîtres Garagistes certifiés', 'Certified Master Mechanics network')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> {L('Expédition Gare Routière inter-villes', 'Inter-city bus station shipping')}
                </li>
              </ul>
            </div>
            <Link
              href="/a-propos"
              className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-200"
            >
              {L('Notre Impact Communautaire', 'Our Local Impact')} →
            </Link>
          </div>

          {/* Carte 3: Sociétés & Flottes Entreprises */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[var(--color-warm-border)] shadow-md shadow-blue-900/5 flex flex-col justify-between hover:border-blue-400 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-bold mb-5">
                🏢
              </div>
              <h3 className="text-lg font-extrabold text-[var(--color-warm-ink)] mb-2">
                {L('Flottes Entreprises & Sociétés', 'Corporate Fleets')}
              </h3>
              <p className="text-xs md:text-sm text-[var(--color-warm-faint)] leading-relaxed mb-4">
                {L(
                  'Gestion clé en main pour les flottes d\'utilitaires et Pick-ups (Mitsubishi L200, Toyota Hilux). Garantie SAV sous 24h avec facturation centralisée.',
                  'Turnkey management for utility fleets and Pick-ups. 24h warranty response with centralized invoicing.'
                )}
              </p>
              <ul className="space-y-2 text-xs font-medium text-gray-700 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> {L('Contrats entretien préventif & suivi kilométrique', 'Preventive maintenance contracts & mileage tracking')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> {L('Double Garantie SAV : Pièce + Montage inclus', 'Dual Warranty: Part + Labor included')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> {L('Facturation groupée & gestionnaire dédié', 'Grouped invoicing & dedicated manager')}
                </li>
              </ul>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-md shadow-blue-200"
            >
              {L('Contacter le pôle Flottes', 'Contact Fleet Team')} →
            </Link>
          </div>

        </div>

        {/* Bannière Tiers de confiance Mobile Money */}
        <div className="mt-10 bg-gradient-to-r from-gray-900 via-gray-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-3xl shrink-0">
              🛡️
            </div>
            <div>
              <h4 className="text-base md:text-lg font-bold">
                {L('Garantie Totale SAV : Pièce ET Main d\'Œuvre Couvertes (Escrow Mobile Money)', 'Full Warranty: Parts AND Labor Covered (Mobile Money Escrow)')}
              </h4>
              <p className="text-xs md:text-sm text-gray-300 mt-1 max-w-xl">
                {L(
                  'Fini la peur des mauvaises pièces ou du mauvais montage. Nous garantissons la pièce et la main d\'œuvre du garagiste. L\'argent reste bloqué sur Wave, Djamo ou Orange Money jusqu\'au test final.',
                  'No more fear of bad parts or bad installation. We guarantee both the part and the mechanic labor. Money stays locked on Wave, Djamo or Orange Money until final validation.'
                )}
              </p>
            </div>
          </div>
          <Link
            href="/paiement"
            className="shrink-0 py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs md:text-sm transition-all shadow-lg shadow-emerald-500/20"
          >
            {L('En savoir plus sur la sécurité', 'Learn more about security')}
          </Link>
        </div>

      </div>
    </section>
  );
}
