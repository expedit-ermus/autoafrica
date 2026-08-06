'use client';

import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import Link from 'next/link';

export default function RoleServicesHub() {
  const { locale } = useApp();
  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const [activeRole, setActiveRole] = useState<'buyer' | 'provider'>('buyer');

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[var(--color-warm-border)] shadow-sm mb-8">
      
      {/* Selector de Rôle (Acheteur vs Vendeur de Service) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-6 mb-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {L('Espace Multi-Profils AutoAfrique', 'AutoAfrique Multi-Profile Hub')}
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--color-warm-ink)] mt-2">
            {activeRole === 'buyer'
              ? L('Espace Acheteur & Chauffeur', 'Buyer & Car Owner Space')
              : L('Espace Vendeur & Garagiste Prestataire', 'Seller & Mechanic Provider Space')}
          </h2>
        </div>

        {/* Commutateur d'Espace */}
        <div className="bg-gray-100 p-1 rounded-2xl flex items-center w-full sm:w-auto">
          <button
            onClick={() => setActiveRole('buyer')}
            className={`flex-1 sm:flex-initial py-2.5 px-5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeRole === 'buyer'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>👤</span>
            {L('Acheteur de Service', 'Service Buyer')}
          </button>

          <button
            onClick={() => setActiveRole('provider')}
            className={`flex-1 sm:flex-initial py-2.5 px-5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeRole === 'provider'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>🧰</span>
            {L('Vendeur & Prestataire', 'Service Provider')}
          </button>
        </div>
      </div>

      {/* VUE 1 : ESPACE ACHETEUR DE SERVICE */}
      {activeRole === 'buyer' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Cartes résumé rapide */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl p-4 border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🚗</span>
                <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  2 Véhicules
                </span>
              </div>
              <div className="text-xs text-gray-500 font-medium">{L('Mon Garage Virtuel', 'My Virtual Garage')}</div>
              <div className="text-sm font-extrabold text-gray-900 mt-1">Toyota Corolla & Peugeot 307</div>
              <div className="text-[11px] text-blue-600 font-semibold mt-2">Vidange préventive dans 2 500 km</div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl p-4 border border-amber-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🛠️</span>
                <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  1 En cours
                </span>
              </div>
              <div className="text-xs text-gray-500 font-medium">{L('Mes RDV Garagistes', 'My Mechanic Appointments')}</div>
              <div className="text-sm font-extrabold text-gray-900 mt-1">Maître Garage Diallo</div>
              <div className="text-[11px] text-amber-700 font-semibold mt-2">Dépannage Amortisseurs • Demain 14h</div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-2xl p-4 border border-emerald-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">📦</span>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  En livraison
                </span>
              </div>
              <div className="text-xs text-gray-500 font-medium">{L('Commande Pièce d\'occasion', 'Used Part Order')}</div>
              <div className="text-sm font-extrabold text-gray-900 mt-1">Amortisseur N\'Dotré #14</div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-2">Livreur Tiak-Tiak en route</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50/50 rounded-2xl p-4 border border-purple-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🛡️</span>
                <span className="text-xs font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>
              <div className="text-xs text-gray-500 font-medium">{L('Double Garantie SAV', 'Dual Warranty')}</div>
              <div className="text-sm font-extrabold text-gray-900 mt-1">Pièce ET Main d\'œuvre</div>
              <div className="text-[11px] text-purple-700 font-semibold mt-2">Paiement séquestre Wave sécurisé</div>
            </div>

          </div>

          {/* Actions & RDV en détail */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Suivi du RDV Mécano */}
            <div className="lg:col-span-8 bg-gray-50/70 rounded-2xl p-5 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span>📅</span> {L('Dernière demande de service / Montage', 'Latest Service & Installation Request')}
                </h3>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full">
                  Séquestre Mobile Money Actif
                </span>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-3 border-b border-gray-100">
                  <div>
                    <div className="text-xs text-gray-400 font-bold uppercase">{L('Service demandé', 'Requested Service')}</div>
                    <div className="font-extrabold text-gray-900">Remplacement Paire d\'Amortisseurs + Rotules</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400 font-bold uppercase">{L('Montant bloqué', 'Held Amount')}</div>
                    <div className="font-extrabold text-emerald-600">50 000 FCFA (Wave)</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-gray-400 block">{L('Garagiste :', 'Mechanic:')}</span>
                    <span className="font-bold text-gray-800">Maître Garage Diallo (Yopougon)</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">{L('Vendeur Casse :', 'Scrapyard Vendor:')}</span>
                    <span className="font-bold text-gray-800">Ferraille N\'Dotré Magasin #14</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">{L('Garantie :', 'Warranty:')}</span>
                    <span className="font-bold text-emerald-600">Pièce + Montage (30 jours)</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-2">
                  <button className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors">
                    💬 WhatsApp Garagiste
                  </button>
                  <button className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition-colors">
                    📞 Appeler le Livreur Moto
                  </button>
                </div>
              </div>
            </div>

            {/* Actions Rapides Acheteur */}
            <div className="lg:col-span-4 bg-gradient-to-b from-gray-900 to-gray-950 text-white rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider">
                  {L('Assistance Express', 'Express Assistance')}
                </span>
                <h4 className="text-base font-bold text-white mt-1 mb-3">
                  {L('Besoin d\'une pièce ou d\'un dépannage ?', 'Need a part or emergency repair?')}
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed mb-4">
                  {L(
                    'Envoyez une photo de votre pièce cassée ou une note vocale. Notre IA et nos experts s\'occupent de tout.',
                    'Send a photo of your broken part or a voice note. Our team handles the rest.'
                  )}
                </p>
              </div>

              <div className="space-y-2">
                <Link
                  href="/dashboard/marketplace"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950/40 border border-emerald-400/30"
                >
                  <span>🔍</span> {L('Rechercher une pièce d\'occasion', 'Search used part')}
                </Link>
                <button
                  onClick={() => alert('Veuillez dicter votre besoin ou joindre une photo sur WhatsApp.')}
                  className="w-full py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-gray-700 transition-colors"
                >
                  <span>🎤</span> {L('Demande par Note Vocale WhatsApp', 'WhatsApp Voice Request')}
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* VUE 2 : ESPACE VENDEUR & PRESTATAIRE DE SERVICE */}
      {activeRole === 'provider' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Métriques Prestataire */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-2xl p-4 border border-emerald-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">💵</span>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Ce mois
                </span>
              </div>
              <div className="text-xs text-gray-500 font-medium">{L('Gains Débloqués', 'Unlocked Earnings')}</div>
              <div className="text-lg font-extrabold text-emerald-700 mt-1">245 000 FCFA</div>
              <div className="text-[11px] text-gray-500 font-medium mt-1">Versés via Wave / Orange Money</div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl p-4 border border-amber-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">⏳</span>
                <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  En séquestre
                </span>
              </div>
              <div className="text-xs text-gray-500 font-medium">{L('Fonds en Attente de Test', 'Funds Pending Test')}</div>
              <div className="text-lg font-extrabold text-amber-700 mt-1">65 000 FCFA</div>
              <div className="text-[11px] text-amber-800 font-medium mt-1">2 montages en cours de validation</div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl p-4 border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">📥</span>
                <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  3 Nouvelles
                </span>
              </div>
              <div className="text-xs text-gray-500 font-medium">{L('Demandes d\'Intervention', 'Job Requests')}</div>
              <div className="text-lg font-extrabold text-gray-900 mt-1">3 Demandes</div>
              <div className="text-[11px] text-blue-700 font-semibold mt-1">Yopougon & Abobo N\'Dotré</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-indigo-50/50 rounded-2xl p-4 border border-purple-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">⭐</span>
                <span className="text-xs font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                  Certifié
                </span>
              </div>
              <div className="text-xs text-gray-500 font-medium">{L('Ma Réputation Garagiste', 'Mechanic Reputation')}</div>
              <div className="text-lg font-extrabold text-purple-900 mt-1">4.9 / 5 ⭐</div>
              <div className="text-[11px] text-purple-700 font-semibold mt-1">128 clients satisfaits</div>
            </div>

          </div>

          {/* Demandes reçues & Actions Prestataire */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Liste des prestations à réaliser */}
            <div className="lg:col-span-8 bg-gray-50/70 rounded-2xl p-5 border border-gray-200">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>📥</span> {L('Demandes de clients à valider / Réaliser :', 'Pending Customer Requests:')}
              </h3>

              <div className="space-y-3">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md">
                        Urgent VTC
                      </span>
                      <span className="text-xs text-gray-500 font-semibold">Toyota Hilux 2014</span>
                    </div>
                    <h4 className="text-sm font-extrabold text-gray-900 mt-1">
                      Vidange complète + Remplacement Kit d\'embrayage
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Client : Kouassi (VTC Yango) • Lieu : Cocody Angré • Main d\'œuvre : 25 000 FCFA
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-initial py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors">
                      Accepter (25k)
                    </button>
                    <button className="flex-1 sm:flex-initial py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors">
                      Proposer Devis
                    </button>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md">
                        Diagnostic Électrique
                      </span>
                      <span className="text-xs text-gray-500 font-semibold">Peugeot 308</span>
                    </div>
                    <h4 className="text-sm font-extrabold text-gray-900 mt-1">
                      Voyant Moteur & Contrôle Alternateur
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Client : Société BTP • Lieu : Yopougon Zone • Main d\'œuvre : 15 000 FCFA
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-initial py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors">
                      Accepter (15k)
                    </button>
                    <button className="flex-1 sm:flex-initial py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors">
                      Proposer Devis
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Outils Ferrailleur & Garagiste */}
            <div className="lg:col-span-4 bg-gradient-to-b from-emerald-900 to-teal-950 text-white rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-300 tracking-wider">
                  {L('Espace Revendeur & Garagiste', 'Seller & Garage Tools')}
                </span>
                <h4 className="text-base font-bold text-white mt-1 mb-3">
                  {L('Publier une pièce ou un service', 'Post a part or service')}
                </h4>
                <p className="text-xs text-emerald-100 leading-relaxed mb-4">
                  {L(
                    'Vous avez démonté un moteur ou une boîte d\'occasion ? Prenez une photo ou envoyez un vocal pour publier l\'annonce en 10 secondes.',
                    'Dismantled a used engine or gearbox? Take a photo or send a voice note to post in 10 seconds.'
                  )}
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => alert('Prise de photo pièce en cours...')}
                  className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950/40 border border-emerald-300/30"
                >
                  <span>📷</span> {L('Ajouter une Pièce en photo', 'Add Part Photo')}
                </button>
                <button
                  onClick={() => alert('Enregistrement vocal d\'annonce activé...')}
                  className="w-full py-2.5 px-4 bg-emerald-950 hover:bg-emerald-900 text-emerald-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-emerald-700 transition-colors"
                >
                  <span>🎙️</span> {L('Dictée Vocale d\'Annonce (Dioula/Wolof/FR)', 'Voice Ad Dictation')}
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
