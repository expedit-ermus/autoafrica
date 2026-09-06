'use client';

/**
 * Dernier filet de sécurité : `error.tsx` ne rattrape pas les erreurs survenues
 * dans le layout racine lui-même. Sans ce fichier, une telle erreur affiche la
 * page blanche par défaut de Next.js, sans marque ni moyen de repartir.
 *
 * Ce composant remplace tout le document : il doit fournir ses propres balises
 * `<html>` et `<body>`, et ne peut pas s'appuyer sur les styles du layout —
 * d'où les styles en ligne plutôt que les classes Tailwind.
 */

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: '#F8FAFC',
          color: '#0F172A',
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <main style={{ maxWidth: '28rem', textAlign: 'center' }}>
          <div
            style={{
              width: '5rem',
              height: '5rem',
              margin: '0 auto 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '1.5rem',
              background: '#FFFFFF',
              boxShadow: '0 10px 30px -12px rgba(15, 23, 42, 0.25)',
            }}
          >
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FF6B35' }}>AA</span>
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
            Une erreur inattendue est survenue
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748B', margin: '0 0 2rem' }}>
            L&apos;application n&apos;a pas pu s&apos;afficher. Vous pouvez réessayer, ou revenir à
            l&apos;accueil.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={reset}
              style={{
                padding: '0.625rem 1.25rem',
                background: '#FF6B35',
                color: '#FFFFFF',
                fontSize: '0.875rem',
                fontWeight: 600,
                border: 'none',
                borderRadius: '0.75rem',
                cursor: 'pointer',
              }}
            >
              Réessayer
            </button>
            {/*
              Navigation dure volontaire : `next/link` ferait une navigation
              client qui remonterait le meme layout racine defaillant. Seul un
              rechargement complet du document permet de repartir sainement.
            */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                padding: '0.625rem 1.25rem',
                background: '#FFFFFF',
                color: '#0F172A',
                fontSize: '0.875rem',
                fontWeight: 600,
                border: '1px solid #E2E8F0',
                borderRadius: '0.75rem',
                textDecoration: 'none',
              }}
            >
              Retour à l&apos;accueil
            </a>
          </div>

          {/* Identifiant technique : permet au support de retrouver l'incident. */}
          {error.digest && (
            <p style={{ marginTop: '2rem', fontSize: '0.75rem', color: '#94A3B8' }}>
              Référence à communiquer au support :{' '}
              <code style={{ fontFamily: 'ui-monospace, monospace' }}>{error.digest}</code>
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
