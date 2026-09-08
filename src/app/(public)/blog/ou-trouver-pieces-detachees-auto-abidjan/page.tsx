import ArticlePageTemplate from '@/components/ArticlePageTemplate';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Où trouver des pièces détachées auto de qualité à Abidjan ? Guide 2026',
  description: 'Guide complet pour acheter vos pièces auto à Abidjan : comparatif casse d\'Adjamé, ferraille Marcory, N\'Dotré et marketplace AutoAfrique. Prix, garantie et livraison.',
  alternates: {
    canonical: 'https://autoafrique-saas.vercel.app/blog/ou-trouver-pieces-detachees-auto-abidjan',
  },
};

export default function OuTrouverPiecesPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Où acheter des pièces auto fiables à Abidjan ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "À Abidjan, vous pouvez acheter vos pièces dans les pôles traditionnels (Adjamé, Marcory, N'Dotré) ou opter pour la sécurité avec AutoAfrique qui propose des pièces garanties, un séquestre Mobile Money et la livraison en 24h."
        }
      },
      {
        "@type": "Question",
        "name": "Quelle est la différence entre une pièce OEM et une pièce venante ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Une pièce OEM est une pièce neuve certifiée par le constructeur. Une pièce 'venante' est d'occasion importée, généralement de bonne qualité si elle est bien contrôlée. AutoAfrique vérifie rigoureusement ces pièces avant livraison."
        }
      },
      {
        "@type": "Question",
        "name": "Comment éviter les arnaques de pièces auto ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pour éviter les arnaques (pièces réusinées vendues pour du neuf, faux kilométrage), utilisez une plateforme comme AutoAfrique avec garantie de 48h, compatibilité certifiée par l'immatriculation et paiement sécurisé."
        }
      },
      {
        "@type": "Question",
        "name": "AutoAfrique livre-t-il les pièces achetées ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oui, AutoAfrique propose la livraison en 24h à Abidjan et expédie via les gares routières vers l'intérieur du pays."
        }
      }
    ]
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Où trouver des pièces détachées auto de qualité à Abidjan ? Guide 2026",
    "description": "Guide complet pour acheter vos pièces auto à Abidjan : comparatif casse d'Adjamé, ferraille Marcory, N'Dotré et marketplace AutoAfrique.",
    "image": "https://autoafrique-saas.vercel.app/images/vtc-taxis-abidjan.jpg",
    "author": {
      "@type": "Organization",
      "name": "Équipe AutoAfrique"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AutoAfrique",
      "logo": {
        "@type": "ImageObject",
        "url": "https://autoafrique-saas.vercel.app/logo.png"
      }
    },
    "datePublished": "2026-08-27"
  };

  return (
    <>
      <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="article-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <ArticlePageTemplate
        slug="ou-trouver-pieces-detachees-auto-abidjan"
        title="Où trouver des pièces détachées auto de qualité à Abidjan ? Guide 2026"
        excerpt="Guide complet pour acheter vos pièces auto à Abidjan : comparatif casse d'Adjamé, ferraille Marcory, N'Dotré et marketplace AutoAfrique. Prix, garantie et livraison."
        author={{ name: 'Équipe AutoAfrique', role: 'Experts Automobile' }}
        datePublished="2026-08-27"
        mainImage={{
          url: '/images/vtc-taxis-abidjan.jpg',
          alt: 'Rue commerçante d\'Abidjan avec taxis-compteurs, boutiques et kiosque Mobile Money',
          caption: 'Trouver la bonne pièce auto à Abidjan nécessite de connaître les bons endroits.',
        }}
        tableOfContents={[
          { id: 'poles-traditionnels', title: 'Les grands pôles traditionnels de pièces à Abidjan' },
          { id: 'neuve-vs-occasion', title: 'Pièce Neuve OEM vs Pièce d\'Occasion Venante : Comment choisir ?' },
          { id: 'pieges-arnaques', title: 'Les pièges et arnaques à éviter' },
          { id: 'revolution-autoafrique', title: 'La révolution AutoAfrique : Séquestre, garantie et livraison' },
          { id: 'tableau-comparatif', title: 'Tableau comparatif des solutions' },
        ]}
        contentSections={[
          {
            id: 'poles-traditionnels',
            heading: 'Les grands pôles traditionnels de pièces à Abidjan',
            body: [
              'Abidjan est le carrefour sous-régional de la pièce de rechange. Les acheteurs se tournent souvent vers les zones historiques telles que la casse d\'Adjamé pour les pièces de marques populaires comme <a href="/marques/toyota">Toyota</a> et <a href="/marques/peugeot">Peugeot</a>, ou la ferraille de Marcory VGE pour les marques européennes et asiatiques premium comme <a href="/marques/hyundai">Hyundai</a>.',
              'Plus récemment, la Casse de N\'Dotré s\'est imposée comme le nouveau hub des pièces détachées, notamment pour les gros composants tels que les <a href="/categories/moteur">moteurs</a> et boîtes de vitesses. Cependant, s\'y retrouver demande de l\'expérience et du temps.'
            ],
          },
          {
            id: 'neuve-vs-occasion',
            heading: 'Pièce Neuve OEM vs Pièce d\'Occasion Venante : Comment choisir ?',
            body: [
              'Sur le marché ivoirien, vous avez principalement deux choix : les pièces neuves (OEM ou adaptables) et les pièces d\'occasion dites "venantes" (importées d\'Europe, d\'Asie ou d\'Amérique).',
              'Pour des organes de sécurité comme le système de <a href="/categories/frein">frein</a>, il est recommandé d\'opter pour du neuf certifié. En revanche, pour la carrosserie ou des composants mécaniques robustes, une bonne pièce venante peut représenter un excellent compromis rapport qualité-prix.'
            ],
          },
          {
            id: 'pieges-arnaques',
            heading: 'Les pièges et arnaques à éviter',
            body: [
              'Le marché informel comporte des risques : pièces réusinées vendues comme neuves, moteurs "venants" avec un faux kilométrage, ou incompatibilité de référence. Sans facture ni garantie écrite, le retour est souvent impossible.',
              'Il est crucial de vérifier la provenance, d\'exiger des preuves de garantie et de faire appel à des mécaniciens de confiance. Utilisez notre <a href="/estimation-devis">estimateur de devis</a> pour avoir une idée du juste prix avant achat.'
            ],
          },
          {
            id: 'revolution-autoafrique',
            heading: 'La révolution AutoAfrique : Séquestre Mobile Money, compatibilité garantie et livraison 24h',
            body: [
              'Avec AutoAfrique, fini les déplacements inutiles et les risques de mauvaise pièce. Notre <a href="/catalogue">catalogue</a> en ligne permet de trouver la pièce exacte grâce à la recherche par immatriculation ou numéro de châssis.',
              'Nous sécurisons votre achat : votre paiement Mobile Money est gardé sous séquestre jusqu\'à la réception et validation de la pièce. De plus, nous offrons une <a href="/livraison">livraison</a> rapide en 24h à Abidjan.'
            ],
          },
          {
            id: 'tableau-comparatif',
            heading: 'Tableau comparatif : Marché informel vs AutoAfrique',
            body: [
              'Voici un comparatif rapide pour vous aider à choisir :',
              '<ul><li><strong>Disponibilité :</strong> Limitée au stock physique en casse / Accès à un vaste catalogue en ligne sur AutoAfrique</li><li><strong>Prix moyen :</strong> Négociable mais incertain en casse / Prix fixes, transparents et justes sur AutoAfrique</li><li><strong>Garantie :</strong> Souvent verbale et difficile à appliquer / Garantie de 48h (ou plus) avec retour facilité sur AutoAfrique</li><li><strong>Risque :</strong> Élevé (pièces contrefaites, mauvaise référence) / Faible (compatibilité certifiée, paiement sécurisé)</li><li><strong>Temps perdu :</strong> Des heures de recherche et de négociation / Quelques clics pour commander</li></ul>',
              'Le choix est vite fait pour ceux qui recherchent tranquillité d\'esprit et fiabilité.'
            ],
          },
        ]}
        resources={[
          { title: 'Catalogue complet', description: 'Recherchez vos pièces par immatriculation ou modèle.', href: '/catalogue' },
          { title: 'Informations sur la livraison', description: 'Découvrez nos zones et délais de livraison.', href: '/livraison' },
        ]}
        cta={{
          title: 'Trouvez vos pièces auto en toute sécurité',
          description: 'Achetez vos pièces garanties avec AutoAfrique et faites-vous livrer rapidement à Abidjan.',
          buttonText: 'Consulter le catalogue',
          buttonHref: '/catalogue',
        }}
        relatedArticles={[
          {
            slug: 'verifier-compatibilite-piece-auto-vehicule',
            title: 'Comment vérifier la compatibilité d\'une pièce auto ?',
            excerpt: 'Immatriculation, VIN, motorisation : découvrez les méthodes fiables.',
            category: 'Guide d\'achat',
          },
          {
            slug: 'casse-auto-vs-autoafrique',
            title: 'Casse auto vs AutoAfrique : pourquoi choisir l\'occasion contrôlée ?',
            excerpt: 'Prix fixes, garantie 48h, pièces certifiées et paiement Mobile Money.',
            category: 'Différenciation & Confiance',
          },
        ]}
      />
    </>
  );
}
