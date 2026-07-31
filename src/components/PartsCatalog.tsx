'use client';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';

const categories = [
  {
    id: 1,
    name: { fr: 'Pneus & Jantes', en: 'Tyres & Rims' },
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&h=300&fit=crop',
    subcategories: ['Pneus été', 'Pneus hiver', 'Jantes aluminium', 'Jantes acier'],
  },
  {
    id: 2,
    name: { fr: 'Frein', en: 'Brakes' },
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&h=300&fit=crop',
    subcategories: ['Disques de frein', 'Plaquettes', 'Étriers', 'Câbles de frein'],
  },
  {
    id: 3,
    name: { fr: 'Moteur', en: 'Engine' },
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=300&fit=crop',
    subcategories: ['Pièces moteur', 'Joint de culasse', 'Piston', 'Vilebrequin'],
  },
  {
    id: 4,
    name: { fr: 'Courroies & Chaînes', en: 'Belts & Chains' },
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=300&fit=crop',
    subcategories: ['Courroie distribution', 'Courroie accessoire', 'Galet tendeur', 'Chaîne de distribution'],
  },
  {
    id: 5,
    name: { fr: 'Embrayage', en: 'Clutch' },
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=300&fit=crop',
    subcategories: ['Kit d\'embrayage', 'Disque d\'embrayage', 'Récepteur', 'Vilebrequin'],
  },
  {
    id: 6,
    name: { fr: 'Amortissement', en: 'Shock Absorbers' },
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=300&fit=crop',
    subcategories: ['Amortisseurs', 'Supports d\'amortisseurs', 'Biellettes', 'Rotules'],
  },
  {
    id: 7,
    name: { fr: 'Suspension', en: 'Suspension' },
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=300&fit=crop',
    subcategories: ['Ressorts', 'Baladeurs', 'Barres antiroulis', 'Bras de suspension'],
  },
  {
    id: 8,
    name: { fr: 'Filtre', en: 'Filters' },
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=300&fit=crop',
    subcategories: ['Filtre à huile', 'Filtre à air', 'Filtre à carburant', 'Filtre habitacle'],
  },
  {
    id: 9,
    name: { fr: 'Carrosserie', en: 'Body Parts' },
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=300&fit=crop',
    subcategories: ['Pare-chocs', 'Rétroviseurs', 'Phares', 'Calandre'],
  },
  {
    id: 10,
    name: { fr: 'Huiles & Fluides', en: 'Oils & Fluids' },
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=300&fit=crop',
    subcategories: ['Huile moteur', 'Liquide de refroidissement', 'Liquide de frein', 'Huile de transmission'],
  },
  {
    id: 11,
    name: { fr: 'Électricité', en: 'Electrics' },
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=300&fit=crop',
    subcategories: ['Alternateur', 'Démarreur', 'Batterie', 'Bougies d\'allumage'],
  },
  {
    id: 12,
    name: { fr: 'Autres catégories', en: 'Other categories' },
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=300&fit=crop',
    subcategories: ['Échappement', 'Climatisation', 'Direction', 'Système de refroidissement'],
  },
];

export default function PartsCatalog() {
  const { locale } = useApp();
  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <section className="py-14 bg-[#FFF8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#2D1B0E] mb-10">
          {L('Catégories de pièces', 'Parts categories')}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href="/dashboard/marketplace"
              className="group relative bg-white rounded-2xl border border-[#E8DDD0] hover:border-[#FF6B35]/40 hover:shadow-xl hover:shadow-[#FF6B35]/10 transition-all duration-300 overflow-hidden"
            >
              <div className="aspect-square overflow-hidden bg-[#FEF3E2]">
                <img
                  src={cat.image}
                  alt={cat.name[locale as 'fr' | 'en']}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-sm font-bold text-[#2D1B0E] group-hover:text-[#FF6B35] transition-colors">
                  {cat.name[locale as 'fr' | 'en']}
                </h3>
              </div>

              <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A5F]/95 to-[#0A1929]/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                <div className="text-center">
                  <h3 className="text-white font-bold text-sm mb-3">
                    {cat.name[locale as 'fr' | 'en']}
                  </h3>
                  <ul className="space-y-2">
                    {cat.subcategories.map((sub) => (
                      <li key={sub}>
                        <span className="text-white/80 text-xs hover:text-[#FF6B35] transition-colors cursor-pointer font-medium">
                          {sub}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/dashboard/marketplace"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#FEF3E2] hover:bg-[#FF6B35] hover:text-white text-[#2D1B0E] font-bold rounded-xl transition-all duration-300 border border-[#E8DDD0]"
          >
            {L('Plus de pièces détachées', 'More spare parts')}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
