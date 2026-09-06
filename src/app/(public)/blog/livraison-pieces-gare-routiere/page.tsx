import ArticlePageTemplate from '@/components/ArticlePageTemplate';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Livraison pièces auto par gare routière et express à Abidjan',
  description: 'Guide complet pour expédier et recevoir des pièces détachées entre Abidjan, Bouaké, San Pedro, Korhogo et Dakar via transporteurs et gares routières.',
  alternates: {
    canonical: 'https://autoafrique-saas.vercel.app/blog/livraison-pieces-gare-routiere',
  },
};

export default function LivraisonPiecesGareRoutierePage() {
  return (
    <ArticlePageTemplate
      slug="livraison-pieces-gare-routiere"
      title="Livraison de pièces auto par gare routière et express : le guide complet"
      excerpt="Trouver une pièce rare à Abidjan est une chose, la faire acheminer rapidement à Bouaké, Korhogo, San Pedro ou Dakar en est une autre. Découvrez les meilleures pratiques pour expédier vos pièces en toute sécurité par transporteur et gare routière."
      author={{ name: 'Équipe AutoAfrique', role: 'Spécialistes Logistique Auto' }}
      datePublished="2026-08-02"
      mainImage={{
        url: '/images/livraison-express-abidjan.jpg',
        alt: 'Colis et pièces automobiles prêts à l\'expédition par coursier et car de transport à Abidjan',
        caption: 'L\'acheminement rapide depuis les hubs d\'Abidjan permet de dépanner les véhicules partout en Côte d\'Ivoire.',
      }}
      tableOfContents={[
        { id: 'pourquoi-gare-routiere', title: 'Pourquoi le réseau des gares routières est incontournable' },
        { id: 'modes-livraison', title: 'Les 3 modes de livraison AutoAfrique' },
        { id: 'emballage-protection', title: 'Comment bien emballer une pièce mécanique fragile' },
        { id: 'suivi-securite', title: 'Suivi de colis, preuve de dépôt et déblocage de fonds' },
        { id: 'tarifs-delais', title: 'Délais et tarifs indicatifs en Côte d\'Ivoire' },
      ]}
      contentSections={[
        {
          id: 'pourquoi-gare-routiere',
          heading: 'Le réseau des cars et gares routières : l\'épine dorsale logistique',
          body: [
            'En Côte d\'Ivoire et en Afrique de l\'Ouest, les compagnies de transport par car (UTB, CTE, STIF, SBTA, etc.) constituent le réseau de messagerie le plus rapide et le plus économique pour relier la capitale économique aux villes de l\'intérieur. Pour voir nos délais et transporteurs, consultez la page des <a href="/livraison">modes de livraison AutoAfrique</a>.',
            'Lorsqu\'un véhicule est immobilisé à Bouaké, San Pedro, Yamoussoukro ou Korhogo, attendre un fret traditionnel peut prendre plusieurs jours. En déposant le colis le matin à une gare routière d\'Adjamé ou de Treichville, la pièce arrive généralement le jour même ou le lendemain matin à destination.',
          ],
        },
        {
          id: 'modes-livraison',
          heading: 'Les 3 formules de livraison proposées sur AutoAfrique',
          body: [
            '1. Livraison Express Abidjan (24h) : Remise en main propre par coursier moto (Tiak-Tiak) dans toutes les 10 communes d\'Abidjan (Cocody, Yopougon, Marcory, Plateau, Treichville, Koumassi, Port-Bouët, Abobo, Attécoubé, Adjamé).',
            '2. Expédition Intérieur du Pays (24-48h) : Dépôt sécurisé en gare routière partenaire pour toutes les pièces commandées sur notre <a href="/catalogue">catalogue en ligne</a> avec transmission immédiate du bordereau.',
            '3. Fret Sous-Régional UEMOA (3-5 jours) : Expéditions régulières vers le Sénégal (Dakar), le Mali (Bamako), le Burkina Faso (Ouagadougou) et le Togo (Lomé).',
          ],
        },
        {
          id: 'emballage-protection',
          heading: 'Les règles d\'or pour emballer une pièce mécanique',
          body: [
            'Une pièce auto mal emballée risque d\'être endommagée pendant le transport. Voici les précautions indispensables :',
            '- <a href="/categories/moteur">Moteurs complets</a> et <a href="/categories/transmission">boîtes de vitesses</a> : Vidange complète obligatoire pour éviter les fuites d\'huile, fixation sur palette et film étirable épais.',
            '- <a href="/categories/eclairage">Optiques de phares</a>, rétroviseurs et vitrage : Double emballage à bulles et carton rigide renforcé avec mention visible FRAGILE.',
            '- Électronique (calculateurs, injecteurs, capteurs) : Protection antistatique et calage mousse hermétique à l\'humidité. Consultez nos <a href="/manuels-reparation">manuels de réparation</a> pour le repérage des connecteurs.',
          ],
        },
        {
          id: 'suivi-securite',
          heading: 'Traçabilité et déblocage sécurisé par séquestre',
          body: [
            'Pour éviter les litiges de non-réception, le vendeur prend en photo le reçu de dépôt en gare avec le numéro de colis et le télécharge sur AutoAfrique. L\'acheteur est automatiquement prévenu par SMS et notification WhatsApp.',
            'À la réception en gare, l\'acheteur dispose de la <a href="/retours">garantie conformité 48h</a> pour tester la pièce. Dès validation, le paiement par <a href="/blog/paiement-mobile-money-auto">séquestre Mobile Money</a> est immédiatement débloqué au vendeur via <a href="/paiement">nos partenaires Wave, Orange Money et MTN</a>.',
          ],
        },
        {
          id: 'tarifs-delais',
          heading: 'Tableau des délais et tarifs indicatifs',
          body: [
            '- Abidjan intra-muros : 1 500 à 3 000 FCFA (Délai : 2h à 24h)',
            '- Villes de l\'intérieur (Bouaké, Yamoussoukro, San Pedro) : 2 500 à 6 000 FCFA selon poids (Délai : 24h)',
            '- Villes du nord et frontières (Korhogo, Man, Odienné) : 3 500 à 8 000 FCFA (Délai : 24h-48h)',
            '- International UEMOA (Dakar, Bamako) : Selon tarif fret routier ou aérien.',
          ],
        },
      ]}
      resources={[
        { title: 'Page Livraison', description: 'Consultez les zones desservies et les tarifs détaillés.', href: '/livraison' },
        { title: 'Catalogue Pièces', description: 'Recherchez vos pièces disponibles immédiatement à Abidjan.', href: '/catalogue' },
      ]}
      cta={{
        title: 'Faites-vous livrer vos pièces auto partout en Côte d\'Ivoire',
        description: 'Commandez sur AutoAfrique et recevez vos pièces en 24h à Abidjan ou en 48h à l\'intérieur du pays.',
        buttonText: 'Voir le catalogue de pièces',
        buttonHref: '/catalogue',
      }}
      relatedArticles={[
        {
          slug: 'paiement-mobile-money-auto',
          title: 'Acheter ses pièces auto par Mobile Money à Abidjan',
          excerpt: 'Le paiement séquestre protège votre argent jusqu\'à réception de la pièce.',
          category: 'Paiement',
        },
        {
          slug: 'entretien-vehicule-afrique',
          title: 'Guide complet : entretenir son véhicule en Afrique de l\'Ouest',
          excerpt: 'Les points de contrôle clés pour rouler en sécurité.',
          category: 'Entretien',
        },
      ]}
    />
  );
}
