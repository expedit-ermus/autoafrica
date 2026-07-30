'use client';
import { useState } from 'react';

interface NewsletterSignupProps {
  headline?: string;
  subtext?: string;
  className?: string;
}

export default function NewsletterSignup({
  headline = 'Restez informé des nouvelles pièces',
  subtext = 'Recevez les meilleures offres et les nouvelles références directement dans votre boîte mail.',
  className = '',
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Veuillez entrer un email valide');
      setStatus('error');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/v1/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Erreur lors de l\'inscription');
      setStatus('success');
      setEmail('');
    } catch {
      setErrorMsg('Une erreur est survenue. Réessayez.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <section className={`py-16 sm:py-20 ${className}`}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-white rounded-2xl border border-green-200 shadow-lg p-8 sm:p-12">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Merci pour votre inscription !</h3>
            <p className="text-gray-600">Vous recevrez nos prochaines offres et nouveautés par email.</p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-6 text-sm text-[#E85D04] font-medium hover:underline"
            >
              S&apos;inscrire un autre email
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 sm:py-20 ${className}`}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div
          className="rounded-2xl p-8 sm:p-12 text-center"
          style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #0F2744 100%)' }}
        >
          <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-[#FF6B35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">{headline}</h2>
          <p className="text-gray-300 mb-8 max-w-md mx-auto">{subtext}</p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all"
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #E85D04, #D00000)' }}
            >
              {status === 'loading' ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Inscription...
                </span>
              ) : (
                "S'inscrire"
              )}
            </button>
          </form>

          {status === 'error' && errorMsg && (
            <p className="text-red-300 text-sm mt-3">{errorMsg}</p>
          )}

          <p className="text-xs text-gray-400 mt-4">
            En vous inscrivant, vous acceptez notre politique de confidentialité. Désabonnement en un clic.
          </p>
        </div>
      </div>
    </section>
  );
}
