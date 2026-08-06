'use client';

import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';

interface SymptomOption {
  id: string;
  category: string;
  titleFr: string;
  titleEn: string;
  icon: string;
  partNameFr: string;
  partNameEn: string;
  estimatedVenant: string;
  estimatedNeuf: string;
  laborCost: string;
  duration: string;
}

const SYMPTOMS_DB: SymptomOption[] = [
  {
    id: 'bruit-suspension',
    category: 'Suspension & Châssis',
    titleFr: 'Bruit claquement / Amortisseur usé',
    titleEn: 'Knocking noise / Worn shock absorber',
    icon: '🚙',
    partNameFr: 'Paire d\'amortisseurs avant + rotules',
    partNameEn: 'Pair of front shock absorbers + ball joints',
    estimatedVenant: '35 000 - 55 000 FCFA',
    estimatedNeuf: '75 000 - 110 000 FCFA',
    laborCost: '15 000 FCFA',
    duration: '2h00',
  },
  {
    id: 'sifflement-freins',
    category: 'Freinage',
    titleFr: 'Freins qui sifflent ou pédale molle',
    titleEn: 'Squeaking brakes or soft pedal',
    icon: '🛑',
    partNameFr: 'Jeu de plaquettes de frein + disques',
    partNameEn: 'Brake pads set + brake discs',
    estimatedVenant: '18 000 - 28 000 FCFA',
    estimatedNeuf: '35 000 - 50 000 FCFA',
    laborCost: '8 000 FCFA',
    duration: '1h00',
  },
  {
    id: 'vidange-complete',
    category: 'Entretien Régulier',
    titleFr: 'Vidange & Révision 10 000 km',
    titleEn: 'Oil change & 10,000 km service',
    icon: '🛢️',
    partNameFr: 'Huile Synthétique 5W30 + 3 Filtres (Huile/Air/Gasoil)',
    partNameEn: 'Synthetic Oil 5W30 + 3 Filters (Oil/Air/Fuel)',
    estimatedVenant: 'N/A (Pièces neuves obligatoires)',
    estimatedNeuf: '28 000 - 42 000 FCFA',
    laborCost: '7 000 FCFA',
    duration: '0h45',
  },
  {
    id: 'fumee-noire-injecteurs',
    category: 'Moteur & Injection',
    titleFr: 'Fumée noire / Perte de puissance',
    titleEn: 'Black smoke / Power loss',
    icon: '⚙️',
    partNameFr: 'Jeu de 4 Injecteurs Diesel / Pompe HP',
    partNameEn: 'Set of 4 Diesel Injectors / HP Pump',
    estimatedVenant: '90 000 - 140 000 FCFA',
    estimatedNeuf: '250 000 - 380 000 FCFA',
    laborCost: '25 000 FCFA',
    duration: '3h30',
  },
  {
    id: 'surchauffe-radiateur',
    category: 'Refroidissement',
    titleFr: 'Aiguille de température haute / Fuite d\'eau',
    titleEn: 'High temperature gauge / Water leak',
    icon: '🌡️',
    partNameFr: 'Radiateur aluminium + Calorstat + Durites',
    partNameEn: 'Aluminum radiator + Thermostat + Hoses',
    estimatedVenant: '25 000 - 40 000 FCFA',
    estimatedNeuf: '55 000 - 85 000 FCFA',
    laborCost: '12 000 FCFA',
    duration: '1h30',
  },
  {
    id: 'voyant-batterie-alternateur',
    category: 'Électricité & Démarrage',
    titleFr: 'La voiture ne démarre pas / Voyant batterie',
    titleEn: 'Car won\'t start / Battery light on',
    icon: '⚡',
    partNameFr: 'Alternateur ou Démarreur reconditionné',
    partNameEn: 'Reconditioned Alternator or Starter',
    estimatedVenant: '30 000 - 50 000 FCFA',
    estimatedNeuf: '65 000 - 105 000 FCFA',
    laborCost: '10 000 FCFA',
    duration: '1h15',
  },
];

