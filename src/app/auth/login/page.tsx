'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/contexts/ToastContext';
import { track } from '@/lib/tracking';

export default function LoginPage() {
  const { t, setUser } = useApp();
  const { addToast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const emailValid = email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailTouched(true);
    if (!email || !password) { addToast('error', 'Veuillez remplir tous les champs'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      setUser(data.data.user);
      track('login', { method: 'email' });
      addToast('success', 'Connexion réussie !');
      router.push('/dashboard');
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <style>{`
        @keyframes authFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes authSlideLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes authPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        .auth-fade-in { animation: authFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .auth-fade-in-delay-1 { animation: authFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards; opacity: 0; }
        .auth-fade-in-delay-2 { animation: authFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }
        .auth-fade-in-delay-3 { animation: authFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; opacity: 0; }
        .auth-slide-left { animation: authSlideLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards; opacity: 0; }
        .auth-glow { box-shadow: 0 0 40px rgba(232, 93, 4, 0.12), 0 0 80px rgba(232, 93, 4, 0.06); }
        .auth-input-group { position: relative; }
        .auth-input-group input { padding-left: 48px; }
        .auth-input-group .auth-input-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #94a3b8; transition: color 0.2s; pointer-events: none; }
        .auth-input-group:focus-within .auth-input-icon { color: #E85D04; }
        .auth-input-group input.auth-error { border-color: #DC2626; box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.08); }
        .auth-input-group input.auth-success { border-color: #059669; }
        .auth-check-icon { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); }
      `}</style>

      {/* Left panel - Brand showcase */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)' }}></div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(232, 93, 4, 0.08) 0%, transparent 70%)' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full" style={{ background: 'radial-gradient(circle, rgba(208, 0, 0, 0.06) 0%, transparent 70%)' }}></div>
        <div className="absolute top-10 right-10 w-2 h-2 bg-orange-400 rounded-full" style={{ animation: 'authPulse 3s ease-in-out infinite' }}></div>
        <div className="absolute top-32 left-16 w-1.5 h-1.5 bg-orange-300 rounded-full" style={{ animation: 'authPulse 4s ease-in-out infinite 1s' }}></div>
        <div className="absolute bottom-20 left-32 w-1 h-1 bg-red-400 rounded-full" style={{ animation: 'authPulse 3.5s ease-in-out infinite 0.5s' }}></div>

        <div className="relative z-10 max-w-md w-full auth-slide-left">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-xl shadow-orange-500/30">
              <span className="text-white font-bold text-2xl">A</span>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Auto<span className="text-orange-400">Afrique</span></h1>
              <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">ERP Marketplace</p>
            </div>
          </div>

          {/* Tagline */}
          <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-4">
            La plateforme
            <br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #E85D04, #FF8C00)' }}>
              pièces auto
            </span>
            <br />
            pour l&apos;Afrique
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-sm">
            Gérez votre boutique, vendez en ligne et acceptez les paiements Mobile Money.
          </p>

          {/* Feature highlights */}
          <div className="space-y-4">
            {[
              { icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                ), label: '100K+ Pièces', desc: 'en stock disponible' },
              { icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                ), label: 'Mobile Money', desc: 'Orange, MTN, Wave' },
              { icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                ), label: 'Paiements Sécurisés', desc: 'système escrow' },
              { icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                ), label: '10 Pays', desc: 'couverts en Afrique' },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center gap-4 group" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110" style={{ background: 'rgba(232, 93, 4, 0.1)', border: '1px solid rgba(232, 93, 4, 0.15)' }}>
                  <div className="text-orange-400">{item.icon}</div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 auth-fade-in">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-orange-500/20">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight">Auto<span className="text-gradient">Afrique</span></span>
              <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">ERP Marketplace</p>
            </div>
          </div>

          {/* Mobile gradient accent */}
          <div className="lg:hidden absolute top-0 left-0 right-0 h-1 gradient-primary"></div>

          {/* Form container with glass morphism on mobile */}
          <div className="lg:bg-transparent lg:p-0 p-8 lg:rounded-none rounded-2xl" style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)' }}>
            {/* Header */}
            <div className="mb-8 auth-fade-in-delay-1">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">{t.auth.loginTitle}</h2>
              <p className="text-gray-500">Connectez-vous à votre espace vendeur</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email field */}
              <div className="auth-fade-in-delay-1">
                <label htmlFor="login-email" className="block text-sm font-semibold text-gray-700 mb-2">{t.auth.email}</label>
                <div className="auth-input-group">
                  <div className="auth-input-icon">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                  </div>
                  <input
                    id="login-email"
                    type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                    className={`input-field ${emailTouched && email && !emailValid ? 'auth-error' : ''} ${emailTouched && emailValid ? 'auth-success' : ''}`}
                    placeholder="vous@exemple.com" required
                  />
                  {emailTouched && emailValid && (
                    <div className="auth-check-icon"><svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></div>
                  )}
                  {emailTouched && email && !emailValid && (
                    <div className="auth-check-icon"><svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></div>
                  )}
                </div>
              </div>

              {/* Password field */}
              <div className="auth-fade-in-delay-2">
                <label htmlFor="login-password" className="block text-sm font-semibold text-gray-700 mb-2">{t.auth.password}</label>
                <div className="auth-input-group">
                  <div className="auth-input-icon">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                  </div>
                  <input
                    id="login-password"
                    type="password" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field" placeholder="••••••••" required
                  />
                </div>
              </div>

              {/* Remember me + Forgot password */}
              <div className="flex items-center justify-between auth-fade-in-delay-2">
                <label className="flex items-center gap-2.5 text-sm text-gray-600 cursor-pointer select-none group">
                  <div className="relative">
                    <input
                      type="checkbox" checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-4 h-4 rounded border-2 border-gray-300 peer-checked:border-orange-500 peer-checked:bg-orange-500 transition-all duration-200 flex items-center justify-center">
                      {rememberMe && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                    </div>
                  </div>
                  <span className="group-hover:text-gray-900 transition-colors">Se souvenir de moi</span>
                </label>
                <span className="text-sm text-orange-600 font-semibold cursor-pointer hover:text-orange-700 hover:underline transition-all duration-200">
                  {t.auth.forgotPassword}
                </span>
              </div>

              {/* Submit button */}
              <button type="submit" disabled={loading} className="btn-primary w-full text-center !py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed auth-fade-in-delay-3 rounded-xl">
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion en cours...
                  </span>
                ) : t.auth.loginBtn}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6 auth-fade-in-delay-3">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-400 font-medium">ou continuer avec</span>
              </div>
            </div>

            {/* Social login buttons - disabled but styled */}
            <div className="grid grid-cols-2 gap-3 mb-6 auth-fade-in-delay-3">
              <button disabled className="flex items-center justify-center gap-2.5 px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold transition-all duration-200 bg-white opacity-60 cursor-not-allowed hover:border-gray-200 hover:bg-white">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                <span className="text-gray-500">Google</span>
              </button>
              <button disabled className="flex items-center justify-center gap-2.5 px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold transition-all duration-200 bg-white opacity-60 cursor-not-allowed hover:border-gray-200 hover:bg-white">
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                <span className="text-gray-500">Facebook</span>
              </button>
            </div>

            {/* Register link */}
            <p className="text-center text-sm text-gray-500 mb-6">
              {t.auth.noAccount}{' '}
              <Link href="/auth/register" className="text-orange-600 font-semibold hover:text-orange-700 hover:underline transition-all duration-200">
                {t.nav.register}
              </Link>
            </p>

            {/* Demo credentials */}
            <div className="p-4 rounded-xl border border-gray-100" style={{ background: 'linear-gradient(135deg, rgba(249, 250, 251, 0.8) 0%, rgba(254, 243, 199, 0.3) 100%)' }}>
              <div className="flex items-center justify-center gap-2 mb-2.5">
                <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-5.1m0 0L11.42 4.97m-5.1 5.1H21M3 3v18" /></svg>
                <p className="text-xs font-semibold text-gray-700">Compte de démo</p>
              </div>
              <div className="text-xs text-gray-500 text-center space-y-1">
                <p><span className="font-semibold text-gray-700">moussa@example.com</span> / password123</p>
                <p><span className="font-semibold text-gray-700">abdoulaye@example.com</span> / password123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
