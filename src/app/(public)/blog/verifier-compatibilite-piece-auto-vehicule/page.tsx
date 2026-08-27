import ArticlePageTemplate from '@/components/ArticlePageTemplate';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Comment vérifier la compatibilité d\'une pièce auto avec son véhicule ?',
  description: 'Immatriculation, VIN, motorisation : découvrez les méthodes fiables pour vérifier qu\'une pièce détachée est compatible avec votre voiture avant de l\'acheter à Abidjan.',
  alternates: {
    canonical: 'https://autoafrique-saas.vercel.app/blog/verifier-compatibilite-piece-auto-vehicule',
  },
};

export default function VerifierCompatibilitePiecePage() {
  return (
    <ArticlePageTemplate
      slug="verifier-compatibilite-piece-auto-vehicule"
      title="Comment vérifier la compatibilité d'une pièce auto avec son véhicule ?"
      excerpt="Commander la mauvaise référence est la première cause de retour de pièces détachées en Afrique de l'Ouest. Voici les 4 méthodes fiables pour être certain qu'une pièce correspond bien à votre véhicule avant de payer."
      author={{ name: 'Équipe AutoAfrique', role: 'Experts Automobile' }}
      datePublished="2026-08-27"
      mainImage={{
        url: '/images/hero-bg.jpg',
        alt: 'Mécanicien vérifiant la référence d\'une pièce automobile avant montage',
        caption: 'Une pièce mal référencée est la première cause de retour et de perte de temps au garage.',
      }}
      tableOfContents={[
        { id: 'pourquoi-ca-compte', title: 'Pourquoi la compatibilité est le premier problème à Abidjan' },
        { id: 'recherche-immatriculation', title: 'Méthode 1 : la recherche par immatriculation' },
        { id: 'recherche-modele-motorisation', title: 'Méthode 2 : marque, modèle et motorisation' },
        { id: 'numero-vin', title: 'Méthode 3 : le numéro de châssis (VIN)' },
        { id: 'reference-piece-usagee', title: 'Méthode 4 : comparer avec la pièce usagée' },
        { id: 'erreurs-frequentes', title: 'Les erreurs de compatibilité les plus fréquentes' },
      ]}
      contentSections={[
        {
          id: 'pourquoi-ca-compte',
          heading: 'Pourquoi la compatibilité est le premier problème à Abidjan',
          body: [
            'Entre les versions restylées, les motorisations importées d\'Europe, du Golfe ou d\'Asie, et les nombreuses variantes d\'un même modèle (Toyota Corolla, Hyundai Elantra, Peugeot 308), une même pièce visuellement identique peut ne pas convenir à votre véhicule. C\'est la première cause de mécontentement chez les acheteurs de pièces détachées en Côte d\'Ivoire, bien avant la question du prix.',
            'Chez les vendeurs informels ou dans une <a href="/blog/casse-auto-vs-autoafrique">casse auto traditionnelle</a>, la vérification repose souvent sur l\'œil du vendeur. Sur AutoAfrique, elle repose sur des données structurées, ce qui réduit fortement le risque d\'erreur.',
          ],
        },
        {
          id: 'recherche-immatriculation',
          heading: 'Méthode 1 : la recherche par immatriculation',
          body: [
            'La méthode la plus rapide : saisissez votre numéro de plaque d\'immatriculation (Côte d\'Ivoire ou Sénégal) directement sur la <a href="/">page d\'accueil AutoAfrique</a>. Le système retrouve automatiquement la fiche technique de votre véhicule et ne vous propose que les pièces référencées pour ce modèle exact, y compris la bonne motorisation.',
            'C\'est la méthode recommandée pour les particuliers qui ne connaissent pas le détail technique de leur voiture.',
          ],
        },
        {
          id: 'recherche-modele-motorisation',
          heading: 'Méthode 2 : marque, modèle et motorisation',
          body: [
            'Si votre véhicule n\'a pas de plaque locale ou vient d\'être importé, utilisez le <a href="/catalogue">sélecteur par marque et modèle</a> : constructeur (Toyota, Hyundai, Peugeot, Kia...), modèle précis (Hilux, Corolla, 308...), puis motorisation exacte (par exemple 2.4L D-4D Diesel 150ch). Cette troisième étape est cruciale : deux Hilux du même millésime peuvent avoir des moteurs différents, donc des <a href="/categories/filtre">filtres</a>, <a href="/categories/courroies-chaines">courroies de distribution</a> ou <a href="/categories/frein">disques de frein</a> incompatibles.',
          ],
        },
        {
          id: 'numero-vin',
          heading: 'Méthode 3 : le numéro de châssis (VIN)',
          body: [
            'Pour les pièces mécaniques sensibles (moteur, boîte de vitesses, injection), le numéro de série du véhicule (VIN, 17 caractères, visible sur la carte grise ou sous le pare-brise) reste la source la plus fiable. Il permet à nos <a href="/contact">conseillers WhatsApp</a> de confirmer une référence en cas de doute, notamment pour les <a href="/categories/moteur">moteurs et boîtes d\'occasion contrôlée</a> où l\'erreur coûte cher.',
          ],
        },
        {
          id: 'reference-piece-usagee',
          heading: 'Méthode 4 : comparer avec la pièce usagée',
          body: [
            'Pour les pièces d\'usure courante (plaquettes, filtres, courroies), le plus sûr reste de démonter l\'ancienne pièce et de relever sa référence constructeur (souvent gravée ou sur une étiquette). Notre <a href="/estimation-devis">estimateur de devis</a> vous aide à identifier la pièce recommandée selon le symptôme, que vous pourrez ensuite confirmer par la référence.',
          ],
        },
        {
          id: 'erreurs-frequentes',
          heading: 'Les erreurs de compatibilité les plus fréquentes',
          body: [
            'Confondre deux générations d\'un même modèle (par exemple deux générations de Hyundai Tucson aux plateformes différentes), ignorer la version du marché d\'origine (véhicules destinés au Golfe, à l\'Europe ou aux USA ayant des équipements différents), ou encore acheter une pièce "compatible générique" sans vérifier la motorisation exacte.',
            'En cas de doute, mieux vaut toujours passer par la <a href="/aide">recherche guidée du catalogue</a> ou contacter un conseiller plutôt que de commander à l\'aveugle : chaque pièce livrée par AutoAfrique bénéficie d\'une <a href="/retours">garantie de conformité 48h</a> si jamais une erreur survient malgré tout.',
          ],
        },
      ]}
      resources={[
        { title: 'Catalogue complet', description: 'Recherchez par immatriculation, marque, modèle ou motorisation.', href: '/catalogue' },
        { title: 'Estimateur de devis', description: 'Identifiez la pièce recommandée selon votre panne.', href: '/estimation-devis' },
      ]}
      cta={{
        title: 'Trouvez la pièce compatible avec votre véhicule',
        description: 'Recherche par immatriculation ou par modèle : ne vous trompez plus jamais de référence.',
        buttonText: 'Rechercher une pièce',
        buttonHref: '/catalogue',
      }}
      relatedArticles={[
        {
          slug: 'choisir-pieces-occasion-controlee',
          title: 'Comment choisir une pièce d\'occasion contrôlée à Abidjan ?',
          excerpt: 'Neuf ou occasion ? Voici comment vérifier la qualité d\'une pièce de réemploi avant l\'achat.',
          category: 'Guide d\'achat',
        },
        {
          slug: 'entretien-vehicule-afrique',
          title: 'Guide complet : entretenir son véhicule en Afrique de l\'Ouest',
          excerpt: 'Les 10 points d\'entretien essentiels pour rouler en toute sécurité à Abidjan et Dakar.',
          category: 'Entretien',
        },
      ]}
    />
  );
}
