'use client';
import { useState } from 'react';

const SUPPORT_EMAIL = 'support@autoafrique-saas.vercel.app';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'Question générale', message: '' });
  const [prepared, setPrepared] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`[AutoAfrique] ${form.subject}`);
    const body = encodeURIComponent(`Nom : ${form.name}\nEmail : ${form.email}\n\n${form.message}`);
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
    setPrepared(true);
  };

  const inputCls = "w-full px-4 py-3 rounded-xl border border-[var(--color-warm-border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all";
  const labelCls = "block text-sm font-semibold text-gray-700 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-name" className={labelCls}>Nom complet</label>
          <input id="contact-name" type="text" required value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputCls} placeholder="Amadou Diallo" />
        </div>
        <div>
          <label htmlFor="contact-email" className={labelCls}>Adresse email</label>
          <input id="contact-email" type="email" required value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputCls} placeholder="vous@exemple.com" />
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className={labelCls}>Sujet</label>
        <select id="contact-subject" value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className={inputCls}>
          <option>Question générale</option>
          <option>Question sur une commande</option>
          <option>Question sur un paiement</option>
          <option>Question sur une livraison</option>
          <option>Question sur un retour</option>
          <option>Devenir vendeur</option>
          <option>Signalement d&apos;un problème</option>
          <option>Autre</option>
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className={labelCls}>Votre message</label>
        <textarea id="contact-message" required rows={5} value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={inputCls} placeholder="Décrivez votre demande..." />
      </div>

      <button type="submit"
        className="w-full px-6 py-3.5 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-warm)] hover:from-[var(--color-orange-hover)] hover:to-[var(--color-primary-dark)] text-white font-bold transition-all shadow-lg shadow-[var(--color-primary)]/30">
        Envoyer le message
      </button>

      {prepared && (
        <p className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-xl p-3">
          Votre messagerie a été ouverte pour préparer l&apos;envoi. L&apos;adresse d&apos;envoi provisoire est{' '}
          <span className="font-mono text-gray-800">{SUPPORT_EMAIL}</span> — elle sera confirmée avant la mise en production.
        </p>
      )}
    </form>
  );
}
