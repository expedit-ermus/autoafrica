'use client';
import Link from 'next/link';
import RemoteImage from '@/components/RemoteImage';
import { useApp } from '@/contexts/AppContext';

const brands = [
  { name: 'Suzuki', slug: 'suzuki', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Suzuki_logo_2025.svg/250px-Suzuki_logo_2025.svg.png' },
  { name: 'Toyota', slug: 'toyota', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Toyota.svg/250px-Toyota.svg.png' },
  { name: 'Renault', slug: 'renault', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Renault_2009_logo.svg/250px-Renault_2009_logo.svg.png' },
  { name: 'Peugeot', slug: 'peugeot', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Peugeot_Logo.svg/250px-Peugeot_Logo.svg.png' },
  { name: 'Nissan', slug: 'nissan', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Nissan_2020_logo.svg/250px-Nissan_2020_logo.svg.png' },
  { name: 'Hyundai', slug: 'hyundai', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Hyundai_Motor_Company_logo.svg/250px-Hyundai_Motor_Company_logo.svg.png' },
  { name: 'Kia', slug: 'kia', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/KIA_logo.svg/250px-KIA_logo.svg.png' },
  { name: 'Mercedes-Benz', slug: 'mercedes-benz', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Mercedes-Benz_Logo_2010.svg/250px-Mercedes-Benz_Logo_2010.svg.png' },
  { name: 'Ford', slug: 'ford', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Ford_Motor_Company_Logo.svg/250px-Ford_Motor_Company_Logo.svg.png' },
  { name: 'Volkswagen', slug: 'volkswagen', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/250px-Volkswagen_logo_2019.svg.png' },
  { name: 'BMW', slug: 'bmw', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/250px-BMW.svg.png' },
  { name: 'Citroën', slug: 'citroen', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Citroen_2016_logo.svg/250px-Citroen_2016_logo.svg.png' },
  { name: 'Opel', slug: 'opel', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Opel-Logo_2017.svg/250px-Opel-Logo_2017.svg.png' },
];

export default function BrandGrid() {
  const { locale } = useApp();
  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <section className="py-14 bg-[var(--color-bg-warm)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--color-warm-ink)] mb-10">
          {L('Marques populaires', 'Popular brands')}
        </h2>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              href={`/marketplace/marque/${brand.slug}`}
              className="group bg-white rounded-2xl border border-[var(--color-warm-border)] hover:border-[var(--color-primary)]/40 hover:shadow-xl hover:shadow-[var(--color-primary)]/10 p-6 flex flex-col items-center justify-center transition-all duration-300"
            >
              <div className="relative w-18 h-18 mb-3 flex items-center justify-center">
                <RemoteImage
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  sizes="72px"
                  className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <div className="text-sm font-bold text-[var(--color-warm-ink)] group-hover:text-[var(--color-primary)] transition-colors text-center">
                {brand.name}
              </div>
              <div className="text-xs text-[var(--color-warm-muted-strong)] mt-1 font-medium">{L('Pièces disponibles', 'Parts available')}</div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/dashboard/marketplace"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-[var(--color-primary)] hover:text-white text-[var(--color-warm-ink)] font-bold rounded-xl transition-all duration-300 border border-[var(--color-warm-border)] shadow-sm"
          >
            {L('Plus de constructeurs automobiles', 'More car manufacturers')}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
