import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Paiement Mobile Money sécurisé',
  description:
    "Paiement sécurisé par Mobile Money sur AutoAfrique : Orange Money, MTN MoMo, Moov Money, Wave. Prix en FCFA affiché, aucune donnée bancaire, reçu dans votre compte.",
};

export default function PaiementPage() {
  return (
    <LegalPage
      title="Paiement"
      updatedAt="Août 2026"
      intro="AutoAfrique propose des paiements simples et sécurisés en Mobile Money, adaptés au marché ouest-africain. Le prix affiché est le prix final en FCFA."
      disclaimer={false}
      sections={[
        {
          heading: 'Moyens de paiement acceptés',
          body: [
            'Orange Money (Côte d\'Ivoire, Sénégal, Mali, Burkina Faso, Bénin, Niger, Togo), MTN MoMo (Côte d\'Ivoire, Sénégal, Ghana, Cameroun, Nigeria), Moov Money (Côte d\'Ivoire, Bénin, Togo, Burkina Faso) et Wave (Sénégal, Mali, Burkina Faso, Côte d\'Ivoire).',
            'D\'autres moyens de paiement pourront être ajoutés au fil du temps ; ils seront annoncés dans le centre d\'aide.',
          ],
        },
        {
          heading: 'Comment payer ?',
          body: [
            'Lors de la validation de la commande, vous choisissez votre opérateur Mobile Money, puis vous confirmez le paiement dans la notification reçue sur votre téléphone (USSD). Une fois le paiement confirmé, la commande est validée et le vendeur est notifié.',
          ],
        },
        {
          heading: 'Sécurité des paiements',
          body: [
            'Le prix affiché sur la fiche produit est le prix final : aucun frais caché n\'est appliqué au moment du paiement. La plateforme ne stocke jamais votre code PIN Mobile Money. Un reçu de transaction est conservé dans votre compte.',
          ],
        },
        {
          heading: 'En cas de problème',
          body: [
            'Si le paiement échoue ou si vous êtes débité sans confirmation de commande, contactez notre service client via la page de contact : nous vérifions et régularisons dans les plus brefs délais.',
          ],
        },
      ]}
    />
  );
}
