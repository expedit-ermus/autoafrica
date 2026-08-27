'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import RemoteImage from '@/components/RemoteImage';
import Sidebar from '@/components/Sidebar';
import DashboardTopBar from '@/components/DashboardTopBar';
import { useToast } from '@/contexts/ToastContext';
import { useApp } from '@/contexts/AppContext';
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
  { id: 'wave', name: 'Wave' },
  { id: 'djamo', name: 'Djamo Visa' },
  { id: 'orange', name: 'Orange Money' },
  { id: 'mtn', name: 'MTN MoMo' },
  { id: 'moov', name: 'Moov Money' },
];

const DELIVERY_ZONES = [
  { id: 'cocody', name: 'Cocody', price: 2000 },
  { id: 'plateau', name: 'Plateau', price: 2000 },
  { id: 'marcory', name: 'Marcory', price: 2000 },
  { id: 'treichville', name: 'Treichville', price: 2000 },
  { id: 'yopougon', name: 'Yopougon', price: 2500 },
  { id: 'adjame', name: 'Adjamé', price: 2000 },
  { id: 'koumassi', name: 'Koumassi', price: 2500 },
  { id: 'port_bouet', name: 'Port-Bouët', price: 3000 },
  { id: 'abobo', name: 'Abobo', price: 3000 },
  { id: 'interieur', name: 'Intérieur / Gare routière', price: 4000 },
];

