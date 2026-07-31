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
    <section className="py-14 bg-[#FEF3E2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#2D1B0E] mb-10">
          {L('Marques populaires', 'Popular brands')}
        </h2>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              href="/dashboard/marketplace"
              className="group bg-white rounded-2xl border border-[#E8DDD0] hover:border-[#FF6B35]/40 hover:shadow-xl hover:shadow-[#FF6B35]/10 p-6 flex flex-col items-center justify-center transition-all duration-300"
            >
              <div className="w-18 h-18 mb-3 flex items-center justify-center">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  loading="lazy"
                />
              </div>
              <div className="text-sm font-bold text-[#2D1B0E] group-hover:text-[#FF6B35] transition-colors text-center">
                {brand.name}
              </div>
              <div className="text-xs text-[#6B5B4E] mt-1 font-medium">{brand.count} {L('pièces', 'parts')}</div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/dashboard/marketplace"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-[#FF6B35] hover:text-white text-[#2D1B0E] font-bold rounded-xl transition-all duration-300 border border-[#E8DDD0] shadow-sm"
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
