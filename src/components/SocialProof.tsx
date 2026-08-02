'use client';

interface Stat {
  value: string;
  label: string;
  icon?: string;
}

interface TrustBadge {
  icon: string;
  text: string;
}

interface SocialProofProps {
  stats?: Stat[];
  badges?: TrustBadge[];
  className?: string;
}

const defaultStats: Stat[] = [
  { value: '3 200+', label: 'Vendeurs actifs', icon: '🏪' },
  { value: '85 000+', label: 'Pièces référencées', icon: '🔩' },
  { value: '120 000+', label: 'Commandes livrées', icon: '📦' },
  { value: '15+', label: 'Pays couverts', icon: '🌍' },
];

const defaultBadges: TrustBadge[] = [
  { icon: '🔒', text: 'SSL Sécurisé' },
  { icon: '✅', text: 'Vendeurs vérifiés' },
  { icon: '💳', text: 'Paiement sécurisé' },
  { icon: '🛡️', text: 'Garantie satisfait' },
  { icon: '📱', text: 'Support 24/7' },
];

const customerLogos = [
  'Toyota', 'Hyundai', 'Kia', 'Peugeot', 'Mercedes', 'Renault',
  'Orange', 'MTN', 'Wave', 'Moov',
];

export default function SocialProof({
  stats = defaultStats,
  badges = defaultBadges,
  className = '',
}: SocialProofProps) {
  return (
    <section className={`py-16 sm:py-20 bg-gray-50 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-[var(--color-primary-dark)] uppercase tracking-wider mb-2">
            La confiance de milliers
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Ils nous font confiance
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              {stat.icon && <span className="text-3xl mb-2 block">{stat.icon}</span>}
              <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 mb-14 opacity-40">
          {customerLogos.map((logo, i) => (
            <span key={i} className="text-lg sm:text-xl font-bold text-gray-500 tracking-wide uppercase">
              {logo}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {badges.map((badge, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">{badge.icon}</span>
              <span className="text-sm font-medium text-gray-700">{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
