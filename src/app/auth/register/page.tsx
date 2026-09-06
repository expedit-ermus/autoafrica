'use client';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/contexts/ToastContext';
import { track } from '@/lib/tracking';

const COUNTRIES = [
  { code: 'CI', flag: '🇨🇮', name: 'Côte d\'Ivoire' },
  { code: 'SN', flag: '🇸🇳', name: 'Sénégal' },
  { code: 'ML', flag: '🇲🇱', name: 'Mali' },
  { code: 'BF', flag: '🇧🇫', name: 'Burkina Faso' },
  { code: 'NE', flag: '🇳🇪', name: 'Niger' },
  { code: 'GH', flag: '🇬🇭', name: 'Ghana' },
  { code: 'TG', flag: '🇹🇬', name: 'Togo' },
  { code: 'BJ', flag: '🇧🇯', name: 'Bénin' },
  { code: 'GN', flag: '🇬🇳', name: 'Guinée' },
  { code: 'CM', flag: '🇨🇲', name: 'Cameroun' },
];

export default function RegisterPage() {
  const { t, setUser } = useApp();
  const { addToast } = useToast();
  const router = useRouter();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', country: 'CI', password: '', confirmPassword: '' });
  const [role, setRole] = useState<'BUYER' | 'SELLER'>('BUYER');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | null>(null);

  // Retour depuis le fournisseur OAuth : ?provider=google|facebook.
  // On redirige sans toucher a l'etat : la page est remplacee dans la foulee,
  // afficher un indicateur de chargement ne servirait qu'a declencher un rendu
  // supplementaire pour rien.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const provider = params.get('provider');
    if (provider === 'google' || provider === 'facebook') {
      window.location.href = `/api/v1/auth/social?provider=${provider}`;
    }
  }, []);

  // Depuis un clic utilisateur : l'indicateur a du sens, la page reste visible
  // le temps de la redirection.
  const handleSocialAuth = useCallback((provider: 'google' | 'facebook') => {
    setSocialLoading(provider);
    addToast('info', `Redirection vers ${provider === 'google' ? 'Google' : 'Facebook'}...`);
    window.location.href = `/api/v1/auth/social?provider=${provider}`;
  }, [addToast]);


  const selectedCountry = COUNTRIES.find(c => c.code === form.country);

  const getPasswordStrength = (password: string): { label: string; color: string; width: string; textColor: string } => {
    if (password.length === 0) return { label: '', color: 'bg-gray-200', width: 'w-0', textColor: 'text-gray-400' };
    if (password.length < 4) return { label: 'Faible', color: 'bg-red-500', width: 'w-1/4', textColor: 'text-red-600' };
    if (password.length < 8) return { label: 'Moyen', color: 'bg-orange-500', width: 'w-2/4', textColor: 'text-orange-600' };
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const strength = [hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    if (strength <= 1) return { label: 'Moyen', color: 'bg-orange-500', width: 'w-3/4', textColor: 'text-orange-600' };
    return { label: 'Fort', color: 'bg-green-500', width: 'w-full', textColor: 'text-green-600' };
  };

  const passwordStrength = getPasswordStrength(form.password);


  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.password) { addToast('error', 'Veuillez remplir tous les champs obligatoires'); return; }
    if (form.password !== form.confirmPassword) { addToast('error', 'Les mots de passe ne correspondent pas'); return; }
    if (form.password.length < 8) { addToast('error', 'Le mot de passe doit contenir au moins 8 caractères'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone || undefined,
          country: form.country,
          password: form.password,
          role,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setUser(data.data.user);
      track('register', { role, country: form.country });
      addToast('success', 'Compte créé avec succès ! Bienvenue sur AutoAfrique');
      router.push('/dashboard');
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const passwordMismatch = form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

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
        .auth-fade-in-delay-4 { animation: authFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards; opacity: 0; }
        .auth-slide-left { animation: authSlideLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards; opacity: 0; }
        .auth-input-group { position: relative; }
        .auth-input-group input { padding-left: 48px; }
        .auth-input-group .auth-input-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #94a3b8; transition: color 0.2s; pointer-events: none; }
        .auth-input-group:focus-within .auth-input-icon { color: #E85D04; }
        .auth-input-group input.auth-error { border-color: #DC2626; box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.08); }
        .auth-input-group input.auth-success { border-color: #059669; }
        .auth-check-icon { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); }
        .auth-role-card { transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
        .auth-role-card:hover { transform: translateY(-2px); }
        .auth-role-card.selected { border-color: #E85D04; background: linear-gradient(135deg, rgba(232, 93, 4, 0.04) 0%, rgba(232, 93, 4, 0.08) 100%); box-shadow: 0 4px 16px rgba(232, 93, 4, 0.1); }
        .auth-role-card.selected .auth-role-check { opacity: 1; transform: scale(1); }
        .auth-role-check { opacity: 0; transform: scale(0.5); transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
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
              <span className="text-3xl font-extrabold text-white tracking-tight block">Auto<span className="text-orange-400">Afrique</span></span>
              <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">ERP Marketplace</p>
            </div>
          </div>

          {/* Tagline */}
          <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-4">
            Rejoignez
            <br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #E85D04, #FF8C00)' }}>
              850+ garagistes
            </span>
            <br />
            qui vendent en ligne
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-sm">
            Créez votre boutique en ligne, gérez votre stock et acceptez les paiements Mobile Money.
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { value: '10', label: 'Pays couverts' },
              { value: '24-72h', label: 'Livraison' },
              { value: 'Mobile Money', label: 'Paiement' },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-xl transition-all duration-300 hover:scale-105" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Feature highlights */}
          <div className="space-y-4">
            {[
              { icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                ), label: '10 Pays', desc: 'couverts en Afrique de l\u2019Ouest' },
              { icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                ), label: 'Mobile Money', desc: 'Orange, MTN, Wave' },
              { icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                ), label: 'Paiements Sécurisés', desc: 'système escrow' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4 group">
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
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-lg">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-6 auth-fade-in pt-2">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-orange-500/20">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight">Auto<span className="text-gradient">Afrique</span></span>
              <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">ERP Marketplace</p>
            </div>
          </div>

          {/* Mobile top accent bar */}
          <div className="lg:hidden absolute top-0 left-0 right-0 h-1.5 gradient-primary"></div>

          {/* Form container with glass morphism on mobile */}
          <div className="lg:bg-transparent lg:p-0 p-5 sm:p-8 lg:rounded-none rounded-2xl border border-gray-100/80 sm:border-none shadow-xl sm:shadow-none bg-white/95 sm:bg-transparent backdrop-blur-md">
            {/* Header */}
            <div className="mb-6 auth-fade-in-delay-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1.5 tracking-tight">{t.auth.registerTitle}</h1>
              <p className="text-xs sm:text-sm text-gray-500">Créez votre compte en quelques minutes</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Account type selector */}
              <div className="auth-fade-in-delay-1">
                <p className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">{t.auth.roleLabel}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3" role="radiogroup" aria-label={t.auth.roleLabel}>
                  <button type="button" role="radio" aria-checked={role === 'BUYER'}
                    onClick={() => setRole('BUYER')}
                    className={`auth-role-card relative w-full p-3.5 sm:p-4 rounded-xl border-2 text-left cursor-pointer ${role === 'BUYER' ? 'selected' : 'border-gray-200 hover:border-gray-300'}`}>
                    <span className="auth-role-check absolute top-3 right-3 w-5 h-5 rounded-full bg-orange-500 border-orange-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    </span>
                    <span className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-1.5 ${role === 'BUYER' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
                    </span>
                    <span className="block text-sm font-semibold text-gray-900">{t.auth.roleBuyer}</span>
                    <span className="block text-xs text-gray-500 mt-0.5">{t.auth.roleBuyerDesc}</span>
                  </button>
                  <button type="button" role="radio" aria-checked={role === 'SELLER'}
                    onClick={() => setRole('SELLER')}
                    className={`auth-role-card relative w-full p-3.5 sm:p-4 rounded-xl border-2 text-left cursor-pointer ${role === 'SELLER' ? 'selected' : 'border-gray-200 hover:border-gray-300'}`}>
                    <span className="auth-role-check absolute top-3 right-3 w-5 h-5 rounded-full bg-orange-500 border-orange-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    </span>
                    <span className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-1.5 ${role === 'SELLER' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .414.336.75.75.75z" /></svg>
                    </span>
                    <span className="block text-sm font-semibold text-gray-900">{t.auth.roleSeller}</span>
                    <span className="block text-xs text-gray-500 mt-0.5">{t.auth.roleSellerDesc}</span>
                  </button>
                </div>
              </div>

              {/* Name fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 auth-fade-in-delay-1">
                <div>
                  <label htmlFor="reg-firstName" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Prénom <span className="text-red-500">*</span></label>
                  <input id="reg-firstName" type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    autoComplete="given-name"
                    className="input-field !min-h-[52px] rounded-xl text-base" placeholder="Amadou" required />
                </div>
                <div>
                  <label htmlFor="reg-lastName" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Nom <span className="text-red-500">*</span></label>
                  <input id="reg-lastName" type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    autoComplete="family-name"
                    className="input-field !min-h-[52px] rounded-xl text-base" placeholder="Diallo" required />
                </div>
              </div>

              {/* Email */}
              <div className="auth-fade-in-delay-1">
                <label htmlFor="reg-email" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">{t.auth.email} <span className="text-red-500">*</span></label>
                <div className="auth-input-group">
                  <div className="auth-input-icon">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                  </div>
                  <input id="reg-email" type="email" inputMode="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    autoComplete="email"
                    className="input-field !min-h-[52px] rounded-xl text-base" placeholder="vous@exemple.com" required />
                </div>
              </div>

              {/* Phone and Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 auth-fade-in-delay-2">
                <div>
                  <label htmlFor="reg-phone" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">{t.auth.phone}</label>
                  <div className="auth-input-group">
                    <div className="auth-input-icon">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>
                    </div>
                    <input id="reg-phone" type="tel" inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      autoComplete="tel"
                      className="input-field !min-h-[52px] rounded-xl text-base" placeholder="+225 XX XX XX XX" />
                  </div>
                </div>
                <div>
                  <label htmlFor="reg-country" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">{t.auth.country} <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg pointer-events-none z-10">{selectedCountry?.flag}</span>
                    <select id="reg-country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="input-field !pl-10 appearance-none cursor-pointer !min-h-[52px] rounded-xl text-base">
                      {COUNTRIES.map((country) => (
                        <option key={country.code} value={country.code}>{country.flag} {country.name}</option>
                      ))}
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              {/* Password fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 auth-fade-in-delay-3">
                <div>
                  <label htmlFor="reg-password" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">{t.auth.password} <span className="text-red-500">*</span></label>
                  <input id="reg-password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    autoComplete="new-password"
                    className="input-field !min-h-[52px] rounded-xl text-base" placeholder="••••••••" required />
                </div>
                <div>
                  <label htmlFor="reg-confirmPassword" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">{t.auth.confirmPassword} <span className="text-red-500">*</span></label>
                  <input id="reg-confirmPassword" type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    autoComplete="new-password"
                    className={`input-field !min-h-[52px] rounded-xl text-base ${passwordMismatch ? 'border-red-500 !shadow-[0_0_0_3px_rgba(220,38,38,0.08)]' : ''}`}
                    placeholder="••••••••" required />
                </div>
              </div>

              {/* Password mismatch warning */}
              {passwordMismatch && (
                <div className="flex items-center gap-2 text-red-500 text-xs -mt-2">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                  Les mots de passe ne correspondent pas
                </div>
              )}

              {/* Password strength indicator */}
              {form.password.length > 0 && (
                <div className="space-y-2 -mt-2 auth-fade-in-delay-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Force du mot de passe</span>
                    <span className={`text-xs font-semibold ${passwordStrength.textColor}`}>{passwordStrength.label}</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${passwordStrength.color} ${passwordStrength.width}`}></div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {['Au moins 8 caractères', 'Une majuscule', 'Un chiffre', 'Un caractère spécial'].map((hint, i) => {
                      const met = (i === 0 && form.password.length >= 8) || (i === 1 && /[A-Z]/.test(form.password)) || (i === 2 && /[0-9]/.test(form.password)) || (i === 3 && /[^A-Za-z0-9]/.test(form.password));
                      return (
                        <span key={hint} className={`text-[10px] flex items-center gap-0.5 ${met ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
                          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>{met ? <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />}</svg>
                          {hint}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Terms checkbox */}
              <label className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-600 cursor-pointer select-none group auth-fade-in-delay-4 py-1">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 mt-0.5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 accent-orange-500 cursor-pointer transition-all flex-shrink-0"
                />
                <span className="group-hover:text-gray-900 transition-colors">J&apos;accepte les <Link href="/conditions-generales" className="text-orange-600 font-semibold hover:underline">conditions</Link> et la <Link href="/politique-de-confidentialite" className="text-orange-600 font-semibold hover:underline">politique de confidentialité</Link></span>
              </label>

              {/* Submit button */}
              <button type="submit" disabled={loading} className="btn-primary w-full text-center !py-3.5 sm:!py-4 text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed auth-fade-in-delay-4 rounded-xl shadow-lg shadow-orange-500/20 active:scale-[0.98]">
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Création en cours...
                  </span>
                ) : t.auth.registerBtn}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-5 sm:my-6 auth-fade-in-delay-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="bg-white px-3 text-gray-400 font-medium">ou s&apos;inscrire avec</span>
              </div>
            </div>

            {/* Social register buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-5 auth-fade-in-delay-4">
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); handleSocialAuth('google'); }}
                disabled={loading || socialLoading !== null}
                className="flex items-center justify-center gap-2.5 px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold transition-all duration-200 bg-white hover:border-orange-500 hover:shadow-md hover:bg-orange-50/20 active:scale-[0.98] cursor-pointer min-h-[48px] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {socialLoading === 'google' ? (
                  <span className="flex items-center gap-2 text-orange-600">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Google...
                  </span>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    <span className="text-gray-700 font-bold">Google</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); handleSocialAuth('facebook'); }}
                disabled={loading || socialLoading !== null}
                className="flex items-center justify-center gap-2.5 px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold transition-all duration-200 bg-white hover:border-blue-500 hover:shadow-md hover:bg-blue-50/20 active:scale-[0.98] cursor-pointer min-h-[48px] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {socialLoading === 'facebook' ? (
                  <span className="flex items-center gap-2 text-blue-600">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Facebook...
                  </span>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    <span className="text-gray-700 font-bold">Facebook</span>
                  </>
                )}
              </button>
            </div>



            {/* Login link */}

            <p className="text-center text-sm text-gray-500 mt-6 auth-fade-in-delay-4">
              {t.auth.hasAccount}{' '}
              <Link href="/auth/login" className="text-orange-600 font-semibold hover:text-orange-700 hover:underline transition-all duration-200">
                {t.nav.login}
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
