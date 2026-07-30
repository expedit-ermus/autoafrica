'use client';
import { useState } from 'react';

export default function CrossBorderPayments() {
  const [fromCountry, setFromCountry] = useState('CI');
  const [toCountry, setToCountry] = useState('SN');
  const [amount, setAmount] = useState('');

  const countries = [
    { code: 'CI', name: 'Côte d\'Ivoire', currency: 'FCFA (XOF)', flag: '🇨🇮' },
    { code: 'SN', name: 'Sénégal', currency: 'FCFA (XOF)', flag: '🇸🇳' },
    { code: 'ML', name: 'Mali', currency: 'FCFA (XOF)', flag: '🇲🇱' },
    { code: 'BF', name: 'Burkina Faso', currency: 'FCFA (XOF)', flag: '🇧🇫' },
    { code: 'NE', name: 'Niger', currency: 'FCFA (XOF)', flag: '🇳🇪' },
    { code: 'BJ', name: 'Bénin', currency: 'FCFA (XOF)', flag: '🇧🇯' },
    { code: 'TG', name: 'Togo', currency: 'FCFA (XOF)', flag: '🇹🇬' },
    { code: 'GW', name: 'Guinée-Bissau', currency: 'FCFA (XOF)', flag: '🇬🇼' },
    { code: 'NG', name: 'Nigeria', currency: 'Naira (NGN)', flag: '🇳🇬' },
    { code: 'GH', name: 'Ghana', currency: 'Cedi (GHS)', flag: '🇬🇭' },
  ];

  const crossBorderRates: Record<string, number> = {
    'CI-SN': 1, 'CI-ML': 1, 'CI-BF': 1, 'CI-NE': 1, 'CI-BJ': 1, 'CI-TG': 1, 'CI-GW': 1,
    'CI-NG': 0.00154, 'CI-GH': 0.0115,
  };

  const from = countries.find(c => c.code === fromCountry);
  const to = countries.find(c => c.code === toCountry);
  const rateKey = `${fromCountry}-${toCountry}`;
  const rate = crossBorderRates[rateKey] || 1;
  const isCFAZone = ['CI', 'SN', 'ML', 'BF', 'NE', 'BJ', 'TG', 'GW'].includes(fromCountry) &&
    ['CI', 'SN', 'ML', 'BF', 'NE', 'BJ', 'TG', 'GW'].includes(toCountry);

  const convertedAmount = isCFAZone ? Number(amount) : Math.ceil(Number(amount) * rate);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🌍</span>
          <div>
            <h3 className="font-bold">Paiements Transfrontaliers ECOWAS</h3>
            <p className="text-blue-100 text-sm">Envoyez de l&apos;argent dans toute l&apos;Afrique de l&apos;Ouest via PAPSS</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Country selector */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1">De</label>
            <select value={fromCountry} onChange={(e) => setFromCountry(e.target.value)}
              className="input-field">
              {countries.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>
          <div className="pt-6">
            <button onClick={() => { const tmp = fromCountry; setFromCountry(toCountry); setToCountry(tmp); }}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-orange-100 hover:text-orange-600 transition">
              ⇄
            </button>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1">Vers</label>
            <select value={toCountry} onChange={(e) => setToCountry(e.target.value)}
              className="input-field">
              {countries.filter(c => c.code !== fromCountry).map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Montant à envoyer</label>
          <div className="relative">
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
              className="input-field !pr-20 text-lg font-bold" placeholder="0" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
              {from?.currency.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* Conversion */}
        {amount && (
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Le destinataire recevra</p>
                <p className="text-xl font-extrabold text-blue-600">
                  {new Intl.NumberFormat('fr-FR').format(convertedAmount)} {to?.currency.split(' ')[0]}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Taux</p>
                {isCFAZone ? (
                  <span className="badge badge-success">1:1 Zone UEMOA</span>
                ) : (
                  <p className="text-sm font-bold">1 {from?.currency.split(' ')[0]} = {rate} {to?.currency.split(' ')[0]}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-lg">⚡</p>
            <p className="text-xs font-bold text-gray-900">Instantané</p>
            <p className="text-[10px] text-gray-500">PAPSS settlement</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-lg">💰</p>
            <p className="text-xs font-bold text-gray-900">Frais: 0.5%</p>
            <p className="text-[10px] text-gray-500">Min. 500 FCFA</p>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-xl p-3 text-xs text-yellow-700">
          🏦 Via <strong>PAPSS</strong> (Pan-African Payment and Settlement System) — règlement instantané en monnaie locale entre pays ECOWAS.
        </div>

        {amount && Number(amount) > 0 && (
          <button className="btn-primary w-full text-center !py-3">
            Envoyer {new Intl.NumberFormat('fr-FR').format(Number(amount))} {from?.currency.split(' ')[0]} vers {to?.flag} {to?.name}
          </button>
        )}
      </div>
    </div>
  );
}
