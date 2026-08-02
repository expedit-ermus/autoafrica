'use client';
import Link from 'next/link';

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: PricingFeature[];
  cta: { label: string; href: string };
  popular?: boolean;
  accent?: string;
}

interface PricingTableProps {
  plans?: PricingPlan[];
  className?: string;
}

const defaultPlans: PricingPlan[] = [
  {
    name: 'Basic',
    price: '0',
    period: '/mois',
    description: 'Pour les garagistes qui commencent',
    features: [
      { text: 'Jusqu\'à 50 annonces', included: true },
      { text: 'Recherche de pièces', included: true },
      { text: 'Paiement Orange Money', included: true },
      { text: 'Support email', included: true },
      { text: 'Analytics avancés', included: false },
      { text: 'API intégration', included: false },
    ],
    cta: { label: 'Gratuit', href: '/register' },
    accent: '#6B7280',
  },
  {
    name: 'Pro',
    price: '15 000',
    period: '/mois',
    description: 'Pour les vendeurs professionnels',
    features: [
      { text: 'Annonces illimitées', included: true },
      { text: 'Recherche prioritaire', included: true },
      { text: 'Tous les modes de paiement', included: true },
      { text: 'Support prioritaire 24/7', included: true },
      { text: 'Analytics avancés', included: true },
      { text: 'API intégration', included: false },
    ],
    cta: { label: 'Commencer Pro', href: '/register?plan=pro' },
    popular: true,
    accent: 'var(--color-primary-dark)',
  },
  {
    name: 'Enterprise',
    price: '75 000',
    period: '/mois',
    description: 'Pour les grandes entreprises',
    features: [
      { text: 'Annonces illimitées', included: true },
      { text: 'Recherche prioritaire', included: true },
      { text: 'Tous les modes de paiement', included: true },
      { text: 'Support dédié', included: true },
      { text: 'Analytics + exports', included: true },
      { text: 'API intégration complète', included: true },
    ],
    cta: { label: 'Contacter les ventes', href: '/contact' },
    accent: 'var(--color-warm-slate)',
  },
];

export default function PricingTable({ plans = defaultPlans, className = '' }: PricingTableProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 ${className}`}>
      {plans.map((plan, i) => (
        <div
          key={i}
          className={`relative bg-white rounded-2xl border-2 p-6 sm:p-8 flex flex-col transition-all duration-300 hover:shadow-xl ${
            plan.popular
              ? 'border-[var(--color-primary-dark)] shadow-lg scale-[1.02] md:scale-105'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span
                className="inline-block px-4 py-1 rounded-full text-sm font-bold text-white shadow-md"
                style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-warm-red))' }}
              >
                ⭐ Le plus populaire
              </span>
            </div>
          )}

          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{plan.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                {plan.price === '0' ? 'Gratuit' : plan.price}
              </span>
              {plan.price !== '0' && (
                <span className="text-sm text-gray-500">{plan.period}</span>
              )}
            </div>
          </div>

          <ul className="space-y-3 mb-8 flex-1">
            {plan.features.map((feature, j) => (
              <li key={j} className="flex items-start gap-3 text-sm">
                {feature.included ? (
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>

          <Link
            href={plan.cta.href}
            className={`block text-center py-3 px-6 rounded-xl font-bold text-sm transition-all duration-300 ${
              plan.popular
                ? 'text-white hover:shadow-lg hover:scale-[1.02]'
                : 'border-2 hover:shadow-md'
            }`}
            style={
              plan.popular
                ? { background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-warm-red))' }
                : { borderColor: plan.accent, color: plan.accent }
            }
          >
            {plan.cta.label}
          </Link>
        </div>
      ))}
    </div>
  );
}