export default function CartPage() {
  const { addToast } = useToast();
  const { locale } = useApp();
  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {}
    }
    setMounted(true);
  }, []);

  const [checking, setChecking] = useState(false);
  const [selectedZone, setSelectedZone] = useState('cocody');

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
    addToast('info', L('Article retiré du panier', 'Item removed from cart'));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const currentZone = DELIVERY_ZONES.find(z => z.id === selectedZone);
  const shipping = cart.length > 0 ? (currentZone?.price || 0) : 0;
  const total = subtotal + shipping;

  const handleOpenCheckout = () => {
    if (cart.length === 0) {
      addToast('error', L('Votre panier est vide', 'Your cart is empty'));
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
      addToast('success', L(`Paiement Séquestre ${selectedOperator.toUpperCase()} validé avec succès !`, `Escrow Payment ${selectedOperator.toUpperCase()} successfully validated!`));

      setTimeout(() => {
        setShowPaymentModal(false);
        window.location.href = '/dashboard/orders';
      }, 1800);
    } catch {
      addToast('error', L('Erreur lors du paiement', 'Error during payment'));
      track('payment_fail', { provider: selectedOperator });
    } finally {
      setChecking(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 lg:ml-64 min-w-0">
        <DashboardTopBar />

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {cart.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 max-w-md mx-auto my-12">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                🛒
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-2">
                {L('Votre panier est vide', 'Your cart is empty')}
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                {L('Explorez le catalogue pour ajouter des pièces neuves ou d\'occasion contrôlée.', 'Explore the catalog to add new or certified used parts.')}
              </p>
              <Link
                href="/dashboard/marketplace"
                className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-orange-900/20 transition-all"
              >
                {L('Parcourir le catalogue', 'Browse the catalog')}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Articles dans le panier */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-extrabold text-slate-900">
                    {L('Mon Panier', 'My Cart')} ({cart.length} {L('article', 'item')}{cart.length > 1 ? 's' : ''})
                  </h1>
                  <button
                    type="button"
                    onClick={() => updateCart([])}
                    className="text-xs text-red-600 font-bold hover:underline cursor-pointer"
                  >
                    {L('Vider le panier', 'Clear cart')}
                  </button>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
                  {cart.map((item) => (
                    <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-xl border border-slate-100 p-2 shrink-0 flex items-center justify-center">
                          <RemoteImage
                            src={item.image || '/logo.png'}
                            alt={item.title}
                            width={50}
                            height={50}
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-orange-600 uppercase">{item.brand}</span>
                          <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                          <p className="text-xs text-slate-400">Réf: {item.reference}</p>
                          <div className="text-sm font-extrabold text-slate-900 mt-1">
                            {item.price.toLocaleString()} FCFA
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200 rounded-l-xl cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-bold flex items-center justify-center">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200 rounded-r-xl cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 p-2 text-xs font-bold cursor-pointer"
                          title={L('Supprimer', 'Remove')}
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
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100">
                    {L('Résumé de la commande', 'Order Summary')}
                  </h3>

                  <div className="space-y-4 text-sm text-slate-600">
                    <div className="flex justify-between">
                      <span>{L('Sous-total', 'Subtotal')}</span>
                      <span className="font-bold text-slate-900">{subtotal.toLocaleString()} FCFA</span>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700">
                        {L('Zone de livraison', 'Delivery Zone')}
                      </label>
                      <select 
                        value={selectedZone}
                        onChange={(e) => setSelectedZone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-3 py-2 outline-none focus:border-orange-500 cursor-pointer"
                      >
                        {DELIVERY_ZONES.map(zone => (
                          <option key={zone.id} value={zone.id}>
                            {zone.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex justify-between">
                      <span>{L('Frais de livraison', 'Shipping fees')}</span>
                      <span className="font-bold text-slate-900">{shipping.toLocaleString()} FCFA</span>
                    </div>
                    
                    <div className="pt-3 border-t border-slate-100 flex justify-between text-base font-extrabold text-slate-900">
                      <span>{L('Total TTC', 'Total')}</span>
                      <span className="text-orange-600">{total.toLocaleString()} FCFA</span>
                    </div>
                  </div>

                  <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">🔒</span>
                    <p className="text-xs text-orange-900 font-medium">
                      {L('Fonds bloqués en séquestre jusqu\'à vérification de conformité par votre mécanicien.', 'Funds held in escrow until compliance check by your mechanic.')}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenCheckout}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-slate-900/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {L('Payer en toute sécurité', 'Pay securely')}
                  </button>

                  {/* Opérateurs supportés */}
                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 text-center">
                      {L('Moyens de paiement acceptés', 'Accepted payment methods')}
                    </span>
                    <div className="flex justify-center gap-2 flex-wrap">
                      {MOBILE_MONEY_OPERATORS.map((op) => (
                        <div key={op.id} className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                           <PaymentLogo name={op.id} size={24} />
                        </div>
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-fade-in">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔒</span>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {L('Paiement Séquestre Mobile Money', 'Mobile Money Escrow Payment')}
                  </h3>
                  <p className="text-xs text-slate-500">{L('Montant total :', 'Total amount:')} {total.toLocaleString()} FCFA</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {paymentStep === 'operator' && (
              <div className="space-y-4">
                
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                  <span className="text-lg">🛡️</span>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {L('Vos fonds sont protégés. Le vendeur ne sera payé que lorsque vous aurez confirmé la réception et la conformité de votre pièce.', 'Your funds are protected. The seller will only be paid once you have confirmed receipt and conformity of your part.')}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    {L('1. Choisissez votre opérateur', '1. Choose your provider')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {MOBILE_MONEY_OPERATORS.map((op) => (
                      <button
                        key={op.id}
                        type="button"
                        onClick={() => setSelectedOperator(op.id)}
                        className={`p-3 rounded-2xl border text-left font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                          selectedOperator === op.id
                            ? 'border-orange-600 bg-orange-50 text-orange-900 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-slate-50">
                          <PaymentLogo name={op.id} size={24} />
                        </div>
                        {op.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    {L('2. Numéro de téléphone Mobile Money', '2. Mobile Money phone number')}
                  </label>
                  <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden px-3 py-2 bg-slate-50">
                    <span className="text-xs font-bold text-slate-500 mr-2">+225</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0708091011"
                      className="w-full text-sm font-mono font-bold bg-transparent outline-none text-slate-900"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPaymentStep('pin')}
                  className="w-full py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-orange-900/20 transition-all cursor-pointer"
                >
                  {L('Continuer vers la validation', 'Continue to validation')}
                </button>
              </div>
            )}

            {paymentStep === 'pin' && (
              <div className="space-y-4 text-center">
                <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl mx-auto">
                  📲
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">{L('Validation USSD Mobile Money', 'Mobile Money USSD Validation')}</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {L('Un prompt USSD va être envoyé au', 'A USSD prompt will be sent to')} <span className="font-bold text-slate-900">+225 {phone}</span> {L('pour bloquer', 'to block')} {total.toLocaleString()} FCFA {L('en séquestre.', 'in escrow.')}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    {L('Code PIN de démonstration', 'Demo PIN Code')} (ex: 1234)
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="••••"
                    className="w-32 mx-auto text-center text-xl font-bold tracking-widest py-2 border border-slate-300 rounded-xl bg-slate-50 outline-none focus:border-orange-600"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentStep('operator')}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    {L('Retour', 'Back')}
                  </button>
                  <button
                    type="button"
                    disabled={checking}
                    onClick={processPayment}
                    className="flex-2 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-slate-900/20 cursor-pointer disabled:opacity-70"
                  >
                    {checking ? L('Validation Séquestre...', 'Validating Escrow...') : L('Confirmer le paiement', 'Confirm Payment')}
                  </button>
                </div>
              </div>
            )}

            {paymentStep === 'success' && (
              <div className="py-6 text-center space-y-3">
                <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-3xl mx-auto shadow-lg shadow-green-500/30 animate-bounce">
                  ✓
                </div>
                <h4 className="font-extrabold text-slate-900 text-lg">{L('Paiement Séquestre Confirmé !', 'Escrow Payment Confirmed!')}</h4>
                <p className="text-xs text-slate-500">
                  {L('Votre commande a été transmise au vendeur. Redirection vers le suivi de commande...', 'Your order has been sent to the seller. Redirecting to order tracking...')}
                </p>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
