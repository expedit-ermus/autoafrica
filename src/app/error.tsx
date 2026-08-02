'use client';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-3xl bg-white shadow-lg">
          <span className="text-2xl font-extrabold text-[var(--color-primary)]">AA</span>
        </div>
        <p className="text-[var(--color-primary)] font-extrabold text-6xl mb-2">500</p>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Erreur serveur</h1>
        <p className="text-gray-500 text-sm mb-8">Erreur serveur, réessayez</p>
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-xl hover:bg-[#E85A25] transition-all shadow-sm"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
