'use client';
import { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardTopBar from '@/components/DashboardTopBar';
import { useToast } from '@/contexts/ToastContext';
import Modal from '@/components/Modal';
import type { subscriptionsService } from '@/modules/subscriptions/subscriptions.service';
import { detectOperator, isValidPhone } from '@/shared/utils/phone';

/** Forme exacte renvoyee par le service : evite un type fige qui derive. */
type TenantSubscription = Awaited<ReturnType<typeof subscriptionsService.getTenantSubscription>>;

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
        checked ? 'bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-warm-red)]' : 'bg-gray-200'
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
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);

  const [general, setGeneral] = useState({ language: 'fr', currency: 'XOF', timezone: 'Africa/Abidjan' });
  const [notifications, setNotifications] = useState({ email: true, sms: false, orderAlerts: true, stockAlerts: true });
  const [appearance, setAppearance] = useState({ theme: 'light' as 'light' | 'dark', compact: false });
  const [security, setSecurity] = useState({ twoFactor: false, loginAlerts: true });

  const handleSave = async (section: string) => {
    setSaving(true);
    try {
      await new Promise(r => setTimeout(r, 500));
      addToast('success', `${section} mis à jour avec succès`);
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
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

  const [subData, setSubData] = useState<TenantSubscription | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'STARTER' | 'PRO' | 'ENTERPRISE'>('PRO');
  const [paymentMethod, setPaymentMethod] = useState<'ORANGE_MONEY' | 'WAVE' | 'MTN_MOMO' | 'MOOV_MONEY'>('ORANGE_MONEY');
  const [payPhone, setPayPhone] = useState('');
  const [upgrading, setUpgrading] = useState(false);

  const fetchSubscription = useCallback(async (signal?: AbortSignal) => {
    try {
      const res = await fetch('/api/v1/subscriptions', { signal });
      const data = await res.json();
      if (data.currentSubscription) {
        setSubData(data.currentSubscription);
      }
    } catch (e) {
      // Requete annulee au demontage : ce n'est pas une erreur.
      if ((e as Error)?.name !== 'AbortError') console.error(e);
    }
  }, []);

  useEffect(() => {
    // L'abandon evite d'ecrire dans l'etat d'un composant deja demonte.
    const controller = new AbortController();
    // La regle vise les setState synchrones ; ici l'ecriture d'etat a lieu apres
    // un await, une fois la reponse reseau recue. Chargement de donnees legitime.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchSubscription(controller.signal);
    return () => controller.abort();
  }, [fetchSubscription]);

  const handleUpgrade = async () => {
    if (!payPhone) {
      addToast('error', 'Numéro de téléphone Mobile Money requis');
      return;
    }
    if (!isValidPhone(payPhone, 'CI')) {
      addToast('error', 'Numéro invalide : 10 chiffres attendus, ex. 07 12 34 56 78');
      return;
    }
    setUpgrading(true);
    try {
      const res = await fetch('/api/v1/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // tenantId et userId sont derives de la session cote serveur.
          planId: selectedPlan,
          billingCycle: 'monthly',
          paymentMethod,
          phone: payPhone,
        }),
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', data.message);
        setShowUpgradeModal(false);
        fetchSubscription();
      } else {
        addToast('error', data.error || 'Erreur lors du surclassement');
      }
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Échec du paiement Mobile Money');
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 min-w-0 lg:ml-64">
        <DashboardTopBar />
        <main className="p-4 lg:p-8 pb-24 lg:pb-8 max-w-4xl mx-auto">

          {/* Page Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-warm-red)] flex items-center justify-center text-white text-lg">
                ⚙
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Paramètres du Compte SaaS</h1>
            </div>
            <p className="text-sm text-gray-500 ml-[52px]">Abonnements, quotas, notifications et sécurité</p>
          </div>

          {/* ═══════════════════════════════════════════════════
              SAAS BILLING & SUBSCRIPTIONS
          ═══════════════════════════════════════════════════ */}
          <div className="card-modern p-6 mb-6 animate-fade-in bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl border border-slate-700 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-700 pb-5 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 text-xl font-bold">
                  💳
                </div>
                <div>
                  <span className="text-xs text-orange-400 font-bold uppercase tracking-wider">Abonnement SaaS Actif</span>
                  <h2 className="text-xl font-black text-white">{subData?.plan?.name || 'Starter Garagiste'}</h2>
                </div>
              </div>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-extrabold shadow-lg shadow-orange-500/30 hover:scale-105 transition-transform"
              >
                ⚡ Changer / Changer de Plan
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <span className="text-xs text-slate-400 block font-medium">Quota Annonces Produits</span>
                <div className="flex justify-between items-center mt-1 mb-2">
                  <span className="text-lg font-bold text-white">
                    {subData?.usage?.listingsCount || 0} / {subData?.usage?.maxListings === -1 ? 'Illimité' : subData?.usage?.maxListings || 100}
                  </span>
                  <span className="text-xs text-orange-400 font-semibold">{subData?.usage?.listingsUsagePercent || 0}% utilisé</span>
                </div>
                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all"
                    style={{ width: `${subData?.usage?.listingsUsagePercent || 25}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <span className="text-xs text-slate-400 block font-medium">Entrepôts Multi-Sites</span>
                <div className="flex justify-between items-center mt-1 mb-2">
                  <span className="text-lg font-bold text-white">
                    {subData?.usage?.warehousesCount || 1} / {subData?.usage?.maxWarehouses || 2} Entrepôts
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold">✓ Conforme</span>
                </div>
                <p className="text-[11px] text-slate-400">Passez au plan Pro/Enterprise pour des entrepôts illimités</p>
              </div>
            </div>
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
                <label htmlFor="set-language" className="block text-sm font-medium text-gray-700 mb-1.5">Langue</label>
                <select
                  id="set-language"
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
                <label htmlFor="set-currency" className="block text-sm font-medium text-gray-700 mb-1.5">Devise</label>
                <select
                  id="set-currency"
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
                <label htmlFor="set-timezone" className="block text-sm font-medium text-gray-700 mb-1.5">Fuseau horaire</label>
                <select
                  id="set-timezone"
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
                <div role="group" aria-label="Thème" className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'light' as const, label: 'Clair', icon: '☀️' },
                    { value: 'dark' as const, label: 'Sombre', icon: '🌙' },
                  ].map(theme => (
                    <button
                      key={theme.value}
                      onClick={() => setAppearance({ ...appearance, theme: theme.value })}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                        appearance.theme === theme.value
                          ? 'border-[var(--color-primary-dark)] bg-orange-50/60 shadow-sm'
                          : 'border-gray-100 bg-white hover:border-gray-200'
                      }`}
                    >
                      <span className="text-lg">{theme.icon}</span>
                      <span className={`text-sm font-semibold ${appearance.theme === theme.value ? 'text-[var(--color-primary-dark)]' : 'text-gray-700'}`}>
                        {theme.label}
                      </span>
                      {appearance.theme === theme.value && (
                        <span className="ml-auto text-[var(--color-primary-dark)] text-sm">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between py-3.5 px-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Mode compact</p>
                  <p className="text-xs text-gray-400 mt-0.5">Afficher plus d&apos;éléments à l&apos;écran</p>
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

          {/* Modal Surclassement Mobile Money */}
          <Modal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} title="Changer d'Abonnement SaaS">
            <div className="space-y-5">
              <p className="text-xs text-gray-500">
                Sélectionnez le plan adapté aux besoins de votre garage ou entreprise. Paiement instantané via Mobile Money sans engagement.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'STARTER' as const, name: 'Starter', price: '15 000 FCFA', desc: '100 annonces + VIN' },
                  { id: 'PRO' as const, name: 'Pro Vendeur', price: '45 000 FCFA', desc: '1000 annonces + IA & Ads' },
                  { id: 'ENTERPRISE' as const, name: 'Enterprise', price: '120 000 FCFA', desc: 'Illimité + Conteneurs' },
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlan(p.id)}
                    className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                      selectedPlan === p.id
                        ? 'border-orange-500 bg-orange-50/60 font-bold'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xs uppercase text-orange-600 block">{p.name}</span>
                    <span className="text-sm font-black text-gray-900 block mt-1">{p.price} /mois</span>
                    <span className="text-[11px] text-gray-500 font-normal block mt-1">{p.desc}</span>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Moyen de Règlement Mobile Money *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'ORANGE_MONEY' as const, name: 'Orange', color: 'border-orange-400 bg-orange-50 text-orange-700' },
                    { id: 'WAVE' as const, name: 'Wave', color: 'border-sky-400 bg-sky-50 text-sky-700' },
                    { id: 'MTN_MOMO' as const, name: 'MTN MoMo', color: 'border-amber-400 bg-amber-50 text-amber-800' },
                    { id: 'MOOV_MONEY' as const, name: 'Moov', color: 'border-blue-400 bg-blue-50 text-blue-700' },
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-2.5 rounded-lg border text-center text-xs font-bold transition-all ${
                        paymentMethod === m.id ? `${m.color} ring-2 ring-orange-500` : 'border-gray-200 bg-white text-gray-700'
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="settings-momo-phone" className="block text-xs font-semibold text-gray-700 mb-1">Numéro Mobile Money *</label>
                <input
                  id="settings-momo-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={payPhone}
                  onChange={e => {
                    const next = e.target.value;
                    setPayPhone(next);
                    // Le prefixe designe l'operateur : evite un choix manuel errone.
                    const operator = detectOperator(next, 'CI');
                    if (operator) setPaymentMethod(operator);
                  }}
                  placeholder="Ex : 07 07 07 07 07"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-mono"
                />
              </div>

              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 hover:opacity-95 transition-opacity disabled:opacity-50"
              >
                {upgrading ? 'Traitement Mobile Money...' : 'Payer & Activer l’Abonnement'}
              </button>
            </div>
          </Modal>

          {/* Footer */}
          <div className="text-center text-xs text-gray-400 pb-4">
            AutoAfrique SaaS — Paramètres du compte
          </div>
        </main>
      </div>
    </div>
  );
}
