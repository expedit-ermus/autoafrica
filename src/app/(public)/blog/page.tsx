'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';

export default function BlogIndexPage() {
  const { locale } = useApp();
  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const articles = [
    {
      slug: 'ou-trouver-pieces-detachees-auto-abidjan',
      title: L('Où trouver des pièces détachées auto de qualité à Abidjan ? Guide 2026', 'Where to find quality auto parts in Abidjan? 2026 Guide'),
      category: L('Guide d\'achat', 'Buying guide'),
      categoryColor: 'bg-blue-100 text-blue-800 border-blue-200',
      excerpt: L('Guide complet pour acheter vos pièces auto à Abidjan : comparatif casse d\'Adjamé, ferraille Marcory, N\'Dotré et marketplace AutoAfrique.', 'Complete guide to buying your auto parts in Abidjan: Adjamé scrap yard, Marcory, N\'Dotré and AutoAfrique marketplace.'),
      date: L('27 Août 2026', 'Aug 27, 2026'),
      readTime: L('6 min', '6 min'),
    },
    {
      slug: 'verifier-compatibilite-piece-auto-vehicule',
      title: L('Comment vérifier la compatibilité d\'une pièce auto avec son véhicule ?', 'How to check auto part compatibility with your vehicle?'),
      category: L('Guide d\'achat', 'Buying guide'),
      categoryColor: 'bg-blue-100 text-blue-800 border-blue-200',
      excerpt: L('Immatriculation, VIN, motorisation : les 4 méthodes fiables pour ne jamais commander la mauvaise référence.', 'Registration, VIN, engine type: 4 reliable methods to never order the wrong part reference.'),
      date: L('27 Août 2026', 'Aug 27, 2026'),
      readTime: L('6 min', '6 min'),
    },
    {
      slug: 'casse-auto-vs-autoafrique',
      title: L('Casse auto vs AutoAfrique : pourquoi choisir l\'occasion contrôlée à Abidjan ?', 'Scrap yards vs AutoAfrique: why choose certified used parts in Abidjan?'),
      category: L('Différenciation & Confiance', 'Trust & Comparison'),
      categoryColor: 'bg-orange-100 text-orange-800 border-orange-200',
      excerpt: L('Prix fixes, garantie 48h, pièces certifiées et paiement Mobile Money : l\'alternative moderne aux casses d\'Abidjan.', 'Fixed prices, 48h warranty, certified parts and Mobile Money payment: the modern alternative to Abidjan scrap yards.'),
      date: L('15 Août 2026', 'Aug 15, 2026'),
      readTime: L('6 min', '6 min'),
    },
    {
      slug: 'entretien-vehicule-afrique',
      title: L('Guide complet : entretenir son véhicule à Abidjan et en Afrique de l\'Ouest', 'Complete guide: vehicle maintenance in Abidjan & West Africa'),
      category: L('Entretien', 'Maintenance'),
      categoryColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      excerpt: L('Les 10 points d\'entretien essentiels pour rouler en toute sécurité à Abidjan, Dakar et dans toute la sous-région.', 'The 10 essential maintenance points to drive safely in Abidjan, Dakar and throughout the sub-region.'),
      date: L('12 Août 2026', 'Aug 12, 2026'),
      readTime: L('8 min', '8 min'),
    },
    {
      slug: 'choisir-pieces-occasion-controlee',
      title: L('Comment choisir une pièce d\'occasion contrôlée à Abidjan ?', 'How to choose quality-inspected used parts in Abidjan?'),
      category: L('Guide d\'achat', 'Buying guide'),
      categoryColor: 'bg-blue-100 text-blue-800 border-blue-200',
      excerpt: L('Neuf ou occasion ? Voici comment vérifier la qualité d\'une pièce de réemploi avant l\'achat à Abidjan.', 'New or used? Here\'s how to check the quality of a reused part before buying in Abidjan.'),
      date: L('10 Août 2026', 'Aug 10, 2026'),
      readTime: L('6 min', '6 min'),
    },
    {
      slug: 'paiement-mobile-money-auto',
      title: L('Acheter ses pièces auto par Mobile Money à Abidjan', 'Buy auto parts via Mobile Money in Abidjan'),
      category: L('Paiement', 'Payment'),
      categoryColor: 'bg-purple-100 text-purple-800 border-purple-200',
      excerpt: L('Wave, Orange Money, MTN MoMo : comment le séquestre Mobile Money protège vendeurs et acheteurs à Abidjan.', 'Wave, Orange Money, MTN MoMo: how mobile money escrow protects sellers and buyers in Abidjan.'),
      date: L('8 Août 2026', 'Aug 8, 2026'),
      readTime: L('5 min', '5 min'),
    },
    {
      slug: 'gestion-stock-garage-erp',
      title: L('Gérer son stock de pièces détachées avec un ERP', 'Managing your auto parts stock with an ERP'),
      category: L('ERP & Gestion', 'ERP & Management'),
      categoryColor: 'bg-amber-100 text-amber-800 border-amber-200',
      excerpt: L('Fini les cahiers et les tableurs. Découvrez comment un logiciel ERP peut transformer la gestion de votre garage.', 'No more notebooks and spreadsheets. Discover how ERP software can transform your garage management.'),
      date: L('5 Août 2026', 'Aug 5, 2026'),
      readTime: L('7 min', '7 min'),
    },
    {
      slug: 'livraison-pieces-gare-routiere',
      title: L('Livraison de pièces auto par Gare Routière : le guide', 'Auto parts delivery via bus station: the guide'),
      category: L('Livraison', 'Delivery'),
      categoryColor: 'bg-sky-100 text-sky-800 border-sky-200',
      excerpt: L('Comment expédier et recevoir des pièces détachées entre Abidjan, Bouaké, Dakar et les grandes villes.', 'How to ship and receive auto parts between Abidjan, Bouaké, Dakar and major cities.'),
      date: L('2 Août 2026', 'Aug 2, 2026'),
      readTime: L('6 min', '6 min'),
    },
    {
      slug: 'devenir-vendeur-marketplace',
      title: L('Comment devenir vendeur sur la marketplace AutoAfrique', 'How to become a seller on AutoAfrique marketplace'),
      category: L('Vendeurs', 'Sellers'),
      categoryColor: 'bg-orange-100 text-orange-800 border-orange-200',
      excerpt: L('Les étapes pour créer votre boutique en ligne et commencer à vendre vos pièces détachées.', 'Steps to create your online shop and start selling your auto parts.'),
      date: L('29 Juil. 2026', 'Jul 29, 2026'),
      readTime: L('5 min', '5 min'),
    }
  ];

  const featuredArticle = articles[0];
  const gridArticles = articles.slice(1);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 text-white overflow-hidden pt-24 pb-32 border-b border-slate-800">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/80"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 font-bold text-xs uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            Blog AutoAfrique
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
            {L('Conseils, astuces et actus auto', 'Auto tips, tricks and news')}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {L('Découvrez nos guides d\'experts pour l\'entretien de votre véhicule, l\'achat de pièces et les dernières actualités de l\'automobile en Afrique de l\'Ouest.', 'Discover our expert guides for vehicle maintenance, parts purchasing and the latest automotive news in West Africa.')}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        {/* Featured Article */}
        <Link href={`/blog/${featuredArticle.slug}`} className="group block mb-16 bg-white rounded-3xl shadow-xl shadow-slate-900/5 border border-slate-200/80 overflow-hidden hover:shadow-2xl hover:border-orange-500/40 transition-all duration-300">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/2 h-64 lg:h-auto bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
              <span className="text-8xl transform group-hover:scale-110 transition-transform duration-500 select-none">🚘</span>
            </div>
            <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${featuredArticle.categoryColor}`}>
                  {featuredArticle.category}
                </span>
                <span className="text-sm text-slate-500">{featuredArticle.date}</span>
                <span className="text-sm text-slate-500 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {featuredArticle.readTime}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-4 group-hover:text-orange-600 transition-colors leading-tight">
                {featuredArticle.title}
              </h2>
              <p className="text-slate-600 text-base sm:text-lg mb-8 line-clamp-3 leading-relaxed">
                {featuredArticle.excerpt}
              </p>
              <div className="flex items-center text-orange-600 font-bold gap-2 group-hover:gap-3 transition-all text-sm">
                {L('Lire l\'article', 'Read article')}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </div>
            </div>
          </div>
        </Link>

        {/* Article Grid */}
        <div className="mb-12">
          <h3 className="text-2xl font-black text-slate-900 mb-8">{L('Derniers articles', 'Latest articles')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridArticles.map((article, idx) => (
              <Link key={article.slug} href={`/blog/${article.slug}`} className="group bg-white rounded-3xl shadow-md hover:shadow-xl border border-slate-200/80 hover:border-orange-500/40 transition-all duration-300 flex flex-col h-full overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300"></div>
                  <span className="text-6xl transform group-hover:scale-110 transition-transform duration-500 select-none">
                    {idx === 0 ? '🔍' : idx === 1 ? '💳' : idx === 2 ? '💻' : idx === 3 ? '🚚' : '🏪'}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-0.5 rounded-md border text-xs font-semibold ${article.categoryColor}`}>
                      {article.category}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-slate-600 text-sm mb-6 line-clamp-2 flex-grow leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{article.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {article.readTime}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter CTA */}
        <section className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 md:p-12 text-white shadow-lg text-center mt-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">{L('Ne manquez aucune astuce !', 'Don\'t miss any tips!')}</h3>
            <p className="text-orange-100 mb-8 max-w-xl mx-auto">
              {L('Abonnez-vous à notre newsletter pour recevoir nos meilleurs conseils d\'entretien et nos offres exclusives directement dans votre boîte mail.', 'Subscribe to our newsletter to receive our best maintenance tips and exclusive offers directly in your inbox.')}
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder={L('Votre adresse email', 'Your email address')} 
                className="flex-grow px-4 py-3 rounded-xl text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
                required
              />
              <button 
                type="submit" 
                className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-colors whitespace-nowrap"
              >
                {L('S\'abonner', 'Subscribe')}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
