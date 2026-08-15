'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';
const Truck = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h2"/><path d="M14 17h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>;
const MapPin = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const Package = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>;
const Clock = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const ShieldCheck = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-3 4-3h6s2 2 4 3a1 1 0 0 1 1 1v7Z"/><path d="m9 12 2 2 4-4"/></svg>;
const CheckCircle2 = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>;
const ChevronDown = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;
const Phone = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const MapIcon = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg>;
const Navigation = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>;
const ArrowRight = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;

export default function LivraisonPage() {
  const { locale } = useApp();
  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const [selectedCity, setSelectedCity] = useState<string>('');

  const cities = [
    { name: L('Abidjan', 'Abidjan'), delay: '24h', carrier: L('Livreur Express Moto (Tiak-Tiak)', 'Express Motorcycle Delivery'), price: '1,500 - 3,000 FCFA' },
    { name: L('Bouaké', 'Bouaké'), delay: '24-48h', carrier: L('Gare Routière (UTB)', 'Bus Station (UTB)'), price: '2,500 - 4,000 FCFA' },
    { name: L('Yamoussoukro', 'Yamoussoukro'), delay: '24h', carrier: L('Gare Routière', 'Bus Station'), price: '2,000 - 3,500 FCFA' },
    { name: L('San Pedro', 'San Pedro'), delay: '48h', carrier: L('Transport Routier', 'Road Transport'), price: '4,000 - 6,000 FCFA' },
    { name: L('Dakar', 'Dakar'), delay: '24h', carrier: L('Livreur Express Moto (Tiak-Tiak)', 'Express Motorcycle Delivery'), price: '1,500 - 3,000 FCFA' },
    { name: L('Thiès', 'Thiès'), delay: '24-48h', carrier: L('Gare Routière (7 Places)', 'Bus Station (7 Places)'), price: '2,000 - 4,000 FCFA' },
    { name: L('Bamako', 'Bamako'), delay: '48-72h', carrier: L('Transit Sous-Régional (UEMOA)', 'Sub-Regional Transit (WAEMU)'), price: L('Sur devis', 'On Quote') },
    { name: L('Ouagadougou', 'Ouagadougou'), delay: '48-72h', carrier: L('Transit Sous-Régional (UEMOA)', 'Sub-Regional Transit (WAEMU)'), price: L('Sur devis', 'On Quote') },
    { name: L('Niamey', 'Niamey'), delay: '72h', carrier: L('Transit Sous-Régional (UEMOA)', 'Sub-Regional Transit (WAEMU)'), price: L('Sur devis', 'On Quote') },
    { name: L('Cotonou', 'Cotonou'), delay: '48-72h', carrier: L('Transit Sous-Régional (CEDEAO)', 'Sub-Regional Transit (ECOWAS)'), price: L('Sur devis', 'On Quote') },
    { name: L('Lomé', 'Lomé'), delay: '48-72h', carrier: L('Transit Sous-Régional (CEDEAO)', 'Sub-Regional Transit (ECOWAS)'), price: L('Sur devis', 'On Quote') }
  ];

  const selectedCityData = cities.find(c => c.name === selectedCity);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-[var(--color-warm-navy)] text-white pt-24 pb-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-transparent pointer-events-none"></div>
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold text-sm mb-6 border border-[var(--color-primary)]/20 shadow-sm">
            <Clock className="w-4 h-4" />
            {L('Livraison 24-72h', '24-72h Delivery')}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
            {L('Expédition & Livraison en ', 'Shipping & Delivery in ')}
            <span className="text-[var(--color-primary)]">{L('Afrique de l\'Ouest', 'West Africa')}</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            {L('Recevez vos pièces auto rapidement et en toute sécurité, où que vous soyez dans la sous-région.', 'Receive your auto parts quickly and securely, wherever you are in the sub-region.')}
          </p>
        </div>
      </section>

      {/* Delivery Modes Cards */}
      <section className="max-w-7xl mx-auto px-4 -mt-16 relative z-20 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mode 1 */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col items-start transition-transform hover:-translate-y-1 duration-300">
            <div className="bg-orange-100 p-4 rounded-2xl mb-6">
              <Package className="w-8 h-8 text-[var(--color-primary)]" />
            </div>
            <h3 className="text-2xl font-extrabold text-[var(--color-secondary)] mb-3">
              {L('Livreur Express Moto', 'Express Motorcycle Delivery')}
            </h3>
            <p className="text-gray-600 mb-6 flex-grow">
              {L('Idéal pour les livraisons intra-urbaines rapides via les services locaux (Tiak-Tiak, coursiers).', 'Ideal for fast intra-city deliveries via local services.')}
            </p>
            <ul className="space-y-3 w-full border-t border-gray-100 pt-6">
              <li className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                <MapPin className="w-4 h-4 text-gray-400" /> {L('Abidjan & Dakar', 'Abidjan & Dakar')}
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                <Clock className="w-4 h-4 text-[var(--color-primary)]" /> {L('Moins de 24h', 'Under 24h')}
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs font-bold">$</div>
                {L('1,500 à 3,000 FCFA', '1,500 to 3,000 FCFA')}
              </li>
            </ul>
          </div>

          {/* Mode 2 */}
          <div className="bg-[var(--color-warm-navy)] rounded-3xl p-8 shadow-xl flex flex-col items-start text-white transition-transform hover:-translate-y-1 duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[var(--color-primary)] text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              {L('Populaire', 'Popular')}
            </div>
            <div className="bg-white/10 p-4 rounded-2xl mb-6">
              <Truck className="w-8 h-8 text-[var(--color-primary)]" />
            </div>
            <h3 className="text-2xl font-extrabold mb-3">
              {L('Expédition Gare Routière', 'Bus Station Shipping')}
            </h3>
            <p className="text-gray-300 mb-6 flex-grow">
              {L('Envoi interurbain via les compagnies de transport reconnues (UTB, STC, 7 Places).', 'Inter-city shipping via recognized transport companies (UTB, STC).')}
            </p>
            <ul className="space-y-3 w-full border-t border-white/10 pt-6">
              <li className="flex items-center gap-3 text-sm text-gray-200 font-medium">
                <MapPin className="w-4 h-4 text-gray-400" /> {L('Bouaké, Korhogo, Saint-Louis...', 'Bouaké, Korhogo, Saint-Louis...')}
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-200 font-medium">
                <Clock className="w-4 h-4 text-[var(--color-primary)]" /> {L('24 à 48h', '24 to 48h')}
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-200 font-medium">
                <div className="w-4 h-4 rounded-full bg-green-900/50 flex items-center justify-center text-green-400 text-xs font-bold">$</div>
                {L('2,500 à 5,000 FCFA', '2,500 to 5,000 FCFA')}
              </li>
            </ul>
          </div>

          {/* Mode 3 */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col items-start transition-transform hover:-translate-y-1 duration-300">
            <div className="bg-blue-100 p-4 rounded-2xl mb-6">
              <MapIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-extrabold text-[var(--color-secondary)] mb-3">
              {L('Fret & Transit Régional', 'Regional Freight & Transit')}
            </h3>
            <p className="text-gray-600 mb-6 flex-grow">
              {L('Transport de pièces lourdes ou volumineuses à travers les frontières sous-régionales.', 'Transport of heavy or bulky parts across sub-regional borders.')}
            </p>
            <ul className="space-y-3 w-full border-t border-gray-100 pt-6">
              <li className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                <MapPin className="w-4 h-4 text-gray-400" /> {L('Espace UEMOA / CEDEAO', 'WAEMU / ECOWAS Zone')}
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                <Clock className="w-4 h-4 text-[var(--color-primary)]" /> {L('48 à 72h', '48 to 72h')}
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-bold">!</div>
                {L('Tarification sur mesure', 'Custom pricing')}
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Interactive City Coverage & Delay Checker */}
      <section className="bg-white py-20 border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-[var(--color-secondary)] mb-4">
            {L('Vérifiez les délais pour votre ville', 'Check delays for your city')}
          </h2>
          <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
            {L('Sélectionnez votre destination pour connaître les options de transport et les délais d\'acheminement estimés.', 'Select your destination to see transport options and estimated delivery times.')}
          </p>

          <div className="bg-gray-50 p-6 md:p-10 rounded-3xl border border-gray-200">
            <div className="relative max-w-md mx-auto mb-8 text-left">
              <label className="block text-sm font-semibold text-[var(--color-secondary)] mb-2">
                {L('Choisissez votre ville de destination', 'Choose your destination city')}
              </label>
              <div className="relative">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-xl py-4 pl-5 pr-12 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent cursor-pointer shadow-sm"
                >
                  <option value="">{L('-- Sélectionner une ville --', '-- Select a city --')}</option>
                  {cities.map(city => (
                    <option key={city.name} value={city.name}>{city.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5" />
              </div>
            </div>

            {selectedCityData && (
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Navigation className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-lg font-bold text-[var(--color-secondary)]">{selectedCityData.name}</h4>
                    <p className="text-sm text-gray-500">{selectedCityData.carrier}</p>
                  </div>
                </div>
                
                <div className="w-full md:w-px md:h-12 bg-gray-200 hidden md:block"></div>
                
                <div className="flex w-full md:w-auto justify-between md:justify-end md:gap-8 items-center border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                  <div className="text-center md:text-right">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">{L('Délai estimé', 'Estimated Delay')}</p>
                    <p className="font-bold text-[var(--color-secondary)] flex items-center justify-center md:justify-end gap-1">
                      <Clock className="w-4 h-4 text-[var(--color-primary)]" />
                      {selectedCityData.delay}
                    </p>
                  </div>
                  <div className="text-center md:text-right">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">{L('Tarif indicatif', 'Indicative Rate')}</p>
                    <p className="font-bold text-gray-800">{selectedCityData.price}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tracking & Inspection Guide */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-[var(--color-secondary)] mb-6">
                {L('Guide de réception du colis', 'Parcel Reception Guide')}
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                {L('Pour garantir votre satisfaction, veuillez toujours vérifier ces éléments avant de signer le bon de livraison ou de payer le livreur.', 'To guarantee your satisfaction, always check these items before signing the delivery note or paying the driver.')}
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{L('Vérifiez l\'emballage', 'Check the packaging')}</h4>
                    <p className="text-gray-600 text-sm">{L('Assurez-vous que le carton ou l\'emballage n\'est pas déchiré, ouvert ou endommagé.', 'Make sure the box or packaging is not torn, opened, or damaged.')}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{L('Conformité de la pièce', 'Part conformity')}</h4>
                    <p className="text-gray-600 text-sm">{L('Ouvrez le colis et vérifiez que la pièce correspond exactement à votre commande (référence, état).', 'Open the package and check that the part matches exactly your order (reference, condition).')}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <ShieldCheck className="w-6 h-6 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{L('En cas de problème', 'In case of a problem')}</h4>
                    <p className="text-gray-600 text-sm">{L('Refusez la livraison si la pièce est abîmée ou incorrecte, et contactez immédiatement notre service client.', 'Refuse delivery if the part is damaged or incorrect, and immediately contact our customer service.')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-warm-navy)] rounded-[2.5rem] transform rotate-3 opacity-20"></div>
              <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl relative z-10 border border-gray-100">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                  <Phone className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-secondary)] mb-4">
                  {L('Besoin d\'assistance pour une livraison en cours ?', 'Need assistance with an ongoing delivery?')}
                </h3>
                <p className="text-gray-600 mb-8">
                  {L('Notre équipe de support client est disponible pour suivre votre commande et vous assister.', 'Our customer support team is available to track your order and assist you.')}
                </p>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center justify-center w-full py-4 px-6 bg-[var(--color-warm-navy)] text-white rounded-xl font-bold hover:bg-blue-900 transition-colors"
                >
                  {L('Contacter le support', 'Contact Support')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[var(--color-primary)] text-white py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold mb-6">
            {L('Prêt à commander vos pièces auto ?', 'Ready to order your auto parts?')}
          </h2>
          <p className="text-orange-100 text-lg mb-8 max-w-xl mx-auto">
            {L('Trouvez ce dont vous avez besoin dans notre catalogue et choisissez l\'option de livraison qui vous convient.', 'Find what you need in our catalog and choose the delivery option that suits you.')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/catalogue" 
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white text-[var(--color-primary)] font-bold rounded-xl shadow-lg hover:bg-gray-50 transition-colors gap-2"
            >
              {L('Explorer le catalogue', 'Explore the Catalog')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
