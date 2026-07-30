'use client';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';

export default function LandingPage() {
  const { t, locale } = useApp();
  const L = (fr: string, en: string) => locale === 'fr' ? fr : en;

  const carBrands = [
    { name: 'Toyota', count: '12,400+', models: 'Hilux, Corolla, Land Cruiser, RAV4' },
    { name: 'Hyundai', count: '6,800+', models: 'Tucson, Elantra, Santa Fe, Accent' },
    { name: 'Kia', count: '5,200+', models: 'Sportage, Rio, Sorento, Cerato' },
    { name: 'Peugeot', count: '4,500+', models: '307, 308, 406, 206, Partner' },
    { name: 'Mercedes', count: '3,800+', models: 'C180, C200, E240, ML320' },
    { name: 'Renault', count: '2,900+', models: 'Symbol, Duster, Clio, Scénic' },
  ];

  const stats = [
    { label: L('Pièces référencées', 'Parts listed'), value: '85,000+' },
    { label: L('Vendeurs actifs', 'Active sellers'), value: '3,200+' },
    { label: L('Commandes livrées', 'Orders delivered'), value: '120,000+' },
    { label: L('Villes couvertes', 'Cities covered'), value: '45+' },
  ];

  const testimonials = [
    {
      name: 'Moussa Koulibaly',
      role: L('Garagiste Toyota, Abidjan (Yopougon)', 'Toyota Mechanic, Abidjan (Yopougon)'),
      text: L(
        'Avant AutoAfrique, je perdais 3 jours par semaine à courir entre Adjamé et le Marché Sandaga pour une seule pièce. Mon client attendait sur le capot, le moteur ouvert, et finissait par partir chez le concurrent. Aujourd\'hui, je tape la référence sur mon téléphone, je paye par Orange Money, et la pièce est livrée le lendemain. Mon chiffre d\'affaires a doublé en 6 mois.',
        'Before AutoAfrique, I lost 3 days a week running between Adjamé and Sandaga market for a single part. My client waited by the car, engine open, and ended up going to the competitor. Today, I type the reference on my phone, pay via Orange Money, and the part is delivered next day. My revenue doubled in 6 months.'
      ),
      rating: 5,
      img: 'https://images.unsplash.com/photo-1769636929354-59165ba73c7e?w=100&h=100&fit=crop&crop=face',
    },
    {
      name: 'Abdoulaye Ndiaye',
      role: L('Revendeur pièces Peugeot, Dakar', 'Peugeot Parts Dealer, Dakar'),
      text: L(
        'J\'avais un hangar rempli de 300 pièces Peugeot 307 et 406 qui prenaient la poussière depuis 2 ans. Personnes m\'ont dit de jeter. AutoAfrique les a mises en ligne un lundi. Le vendredi, j\'avais déjà reçu 47 commandes du Sénégal, du Mali et de Gambie. En 3 semaines, le hangar était vide.',
        'I had a shed full of 300 Peugeot 307 and 406 parts gathering dust for 2 years. People told me to throw them away. AutoAfrique put them online on Monday. By Friday, I had received 47 orders from Senegal, Mali and Gambia. In 3 weeks, the shed was empty.'
      ),
      rating: 5,
      img: 'https://images.unsplash.com/photo-1759300063434-482e4d65f9bf?w=100&h=100&fit=crop&crop=face',
    },
    {
      name: 'Fatima Camara',
      role: L('Gérante garage Hyundai, Bamako', 'Hyundai Garage Manager, Bamako'),
      text: L(
        'Le plus dur, c\'était les paiements. Avant, je livrais la pièce et j\'attendais des jours que le client vienne payer en cash. Parfois il ne venait jamais. Avec AutoAfrique, le client paie par MTN MoMo avant même que je prépare la pièce. Zéro dette, zéro relance. Ma vie a changé.',
        'The hardest part was payments. Before, I delivered the part and waited days for the client to pay cash. Sometimes they never came. With AutoAfrique, the client pays via MTN MoMo before I even prepare the part. Zero debt, zero chasing. My life changed.'
      ),
      rating: 5,
      img: 'https://images.unsplash.com/photo-1754843780819-9266a192ca7a?w=100&h=100&fit=crop&crop=face',
    },
  ];

  const brandStory = {
    hook: L(
      'En Afrique de l\'Ouest, 70% des pièces automobiles sont vendues dans des marchés en plein air, sans garantie, sans traçabilité, et souvent à prix surélevé. Les garagistes perdent des heures à chercher ce qu\'une application pourrait trouver en 30 secondes.',
      'In West Africa, 70% of auto parts are sold in open-air markets, without warranty, without traceability, and often overpriced. Mechanics lose hours searching for what an app could find in 30 seconds.'
    ),
    problem: L(
      'Votre client arrive avec son Toyota Hilux en panne. Vous appelez 3 fournisseurs à Adjamé, 2 au Marché Sandaga, personne n\'a la pièce. Votre client attend, s\'impatine, et finit par aller chez le concurrent d\'à côté. Vous avez perdu une vente de 85 000 FCFA.',
      'Your client arrives with his broken-down Toyota Hilux. You call 3 suppliers at Adjamé, 2 at Sandaga market, nobody has the part. Your client waits, gets impatient, and goes to the competitor next door. You lost an 85,000 CFA sale.'
    ),
    solution: L(
      'AutoAfrique centralise les pièces pour Toyota, Hyundai, Kia, Peugeot, Mercedes et Renault dans toute l\'Afrique de l\'Ouest. Vous cherchez la référence, vous la trouvez, vous payez par Orange Money ou MTN MoMo, et la pièce est expédiée. Fini les appels, fini les pertes.',
      'AutoAfrique centralizes parts for Toyota, Hyundai, Kia, Peugeot, Mercedes and Renault across West Africa. You search the reference, find it, pay via Orange Money or MTN MoMo, and the part is shipped. No more calls, no more losses.'
    ),
  };

  return (
    <div className="overflow-x-hidden" style={{ backgroundColor: '#FAFBFC' }}>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #0F2744 50%, #0A1929 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-[#FF6B35] rounded-full filter blur-[128px]"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#00C9A7] rounded-full filter blur-[128px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8">
                <span className="w-2 h-2 bg-[#00C9A7] rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-white/80">
                  {L('N°1 des pièces pour Toyota, Hyundai, Kia, Peugeot', '#1 parts for Toyota, Hyundai, Kia, Peugeot')}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6">
                {L('Votre Hilux tombe en panne ?', 'Your Hilux breaks down?')}<br />
                <span className="bg-gradient-to-r from-[#FF6B35] via-[#FF8F5E] to-[#00C9A7] bg-clip-text text-transparent">
                  {L('La pièce est ici.', 'The part is here.')}
                </span>
              </h1>

              <p className="text-lg md:text-xl text-white/60 mb-10 leading-relaxed max-w-lg">
                {brandStory.hook}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FF6B35] hover:bg-[#FF5520] text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-[#FF6B35]/25 hover:shadow-[#FF6B35]/40 hover:-translate-y-0.5"
                >
                  {L('Ouvrir ma boutique gratuitement', 'Open my shop for free')}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/dashboard/marketplace"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  {L('Trouver une pièce', 'Find a part')}
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-white/50">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#00C9A7]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {L('14 jours gratuits', '14 days free')}
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#00C9A7]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {L('Paiement Mobile Money', 'Mobile Money pay')}
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#00C9A7]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {L('Livraison 24-72h', '24-72h delivery')}
                </div>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {stats.map((s) => (
                    <div key={s.label} className="bg-white/5 rounded-2xl p-5 text-center border border-white/5">
                      <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
                      <div className="text-xs text-white/50 uppercase tracking-wider">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#FF6B35] flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-semibold">{L('Kit de frein avant — Toyota Hilux 2018', 'Front brake kit — Toyota Hilux 2018')}</div>
                      <div className="text-white/40 text-sm">Réf: BRK-TOY-HIL-2018</div>
                    </div>
                    <div className="ml-auto text-[#FF6B35] font-bold text-lg">85 000 FCFA</div>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-[#00C9A7]/20 text-[#00C9A7] text-xs font-medium rounded-lg">{L('Disponible Abidjan', 'Available Abidjan')}</span>
                    <span className="px-3 py-1 bg-[#FF6B35]/20 text-[#FF6B35] text-xs font-medium rounded-lg">{L('Contrôle OK', 'QC OK')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Car brands bar */}
      <section className="py-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6 md:gap-10 flex-wrap">
              {carBrands.map(b => (
                <Link key={b.name} href="/dashboard/marketplace" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#FF6B35] transition-colors duration-300">
                  <span className="font-bold text-[#1E3A5F]">{b.name}</span>
                  <span className="text-xs text-gray-400 hidden lg:inline">{b.models}</span>
                  <span className="text-xs text-[#FF6B35] font-semibold">{b.count}</span>
                </Link>
              ))}
            </div>
            <Link href="/dashboard/marketplace" className="text-sm font-semibold text-[#FF6B35] hover:text-[#FF5520] transition-colors duration-300">
              {L('Voir toutes les pièces →', 'View all parts →')}
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-24 md:py-32" style={{ backgroundColor: '#FAFBFC' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1766650189458-bb0e7969ba5d?w=800&h=600&fit=crop"
                alt="Atelier de pièces détachées automobiles"
                className="rounded-3xl shadow-2xl w-full h-80 md:h-[480px] object-cover"
              />
              <div className="absolute -bottom-8 -right-8 bg-[#FF6B35] text-white rounded-2xl p-6 shadow-2xl">
                <div className="text-4xl font-extrabold mb-1">85,000+</div>
                <div className="text-sm text-white/80">{L('pièces pour vos véhicules', 'parts for your vehicles')}</div>
              </div>
            </div>

            <div>
              <div className="text-sm font-bold text-[#FF6B35] uppercase tracking-wider mb-4">{L('Notre histoire', 'Our story')}</div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-[#1E3A5F] mb-8 leading-tight">
                {L('Née dans les garages d\'Abidjan', 'Born in the garages of Abidjan')}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                {brandStory.problem}
              </p>
              <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                {brandStory.solution}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FF6B35] hover:bg-[#FF5520] text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-[#FF6B35]/25 hover:shadow-[#FF6B35]/40"
                >
                  {L('Commencer maintenant', 'Start now')}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/dashboard/marketplace"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-[#1E3A5F] font-semibold rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300"
                >
                  {L('Voir la démo', 'Watch demo')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-20">
            <div className="text-sm font-bold text-[#00C9A7] uppercase tracking-wider mb-4">{L('Fonctionnalités', 'Features')}</div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#1E3A5F] mb-6">{t.features.title}</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">{t.features.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '📦', title: t.features.inventory.title, desc: t.features.inventory.desc, cta: L('Gérer mon stock', 'Manage stock'), href: '/dashboard/inventory' },
              { icon: '🏪', title: t.features.marketplace.title, desc: t.features.marketplace.desc, cta: L('Voir la marketplace', 'View marketplace'), href: '/dashboard/marketplace' },
              { icon: '💳', title: t.features.payments.title, desc: t.features.payments.desc, cta: L('Configurer les paiements', 'Set up payments'), href: '/dashboard/payments' },
              { icon: '👥', title: t.features.crm.title, desc: t.features.crm.desc, cta: L('Ouvrir le CRM', 'Open CRM'), href: '/dashboard/crm' },
              { icon: '💰', title: t.features.finance.title, desc: t.features.finance.desc, cta: L('Voir la finance', 'View finance'), href: '/dashboard/finance' },
              { icon: '📊', title: t.features.analytics.title, desc: t.features.analytics.desc, cta: L('Voir les rapports', 'View reports'), href: '/dashboard' },
            ].map(({ icon, title, desc, cta, href }, idx) => (
              <div
                key={idx}
                className="group bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-100 hover:border-[#FF6B35]/20 transition-all duration-500 hover:shadow-xl hover:shadow-[#FF6B35]/5 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF6B35]/10 to-[#00C9A7]/10 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {icon}
                </div>
                <h3 className="text-xl font-bold text-[#1E3A5F] mb-3">{title}</h3>
                <p className="text-gray-500 leading-relaxed mb-6">{desc}</p>
                <Link href={href} className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF6B35] hover:text-[#FF5520] transition-colors duration-300 group/link">
                  {cta}
                  <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 md:py-32" style={{ backgroundColor: '#FAFBFC' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 md:mb-20">
            <div className="text-sm font-bold text-[#00C9A7] uppercase tracking-wider mb-4">{L('Processus', 'Process')}</div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#1E3A5F] mb-6">{L('Comment ça marche ?', 'How it works?')}</h2>
            <p className="text-lg text-gray-500">{L('En 3 étapes simples', 'In 3 simple steps')}</p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FF6B35] via-[#00C9A7] to-[#FF6B35] opacity-20"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {[
                {
                  step: '01',
                  title: L('Inscrivez votre boutique', 'Register your shop'),
                  desc: L('Ajoutez votre nom, ville et spécialités (Toyota, Peugeot, Hyundai...). Gratuit pendant 14 jours.', 'Add your name, city and specialties (Toyota, Peugeot, Hyundai...). Free for 14 days.'),
                  img: 'https://images.unsplash.com/photo-1763848843613-f8c2ca3a31a1?w=600&h=400&fit=crop',
                },
                {
                  step: '02',
                  title: L('Publiez vos pièces', 'Publish your parts'),
                  desc: L('Photoz la pièce avec votre téléphone, ajoutez la référence et la compatibilité véhicule. En ligne en 2 minutes.', 'Photograph the part with your phone, add the reference and vehicle compatibility. Online in 2 minutes.'),
                  img: 'https://images.unsplash.com/photo-1533833406613-0058ceea5d1a?w=600&h=400&fit=crop',
                },
                {
                  step: '03',
                  title: L('Recevez des commandes', 'Receive orders'),
                  desc: L('Les garagistes de 10 pays vous commandent. Paiement Mobile Money sécurisé. Expédition en 24h.', 'Mechanics from 10 countries order from you. Secure Mobile Money payment. Ship in 24h.'),
                  img: 'https://images.unsplash.com/photo-1579998120708-682dd8a5624f?w=600&h=400&fit=crop',
                },
              ].map((s) => (
                <div key={s.step} className="relative group">
                  <div className="relative bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-[#FF6B35]/20 transition-all duration-500 hover:shadow-xl hover:shadow-[#FF6B35]/5">
                    <div className="h-48 md:h-56 overflow-hidden">
                      <img
                        src={s.img}
                        alt={s.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-8">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#FF8F5E] text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-[#FF6B35]/25">
                          {s.step}
                        </div>
                        <h3 className="text-xl font-bold text-[#1E3A5F]">{s.title}</h3>
                      </div>
                      <p className="text-gray-500 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 md:mb-20">
            <div className="text-sm font-bold text-[#00C9A7] uppercase tracking-wider mb-4">{L('Témoignages', 'Testimonials')}</div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#1E3A5F] mb-6">{L('Ils nous font confiance', 'They trust us')}</h2>
            <p className="text-lg text-gray-500">{L('+3 200 garagistes et revendeurs en Afrique de l\'Ouest', '+3,200 mechanics and dealers in West Africa')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(test => (
              <div key={test.name} className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-100 hover:border-[#FF6B35]/20 transition-all duration-500 hover:shadow-xl hover:shadow-[#FF6B35]/5">
                <div className="flex items-center gap-1 mb-6">
                  {Array.from({ length: test.rating }).map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-[#FF6B35]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed mb-8 text-sm italic">&ldquo;{test.text}&rdquo;</p>
                <div className="flex items-center gap-4">
                  <img
                    src={test.img}
                    alt={test.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#FF6B35]/20"
                  />
                  <div>
                    <div className="font-semibold text-[#1E3A5F]">{test.name}</div>
                    <div className="text-sm text-gray-500">{test.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 md:py-32" style={{ backgroundColor: '#FAFBFC' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 md:mb-20">
            <div className="text-sm font-bold text-[#00C9A7] uppercase tracking-wider mb-4">{L('Tarifs', 'Pricing')}</div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#1E3A5F] mb-6">{t.pricing.title}</h2>
            <p className="text-lg text-gray-500">{t.pricing.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {(['starter', 'pro', 'enterprise'] as const).map((plan) => {
              const p = t.pricing[plan];
              const isPro = plan === 'pro';
              const popular = 'popular' in p ? p.popular : undefined;
              return (
                <div key={plan} className={`relative rounded-3xl p-8 ${isPro ? 'bg-[#1E3A5F] text-white ring-2 ring-[#FF6B35] md:scale-105 shadow-2xl shadow-[#1E3A5F]/20' : 'bg-white border border-gray-100 hover:border-gray-200'} transition-all duration-300`}>
                  {isPro && popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-gradient-to-r from-[#FF6B35] to-[#FF8F5E] text-white text-xs font-bold rounded-full shadow-lg shadow-[#FF6B35]/25">
                      {popular}
                    </div>
                  )}
                  <h3 className={`text-xl font-bold mb-3 ${isPro ? 'text-white' : 'text-[#1E3A5F]'}`}>{p.name}</h3>
                  <div className="mb-8">
                    <span className="text-4xl font-extrabold">{p.price}</span>
                    <span className={`text-sm ${isPro ? 'text-white/60' : 'text-gray-500'}`}> FCFA{p.period}</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm">
                        <svg className={`w-5 h-5 ${isPro ? 'text-[#00C9A7]' : 'text-[#FF6B35]'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className={isPro ? 'text-white/80' : 'text-gray-600'}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/auth/register" className={`block text-center py-4 rounded-xl font-semibold transition-all duration-300 ${isPro ? 'bg-[#FF6B35] hover:bg-[#FF5520] text-white shadow-lg shadow-[#FF6B35]/25 hover:shadow-[#FF6B35]/40' : 'bg-[#1E3A5F] hover:bg-[#2A4A6F] text-white'}`}>
                    {p.cta}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Payment */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-400 mb-6 uppercase tracking-widest font-medium">{L('Paiement Mobile Money accepté', 'Mobile Money payment accepted')}</p>
          <div className="grid grid-cols-2 md:flex items-center justify-center gap-4">
            {[
              { name: 'Orange Money', color: '#FF6600' },
              { name: 'MTN MoMo', color: '#FFCC00' },
              { name: 'Wave', color: '#00B4D8' },
              { name: 'Moov Money', color: '#0066CC' },
              { name: 'Visa', color: '#1A1F71' },
              { name: 'Mastercard', color: '#EB001B' },
            ].map((p) => (
              <div key={p.name} className="flex items-center gap-3 px-5 py-3 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                <div className="w-6 h-6 rounded" style={{ background: p.color }}></div>
                <span className="text-sm font-medium text-gray-700">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Countries */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-sm font-bold text-[#00C9A7] uppercase tracking-wider mb-4">{L('Présence', 'Presence')}</div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#1E3A5F] mb-6">{L('Présent dans 10 pays d\'Afrique de l\'Ouest', 'Present in 10 West African countries')}</h2>
          <p className="text-lg text-gray-500 mb-12 md:mb-16">{L('Du Sénégal au Nigeria, nous livrons partout', 'From Senegal to Nigeria, we deliver everywhere')}</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {[
              { code: 'ci', name: t.countries.CI },
              { code: 'sn', name: t.countries.SN },
              { code: 'ml', name: t.countries.ML },
              { code: 'bf', name: t.countries.BF },
              { code: 'ne', name: t.countries.NE },
              { code: 'bj', name: t.countries.BJ },
              { code: 'tg', name: t.countries.TG },
              { code: 'gw', name: t.countries.GW },
              { code: 'ng', name: t.countries.NG },
              { code: 'gh', name: t.countries.GH },
            ].map((country) => (
              <div key={country.code} className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-100 hover:border-[#FF6B35]/20 transition-all duration-500 hover:shadow-xl hover:shadow-[#FF6B35]/5 hover:-translate-y-1 cursor-pointer">
                <div className="mb-4 flex justify-center">
                  <img
                    src={`https://flagcdn.com/w160/${country.code}.png`}
                    alt={`${country.name} flag`}
                    className="w-16 h-12 object-cover rounded-lg shadow-sm"
                  />
                </div>
                <span className="text-sm font-bold text-[#1E3A5F]">{country.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 md:py-32 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #0F2744 50%, #0A1929 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF6B35] rounded-full filter blur-[128px]"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#00C9A7] rounded-full filter blur-[128px]"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-8 leading-tight">
            {L('Prêt à vendre vos pièces dans 10 pays ?', 'Ready to sell your parts in 10 countries?')}
          </h2>
          <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto">
            {L('Rejoignez 3 200+ vendeurs qui ont transformé leur business avec AutoAfrique.', 'Join 3,200+ sellers who transformed their business with AutoAfrique.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-[#FF6B35] hover:bg-[#FF5520] text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-[#FF6B35]/25 hover:shadow-[#FF6B35]/40 hover:-translate-y-0.5"
            >
              {L('Ouvrir ma boutique', 'Open my shop')}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
            >
              {L('Déjà inscrit ? Se connecter', 'Already signed in? Log in')}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A1929] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="text-2xl font-bold text-white mb-4">Auto<span className="text-[#FF6B35]">Afrique</span></div>
              <p className="text-white/50 text-sm leading-relaxed mb-6">
                {L('La marketplace n°1 des pièces automobiles en Afrique de l\'Ouest.', '#1 auto parts marketplace in West Africa.')}
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.757-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">{L('Produit', 'Product')}</h4>
              <ul className="space-y-3">
                <li><Link href="/dashboard/marketplace" className="text-white/50 hover:text-white text-sm transition-colors duration-300">{L('Marketplace', 'Marketplace')}</Link></li>
                <li><Link href="/dashboard/inventory" className="text-white/50 hover:text-white text-sm transition-colors duration-300">{L('Inventaire', 'Inventory')}</Link></li>
                <li><Link href="/dashboard/crm" className="text-white/50 hover:text-white text-sm transition-colors duration-300">CRM</Link></li>
                <li><Link href="/dashboard/payments" className="text-white/50 hover:text-white text-sm transition-colors duration-300">{L('Paiements', 'Payments')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">{L('Entreprise', 'Company')}</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-white/50 hover:text-white text-sm transition-colors duration-300">{L('À propos', 'About')}</a></li>
                <li><a href="#" className="text-white/50 hover:text-white text-sm transition-colors duration-300">{L('Blog', 'Blog')}</a></li>
                <li><a href="#" className="text-white/50 hover:text-white text-sm transition-colors duration-300">{L('Carrières', 'Careers')}</a></li>
                <li><a href="#" className="text-white/50 hover:text-white text-sm transition-colors duration-300">{L('Contact', 'Contact')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">{L('Légal', 'Legal')}</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-white/50 hover:text-white text-sm transition-colors duration-300">{L('Politique de confidentialité', 'Privacy Policy')}</a></li>
                <li><a href="#" className="text-white/50 hover:text-white text-sm transition-colors duration-300">{L('Conditions d\'utilisation', 'Terms of Service')}</a></li>
                <li><a href="#" className="text-white/50 hover:text-white text-sm transition-colors duration-300">{L('Cookies', 'Cookies')}</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-white/40 text-sm">
                &copy; {new Date().getFullYear()} AutoAfrique. {L('Tous droits réservés.', 'All rights reserved.')}
              </p>
              <p className="text-white/40 text-sm">
                {L('Fait avec ❤️ en Afrique de l\'Ouest', 'Made with ❤️ in West Africa')}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
