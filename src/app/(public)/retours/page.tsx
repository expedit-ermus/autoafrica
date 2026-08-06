import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Retours et remboursements',
  description:
    "Retours et remboursements AutoAfrique : pièce non conforme, non adaptée ou endommagée. Conditions de retour sous 30 jours, remboursement en Mobile Money.",
};

export default function RetoursPage() {
  return (
    <LegalPage
      title="Retours et remboursements"
      updatedAt="Août 2026"
      intro="Notre priorité : que la pièce livrée corresponde bien à votre commande. En cas de problème, nous organisons le retour et le remboursement dans les meilleurs délais."
      disclaimer={false}
      sections={[
        {
          heading: 'Cas de retour acceptés',
          body: [
            'Pièce non conforme à la commande (référence, marque ou caractéristique différente) ; pièce endommagée à la réception ; pièce non adaptée au véhicule indiqué lors de la commande, sous réserve d\'une erreur de notre part ou du vendeur.',
          ],
        },
        {
          heading: 'Délais',
          body: [
            'Le retour doit être demandé dans les 30 jours suivant la réception du colis, via la page de contact ou la section Commandes de votre compte. Au-delà, le retour pourra être refusé.',
          ],
        },
        {
          heading: 'Conditions du retour',
          body: [
            'La pièce doit être retournée dans son état d\'origine, dans son emballage, accompagnée du reçu. Les pièces usées, montées ou endommagées par une mauvaise utilisation ne sont pas éligibles au retour.',
          ],
        },
        {
          heading: 'Remboursement',
          body: [
            'Une fois la pièce réceptionnée et contrôlée, le remboursement est effectué sous 48h par Mobile Money (Orange Money, MTN MoMo, Moov Money ou Wave) sur le numéro ayant servi au paiement.',
            'En cas de pièce éligible, un échange peut être proposé si la pièce équivalente est disponible.',
          ],
        },
        {
          heading: 'Pièces d\'occasion contrôlée',
          body: [
            'Les pièces d\'occasion contrôlée bénéficient d\'une garantie et d\'un droit de retour identiques, dans les mêmes délais et conditions, conformément aux informations figurant sur la fiche produit.',
          ],
        },
      ]}
    />
  );
}
