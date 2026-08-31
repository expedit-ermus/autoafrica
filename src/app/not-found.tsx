import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page introuvable | AutoAfrique",
  description: "La page que vous cherchez n'existe pas ou a été déplacée.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="text-center max-w-lg bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-xl">
        {/* Logo & Code HTTP 404 */}
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-orange-100 text-orange-600 font-extrabold text-2xl shadow-inner">
          404
        </div>
        
        {/* Message clair */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
          Page introuvable
        </h1>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          Désolé, la page que vous recherchez n&apos;existe pas, a été supprimée ou a changé d&apos;adresse.
        </p>

        {/* Recherche interne rapide */}
        <form action="/dashboard/marketplace" method="GET" className="mb-6">
          <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-300 focus-within:border-orange-500 transition-all">
            <input
              type="text"
              name="search"
              aria-label="Rechercher"
              placeholder="Rechercher une pièce, un moteur, un filtre..."
              className="w-full bg-transparent px-3 py-2 text-sm text-gray-900 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl transition-all whitespace-nowrap"
            >
              Rechercher
            </button>
          </div>
        </form>

        {/* Suggestions limitées & Liens d'accès rapides */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <p className="text-xs font-extrabold uppercase text-gray-400 tracking-wider mb-2">
            Accès Rapide & Suggestions
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <Link
              href="/"
              className="p-2.5 bg-gray-50 hover:bg-orange-50 hover:text-orange-700 text-gray-700 font-bold rounded-xl border border-gray-200 transition-all text-center"
            >
              🏠 Accueil
            </Link>
            <Link
              href="/dashboard/marketplace"
              className="p-2.5 bg-gray-50 hover:bg-orange-50 hover:text-orange-700 text-gray-700 font-bold rounded-xl border border-gray-200 transition-all text-center"
            >
              🛒 Marketplace
            </Link>
            <Link
              href="/aide"
              className="p-2.5 bg-gray-50 hover:bg-orange-50 hover:text-orange-700 text-gray-700 font-bold rounded-xl border border-gray-200 transition-all text-center"
            >
              ❓ Centre d&apos;Aide
            </Link>
          </div>
        </div>

        {/* CTA principal */}
        <div className="mt-8">
          <Link
            href="/"
            className="inline-block w-full py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all"
          >
            Retourner à la page d&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
