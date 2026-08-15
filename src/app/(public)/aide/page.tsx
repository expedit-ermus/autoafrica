'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';

// Reusable SVG Icons
const SearchIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ChevronDownIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const MessageIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

export default function AidePage() {
  const { locale } = useApp();
  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tout');
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const categories = [
    { id: 'Tout', label: L('Tout', 'All') },
    { id: 'Commandes & Panier', label: L('Commandes & Panier', 'Orders & Cart') },
    { id: 'Paiement Mobile Money', label: L('Paiement Mobile Money', 'Mobile Money Payment') },
    { id: 'Livraison 24-72h', label: L('Livraison 24-72h', '24-72h Delivery') },
    { id: 'Retours & Garantie', label: L('Retours & Garantie', 'Returns & Warranty') },
    { id: 'Espace Vendeur / Garage', label: L('Espace Vendeur / Garage', 'Seller / Garage Area') },
  ];

  const faqs = [
    {
      id: 'faq-1',
      category: 'Commandes & Panier',
      question: L('Comment trouver la référence exacte de ma pièce ?', 'How do I find the exact part number?'),
      answer: L(
        'Pour trouver la pièce parfaitement compatible, nous vous recommandons d\'utiliser le numéro de châssis (VIN) de votre véhicule dans notre barre de recherche. Vous pouvez également contacter nos experts via WhatsApp pour une assistance personnalisée.',
        'To find the perfectly compatible part, we recommend using your vehicle\'s chassis number (VIN) in our search bar. You can also contact our experts via WhatsApp for personalized assistance.'
      )
    },
    {
      id: 'faq-2',
      category: 'Commandes & Panier',
      question: L('Comment suivre ma commande de pièces ?', 'How do I track my parts order?'),
      answer: L(
        'Une fois votre commande validée, vous recevrez un SMS et un e-mail avec un lien de suivi. Vous pouvez également suivre l\'état de votre livraison directement depuis votre compte AutoAfrique, rubrique "Mes commandes".',
        'Once your order is confirmed, you will receive an SMS and email with a tracking link. You can also track your delivery status directly from your AutoAfrique account, under "My Orders".'
      )
    },
    {
      id: 'faq-3',
      category: 'Commandes & Panier',
      question: L('Comment annuler ou modifier ma commande ?', 'How to cancel or modify my order?'),
      answer: L(
        'Vous pouvez annuler ou modifier votre commande tant qu\'elle n\'a pas encore été expédiée. Rendez-vous dans "Mes commandes" ou contactez immédiatement notre service client.',
        'You can cancel or modify your order as long as it hasn\'t been shipped yet. Go to "My Orders" or contact our customer service immediately.'
      )
    },
    {
      id: 'faq-4',
      category: 'Paiement Mobile Money',
      question: L('Quels sont les modes de paiement acceptés ?', 'What payment methods are accepted?'),
      answer: L(
        'Nous acceptons les paiements par Mobile Money (Wave, Orange Money, MTN MoMo, Djamo) très populaires en Afrique de l\'Ouest, ainsi que les cartes bancaires (Visa, Mastercard) et le paiement à la livraison sous certaines conditions.',
        'We accept Mobile Money payments (Wave, Orange Money, MTN MoMo, Djamo) which are very popular in West Africa, as well as bank cards (Visa, Mastercard) and cash on delivery under certain conditions.'
      )
    },
    {
      id: 'faq-5',
      category: 'Paiement Mobile Money',
      question: L('Puis-je payer à la livraison ?', 'Can I pay on delivery?'),
      answer: L(
        'Oui, le paiement à la livraison est disponible pour certaines zones sécurisées à Abidjan et Dakar. Un acompte via Mobile Money peut être demandé pour les pièces volumineuses ou de grande valeur.',
        'Yes, cash on delivery is available for certain secure areas in Abidjan and Dakar. A deposit via Mobile Money may be required for bulky or high-value parts.'
      )
    },
    {
      id: 'faq-6',
      category: 'Livraison 24-72h',
      question: L('Combien de temps prend la livraison à Abidjan et à l\'intérieur ?', 'How long does delivery take in Abidjan and inland?'),
      answer: L(
        'Nous assurons une livraison en 24h chrono pour Abidjan et ses environs. Pour l\'intérieur du pays (Yamoussoukro, Bouaké, San Pedro, etc.), comptez entre 48h et 72h via nos transporteurs partenaires.',
        'We guarantee 24-hour delivery for Abidjan and its surroundings. For inland areas (Yamoussoukro, Bouaké, San Pedro, etc.), expect between 48h and 72h via our partner carriers.'
      )
    },
    {
      id: 'faq-7',
      category: 'Livraison 24-72h',
      question: L('Livrez-vous à Dakar, Bamako ou Ouagadougou ?', 'Do you deliver to Dakar, Bamako or Ouagadougou?'),
      answer: L(
        'Oui, AutoAfrique s\'étend dans la sous-région ! Nous livrons dans plusieurs capitales d\'Afrique de l\'Ouest grâce à nos partenaires logistiques régionaux. Les délais varient de 3 à 7 jours selon la destination.',
        'Yes, AutoAfrique is expanding in the sub-region! We deliver to several West African capitals through our regional logistics partners. Delivery times vary from 3 to 7 days depending on the destination.'
      )
    },
    {
      id: 'faq-8',
      category: 'Retours & Garantie',
      question: L('Que faire si la pièce reçue n\'est pas compatible avec mon véhicule ?', 'What if the received part is not compatible with my vehicle?'),
      answer: L(
        'Pas de panique ! Vous disposez de 7 jours pour signaler une incompatibilité. Si l\'erreur vient de nous, nous organisons l\'échange ou le remboursement sans frais supplémentaires. La pièce doit être retournée dans son état d\'origine.',
        'Don\'t panic! You have 7 days to report an incompatibility. If the mistake is ours, we will arrange an exchange or refund at no extra cost. The part must be returned in its original condition.'
      )
    },
    {
      id: 'faq-9',
      category: 'Retours & Garantie',
      question: L('Proposez-vous une garantie sur les pièces d\'occasion (France-au-revoir) ?', 'Do you offer a warranty on used parts (France-au-revoir)?'),
      answer: L(
        'Oui. Toutes nos pièces "France-au-revoir" sont inspectées et bénéficient d\'une garantie de montage de 48h à 7 jours selon le type de pièce (moteurs, boîtes de vitesse, etc.). Les pièces neuves bénéficient de la garantie constructeur.',
        'Yes. All our "France-au-revoir" (used) parts are inspected and come with a 48h to 7-day installation warranty depending on the type of part (engines, gearboxes, etc.). New parts come with the manufacturer\'s warranty.'
      )
    },
    {
      id: 'faq-10',
      category: 'Espace Vendeur / Garage',
      question: L('Comment devenir vendeur sur AutoAfrique ?', 'How do I become a seller on AutoAfrique?'),
      answer: L(
        'L\'inscription est 100% gratuite. Cliquez sur "Devenir Vendeur" en haut de la page, remplissez le formulaire avec les documents de votre boutique ou casse auto. Après vérification par notre équipe, votre boutique sera en ligne.',
        'Registration is 100% free. Click on "Become a Seller" at the top of the page, fill out the form with your shop or junkyard documents. After verification by our team, your shop will be online.'
      )
    },
    {
      id: 'faq-11',
      category: 'Espace Vendeur / Garage',
      question: L('Quels sont les frais pour les vendeurs ?', 'What are the fees for sellers?'),
      answer: L(
        'Nous ne prenons pas de frais d\'abonnement mensuel. Nous appliquons uniquement une commission de 5% à 10% sur les ventes réussies, selon la catégorie de la pièce vendue.',
        'We do not charge monthly subscription fees. We only apply a 5% to 10% commission on successful sales, depending on the category of the part sold.'
      )
    },
    {
      id: 'faq-12',
      category: 'Espace Vendeur / Garage',
      question: L('Comment utiliser le logiciel ERP pour mon garage ?', 'How do I use the ERP software for my garage?'),
      answer: L(
        'L\'abonnement Pro AutoAfrique inclut un ERP complet pour les garages : gestion des rendez-vous, création de devis professionnels, suivi du stock et facturation. Des tutoriels vidéo sont disponibles dans votre espace partenaire.',
        'The AutoAfrique Pro subscription includes a complete ERP for garages: appointment management, creation of professional quotes, stock tracking, and billing. Video tutorials are available in your partner area.'
      )
    }
  ];

  // Filter FAQs based on search and category
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Tout' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white pt-24 pb-20 px-4 md:px-8 relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            {L('Comment pouvons-nous vous aider ?', 'How can we help you?')}
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            {L('Trouvez des réponses rapides à vos questions sur les commandes, les paiements, la livraison et bien plus.', 'Find quick answers to your questions about orders, payments, delivery, and more.')}
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder={L('Rechercher une question (ex: Wave, Livraison, Retour...)', 'Search for a question (e.g., Wave, Delivery, Return...)')}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:bg-white focus:text-slate-900 focus:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 shadow-lg backdrop-blur-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-8 relative z-20 pb-20">
        
        {/* Categories Tabs */}
        <div className="bg-white rounded-2xl shadow-xl p-2 mb-10 flex flex-wrap gap-2 justify-center md:justify-start overflow-x-auto whitespace-nowrap scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setOpenFaq(null);
              }}
              className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeCategory === cat.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-transparent text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQs List */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <div 
                key={faq.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
                >
                  <h3 className={`font-bold text-lg pr-8 transition-colors ${openFaq === faq.id ? 'text-primary' : 'text-slate-800'}`}>
                    {faq.question}
                  </h3>
                  <div className={`flex-shrink-0 transition-transform duration-300 text-slate-400 ${openFaq === faq.id ? 'rotate-180 text-primary' : ''}`}>
                    <ChevronDownIcon />
                  </div>
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaq === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-50 pt-4 mt-2">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
              <div className="text-slate-400 mb-4 flex justify-center">
                <SearchIcon className="w-12 h-12 opacity-50" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {L('Aucun résultat trouvé', 'No results found')}
              </h3>
              <p className="text-slate-500">
                {L('Essayez d\'autres mots-clés ou parcourez nos catégories.', 'Try different keywords or browse our categories.')}
              </p>
              <button 
                onClick={() => { setSearchTerm(''); setActiveCategory('Tout'); }}
                className="mt-6 text-primary font-semibold hover:underline"
              >
                {L('Afficher toutes les questions', 'Show all questions')}
              </button>
            </div>
          )}
        </div>

        {/* Contact CTA Banner */}
        <div className="mt-16 bg-blue-50 rounded-3xl p-8 md:p-12 text-center border border-blue-100 shadow-sm relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
          
          <div className="relative z-10">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-primary">
              <MessageIcon />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4">
              {L('Vous ne trouvez pas votre réponse ?', 'Can\'t find your answer?')}
            </h2>
            <p className="text-slate-600 mb-8 max-w-xl mx-auto">
              {L('Notre équipe d\'experts en pièces automobiles est à votre disposition 7j/7 pour vous accompagner dans votre recherche.', 'Our team of auto parts experts is available 24/7 to assist you in your search.')}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/contact"
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-md"
              >
                {L('Nous contacter', 'Contact us')}
              </Link>
              <a 
                href="https://wa.me/2250000000000" // Placeholder WhatsApp link
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20bd5a] transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
                {L('Assistance WhatsApp', 'WhatsApp Support')}
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
