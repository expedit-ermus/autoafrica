'use client';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';
import { track } from '@/lib/tracking';

const categories = [
  {
    id: 1,
    slug: 'pneus-jantes',
    name: { fr: 'Pneus & Jantes', en: 'Tyres & Rims' },
    emoji: '🛞',
    bg: 'from-amber-500 to-orange-600',
    subcategories: ['Pneus été / toute saison', 'Jantes aluminium', 'Jantes tôle', 'Capteurs de pression TPMS'],
  },
  {
    id: 2,
    slug: 'frein',
    name: { fr: 'Freinage', en: 'Brakes' },
    emoji: '🔴',
    bg: 'from-rose-600 to-red-700',
    subcategories: ['Disques ventilés & pleins', 'Plaquettes céramique & semi-métal', 'Étriers de frein', 'Liquide DOT4 / DOT5.1'],
  },
  {
    id: 3,
    slug: 'moteur',
    name: { fr: 'Moteur & Culasse', en: 'Engine & Cylinder' },
    emoji: '⚙️',
    bg: 'from-emerald-600 to-teal-700',
    subcategories: ['Moteurs complets venants', 'Joints de culasse', 'Pistons & segments', 'Injecteurs & pompes HP'],
  },
  {
    id: 4,
    slug: 'courroies-chaines',
    name: { fr: 'Courroies & Chaînes', en: 'Belts & Chains' },
    emoji: '⛓️',
    bg: 'from-amber-600 to-yellow-600',
    subcategories: ['Kits distribution avec pompe à eau', 'Courroies d\'accessoire', 'Galets tendeurs', 'Chaînes de synchro'],
  },
  {
    id: 5,
    slug: 'embrayage',
    name: { fr: 'Embrayage & Boîte', en: 'Clutch & Gearbox' },
    emoji: '🔄',
    bg: 'from-blue-600 to-indigo-700',
    subcategories: ['Kits d\'embrayage complets', 'Volants moteurs bi-masse', 'Butées hydrauliques', 'Boîtes de vitesses'],
  },
  {
    id: 6,
    slug: 'amortissement',
    name: { fr: 'Amortisseurs', en: 'Shock Absorbers' },
    emoji: '〰️',
    bg: 'from-violet-600 to-purple-800',
    subcategories: ['Paires amortisseurs avant/arrière', 'Coupelles & roulements', 'Ressorts hélicoïdaux', 'Biellettes de barre'],
  },
  {
    id: 7,
    slug: 'suspension',
    name: { fr: 'Suspension & Train', en: 'Suspension & Axle' },
    emoji: '🚙',
    bg: 'from-cyan-600 to-blue-700',
    subcategories: ['Bras & triangles de suspension', 'Rotules de direction', 'Silentblocs renforcés', 'Crémaillères assistées'],
  },
  {
    id: 8,
    slug: 'filtre',
    name: { fr: 'Filtres & Entretien', en: 'Filters & Service' },
    emoji: '🧪',
    bg: 'from-teal-600 to-emerald-700',
    subcategories: ['Filtres à huile', 'Filtres à air haute capacité', 'Filtres à gasoil / essence', 'Filtres d\'habitacle'],
  },
  {
    id: 9,
    slug: 'carrosserie',
    name: { fr: 'Carrosserie & Éclairage', en: 'Body Parts & Lighting' },
    emoji: '🚗',
    bg: 'from-slate-700 to-slate-950',
    subcategories: ['Optiques de phares LED/Halogène', 'Feux arrière', 'Pare-chocs avant/arrière', 'Rétroviseurs rabattables'],
  },
  {
    id: 10,
    slug: 'huiles-fluides',
    name: { fr: 'Huiles & Fluides', en: 'Oils & Fluids' },
    emoji: '🛢️',
    bg: 'from-amber-500 to-orange-700',
    subcategories: ['Huiles synthétiques 5W30 / 10W40 / 15W40', 'Liquide de refroidissement tropical', 'Huiles boîte auto ATF', 'Liquide de frein'],
  },
  {
    id: 11,
    slug: 'electricite',
    name: { fr: 'Électricité & Allumage', en: 'Electrics & Ignition' },
    emoji: '⚡',
    bg: 'from-orange-500 to-amber-500',
    subcategories: ['Alternateurs 12V/24V', 'Démarreurs renforcés', 'Batteries tropicalisées', 'Bougies d\'allumage & préchauffage'],
  },
  {
    id: 12,
    slug: 'autres',
    name: { fr: 'Clim & Échappement', en: 'AC & Exhaust' },
    emoji: '📦',
    bg: 'from-indigo-700 to-slate-900',
    subcategories: ['Compresseurs de clim', 'Condenseurs & bouteilles', 'Pots d\'échappement & silencieux', 'Radiateurs de refroidissement'],
  },
];

export default function PartsCatalog() {
  const { locale } = useApp();
  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  return (
    <section className="py-12 md:py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/80 text-orange-800 text-xs font-bold uppercase tracking-wider mb-2">
              <span>🔧</span> {L('Catalogue par Famille de Pièces', 'Parts Catalog by Family')}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              {L('Catégories de pièces détachées', 'Parts categories')}
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-1">
              {L('Sélectionnez un système pour trouver les pièces compatibles avec votre véhicule.', 'Select a system to find compatible parts for your vehicle.')}
            </p>
          </div>

          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-orange-600 hover:text-orange-700 group shrink-0"
          >
            <span>{L('Voir tout le catalogue (12 catégories)', 'View full catalogue (12 categories)')}</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              onClick={() => track('click_category', { category_name: cat.name[locale as 'fr' | 'en'] })}
              className="group relative bg-white rounded-3xl border border-slate-200/80 hover:border-orange-500/40 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1"
            >
              <div className={`relative aspect-square overflow-hidden bg-gradient-to-br ${cat.bg} p-6 flex flex-col items-center justify-center transition-transform group-hover:scale-105 duration-300`}>
                <span className="text-4xl sm:text-5xl filter drop-shadow-md select-none transform group-hover:scale-110 transition-transform">
                  {cat.emoji}
                </span>
                <span className="absolute bottom-2 text-[10px] font-extrabold uppercase tracking-widest text-white/80 bg-black/20 px-2 py-0.5 rounded-full backdrop-blur-xs">
                  {cat.slug}
                </span>
              </div>
              
              <div className="p-4 text-center bg-white flex-1 flex items-center justify-center">
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                  {cat.name[locale as 'fr' | 'en']}
                </h3>
              </div>

              {/* Hover quick preview layer */}
              <div className="absolute inset-0 bg-slate-950/95 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center p-4 text-white z-10 backdrop-blur-xs">
                <div className="text-xs font-black text-orange-400 mb-2 border-b border-white/10 pb-1 flex items-center gap-1">
                  <span>{cat.emoji}</span> {cat.name[locale as 'fr' | 'en']}
                </div>
                <ul className="space-y-1.5 text-[11px] text-slate-300">
                  {cat.subcategories.slice(0, 3).map((sub) => (
                    <li key={sub} className="flex items-center gap-1 line-clamp-1">
                      <span className="text-orange-500 font-bold">•</span>
                      <span>{sub}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 text-[10px] font-bold text-center bg-orange-500 text-white py-1 rounded-lg">
                  {L('Consulter les prix →', 'Check prices →')}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
