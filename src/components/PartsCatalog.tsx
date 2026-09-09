'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/contexts/AppContext';
import { track } from '@/lib/tracking';

// Une tuile par categorie reelle du catalogue (cf. `CATEGORY_SLUGS`), chaque
// `slug` alimentant `/categories/${cat.slug}`. La grille comptait douze tuiles
// batties sur l'ancienne taxonomie SEO : huit menaient a des pages sans produit,
// et les tuiles « Courroies », « Filtres » et « Amortisseurs » ont ete fondues
// dans les categories qui les portent reellement (D62).
// `image` n'est renseigne que la ou une photographie du catalogue represente
// reellement la categorie : `transmission` reprend la photo d'embrayage, qui en
// est un organe, `pneumatique` celle des pneus et jantes. Refroidissement,
// direction et echappement n'ont pas encore de photo et s'affichent avec leur
// emoji plutot qu'avec une image d'un autre sujet.
//
// Le rendu se faisait sur `/images/categories/{slug}.jpg`. Le realignement de
// la taxonomie (D62) a renomme les slugs sans renommer les fichiers : six
// categories sur dix pointaient vers une image inexistante, sur la grille
// d'accueil (D66).
const categories = [
  {
    id: 1,
    slug: 'moteur',
    image: '/images/categories/moteur.jpg',
    name: { fr: 'Moteur, courroies & filtres', en: 'Engine, belts & filters' },
    emoji: '⚙️',
    zoneBadge: { fr: 'Venants Contrôlés', en: 'Tested Reused Engines' },
    subcategories: ['Moteurs complets venants testés', 'Kits distribution avec pompe à eau', 'Filtres air haute filtration poussière', 'Injecteurs & pompes HP gasoil'],
  },
  {
    id: 2,
    slug: 'frein',
    image: '/images/categories/frein.jpg',
    name: { fr: 'Freinage', en: 'Brakes' },
    emoji: '🔴',
    zoneBadge: { fr: 'Anti-Chauffe Tropicale', en: 'Tropical Heatproof' },
    subcategories: ['Disques ventilés anti-chauffe', 'Plaquettes céramique intensives', 'Étriers de frein renforcés', 'Liquide frein haute ébullition'],
  },
  {
    id: 3,
    slug: 'suspension',
    image: '/images/categories/suspension.jpg',
    name: { fr: 'Suspension & Amortisseurs', en: 'Suspension & Shocks' },
    emoji: '〰️',
    zoneBadge: { fr: "Spécial Dos-d'âne", en: 'Heavy Duty Bumps' },
    subcategories: ['Paires amortisseurs renforcés piste', 'Ressorts hélicoïdaux tarage lourd', 'Triangles de suspension renforcés', 'Silentblocs polyuréthane'],
  },
  {
    id: 4,
    slug: 'transmission',
    image: '/images/categories/embrayage.jpg',
    name: { fr: 'Embrayage & Boîte', en: 'Clutch & Gearbox' },
    emoji: '🔄',
    zoneBadge: { fr: 'Spécial Taxis & VTC', en: 'Taxi & VTC Fleets' },
    subcategories: ['Kits embrayage trafic dense', 'Butées hydrauliques', 'Boîtes manuelles & auto venantes', 'Volants moteur bi-masse'],
  },
  {
    id: 5,
    slug: 'electrique',
    image: '/images/categories/electrique.jpg',
    name: { fr: 'Électricité & Allumage', en: 'Electrics & Ignition' },
    emoji: '⚡',
    zoneBadge: { fr: 'Tropicalisé Anti-Chaleur', en: 'Tropical Heatproof' },
    subcategories: ['Batteries tropicalisées renforcées', 'Alternateurs gros débit 12V/24V', 'Démarreurs puissants', 'Bougies préchauffage diesel'],
  },
  {
    id: 6,
    slug: 'refroidissement',
    name: { fr: 'Clim & Refroidissement', en: 'AC & Cooling' },
    emoji: '🌡️',
    zoneBadge: { fr: 'Climatisation Grand Froid', en: 'High Power AC' },
    subcategories: ['Compresseurs de clim Denso/Sanden', 'Condenseurs & bouteilles', 'Radiateurs moteur grand volume', 'Ventilateurs électriques'],
  },
  {
    id: 7,
    slug: 'carrosserie',
    image: '/images/categories/carrosserie.jpg',
    name: { fr: 'Carrosserie & Éclairage', en: 'Body Parts & Lighting' },
    emoji: '🚘',
    zoneBadge: { fr: 'Optiques & Pare-chocs', en: 'Lights & Bumpers' },
    subcategories: ['Phares avant LED / Halogène', 'Pare-chocs Corolla, Hilux, Suzuki', 'Rétroviseurs & glaces', 'Feux arrière'],
  },
  {
    id: 8,
    slug: 'pneumatique',
    image: '/images/categories/pneus-jantes.jpg',
    name: { fr: 'Pneus & Jantes', en: 'Tyres & Rims' },
    emoji: '🛞',
    zoneBadge: { fr: 'Piste & Bitume', en: 'Dirt & Tarmac' },
    subcategories: ['Pneus renforcés nids-de-poule', 'Jantes aluminium & tôle', 'Pneus tout-terrain 4x4 Hilux', 'Capteurs de pression TPMS'],
  },
  {
    id: 9,
    slug: 'direction',
    name: { fr: 'Direction', en: 'Steering' },
    emoji: '🎯',
    zoneBadge: { fr: 'Trains Renforcés', en: 'Reinforced Axles' },
    subcategories: ['Crémaillères assistées', 'Rotules de direction anti-jeu', 'Biellettes de barre stab', 'Pompes de direction assistée'],
  },
  {
    id: 10,
    slug: 'echappement',
    name: { fr: 'Échappement', en: 'Exhaust' },
    emoji: '💨',
    zoneBadge: { fr: 'Lignes Complètes', en: 'Full Systems' },
    subcategories: ['Silencieux arrière & intermédiaires', 'Catalyseurs', "Collecteurs d'échappement", 'Colliers & silentblocs de ligne'],
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
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name[locale as 'fr' | 'en']}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-4xl sm:text-5xl group-hover:scale-110 transition-transform duration-500"
                  >
                    {cat.emoji}
                  </div>
                )}
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
