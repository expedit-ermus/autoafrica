'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';
import { Product } from '@/shared/types';
import LoadingSkeleton from '@/components/LoadingSkeleton';

export default function Bestsellers() {
  const { locale } = useApp();
  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    async function fetchBestsellers() {
      try {
        const res = await fetch('/api/v1/products?sort=sales&limit=6');
        if (!res.ok) throw new Error('Failed to fetch bestsellers');
        const json = await res.json();
        
        if (mounted) {
          // Depending on API response structure, we might need to adjust this
          const data = json.data?.data || json.data || json;
          if (Array.isArray(data)) {
            setProducts(data);
          } else {
            setProducts([]);
          }
        }
      } catch (error) {
        console.error('Error fetching bestsellers:', error);
        if (mounted) setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchBestsellers();
    
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">{L('Meilleures ventes', 'Best Sellers')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <LoadingSkeleton height="h-64" />
            <LoadingSkeleton height="h-64" />
            <LoadingSkeleton height="h-64" />
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  const formatCFA = (n: number) => new Intl.NumberFormat('fr-FR').format(n);

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">{L('Meilleures ventes', 'Best Sellers')}</h2>
          <Link href="/catalogue" className="text-orange-600 hover:text-orange-700 font-medium">
            {L('Voir tout →', 'View all →')}
          </Link>
        </div>
        
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <li 
              key={product.id} 
              className="bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:ring-2 hover:ring-orange-500 transition-all duration-200 group flex flex-col"
            >
              <div className="aspect-video bg-slate-700 flex items-center justify-center">
                <svg className="w-12 h-12 text-slate-500 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-white truncate pr-4" title={product.title}>
                    {product.title}
                  </h3>
                  {product.category?.name && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-300 shrink-0">
                      {product.category.name}
                    </span>
                  )}
                </div>
                
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <div className="text-orange-500 font-bold text-xl">
                    {formatCFA(product.price)} <span className="text-sm font-medium text-slate-400">FCFA</span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}