'use client';
import { useState } from 'react';
import QRCodeDisplay from './QRCodeDisplay';

interface Props {
  amount: number;
  currency: string;
  vehicleInfo?: string;
  onPaymentInitiated: (provider: string, phone: string) => void;
  onPaymentComplete: (txId: string) => void;
}

const providers = [
  {
    id: 'orange_money', name: 'Orange Money', color: '#FF6600', icon: 'OM',
    countries: ['CI', 'SN', 'ML', 'BF', 'NE', 'TG', 'BJ'],
    fee: '1.5%', min: 100, max: 5000000,
    flow: [
      'Entrez votre numéro Orange Money',
      'Vous recevrez une demande de paiement sur votre téléphone',
      'Entrez votre code PIN Orange Money',
      'Confirmez le paiement',
    ],
  },
  {
    id: 'mtn_momo', name: 'MTN Mobile Money', color: '#FFCC00', icon: 'MTN',
    countries: ['NG', 'GH', 'CI', 'BJ', 'NE'],
    fee: '1.8%', min: 100, max: 7000000,
    flow: [
      'Entrez votre numéro MTN MoMo',
      'Une requête USSD sera envoyée sur votre téléphone',
      'Entrez votre PIN MTN',
      'Paiement confirmé instantanément',
    ],
  },
  {
    id: 'wave', name: 'Wave', color: '#00B4D8', icon: 'W',
    countries: ['SN', 'CI', 'BF', 'ML'],
    fee: '1.0%', min: 100, max: 10000000,
    flow: [
      'Entrez votre numéro Wave',
      'Ouvrez l\'application Wave sur votre téléphone',
      'Appuyez sur "Approuver" pour valider',
      'Paiement traité en 3 secondes',
    ],
  },
  {
    id: 'moov_money', name: 'Moov Money', color: '#0066CC', icon: 'M',
    countries: ['BJ', 'CI', 'BF', 'TG', 'NE'],
    fee: '1.5%', min: 100, max: 5000000,
    flow: [
      'Entrez votre numéro Moov Money',
      'Répondez à la notification sur votre téléphone',
      'Entrez votre code PIN',
      'Paiement validé',
    ],
  },
];

