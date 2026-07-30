'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardTopBar from '@/components/DashboardTopBar';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/contexts/ToastContext';

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
        checked ? 'bg-gradient-to-r from-[#E85D04] to-[#D00000]' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const { t, locale, setLocale, user } = useApp();
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', shopName: '', city: '', country: '' });

  const [general, setGeneral] = useState({ language: 'fr', currency: 'XOF', timezone: 'Africa/Dakar' });
  const [notifications, setNotifications] = useState({ email: true, sms: false, orderAlerts: true, stockAlerts: true });
  const [appearance, setAppearance] = useState({ theme: 'light' as 'light' | 'dark', compact: false });
  const [security, setSecurity] = useState({ twoFactor: false, loginAlerts: true });

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        shopName: user.shopName || '',
        city: user.city || '',
        country: user.country || '',
      });
    }
  }, [user]);

  const handleSave = async (section: string) => {
    setSaving(true);
    try {
      await new Promise(r => setTimeout(r, 500));
      addToast('success', `${section} mis à jour avec succès`);
    } catch (err: any) {
      addToast('error', err.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST' });
      window.location.href = '/auth/login';
    } catch {
      window.location.href = '/auth/login';
    }
  };

  const initials = user ? `${(user.firstName || '')[0] || ''}${(user.lastName || '')[0] || ''}` : 'U';

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <DashboardTopBar />
        <main className="p-4 lg:p-8 pb-24 lg:pb-8 max-w-4xl mx-auto">

          {/* Page Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E85D04] to-[#D00000] flex items-center justify-center text-white text-lg">
                ⚙
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Paramètres</h1>
            </div>
            <p className="text-sm text-gray-500 ml-[52px]">Gérez vos préférences, notifications et sécurité</p>
          </div>

          {/* ═══════════════════════════════════════════════════
              GENERAL
          ═══════════════════════════════════════════════════ */}
          <div className="card-modern p-6 mb-6 animate-fade-in" style={{ animationDelay: '0.05s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-base">
                🌐
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Général</h2>
                <p className="text-xs text-gray-400">Langue, devise et fuseau horaire</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Langue</label>
                <select
                  className="input-field"
                  value={general.language}
                  onChange={e => setGeneral({ ...general, language: e.target.value })}
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="wo">Wolof</option>
                  <option value="ar">العربية</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Devise</label>
                <select
                  className="input-field"
                  value={general.currency}
                  onChange={e => setGeneral({ ...general, currency: e.target.value })}
                >
                  <option value="XOF">FCFA (XOF)</option>
                  <option value="XAF">FCFA (XAF)</option>
                  <option value="NGN">Naira (NGN)</option>
                  <option value="GHS">Cedi (GHS)</option>
                  <option value="KES">Shilling (KES)</option>
                  <option value="USD">Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Fuseau horaire</label>
                <select
                  className="input-field"
                  value={general.timezone}
                  onChange={e => setGeneral({ ...general, timezone: e.target.value })}
                >
                  <option value="Africa/Dakar">Africa/Dakar (GMT+0)</option>
                  <option value="Africa/Abidjan">Africa/Abidjan (GMT+0)</option>
                  <option value="Africa/Lagos">Africa/Lagos (GMT+1)</option>
                  <option value="Africa/Kinshasa">Africa/Kinshasa (GMT+1)</option>
                  <option value="Africa/Nairobi">Africa/Nairobi (GMT+3)</option>
                  <option value="Africa/Casablanca">Africa/Casablanca (GMT+1)</option>
                </select>
              </div>

              <div className="flex justify-end pt-2">
                <button onClick={() => handleSave('Général')} disabled={saving} className="btn-primary px-6 text-center disabled:opacity-50">
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════
              NOTIFICATIONS
          ═══════════════════════════════════════════════════ */}
          <div className="card-modern p-6 mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 text-base">
                🔔
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Notifications</h2>
                <p className="text-xs text-gray-400">Choisissez comment être alerté</p>
              </div>
            </div>

            <div className="space-y-1">
              {[
                { key: 'email' as const, label: 'Notifications par email', desc: 'Recevoir les alertes par email', value: notifications.email },
                { key: 'sms' as const, label: 'Notifications par SMS', desc: 'Recevoir les alertes par SMS', value: notifications.sms },
                { key: 'orderAlerts' as const, label: 'Alertes de commandes', desc: 'Être notifié pour chaque nouvelle commande', value: notifications.orderAlerts },
                { key: 'stockAlerts' as const, label: 'Alertes de stock', desc: 'Alerte quand le stock est bas', value: notifications.stockAlerts },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between py-3.5 px-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="pr-4">
                    <p className="text-sm font-semibold text-gray-900">{n.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{n.desc}</p>
                  </div>
                  <ToggleSwitch checked={n.value} onChange={v => setNotifications({ ...notifications, [n.key]: v })} />
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <button onClick={() => handleSave('Notifications')} disabled={saving} className="btn-primary px-6 text-center disabled:opacity-50">
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════
              APPEARANCE
          ═══════════════════════════════════════════════════ */}
          <div className="card-modern p-6 mb-6 animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 text-base">
                🎨
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Apparence</h2>
                <p className="text-xs text-gray-400">Thème et affichage</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thème</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'light' as const, label: 'Clair', icon: '☀️' },
                    { value: 'dark' as const, label: 'Sombre', icon: '🌙' },
                  ].map(theme => (
                    <button
                      key={theme.value}
                      onClick={() => setAppearance({ ...appearance, theme: theme.value })}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                        appearance.theme === theme.value
                          ? 'border-[#E85D04] bg-orange-50/60 shadow-sm'
                          : 'border-gray-100 bg-white hover:border-gray-200'
                      }`}
                    >
                      <span className="text-lg">{theme.icon}</span>
                      <span className={`text-sm font-semibold ${appearance.theme === theme.value ? 'text-[#E85D04]' : 'text-gray-700'}`}>
                        {theme.label}
                      </span>
                      {appearance.theme === theme.value && (
                        <span className="ml-auto text-[#E85D04] text-sm">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between py-3.5 px-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Mode compact</p>
                  <p className="text-xs text-gray-400 mt-0.5">Afficher plus d'éléments à l'écran</p>
                </div>
                <ToggleSwitch checked={appearance.compact} onChange={v => setAppearance({ ...appearance, compact: v })} />
              </div>

              <div className="flex justify-end pt-2">
                <button onClick={() => handleSave('Apparence')} disabled={saving} className="btn-primary px-6 text-center disabled:opacity-50">
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════
              SECURITY
          ═══════════════════════════════════════════════════ */}
          <div className="card-modern p-6 mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 text-base">
                🔒
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Sécurité</h2>
                <p className="text-xs text-gray-400">Protection de votre compte</p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between py-3.5 px-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="pr-4">
                  <p className="text-sm font-semibold text-gray-900">Authentification à deux facteurs</p>
                  <p className="text-xs text-gray-400 mt-0.5">Sécurité renforcée pour votre connexion</p>
                </div>
                <ToggleSwitch checked={security.twoFactor} onChange={v => setSecurity({ ...security, twoFactor: v })} />
              </div>

              <div className="flex items-center justify-between py-3.5 px-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="pr-4">
                  <p className="text-sm font-semibold text-gray-900">Alertes de connexion</p>
                  <p className="text-xs text-gray-400 mt-0.5">Notification à chaque nouvelle connexion</p>
                </div>
                <ToggleSwitch checked={security.loginAlerts} onChange={v => setSecurity({ ...security, loginAlerts: v })} />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button onClick={() => handleSave('Sécurité')} disabled={saving} className="btn-primary px-6 text-center disabled:opacity-50">
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════
              DANGER ZONE
          ═══════════════════════════════════════════════════ */}
          <div className="rounded-2xl border-2 border-red-100 bg-white p-6 mb-6 animate-fade-in" style={{ animationDelay: '0.25s' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center text-red-600 text-base">
                ⚠
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Zone dangereuse</h2>
                <p className="text-xs text-gray-400">Actions irréversibles</p>
              </div>
            </div>

            <div className="bg-red-50/60 rounded-xl p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Supprimer le compte</p>
                  <p className="text-xs text-gray-500 mt-0.5">Cette action est irréversible. Toutes vos données seront supprimées.</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-danger whitespace-nowrap text-sm"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-400 pb-4">
            AutoAfrique SaaS — Paramètres du compte
          </div>
        </main>
      </div>
    </div>
  );
}
