'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import StockAlertModal from '@/components/StockAlertModal';
import { PaymentLogosGroup } from '@/components/PaymentLogos';

interface PieceDetailCTAProps {
  productId: string;
  title: string;
  brand: string;
  reference: string;
  price: number;
  image: string;
  stock?: number;
}

export default function PieceDetailCTA({
  productId,
  title,
  brand,
  reference,
  price,
  image,
  stock = 10,
}: PieceDetailCTAProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);

  const whatsappMessage = encodeURIComponent(
    `Bonjour, je suis intéressé par la pièce "${title}" (Réf: ${reference}) au prix de ${price.toLocaleString()} FCFA sur AutoAfrique.`
  );
  const whatsappUrl = `https://wa.me/2250708091011?text=${whatsappMessage}`;

  const handleAddToCartAndCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('cart');
        const currentCart = saved ? JSON.parse(saved) : [];

        const newItem = {
          id: `item-${Date.now()}`,
          productId: productId || 'prod-1',
          title: title || 'Pièce Auto',
          brand: brand || 'Toyota',
          reference: reference || 'REF-AUTO',
          price: price || 25000,
          quantity: 1,
          image: image || '/logo.png',
        };

        const updatedCart = [newItem, ...currentCart.filter((i: { productId: string }) => i.productId !== productId)];
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('aa-cart-updated'));

        addToast('success', `Pièce "${title}" ajoutée au panier ! Redirection vers le paiement...`);
      }
    } catch {
      // Fallback
    }

    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard/cart');
    }, 600);
  };

  return (
    <div className="space-y-3 pt-2">
      {/* Stock Status Badge */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs font-semibold">
        <span className="text-gray-500">Disponibilité Magasin :</span>
        {stock > 5 ? (
          <span className="text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full font-extrabold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            En Stock ({stock} dispo)
          </span>
        ) : stock > 0 ? (
          <span className="text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full font-extrabold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Stock Limité ({stock} restante{stock > 1 ? 's' : ''})
          </span>
        ) : (
          <span className="text-red-700 bg-red-100 px-2.5 py-1 rounded-full font-extrabold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            Rupture de Stock
          </span>
        )}
      </div>

      {/* Action 1 : WhatsApp Vendeur */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm sm:text-base rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-emerald-950/30 border border-emerald-400/30 cursor-pointer"
      >
        <span>💬</span> Contacter le Vendeur sur WhatsApp
      </a>

      {/* Action 2 : Commander avec Séquestre Mobile Money */}
      <button
        type="button"
        onClick={handleAddToCartAndCheckout}
        disabled={loading}
        className="w-full py-3.5 px-6 bg-gray-900 hover:bg-gray-800 text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
      >
        <span>🛒</span>
        {loading ? 'Préparation de la commande...' : 'Commander avec Séquestre Mobile Money'}
      </button>

      {/* Action 3 : Alerte Réassort */}
      <button
        type="button"
        onClick={() => setShowStockModal(true)}
        className="w-full py-2.5 px-4 bg-orange-50 hover:bg-orange-100 text-orange-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all border border-orange-200 cursor-pointer"
      >
        <span>🔔</span> M&apos;alerter en cas de baisse de prix ou réassort
      </button>

      <StockAlertModal
        isOpen={showStockModal}
        onClose={() => setShowStockModal(false)}
        productTitle={title}
        productReference={reference}
      />

      {/* Payment Logos Bar */}
      <div className="pt-2 flex flex-col items-center gap-1.5 border-t border-gray-100">
        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Paiements par Séquestre Sécurisé :</span>
        <PaymentLogosGroup className="flex flex-wrap items-center justify-center gap-2" />
      </div>
    </div>
  );
}