export default function MobileMoneyGateway({ amount, currency, vehicleInfo, onPaymentInitiated, onPaymentComplete }: Props) {
  const [selectedProvider, setSelectedProvider] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState<'select' | 'phone' | 'processing' | 'confirm' | 'success' | 'failed'>('select');
  const [processingStep, setProcessingStep] = useState(0);
  const [txId, setTxId] = useState('');

  const formatCFA = (n: number) => new Intl.NumberFormat('fr-FR').format(n);
  const provider = providers.find(p => p.id === selectedProvider);

  const calculateFee = () => {
    if (!provider) return 0;
    const pct = parseFloat(provider.fee) / 100;
    return Math.ceil(amount * pct);
  };

  const handleInitiate = () => {
    if (!selectedProvider || !phoneNumber) return;
    setStep('processing');
    onPaymentInitiated(selectedProvider, phoneNumber);

    // Simulate STK Push / USSD flow
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setProcessingStep(currentStep);
      if (currentStep >= 3) {
        clearInterval(interval);
        const mockTxId = `MM-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
        setTxId(mockTxId);
        setStep('confirm');
      }
    }, 1500);
  };

  const handleConfirm = () => {
    setStep('processing');
    setProcessingStep(0);
    setTimeout(() => {
      setProcessingStep(1);
      setTimeout(() => {
        setProcessingStep(2);
        setTimeout(() => {
          setStep('success');
          onPaymentComplete(txId);
        }, 1000);
      }, 1000);
    }, 500);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="gradient-primary p-5 text-white">
        <h3 className="text-lg font-bold mb-1">Paiement Mobile Money</h3>
        <p className="text-orange-100 text-sm">{formatCFA(amount)} {currency}</p>
        {vehicleInfo && <p className="text-orange-200 text-xs mt-1">🚗 {vehicleInfo}</p>}
      </div>

      {step === 'select' && (
        <div className="p-5 space-y-4">
          <p className="text-sm font-medium text-gray-700">Choisissez votre moyen de paiement :</p>
          <div className="grid grid-cols-2 gap-3">
            {providers.map(p => (
              <button key={p.id} onClick={() => setSelectedProvider(p.id)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  selectedProvider === p.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-100 hover:border-gray-200 bg-gray-50'
                }`}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: p.color }}>
                  {p.icon}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-900">{p.name}</p>
                  <p className="text-xs text-gray-500">Frais: {p.fee}</p>
                </div>
              </button>
            ))}
          </div>

          {selectedProvider && (
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-xs font-medium text-blue-800 mb-2">📋 Comment ça marche :</p>
              <ol className="space-y-2">
                {provider!.flow.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-blue-700">
                    <span className="w-4 h-4 rounded-full bg-blue-200 flex items-center justify-center text-[10px] font-bold mt-0.5">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {selectedProvider && (
            <button onClick={() => setStep('phone')} className="btn-primary w-full text-center !py-3">
              Continuer
            </button>
          )}
        </div>
      )}

      {step === 'phone' && (
        <div className="p-5 space-y-4">
          <button onClick={() => setStep('select')} className="text-sm text-gray-500 hover:text-orange-600">← Retour</button>
          <div>
            <label htmlFor="mmg-phone" className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
            <div className="flex gap-2">
              <select id="mmg-country" aria-label="Indicatif pays" className="input-field !w-24">
                <option>+225</option>
                <option>+221</option>
                <option>+223</option>
                <option>+226</option>
                <option>+227</option>
                <option>+228</option>
                <option>+229</option>
                <option>+233</option>
                <option>+234</option>
              </select>
              <input id="mmg-phone" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                className="input-field flex-1" placeholder="07 08 09 10" />
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Véhicule</span>
              <span className="font-medium">{vehicleInfo || '-'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Montant</span>
              <span className="font-bold">{formatCFA(amount)} {currency}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Frais de service</span>
              <span className="font-medium text-orange-600">+ {formatCFA(calculateFee())} FCFA</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-extrabold text-orange-600">{formatCFA(amount + calculateFee())} FCFA</span>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs text-gray-500">
            <input type="checkbox" className="mt-0.5 rounded" />
            <span>J&apos;accepte les conditions de paiement et la politique de remboursement</span>
          </div>

          <button onClick={handleInitiate} disabled={!phoneNumber}
            className="btn-primary w-full text-center !py-3 disabled:opacity-50 disabled:cursor-not-allowed">
            Payer {formatCFA(amount + calculateFee())} FCFA via {provider?.name}
          </button>
        </div>
      )}

      {step === 'processing' && (
        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin mx-auto mb-4"></div>
          <p className="font-bold text-gray-900 mb-2">Traitement en cours...</p>
          {processingStep === 0 && <p className="text-sm text-gray-500">Connexion à {provider?.name}...</p>}
          {processingStep === 1 && <p className="text-sm text-gray-500">Envoi de la demande sur votre téléphone...</p>}
          {processingStep === 2 && <p className="text-sm text-gray-500">Validation du paiement...</p>}
          {processingStep >= 3 && <p className="text-sm text-gray-500">Confirmation...</p>}
          <div className="mt-4 bg-orange-50 rounded-xl p-3 text-xs text-orange-700">
            📱 Vérifiez votre téléphone pour confirmer le paiement
          </div>
        </div>
      )}

      {step === 'confirm' && (
        <div className="p-5 space-y-4">
          <div className="bg-yellow-50 rounded-xl p-4 text-center">
            <p className="text-lg mb-2">📱</p>
            <p className="text-sm font-bold text-yellow-800">Demande de paiement reçue</p>
            <p className="text-xs text-yellow-700 mt-1">Entrez votre PIN sur votre téléphone pour confirmer</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Transaction</p>
            <p className="font-mono text-sm font-bold">{txId}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setStep('failed'); }} className="flex-1 px-4 py-3 rounded-xl border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50">
              Annuler
            </button>
            <button onClick={handleConfirm} className="flex-1 btn-primary text-sm !py-3 text-center">
              ✓ Paiement effectué
            </button>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h4 className="text-lg font-extrabold text-gray-900 mb-2">Paiement réussi !</h4>
          <p className="text-sm text-gray-500 mb-4">Votre paiement a été confirmé</p>

          <div className="flex justify-center mb-4">
            <QRCodeDisplay
              data={`autoafrique:payment:${txId}:${amount}:${currency}`}
              title="Reçu de paiement"
              subtitle={`${provider?.name} • ${phoneNumber}`}
              size={140}
            />
          </div>

          <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Référence</span>
              <span className="font-mono font-bold">{txId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Montant</span>
              <span className="font-bold">{formatCFA(amount)} {currency}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Méthode</span>
              <span>{provider?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Statut</span>
              <span className="badge badge-success">Confirmé</span>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700">
            📩 Un SMS de confirmation a été envoyé au {phoneNumber}
          </div>
        </div>
      )}

      {step === 'failed' && (
        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✕</span>
          </div>
          <h4 className="text-lg font-extrabold text-gray-900 mb-2">Paiement échoué</h4>
          <p className="text-sm text-gray-500 mb-4">Le paiement n&apos;a pas pu être traité</p>
          <button onClick={() => { setStep('select'); setProcessingStep(0); }} className="btn-primary text-sm">
            Réessayer
          </button>
        </div>
      )}
    </div>
  );
}
