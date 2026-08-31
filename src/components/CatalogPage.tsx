import Link from 'next/link';
import { BreadcrumbStructuredData, FAQStructuredData } from '@/components/StructuredData';
import CatalogueFilters from '@/components/CatalogueFilters';
import { SITE_URL } from '@/lib/structured-data';
import { Product } from '@/shared/types';
import { CATEGORY_SLUGS, BRAND_SLUGS } from '@/lib/marketplace-catalog';

interface CatalogPageProps {
  kind: 'categorie' | 'marque';
  slug: string;
  name: string;
  description: string;
  count: number;
  products: Product[];
}

export default function CatalogPage({ kind, slug, name, description, products }: CatalogPageProps) {
  const canonicalPath = kind === 'categorie' ? `/categories/${slug}` : `/marques/${slug}`;
  const fullUrl = `${SITE_URL}${canonicalPath}`;

  const otherBrands = BRAND_SLUGS.filter((b) => b.slug !== slug);
  const otherCategories = CATEGORY_SLUGS.filter((c) => c.slug !== slug);

  const faqs = [
    {
      question: `Comment commander des pièces détachées ${name} à Abidjan sur AutoAfrique ?`,
      answer: `Vous pouvez commander vos pièces ${name} directement en ligne sur AutoAfrique en sélectionnant la référence souhaitée, puis en réglant en toute sécurité via Mobile Money (Wave, Orange Money, MTN MoMo, Moov Money, Djamo) ou carte bancaire. La livraison s'effectue en 24h à Abidjan et en 48h à l'intérieur du pays.`,
    },
    {
      question: `Les pièces auto ${name} vendues sur AutoAfrique sont-elles garanties ?`,
      answer: `Oui, toutes les pièces neuves bénéficient de la garantie constructeur, et les pièces d'occasion contrôlée (pièces de réemploi) sont certifiées avec une garantie de 48 heures minimum pour vous permettre de vérifier la conformité avec votre mécanicien.`,
    },
    {
      question: `Comment fonctionne le paiement sécurisé par séquestre pour les pièces ${name} ?`,
      answer: `Lors de votre commande de pièces ${name}, votre argent est bloqué sur un compte de séquestre sécurisé. Le vendeur n'est payé que lorsque vous avez reçu la pièce et confirmé sa conformité. En cas de problème ou de pièce incompatible, vous êtes remboursé intégralement.`,
    },
    {
      question: `Quels sont les délais et tarifs de livraison pour ${name} à Abidjan et en Côte d'Ivoire ?`,
      answer: `À Abidjan (Cocody, Yopougon, Marcory, Plateau, Treichville, Koumassi, Abobo, Port-Bouët), la livraison express par coursier moto s'effectue en 24h pour 1 500 à 3 000 FCFA. Pour l'intérieur du pays (Bouaké, Yamoussoukro, San Pedro, Korhogo), l'expédition en car de transport sécurisé prend 24h à 48h.`,
    },
  ];

  const waText = encodeURIComponent(
    `Bonjour AutoAfrique ! 🚗 Je recherche des pièces détachées pour ${name} à Abidjan. Pouvez-vous vérifier la disponibilité en neuf ou occasion contrôlée ?`
  );

  return (
    <div className="bg-[var(--color-bg)] min-h-screen">
      <BreadcrumbStructuredData
        items={[
          { name: 'AutoAfrique', url: SITE_URL },
          { name: 'Catalogue', url: `${SITE_URL}/catalogue` },
          { name, url: fullUrl },
        ]}
      />

      <FAQStructuredData items={faqs} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-[var(--color-warm-muted)] mb-6" aria-label="Fil d'Ariane">
          <Link href="/" className="hover:text-orange-600 font-medium">Accueil</Link>
          <span>›</span>
          <Link href="/catalogue" className="hover:text-orange-600 font-medium">Catalogue</Link>
          <span>›</span>
          <span className="text-gray-900 font-bold">{name}</span>
        </nav>

        <div className="max-w-3xl mb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-2">
            {kind === 'categorie' ? 'Catégorie AutoAfrique' : 'Constructeur AutoAfrique'}
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Pièces détachées {kind === 'categorie' ? '' : 'auto '}{name} à Abidjan
          </h1>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{description}</p>
        </div>

        {/* Badges de Confiance Abidjan */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
          <div className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-2xl">⚡</span>
            <div>
              <p className="text-xs font-bold text-gray-900">Livraison 24h Abidjan</p>
              <p className="text-[11px] text-gray-500">Par coursier express moto ou gare</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-2xl">🛡️</span>
            <div>
              <p className="text-xs font-bold text-gray-900">Garantie Conformité 48h</p>
              <p className="text-[11px] text-gray-500">Occasion contrôlée ou neuf certifié</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-2xl">📱</span>
            <div>
              <p className="text-xs font-bold text-gray-900">Séquestre Mobile Money</p>
              <p className="text-[11px] text-gray-500">Wave, Orange Money, MTN MoMo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Intégration du composant interactif de catalogue et filtres */}
      <CatalogueFilters products={products} />

      {/* Section CTA WhatsApp Dédiée */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-700/50 rounded-full text-emerald-200 text-xs font-bold">
              <span>💬</span> Service WhatsApp Pièces Rares
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold">
              Vous ne trouvez pas votre référence pour {name} ?
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
              Envoyez-nous la photo de la pièce ou de votre carte grise sur WhatsApp. Notre réseau de casses et revendeurs agréés à Abidjan trouve votre pièce sous 15 minutes.
            </p>
          </div>
          <a
            href={`https://wa.me/2250788000000?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black rounded-2xl transition-all shadow-lg text-sm whitespace-nowrap flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>📱</span> Demander sur WhatsApp
          </a>
        </div>
      </div>

      {/* Maillage Interne Silo SEO (Catégories et Marques Connexes) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bloc 1 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
            <h2 className="text-base sm:text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
              <span>🔧</span> {kind === 'marque' ? `Catégories de pièces pour ${name}` : 'Autres catégories de pièces'}
            </h2>
            <div className="flex flex-wrap gap-2">
              {(kind === 'marque' ? CATEGORY_SLUGS : otherCategories).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="px-3 py-1.5 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 transition-all"
                >
                  Pièces {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Bloc 2 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
            <h2 className="text-base sm:text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
              <span>🚗</span> {kind === 'marque' ? 'Autres marques populaires à Abidjan' : `Marques compatibles ${name}`}
            </h2>
            <div className="flex flex-wrap gap-2">
              {(kind === 'marque' ? otherBrands : BRAND_SLUGS).map((b) => (
                <Link
                  key={b.slug}
                  href={`/marques/${b.slug}`}
                  className="px-3 py-1.5 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 transition-all"
                >
                  Pièces {b.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section FAQ SEO pour Rich Snippets */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
            <span>❓</span> Foire aux questions — Pièces {name} à Abidjan
          </h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                <dt className="text-sm sm:text-base font-bold text-gray-900 mb-2">
                  {faq.question}
                </dt>
                <dd className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}