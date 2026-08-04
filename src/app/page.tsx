import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LandingPage from '@/components/LandingPage';
import {
  OrganizationStructuredData,
  WebsiteStructuredData,
  FAQStructuredData,
} from '@/components/StructuredData';
import type { FAQEntry } from '@/lib/structured-data';

const faq: FAQEntry[] = [
  {
    question: 'Comment savoir si une pièce auto est compatible avec mon véhicule ?',
    answer:
      'Utilisez notre recherche par numéro d\'immatriculation ou sélectionnez la marque et le modèle de votre véhicule : AutoAfrique ne propose que des pièces référencées pour votre voiture, neuves ou d\'occasion contrôlée.',
  },
  {
    question: 'Quelle est la différence entre pièce d\'origine, pièce neuve et pièce d\'occasion contrôlée ?',
    answer:
      'La pièce d\'origine est fabriquée par le constructeur du véhicule. La pièce neuve est une pièce de remplacement neuve, garantie. L\'occasion contrôlée est une pièce de récupération testée et vérifiée par AutoAfrique, avec sa propre garantie.',
  },
  {
    question: 'Comment payer mes pièces auto sur AutoAfrique ?',
    answer:
      'Le paiement se fait en Mobile Money (Orange Money, MTN MoMo, Wave), directement et en toute sécurité, avec un reçu conservé dans votre compte.',
  },
];

export const metadata: Metadata = {
  title: 'Pièces détachées auto Abidjan, neuf & occasion',
  description:
    "Achetez pièces détachées auto neuves et occasion à Abidjan, Côte d'Ivoire. Prix transparents, garantie incluse, paiement Mobile Money, Afrique de l'Ouest.",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Pièces détachées auto Abidjan, neuf & occasion | AutoAfrique',
    description:
      "Achetez pièces détachées auto neuves et occasion à Abidjan, Côte d'Ivoire. Prix transparents, garantie incluse, paiement Mobile Money.",
    url: 'https://autoafrique-saas.vercel.app',
    type: 'website',
  },
};

export default function Home() {
  return (
    <div>
      <OrganizationStructuredData />
      <WebsiteStructuredData />
      <FAQStructuredData items={faq} />
      <Header />
      <LandingPage />
      <Footer />
    </div>
  );
}
