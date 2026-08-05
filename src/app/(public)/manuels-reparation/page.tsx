import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Manuels de réparation et tutoriels',
  description:
    "Manuels de réparation et tutoriels AutoAfrique pour les véhicules des marques disponibles en Afrique de l'Ouest. Guides pratiques à destination des garagistes et particuliers.",
};

export default function ManuelsPage() {
  return (
    <LegalPage
      title="Manuels de réparation et tutoriels"
      updatedAt="Août 2026"
      intro="Des guides pratiques pour mieux comprendre l'entretien de votre véhicule et réaliser certaines interventions en toute sécurité. Les manuels détaillés seront publiés avec la mise en production de la plateforme."
      disclaimer={false}
      sections={[
        {
          heading: 'À qui s\'adressent ces guides ?',
          body: [
            'Aux garagistes, aux revendeurs et aux particuliers qui veulent mieux comprendre leur véhicule. Les guides couvrent les marques présentes dans le catalogue : Toyota, Peugeot, Hyundai, Kia, Mercedes, Renault, Nissan, Volkswagen et plus.',
          ],
        },
        {
          heading: 'Contenu prévu',
          body: [
            'Diagnostics courants (voyants, bruits, vibrations), remplacement des pièces d\'usure (freins, courroies, filtres, embrayage, amortisseurs) et entretien périodique recommandé.',
            'Chaque guide indiquera les pièces nécessaires, les outils, les précautions de sécurité et les étapes de montage, avec le renvoi vers les fiches produits correspondantes.',
          ],
        },
        {
          heading: 'Bientôt disponible',
          body: [
            'Les premiers manuels sont en cours de rédaction et seront publiés progressivement sur cette page et sur le blog.',
          ],
        },
        {
          heading: 'Précaution importante',
          body: [
            'Les guides sont fournis à titre informatif et ne remplacent pas le savoir-faire d\'un professionnel. Certaines interventions impliquent des risques et nécessitent des compétences spécifiques : en cas de doute, confiez votre véhicule à un garagiste.',
          ],
        },
      ]}
    />
  );
}
