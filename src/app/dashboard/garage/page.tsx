import type { Metadata } from 'next';
import Link from 'next/link';
import { marquesPourvues } from '@/modules/products/marques-pourvues';
import GarageManager from './GarageManager';

// Espace personnel : /dashboard est bloque par robots.txt et protege par le
// middleware, le referencement n'aurait aucun effet.
export const metadata: Metadata = {
  title: 'Mon garage',
  robots: { index: false, follow: false },
};

export default async function GaragePage() {
  const marques = await marquesPourvues();

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" aria-label="Fil d'Ariane">
          <Link href="/dashboard" className="hover:text-orange-500 transition">Tableau de bord</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium" aria-current="page">Mon garage</span>
        </nav>

        <header className="mb-8 max-w-2xl">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Mon garage</h1>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Enregistrez vos véhicules une fois : vous les retrouverez ensuite par leur plaque
            depuis la <Link href="/recherche-pieces" className="font-semibold text-orange-600 hover:underline">recherche de pièces</Link>.
            Une immatriculation ne dit rien du véhicule par elle-même — c&apos;est ce que vous
            déclarez ici qui permet de l&apos;identifier.
          </p>
        </header>

        <GarageManager marques={marques} />
      </div>
    </div>
  );
}
