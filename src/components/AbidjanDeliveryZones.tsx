'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';

export interface CommuneDeliveryInfo {
  id: string;
  name: string;
  quartiers: string;
  delai: string;
  delaiEn: string;
  tarif: string;
  type: 'express' | 'standard' | 'interieur';
  badge: string;
  badgeEn: string;
  description: string;
  descriptionEn: string;
}

export const COMMUNES_ABIDJAN: CommuneDeliveryInfo[] = [
  {
    id: 'marcory',
    name: 'Marcory & Zone 4',
    quartiers: 'Zone 4C, Biétry, Marcory Résidentiel, Anoumabo, Champroux',
    delai: '1h à 3h (Express)',
    delaiEn: '1h to 3h (Express)',
    tarif: '1 500 FCFA',
    type: 'express',
    badge: '⚡ Hub Principal',
    badgeEn: '⚡ Main Hub',
    description: 'Proche de nos centres de stockage. Livraison ultra-rapide par coursier moto dédié.',
    descriptionEn: 'Close to our central hub. Ultra-fast delivery by dedicated motorcycle courier.',
  },
  {
    id: 'treichville',
    name: 'Treichville',
    quartiers: 'Zone Industrielle, Gare de Bassam, Avenue 8, Palais de la Culture, Port',
    delai: '1h à 2h (Express)',
    delaiEn: '1h to 2h (Express)',
    tarif: '1 500 FCFA',
    type: 'express',
    badge: '⚡ Express Garages',
    badgeEn: '⚡ Garage Express',
    description: 'Livraison express directe aux garages et ateliers de la Zone Industrielle et Vridi.',
    descriptionEn: 'Direct express delivery to garages and workshops in the Industrial Area and Vridi.',
  },
  {
    id: 'plateau',
    name: 'Plateau (Centre des Affaires)',
    quartiers: 'Cité Administrative, Avenue Chardy, Postel 2001, Rue du Commerce',
    delai: '1h à 2h (Express)',
    delaiEn: '1h to 2h (Express)',
    tarif: '1 500 FCFA',
    type: 'express',
    badge: '⚡ Express Bureaux',
    badgeEn: '⚡ Office Express',
    description: 'Remise en main propre ou à votre chauffeur directement au bureau ou parking.',
    descriptionEn: 'Hand delivery to you or your driver directly at the office or parking lot.',
  },
  {
    id: 'cocody',
    name: 'Cocody',
    quartiers: 'Angré (8e, 9e, 11e tranche), Riviera (Golf, 2, 3, 4, Palmeraie), 2 Plateaux, Attoban',
    delai: '2h à 4h (Same-Day)',
    delaiEn: '2h to 4h (Same-Day)',
    tarif: '1 500 - 2 000 FCFA',
    type: 'express',
    badge: '🚀 Livraison Quotidienne',
    badgeEn: '🚀 Daily Delivery',
    description: 'Desservi par 4 tournées quotidiennes de coursiers moto. Suivi d\'expédition par WhatsApp.',
    descriptionEn: 'Served by 4 daily motorcycle courier rounds. WhatsApp shipment tracking.',
  },
  {
    id: 'yopougon',
    name: 'Yopougon',
    quartiers: 'Siporex, Niangon (Nord/Sud), Nouveau Quartier, Maroc, Toits Rouges, Bel Air, Gesco',
    delai: '3h à 5h (Same-Day)',
    delaiEn: '3h to 5h (Same-Day)',
    tarif: '2 000 - 2 500 FCFA',
    type: 'express',
    badge: '🔧 Forte Demande Garages',
    badgeEn: '🔧 High Garage Demand',
    description: 'Approvisionnement rapide des particuliers et des nombreux garages de Yopougon.',
    descriptionEn: 'Fast supply for private car owners and numerous repair shops across Yopougon.',
  },
  {
    id: 'adjame',
    name: 'Adjamé',
    quartiers: 'Gare Routière, 220 Logements, Marché Gouro, Mirador, Liberté',
    delai: '2h à 3h (Express)',
    delaiEn: '2h to 3h (Express)',
    tarif: '1 500 - 2 000 FCFA',
    type: 'express',
    badge: '📦 Transit & Correspondance',
    badgeEn: '📦 Transit & Transfer',
    description: 'Alternative moderne et garantie aux marchés informels d\'Adjamé avec pièces testées.',
    descriptionEn: 'Modern, guaranteed alternative to informal Adjamé scrap markets with inspected parts.',
  },
  {
    id: 'koumassi',
    name: 'Koumassi',
    quartiers: 'Zone Industrielle, Remblais, Grand Carrefour, Soweto, Camp Militaire',
    delai: '2h à 4h (Same-Day)',
    delaiEn: '2h to 4h (Same-Day)',
    tarif: '1 500 - 2 000 FCFA',
    type: 'express',
    badge: '⚡ Secteur Atelier',
    badgeEn: '⚡ Workshop Sector',
    description: 'Dépôt direct en atelier mécanique ou livraison à domicile.',
    descriptionEn: 'Direct drop-off at your mechanic workshop or home delivery.',
  },
  {
    id: 'abobo',
    name: 'Abobo',
    quartiers: 'Samaké, N\'Dotré, Avocatier, Belle-Ville, PK18, Rond-point Mairie',
    delai: '3h à 5h (Same-Day)',
    delaiEn: '3h to 5h (Same-Day)',
    tarif: '2 000 - 2 500 FCFA',
    type: 'express',
    badge: '🚚 Tournée Journalière',
    badgeEn: '🚚 Daily Courier',
    description: 'Livraison express sur l\'axe principal et dans tous les sous-quartiers d\'Abobo.',
    descriptionEn: 'Express delivery on the main axis and across all Abobo neighborhoods.',
  },
  {
    id: 'port-bouet',
    name: 'Port-Bouët & Vridi',
    quartiers: 'Aéroport Félix Houphouët-Boigny, Vridi Zone Industrielle, Gonzagueville, Derrière Wharf',
    delai: '2h à 4h (Same-Day)',
    delaiEn: '2h to 4h (Same-Day)',
    tarif: '2 000 - 2 500 FCFA',
    type: 'express',
    badge: '✈️ Zone Aéroportuaire',
    badgeEn: '✈️ Airport Area',
    description: 'Livraison sur sites industriels de Vridi, plateformes logistiques et résidences.',
    descriptionEn: 'Delivery to Vridi industrial sites, logistics platforms and residences.',
  },
  {
    id: 'grand-abidjan',
    name: 'Grand Abidjan (Bingerville, Grand-Bassam, Songon)',
    quartiers: 'Bingerville centre/EES, Grand-Bassam (Quartier France/Moossou), Songon Agban',
    delai: '24h (Lendemain)',
    delaiEn: '24h (Next Day)',
    tarif: '2 500 - 3 500 FCFA',
    type: 'standard',
    badge: '🛣️ Périphérie',
    badgeEn: '🛣️ Suburbs',
    description: 'Navette quotidienne reliant Abidjan aux villes périphériques pour particuliers et pros.',
    descriptionEn: 'Daily shuttle linking Abidjan to surrounding towns for motorists and professionals.',
  },
  {
    id: 'interieur',
    name: 'Intérieur de la Côte d\'Ivoire (Gares Routières)',
    quartiers: 'Bouaké, Yamoussoukro, San Pedro, Korhogo, Daloa, Man, Gagnoa, Abengourou',
    delai: '24h à 48h',
    delaiEn: '24h to 48h',
    tarif: '2 500 - 5 000 FCFA',
    type: 'interieur',
    badge: '🚌 Réseau Gares UTB / STIF',
    badgeEn: '🚌 Bus Stations Network',
    description: 'Expédition en car de transport sécurisé avec récépissé de colis et retrait en gare.',
    descriptionEn: 'Secure bus shipping with baggage receipt and parcel pickup at the station.',
  },
];

