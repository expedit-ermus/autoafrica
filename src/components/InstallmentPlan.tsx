'use client';
import { useState } from 'react';

interface InstallmentPlan {
  duration: number;
  downPayment: number;
  monthly: number;
  provider: string;
}

interface Props {
  vehicleName: string;
  vehiclePrice: number;
  onPlanSelected: (plan: InstallmentPlan) => void;
}

export default function InstallmentPlan({ vehicleName, vehiclePrice, onPlanSelected }: Props) {
  const [selectedPlan, setSelectedPlan] = useState(0);
  const [downPayment, setDownPayment] = useState(0);
  const [duration, setDuration] = useState(12);
  const [provider, setProvider] = useState('orange_money');

  const formatCFA = (n: number) => new Intl.NumberFormat('fr-FR').format(n);

  const calculateMonthly = () => {
    const financed = vehiclePrice - downPayment;
    const rate = 0.035; // 3.5% monthly interest
    const monthly = (financed * rate * Math.pow(1 + rate, duration)) / (Math.pow(1 + rate, duration) - 1);
    return Math.ceil(monthly);
  };

  const plans = [
    { duration: 6, label: '6 mois', rate: '2.5%/mois', color: 'bg-blue-500' },
    { duration: 12, label: '12 mois', rate: '3.5%/mois', color: 'bg-orange-500' },
    { duration: 18, label: '18 mois', rate: '4.0%/mois', color: 'bg-purple-500' },
    { duration: 24, label: '24 mois', rate: '4.5%/mois', color: 'bg-red-500' },
  ];

  const monthly = calculateMonthly();
  const totalCost = downPayment + monthly * duration;
  const totalInterest = totalCost - vehiclePrice;

  const paymentMethods = [
    { id: 'orange_money', name: 'Orange Money', color: '#FF6600' },
    { id: 'mtn_momo', name: 'MTN MoMo', color: '#FFCC00' },
    { id: 'wave', name: 'Wave', color: '#00B4D8' },
    { id: 'moov_money', name: 'Moov Money', color: '#0066CC' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-5 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">📅</span>
          <div>
            <h3 className="font-bold">Paiement en Plusieurs fois</h3>
            <p className="text-purple-100 text-sm">Achetez maintenant, payez en plusieurs fois via Mobile Money</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Vehicle info */}
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm font-medium text-gray-700">{vehicleName}</p>
          <p className="text-xl font-extrabold text-orange-600">{formatCFA(vehiclePrice)} FCFA</p>
        </div>

        {/* Down payment */}
        <div>
          <label htmlFor="dp-amount" className="block text-sm font-medium text-gray-700 mb-2">Apport initial</label>
          <div className="flex gap-2 mb-2">
            {[10, 20, 30, 50].map(pct => (
              <button key={pct} onClick={() => setDownPayment(Math.ceil(vehiclePrice * pct / 100))}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${
                  downPayment === Math.ceil(vehiclePrice * pct / 100)
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {pct}%
              </button>
            ))}
          </div>
          <div className="relative">
            <input id="dp-amount" type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))}
              className="input-field !pr-16" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">FCFA</span>
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Durée du paiement</label>
          <div role="group" aria-label="Durée du paiement" className="grid grid-cols-4 gap-2">
            {plans.map((p, i) => (
              <button key={p.duration} onClick={() => { setSelectedPlan(i); setDuration(p.duration); }}
                className={`py-3 rounded-xl text-center transition-all ${
                  selectedPlan === i
                    ? `${p.color} text-white shadow-lg scale-105`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                <p className="text-sm font-bold">{p.label}</p>
                <p className="text-[10px] opacity-80">{p.rate}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Payment method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mode de paiement des mensualités</label>
          <div role="group" aria-label="Mode de paiement des mensualités" className="grid grid-cols-2 gap-2">
            {paymentMethods.map(pm => (
              <button key={pm.id} onClick={() => setProvider(pm.id)}
                className={`flex items-center gap-2 p-3 rounded-xl border transition ${
                  provider === pm.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-100 hover:border-gray-200'
                }`}>
                <div className="w-6 h-6 rounded flex items-center justify-center text-white text-[8px] font-bold" style={{ background: pm.color }}>
                  {pm.name[0]}
                </div>
                <span className="text-xs font-medium">{pm.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-purple-50 rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Apport initial</span>
            <span className="font-bold">{formatCFA(downPayment)} FCFA</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Mensualité</span>
            <span className="font-extrabold text-purple-600">{formatCFA(monthly)} FCFA/mois</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Durée</span>
            <span className="font-medium">{duration} mois</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Coût total</span>
            <span className="font-bold">{formatCFA(totalCost)} FCFA</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Intérêts</span>
            <span className="font-medium text-orange-600">+{formatCFA(totalInterest)} FCFA</span>
          </div>
        </div>

        {/* Auto-debit info */}
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-xs font-bold text-blue-800 mb-2">🔄 Paiement automatique</p>
          <p className="text-xs text-blue-700 leading-relaxed">
            Les mensualités seront automatiquement débitées de votre compte {paymentMethods.find(p => p.id === provider)?.name} chaque mois. Vous recevrez un SMS de confirmation à chaque débit.
          </p>
        </div>

        <button onClick={() => onPlanSelected({ duration, downPayment, monthly, provider })}
          className="btn-primary w-full text-center !py-3">
          Valider le plan de paiement
        </button>
      </div>
    </div>
  );
}
