'use client';
import { useState } from 'react';

const ussdMenus = [
  {
    id: 'home',
    title: 'Menu Principal',
    options: [
      { label: 'Rechercher un véhicule', action: 'search' },
      { label: 'Mes transactions', action: 'transactions' },
      { label: 'Payer un véhicule', action: 'pay' },
      { label: 'Mon compte', action: 'account' },
      { label: 'Aide', action: 'help' },
    ],
  },
  {
    id: 'search',
    title: 'Rechercher',
    options: [
      { label: 'Par marque', action: 'brand' },
      { label: 'Par ville', action: 'city' },
      { label: 'Par prix', action: 'price' },
      { label: 'Véhicules vedettes', action: 'featured' },
      { label: '0. Retour', action: 'home' },
    ],
  },
  {
    id: 'pay',
    title: 'Payer un véhicule',
    options: [
      { label: 'Payer par Orange Money', action: 'pay_om' },
      { label: 'Payer par MTN MoMo', action: 'pay_mtn' },
      { label: 'Payer par Wave', action: 'pay_wave' },
      { label: 'Payer par Moov Money', action: 'pay_moov' },
      { label: '0. Retour', action: 'home' },
    ],
  },
  {
    id: 'transactions',
    title: 'Mes transactions',
    options: [
      { label: 'Dernière transaction', action: 'last_tx' },
      { label: 'Historique', action: 'history' },
      { label: 'Reçu SMS', action: 'receipt' },
      { label: '0. Retour', action: 'home' },
    ],
  },
  {
    id: 'account',
    title: 'Mon compte',
    options: [
      { label: 'Solde Mobile Money', action: 'balance' },
      { label: 'Limiter de transaction', action: 'limit' },
      { label: 'Changer de PIN', action: 'pin' },
      { label: '0. Retour', action: 'home' },
    ],
  },
  {
    id: 'help',
    title: 'Aide',
    options: [
      { label: 'Comment payer ?', action: 'how_to_pay' },
      { label: 'Séquestre', action: 'escrow_info' },
      { label: 'Contacter support', action: 'support' },
      { label: '0. Retour', action: 'home' },
    ],
  },
];

function makeTxRef(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}

