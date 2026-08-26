import ArticlePageTemplate from '@/components/ArticlePageTemplate';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Comment choisir une pièce d\'occasion contrôlée à Abidjan ?',
  description: 'Neuf ou occasion ? Découvrez comment vérifier la qualité d\'une pièce de réemploi auto avant l\'achat à Abidjan et profitez de la garantie AutoAfrique.',
  alternates: {
    canonical: 'https://autoafrique-saas.vercel.app/blog/choisir-pieces-occasion-controlee',
  },
};

export default function ChoisirPiecesOccasionPage() {
  return (
    <ArticlePageTemplate
      slug="choisir-pieces-occasion-controlee"
      title="Comment choisir une pièce d'occasion contrôlée ?"
      excerpt="Acheter des pièces automobiles d'occasion est une pratique courante et économique en Afrique de l'Ouest. Cependant, la crainte de tomber sur une pièce défectueuse freine de nombreux acheteurs. Voici notre guide pour faire le bon choix en toute sérénité."
      author={{ name: 'Équipe AutoAfrique', role: 'Experts Automobile' }}
      datePublished="2026-08-10"
      mainImage={{
        url: '/images/hero-bg.jpg',
        alt: 'Pièces détachées automobiles d\'occasion alignées sur une étagère de garage',
        caption: 'Distinguer une pièce de réemploi fiable d\'une pièce défectueuse est essentiel.',
      }}
      tableOfContents={[
        { id: 'neuf-vs-occasion', title: 'Neuf vs Occasion : comprendre les différences' },
        { id: 'criteres-qualite', title: 'Les critères de contrôle qualité' },
        { id: 'neuf-ou-occasion', title: 'Quelles pièces acheter neuves vs occasion' },
        { id: 'verifier-avant-achat', title: 'Comment vérifier une pièce avant l\'achat' },
        { id: 'garantie-autoafrique', title: 'La garantie AutoAfrique sur les pièces d\'occasion' },
      ]}
      contentSections={[
        {
          id: 'neuf-vs-occasion',
          heading: 'Neuf vs Occasion : comprendre les différences',
          body: [
            'Une pièce neuve offre la tranquillité d\'esprit maximale, mais son coût peut être prohibitif pour des véhicules d\'un certain âge. La pièce d\'occasion de réemploi, issue de véhicules accidentés ou en fin de vie, présente un double avantage : elle est souvent d\'origine constructeur (OEM) et coûte de 40% à 70% moins cher qu\'une pièce neuve en concession.',
            'Toutefois, il faut distinguer l\'<a href="/blog/casse-auto-vs-autoafrique">occasion informelle vendue en casse sans garantie</a>, de l\'<a href="/catalogue">occasion contrôlée</a> proposée par des professionnels du recyclage automobile qui testent et certifient leurs pièces.',
          ],
        },
        {
          id: 'criteres-qualite',
          heading: 'Les critères de contrôle qualité AutoAfrique',
          body: [
            'Une vraie pièce d\'occasion contrôlée passe par un processus rigoureux : traçabilité (l\'origine du véhicule donneur est connue, kilométrage et année), tests de fonctionnement (<a href="/categories/moteur">moteurs démarrés ou testés en compression</a>, pièces électriques testées au multimètre), inspection visuelle (recherche de fissures, fuites, déformations), nettoyage pour révéler d\'éventuels défauts cachés, et marquage d\'identification pour les retours.',
            'Ce processus garantit que chaque pièce affichée comme "Occasion Contrôlée" sur AutoAfrique a été vérifiée par un professionnel et répond à nos standards de qualité.',
          ],
        },
        {
          id: 'neuf-ou-occasion',
          heading: 'Quelles pièces acheter neuves vs occasion ?',
          body: [
            'Toutes les pièces ne s\'achètent pas d\'occasion. Il est primordial de faire la distinction pour des raisons de sécurité.',
          ],
          subsections: [
            { heading: 'À acheter d\'occasion les yeux fermés', body: 'Les éléments de carrosserie (portières, capots, pare-chocs), les <a href="/categories/eclairage">phares et feux</a>, les éléments d\'habitacle, les jantes, et les gros organes mécaniques (<a href="/categories/moteur">moteurs d\'occasion</a>, <a href="/categories/transmission">boîtes de vitesses</a>, ponts) s\'ils sont certifiés avec garantie.' },
            { heading: 'À acheter NEUF impérativement', body: 'Tout ce qui touche à la sécurité active et à l\'usure courante : <a href="/categories/freinage">plaquettes et disques de frein</a>, <a href="/categories/suspension">amortisseurs</a>, courroies, <a href="/categories/filtration">filtres</a>, rotules de direction, et pneumatiques neufs.' },
          ],
        },
        {
          id: 'verifier-avant-achat',
          heading: 'Comment vérifier une pièce avant l\'achat',
          body: [
            'Pour les moteurs et boîtes : vérifiez la couleur de l\'huile (pas de "mayonnaise" signe d\'un joint de culasse HS), assurez-vous que le moteur tourne à la main. Pour les alternateurs et démarreurs : tournez la poulie à la main, elle ne doit faire aucun bruit de roulement grippé. Retrouvez tous nos schémas dans les <a href="/manuels-reparation">manuels de réparation automobile</a>.',
            'Pour la carrosserie : inspectez les points de fixation. Règle d\'or : comparez scrupuleusement la référence constructeur avec notre <a href="/estimation-devis">outil de diagnostic et devis en ligne</a>.',
          ],
        },
        {
          id: 'garantie-autoafrique',
          heading: 'La garantie AutoAfrique sur les pièces d\'occasion',
          body: [
            'Pour lever les derniers doutes, la marketplace AutoAfrique a mis en place un système de confiance inédit. Nos vendeurs partenaires s\'engagent sur une charte qualité stricte.',
            'Lorsqu\'une pièce est affichée comme "Occasion Contrôlée" sur notre plateforme, elle bénéficie d\'une <a href="/retours">garantie de montage 48h</a>. Si la pièce ne fonctionne pas, vous êtes protégé par notre <a href="/paiement">séquestre de paiement Mobile Money</a> : vous retournez la pièce et vous êtes remboursé intégralement.',
            'Acheter d\'occasion avec <a href="/livraison">livraison rapide à Abidjan</a> devient enfin sûr, transparent et professionnel.',
          ],
        },
      ]}
      resources={[
        { title: 'Catalogue Moteurs', description: 'Moteurs d\'occasion contrôlée et neufs pour toutes marques.', href: '/marketplace/categorie/moteur' },
        { title: 'Guide des retours', description: 'Comment retourner une pièce non conforme.', href: '/retours' },
      ]}
      cta={{
        title: 'Trouvez vos pièces d\'occasion contrôlée',
        description: 'Des milliers de pièces vérifiées, garanties et livrées en 24-72h partout en Afrique de l\'Ouest.',
        buttonText: 'Voir le catalogue',
        buttonHref: '/catalogue',
      }}
      relatedArticles={[
        {
          slug: 'entretien-vehicule-afrique',
          title: 'Guide complet : entretenir son véhicule en Afrique de l\'Ouest',
          excerpt: 'Les 10 points d\'entretien essentiels pour rouler en toute sécurité à Abidjan et Dakar.',
          category: 'Entretien',
        },
        {
          slug: 'paiement-mobile-money-auto',
          title: 'Mobile Money et pièces auto : payer en toute sécurité',
          excerpt: 'Wave, Orange Money, MTN MoMo : comment le séquestre Mobile Money protège vendeurs et acheteurs.',
          category: 'Paiement',
        },
      ]}
    />
  );
}
