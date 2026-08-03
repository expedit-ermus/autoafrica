'use client';
import { useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardTopBar from '@/components/DashboardTopBar';
import { FAQStructuredData } from '@/components/StructuredData';
import { useToast } from '@/contexts/ToastContext';

const faq = [
  { q: 'Comment ajouter une pièce à mon inventaire ?', a: 'Allez dans l\'onglet Inventaire, cliquez sur "+ Ajouter", remplissez les informations (titre, marque, catégorie, prix, stock) et enregistrez. Votre pièce apparaîtra immédiatement sur le marketplace.', category: 'Inventaire' },
  { q: 'Comment fonctionne le paiement Mobile Money ?', a: 'Lorsqu\'un client passe commande, il choisit Orange Money, MTN MoMo, Wave ou Moov Money. Le paiement est sécurisé en séquestre et libéré après confirmation de livraison.', category: 'Paiement' },
  { q: 'Comment gérer mes commandes ?', a: 'Dans l\'onglet Commandes, vous pouvez confirmer, marquer comme payée, expédier ou livrer chaque commande. Un suivi visuel montre l\'avancement de chaque commande.', category: 'Commandes' },
  { q: 'Quels pays sont supportés ?', a: 'AutoAfrique couvre 10 pays : Côte d\'Ivoire, Sénégal, Mali, Burkina Faso, Niger, Bénin, Togo, Guinée, Nigeria et Ghana. Les paiements Mobile Money sont disponibles selon les opérateurs locaux.', category: 'Général' },
  { q: 'Comment contacter un vendeur ?', a: 'Sur chaque fiche produit, vous trouverez les boutons WhatsApp et Appel pour contacter directement le vendeur. Vous pouvez aussi utiliser le chat intégré.', category: 'Marketplace' },
  { q: 'Comment fonctionne le séquestre (escrow) ?', a: 'Le paiement est sécurisé par un système de séquestre. Les fonds du client sont gelés jusqu\'à ce que la livraison soit confirmée. En cas de problème, un litige peut être ouvert.', category: 'Paiement' },
  { q: 'Puis-je annuler une commande ?', a: 'Oui, tant que la commande n\'est pas expédiée. Les commandes en attente peuvent être annulées directement. Pour les commandes expédiées, contactez le support.', category: 'Commandes' },
  { q: 'Comment mettre à jour mon stock en masse ?', a: 'Dans l\'onglet Inventaire, cochez les produits concernés, puis cliquez sur "Ajuster stock" dans la barre d\'actions. Définissez la nouvelle quantité et appliquez.', category: 'Inventaire' },
];

const guides = [
  { title: 'Premiers pas', icon: '🚀', desc: 'Configurez votre compte', items: ['Créer votre compte vendeur', 'Compléter votre profil boutique', 'Ajouter vos premières pièces'], color: '#E85D04' },
  { title: 'Vendre', icon: '💰', desc: 'Générez des revenus', items: ['Recevoir des commandes', 'Confirmer et expédier', 'Gérer les paiements'], color: '#059669' },
  { title: 'Acheter', icon: '🛒', desc: 'Trouvez vos pièces', items: ['Rechercher des pièces', 'Passer une commande', 'Suivre la livraison'], color: '#2563EB' },
  { title: 'Gérer', icon: '📊', desc: 'Optimisez votre activité', items: ['Inventaire et stock', 'CRM et clients', 'Finance et factures'], color: '#7C3AED' },
];

const categoryIcons: Record<string, string> = {
  Inventaire: '📦',
  Paiement: '💳',
  Commandes: '🛒',
  Général: '🌍',
  Marketplace: '🏪',
};

const categoryColors: Record<string, string> = {
  Inventaire: '#E85D04',
  Paiement: '#059669',
  Commandes: '#2563EB',
  Général: '#7C3AED',
  Marketplace: '#D97706',
};

export default function HelpPage() {
  const { addToast } = useToast();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [faqFilter, setFaqFilter] = useState('all');
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = ['all', ...new Set(faq.map(f => f.category))];

  const filteredFaq = useMemo(() => {
    let result = faqFilter === 'all' ? faq : faq.filter(f => f.category === faqFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
    }
    return result;
  }, [faqFilter, searchQuery]);

  const handleContact = async () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      addToast('error', 'Remplissez les champs obligatoires');
      return;
    }
    setSending(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      addToast('success', 'Message envoyé ! Nous vous répondrons sous 24h.');
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch { addToast('error', 'Erreur'); } finally { setSending(false); }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <DashboardTopBar />
        <main className="p-4 lg:p-8 pb-24 lg:pb-8 max-w-7xl mx-auto">

          <FAQStructuredData items={faq.map(f => ({ question: f.q, answer: f.a }))} />

          {/* ═══════════════════════════════════════════════
              HEADER
              ═══════════════════════════════════════════════ */}
          <div className="relative mb-8 overflow-hidden rounded-2xl gradient-primary p-8 md:p-10 text-white">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white rounded-full -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-white rounded-full translate-y-1/2 -translate-x-1/4" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  Aide & Support
                </h1>
              </div>
              <p className="text-orange-100 text-sm md:text-base max-w-xl">
                Trouvez rapidement les réponses à vos questions ou contactez notre équipe d&apos;assistance dédiée.
              </p>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════
              SEARCH BAR
              ═══════════════════════════════════════════════ */}
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Rechercher dans l'aide... (ex: paiement, commande, inventaire)"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-13 pr-5 py-4 text-sm bg-white rounded-2xl border border-gray-200 shadow-sm focus:border-orange-400 focus:ring-4 focus:ring-orange-50 transition-all duration-200 outline-none placeholder:text-gray-400"
              style={{ paddingLeft: '3.25rem' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-gray-600 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* ═══════════════════════════════════════════════
              QUICK LINKS (Guides)
              ═══════════════════════════════════════════════ */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-sm">⚡</span>
              Guides rapides
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {guides.map(g => (
                <div
                  key={g.title}
                  className="group bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-orange-100 transition-all duration-300 cursor-pointer card-shadow-hover"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${g.color}10` }}
                  >
                    {g.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{g.title}</h3>
                  <p className="text-xs text-gray-500 mb-3">{g.desc}</p>
                  <ul className="space-y-1.5">
                    {g.items.map(item => (
                      <li key={item} className="text-xs text-gray-600 flex items-center gap-2">
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: g.color }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════
              MAIN CONTENT: FAQ + CONTACT
              ═══════════════════════════════════════════════ */}
          <div className="grid lg:grid-cols-5 gap-8">

            {/* ─── FAQ ─── */}
            <div className="lg:col-span-3 min-w-0">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-sm">❓</span>
                Questions fréquentes
              </h2>

              {/* Category Filters */}
              <div className="flex gap-2 mb-5 overflow-x-auto pb-2 hide-scrollbar">
                {faqCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setFaqFilter(cat); setOpenFaq(null); }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                      faqFilter === cat
                        ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-200'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-orange-200 hover:text-orange-600'
                    }`}
                  >
                    {cat === 'all' ? '🏷️ Toutes' : `${categoryIcons[cat] || '📋'} ${cat}`}
                  </button>
                ))}
              </div>

              {/* FAQ Items */}
              <div className="space-y-3">
                {filteredFaq.length === 0 && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                    <div className="text-4xl mb-3">🔍</div>
                    <p className="text-sm font-medium text-gray-500">Aucun résultat trouvé</p>
                    <p className="text-xs text-gray-400 mt-1">Essayez un autre terme ou catégorie</p>
                  </div>
                )}
                {filteredFaq.map((f, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <div
                      key={i}
                      className={`bg-white rounded-2xl border overflow-hidden transition-all duration-300 ${
                        isOpen ? 'border-orange-200 shadow-md shadow-orange-50' : 'border-gray-100 card-shadow hover:border-gray-200'
                      }`}
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        className="w-full flex items-center gap-3 p-4 md:p-5 text-left hover:bg-gray-50/50 transition-colors duration-200"
                      >
                        <span
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 transition-colors duration-200"
                          style={{
                            backgroundColor: isOpen ? `${categoryColors[f.category]}15` : '#f8fafc',
                          }}
                        >
                          {categoryIcons[f.category] || '📋'}
                        </span>
                        <span className="font-semibold text-gray-900 text-sm flex-1 pr-2 leading-snug">{f.q}</span>
                        <svg
                          className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-orange-500' : 'text-gray-400'}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <div
                        className={`transition-all duration-300 ease-in-out ${
                          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4 ml-12">
                          {f.a}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ─── CONTACT SIDEBAR ─── */}
            <div className="lg:col-span-2 min-w-0 space-y-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-sm">📬</span>
                Contactez-nous
              </h2>

              {/* Contact Form */}
              <div className="bg-white rounded-2xl border border-gray-100 card-shadow p-6">
                <p className="text-xs text-gray-500 mb-4">Remplissez le formulaire et nous vous répondrons sous 24h.</p>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="help-name" className="block text-xs font-semibold text-gray-700 mb-1.5">Nom complet *</label>
                    <input
                      id="help-name"
                      className="input-field"
                      placeholder="Votre nom"
                      value={contactForm.name}
                      onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="help-email" className="block text-xs font-semibold text-gray-700 mb-1.5">Email *</label>
                    <input
                      id="help-email"
                      className="input-field"
                      type="email"
                      placeholder="votre@email.com"
                      value={contactForm.email}
                      onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="help-subject" className="block text-xs font-semibold text-gray-700 mb-1.5">Sujet</label>
                    <input
                      id="help-subject"
                      className="input-field"
                      placeholder="De quoi s'agit-il ?"
                      value={contactForm.subject}
                      onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="help-message" className="block text-xs font-semibold text-gray-700 mb-1.5">Message *</label>
                    <textarea
                      id="help-message"
                      className="input-field resize-none"
                      rows={4}
                      placeholder="Décrivez votre problème ou question..."
                      value={contactForm.message}
                      onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                    />
                  </div>
                  <button
                    onClick={handleContact}
                    disabled={sending}
                    className="btn-primary w-full text-center !py-3 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {sending ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Envoi...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Envoyer le message
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Alternative Contact Methods */}
              <div className="bg-white rounded-2xl border border-gray-100 card-shadow p-6">
                <h3 className="font-bold text-gray-900 text-sm mb-4">Autres moyens de contact</h3>
                <div className="space-y-3">
                  <a
                    href="https://wa.me/22507080910"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-green-50 hover:bg-green-100 border border-green-100 hover:border-green-200 transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center text-white text-lg shadow-sm group-hover:scale-105 transition-transform">
                      💬
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-green-700">WhatsApp</p>
                      <p className="text-xs text-green-600">Réponse rapide en direct</p>
                    </div>
                    <svg className="w-4 h-4 text-green-400 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>

                  <a
                    href="mailto:support@autoafrique.com"
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-100 hover:border-blue-200 transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white text-lg shadow-sm group-hover:scale-105 transition-transform">
                      ✉️
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-blue-700">Email</p>
                      <p className="text-xs text-blue-600">support@autoafrique.com</p>
                    </div>
                    <svg className="w-4 h-4 text-blue-400 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>

                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-purple-50 border border-purple-100">
                    <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center text-white text-lg shadow-sm">
                      📞
                    </div>
                    <div>
                      <p className="text-sm font-bold text-purple-700">Téléphone</p>
                      <p className="text-xs text-purple-600">+225 07 08 09 10</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Response Time Card */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-100 p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-orange-800">Temps de réponse</h4>
                    <p className="text-xs text-orange-700 mt-0.5 leading-relaxed">
                      Notre équipe répond en moyenne sous <strong>24 heures</strong>. Pour les urgences, privilégiez WhatsApp.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
