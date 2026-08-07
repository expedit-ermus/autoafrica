'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import RemoteImage from '@/components/RemoteImage';
import Sidebar from '@/components/Sidebar';
import DashboardTopBar from '@/components/DashboardTopBar';
import { useToast } from '@/contexts/ToastContext';
import { track } from '@/lib/tracking';
import { PaymentLogo } from '@/components/PaymentLogos';

interface CartItem {
  id: string;
  productId: string;
  title: string;
  brand: string;
  reference: string;
  price: number;
  quantity: number;
  image: string;
}

const MOBILE_MONEY_OPERATORS = [
  { id: 'wave', name: 'Wave', color: 'bg-cyan-500', icon: '🔵' },
  { id: 'djamo', name: 'Djamo Visa', color: 'bg-indigo-600', icon: '💳' },
  { id: 'orange', name: 'Orange Money', color: 'bg-orange-500', icon: '🟠' },
  { id: 'mtn', name: 'MTN MoMo', color: 'bg-yellow-500', icon: '🟡' },
  { id: 'moov', name: 'Moov Money', color: 'bg-blue-600', icon: '🔷' },
];

export default function CartPage() {
  const { addToast } = useToast();
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [checking, setChecking] = useState(false);

  // Modal de paiement Mobile Money Séquestre
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState('wave');
  const [phone, setPhone] = useState('0708091011');
  const [pinCode, setPinCode] = useState('');
  const [paymentStep, setPaymentStep] = useState<'operator' | 'pin' | 'success'>('operator');

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('aa-cart-updated'));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty < 1) return;
    updateCart(cart.map(item => item.id === id ? { ...item, quantity: qty } : item));
  };

  const removeItem = (id: string) => {
    const removed = cart.find(i => i.id === id);
    updateCart(cart.filter(item => item.id !== id));
    if (removed) track('remove_from_cart', { product_id: removed.productId });
    addToast('info', 'Article retiré du panier');
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = cart.length > 0 ? 2500 : 0;
  const total = subtotal + shipping;

  const handleOpenCheckout = () => {
    if (cart.length === 0) {
      addToast('error', 'Votre panier est vide');
      return;
    }
    setShowPaymentModal(true);
    setPaymentStep('operator');
  };

  const processPayment = async () => {
    setChecking(true);
    try {
      for (const item of cart) {
        await fetch('/api/v1/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            productId: item.productId,
            quantity: item.quantity,
          }),
        });
      }
      localStorage.removeItem('cart');
      setCart([]);
      setPaymentStep('success');
      track('payment_success', { amount: total, provider: selectedOperator });
      addToast('success', `Paiement Séquestre ${selectedOperator.toUpperCase()} validé avec succès !`);

      setTimeout(() => {
        setShowPaymentModal(false);
        window.location.href = '/dashboard/orders';
      }, 1800);
    } catch {
      addToast('error', 'Erreur lors du paiement Mobile Money');
      track('payment_fail', { provider: selectedOperator });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 lg:ml-64 min-w-0">
        <DashboardTopBar />

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {cart.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-gray-200 max-w-md mx-auto my-12">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                🛒
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 mb-2">Votre panier est vide</h2>
              <p className="text-sm text-gray-500 mb-6">
                Explorez le catalogue pour ajouter des pièces neuves ou d&apos;occasion contrôlée.
              </p>
              <Link
                href="/dashboard/marketplace"
                className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-950/20 transition-all"
              >
                Parcourir le catalogue
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Articles dans le panier */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-extrabold text-gray-900">
                    Mon Panier ({cart.length} article{cart.length > 1 ? 's' : ''})
                  </h1>
                  <button
                    type="button"
                    onClick={() => updateCart([])}
                    className="text-xs text-red-600 font-bold hover:underline"
                  >
                    Vider le panier
                  </button>
                </div>

                <div className="bg-white rounded-3xl border border-gray-200 divide-y divide-gray-100 overflow-hidden shadow-sm">
                  {cart.map((item) => (
                    <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-xl border border-gray-100 p-2 shrink-0 flex items-center justify-center">
                          <RemoteImage
                            src={item.image || '/logo.png'}
                            alt={item.title}
                            width={50}
                            height={50}
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-emerald-600 uppercase">{item.brand}</span>
                          <h3 className="font-bold text-gray-900 text-sm">{item.title}</h3>
                          <p className="text-xs text-gray-400">Réf: {item.reference}</p>
                          <div className="text-sm font-extrabold text-emerald-900 mt-1">
                            {item.price.toLocaleString()} FCFA
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200 rounded-l-xl"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200 rounded-r-xl"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 p-2 text-xs font-bold"
                          title="Supprimer"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Résumé de Commande & CTA Séquestre */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
                  <h3 className="text-base font-extrabold text-gray-900 pb-3 border-b border-gray-100">
                    Résumé de la commande
                  </h3>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Sous-total</span>
                      <span className="font-bold text-gray-900">{subtotal.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Livraison (Gare Routière / Tiak-Tiak)</span>
                      <span className="font-bold text-gray-900">{shipping.toLocaleString()} FCFA</span>
                    </div>
                    <div className="pt-3 border-t border-gray-100 flex justify-between text-base font-extrabold text-gray-900">
                      <span>Total TTC</span>
                      <span className="text-emerald-700">{total.toLocaleString()} FCFA</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenCheckout}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-950/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>🔒</span> Payer avec Séquestre Mobile Money
                  </button>

                  <div className="pt-2 text-center text-xs text-gray-500">
                    Déblocage des fonds uniquement après réception et test de la pièce.
                  </div>

                  {/* Opérateurs supportés */}
                  <div className="pt-3 border-t border-gray-100">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2 text-center">
                      Opérateurs partenaires acceptés
                    </span>
                    <div className="flex justify-center gap-1.5 flex-wrap">
                      {MOBILE_MONEY_OPERATORS.map((op) => (
                        <span key={op.id} className="text-xs px-2.5 py-1 bg-gray-100 rounded-lg font-bold text-gray-700">
                          {op.icon} {op.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </main>
      </div>

      {/* MODAL PAIEMENT SÉQUESTRE MOBILE MONEY */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-5 animate-fade-in">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔒</span>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-base">Paiement Séquestre Mobile Money</h3>
                  <p className="text-xs text-gray-500">Montant total : {total.toLocaleString()} FCFA</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            {paymentStep === 'operator' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                    1. Choisissez votre opérateur Mobile Money
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {MOBILE_MONEY_OPERATORS.map((op) => (
                      <button
                        key={op.id}
                        type="button"
                        onClick={() => setSelectedOperator(op.id)}
                        className={`p-3 rounded-2xl border text-left font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                          selectedOperator === op.id
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <PaymentLogo name={op.id} size={24} />
                        {op.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    2. Numéro de téléphone Mobile Money
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden px-3 py-2 bg-gray-50">
                    <span className="text-xs font-bold text-gray-500 mr-2">+225</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0708091011"
                      className="w-full text-sm font-mono font-bold bg-transparent outline-none text-gray-900"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPaymentStep('pin')}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-950/20 transition-all cursor-pointer"
                >
                  Continuer vers la validation PIN
                </button>
              </div>
            )}

            {paymentStep === 'pin' && (
              <div className="space-y-4 text-center">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-2xl mx-auto">
                  📲
                </div>
                <div>
                  <h4 className="font-extrabold text-gray-900 text-base">Validation USSD Mobile Money</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Un prompt USSD va être envoyé au <span className="font-bold text-gray-900">+225 {phone}</span> pour bloquer {total.toLocaleString()} FCFA en séquestre.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Code PIN de démonstration (ex: 1234)
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="••••"
                    className="w-32 mx-auto text-center text-xl font-bold tracking-widest py-2 border border-gray-300 rounded-xl bg-gray-50 outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentStep('operator')}
                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl"
                  >
                    Retour
                  </button>
                  <button
                    type="button"
                    disabled={checking}
                    onClick={processPayment}
                    className="flex-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-950/20 cursor-pointer"
                  >
                    {checking ? 'Validation Séquestre...' : 'Confirmer le paiement'}
                  </button>
                </div>
              </div>
            )}

            {paymentStep === 'success' && (
              <div className="py-6 text-center space-y-3">
                <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center text-3xl mx-auto shadow-lg shadow-emerald-500/30 animate-bounce">
                  ✓
                </div>
                <h4 className="font-extrabold text-gray-900 text-lg">Paiement Séquestre Confirmé !</h4>
                <p className="text-xs text-gray-500">
                  Votre commande a été transmise au vendeur. Redirection vers le suivi de commande...
                </p>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
