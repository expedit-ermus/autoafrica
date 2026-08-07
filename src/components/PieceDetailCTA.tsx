'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import { PaymentLogosGroup } from '@/components/PaymentLogos';

interface PieceDetailCTAProps {
  productId: string;
  title: string;
  brand: string;
  reference: string;
  price: number;
  image: string;
}

export default function PieceDetailCTA({
  productId,
  title,
  brand,
  reference,
  price,
  image,
}: PieceDetailCTAProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

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
      {/* Action 1 : WhatsApp Vendeur */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm sm:text-base rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-emerald-950/30 border border-emerald-400/30 cursor-pointer"
      >
        <span>💬</span> Contacter le Vendeur sur WhatsApp
      </a>

      {/* Action 2 : Commander avec Séquestre Mobile Money (Ajoute au panier et redirige vers le paiement) */}
      <button
        type="button"
        onClick={handleAddToCartAndCheckout}
        disabled={loading}
        className="w-full py-3.5 px-6 bg-gray-900 hover:bg-gray-800 text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
      >
        <span>🛒</span>
        {loading ? 'Préparation de la commande...' : 'Commander avec Séquestre Mobile Money'}
      </button>

      {/* Payment Logos Bar */}
      <div className="pt-2 flex flex-col items-center gap-1.5 border-t border-gray-100">
        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Paiements par Séquestre Sécurisé :</span>
        <PaymentLogosGroup className="flex flex-wrap items-center justify-center gap-2" />
      </div>
    </div>
  );
}
