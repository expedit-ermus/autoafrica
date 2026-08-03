'use client';
import { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/shared/types';

const partImages: Record<string, string[]> = {
  'Moteur': [
    'https://images.unsplash.com/photo-1763848843613-f8c2ca3a31a1?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=400&fit=crop',
  ],
  'Frein': [
    'https://images.unsplash.com/photo-1770656505709-fd97236989b9?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=400&h=400&fit=crop',
  ],
  'Suspension': [
    'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=400&h=400&fit=crop',
  ],
  'Carrosserie': [
    'https://images.unsplash.com/photo-1766650189458-bb0e7969ba5d?w=400&h=400&fit=crop',
  ],
  'Électrique': [
    'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=400&fit=crop',
  ],
  'Transmission': [
    'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop',
  ],
  'default': [
    'https://images.unsplash.com/photo-1763848843613-f8c2ca3a31a1?w=400&h=400&fit=crop',
  ],
};

function getImages(p: Product): string {
  if (Array.isArray(p.images) && p.images.length > 0) return p.images[0];
  const pool = partImages[p.category?.name || 'default'] || partImages['default'];
  return pool[Math.abs(p.id.split('').reduce((s, c) => s + c.charCodeAt(0), 0)) % pool.length];
}

export default function Bestsellers() {
  const { locale } = useApp();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/v1/products?pageSize=6&sortBy=salesCount&sortOrder=desc');
        const json = await res.json();
        if (!cancelled && json.success) setProducts(json.data?.data || json.data || []);
      } catch {
        if (!cancelled) setProducts([]);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="py-14 bg-[var(--color-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--color-warm-ink)] mb-10">
          {locale === 'fr' ? 'Meilleures ventes' : 'Bestsellers'}
        </h2>
        {products.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-[var(--color-bg-warm)] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.map((p, i) => (
              <ProductCard
                key={p.id}
                name={p.title}
                reference={p.reference || p.slug || ''}
                price={p.price}
                oldPrice={p.comparePrice || undefined}
                discount={p.comparePrice && p.comparePrice > p.price ? Math.round((1 - p.price / p.comparePrice) * 100) : undefined}
                rating={Math.round(p._avgRating || p.rating || 0)}
                reviewCount={p._reviewCount || p.reviewCount || 0}
                image={getImages(p)}
                brand={p.brand?.name || ''}
                inStock={p.stock > 0}
                priority={i === 0}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