export default function UssdPaymentFlow() {
  const [currentMenu, setCurrentMenu] = useState('home');
  const [history, setHistory] = useState<string[]>(['home']);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [showPinInput, setShowPinInput] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [txComplete, setTxComplete] = useState(false);
  const [txRef, setTxRef] = useState('');

  const menu = ussdMenus.find(m => m.id === currentMenu);

  const handleOption = (action: string) => {
    if (action === 'home' || action === 'search' || action === 'pay' || action === 'transactions' || action === 'account' || action === 'help') {
      setCurrentMenu(action);
      setHistory([...history, action]);
    } else if (action.startsWith('pay_')) {
      setSelectedProvider(action.replace('pay_', '').toUpperCase());
      setShowPhoneInput(true);
    } else if (action === 'brand' || action === 'city' || action === 'price' || action === 'featured') {
      setTxComplete(true);
      setTxRef(makeTxRef('SEARCH'));
    } else if (action === 'last_tx' || action === 'history' || action === 'receipt') {
      setTxComplete(true);
      setTxRef(makeTxRef('TX'));
    } else if (action === 'balance') {
      setTxComplete(true);
      setTxRef(makeTxRef('BAL'));
    } else if (action === 'how_to_pay' || action === 'escrow_info' || action === 'support') {
      setTxComplete(true);
    }
  };

  const handlePhoneSubmit = () => {
    setShowPhoneInput(false);
    setShowPinInput(true);
  };

  const handlePinSubmit = () => {
    setShowPinInput(false);
    setTxComplete(true);
    setTxRef(`MM-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`);
  };

  const handleBack = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setCurrentMenu(newHistory[newHistory.length - 1]);
    }
  };

  return (
    <div className="max-w-sm mx-auto">
      {/* Phone Frame */}
      <div className="bg-gray-900 rounded-[2rem] p-3 shadow-2xl">
        <div className="bg-white rounded-[1.5rem] overflow-hidden">
          {/* Status bar */}
          <div className="bg-gray-900 px-4 py-2 flex items-center justify-between">
            <span className="text-white text-[10px]">USSD</span>
            <span className="text-white text-[10px] font-mono">*144#</span>
            <span className="text-white text-[10px]">12:34</span>
          </div>

          {/* USSD Screen */}
          <div className="bg-[#1a1a2e] min-h-[350px] p-4 text-white font-mono text-sm">
            {!showPhoneInput && !showPinInput && !txComplete && menu && (
              <>
                <div className="text-center mb-4">
                  <p className="text-[#00ff88] font-bold text-xs mb-1">AutoAfrique</p>
                  <p className="text-yellow-400 text-xs border-b border-gray-700 pb-2">{menu.title}</p>
                </div>
                <div className="space-y-2">
                  {menu.options.map((opt, i) => (
                    <button key={i} onClick={() => handleOption(opt.action)}
                      className="block w-full text-left hover:bg-white/10 px-2 py-1.5 rounded transition text-xs">
                      {opt.action === 'home' ? '' : `${i + 1}. `}{opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}

            {showPhoneInput && (
              <div className="space-y-3">
                <p className="text-[#00ff88] font-bold text-xs text-center">AutoAfrique</p>
                <p className="text-yellow-400 text-xs text-center">Paiement {selectedProvider}</p>
                <div className="border border-gray-600 rounded p-3 space-y-3">
                  <div>
                    <label className="text-[10px] text-gray-400">Numéro de téléphone :</label>
                    <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-transparent border-b border-gray-600 text-white text-sm py-1 outline-none font-mono"
                      placeholder="+225 XX XX XX XX" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400">Montant (FCFA) :</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-transparent border-b border-gray-600 text-white text-sm py-1 outline-none font-mono"
                      placeholder="500000" />
                  </div>
                </div>
                <div className="flex justify-between text-[10px] text-gray-400">
                  <button onClick={() => { setShowPhoneInput(false); handleBack(); }} className="text-red-400">Annuler</button>
                  <button onClick={handlePhoneSubmit} className="text-[#00ff88]">Confirmer →</button>
                </div>
              </div>
            )}

            {showPinInput && (
              <div className="space-y-3">
                <p className="text-[#00ff88] font-bold text-xs text-center">AutoAfrique</p>
                <p className="text-yellow-400 text-xs text-center">Confirmer le paiement</p>
                <div className="border border-gray-600 rounded p-3 space-y-2 text-center">
                  <p className="text-[10px] text-gray-400">Montant : {new Intl.NumberFormat('fr-FR').format(Number(amount) || 0)} FCFA</p>
                  <p className="text-[10px] text-gray-400">Vers : {selectedProvider}</p>
                  <div>
                    <label className="text-[10px] text-gray-400">Entrez votre PIN :</label>
                    <input type="password" value={pin} onChange={(e) => setPin(e.target.value)}
                      className="w-full bg-transparent border-b border-gray-600 text-white text-sm py-1 outline-none font-mono text-center tracking-[0.5em]"
                      placeholder="••••" maxLength={4} />
                  </div>
                </div>
                <div className="flex justify-between text-[10px] text-gray-400">
                  <button onClick={() => { setShowPinInput(false); setShowPhoneInput(true); }} className="text-red-400">Retour</button>
                  <button onClick={handlePinSubmit} className="text-[#00ff88]">Payer →</button>
                </div>
              </div>
            )}

            {txComplete && (
              <div className="space-y-3 text-center">
                <p className="text-[#00ff88] font-bold text-xs">AutoAfrique</p>
                <div className="border border-green-600 rounded p-3">
                  <p className="text-green-400 text-lg mb-2">✓</p>
                  <p className="text-green-400 text-xs font-bold">Paiement réussi !</p>
                  {txRef && <p className="text-gray-400 text-[10px] mt-1">Réf: {txRef}</p>}
                  <p className="text-yellow-400 text-[10px] mt-2">SMS de confirmation envoyé</p>
                </div>
                <button onClick={() => { setTxComplete(false); setCurrentMenu('home'); setHistory(['home']); }}
                  className="text-[10px] text-gray-400 hover:text-white">
                  0. Menu principal
                </button>
              </div>
            )}
          </div>

          {/* Bottom bar */}
          <div className="bg-gray-900 px-4 py-3 flex justify-between">
            <button onClick={handleBack} className="text-white text-[10px] bg-gray-700 px-3 py-1 rounded">
              ← Retour
            </button>
            <button className="text-white text-[10px] bg-gray-700 px-3 py-1 rounded">
              Annuler
            </button>
            <button onClick={handleBack} className="text-white text-[10px] bg-gray-700 px-3 py-1 rounded">
              OK
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">Composez <span className="font-bold text-orange-600">*144#</span> sur votre téléphone</p>
        <p className="text-xs text-gray-400 mt-1">Disponible sur tous les téléphones, sans internet</p>
        <div className="flex justify-center gap-4 mt-3">
          {['Orange', 'MTN', 'Wave', 'Moov'].map(p => (
            <span key={p} className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">{p}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
