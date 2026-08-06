import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Conditions générales de vente',
  description:
    "Conditions générales de vente d'AutoAfrique : commandes, paiement Mobile Money, livraison 24-72h, retours et garanties en Afrique de l'Ouest.",
};

export default function CGVPage() {
  return (
    <LegalPage
      title="Conditions générales de vente"
      updatedAt="Août 2026"
      intro="Les présentes conditions générales de vente encadrent l'utilisation de la plateforme AutoAfrique et la vente de pièces détachées automobiles en Afrique de l'Ouest (Côte d'Ivoire, Sénégal, Mali, Burkina Faso, Niger, Bénin, Togo, Guinée-Bissau, Nigeria, Ghana)."
      sections={[
        {
          heading: "Objet et champ d'application",
          body: [
            "Les présentes conditions s'appliquent à toutes les commandes passées sur la plateforme AutoAfrique, que l'acheteur soit un particulier ou un professionnel. La validation d'une commande vaut acceptation des présentes conditions.",
          ],
        },
        {
          heading: 'Comptes acheteur et vendeur',
          body: [
            'Lors de la création d\'un compte, l\'utilisateur choisit un profil Acheteur ou Vendeur. Le profil Acheteur permet de commander des pièces ; le profil Vendeur permet de mettre en vente des pièces. Un même compte peut cumuler les deux usages.',
            "Chaque utilisateur s'engage à fournir des informations exactes et à jour et à conserver la confidentialité de ses identifiants.",
          ],
        },
        {
          heading: 'Commandes et prix',
          body: [
            'Le prix affiché est le prix final en francs CFA (FCFA), toutes informations comprises telles que présentées sur la fiche produit. Aucun frais caché n\'est appliqué au moment du paiement.',
            'Une commande est confirmée après validation du paiement. Un reçu est conservé dans le compte de l\'acheteur.',
          ],
        },
        {
          heading: 'Paiement',
          body: [
            'Les paiements sont effectués par Mobile Money : Orange Money, MTN MoMo, Moov Money et Wave. La plateforme peut également prévoir d\'autres moyens de paiement qui seront communiqués dans le centre d\'aide.',
            'En cas d\'échec du paiement, la commande n\'est pas validée.',
          ],
        },
        {
          heading: 'Livraison',
          body: [
            'Les livraisons sont réalisées en 24-72h dans les zones couvertes, avec priorité sur Abidjan et les grandes villes d\'Afrique de l\'Ouest. Les modalités et frais de livraison sont détaillés sur la page Livraison.',
          ],
        },
        {
          heading: 'Retours et garanties',
          body: [
            'Les pièces neuves et d\'occasion contrôlée bénéficient de garanties décrites sur la fiche produit. Les conditions de retour et de remboursement sont détaillées sur la page Retours.',
          ],
        },
        {
          heading: 'Responsabilité',
          body: [
            'AutoAfrique agit en tant que plateforme de mise en relation et de transaction. La responsabilité d\'AutoAfrique est limitée dans la mesure prévue par la loi applicable. La compatibilité d\'une pièce avec un véhicule reste de la responsabilité de l\'acheteur, qui doit vérifier la référence sur la fiche produit.',
          ],
        },
        {
          heading: 'Données personnelles',
          body: [
            'Les données personnelles collectées sont traitées conformément à la Politique de confidentialité et à la réglementation applicable, notamment la loi ivoirienne n° 2013-450 relative à la protection des données à caractère personnel.',
          ],
        },
        {
          heading: 'Droit applicable et litiges',
          body: [
            'Les présentes conditions sont régies par le droit ivoirien. En cas de litige, une solution amiable sera recherchée en priorité, puis le litige sera porté devant les juridictions compétentes de Côte d\'Ivoire, sauf disposition légale impérative contraire.',
          ],
        },
      ]}
    />
  );
}
