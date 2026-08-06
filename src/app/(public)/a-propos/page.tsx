import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Qui sommes-nous ?',
  description:
    "Découvrez AutoAfrique, la marketplace de pièces détachées automobiles en Afrique de l'Ouest, priorité Abidjan (Côte d'Ivoire). Paiement Mobile Money, livraison 24-72h.",
};

export default function AProposPage() {
  return (
    <LegalPage
      title="Qui sommes-nous ?"
      updatedAt="Août 2026"
      intro="AutoAfrique est une marketplace de pièces détachées automobiles en Afrique de l'Ouest, pensée pour le marché ouest-africain."
      disclaimer={false}
      sections={[
        {
          heading: 'Notre mission',
          body: [
            "AutoAfrique connecte les garagistes, revendeurs et particuliers autour des pièces détachées automobiles. Notre marché prioritaire est Abidjan, en Côte d'Ivoire, avec un lancement prévu à Dakar (Sénégal) dans un second temps.",
            'Nous proposons des pièces neuves et d\'occasion contrôlée, avec un prix affiché transparent, un paiement en Mobile Money (Orange Money, MTN MoMo, Moov Money, Wave) et une livraison locale en 24-72h.',
          ],
        },
        {
          heading: 'Notre approche',
          body: [
            "Chaque pièce d'occasion mise en ligne est inspectée, testée et remise en état avant d'être proposée à la vente, avec sa propre garantie. Les pièces neuves bénéficient de la garantie AutoAfrique.",
            'Nous voulons offrir une alternative fiable au marché informel : un prix fixe affiché, un reçu conservé dans votre compte et un service client dédié.',
          ],
        },
        {
          heading: 'Notre statut actuel',
          body: [
            'AutoAfrique est en cours de développement. Cette plateforme est une version de démonstration : le catalogue, les services et les conditions décrites sur le site évoluent et seront finalisés avant la mise en production réelle.',
          ],
        },
        {
          heading: 'Nous contacter',
          body: [
            'Pour toute question, consultez le centre d\'aide ou la page de contact. Nous mettons notre service client en place et nous vous répondrons dans les plus brefs délais.',
          ],
        },
      ]}
    />
  );
}
