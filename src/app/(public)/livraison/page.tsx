import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Livraison 24-72h',
  description:
    "Livraison AutoAfrique : expédition en 24-72h, priorité Abidjan et grandes villes d'Afrique de l'Ouest, point de retrait, suivi de commande.",
};

export default function LivraisonPage() {
  return (
    <LegalPage
      title="Livraison"
      updatedAt="Août 2026"
      intro="Nous livrons les pièces détachées commandées sur AutoAfrique dans un délai de 24 à 72 heures dans les zones couvertes, avec une priorité sur Abidjan et les grandes villes de la sous-région."
      disclaimer={false}
      sections={[
        {
          heading: 'Délais de livraison',
          body: [
            'Abidjan et grandes villes d\'Afrique de l\'Ouest : 24-72h ouvrées après validation du paiement. Les délais indiqués sur la fiche produit et dans le récapitulatif de commande font foi.',
            'Les délais peuvent varier en fonction de la disponibilité de la pièce chez le vendeur et de la zone de livraison.',
          ],
        },
        {
          heading: 'Zones de livraison',
          body: [
            'La livraison est assurée en priorité à Abidjan (Côte d\'Ivoire) et dans les grandes villes d\'Afrique de l\'Ouest : Sénégal, Mali, Burkina Faso, Niger, Bénin, Togo, Guinée-Bissau, Nigeria et Ghana.',
            'La liste des zones couvertes évolue avec l\'ouverture de la plateforme et sera mise à jour dans le centre d\'aide.',
          ],
        },
        {
          heading: 'Modes de livraison',
          body: [
            'Livraison locale partenaire : un transporteur local partenaire assure l\'acheminement de la pièce jusqu\'à votre adresse ou un point de retrait proche de chez vous.',
            'Les frais de livraison sont calculés en FCFA lors de la validation de la commande, selon la zone et le type de pièce.',
          ],
        },
        {
          heading: 'Suivi de commande',
          body: [
            'Le statut de votre commande (confirmée, en préparation, expédiée, livrée) est visible dans votre compte, section Commandes. Vous recevez les notifications par e-mail et par Mobile Money.',
          ],
        },
        {
          heading: 'Livraison non conforme',
          body: [
            'Si le colis reçu ne correspond pas à la commande ou est endommagé, contactez notre service client via la page de contact. Consultez la page Retours pour connaître les conditions de remplacement ou de remboursement.',
          ],
        },
      ]}
    />
  );
}
