import ArticlePageTemplate from '@/components/ArticlePageTemplate';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guide complet : entretenir son véhicule en Afrique de l\'Ouest | AutoAfrique',
  description: 'Les 10 points d\'entretien essentiels pour rouler en sécurité à Abidjan et Dakar. Huile moteur, freins, pneus, batterie.',
};

export default function EntretienVehiculeAfriquePage() {
  return (
    <ArticlePageTemplate
      slug="entretien-vehicule-afrique"
      title="Guide complet : entretenir son véhicule en Afrique de l'Ouest"
      excerpt="Rouler en Afrique de l'Ouest exige une attention particulière à l'entretien de son véhicule. Entre les températures élevées, les routes parfois dégradées, la poussière et l'humidité, votre voiture est mise à rude épreuve au quotidien."
      author={{ name: 'Équipe AutoAfrique', role: 'Experts Automobile' }}
      datePublished="2026-08-12"
      mainImage={{
        url: '/images/hero-bg.jpg',
        alt: 'Mécanicien vérifiant le moteur d\'une voiture dans un garage en Afrique de l\'Ouest',
        caption: 'L\'entretien régulier est la clé pour rouler en toute sécurité sous le climat ouest-africain.',
      }}
      tableOfContents={[
        { id: 'pourquoi-entretien', title: 'Pourquoi l\'entretien est crucial dans la sous-région' },
        { id: 'dix-points', title: 'Les 10 points d\'entretien essentiels' },
        { id: 'frequences', title: 'Fréquences d\'entretien recommandées' },
        { id: 'ou-trouver', title: 'Où trouver ses pièces de rechange de qualité' },
        { id: 'budget', title: 'Budget moyen d\'entretien en FCFA' },
      ]}
      contentSections={[
        {
          id: 'pourquoi-entretien',
          heading: 'Pourquoi l\'entretien est crucial dans la sous-région',
          body: [
            'Le climat d\'Afrique de l\'Ouest (chaleur extrême en saison sèche, humidité en saison des pluies) accélère l\'usure de certaines pièces. Les embouteillages denses dans les grandes villes comme Abidjan, Dakar ou Bamako fatiguent prématurément le moteur et le système de refroidissement. Un entretien rigoureux n\'est pas un luxe, c\'est une nécessité absolue pour éviter les pannes coûteuses et garantir votre sécurité.',
            'De plus, la poussière latéritique s\'infiltre partout, nécessitant des remplacements de filtres plus fréquents qu\'en Europe ou en Amérique du Nord. Les routes dégradées soumettent la suspension et les pneus à des contraintes intenses.',
          ],
        },
        {
          id: 'dix-points',
          heading: 'Les 10 points d\'entretien essentiels',
          body: [
            'Votre véhicule mérite un suivi régulier sur chacun de ces éléments clés pour prolonger sa durée de vie et garantir la sécurité de tous les passagers.',
          ],
          subsections: [
            { heading: '1. L\'huile moteur', body: 'Le sang de votre moteur. En raison des fortes chaleurs, optez pour une huile adaptée (souvent avec un indice de viscosité plus élevé à chaud, type 10W40 ou 15W40 selon les préconisations constructeur). Vidangez tous les 5 000 à 7 500 km.' },
            { heading: '2. Le système de refroidissement', body: 'Le liquide de refroidissement doit être vérifié mensuellement. Ne complétez jamais avec de l\'eau du robinet qui entartre et oxyde le circuit. Un radiateur en bon état est vital pour éviter la surchauffe dans les embouteillages.' },
            { heading: '3. Les filtres (air, huile, carburant, habitacle)', body: 'Le filtre à air souffre particulièrement de la poussière. Remplacez-le à chaque vidange ou nettoyez-le à l\'air comprimé entre-temps. Le filtre à carburant est crucial pour protéger vos injecteurs d\'éventuelles impuretés.' },
            { heading: '4. Les pneus', body: 'Vérifiez la pression à froid toutes les deux semaines. Un pneu sous-gonflé chauffe davantage et risque l\'éclatement. Surveillez également l\'usure de la bande de roulement, particulièrement avant la saison des pluies pour éviter l\'aquaplaning.' },
            { heading: '5. Le système de freinage', body: 'Plaquettes et disques s\'usent vite en circulation urbaine. Un bruit strident au freinage est le signe qu\'il est temps de les changer. Faites contrôler le niveau de liquide de frein régulièrement.' },
            { heading: '6. La batterie', body: 'Les fortes chaleurs réduisent la durée de vie des batteries (souvent 18 à 24 mois en Afrique). Nettoyez les cosses si elles s\'oxydent et vérifiez la tension avant de longs trajets.' },
            { heading: '7. La suspension et la direction', body: 'Amortisseurs, rotules, et silentblocs encaissent les nids-de-poule et les pistes non bitumées. Des bruits de claquement sur mauvaise route doivent vous alerter immédiatement.' },
            { heading: '8. Les courroies', body: 'La courroie de distribution et la courroie d\'accessoires doivent être inspectées. Une rupture de courroie de distribution entraîne généralement la casse du moteur — une réparation de plusieurs centaines de milliers de FCFA.' },
            { heading: '9. L\'éclairage', body: 'Vérifiez que tous vos feux fonctionnent (croisement, route, clignotants, stops) pour voir et être vu, d\'autant que l\'éclairage public est parfois défaillant.' },
            { heading: '10. La climatisation', body: 'Indispensable sous nos latitudes. Faites recharger le gaz réfrigérant dès que le froid perd en intensité, et n\'oubliez pas le filtre d\'habitacle pour éviter les mauvaises odeurs et les allergies.' },
          ],
        },
        {
          id: 'frequences',
          heading: 'Fréquences d\'entretien recommandées',
          body: [
            'Chaque mois : Pression des pneus, niveaux (huile, refroidissement, freins), éclairage.',
            'Tous les 5 000 à 7 500 km : Vidange d\'huile, changement filtre à huile et filtre à air.',
            'Tous les 20 000 km : Filtre à carburant, filtre d\'habitacle, bougies (essence).',
            'Tous les 40 000 km : Vidange boîte de vitesses, liquide de frein, liquide de refroidissement.',
          ],
        },
        {
          id: 'ou-trouver',
          heading: 'Où trouver ses pièces de rechange de qualité ?',
          body: [
            'Le marché regorge de pièces de contrefaçon qui peuvent endommager votre véhicule. Sur AutoAfrique, nous sélectionnons rigoureusement nos vendeurs partenaires pour vous garantir des pièces de qualité, qu\'elles soient neuves d\'origine, adaptables certifiées, ou d\'occasion contrôlées (réemploi).',
            'Chaque pièce d\'occasion mise en ligne est inspectée, testée et remise en état avant d\'être proposée à la vente, avec sa propre garantie. Les pièces neuves bénéficient de la garantie AutoAfrique standard.',
          ],
        },
        {
          id: 'budget',
          heading: 'Budget moyen d\'entretien en FCFA',
          body: [
            'En moyenne, comptez entre 25 000 et 45 000 FCFA pour une vidange complète avec filtres (selon la gamme d\'huile et le véhicule). Pour un jeu de plaquettes de frein avant de qualité, prévoyez entre 15 000 et 30 000 FCFA.',
            'Anticiper ces petites dépenses d\'entretien régulier vous évitera des factures de réparation salées dépassant souvent les centaines de milliers de FCFA en cas de casse majeure. Un entretien préventif est toujours moins cher qu\'une réparation curative.',
          ],
        },
      ]}
      resources={[
        { title: 'Catalogue Filtres', description: 'Filtres à air, huile, carburant et habitacle pour toutes marques.', href: '/marketplace/categorie/filtre' },
        { title: 'Catalogue Freins', description: 'Plaquettes, disques et kits de frein inspectés.', href: '/marketplace/categorie/frein' },
        { title: 'Huiles & Fluides', description: 'Huiles moteur, liquides de refroidissement et de frein.', href: '/marketplace/categorie/huiles-fluides' },
        { title: 'Pneus & Jantes', description: 'Pneus neufs et d\'occasion contrôlée pour toutes marques.', href: '/marketplace/categorie/pneus-jantes' },
      ]}
      cta={{
        title: 'Trouvez vos pièces d\'entretien sur AutoAfrique',
        description: 'Des milliers de pièces neuves et d\'occasion contrôlée, livrées en 24-72h à Abidjan, Dakar et dans toute l\'Afrique de l\'Ouest.',
        buttonText: 'Explorer le catalogue',
        buttonHref: '/catalogue',
      }}
      relatedArticles={[
        {
          slug: 'choisir-pieces-occasion-controlee',
          title: 'Comment choisir une pièce d\'occasion contrôlée ?',
          excerpt: 'Neuf ou occasion ? Voici comment vérifier la qualité d\'une pièce de réemploi avant l\'achat.',
          category: 'Guide d\'achat',
        },
        {
          slug: 'paiement-mobile-money-auto',
          title: 'Mobile Money et pièces auto : payer en toute sécurité',
          excerpt: 'Wave, Orange Money, MTN MoMo : comment le séquestre Mobile Money protège vendeurs et acheteurs.',
          category: 'Paiement',
        },
      ]}
    />
  );
}
