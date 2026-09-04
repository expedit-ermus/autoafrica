import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AutoAfrique — Marketplace Pièces Auto & Garages',
    short_name: 'AutoAfrique',
    description: 'N°1 des pièces détachées auto neuves & d\'occasion contrôlée et devis garages à Abidjan et en Afrique de l\'Ouest.',
    start_url: '/',
    display: 'standalone',
    background_color: '#090d16',
    theme_color: '#FF6B35',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
