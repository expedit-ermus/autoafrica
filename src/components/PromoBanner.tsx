'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';

const banners = [
  {
    id: 1,
    title: { fr: 'Jusqu\'à -60% sur les pièces', en: 'Up to -60% on parts' },
    subtitle: { fr: 'Offres exclusives sur les pièces les plus vendues', en: 'Exclusive deals on best-selling parts' },
    cta: { fr: 'Voir les offres', en: 'See deals' },
    bg: 'from-[#FF6B35] to-[#FF8F5E]',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop',
  },
  {
    id: 2,
    title: { fr: 'Téléchargez l\'appli AutoAfrique', en: 'Download the AutoAfrique app' },
    subtitle: { fr: 'Commandez depuis votre téléphone, partout en Afrique', en: 'Order from your phone, anywhere in Africa' },
    cta: { fr: 'Télécharger', en: 'Download' },
    bg: 'from-[#1E3A5F] to-[#0F2744]',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop',
  },
  {
    id: 3,
    title: { fr: 'Parrainez un ami, gagnez 5 000 FCFA', en: 'Refer a friend, earn 5,000 FCFA' },
    subtitle: { fr: 'Pour chaque ami inscrit, recevez un bon de réduction', en: 'For each friend registered, receive a discount voucher' },
    cta: { fr: 'Parrainer maintenant', en: 'Refer now' },
    bg: 'from-[#00C9A7] to-[#00A88C]',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
  },
  {
    id: 4,
    title: { fr: 'Livraison gratuite dès 50 000 FCFA', en: 'Free delivery from 50,000 FCFA' },
    subtitle: { fr: 'Sur toutes les commandes éligibles en Afrique de l\'Ouest', en: 'On all eligible orders in West Africa' },
    cta: { fr: 'Commander', en: 'Order now' },
    bg: 'from-[#FF6B35] to-[#00C9A7]',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&h=400&fit=crop',
  },
];

export default function PromoBanner() {
  const { locale } = useApp();
  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-xl">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className={`min-w-full bg-gradient-to-r ${banner.bg} relative`}
          >
            <div className="flex items-center p-8 md:p-10 min-h-[280px]">
              <div className="flex-1 z-10">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  {banner.title[locale as 'fr' | 'en']}
                </h3>
                <p className="text-white/80 mb-6 max-w-sm">
                  {banner.subtitle[locale as 'fr' | 'en']}
                </p>
                <Link
                  href="/dashboard/marketplace"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
                >
                  {banner.cta[locale as 'fr' | 'en']}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="hidden md:block flex-1">
                <img
                  src={banner.image}
                  alt={banner.title[locale as 'fr' | 'en']}
                  className="w-full h-48 object-cover rounded-xl"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === current ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
