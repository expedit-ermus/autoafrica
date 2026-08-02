import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Véhicules — Annonces Côte d'Ivoire",
  description:
    "Consultez les annonces de véhicules d'occasion et neufs en Côte d'Ivoire : prix, kilométrage, carburant et boîte de vitesses.",
  alternates: {
    canonical: "/dashboard/vehicles",
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

export default function VehiclesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
