import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Centre d\'aide',
  description:
    "Centre d'aide AutoAfrique : créer un compte Acheteur ou Vendeur, commander, payer en Mobile Money, suivre la livraison 24-72h et retourner une pièce.",
};

export default function AidePage() {
  return (
    <LegalPage
      title="Centre d'aide"
      updatedAt="Août 2026"
      intro="Retrouvez ici les réponses aux questions les plus fréquentes sur AutoAfrique. Vous ne trouvez pas votre réponse ? Consultez la page de contact."
      disclaimer={false}
      sections={[
        {
          heading: 'Créer un compte',
          body: [
            'Lors de l\'inscription, choisissez votre rôle : Acheteur pour commander des pièces, ou Vendeur pour mettre des pièces en vente. Vous pouvez aussi utiliser votre compte pour les deux usages. Renseignez vos nom, e-mail, téléphone et pays, puis confirmez votre mot de passe.',
          ],
        },
        {
          heading: 'Comment commander ?',
          body: [
            'Cherchez une pièce dans le catalogue, filtrez par catégorie ou par marque, ajoutez la pièce au panier puis validez la commande. Vous payez en Mobile Money et suivez la livraison depuis votre compte, section Commandes.',
          ],
        },
        {
          heading: 'Comment payer ?',
          body: [
            'Les paiements se font par Mobile Money : Wave, Djamo, Orange Money, MTN MoMo ou Moov Money. Le prix affiché est le prix final en FCFA. Vous recevez une notification sur votre téléphone pour confirmer le paiement. Détails sur la page Paiement.',
          ],
        },
        {
          heading: 'Délais de livraison',
          body: [
            'Les commandes sont livrées en 24-72h ouvrées dans les zones couvertes, avec priorité sur Abidjan et les grandes villes d\'Afrique de l\'Ouest. Détails sur la page Livraison.',
          ],
        },
        {
          heading: 'Retourner une pièce',
          body: [
            'Vous disposez de 30 jours après réception pour demander un retour si la pièce est non conforme, endommagée ou non adaptée (sous conditions). Le remboursement est effectué sous 48h en Mobile Money. Détails sur la page Retours.',
          ],
        },
        {
          heading: 'Vendre sur AutoAfrique',
          body: [
            'En tant que vendeur, vous pouvez publier des pièces neuves ou d\'occasion contrôlée. Chaque pièce d\'occasion est inspectée et testée avant d\'être mise en ligne. Les modalités de vente (commissions, mise en ligne) seront précisées avant la mise en production.',
          ],
        },
        {
          heading: 'Suivi de commande',
          body: [
            'Le statut de votre commande est mis à jour à chaque étape : confirmée, en préparation, expédiée, livrée. Vous êtes notifié par e-mail et par Mobile Money à chaque changement.',
          ],
        },
        {
          heading: 'Autre question',
          body: [
            'Pour toute question non couverte ici, utilisez le formulaire de la page de contact. Notre équipe vous répond via ce formulaire ; les horaires seront communiqués avant la mise en production.',
          ],
        },
      ]}
    />
  );
}
