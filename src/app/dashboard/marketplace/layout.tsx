import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketplace — Pièces détachées automobile",
  description:
    "Parcourez le catalogue de pièces détachées automobile. Filtrez par marque, modèle et prix. Paiement Mobile Money en Afrique de l'Ouest.",
  alternates: {
    canonical: "/dashboard/marketplace",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
