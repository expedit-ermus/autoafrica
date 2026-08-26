'use client';
import Link from 'next/link';
import RemoteImage from '@/components/RemoteImage';
import { useApp } from '@/contexts/AppContext';
import { track } from '@/lib/tracking';

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
    <section className="py-12 md:py-16 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider mb-2">
              <span>🚗</span> {L('Constructeurs Automobiles', 'Car Manufacturers')}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              {L('Marques automobiles les plus demandées', 'Top demanded car makes')}
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-1">
              {L('Pièces d\'origine neuves et d\'occasion contrôlée pour tout le parc roulant ouest-africain.', 'New OEM and tested used parts for all West African vehicles.')}
            </p>
          </div>

          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-orange-600 hover:text-orange-700 group shrink-0"
          >
            <span>{L('Voir les 15+ constructeurs', 'View 15+ manufacturers')}</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              href={`/marques/${brand.slug}`}
              onClick={() => track('click_brand', { brand_name: brand.name })}
              className="group bg-slate-50/70 hover:bg-white rounded-3xl border border-slate-200/80 hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-500/10 p-5 sm:p-6 flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-3 flex items-center justify-center">
                <RemoteImage
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  sizes="80px"
                  className="object-contain filter grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-300"
                />
              </div>
              <div className="text-sm font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors text-center mt-1">
                {brand.name}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-bold uppercase tracking-wider">
                {L('Pièces dispo', 'In stock')}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
