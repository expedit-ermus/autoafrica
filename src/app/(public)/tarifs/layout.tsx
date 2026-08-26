import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'Tarifs & Abonnements SaaS ERP Automobile à Abidjan',
  description: "Découvrez les formules d'abonnement SaaS AutoAfrique pour garagistes, casseurs, revendeurs et flottes à Abidjan et en Afrique de l'Ouest. Paiement par Mobile Money en FCFA.",
  alternates: {
    canonical: `${SITE_URL}/tarifs`,
  },
  openGraph: {
    title: 'Tarifs & Abonnements SaaS ERP Automobile à Abidjan | AutoAfrique',
    description: "Formules d'abonnement SaaS pour le commerce automobile à Abidjan et en Afrique de l'Ouest. Gestion d'inventaire, Marketplace et Mobile Money.",
    url: `${SITE_URL}/tarifs`,
    type: 'website',
  },
};

const pricingSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'AutoAfrique SaaS ERP Automobile',
  description: 'Plateforme SaaS ERP & Marketplace pour la gestion de stock de pièces auto, facturation FCFA et encaissement Mobile Money.',
  brand: {
    '@type': 'Brand',
    name: 'AutoAfrique',
  },
  offers: [
    {
      '@type': 'Offer',
      name: 'Starter - Garages & Casseurs',
      price: '15000',
      priceCurrency: 'XOF',
      priceValidUntil: '2027-12-31',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/tarifs`,
    },
    {
      '@type': 'Offer',
      name: 'Pro - Distribution & Multi-Entrepôts',
      price: '45000',
      priceCurrency: 'XOF',
      priceValidUntil: '2027-12-31',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/tarifs`,
    },
    {
      '@type': 'Offer',
      name: 'Enterprise - Importateurs & Flottes',
      price: '120000',
      priceCurrency: 'XOF',
      priceValidUntil: '2027-12-31',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/tarifs`,
    },
  ],
};

export default function TarifsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />
      {children}
    </>
  );
}
