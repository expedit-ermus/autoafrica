import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Le blog AutoAfrique',
  description:
    "Conseils automobiles : entretien, achat de pièces détachées, guide des prix, Mobile Money et livraison en Afrique de l'Ouest. Le blog AutoAfrique.",
};

export default function BlogPage() {
  return (
    <LegalPage
      title="Le blog AutoAfrique"
      updatedAt="Août 2026"
      intro="Conseils pratiques pour entretenir votre véhicule, bien choisir vos pièces détachées et comprendre nos services en Afrique de l'Ouest. Le blog ouvrira ses premiers articles avec la mise en production de la plateforme."
      disclaimer={false}
      sections={[
        {
          heading: 'Ce que vous trouverez ici',
          body: [
            'Guides d\'entretien et de diagnostic : courroies, freins, embrayage, suspension, filtres, électricité automobile et plus encore.',
            'Conseils d\'achat : comment choisir une pièce neuve ou une pièce d\'occasion contrôlée, vérifier une référence, comparer les prix en FCFA.',
            'Nos services : paiement Mobile Money (Orange Money, MTN MoMo, Moov Money, Wave), livraison 24-72h et programme de fidélité.',
          ],
        },
        {
          heading: 'Bientôt disponible',
          body: [
            'Les premiers articles sont en cours de préparation et seront publiés progressivement. D\'ici là, explorez le catalogue pour trouver vos pièces et consultez le centre d\'aide pour toute question.',
          ],
        },
        {
          heading: 'Rédaction',
          body: [
            'Les articles sont rédigés par l\'équipe AutoAfrique, en français, dans un esprit pratique et accessible. Les conseils donnés n\'ont pas valeur d\'expertise de mécanicien professionnel : en cas de doute, rapprochez-vous d\'un garagiste.',
          ],
        },
      ]}
    />
  );
}
