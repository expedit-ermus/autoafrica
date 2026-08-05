import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description:
    "Politique de confidentialité d'AutoAfrique : quelles données nous collectons, pourquoi, comment elles sont protégées et quels sont vos droits (loi ivoirienne 2013-450).",
};

export default function ConfidentialitePage() {
  return (
    <LegalPage
      title="Politique de confidentialité"
      updatedAt="Août 2026"
      intro="La protection de vos données personnelles est une priorité pour AutoAfrique. Cette politique explique quelles données sont collectées, pour quelles raisons, et les droits dont vous disposez."
      sections={[
        {
          heading: 'Responsable du traitement',
          body: [
            'AutoAfrique est le responsable du traitement des données personnelles collectées sur la plateforme. Les coordonnées officielles seront précisées avant la mise en production réelle de la plateforme.',
          ],
        },
        {
          heading: 'Données collectées',
          body: [
            'Lors de la création d\'un compte : nom, adresse e-mail, numéro de téléphone, pays, rôle choisi (Acheteur ou Vendeur) et mot de passe chiffré.',
            'Lors des commandes : historique d\'achat, adresse de livraison et informations de paiement nécessaires (sans stockage des identifiants Mobile Money complets).',
          ],
        },
        {
          heading: 'Finalités du traitement',
          body: [
            'Les données sont utilisées pour : gérer votre compte, traiter vos commandes et paiements, organiser les livraisons, améliorer le catalogue et les services, vous accompagner via le service client, et vous informer des nouveautés (avec votre accord pour la prospection).',
          ],
        },
        {
          heading: 'Durée de conservation',
          body: [
            'Les données de compte sont conservées pendant la durée d\'utilisation de la plateforme et au-delà selon les obligations légales. Les données de commande sont conservées conformément aux obligations comptables et fiscales applicables.',
          ],
        },
        {
          heading: 'Sécurité',
          body: [
            'Les données sont hébergées sur des serveurs sécurisés (hébergement Vercel, région Europe) et protégées par des mesures techniques et organisationnelles : chiffrement des transmissions, mots de passe hachés, accès limités au personnel autorisé.',
          ],
        },
        {
          heading: 'Partage des données',
          body: [
            'Vos données sont partagées avec les partenaires strictement nécessaires à l\'exécution du service (prestataire d\'hébergement, partenaire de livraison locale, opérateurs Mobile Money), uniquement dans la mesure requise. Elles ne sont jamais revendues.',
          ],
        },
        {
          heading: 'Vos droits',
          body: [
            'Conformément à la loi ivoirienne n° 2013-450 relative à la protection des données à caractère personnel, vous disposez d\'un droit d\'accès, de rectification, d\'opposition et de suppression de vos données. Pour exercer ces droits, contactez notre service client via la page de contact.',
          ],
        },
        {
          heading: 'Mise à jour de la politique',
          body: [
            'Cette politique peut être mise à jour pour refléter l\'évolution de la plateforme et de la réglementation. La date de dernière mise à jour figure en haut de cette page.',
          ],
        },
      ]}
    />
  );
}
