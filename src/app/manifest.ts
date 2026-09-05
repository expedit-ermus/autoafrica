import type { MetadataRoute } from 'next';

/**
 * Source de vérité unique du manifeste PWA.
 * Next.js le sert sur /manifest.webmanifest et injecte le <link> automatiquement :
 * ne pas ajouter de <link rel="manifest"> manuel dans le layout.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AutoAfrique — Marketplace Pièces Auto & Garages',
    short_name: 'AutoAfrique',
    description:
      "N°1 des pièces détachées auto neuves & d'occasion contrôlée et devis garages à Abidjan et en Afrique de l'Ouest.",
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    lang: 'fr',
    dir: 'ltr',
    categories: ['business', 'shopping', 'automotive'],
    background_color: '#F8FAFC',
    theme_color: '#FF6B35',
    icons: [
      { src: '/icons/icon-72x72.png', sizes: '72x72', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-96x96.png', sizes: '96x96', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-128x128.png', sizes: '128x128', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-144x144.png', sizes: '144x144', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-384x384.png', sizes: '384x384', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/maskable-icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Marketplace', short_name: 'Market', url: '/dashboard/marketplace', description: 'Accéder au marketplace' },
      { name: 'Inventaire', short_name: 'Stock', url: '/dashboard/inventory', description: 'Gérer votre inventaire' },
      { name: 'Commandes', short_name: 'Orders', url: '/dashboard/orders', description: 'Vos commandes' },
    ],
  };
}
