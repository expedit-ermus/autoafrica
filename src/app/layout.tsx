import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { ToastProvider } from "@/contexts/ToastContext";
import GlobalWidgets from "@/components/GlobalWidgets";
import TrackingProvider from "@/components/TrackingProvider";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import CookieConsentBanner from "@/components/CookieConsentBanner";


export const metadata: Metadata = {
  title: {
    default: "Pièces détachées auto Abidjan, neuf & occasion | AutoAfrique",
    template: "%s | AutoAfrique",
  },
  description: "Marketplace de pièces détachées automobile à Abidjan et en Afrique de l'Ouest. Paiement Mobile Money sécurisé (Orange Money, MTN MoMo, Wave), livraison 24-72h, garantie occasion contrôlée.",
  keywords: ["pièces détachées", "auto", "automobile", "Abidjan", "Côte d'Ivoire", "Afrique de l'Ouest", "Mobile Money", "Orange Money", "MTN MoMo", "Moov Money", "Wave", "marketplace", "ERP", "garage", "revendeur", "Toyota", "Hyundai", "Kia", "Peugeot", "Mercedes"],
  authors: [{ name: "AutoAfrique" }],
  creator: "AutoAfrique",
  publisher: "AutoAfrique",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://autoafrique-saas.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://autoafrique-saas.vercel.app",
    siteName: "AutoAfrique",
    title: "Pièces détachées auto Abidjan | AutoAfrique - Marketplace Afrique de l'Ouest",
    description: "Marketplace de pièces détachées automobile à Abidjan. Paiement Mobile Money sécurisé, livraison rapide, garantie occasion contrôlée.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AutoAfrique - Marketplace Pièces Détachées Auto Abidjan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pièces détachées auto Abidjan | AutoAfrique",
    description: "Marketplace de pièces détachées automobile à Abidjan et en Afrique de l'Ouest.",
    images: ["/og-image.png"],
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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FF6B35" },
    { media: "(prefers-color-scheme: dark)", color: "#FF6B35" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" dir="ltr">
      <head>
        <meta name="google-site-verification" content="google67878e31d8998189" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-orange-600 focus:text-white focus:font-semibold focus:shadow-lg"
        >
          Aller au contenu
        </a>
        <AppProvider>
          <WishlistProvider>
            <ToastProvider>
              <div id="main-content" tabIndex={-1}>
                {children}
              </div>
              <GlobalWidgets />
              <CookieConsentBanner />
            </ToastProvider>

          </WishlistProvider>
        </AppProvider>
        <TrackingProvider />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
