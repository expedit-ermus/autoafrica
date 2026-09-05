import ArticlePageTemplate from '@/components/ArticlePageTemplate';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Comment devenir vendeur de pièces auto à Abidjan',
  description: 'Rejoignez la première marketplace de pièces détachées automobile en Afrique de l\'Ouest : créez votre boutique en ligne, touchez des milliers de clients et encaissez par Mobile Money.',
  alternates: {
    canonical: 'https://autoafrique-saas.vercel.app/blog/devenir-vendeur-marketplace',
  },
};

export default function DevenirVendeurMarketplacePage() {
  return (
    <ArticlePageTemplate
      slug="devenir-vendeur-marketplace"
      title="Comment devenir vendeur de pièces auto sur AutoAfrique à Abidjan"
      excerpt="Vous êtes importateur, magasinier, casseur moderne ou garagiste à Abidjan ? Vendez vos pièces neuves ou d'occasion contrôlée sur AutoAfrique et développez votre clientèle au-delà de votre quartier."
      author={{ name: 'Équipe AutoAfrique', role: 'Pôle Partenariats Marchands' }}
      datePublished="2026-07-29"
      mainImage={{
        url: '/images/pieces-neuves-oem.jpg',
        alt: 'Commerçant et vendeur de pièces détachées automobile dans sa boutique à Abidjan',
        caption: 'AutoAfrique offre aux vendeurs un outil de gestion d\'inventaire et une visibilité auprès de milliers d\'automobilistes.',
      }}
      tableOfContents={[
        { id: 'pourquoi-vendre', title: 'Pourquoi vendre sur AutoAfrique ?' },
        { id: 'qui-peut-vendre', title: 'Qui peut devenir vendeur partenaire ?' },
        { id: 'etapes-inscription', title: 'Les 4 étapes pour ouvrir sa boutique' },
        { id: 'gestion-commandes', title: 'Gestion des commandes et encaissement Mobile Money' },
        { id: 'charte-qualite', title: 'La charte de conformité et de garantie' },
      ]}
      contentSections={[
        {
          id: 'pourquoi-vendre',
          heading: 'Pourquoi ouvrir votre boutique en ligne sur AutoAfrique ?',
          body: [
            'Traditionnellement, la clientèle d\'une boutique de pièces à Adjamé, Treichville ou Koumassi est limitée aux passants et aux garagistes du quartier. Avec AutoAfrique, votre stock devient instantanément visible auprès de dizaines de milliers de chauffeurs VTC, particuliers, gestionnaires de flottes et garagistes partout en Côte d\'Ivoire.',
            'Vous bénéficiez également d\'un mini-ERP pour gérer vos stocks, éditer des factures professionnelles et suivre vos ventes. Découvrez nos <a href="/tarifs">tarifs et abonnements SaaS pour professionnels</a>.',
          ],
        },
        {
          id: 'qui-peut-vendre',
          heading: 'Qui peut devenir vendeur certifié ?',
          body: [
            '- Importateurs et distributeurs de pièces détachées neuves (OEM et adaptables).',
            '- Commerçants et magasins de pièces de réemploi et d\'<a href="/blog/choisir-pieces-occasion-controlee">occasion contrôlée certifiée</a>.',
            '- Électriciens et mécaniciens spécialisés proposant des organes rénovés (alternateurs, démarreurs, injecteurs testés).',
            '- Centres de démontage et casses professionnelles respectant la <a href="/blog/casse-auto-vs-autoafrique">charte de traçabilité</a>.',
          ],
        },
        {
          id: 'etapes-inscription',
          heading: 'Les 4 étapes simples pour commencer à vendre',
          body: [
            '1. Inscription en ligne : Remplissez le <a href="/devenir-vendeur">formulaire vendeur</a> en 2 minutes avec vos coordonnées et le nom de votre magasin.',
            '2. Vérification d\'identité : Téléversez une pièce d\'identité valide ou votre registre de commerce (RCCM) pour obtenir le badge Vendeur Vérifié.',
            '3. Ajout de vos premières pièces : Prenez en photo vos pièces, indiquez la marque (<a href="/marques/toyota">Toyota</a>, <a href="/marques/peugeot">Peugeot</a>, <a href="/marques/nissan">Nissan</a>, <a href="/marques/hyundai">Hyundai</a>, <a href="/marques/suzuki">Suzuki</a>...), la référence et votre prix en FCFA.',
            '4. Commencez à recevoir des commandes : Dès qu\'un acheteur réserve sur le <a href="/catalogue">catalogue</a>, vous recevez une alerte SMS / WhatsApp instantanée.',
          ],
        },
        {
          id: 'gestion-commandes',
          heading: 'Paiements garantis et encaissement Mobile Money',
          body: [
            'Fini le risque de non-paiement : lorsqu\'une commande est passée, l\'argent de l\'acheteur est préalablement bloqué sur un compte de séquestre sécurisé. Vous êtes certain à 100% que la transaction est solvable avant d\'expédier la pièce.',
            'Dès la livraison confirmée, les fonds sont virés directement sur votre compte <a href="/blog/paiement-mobile-money-auto">Wave, Orange Money ou MTN Mobile Money</a> sans délai via nos <a href="/paiement">passerelles de paiement sécurisées</a>.',
          ],
        },
        {
          id: 'charte-qualite',
          heading: 'La charte qualité : clé de la fidélisation',
          body: [
            'Pour préserver la confiance de la communauté, chaque vendeur s\'engage à respecter la Charte AutoAfrique : descriptions fidèles, photos authentiques et acceptation de la <a href="/retours">garantie de conformité 48 heures</a>. L\'expédition est facilitée par notre réseau de <a href="/livraison">livraison express à Abidjan et gares routières</a>.',
          ],
        },
      ]}
      resources={[
        { title: 'Formulaire Vendeur', description: 'Créez votre compte vendeur professionnel.', href: '/devenir-vendeur' },
        { title: 'Conditions Vendeurs', description: 'Consultez les conditions générales de vente partenaires.', href: '/conditions-generales' },
      ]}
      cta={{
        title: 'Prêt à booster vos ventes de pièces auto à Abidjan ?',
        description: 'Rejoignez la communauté des vendeurs certifiés AutoAfrique dès aujourd\'hui.',
        buttonText: 'Devenir vendeur partenaire',
        buttonHref: '/devenir-vendeur',
      }}
      relatedArticles={[
        {
          slug: 'gestion-stock-garage-erp',
          title: 'Gérer son stock de pièces auto avec un ERP à Abidjan',
          excerpt: 'Modernisez la gestion de votre magasin ou atelier.',
          category: 'ERP & Gestion',
        },
        {
          slug: 'casse-auto-vs-autoafrique',
          title: 'Casse auto vs AutoAfrique : pourquoi choisir l\'occasion contrôlée ?',
          excerpt: 'La différence entre informel et marketplace sécurisée.',
          category: 'Différenciation',
        },
      ]}
    />
  );
}
