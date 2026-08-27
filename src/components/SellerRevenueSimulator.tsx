'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';

export default function SellerRevenueSimulator() {
  const { locale } = useApp();
  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const [partsSold, setPartsSold] = useState<number>(30);
  const [avgPrice, setAvgPrice] = useState<number>(50000);
  const [formula, setFormula] = useState<'decouverte' | 'starter' | 'pro'>('starter');

  const formulaRates = {
    decouverte: 0.08,
    starter: 0.05,
    pro: 0.03
  };

  const revenue = useMemo(() => partsSold * avgPrice, [partsSold, avgPrice]);
  const feeRate = formulaRates[formula];
  const marketplaceFee = useMemo(() => revenue * feeRate, [revenue, feeRate]);
  const netPayout = useMemo(() => revenue - marketplaceFee, [revenue, marketplaceFee]);

  const formatFCFA = (val: number) => {
    return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 text-white shadow-xl">
      <div className="mb-6">
        <h3 className="text-xl sm:text-2xl font-black mb-2 text-white">
          {L('Simulateur de Revenus', 'Revenue Simulator')}
        </h3>
        <p className="text-slate-400 text-sm">
          {L('Estimez vos gains mensuels sur AutoAfrique.', 'Estimate your monthly earnings on AutoAfrique.')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="text-sm font-bold text-slate-300">
                {L('Pièces vendues / mois', 'Parts sold / month')}
              </label>
              <span className="text-lg font-black text-orange-400">{partsSold}</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              step="1"
              value={partsSold}
              onChange={(e) => setPartsSold(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="text-sm font-bold text-slate-300">
                {L('Prix moyen par pièce', 'Average price per part')}
              </label>
              <span className="text-lg font-black text-orange-400">{formatFCFA(avgPrice)}</span>
            </div>
            <input
              type="range"
              min="15000"
              max="250000"
              step="5000"
              value={avgPrice}
              onChange={(e) => setAvgPrice(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-300 mb-3 block">
              {L('Formule choisie', 'Selected formula')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setFormula('decouverte')}
                className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all ${
                  formula === 'decouverte'
                    ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {L('Découverte (8%)', 'Discovery (8%)')}
              </button>
              <button
                onClick={() => setFormula('starter')}
                className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all ${
                  formula === 'starter'
                    ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {L('Starter (5%)', 'Starter (5%)')}
              </button>
              <button
                onClick={() => setFormula('pro')}
                className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all ${
                  formula === 'pro'
                    ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {L('Pro (3%)', 'Pro (3%)')}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 flex flex-col justify-center space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <span className="text-slate-400 text-sm">
              {L('Revenu estimé', 'Estimated revenue')}
            </span>
            <span className="text-lg font-bold text-white">{formatFCFA(revenue)}</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <span className="text-slate-400 text-sm">
              {L('Frais de plateforme', 'Platform fee')}
            </span>
            <span className="text-lg font-bold text-red-400">
              - {formatFCFA(marketplaceFee)}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-slate-300 font-bold">
              {L('Versement net', 'Net payout')}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">
              {formatFCFA(netPayout)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
