'use client';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';
import { track } from '@/lib/tracking';

// Vignettes neutres : dégradés de la palette + icône SVG, aucune image distante
// (remplace les anciennes photos Unsplash non validées, cf. DECISIONS.md D39).
const categories = [
  {
    id: 1,
    slug: 'pneus-jantes',
    name: { fr: 'Pneus & Jantes', en: 'Tyres & Rims' },
    bg: 'from-[var(--color-primary)] to-[#FF8F5E]',
    subcategories: ['Pneus été', 'Pneus hiver', 'Jantes aluminium', 'Jantes acier'],
  },
  {
    id: 2,
    slug: 'frein',
    name: { fr: 'Frein', en: 'Brakes' },
    bg: 'from-[var(--color-secondary)] to-[var(--color-warm-slate)]',
    subcategories: ['Disques de frein', 'Plaquettes', 'Étriers', 'Câbles de frein'],
  },
  {
    id: 3,
    slug: 'moteur',
    name: { fr: 'Moteur', en: 'Engine' },
    bg: 'from-[var(--color-warm-teal)] to-[#00A88C]',
    subcategories: ['Pièces moteur', 'Joint de culasse', 'Piston', 'Vilebrequin'],
  },
  {
    id: 4,
    slug: 'courroies-chaines',
    name: { fr: 'Courroies & Chaînes', en: 'Belts & Chains' },
    bg: 'from-[var(--color-earth)] to-[var(--color-warm-slate)]',
    subcategories: ['Courroie distribution', 'Courroie accessoire', 'Galet tendeur', 'Chaîne de distribution'],
  },
  {
    id: 5,
    slug: 'embrayage',
    name: { fr: 'Embrayage', en: 'Clutch' },
    bg: 'from-[var(--color-primary)] to-[var(--color-warm-teal)]',
    subcategories: ['Kit d\'embrayage', 'Disque d\'embrayage', 'Récepteur', 'Vilebrequin'],
  },
  {
    id: 6,
    slug: 'amortissement',
    name: { fr: 'Amortissement', en: 'Shock Absorbers' },
    bg: 'from-[var(--color-warm-navy-deep)] to-[var(--color-secondary)]',
    subcategories: ['Amortisseurs', 'Supports d\'amortisseurs', 'Biellettes', 'Rotules'],
  },
  {
    id: 7,
    slug: 'suspension',
    name: { fr: 'Suspension', en: 'Suspension' },
    bg: 'from-[#FF8F5E] to-[var(--color-warm-teal)]',
    subcategories: ['Ressorts', 'Baladeurs', 'Barres antiroulis', 'Bras de suspension'],
  },
  {
    id: 8,
    slug: 'filtre',
    name: { fr: 'Filtre', en: 'Filters' },
    bg: 'from-[var(--color-warm-slate)] to-[#00A88C]',
    subcategories: ['Filtre à huile', 'Filtre à air', 'Filtre à carburant', 'Filtre habitacle'],
  },
  {
    id: 9,
    slug: 'carrosserie',
    name: { fr: 'Carrosserie', en: 'Body Parts' },
    bg: 'from-[var(--color-warm-ink)] to-[var(--color-warm-navy-deep)]',
    subcategories: ['Pare-chocs', 'Rétroviseurs', 'Phares', 'Calandre'],
  },
  {
    id: 10,
    slug: 'huiles-fluides',
    name: { fr: 'Huiles & Fluides', en: 'Oils & Fluids' },
    bg: 'from-[var(--color-warm-navy)] to-[#00A88C]',
    subcategories: ['Huile moteur', 'Liquide de refroidissement', 'Liquide de frein', 'Huile de transmission'],
  },
  {
    id: 11,
    slug: 'electricite',
    name: { fr: 'Électricité', en: 'Electrics' },
    bg: 'from-[var(--color-secondary)] to-[var(--color-primary)]',
    subcategories: ['Alternateur', 'Démarreur', 'Batterie', 'Bougies d\'allumage'],
  },
  {
    id: 12,
    slug: 'autres',
    name: { fr: 'Autres catégories', en: 'Other categories' },
    bg: 'from-[var(--color-earth)] to-[var(--color-warm-navy)]',
    subcategories: ['Échappement', 'Climatisation', 'Direction', 'Système de refroidissement'],
  },
];

function CategoryIcon() {
  return (
    <svg className="w-12 h-12 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

export default function PartsCatalog() {
  const { locale } = useApp();
  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <section className="py-8 md:py-14 bg-[var(--color-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--color-warm-ink)] mb-6 md:mb-10">
          {L('Catégories de pièces', 'Parts categories')}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/marketplace/categorie/${cat.slug}`}
              onClick={() => track('click_category', { category_name: cat.name[locale as 'fr' | 'en'] })}
              className="group relative bg-white rounded-2xl border border-[var(--color-warm-border)] hover:border-[var(--color-primary)]/40 hover:shadow-xl hover:shadow-[var(--color-primary)]/10 transition-all duration-300 overflow-hidden"
            >
              <div className={`relative aspect-square overflow-hidden bg-gradient-to-br ${cat.bg}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <CategoryIcon />
                </div>
              </div>
              <div className="p-4 text-center">
                <h3 className="text-sm font-bold text-[var(--color-warm-ink)] group-hover:text-[var(--color-primary)] transition-colors">
                  {cat.name[locale as 'fr' | 'en']}
                </h3>
              </div>

              <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-secondary)]/95 to-[var(--color-warm-navy-deep)]/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                <div className="text-center">
                  <div className="text-white font-bold text-sm mb-3">
                    {cat.name[locale as 'fr' | 'en']}
                  </div>
                  <ul className="space-y-2">
                    {cat.subcategories.map((sub) => (
                      <li key={sub}>
                        <span className="text-white/80 text-xs hover:text-[var(--color-primary)] transition-colors cursor-pointer font-medium">
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

        <div className="text-center mt-6 md:mt-10">
          <Link
            href="/dashboard/marketplace"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[var(--color-bg-warm)] hover:bg-[var(--color-primary)] hover:text-white text-[var(--color-warm-ink)] font-bold rounded-xl transition-all duration-300 border border-[var(--color-warm-border)] text-sm sm:text-base"
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
