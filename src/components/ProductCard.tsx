'use client';
import Image from 'next/image';
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
    <div className="group bg-white rounded-2xl border border-[#E8DDD0] hover:border-[#FF6B35]/40 hover:shadow-xl hover:shadow-[#FF6B35]/10 transition-all duration-300 overflow-hidden flex flex-col">
      <div className="relative aspect-square bg-[#FEF3E2] overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, 33vw"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />
        {discount && discount > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
            -{discount}%
          </div>
        )}
        <button className="absolute top-3 right-3 w-10 h-10 bg-white/85 hover:bg-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm">
          <svg className="w-5 h-5 text-[#9A8A7A] hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < rating ? 'text-[#FFBA08]' : 'text-[#E8DDD0]'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-xs text-[#9A8A7A] ml-1 font-medium">({reviewCount})</span>
        </div>

        <div className="text-xs text-[#FF6B35] mb-1 font-bold">{brand}</div>
        <h3 className="text-sm font-bold text-[#2D1B0E] mb-1 line-clamp-2 flex-1">{name}</h3>
        <div className="text-xs text-[#9A8A7A] mb-3 font-medium">Réf.: {reference}</div>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-lg font-extrabold text-[#1E3A5F]">{formatPrice(price)}</span>
            {oldPrice && (
              <span className="text-sm text-[#9A8A7A] line-through">{formatPrice(oldPrice)}</span>
            )}
          </div>
          <div className="text-xs text-[#9A8A7A] mb-3 font-medium">{L('Prix par pièce', 'Price per piece')}</div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {inStock ? (
                <>
                  <span className="w-2.5 h-2.5 bg-[#059669] rounded-full"></span>
                  <span className="text-xs text-[#059669] font-bold">
                    {location ? `${L('Disponible', 'Available')} ${location}` : L('En stock', 'In stock')}
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2.5 h-2.5 bg-[#DC2626] rounded-full"></span>
                  <span className="text-xs text-[#DC2626] font-bold">{L('Rupture de stock', 'Out of stock')}</span>
                </>
              )}
            </div>

            <button className="w-10 h-10 bg-gradient-to-r from-[#FF6B35] to-[#FF8C00] hover:from-[#FF5520] hover:to-[#E85D04] text-white rounded-xl flex items-center justify-center transition-all shadow-md shadow-[#FF6B35]/25">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