const MECHANICS_DB = [
  {
    id: 1,
    name: 'Mître Garage Diallo',
    location: 'Yopougon Selmer, Abidjan',
    rating: '4.9 ⭐ (128 avis)',
    specialty: 'Spécialiste Diesel & Châssis Toyota/Peugeot',
    availability: 'Disponible aujourd\'hui',
    phone: '+225 07 08 09 10 11',
  },
  {
    id: 2,
    name: 'Atelier Mécanique N\'Dotré Pro',
    location: 'Abobo N\'Dotré (Près de la Ferraille), Abidjan',
    rating: '4.8 ⭐ (94 avis)',
    specialty: 'Spécialiste Moteurs Venants & Injection',
    availability: 'Intervention à domicile possible',
    phone: '+225 05 04 03 02 01',
  },
  {
    id: 3,
    name: 'Garage Express Pikine',
    location: 'Pikine Technopole, Dakar',
    rating: '4.9 ⭐ (156 avis)',
    specialty: 'Diagnostic OBD2 & Électricité Auto',
    availability: 'Disponible sous 2h',
    phone: '+221 77 123 45 67',
  },
];

export default function DiagnosticEstimator() {
  const { locale } = useApp();
  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const [selectedSymptom, setSelectedSymptom] = useState<SymptomOption>(SYMPTOMS_DB[0]);
  const [selectedCondition, setSelectedCondition] = useState<'venant' | 'neuf'>('venant');
  const [booked, setBooked] = useState(false);

  return (
    <section className="py-12 md:py-18 bg-white border-y border-[var(--color-warm-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Titre de la section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
            <span>💡</span>
            {L('Estimateur de Devis & Panne Express', 'Instant Repair Quote & Diagnostic')}
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-[var(--color-warm-ink)]">
            {L('Calculez le prix de votre réparation en 30 secondes', 'Calculate your repair cost in 30 seconds')}
          </h2>
          <p className="mt-2 text-sm md:text-base text-[var(--color-warm-muted-strong)]">
            {L(
              'Transparence totale : découvrez le tarif estimé de la pièce (Venante ou Neuve) et la main d\'œuvre du Maître Garagiste certifié.',
              'Total transparency: view estimated part prices and certified master mechanic labor fees.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Colonne Gauche: Choix des symptômes */}
          <div className="lg:col-span-6 space-y-3">
            <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span>🔎</span> {L('Sélectionnez votre problème ou besoin :', 'Select your issue or need:')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SYMPTOMS_DB.map((symp) => {
                const active = selectedSymptom.id === symp.id;
                return (
                  <button
                    key={symp.id}
                    onClick={() => {
                      setSelectedSymptom(symp);
                      setBooked(false);
                    }}
                    className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                      active
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-md ring-2 ring-[var(--color-primary)]/20'
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50/50 hover:bg-gray-100/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{symp.icon}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
                          {symp.category}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                        {locale === 'fr' ? symp.titleFr : symp.titleEn}
                      </h4>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colonne Droite: Résultat du devis */}
          <div className="lg:col-span-6">
            <div className="bg-gradient-to-b from-gray-900 to-gray-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-800 relative overflow-hidden">
              
              {/* Badge d'en-tête */}
              <div className="flex items-center justify-between border-b border-gray-800 pb-5 mb-6">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                    {L('Estimation Devis Détaillé', 'Detailed Estimate')}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {selectedSymptom.icon} {locale === 'fr' ? selectedSymptom.titleFr : selectedSymptom.titleEn}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400">{L('Durée moyenne', 'Avg duration')}</span>
                  <div className="text-sm font-bold text-emerald-400">⏱️ {selectedSymptom.duration}</div>
                </div>
              </div>

              {/* Sélection Type de pièce */}
              <div className="mb-6">
                <label className="text-xs font-medium text-gray-300 block mb-2">
                  {L('Choisissez l\'état de la pièce souhaité :', 'Select desired part condition:')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedCondition('venant')}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs border transition-all text-center ${
                      selectedCondition === 'venant'
                        ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-900/50'
                        : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-750'
                    }`}
                  >
                    🔵 {L('Venant (Occasion)', 'Venant (Used)')}
                  </button>
                  <button
                    onClick={() => setSelectedCondition('neuf')}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs border transition-all text-center ${
                      selectedCondition === 'neuf'
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-900/50'
                        : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-750'
                    }`}
                  >
                    🟢 {L('Neuf (OEM)', 'New (OEM)')}
                  </button>
                </div>
              </div>

              {/* Détail financier */}
              <div className="bg-gray-800/80 rounded-2xl p-4 space-y-3 mb-6 border border-gray-700/60">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-gray-300 font-medium">
                    {L('Pièce recommandée :', 'Recommended Part:')}
                  </span>
                  <span className="font-bold text-white text-right max-w-[200px] truncate">
                    {locale === 'fr' ? selectedSymptom.partNameFr : selectedSymptom.partNameEn}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-gray-300 font-medium">
                    {L('Prix estimé pièce :', 'Est. part price:')}
                  </span>
                  <span className="font-bold text-amber-400">
                    {selectedCondition === 'venant' ? selectedSymptom.estimatedVenant : selectedSymptom.estimatedNeuf}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-gray-300 font-medium">
                    {L('Main d\'œuvre Garagiste :', 'Mechanic labor:')}
                  </span>
                  <span className="font-bold text-emerald-400">{selectedSymptom.laborCost}</span>
                </div>

                <div className="pt-3 border-t border-gray-700 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold text-gray-400 block uppercase">
                      {L('Garantie Incluse', 'Warranty Included')}
                    </span>
                    <span className="text-xs text-emerald-300 font-semibold">
                      🛡️ {L('Pièce ET Main d\'œuvre', 'Part AND Labor')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block uppercase">{L('Total Estimé', 'Total Est.')}</span>
                    <span className="text-lg font-extrabold text-white">
                      {selectedCondition === 'venant'
                        ? selectedSymptom.estimatedVenant.split('-')[0] + ' + ' + selectedSymptom.laborCost
                        : selectedSymptom.estimatedNeuf.split('-')[0] + ' + ' + selectedSymptom.laborCost}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sélection Garagiste Recommandé */}
              <div className="mb-6">
                <span className="text-xs font-semibold text-gray-400 block mb-2">
                  {L('Maîtres Garagistes affiliés à proximité :', 'Recommended Mechanics Nearby:')}
                </span>
                <div className="space-y-2">
                  {MECHANICS_DB.map((mec) => (
                    <div key={mec.id} className="p-2.5 rounded-xl bg-gray-800/50 border border-gray-700/50 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white">{mec.name}</div>
                        <div className="text-[11px] text-gray-400">{mec.location} • <span className="text-amber-400 font-semibold">{mec.rating}</span></div>
                      </div>
                      <span className="text-[10px] px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg font-bold">
                        {mec.availability}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Réservation */}
              {booked ? (
                <div className="p-4 rounded-2xl bg-emerald-900/60 border border-emerald-500 text-center space-y-2 animate-fade-in">
                  <div className="text-2xl">🎉</div>
                  <div className="text-sm font-bold text-emerald-200">
                    {L('Demande de Devis & RDV transmise !', 'Repair request submitted!')}
                  </div>
                  <p className="text-xs text-emerald-300">
                    {L(
                      'Un Maître Garagiste et le vendeur de la Ferraille vous contacteront sous 15 min par WhatsApp / Appel.',
                      'A Master Mechanic and Scrapyard vendor will contact you within 15 min on WhatsApp.'
                    )}
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => setBooked(true)}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-gray-950 font-extrabold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <span>📲</span>
                  {L('Valider ce devis & Réserver mon RDV', 'Validate quote & Book mechanic')}
                </button>
              )}

              <p className="text-[11px] text-gray-400 text-center mt-3">
                🔒 {L('Paiement sécurisé sur place / Mobile Money (Wave, Djamo, OM) après test.', 'Payment on site / Mobile Money (Wave, Djamo, OM) after test.')}
              </p>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
