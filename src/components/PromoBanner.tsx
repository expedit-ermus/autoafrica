'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/contexts/AppContext';

const banners = [
  {
    id: 1,
    tag: { fr: '⚡ NOUVELLE FONCTIONNALITÉ', en: '⚡ NEW FEATURE' },
    title: { fr: 'Estimateur de Devis & Panne Express', en: 'Fast Breakdown Quote Estimator' },
    subtitle: { fr: 'Calculez le coût moyen des pièces et main d\'œuvre à Abidjan en 30 secondes.', en: 'Calculate average parts and labor cost in Abidjan in 30 seconds.' },
    cta: { fr: 'Calculer mon devis', en: 'Calculate my quote' },
    bg: 'from-slate-950 via-orange-950/80 to-slate-900',
    accentColor: 'from-orange-500 to-amber-500',
    image: '/images/hero-diagnostic-workshop.jpg',
    link: '/estimation-devis',
  },
  {
    id: 2,
    tag: { fr: '🚗 CATALOGUE COMPLET', en: '🚗 FULL CATALOGUE' },
    title: { fr: 'Pièces auto neuves & d\'occasion contrôlée', en: 'New & certified used auto parts' },
    subtitle: { fr: 'Plus de 15 marques disponibles : Toyota, Peugeot, Hyundai, Suzuki, Nissan...', en: 'Over 15 car makes available: Toyota, Peugeot, Hyundai, Suzuki, Nissan...' },
    cta: { fr: 'Explorer le catalogue', en: 'Browse catalogue' },
    bg: 'from-slate-950 via-slate-900/90 to-amber-950/60',
    accentColor: 'from-slate-900 to-slate-800',
    image: '/images/pieces-neuves-oem.jpg',
    link: '/catalogue',
  },
  {
    id: 3,
    tag: { fr: '🔒 SÉCURITÉ GARANTIE', en: '🔒 GUARANTEED SECURITY' },
    title: { fr: 'Paiement sous séquestre Mobile Money', en: 'Secure Mobile Money payment' },
    subtitle: { fr: 'Wave, Djamo, Orange Money, MTN MoMo. Votre argent est libéré après réception de la bonne pièce.', en: 'Wave, Djamo, Orange Money, MTN MoMo. Your funds are released after part inspection.' },
    cta: { fr: 'Comment ça marche ?', en: 'How it works' },
    bg: 'from-slate-950 via-slate-900/85 to-indigo-950/70',
    accentColor: 'from-blue-500 to-cyan-400',
    image: '/images/sequestre-mobile-money.jpg',
    link: '/paiement',
  },
  {
    id: 4,
    tag: { fr: '🚚 LIVRAISON RAPIDE', en: '🚚 FAST DELIVERY' },
    title: { fr: 'Livraison express 24h à Abidjan', en: '24h Express Delivery in Abidjan' },
    subtitle: { fr: 'Livré directement à votre garage ou domicile par coursier moto, ou expédié par gare UTB.', en: 'Delivered directly to your garage or home by motorbike, or shipped via UTB stations.' },
    cta: { fr: 'Voir les délais & tarifs', en: 'View times & rates' },
    bg: 'from-slate-950 via-emerald-950/80 to-slate-900',
    accentColor: 'from-emerald-500 to-teal-400',
    image: '/images/livraison-express-abidjan.jpg',
    link: '/livraison',
  },
];

export default function PromoBanner() {
  const { locale } = useApp();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/10 w-full border border-slate-800/20">
      <div
        className="flex transition-transform duration-700 ease-out w-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className={`w-full shrink-0 bg-gradient-to-r ${banner.bg} relative text-white overflow-hidden`}
          >
            {/* Background Photographic Realistic Layer */}
            {banner.image && (
              <div className="absolute inset-0 z-0 pointer-events-none">
                <Image
                  src={banner.image}
                  alt={banner.title[locale as 'fr' | 'en']}
                  fill
                  priority={banner.id === 1}
                  className="object-cover object-center opacity-30 mix-blend-luminosity"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${banner.bg} opacity-90`} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/30" />
              </div>
            )}

            <div className="relative z-10 flex flex-col justify-between p-6 sm:p-8 md:p-10 min-h-[260px] sm:min-h-[340px]">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white/90 font-extrabold text-[11px] uppercase tracking-wider mb-3 border border-white/15 shadow-sm">
                  {banner.tag[locale as 'fr' | 'en']}
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 sm:mb-3 tracking-tight leading-tight">
                  {banner.title[locale as 'fr' | 'en']}
                </h2>
                <p className="text-white/80 text-xs sm:text-sm md:text-base mb-6 max-w-md leading-relaxed font-medium">
                  {banner.subtitle[locale as 'fr' | 'en']}
                </p>
              </div>

              <div>
                {banner.link ? (
                  <Link
                    href={banner.link}
                    className="inline-flex items-center gap-2 px-5 sm:px-7 py-3 bg-white text-slate-950 font-black rounded-2xl hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl text-xs sm:text-sm"
                  >
                    <span>{banner.cta[locale as 'fr' | 'en']}</span>
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md text-white font-bold rounded-2xl border border-white/20 text-xs">
                    {banner.cta[locale as 'fr' | 'en']}
                  </span>
                )}
              </div>
            </div>
            
            {/* Background Glow Ring with Parallax Depth */}
            <div className="parallax-glow-fast absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Progress Dots */}
      <div className="absolute bottom-4 right-6 flex items-center gap-1.5 z-20 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Bannière ${i + 1}`}
            className={`min-h-6 min-w-6 flex items-center justify-center rounded-full transition-all duration-300`}
          >
            <span className={`h-2 rounded-full block transition-all duration-300 ${
              i === current ? 'bg-orange-500 w-6' : 'bg-white/40 hover:bg-white/70 w-2'
            }`} />
          </button>
        ))}
      </div>
    </div>
  );
}