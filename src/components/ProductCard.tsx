'use client';
import RemoteImage from '@/components/RemoteImage';
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
  priority?: boolean;
  condition?: 'new' | 'aftermarket' | 'used_imported' | 'used_local';
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
  priority = false,
  condition = 'new',
}: ProductCardProps) {
  const { locale } = useApp();
  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('fr-FR').format(p) + ' FCFA';
  };

  return (
    <div className="group bg-white rounded-2xl border border-[var(--color-warm-border)] hover:border-[var(--color-primary)]/40 hover:shadow-xl hover:shadow-[var(--color-primary)]/10 transition-all duration-300 overflow-hidden flex flex-col">
      <div className="relative aspect-square bg-[var(--color-bg-warm)] overflow-hidden">
        <RemoteImage
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, 33vw"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          priority={priority}
        />
        {discount && discount > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
            -{discount}%
          </div>
        )}
        <button className="absolute top-3 right-3 w-10 h-10 bg-white/85 hover:bg-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm">
          <svg className="w-5 h-5 text-[var(--color-warm-muted)] hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < rating ? 'text-[var(--color-accent)]' : 'text-[var(--color-warm-border)]'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-xs text-[var(--color-warm-muted)] ml-1 font-medium">({reviewCount})</span>
        </div>

        <div className="flex items-center gap-2 mb-2">
          {condition === 'new' && (
            <span className="bg-[#059669]/10 text-[#059669] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
              {L('Neuf (OEM)', 'New (OEM)')}
            </span>
          )}
          {condition === 'aftermarket' && (
            <span className="bg-[#D97706]/10 text-[#D97706] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
              {L('Adaptable', 'Aftermarket')}
            </span>
          )}
          {condition === 'used_imported' && (
            <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
              {L('Venant (Occasion)', 'Imported Used')}
            </span>
          )}
          {condition === 'used_local' && (
            <span className="bg-[var(--color-warm-muted)]/10 text-[var(--color-warm-muted)] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
              {L('Occasion Locale', 'Local Used')}
            </span>
          )}
        </div>

        <div className="text-xs text-[var(--color-primary)] mb-1 font-bold">{brand}</div>
        <h3 className="text-sm font-bold text-[var(--color-warm-ink)] mb-1 line-clamp-2 flex-1">{name}</h3>
        <div className="text-xs text-[var(--color-warm-muted)] mb-3 font-medium">Réf.: {reference}</div>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-lg font-extrabold text-[var(--color-secondary)]">{formatPrice(price)}</span>
            {oldPrice && (
              <span className="text-sm text-[var(--color-warm-muted)] line-through">{formatPrice(oldPrice)}</span>
            )}
          </div>
          <div className="text-xs text-[var(--color-warm-muted)] mb-3 font-medium">{L('Prix par pièce', 'Price per piece')}</div>

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

            <button className="w-10 h-10 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-warm)] hover:from-[var(--color-orange-hover)] hover:to-[var(--color-primary-dark)] text-white rounded-xl flex items-center justify-center transition-all shadow-md shadow-[var(--color-primary)]/25">
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