export default function AbidjanDeliveryZones() {
  const { locale } = useApp();
  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const [activeCommune, setActiveCommune] = useState<string>('marcory');
  const [filterType, setFilterType] = useState<'all' | 'express' | 'interieur'>('all');

  const filteredCommunes = COMMUNES_ABIDJAN.filter((c) => {
    if (filterType === 'all') return true;
    if (filterType === 'express') return c.type === 'express';
    if (filterType === 'interieur') return c.type === 'interieur' || c.type === 'standard';
    return true;
  });

  const selectedData = COMMUNES_ABIDJAN.find((c) => c.id === activeCommune) || COMMUNES_ABIDJAN[0];

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-gray-50 via-white to-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-700 font-bold text-xs uppercase tracking-wider mb-3">
            <span>📍</span> {L('Couverture Locale Abidjan & Côte d\'Ivoire', 'Abidjan & Ivory Coast Local Coverage')}
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            {L('Délais & Tarifs de livraison par commune à Abidjan', 'Delivery times & rates by commune in Abidjan')}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600">
            {L(
              'Nos livreurs moto express et transporteurs partenaires livrent vos pièces neuves et d\'occasion contrôlée directement à votre garage ou domicile.',
              'Our express motorcycle couriers and partner carriers deliver your new and certified used parts directly to your garage or home.'
            )}
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                filterType === 'all'
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {L('Toutes les zones (11)', 'All zones (11)')}
            </button>
            <button
              onClick={() => setFilterType('express')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                filterType === 'express'
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              ⚡ {L('Abidjan Express (1h à 5h)', 'Abidjan Express (1h to 5h)')}
            </button>
            <button
              onClick={() => setFilterType('interieur')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                filterType === 'interieur'
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              🚌 {L('Gares & Intérieur du pays', 'Bus Stations & Interior')}
            </button>
          </div>
        </div>

        {/* Interactive Communes Grid + Detail View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Communes List (Left: 7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredCommunes.map((commune) => {
              const isSelected = commune.id === activeCommune;
              return (
                <button
                  key={commune.id}
                  onClick={() => setActiveCommune(commune.id)}
                  className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-orange-500 ring-2 ring-orange-500/20 shadow-lg'
                      : 'bg-white border-gray-200 hover:border-orange-300 hover:bg-orange-50/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="font-extrabold text-sm sm:text-base text-gray-900">
                      {commune.name}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 shrink-0">
                      {locale === 'fr' ? commune.badge : commune.badgeEn}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1 mb-2">
                    {commune.quartiers}
                  </p>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100 font-semibold">
                    <span className="text-orange-600 flex items-center gap-1">
                      <span>⏱️</span> {locale === 'fr' ? commune.delai : commune.delaiEn}
                    </span>
                    <span className="text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                      {commune.tarif}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Commune Panel (Right: 5 cols) */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-gradient-to-br from-[var(--color-warm-navy)] to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                  {L('Détails de la livraison', 'Delivery Details')}
                </span>
                <span className="px-2.5 py-1 bg-white/10 text-white text-xs font-bold rounded-lg border border-white/10">
                  {locale === 'fr' ? selectedData.badge : selectedData.badgeEn}
                </span>
              </div>

              <h3 className="text-2xl font-black text-white mb-2">
                {selectedData.name}
              </h3>

              <p className="text-sm text-gray-300 leading-relaxed mb-6">
                {locale === 'fr' ? selectedData.description : selectedData.descriptionEn}
              </p>

              <div className="space-y-3 bg-white/5 rounded-2xl p-4 border border-white/10 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{L('Délai estimé :', 'Estimated time:')}</span>
                  <span className="font-extrabold text-orange-400 text-base">
                    {locale === 'fr' ? selectedData.delai : selectedData.delaiEn}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{L('Frais de course :', 'Delivery fee:')}</span>
                  <span className="font-extrabold text-white text-base">
                    {selectedData.tarif}
                  </span>
                </div>
                <div className="pt-2 border-t border-white/10">
                  <span className="text-xs text-gray-400 block mb-1">{L('Quartiers desservis :', 'Covered areas:')}</span>
                  <span className="text-xs text-gray-200 font-medium">
                    {selectedData.quartiers}
                  </span>
                </div>
              </div>

              {/* WhatsApp & Catalog Action Buttons */}
              <div className="space-y-3">
                <a
                  href={`https://wa.me/2250788000000?text=${encodeURIComponent(
                    `Bonjour AutoAfrique, je souhaite commander des pièces auto avec livraison à ${selectedData.name} (Quartier : ...). Pouvez-vous m'aider ?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold rounded-xl transition-all shadow-lg shadow-emerald-950/30 text-sm"
                >
                  <span>💬</span> {L(`Commander sur WhatsApp pour ${selectedData.name.split('&')[0].trim()}`, `Order on WhatsApp for ${selectedData.name.split('&')[0].trim()}`)}
                </a>

                <Link
                  href="/catalogue"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all text-sm border border-white/10"
                >
                  <span>🔍</span> {L('Parcourir le catalogue de pièces', 'Browse parts catalogue')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
