import type { Metadata } from 'next';
import Link from 'next/link';
import { WebsiteStructuredData, FAQStructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Devenir Vendeur & Garagiste Partenaire à Abidjan',
  description: 'Vendez vos pièces détachées neuves ou d\'occasion contrôlée sur AutoAfrique. Touchez des milliers de chauffeurs VTC et garagistes à Abidjan et en Afrique de l\'Ouest.',
  alternates: { canonical: '/devenir-vendeur' },
};

const faqSeller = [
  {
    question: 'Quelles sont les conditions pour vendre des pièces sur AutoAfrique ?',
    answer: 'Vous devez posséder un magasin de pièces neuves, un hangar ou un emplacement dans une casse auto (ex: N\'Dotré, Adjamé, Colobane). Chaque pièce d\'occasion est vérifiée avant d\'être mise en ligne.',
  },
  {
    question: 'Combien coûte la vente sur la plateforme ?',
    answer: 'L\'inscription est gratuite avec la formule Découverte (0 FCFA/mois, 8% de commission). Pour les magasins et gros casseaurs, des abonnements Starter (15 000 FCFA/mois, 5% commission) et Pro (45 000 FCFA/mois, 3% commission) sont disponibles.',
  },
  {
    question: 'Comment suis-je payé lors d\'une vente ?',
    answer: 'Les paiements sont sécurisés par séquestre Mobile Money (Wave, Djamo, Orange Money, MTN MoMo, Moov Money). Les fonds sont débloqués sur votre compte dès réception et validation de la pièce.',
  },
];

export default function DevenirVendeurPage() {
  return (
    <div>
      <WebsiteStructuredData />
      <FAQStructuredData items={faqSeller} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section Vendeur */}
        <div className="bg-gradient-to-r from-[var(--color-warm-navy)] via-[var(--color-secondary)] to-orange-950 rounded-3xl p-6 sm:p-10 md:p-14 text-white shadow-xl mb-12 border border-orange-900/30">
          <span className="text-xs font-extrabold uppercase tracking-wider bg-orange-500/20 text-orange-300 px-3.5 py-1.5 rounded-full border border-orange-400/30">
            Espace Vendeurs & Garagistes
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-4 mb-4 leading-tight">
            Vendez vos pièces détachées en Afrique de l&apos;Ouest
          </h1>
          <p className="text-orange-100 text-base sm:text-lg max-w-2xl leading-relaxed mb-8">
            Digitalisez votre magasin ou votre casse auto. Publiez vos annonces en 10 secondes et recevez vos paiements par Mobile Money garanti.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/auth/register"
              className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-center rounded-2xl transition-all shadow-lg border border-orange-400/30"
            >
              S&apos;inscrire comme Vendeur
            </Link>
            <Link
              href="/tarifs"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-center rounded-2xl border border-white/20 transition-all"
            >
              Voir les Formules & Commission (Transparence)
            </Link>
          </div>
        </div>

        {/* Bénéfices Vendeurs */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mb-8">
            Pourquoi vendre sur AutoAfrique ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-2xl mb-4">
                📱
              </div>
              <h3 className="font-extrabold text-gray-900 text-lg mb-2">Note Vocale & Photo WhatsApp</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Pas besoin de saisir de longues fiches techniques. Envoyez une photo du moteur ou dictez une note vocale, notre système génère l&apos;annonce.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 font-extrabold flex items-center justify-center text-2xl mb-4">
                🛡️
              </div>
              <h3 className="font-extrabold text-gray-900 text-lg mb-2">Séquestre Mobile Money Garanti</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Fini les impayés et les fausses promesses. L&apos;argent est bloqué par séquestre Wave / Djamo / Orange Money avant le départ de la pièce.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 font-extrabold flex items-center justify-center text-2xl mb-4">
                🚚
              </div>
              <h3 className="font-extrabold text-gray-900 text-lg mb-2">Expédition Gare Routière & Tiak-Tiak</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Livrez à Abidjan par livreur moto ou expédiez vers les grandes villes (Dakar, Bouaké, San Pedro) via les gares routières partenaires.
              </p>
            </div>
          </div>
        </div>

        {/* Transparence Tarifs & Conditions */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm mb-12">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4">
            Conditions & Tarification Transparente
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Aucun coût caché. Vous pouvez commencer gratuitement et faire évoluer votre compte.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200">
              <h3 className="font-extrabold text-gray-900 text-base">Gratuit / Casseur</h3>
              <p className="text-2xl font-extrabold text-emerald-600 my-2">0 FCFA <span className="text-xs text-gray-500 font-normal">/mois</span></p>
              <p className="text-xs text-gray-600">Commission marketplace 8% par vente. Jusqu&apos;à 20 pièces en ligne.</p>
            </div>

            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200">
              <span className="text-[10px] font-extrabold uppercase bg-emerald-600 text-white px-2 py-0.5 rounded-md">Populaire</span>
              <h3 className="font-extrabold text-gray-900 text-base mt-1">Starter Magasin</h3>
              <p className="text-2xl font-extrabold text-emerald-700 my-2">15 000 FCFA <span className="text-xs text-gray-500 font-normal">/mois</span></p>
              <p className="text-xs text-gray-600">Commission marketplace 5%. Jusqu&apos;à 500 pièces + support WhatsApp 5j/7.</p>
            </div>

            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200">
              <h3 className="font-extrabold text-gray-900 text-base">Pro Grossiste</h3>
              <p className="text-2xl font-extrabold text-gray-900 my-2">45 000 FCFA <span className="text-xs text-gray-500 font-normal">/mois</span></p>
              <p className="text-xs text-gray-600">Commission réduite 3%. Stock illimité + multi-entrepôts & douanes.</p>
            </div>
          </div>
        </div>

        {/* FAQ Vendeur */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-6">
            Foire Aux Questions Vendeurs
          </h2>
          <div className="space-y-4">
            {faqSeller.map((f, i) => (
              <div key={i} className="p-5 bg-white rounded-2xl border border-gray-200">
                <h3 className="font-bold text-gray-900 text-base mb-2">{f.question}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Final */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-8 text-center text-white shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
            Prêt à publier vos premières pièces ?
          </h2>
          <p className="text-amber-100 text-sm sm:text-base max-w-xl mx-auto mb-6">
            Créez votre compte en 2 minutes et commencez à recevoir des commandes de garagistes et particuliers.
          </p>
          <Link
            href="/auth/register"
            className="inline-block px-8 py-3.5 bg-white text-orange-600 font-extrabold rounded-xl shadow hover:bg-orange-50 transition-all"
          >
            Créer un compte Vendeur Gratuit
          </Link>
        </div>
      </main>
    </div>
  );
}
