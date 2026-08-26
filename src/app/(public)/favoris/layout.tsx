import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mes pièces favorites',
  description:
    'Retrouvez vos pièces détachées auto favorites sauvegardées sur AutoAfrique.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function FavorisLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
