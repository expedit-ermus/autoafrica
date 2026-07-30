'use client';
import Link from 'next/link';

interface TrustBadge {
  icon: string;
  text: string;
}

interface CTASectionProps {
  headline?: string;
  subtext?: string;
  primaryCTA?: { label: string; href: string };
  secondaryCTA?: { label: string; href: string };
  trustBadges?: TrustBadge[];
  bgImage?: string;
}

const defaultBadges: TrustBadge[] = [
  { icon: '🔒', text: 'Paiement sécurisé' },
  { icon: '🚀', text: 'Livraison rapide' },
  { icon: '💳', text: 'Orange Money / MTN MoMo' },
  { icon: '✅', text: 'Garantie 30 jours' },
];

export default function CTASection({
  headline = "Trouvez votre pièce en 30 secondes",
  subtext = "Rejoignez 3 200+ vendeurs et 85 000+ pièces automobiles disponibles. Commandez en ligne, payez par mobile money, recevez chez vous.",
  primaryCTA = { label: 'Commencer maintenant', href: '/register' },
  secondaryCTA = { label: 'Voir le catalogue', href: '/catalogue' },
  trustBadges = defaultBadges,
  bgImage,
}: CTASectionProps) {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: bgImage
            ? `linear-gradient(135deg, rgba(15,39,68,0.92) 0%, rgba(10,25,41,0.88) 100%), url(${bgImage})`
            : 'linear-gradient(135deg, #1E3A5F 0%, #0F2744 50%, #0A1929 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF6B35] rounded-full filter blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#00C9A7] rounded-full filter blur-[128px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
          {headline}
        </h2>
        <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          {subtext}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href={primaryCTA.href}
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #E85D04 0%, #D00000 100%)' }}
          >
            {primaryCTA.label}
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href={secondaryCTA.href}
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-bold border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300"
          >
            {secondaryCTA.label}
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {trustBadges.map((badge, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
              <span className="text-lg">{badge.icon}</span>
              <span>{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
