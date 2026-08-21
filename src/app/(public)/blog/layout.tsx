import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog & Guides Pièces Auto Abidjan',
  description:
    "Guides d'achat, conseils d'entretien auto, comparatifs casse auto vs pièces contrôlées et astuces Mobile Money à Abidjan et en Afrique de l'Ouest.",
  alternates: {
    canonical: 'https://autoafrique-saas.vercel.app/blog',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
