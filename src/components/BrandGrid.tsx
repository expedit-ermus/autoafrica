'use client';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';

const brands = [
  { name: 'Toyota', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Toyota.svg/200px-Toyota.svg.png', count: '12,400+' },
  { name: 'Hyundai', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Hyundai_Motor_Company_logo.svg/200px-Hyundai_Motor_Company_logo.svg.png', count: '6,800+' },
  { name: 'Kia', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Kia_logo2.svg/200px-Kia_logo2.svg.png', count: '5,200+' },
  { name: 'Peugeot', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Peugeot_logo_%282010%29.svg/200px-Peugeot_logo_%282010%29.svg.png', count: '4,500+' },
  { name: 'Mercedes-Benz', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Mercedes-Benz_logo_n_2018.png/200px-Mercedes-Benz_logo_n_2018.png', count: '3,800+' },
  { name: 'Renault', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Renault_2016_logo_horizontale.svg/200px-Renault_2016_logo_horizontale.svg.png', count: '2,900+' },
  { name: 'Ford', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Ford_Motor_Company_Logo.svg/200px-Ford_Motor_Company_Logo.svg.png', count: '2,400+' },
  { name: 'Volkswagen', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/200px-Volkswagen_logo_2019.svg.png', count: '2,100+' },
  { name: 'Nissan', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Nissan_logo_2020.svg/200px-Nissan_logo_2020.svg.png', count: '1,800+' },
  { name: 'BMW', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/200px-BMW.svg.png', count: '1,500+' },
  { name: 'Citroën', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Citroen_2009_logo.svg/200px-Citroen_2009_logo.svg.png', count: '1,300+' },
  { name: 'Opel', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Opel_logo_2024.svg/200px-Opel_logo_2024.svg.png', count: '900+' },
];

export default function BrandGrid() {
  const { locale } = useApp();
  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          {L('Marques populaires', 'Popular brands')}
        </h2>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              href="/dashboard/marketplace"
              className="group bg-white rounded-xl border border-gray-100 hover:border-[#FF6B35]/30 hover:shadow-lg p-6 flex flex-col items-center justify-center transition-all duration-300"
            >
              <div className="w-16 h-16 mb-3 flex items-center justify-center">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  loading="lazy"
                />
              </div>
              <div className="text-sm font-semibold text-gray-700 group-hover:text-[#FF6B35] transition-colors text-center">
                {brand.name}
              </div>
              <div className="text-xs text-gray-400 mt-1">{brand.count} {L('pièces', 'parts')}</div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/dashboard/marketplace"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-[#FF6B35] hover:text-white text-gray-700 font-semibold rounded-lg transition-all duration-300"
          >
            {L('Plus de constructeurs automobiles', 'More car manufacturers')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
