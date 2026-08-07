'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/contexts/ToastContext';
import { PaymentLogo } from '@/components/PaymentLogos';

export default function PaiementPage() {
  const { addToast } = useToast();
  const [selectedOperator, setSelectedOperator] = useState<string>('Wave');
  const [phone, setPhone] = useState<string>('+225 07 08 09 10 11');
  const [step, setStep] = useState<'select' | 'ussd' | 'success'>('select');
  const [loading, setLoading] = useState(false);

  const operators = [
    { name: 'Wave', key: 'wave', code: '*144#' },
    { name: 'Djamo Visa', key: 'djamo', code: 'App Djamo' },
    { name: 'Orange Money', key: 'orange', code: '#144#' },
    { name: 'MTN MoMo', key: 'mtn', code: '*133#' },
    { name: 'Moov Money', key: 'moov', code: '*155#' },
  ];

  const handleSimulatePayment = () => {
    if (!phone || phone.length < 8) {
      addToast('error', 'Veuillez saisir un numéro Mobile Money valide.');
      return;
    }
    setStep('ussd');
  };

  const handleConfirmUssd = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('success');
      addToast('success', `Paiement Séquestre ${selectedOperator} validé avec succès !`);
    }, 1200);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            🔒 Séquestre Mobile Money Garanti
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Moyens de Paiement Sécurisés sur AutoAfrique
          </h1>
          <p className="text-slate-600 text-base max-w-2xl mx-auto">
            Payez vos pièces détachées en toute sécurité via votre opérateur Mobile Money habituel. Vos fonds restent en compte séquestre jusqu&apos;à réception conforme de la pièce.
          </p>
        </div>

        {/* Simulateur de Paiement Séquestre Interactif */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                ⚡ Démonstration Interactive du Paiement Séquestre
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Testez en direct le flux d&apos;encaissement Mobile Money ouest-africain.
              </p>
            </div>
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
              Mode Démo Live
            </span>
          </div>

          {step === 'select' && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  1. Choisissez votre opérateur Mobile Money :
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {operators.map((op) => (
                    <button
                      key={op.name}
                      type="button"
                      onClick={() => setSelectedOperator(op.name)}
                      className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        selectedOperator === op.name
                          ? 'border-emerald-600 bg-emerald-50 shadow-md ring-2 ring-emerald-200'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <PaymentLogo name={op.key} size={36} />
                      <span className="text-xs font-bold text-slate-800">{op.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="mobileMoneyPhone" className="block text-sm font-bold text-slate-700 mb-2">
                  2. Votre numéro de téléphone {selectedOperator} :
                </label>
                <input
                  id="mobileMoneyPhone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+225 0708091011"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 font-mono text-base focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-semibold block">Montant du test</span>
                  <span className="text-xl font-extrabold text-emerald-900">25 000 FCFA</span>
                </div>
                <span className="text-xs font-bold text-slate-600">
                  Frais : 0 FCFA (Pris en charge)
                </span>
              </div>

              <button
                type="button"
                onClick={handleSimulatePayment}
                className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-emerald-900/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🔒</span> Lancer la demande de paiement {selectedOperator}
              </button>
            </div>
          )}

          {step === 'ussd' && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-3xl mx-auto animate-bounce">
                📲
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Prompt USSD envoyé sur {phone}
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Une notification de validation {selectedOperator} apparaît sur votre mobile. Entrez votre code PIN secret pour autoriser les 25 000 FCFA.
                </p>
              </div>

              <div className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-2xl max-w-sm mx-auto text-left space-y-1 shadow-inner">
                <p className="text-slate-400"># USSD Mobile Money Simulation</p>
                <p>&gt; Merchant: AutoAfrique SaaS Escrow</p>
                <p>&gt; Amount: 25,000 XOF</p>
                <p>&gt; Provider: {selectedOperator}</p>
                <p className="text-amber-400 animate-pulse">&gt; Waiting for PIN confirmation...</p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep('select')}
                  className="py-3 px-5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleConfirmUssd}
                  disabled={loading}
                  className="py-3 px-7 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-colors cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Validation en cours...' : 'Simuler Saisie PIN USSD Validée'}
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-3xl mx-auto">
                ✅
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Paiement Séquestre Validé avec Succès !
                </h3>
                <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  Vos 25 000 FCFA sont placés sous séquestre sécurisé. Le vendeur est informé et prépare l&apos;expédition de votre commande.
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setStep('select')}
                  className="py-3 px-6 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Refaire un test
                </button>
                <Link
                  href="/dashboard/cart"
                  className="py-3 px-6 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors"
                >
                  Voir mon panier & commandes
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Section FAQ Paiements */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900">
            Foire Aux Questions sur les Paiements
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
              <h3 className="font-bold text-slate-900">Est-ce que le paiement est sécurisé ?</h3>
              <p className="text-slate-600 text-xs">
                Oui. AutoAfrique utilise le paiement sous séquestre. L&apos;argent ne parvient au vendeur qu&apos;une fois que la pièce est livrée et vérifiée.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
              <h3 className="font-bold text-slate-900">Quels pays sont supportés ?</h3>
              <p className="text-slate-600 text-xs">
                Côte d&apos;Ivoire (Wave, Orange, MTN, Moov, Djamo), Sénégal (Wave, Orange), Mali, Burkina Faso, Togo, Bénin, Niger.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
              <h3 className="font-bold text-slate-900">Y a-t-il des frais cachés ?</h3>
              <p className="text-slate-600 text-xs">
                Aucun. Le montant affiché en FCFA sur le panier est le montant exact prélevé sur votre solde Mobile Money.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
              <h3 className="font-bold text-slate-900">Que se passe-t-il en cas de retour ?</h3>
              <p className="text-slate-600 text-xs">
                Si la pièce n&apos;est pas conforme, vous êtes intégralement remboursé directement sur votre compte Mobile Money en 24h.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
