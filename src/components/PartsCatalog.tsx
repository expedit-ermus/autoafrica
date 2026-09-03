'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/contexts/AppContext';
import { track } from '@/lib/tracking';

const categories = [
  {
    id: 1,
    slug: 'pneus-jantes',
    name: { fr: 'Pneus & Jantes', en: 'Tyres & Rims' },
    emoji: '🛞',
    zoneBadge: { fr: 'Piste & Bitume', en: 'Dirt & Tarmac' },
    subcategories: ['Pneus renforcés nids-de-poule', 'Jantes aluminium & tôle', 'Pneus tout-terrain 4x4 Hilux', 'Capteurs de pression TPMS'],
  },
  {
    id: 2,
    slug: 'frein',
    name: { fr: 'Freinage', en: 'Brakes' },
    emoji: '🔴',
    zoneBadge: { fr: 'Anti-Chauffe Tropicale', en: 'Tropical Heatproof' },
    subcategories: ['Disques ventilés anti-chauffe', 'Plaquettes céramique intensives', 'Étriers de frein renforcés', 'Liquide frein haute ébullition'],
  },
  {
    id: 3,
    slug: 'moteur',
    name: { fr: 'Moteur & Culasse', en: 'Engine & Cylinder' },
    emoji: '⚙️',
    zoneBadge: { fr: 'Venants Contrôlés', en: 'Tested Reused Engines' },
    subcategories: ['Moteurs complets venants testés', 'Joints de culasse renforcés', 'Injecteurs & pompes HP gasoil', 'Vilebrequins & coussinets'],
  },
  {
    id: 4,
    slug: 'courroies-chaines',
    name: { fr: 'Courroies & Chaînes', en: 'Belts & Chains' },
    emoji: '⛓️',
    zoneBadge: { fr: 'Kits Renforcés', en: 'Heavy Duty Kits' },
    subcategories: ['Kits distribution avec pompe à eau', 'Courroies d\'alternateur', 'Galets tendeurs renforcés', 'Chaînes de synchro'],
  },
  {
    id: 5,
    slug: 'embrayage',
    name: { fr: 'Embrayage & Boîte', en: 'Clutch & Gearbox' },
    emoji: '🔄',
    zoneBadge: { fr: 'Spécial Taxis & VTC', en: 'Taxi & VTC Fleets' },
    subcategories: ['Kits embrayage trafic dense', 'Butées hydrauliques', 'Boîtes manuelles & auto venantes', 'Volants moteur bi-masse'],
  },
  {
    id: 6,
    slug: 'amortissement',
    name: { fr: 'Amortisseurs', en: 'Shock Absorbers' },
    emoji: '〰️',
    zoneBadge: { fr: 'Spécial Dos-d\'âne', en: 'Heavy Duty Bumps' },
    subcategories: ['Paires amortisseurs renforcés piste', 'Ressorts hélicoïdaux tarage lourd', 'Coupelles d\'amortisseur', 'Biellettes de barre stab'],
  },
  {
    id: 7,
    slug: 'suspension',
    name: { fr: 'Suspension & Train', en: 'Suspension & Axle' },
    zoneBadge: { fr: 'Trains Renforcés', en: 'Reinforced Axles' },
    subcategories: ['Triangles de suspension renforcés', 'Rotules de direction anti-jeu', 'Silentblocs polyuréthane', 'Crémaillères assistées'],
  },
  {
    id: 8,
    slug: 'filtre',
    name: { fr: 'Filtres & Entretien', en: 'Filters & Service' },
    zoneBadge: { fr: 'Anti-Poussière Harmattan', en: 'Harmattan Dustproof' },
    subcategories: ['Filtres air haute filtration poussière', 'Filtres gasoil décanteurs d\'eau', 'Filtres huile longue durée', 'Filtres habitacle charbon'],
  },
  {
    id: 9,
    slug: 'carrosserie',
    name: { fr: 'Carrosserie & Éclairage', en: 'Body Parts & Lighting' },
    zoneBadge: { fr: 'Optiques & Pare-chocs', en: 'Lights & Bumpers' },
    subcategories: ['Phares avant LED / Halogène', 'Pare-chocs Corolla, Hilux, Suzuki', 'Rétroviseurs & glaces', 'Feux arrière'],
  },
  {
    id: 10,
    slug: 'huiles-fluides',
    name: { fr: 'Huiles & Fluides', en: 'Oils & Fluids' },
    zoneBadge: { fr: 'Formule Climat Chaud', en: 'Hot Climate Formula' },
    subcategories: ['Huiles 15W40 / 20W50 tropicales', 'Liquide de refroidissement tropical 50%', 'Huiles boîte auto ATF', 'Liquide de frein'],
  },
  {
    id: 11,
    slug: 'electricite',
    name: { fr: 'Électricité & Allumage', en: 'Electrics & Ignition' },
    zoneBadge: { fr: 'Tropicalisé Anti-Chaleur', en: 'Tropical Heatproof' },
    subcategories: ['Batteries tropicalisées renforcées', 'Alternateurs gros débit 12V/24V', 'Démarreurs puissants', 'Bougies préchauffage diesel'],
  },
  {
    id: 12,
    slug: 'autres',
    name: { fr: 'Clim & Refroidissement', en: 'AC & Cooling' },
    zoneBadge: { fr: 'Climatisation Grand Froid', en: 'High Power AC' },
    subcategories: ['Compresseurs de clim Denso/Sanden', 'Condenseurs & bouteilles', 'Radiateurs moteur grand volume', 'Ventilateurs électriques'],
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
              <span>🔧</span> {L('Catalogue Spécifique Afrique de l\'Ouest', 'West Africa Specific Parts Catalog')}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              {L('Catégories de pièces détachées', 'Parts categories')}
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-1">
              {L('Pièces sélectionnées et calibrées pour les routes, la chaleur et le climat d\'Afrique de l\'Ouest (poussière, nids-de-poule, circulation urbaine).', 'Parts selected and calibrated for West African road conditions, heat, and climate (dust, potholes, urban traffic).')}
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
              <div className="relative aspect-square overflow-hidden bg-slate-900">
                <Image
                  src={`/images/categories/${cat.slug}.jpg`}
                  alt={cat.name[locale as 'fr' | 'en']}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent" />
                <span className="absolute bottom-2 left-2 right-2 text-center text-[10px] font-black uppercase tracking-wider text-white bg-slate-950/85 px-2 py-0.5 rounded-lg backdrop-blur-xs border border-white/15 shadow-sm truncate">
                  {cat.zoneBadge[locale as 'fr' | 'en']}
                </span>
              </div>
              
              <div className="p-4 text-center bg-white flex-1 flex items-center justify-center">
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                  {cat.name[locale as 'fr' | 'en']}
                </h3>
              </div>

              {/* Hover quick preview layer (Desktop only so mobile taps navigate instantly) */}
              <div className="hidden md:flex absolute inset-0 bg-slate-950/95 opacity-0 group-hover:opacity-100 transition-all duration-300 flex-col justify-center p-4 text-white z-10 backdrop-blur-xs pointer-events-none">
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
                <div className="mt-3 text-[10px] font-bold text-center bg-orange-500 text-white py-1.5 rounded-lg shadow-sm">
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
