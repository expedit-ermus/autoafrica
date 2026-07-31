'use client';
import { useApp } from '@/contexts/AppContext';

interface ProductCardProps {
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
}

export default function ProductCard({
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
}: ProductCardProps) {
  const { locale } = useApp();
  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('fr-FR').format(p) + ' FCFA';
  };

  return (
    <div className="group bg-white rounded-xl border border-gray-100 hover:border-[#FF6B35]/30 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {discount && discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </div>
        )}
        <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm">
          <svg className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`w-3.5 h-3.5 ${i < rating ? 'text-[#FF6B35]' : 'text-gray-200'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-xs text-gray-400 ml-1">({reviewCount})</span>
        </div>

        <div className="text-xs text-gray-400 mb-1">{brand}</div>
        <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2 flex-1">{name}</h3>
        <div className="text-xs text-gray-400 mb-3">Réf.: {reference}</div>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-lg font-bold text-[#1E3A5F]">{formatPrice(price)}</span>
            {oldPrice && (
              <span className="text-sm text-gray-400 line-through">{formatPrice(oldPrice)}</span>
            )}
          </div>
          <div className="text-xs text-gray-400 mb-3">{L('Prix par pièce', 'Price per piece')}</div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {inStock ? (
                <>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-xs text-green-600 font-medium">
                    {location ? `${L('Disponible', 'Available')} ${location}` : L('En stock', 'In stock')}
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span className="text-xs text-red-500 font-medium">{L('Rupture de stock', 'Out of stock')}</span>
                </>
              )}
            </div>

            <button className="w-9 h-9 bg-[#FF6B35] hover:bg-[#FF5520] text-white rounded-lg flex items-center justify-center transition-colors shadow-sm shadow-[#FF6B35]/25">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
