'use client';

import React from 'react';
import Link from 'next/link';
import { useWishlist } from '@/contexts/WishlistContext';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/contexts/ToastContext';
import RemoteImage from '@/components/RemoteImage';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { locale } = useApp();
  const { addToast } = useToast();

  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('fr-FR').format(p) + ' FCFA';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            {L('Mes Pièces Favorites', 'My Favorite Parts')}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {wishlist.length === 0
              ? L('Vous n\'avez encore aucun article dans vos favoris.', 'You have no items in your favorites yet.')
              : L(`Vous avez ${wishlist.length} article(s) enregistré(s).`, `You have ${wishlist.length} saved item(s).`)}
          </p>
        </div>

        {wishlist.length > 0 && (
          <button
            type="button"
            onClick={() => {
              clearWishlist();
              addToast('info', L('Tous les favoris ont été retirés.', 'All favorites have been removed.'));
            }}
            className="self-start sm:self-auto text-xs font-semibold text-red-600 hover:text-red-700 hover:underline px-3 py-2 border border-red-200 rounded-xl bg-red-50/50 transition-colors"
          >
            {L('Vider les favoris', 'Clear all favorites')}
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80 max-w-lg mx-auto my-12 shadow-sm">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
            ❤️
          </div>
          <h2 className="text-lg font-black text-slate-900 mb-2">
            {L('Votre liste de favoris est vide', 'Your wishlist is empty')}
          </h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            {L('Explorez notre catalogue de pièces détachées et cliquez sur le cœur pour sauvegarder vos articles.', 'Browse our spare parts catalog and click the heart icon to save items.')}
          </p>
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black px-6 py-3 rounded-2xl transition-all shadow-md text-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{L('Découvrir le catalogue', 'Explore Catalog')}</span>
            <span>➔</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/80 hover:border-orange-500/40 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col relative group"
            >
              <button
                type="button"
                onClick={() => {
                  removeFromWishlist(item.id);
                  addToast('info', L('Article retiré des favoris', 'Item removed from favorites'));
                }}
                title={L('Retirer des favoris', 'Remove from favorites')}
                className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-red-500 hover:text-red-700 shadow-sm z-10"
              >
                ✕
              </button>

              <div className="relative aspect-square bg-slate-50 overflow-hidden p-4">
                <RemoteImage
                  src={item.image || '/logo.png'}
                  alt={item.title}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-5 flex flex-col flex-1">
                {item.category && (
                  <span className="text-[11px] font-black text-orange-600 uppercase tracking-wider mb-1">
                    {item.category}
                  </span>
                )}

                <Link href={`/pieces/${item.id}`} className="hover:text-orange-600 transition-colors">
                  <h3 className="text-sm font-bold text-slate-900 mb-2 line-clamp-2 leading-snug">{item.title}</h3>
                </Link>

                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-base font-black text-slate-900">{formatPrice(item.price)}</span>
                  <Link
                    href={`/pieces/${item.id}`}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-black transition-all shadow-sm"
                  >
                    {L('Voir', 'View')}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
