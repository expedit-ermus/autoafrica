'use client';

import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import Link from 'next/link';

export default function RoleServicesHub() {
  const { locale } = useApp();
  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const [activeRole, setActiveRole] = useState<'buyer' | 'provider'>('buyer');
  const [modalType, setModalType] = useState<'voice' | 'photo' | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  const openModal = (type: 'voice' | 'photo') => {
    setModalType(type);
    setIsAnalyzing(true);
    setAnalysisStep(1);

    setTimeout(() => {
      setAnalysisStep(2);
    }, 1200);

    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisStep(3);
    }, 2400);
  };

  const closeModal = () => {
    setModalType(null);
    setIsAnalyzing(false);
    setAnalysisStep(0);
  };

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
            type="button"
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
            type="button"
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
              <div className="text-sm font-extrabold text-gray-900 mt-1">Amortisseur N&apos;Dotré #14</div>
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
              <div className="text-sm font-extrabold text-gray-900 mt-1">Pièce ET Main d&apos;œuvre</div>
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
                    <div className="font-extrabold text-gray-900">Remplacement Paire d&apos;Amortisseurs + Rotules</div>
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
                    <span className="font-bold text-gray-800">Ferraille N&apos;Dotré Magasin #14</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">{L('Garantie :', 'Warranty:')}</span>
                    <span className="font-bold text-emerald-600">Pièce + Montage (30 jours)</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-2">
                  <a
                    href="https://wa.me/2250708091011"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <span>💬</span> {L('WhatsApp Maître Diallo', 'WhatsApp Mechanic')}
                  </a>
                  <Link
                    href="/dashboard/orders"
                    className="py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-lg transition-colors"
                  >
                    {L('Voir le reçu & Séquestre', 'View Receipt & Escrow')}
                  </Link>
                </div>
              </div>
            </div>

            {/* Actions Rapides Acheteur */}
            <div className="lg:col-span-4 bg-emerald-900 rounded-2xl p-5 text-white flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  {L('Besoin d\'une pièce urgente ?', 'Need an urgent part?')}
                </span>
                <h4 className="text-base font-extrabold mt-1 mb-2">
                  {L('Recherche & Assistant IA Vocale', 'Search & Voice AI Assistant')}
                </h4>
                <p className="text-xs text-emerald-100 leading-relaxed mb-4">
                  {L(
                    'Prenez une photo de votre pièce cassée ou dictez votre besoin vocalement en Français, Dioula ou Wolof.',
                    'Take a photo of your broken part or dictate your request in French, Dioula or Wolof.'
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
                  type="button"
                  onClick={() => openModal('voice')}
                  className="w-full py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-gray-700 transition-colors cursor-pointer"
                >
                  <span>🎤</span> {L('Assistant Vocale IA AutoAfrique', 'AutoAfrique AI Voice Assistant')}
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
                <span className="text-2xl">💰</span>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Ce mois
                </span>
              </div>
              <div className="text-xs text-gray-500 font-medium">{L('Revenus Séquestre Débloqués', 'Unlocked Escrow Revenue')}</div>
              <div className="text-lg font-extrabold text-emerald-900 mt-1">485 000 FCFA</div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-1">12 montages & ventes validés</div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl p-4 border border-amber-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🔒</span>
                <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  En attente
                </span>
              </div>
              <div className="text-xs text-gray-500 font-medium">{L('En Séquestre Client', 'In Customer Escrow')}</div>
              <div className="text-lg font-extrabold text-amber-900 mt-1">140 000 FCFA</div>
              <div className="text-[11px] text-amber-700 font-semibold mt-1">Déblocage après test 24h</div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50/50 rounded-2xl p-4 border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">📋</span>
                <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  Nouveaux
                </span>
              </div>
              <div className="text-xs text-gray-500 font-medium">{L('Demandes d\'Intervention', 'Job Requests')}</div>
              <div className="text-lg font-extrabold text-gray-900 mt-1">3 Demandes</div>
              <div className="text-[11px] text-blue-700 font-semibold mt-1">Yopougon & Abobo N&apos;Dotré</div>
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
                      Vidange complète + Remplacement Kit d&apos;embrayage
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Client : Kouassi (VTC Yango) • Lieu : Cocody Angré • Main d&apos;œuvre : 25 000 FCFA
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button type="button" className="flex-1 sm:flex-initial py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors">
                      Accepter (25k)
                    </button>
                    <button type="button" className="flex-1 sm:flex-initial py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors">
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
                      Client : Société BTP • Lieu : Yopougon Zone • Main d&apos;œuvre : 15 000 FCFA
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button type="button" className="flex-1 sm:flex-initial py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors">
                      Accepter (15k)
                    </button>
                    <button type="button" className="flex-1 sm:flex-initial py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors">
                      Proposer Devis
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Publication rapide de pièces par photo/vocal */}
            <div className="lg:col-span-4 bg-gradient-to-br from-emerald-900 to-teal-900 rounded-2xl p-5 text-white flex flex-col justify-between border border-emerald-800">
              <div>
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  {L('Espace Vendeur Casse / Magasin', 'Store / Scrapyard Seller')}
                </span>
                <h4 className="text-base font-extrabold mt-1 mb-2">
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
                  type="button"
                  onClick={() => openModal('photo')}
                  className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950/40 border border-emerald-300/30 cursor-pointer"
                >
                  <span>📷</span> {L('Publier par Photo IA (10s)', 'Post via AI Photo (10s)')}
                </button>
                <button
                  type="button"
                  onClick={() => openModal('voice')}
                  className="w-full py-2.5 px-4 bg-emerald-950 hover:bg-emerald-900 text-emerald-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-emerald-700 transition-colors cursor-pointer"
                >
                  <span>🎙️</span> {L('Dictée Vocale d\'Annonce (Dioula/Wolof/FR)', 'Voice Ad Dictation')}
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* MODAL INTERACTIF ASSISTANT IA VOCAL & PHOTO */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-gray-100 shadow-2xl space-y-5">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{modalType === 'voice' ? '🎙️' : '📷'}</span>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-base">
                    {modalType === 'voice'
                      ? L('Assistant IA Vocale (Multilingue)', 'AI Voice Assistant (Multilingual)')
                      : L('Reconnaissance IA Photo Pièce', 'AI Photo Part Recognition')}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {modalType === 'voice'
                      ? L('Français, Dioula, Wolof & Baoulé pris en charge', 'French, Dioula, Wolof & Baoule supported')
                      : L('Analyse visuelle et auto-catégorisation en 10s', 'Visual analysis & auto-categorization in 10s')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Corps Modal : Phase 1 / 2 (Analyse) */}
            {isAnalyzing ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl animate-pulse border border-emerald-200">
                  {modalType === 'voice' ? '🔊' : '🔍'}
                </div>
                <div>
                  <h4 className="font-extrabold text-gray-900 text-base">
                    {analysisStep === 1
                      ? (modalType === 'voice' ? L('Écoute de votre note vocale...', 'Listening to voice note...') : L('Scannage de la photo...', 'Scanning photo...'))
                      : L('Analyse et identification IA...', 'AI analysis & identification...')}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {modalType === 'voice'
                      ? L('Détection de la langue et de la référence véhicule', 'Detecting language & vehicle reference')
                      : L('Détection du composant auto et de l\'état d\'usure', 'Detecting auto component & wear condition')}
                  </p>
                </div>
                <div className="w-48 mx-auto h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-700"
                    style={{ width: analysisStep === 1 ? '45%' : '90%' }}
                  />
                </div>
              </div>
            ) : (
              /* Phase 3 : Résultat IA */
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase text-emerald-800">
                      {L('Résultat IA Validé', 'Validated AI Result')}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                      Précision 99%
                    </span>
                  </div>

                  {modalType === 'voice' ? (
                    <>
                      <div className="text-xs text-gray-600 italic">
                        &quot;Je cherche une paire d&apos;amortisseurs avant et rotules pour ma Toyota Corolla 2012&quot;
                      </div>
                      <div className="text-sm font-extrabold text-emerald-950 pt-1">
                        Paire d&apos;Amortisseurs Avant + Rotules • Toyota Corolla (2007 - 2014)
                      </div>
                      <div className="text-xs text-emerald-800 font-semibold">
                        Estimation Occasion Contrôle : 45 000 FCFA | Neuf OEM : 110 000 FCFA
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-xs text-gray-600 italic">
                        Photo analysée : Alternateur Diesel Reconditionné
                      </div>
                      <div className="text-sm font-extrabold text-emerald-950 pt-1">
                        Alternateur 12V 90A • Peugeot 307 / 407 HDi (2004 - 2011)
                      </div>
                      <div className="text-xs text-emerald-800 font-semibold">
                        Prix conseillé de mise en ligne : 35 000 FCFA (Garantie 30 jours)
                      </div>
                    </>
                  )}
                </div>

                {/* Actions de confirmation */}
                <div className="space-y-2 pt-1">
                  <a
                    href="https://wa.me/2250708091011"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950/30 border border-emerald-400/30"
                  >
                    <span>💬</span> {L('Envoyer la demande sur WhatsApp', 'Send request on WhatsApp')}
                  </a>
                  <Link
                    href="/dashboard/marketplace"
                    className="w-full py-2.5 px-4 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors text-center"
                  >
                    <span>🛒</span> {L('Voir les pièces disponibles en stock', 'View available stock parts')}
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
