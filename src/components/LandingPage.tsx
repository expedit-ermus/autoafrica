'use client';
import { useApp } from '@/contexts/AppContext';
import CarSelector from '@/components/CarSelector';
import PromoBanner from '@/components/PromoBanner';
import PartsCatalog from '@/components/PartsCatalog';
import BrandGrid from '@/components/BrandGrid';
import ProductCard from '@/components/ProductCard';

const bestsellers = [
  {
    name: 'Kit de frein avant — Toyota Hilux 2015-2023',
    reference: 'BRK-TOY-HIL-01',
    price: 45000,
    oldPrice: 68000,
    discount: 34,
    rating: 5,
    reviewCount: 127,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop',
    brand: 'RIDEX',
    inStock: true,
    location: 'Abidjan',
  },
  {
    name: 'Amortisseur arrière — Hyundai Tucson 2015-2021',
    reference: 'SHK-HYU-TUC-02',
    price: 32000,
    rating: 4,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop',
    brand: 'MONROE',
    inStock: true,
    location: 'Dakar',
  },
  {
    name: 'Filtre à huile — Kia Sportage 2010-2022',
    reference: 'FLT-KIA-SPO-03',
    price: 8500,
    rating: 5,
    reviewCount: 234,
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop',
    brand: 'MANN-FILTER',
    inStock: true,
    location: 'Abidjan',
  },
  {
    name: 'Kit d\'embrayage — Peugeot 308 2007-2013',
    reference: 'CLT-PEU-308-04',
    price: 85000,
    oldPrice: 120000,
    discount: 29,
    rating: 4,
    reviewCount: 56,
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop',
    brand: 'SACHS',
    inStock: true,
    location: 'Lagos',
  },
  {
    name: 'Courroie de distribution — Renault Duster 1.5 dCi',
    reference: 'BLT-REN-DUS-05',
    price: 15000,
    rating: 5,
    reviewCount: 178,
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop',
    brand: 'GATES',
    inStock: true,
    location: 'Dakar',
  },
  {
    name: 'Disque de frein avant — Toyota Corolla 2009-2019',
    reference: 'DSK-TOY-COR-06',
    price: 22000,
    oldPrice: 35000,
    discount: 37,
    rating: 4,
    reviewCount: 92,
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop',
    brand: 'BREMBO',
    inStock: true,
    location: 'Abidjan',
  },
];

const trustFeatures = [
  {
    icon: (
      <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    title: { fr: 'Livraison rapide', en: 'Fast delivery' },
    desc: { fr: '24-72h en Afrique de l\'Ouest', en: '24-72h in West Africa' },
  },
  {
    icon: (
      <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: { fr: 'Paiement sécurisé', en: 'Secure payment' },
    desc: { fr: 'Mobile Money, Visa, Mastercard', en: 'Mobile Money, Visa, Mastercard' },
  },
  {
    icon: (
      <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: { fr: 'Retour 200 jours', en: '200-day return' },
    desc: { fr: 'Satisfait ou remboursé', en: 'Satisfaction guaranteed' },
  },
  {
    icon: (
      <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: { fr: 'Support client', en: 'Customer support' },
    desc: { fr: 'Lun-Ven 8h-20h', en: 'Mon-Fri 8am-8pm' },
  },
];

export default function LandingPage() {
  const { locale } = useApp();
  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <div className="overflow-x-hidden bg-[var(--color-bg)]">
      <section className="bg-gradient-to-b from-[var(--color-bg-warm)] to-[var(--color-bg)] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--color-warm-ink)] text-center mb-8">
            {L('AutoAfrique — Pièces Auto Marketplace Afrique de l\'Ouest', 'AutoAfrique — Auto Parts Marketplace West Africa')}
          </h1>
          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2">
              <CarSelector />
            </div>
            <div className="lg:col-span-3">
              <PromoBanner />
            </div>
          </div>
        </div>
      </section>

      <PartsCatalog />

      <BrandGrid />

      <section className="py-8 bg-white border-y border-[var(--color-warm-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustFeatures.map((feat, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--color-bg-warm)] transition-colors">
                <div className="shrink-0 w-12 h-12 bg-[var(--color-bg-warm)] rounded-xl flex items-center justify-center">
                  {feat.icon}
                </div>
                <div>
                  <div className="text-sm font-bold text-[var(--color-warm-ink)]">
                    {feat.title[locale as 'fr' | 'en']}
                  </div>
                  <div className="text-xs text-[var(--color-warm-muted-strong)] font-medium">
                    {feat.desc[locale as 'fr' | 'en']}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--color-warm-ink)] mb-10">
            {L('Meilleures ventes', 'Bestsellers')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {bestsellers.map((product, i) => (
              <ProductCard key={product.reference} {...product} priority={i === 0} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-[var(--color-bg-warm)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-[var(--color-warm-border)] shadow-lg shadow-[var(--color-earth)]/5">
            <h2 className="text-xl md:text-2xl font-extrabold text-[var(--color-warm-ink)] mb-5">
              {L('AutoAfrique — La marketplace des pièces automobiles en Afrique de l\'Ouest', 'AutoAfrique — The auto parts marketplace in West Africa')}
            </h2>
            <div className="text-base text-[var(--color-warm-faint)] leading-relaxed space-y-4">
              <p>
                {L(
                  'AutoAfrique est une marketplace e-commerce dédiée aux pièces détachées automobile en Afrique de l\'Ouest. Elle connecte les vendeurs et les acheteurs pour les marques Toyota, Hyundai, Kia, Peugeot, Mercedes et Renault, dans 10 pays : Côte d\'Ivoire, Sénégal, Mali, Burkina Faso, Niger, Bénin, Togo, Guinée-Bissau, Nigeria et Ghana.',
                  'AutoAfrique is an e-commerce marketplace dedicated to auto parts in West Africa. It connects sellers and buyers for Toyota, Hyundai, Kia, Peugeot, Mercedes and Renault, across 10 countries: Ivory Coast, Senegal, Mali, Burkina Faso, Niger, Benin, Togo, Guinea-Bissau and Ghana.'
                )}
              </p>
              <p>
                {L(
                  'Que vous soyez garagiste, revendeur ou particulier, trouvez les pièces dont vous avez besoin au meilleur prix. Paiement par Orange Money, MTN MoMo, Wave ou carte bancaire. Livraison rapide en 24-72h partout en Afrique de l\'Ouest.',
                  'Whether you\'re a mechanic, dealer or individual, find the parts you need at the best price. Pay with Orange Money, MTN MoMo, Wave or credit card. Fast delivery in 24-72h across West Africa.'
                )}
              </p>
              <button className="text-[var(--color-primary)] font-bold text-base hover:underline">
                {L('Lire la suite', 'Read more')} ↓
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
