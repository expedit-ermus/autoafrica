import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page introuvable",
  description: "La page que vous cherchez n'existe pas ou a été déplacée.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-3xl bg-white shadow-lg">
          <span className="text-2xl font-extrabold text-[#FF6B35]">AA</span>
        </div>
        <p className="text-[#FF6B35] font-extrabold text-6xl mb-2">404</p>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Page introuvable</h1>
        <p className="text-gray-500 text-sm mb-8">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 bg-[#FF6B35] text-white text-sm font-semibold rounded-xl hover:bg-[#E85A25] transition-all shadow-sm"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/dashboard/marketplace"
            className="px-5 py-2.5 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-100 transition-all"
          >
            Parcourir le marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
