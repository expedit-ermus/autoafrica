'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';

// Bannières neutres et véridiques : aucun faux chiffre, aucune offre inventée,
// aucune image distante non validée. Les promos (remises, parrainage, seuil de
// livraison gratuite) seront ajoutées quand une règle commerciale réelle existera.
const banners = [
  {
    id: 1,
    title: { fr: 'Pièces détachées neuves et d\'occasion', en: 'New and used auto parts' },
    subtitle: { fr: 'Un catalogue de pièces pour votre véhicule', en: 'A catalogue of parts for your vehicle' },
    cta: { fr: 'Voir le catalogue', en: 'Browse catalogue' },
    bg: 'from-[var(--color-primary)] to-[#FF8F5E]',
    link: '/dashboard/marketplace',
  },
  {
    id: 2,
    title: { fr: 'Application mobile bientôt disponible', en: 'Mobile app coming soon' },
    subtitle: { fr: 'Commander depuis son téléphone, prochainement', en: 'Order from your phone, coming soon' },
    cta: { fr: 'Bientôt disponible', en: 'Coming soon' },
    bg: 'from-[var(--color-secondary)] to-[var(--color-warm-slate)]',
    link: null,
  },
  {
    id: 3,
    title: { fr: 'Paiement sécurisé par Mobile Money', en: 'Secure Mobile Money payment' },
    subtitle: { fr: 'Wave, Djamo, Orange Money, MTN MoMo et Moov Money', en: 'Wave, Djamo, Orange Money, MTN MoMo and Moov Money' },
    cta: { fr: 'Voir le catalogue', en: 'Browse catalogue' },
    bg: 'from-[var(--color-warm-teal)] to-[#00A88C]',
    link: '/dashboard/marketplace',
  },
  {
    id: 4,
    title: { fr: 'Livraison en 24-72h', en: 'Delivery in 24-72h' },
    subtitle: { fr: 'En Afrique de l\'Ouest, Abidjan comme Dakar', en: 'Across West Africa, Abidjan and Dakar' },
    cta: { fr: 'Voir le catalogue', en: 'Browse catalogue' },
    bg: 'from-[var(--color-primary)] to-[var(--color-warm-teal)]',
    link: '/dashboard/marketplace',
  },
];

export default function PromoBanner() {
  const { locale } = useApp();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-xl w-full">
      <div
        className="flex transition-transform duration-500 ease-in-out w-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className={`w-full shrink-0 bg-gradient-to-r ${banner.bg} relative`}
          >
            <div className="flex items-center p-5 sm:p-8 md:p-10 min-h-[200px] sm:min-h-[280px]">
              <div className="flex-1 z-10">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3">
                  {banner.title[locale as 'fr' | 'en']}
                </h3>
                <p className="text-white/80 text-sm sm:text-base mb-4 sm:mb-6 max-w-sm">
                  {banner.subtitle[locale as 'fr' | 'en']}
                </p>
                {banner.link ? (
                  <Link
                    href={banner.link}
                    className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg text-sm sm:text-base"
                  >
                    {banner.cta[locale as 'fr' | 'en']}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 bg-white/20 backdrop-blur-sm text-white/90 font-semibold rounded-full border border-white/30 text-sm cursor-default select-none">
                    <svg className="w-4 h-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {banner.cta[locale as 'fr' | 'en']}
                  </span>
                )}
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
            aria-label={`Voir la bannière ${i + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === current ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60 w-2.5'
            }`}
          />
        ))}
      </div>
    </div>
  );
}