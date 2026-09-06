'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function BlockedContent() {
  const params = useSearchParams();
  const reason = params.get('reason') ?? 'suspended';

  const isBanned = reason === 'banned';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)' }}>

      {/* Animated pulse ring */}
      <div className="relative mb-8">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center
          ${isBanned ? 'bg-red-500/20 border-2 border-red-500' : 'bg-amber-500/20 border-2 border-amber-500'}`}>
          {isBanned ? (
            <svg className="w-12 h-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          ) : (
            <svg className="w-12 h-12 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          )}
        </div>
        {/* Pulsing ring */}
        <div className={`absolute inset-0 rounded-full animate-ping opacity-20
          ${isBanned ? 'bg-red-500' : 'bg-amber-500'}`} />
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 text-center backdrop-blur-sm">
        <h1 className={`text-2xl font-bold mb-3 ${isBanned ? 'text-red-400' : 'text-amber-400'}`}>
          {isBanned ? 'Compte Banni' : 'Compte Suspendu'}
        </h1>

        <p className="text-slate-300 mb-2 leading-relaxed">
          {isBanned
            ? "Votre compte a été banni définitivement pour non-respect des Conditions Générales d'Utilisation d'AutoAfrique."
            : "Votre compte est temporairement suspendu. Vous ne pouvez pas accéder à votre tableau de bord pour le moment."}
        </p>


        {!isBanned && (
          <p className="text-slate-400 text-sm mb-6">
            Cette suspension peut être levée par notre équipe. Contactez-nous pour plus d&apos;informations.
          </p>

        )}

        {isBanned && (
          <p className="text-slate-400 text-sm mb-6">
            Si vous pensez qu’il s’agit d’une erreur, contactez notre support avec votre adresse e-mail.
          </p>
        )}

        {/* CTA buttons */}
        <div className="flex flex-col gap-3">
          <a
            href="mailto:support@autoafrique.com"
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-200
              ${isBanned
                ? 'bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30'
                : 'bg-amber-500/20 border border-amber-500/50 text-amber-300 hover:bg-amber-500/30'}`}
          >
            📧 Contacter le Support
          </a>
          <Link
            href="/"
            className="w-full py-3 rounded-xl font-semibold bg-white/[0.05] border border-white/[0.1] text-slate-300 hover:bg-white/[0.10] transition-all duration-200"
          >
            ← Retour à l’accueil
          </Link>
        </div>
      </div>

      {/* Reference code */}
      <p className="mt-6 text-slate-600 text-xs">
        AutoAfrique SaaS • Assistance : support@autoafrique.com
      </p>
    </div>
  );
}

export default function BlockedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900" />}>
      <BlockedContent />
    </Suspense>
  );
}
