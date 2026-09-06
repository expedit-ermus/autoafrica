'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import RemoteImage from '@/components/RemoteImage';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/contexts/ToastContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { track } from '@/lib/tracking';

/** Cle et forme de ligne partagees avec /dashboard/cart et PieceDetailCTA. */
const CART_KEY = 'cart';

interface CartLine {
  id: string;
  productId: string;
  title: string;
  brand: string;
  reference: string;
  price: number;
  quantity: number;
  image: string;
}

interface ProductCardProps {
  id?: string;
  name: string;
  reference: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  image: string;
  brand: string;
  inStock: boolean;
  location?: string;
  priority?: boolean;
  condition?: 'new' | 'aftermarket' | 'used_imported' | 'used_local';
}

export default function ProductCard({
  id,
  name,
  reference,
  price,
  oldPrice,
  discount,
  rating,
  reviewCount,
  image,
  brand,
  inStock,
  location,
  priority = false,
  condition = 'new',
}: ProductCardProps) {
  const { locale } = useApp();
  const { addToast } = useToast();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [addedToCart, setAddedToCart] = useState(false);

  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('fr-FR').format(p) + ' FCFA';
  };

  const productId = id || reference || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const productSlug = productId;
  const productUrl = `/pieces/${productSlug}`;

  const isFav = isWishlisted(productId);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: productId,
      title: name,
      price,
      image,
      category: brand,
      inStock,
    });
    addToast(
      'info',
      !isFav
        ? L('Ajouté à vos pièces favorites !', 'Added to your favorite parts!')
        : L('Retiré de vos favoris', 'Removed from favorites')
    );
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Le bouton se contentait auparavant d'afficher « ajoutée au panier »
    // sans rien ecrire : le panier restait vide. On utilise ici le meme
    // contrat de stockage que /dashboard/marketplace et PieceDetailCTA.
    try {
      const saved = localStorage.getItem(CART_KEY);
      const cart: CartLine[] = saved ? JSON.parse(saved) : [];
      const existing = cart.find((item) => item.productId === productId);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          id: crypto.randomUUID(),
          productId,
          title: name,
          brand,
          reference,
          price,
          quantity: 1,
          image,
        });
      }
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      window.dispatchEvent(new Event('aa-cart-updated'));
    } catch {
      addToast('error', L('Impossible d\'ajouter la pièce au panier', 'Could not add the part to the cart'));
      return;
    }

    track('add_to_cart', { entity: 'product', entityId: productId, product_id: productId, price, quantity: 1 });
    setAddedToCart(true);
    addToast(
      'success',
      L(`Pièce "${name}" ajoutée au panier !`, `Part "${name}" added to cart!`)
    );
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/80 hover:border-orange-500/40 hover:shadow-2xl hover:shadow-slate-300/50 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col relative">
      
      {/* Image & Badges */}
      <div className="relative aspect-square bg-slate-50/80 overflow-hidden border-b border-slate-100">
        <Link href={productUrl} className="block w-full h-full">
          <RemoteImage
            src={image || '/logo.png'}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, 33vw"
            className="object-contain p-4 group-hover:scale-108 transition-transform duration-500"
            priority={priority}
          />
        </Link>

        {discount && discount > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-md pointer-events-none tracking-wide">
            -{discount}%
          </div>
        )}

        {/* Bouton Favori Glassmorphism */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          title={L('Ajouter aux favoris', 'Add to favorites')}
          className="absolute top-3 right-3 w-10 h-10 bg-white/85 hover:bg-white backdrop-blur-md rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm z-10 cursor-pointer border border-white/60 hover:scale-110 active:scale-95"
        >
          <svg
            className={`w-5 h-5 transition-colors ${
              isFav ? 'text-red-500 fill-red-500' : 'text-slate-400 hover:text-red-500'
            }`}
            fill={isFav ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      {/* Détails Produit */}
      <div className="p-5 flex flex-col flex-1">
        
        {/* Étoiles Avis & Marque */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="text-xs font-extrabold uppercase tracking-wider text-orange-600 bg-orange-50/80 px-2.5 py-0.5 rounded-md border border-orange-200/60">{brand}</div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-3.5 h-3.5 ${i < rating ? 'text-amber-400' : 'text-slate-200'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-[11px] text-slate-400 font-medium">({reviewCount})</span>
          </div>
        </div>

        {/* État de la Pièce */}
        <div className="flex items-center gap-2 mb-2">
          {condition === 'new' && (
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wide">
              {L('Neuf (OEM)', 'New (OEM)')}
            </span>
          )}
          {condition === 'aftermarket' && (
            <span className="bg-amber-50 text-amber-700 border border-amber-200/80 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wide">
              {L('Adaptable', 'Aftermarket')}
            </span>
          )}
          {condition === 'used_imported' && (
            <span className="bg-blue-50 text-blue-700 border border-blue-200/80 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wide">
              {L('Venant (Occasion)', 'Imported Used')}
            </span>
          )}
          {condition === 'used_local' && (
            <span className="bg-slate-100 text-slate-700 border border-slate-200/80 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wide">
              {L('Occasion Locale', 'Local Used')}
            </span>
          )}
        </div>
        
        <Link href={productUrl} className="hover:text-orange-600 transition-colors group/title">
          <h3 className="text-sm font-extrabold text-slate-900 mb-1 line-clamp-2 flex-1 font-heading leading-snug">{name}</h3>
        </Link>
        
        <div className="text-[11px] text-slate-400 mb-4 font-mono font-medium">Réf. {reference}</div>

        <div className="mt-auto pt-3 border-t border-slate-100">
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="text-lg font-black text-slate-900 font-heading">{formatPrice(price)}</span>
            {oldPrice && (
              <del className="text-xs text-slate-400 font-medium">{formatPrice(oldPrice)}</del>
            )}
          </div>
          <div className="text-[11px] text-slate-400 mb-3 font-medium">{L('Prix fixe garanti', 'Guaranteed fixed price')}</div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {inStock ? (
                <>
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-[11px] text-emerald-700 font-extrabold">
                    {location ? `${L('Dispo', 'Available')} ${location}` : L('En stock', 'In stock')}
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  <span className="text-[11px] text-amber-700 font-extrabold">{L('Sur commande', 'On order')}</span>
                </>
              )}
            </div>

            {/* Bouton Ajout Panier 10K */}
            <button
              type="button"
              onClick={handleAddToCart}
              title={L('Ajouter au panier', 'Add to cart')}
              className={`h-9 px-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md font-extrabold text-xs cursor-pointer active:scale-95 ${
                addedToCart
                  ? 'bg-emerald-600 text-white shadow-emerald-900/30'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/25 border border-white/20'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
              <span>{addedToCart ? '✓' : L('+ Panier', '+ Cart')}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
