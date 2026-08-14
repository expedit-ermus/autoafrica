'use client';
import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
}

const STORAGE_KEY = 'autoafrique_cookie_consent_v1';

export default function CookieConsentBanner() {
  const { locale } = useApp();
  const L = (fr: string, en: string) => (locale === 'en' ? en : fr);
  const [show, setShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: true,
    marketing: true,
    decidedAt: '',
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        // First visit -> display consent banner
        setShow(true);
      }
    } catch {
      // Storage blocked or unavailable
    }
  }, []);

  const handleAcceptAll = () => {
    const prefs: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      decidedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (e) {
      console.error(e);
    }
    setShow(false);
  };

  const handleSavePreferences = () => {
    const prefs: CookiePreferences = {
      ...preferences,
      essential: true,
      decidedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (e) {
      console.error(e);
    }
    setShow(false);
  };

  const handleRefuseNonEssential = () => {
    const prefs: CookiePreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      decidedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (e) {
      console.error(e);
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <aside aria-label="Gestion des cookies et confidentialité" className="fixed bottom-0 left-0 right-0 z-50 p-4 lg:p-6 transition-all duration-300">
      <div className="max-w-4xl mx-auto bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl text-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

          {/* Left Text */}
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-xl">🍪</span>
              <h3 className="font-bold text-white text-base">
                {L('Gestion des cookies & Double Consentement', 'Cookie Preferences & Consent')}
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {L(
                'AutoAfrique utilise des cookies nécessaires au fonctionnement de la plateforme ERP et du marketplace. Avec votre consentement, nous utilisons également des cookies de mesure d\'audience et de personnalisation.',
                'AutoAfrique uses necessary cookies for our ERP platform and marketplace functions. With your consent, we also use audience measurement and personalization cookies.'
              )}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-3.5 py-2 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors cursor-pointer"
            >
              {showDetails ? L('Masquer détails', 'Hide details') : L('Personnaliser', 'Customize')}
            </button>
            <button
              onClick={handleRefuseNonEssential}
              className="px-3.5 py-2 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors cursor-pointer"
            >
              {L('Refuser optionnels', 'Reject optional')}
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 hover:brightness-110 transition-all cursor-pointer"
            >
              {L('Tout accepter ✓', 'Accept all ✓')}
            </button>
          </div>
        </div>

        {/* Granular Preference Details */}
        {showDetails && (
          <div className="mt-5 pt-5 border-t border-white/10 grid sm:grid-cols-3 gap-4">
            {/* Essential */}
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-white">{L('1. Essentiels', '1. Essential')}</span>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">{L('Obligatoire', 'Required')}</span>
              </div>
              <p className="text-[11px] text-slate-400">{L('Nécessaires pour l\'authentification, le panier et la sécurité.', 'Required for authentication, cart and security.')}</p>
            </div>

            {/* Analytics */}
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-white">{L('2. Mesure d\'audience', '2. Audience analytics')}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
              <p className="text-[11px] text-slate-400">{L('Statistiques anonymes d\'utilisation pour améliorer le service.', 'Anonymous usage stats to improve user experience.')}</p>
            </div>

            {/* Marketing */}
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-white">{L('3. Marketing & Meta Ads', '3. Marketing & Ads')}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
              <p className="text-[11px] text-slate-400">{L('Recommandations personnalisées de pièces & campagnes ciblées.', 'Personalized parts recommendations and targeted offers.')}</p>
            </div>

            <div className="sm:col-span-3 flex justify-end mt-2">
              <button
                onClick={handleSavePreferences}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                {L('Enregistrer mes choix', 'Save my choices')}
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
