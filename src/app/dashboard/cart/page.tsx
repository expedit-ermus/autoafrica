'use client';
import { useState } from 'react';
import RemoteImage from '@/components/RemoteImage';
import Sidebar from '@/components/Sidebar';
import DashboardTopBar from '@/components/DashboardTopBar';
import { useToast } from '@/contexts/ToastContext';
import { track } from '@/lib/tracking';

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

export default function CartPage() {
  const { addToast } = useToast();
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [checking, setChecking] = useState(false);

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

  const handleCheckout = async () => {
    if (cart.length === 0) return;
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
      addToast('success', 'Commande passée avec succès !');
      window.location.href = '/dashboard/orders';
    } catch {
      addToast('error', 'Erreur lors de la commande');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 lg:ml-64 min-w-0">
        <DashboardTopBar />
        <main className="p-4 lg:p-8 pb-32 lg:pb-8">
          {/* ── Page Header ── */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Mon Panier</h1>
              <p className="text-sm text-gray-400">
                {cart.length > 0
                  ? `${cart.length} article${cart.length !== 1 ? 's' : ''} dans votre panier`
                  : 'Aucun article'}
              </p>
            </div>
            {cart.length > 0 && (
              <span className="ml-auto inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white text-sm font-bold shadow-lg shadow-orange-500/25">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>

          {/* ── Empty State ── */}
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Votre panier est vide</h3>
              <p className="text-gray-400 text-sm text-center max-w-xs mb-8">
                Parcourez notre marketplace pour trouver les pièces détachées dont vous avez besoin
              </p>
              <a
                href="/dashboard/marketplace"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-sm shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Parcourir le Marketplace
              </a>
            </div>
          ) : (
            /* ── Cart Grid ── */
            <div className="grid lg:grid-cols-3 gap-6">
              {/* ── Cart Items ── */}
              <div className="lg:col-span-2 space-y-3">
                {cart.map((item, index) => (
                  <div
                    key={item.id}
                    className="group bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:border-orange-100 hover:shadow-lg hover:shadow-orange-500/5 hover:-translate-y-0.5"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-stretch">
                      {/* Image */}
                      <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0 bg-gray-100">
                        <RemoteImage
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="144px"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 p-3 sm:p-4 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate leading-tight">{item.title}</h3>
                            <p className="text-xs text-gray-400 mt-0.5">{item.brand} · {item.reference}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors duration-200"
                            title="Retirer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>

                        {/* Price + Quantity */}
                        <div className="flex items-center justify-between mt-2 sm:mt-0">
                          <p className="text-base sm:text-lg font-extrabold text-orange-600">
                            {item.price.toLocaleString()} <span className="text-xs font-semibold text-orange-400">FCFA</span>
                          </p>

                          <div className="flex items-center gap-0 bg-gray-50 rounded-xl border border-gray-100">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-9 h-9 rounded-l-xl flex items-center justify-center text-gray-500 hover:bg-white hover:text-orange-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="w-10 text-center text-sm font-bold text-gray-900 tabular-nums">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-9 h-9 rounded-r-xl flex items-center justify-center text-gray-500 hover:bg-white hover:text-orange-600 transition-colors duration-200"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Line total (mobile only) */}
                    <div className="sm:hidden px-4 pb-3 pt-1 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-xs text-gray-400">Sous-total</span>
                      <span className="text-sm font-bold text-gray-900">{(item.price * item.quantity).toLocaleString()} FCFA</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Order Summary (sticky on desktop) ── */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-24">
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    {/* Header accent */}
                    <div className="h-1 bg-gradient-to-r from-orange-500 to-orange-600" />

                    <div className="p-5 sm:p-6">
                      <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Résumé de la commande
                      </h3>

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Sous-total ({cart.length} article{cart.length !== 1 ? 's' : ''})</span>
                          <span className="font-semibold text-gray-700">{subtotal.toLocaleString()} FCFA</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Livraison</span>
                          <span className="font-semibold text-gray-700">{shipping.toLocaleString()} FCFA</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Taxes (TVA)</span>
                          <span className="font-semibold text-gray-700">0 FCFA</span>
                        </div>
                        <div className="border-t border-gray-100 pt-4 mt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-base font-bold text-gray-900">Total</span>
                            <span className="text-xl font-extrabold text-orange-600 tabular-nums">{total.toLocaleString()} <span className="text-sm font-semibold">FCFA</span></span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleCheckout}
                        disabled={checking}
                        className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        {checking ? (
                          <>
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Commande en cours...
                          </>
                        ) : (
                          <>
                            Passer la commande
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </>
                        )}
                      </button>

                      <div className="mt-3 text-center">
                        <p className="text-xs text-gray-400">Paiement à la livraison ou Expédition par Gare Routière</p>
                      </div>

                      <div className="mt-5 pt-4 border-t border-gray-100 text-center">
                        <a
                          href="/dashboard/marketplace"
                          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-orange-600 transition-colors duration-200 font-medium"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                          </svg>
                          Continuer les achats
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Trust badges */}
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {[
                      { icon: '🔒', label: 'Paiement sécurisé' },
                      { icon: '🚚', label: 'Livraison rapide' },
                      { icon: '↩️', label: 'Retour 30 jours' },
                    ].map((badge) => (
                      <div key={badge.label} className="text-center py-3 bg-white rounded-xl border border-gray-100">
                        <div className="text-lg mb-1">{badge.icon}</div>
                        <p className="text-[10px] text-gray-400 font-medium leading-tight">{badge.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
