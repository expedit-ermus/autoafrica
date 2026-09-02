'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';

const SvgBookOpen = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
);

const SvgSearch = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

const SvgAlertTriangle = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
);

const SvgCar = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H9.3a2 2 0 0 0-1.6.8L5 11l-5.16.86a1 1 0 0 0-.84.99V16h3m10 0a2 2 0 1 1-4 0m4 0a2 2 0 1 0-4 0m-6 0a2 2 0 1 1-4 0m4 0a2 2 0 1 0-4 0"></path></svg>
);

const SvgSettings = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);

const SvgZap = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);

const SvgShieldCheck = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
);

const SvgFilter = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
);

const SvgClock = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);

const SvgWrench = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
);

const SvgEye = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);

const SvgShoppingCart = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
);

export default function RepairManualsPage() {
  const { locale } = useApp();
  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const [activeBrand, setActiveBrand] = useState('Tous');
  const [activeSystem, setActiveSystem] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');

  const brands = [
    'Tous',
    'Toyota',
    'Peugeot',
    'Hyundai',
    'Kia',
    'Mercedes-Benz',
    'Renault',
    'Nissan',
    'Mitsubishi',
    'Suzuki',
    'Dacia'
  ];

  const systems = [
    { id: 'Tous', name: L('Tous les Systèmes', 'All Systems'), icon: SvgSettings },
    { id: 'Moteur', name: L('Moteur', 'Engine'), icon: SvgZap },
    { id: 'Freinage', name: L('Freinage', 'Brakes'), icon: SvgShieldCheck },
    { id: 'Suspension', name: L('Suspension & Direction', 'Suspension & Steering'), icon: SvgCar },
    { id: 'Electricite', name: L('Électricité & Élec.', 'Electrical & Elec.'), icon: SvgZap },
    { id: 'Transmission', name: L('Boîte & Transmission', 'Transmission'), icon: SvgSettings },
    { id: 'Climatisation', name: L('Climatisation', 'AC & Heating'), icon: SvgSettings }
  ];

  const difficultyColors = {
    'Débutant': 'bg-green-100 text-green-800 border-green-200',
    'Intermédiaire': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Expert': 'bg-red-100 text-red-800 border-red-200',
    'Beginner': 'bg-green-100 text-green-800 border-green-200',
    'Intermediate': 'bg-yellow-100 text-yellow-800 border-yellow-200'
  };

  const manuals = [
    {
      id: 1,
      title: L('Changement des Plaquettes de Frein Avant', 'Front Brake Pads Replacement'),
      brand: 'Toyota',
      system: 'Freinage',
      difficulty: L('Débutant', 'Beginner'),
      time: L('45 min', '45 min'),
      tools: L('Clé de 14, Repousse-piston, Cric', '14mm wrench, Piston tool, Jack'),
      description: L(
        'Guide étape par étape pour remplacer les plaquettes de frein avant en toute sécurité.',
        'Step by step guide to replace front brake pads safely.'
      ),
      partsLink: '/recherche?q=plaquettes+de+frein+toyota'
    },
    {
      id: 2,
      title: L('Vidange Huile Moteur et Remplacement Filtre', 'Engine Oil & Filter Change'),
      brand: 'Peugeot',
      system: 'Moteur',
      difficulty: L('Débutant', 'Beginner'),
      time: L('30 min', '30 min'),
      tools: L('Clé de 21, Clé à filtre, Bac à huile', '21mm wrench, Filter wrench, Oil pan'),
      description: L(
        'Maintenez la longévité de votre moteur avec ce tutoriel complet de vidange.',
        'Maintain engine longevity with this complete oil change tutorial.'
      ),
      partsLink: '/recherche?q=filtre+huile+peugeot'
    },
    {
      id: 3,
      title: L('Remplacement Amortisseurs Avant', 'Front Shock Absorbers Replacement'),
      brand: 'Hyundai',
      system: 'Suspension',
      difficulty: L('Intermédiaire', 'Intermediate'),
      time: L('2 heures', '2 hours'),
      tools: L('Compresseur de ressort, Clés mixtes', 'Spring compressor, Combination wrenches'),
      description: L(
        'Améliorez la tenue de route en changeant vos amortisseurs usés.',
        'Improve handling by replacing worn out shock absorbers.'
      ),
      partsLink: '/recherche?q=amortisseurs+avant+hyundai'
    },
    {
      id: 4,
      title: L('Diagnostic et Remplacement Alternateur', 'Alternator Diagnosis & Replacement'),
      brand: 'Renault',
      system: 'Electricite',
      difficulty: L('Intermédiaire', 'Intermediate'),
      time: L('1.5 heures', '1.5 hours'),
      tools: L('Multimètre, Clé à cliquet, Démonte pneu', 'Multimeter, Ratchet wrench, Pry bar'),
      description: L(
        'Testez votre circuit de charge et remplacez un alternateur défaillant.',
        'Test your charging system and replace a faulty alternator.'
      ),
      partsLink: '/recherche?q=alternateur+renault'
    },
    {
      id: 5,
      title: L("Changement du Kit d'Embrayage", 'Clutch Kit Replacement'),
      brand: 'Kia',
      system: 'Transmission',
      difficulty: L('Expert', 'Expert'),
      time: L('6 heures', '6 hours'),
      tools: L("Centreur d'embrayage, Chèvre de levage, Douilles", 'Clutch alignment tool, Engine hoist, Sockets'),
      description: L(
        "Procédure complète de dépose de la boîte de vitesse et remplacement du kit d'embrayage.",
        'Complete procedure for gearbox removal and clutch kit replacement.'
      ),
      partsLink: '/recherche?q=kit+embrayage+kia'
    },
    {
      id: 6,
      title: L('Remplacement Courroie de Distribution', 'Timing Belt Replacement'),
      brand: 'Dacia',
      system: 'Moteur',
      difficulty: L('Expert', 'Expert'),
      time: L('4 heures', '4 hours'),
      tools: L('Piges de calage, Clé dynamométrique', 'Timing pins, Torque wrench'),
      description: L(
        'Intervention critique : guide détaillé pour le calage et le changement de la courroie.',
        'Critical intervention: detailed guide for timing and belt change.'
      ),
      partsLink: '/recherche?q=kit+distribution+dacia'
    },
    {
      id: 7,
      title: L('Recharge et Entretien Climatisation', 'AC Recharge & Maintenance'),
      brand: 'Mercedes-Benz',
      system: 'Climatisation',
      difficulty: L('Intermédiaire', 'Intermediate'),
      time: L('1 heure', '1 hour'),
      tools: L('Manomètres AC, Détecteur de fuite UV', 'AC gauges, UV leak detector'),
      description: L(
        'Contrôlez les pressions, détectez les fuites et rechargez le circuit frigorifique.',
        'Check pressures, detect leaks and recharge the refrigerant system.'
      ),
      partsLink: '/recherche?q=gaz+climatisation'
    },
    {
      id: 8,
      title: L('Nettoyage et Remplacement Vanne EGR', 'EGR Valve Cleaning & Replacement'),
      brand: 'Nissan',
      system: 'Moteur',
      difficulty: L('Intermédiaire', 'Intermediate'),
      time: L('1.5 heures', '1.5 hours'),
      tools: L('Nettoyant spécifique, Clés Torx', 'Specific cleaner, Torx wrenches'),
      description: L(
        "Résolvez les pertes de puissance et voyants moteur liés à l'encrassement de la vanne EGR.",
        'Resolve power loss and engine lights related to EGR valve fouling.'
      ),
      partsLink: '/recherche?q=vanne+egr+nissan'
    }
  ];

  const filteredManuals = manuals.filter(manual => {
    const matchBrand = activeBrand === 'Tous' || manual.brand === activeBrand;
    const matchSystem = activeSystem === 'Tous' || manual.system === activeSystem;
    const matchSearch = manual.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        manual.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchBrand && matchSystem && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 text-slate-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 text-white py-20 px-6 sm:px-12 lg:px-24 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
            <SvgBookOpen className="w-4 h-4" />
            {L('Centre de Connaissances & Diagnostics', 'Knowledge & Diagnostics Hub')}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-tight">
            {L('Manuels de Réparation &', 'Repair Manuals &')}{' '}
            <span className="text-orange-500">{L('Schémas Techniques', 'Technical Diagrams')}</span>
          </h1>
          <p className="text-slate-300 max-w-2xl text-base sm:text-lg mb-10 leading-relaxed">
            {L(
              'Accédez à des guides détaillés, des schémas électriques et des tutoriels étape par étape pour entretenir et réparer votre véhicule en toute confiance.',
              'Access detailed guides, wiring diagrams and step-by-step tutorials to maintain and repair your vehicle with confidence.'
            )}
          </p>
          
          <div className="w-full max-w-2xl relative">
            <input 
              type="text" 
              aria-label={L("Rechercher un manuel ou un tutoriel de réparation", "Search for a manual or repair tutorial")}
              placeholder={L("Rechercher un tutoriel, une pièce, un code erreur...", "Search for a tutorial, a part, an error code...")}
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-slate-900 bg-white border-2 border-slate-200 focus:outline-none focus:border-orange-500 shadow-xl font-medium text-sm transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SvgSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          </div>
        </div>
      </section>

      {/* Safety Disclaimer */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 -mt-6">
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-2xl shadow-md flex items-start gap-4 border border-amber-200">
          <SvgAlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-amber-900 text-sm">
              {L('Avertissement de Sécurité', 'Safety Warning')}
            </h3>
            <p className="text-yellow-700 text-sm mt-1">
              {L(
                "Les interventions mécaniques comportent des risques. Assurez-vous d'avoir les compétences et l'équipement nécessaires. En cas de doute, confiez votre véhicule à un professionnel qualifié. Portez toujours des équipements de protection individuelle.",
                'Mechanical repairs involve risks. Ensure you have the necessary skills and equipment. When in doubt, entrust your vehicle to a qualified professional. Always wear personal protective equipment.'
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-1/4 flex flex-col gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <SvgCar className="w-5 h-5 text-gray-500" />
                {L('Marque du Véhicule', 'Vehicle Brand')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {brands.map(brand => (
                  <button
                    key={brand}
                    onClick={() => setActiveBrand(brand)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeBrand === brand
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
              <h3 className="font-black text-slate-900 text-base mb-4 flex items-center gap-2">
                <SvgSettings className="w-5 h-5 text-orange-500" />
                {L('Système', 'System')}
              </h3>
              <div className="flex flex-col gap-2">
                {systems.map(sys => {
                  const Icon = sys.icon;
                  return (
                    <button
                      key={sys.id}
                      onClick={() => setActiveSystem(sys.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-xs font-bold transition-colors ${
                        activeSystem === sys.id
                          ? 'bg-orange-500/10 text-orange-600 font-extrabold border border-orange-500/20'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {sys.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="w-full lg:w-3/4">
            
            {/* Results Count & Sort */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-900">
                {filteredManuals.length} {L('Manuels disponibles', 'Manuals available')}
              </h2>
              <button className="flex items-center gap-2 text-slate-500 hover:text-slate-700">
                <SvgFilter className="w-4 h-4" />
                <span className="text-xs font-bold">{L('Trier par', 'Sort by')}</span>
              </button>
            </div>

            {/* Manuals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredManuals.map(manual => (
                <div key={manual.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 hover:shadow-xl hover:border-orange-500/30 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                      {manual.brand}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${difficultyColors[manual.difficulty as keyof typeof difficultyColors]}`}>
                      {manual.difficulty}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-base text-slate-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {manual.title}
                  </h3>
                  
                  <p className="text-slate-600 text-xs mb-4 line-clamp-2 leading-relaxed">
                    {manual.description}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <SvgClock className="w-4 h-4 text-orange-500" />
                      <span>{L('Durée estimée :', 'Est. time:')} <span className="font-bold text-slate-800">{manual.time}</span></span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-slate-500">
                      <SvgWrench className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span>{L('Outils :', 'Tools:')} <span className="text-slate-700">{manual.tools}</span></span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                    <button className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-800 hover:bg-slate-200 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors">
                      <SvgEye className="w-4 h-4" />
                      {L('Lire le guide', 'Read guide')}
                    </button>
                    <Link href={manual.partsLink} className="flex-1 flex items-center justify-center gap-2 bg-slate-950 text-white hover:bg-slate-900 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-sm">
                      <SvgShoppingCart className="w-4 h-4 text-orange-400" />
                      {L('Pièces', 'Parts')}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {filteredManuals.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80">
                <SvgBookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">{L('Aucun manuel trouvé', 'No manuals found')}</h3>
                <p className="text-slate-500 text-xs">
                  {L('Essayez de modifier vos filtres ou votre recherche.', 'Try modifying your filters or search.')}
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* CTA Banner: Diagnostic Estimator */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 mb-8">
        <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-xl">
          {/* Decorative background circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 md:max-w-xl">
            <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
              {L('Vous ne trouvez pas la panne ?', "Can't find the issue?")}
            </h2>
            <p className="text-orange-100 text-base sm:text-lg mb-6 leading-relaxed">
              {L(
                "Utilisez notre outil d'estimation de devis pour identifier le problème et obtenir une estimation des coûts de réparation et des pièces nécessaires.",
                'Use our quote estimator tool to identify the problem and get an estimate for repair costs and required parts.'
              )}
            </p>
            <Link 
              href="/estimation-devis" 
              className="inline-flex items-center gap-2 bg-white text-slate-950 font-black px-8 py-4 rounded-2xl hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg text-sm"
            >
              <SvgZap className="w-5 h-5 text-orange-600" />
              {L('Lancer le diagnostic en ligne', 'Start online diagnostic')}
            </Link>
          </div>
          
          <div className="relative z-10 hidden md:block">
            <div className="w-48 h-48 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
              <SvgSettings className="w-24 h-24 text-white opacity-80" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
