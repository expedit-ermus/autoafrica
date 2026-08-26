'use client';

import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';

export default function WhatsAppQuickQuote() {
  const { locale } = useApp();
  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const [isOpen, setIsOpen] = useState(false);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [partName, setPartName] = useState('');
  const [commune, setCommune] = useState('Cocody');

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = '2250788000000';
    let text = `Bonjour AutoAfrique ! 🚗\nJe recherche une pièce détachée pour mon véhicule :\n\n`;
    if (brand) text += `• Marque : ${brand}\n`;
    if (model) text += `• Modèle : ${model}\n`;
    if (year) text += `• Année : ${year}\n`;
    if (partName) text += `• Pièce recherchée : ${partName}\n`;
    if (commune) text += `• Commune de livraison : ${commune} (Abidjan)\n`;
    text += `\nJe vous joins la photo de la pièce / carte grise. Pouvez-vous me donner le prix et la disponibilité ? Merci !`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleDirectWhatsApp = () => {
    const phone = '2250788000000';
    const text = `Bonjour AutoAfrique ! 🚗 Je recherche une pièce auto à Abidjan. Pouvez-vous m'aider avec un devis rapide ?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Floating WhatsApp Action Pill */}
      <div className="fixed bottom-6 left-6 z-40 hidden sm:flex flex-col items-start gap-2">
        <div className="flex items-center gap-2 group">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-extrabold rounded-full shadow-xl shadow-emerald-900/30 hover:scale-105 transition-all duration-300 border-2 border-white/20 cursor-pointer text-xs sm:text-sm"
            aria-label="Demande express de pièce auto sur WhatsApp"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping shrink-0" />
            <span className="text-base">💬</span>
            <span className="tracking-wide">
              {L('Pièce introuvable ? Devis WhatsApp', 'Need a part? WhatsApp Quote')}
            </span>
          </button>
        </div>
      </div>

      {/* Modal Quick Lead / Part Request */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Fermer"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl font-bold">
                💬
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-gray-900">
                  {L('Demande de pièce express sur WhatsApp', 'Express part request on WhatsApp')}
                </h3>
                <p className="text-xs text-gray-500">
                  {L('Réponse sous 15 min par nos experts à Abidjan', 'Reply within 15 min by our Abidjan experts')}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 mb-5 leading-relaxed bg-emerald-50 p-3.5 rounded-xl border border-emerald-100">
              💡 {L(
                'Indiquez votre véhicule et la pièce cherchée, notre équipe vérifiera les stocks neuf et occasion contrôlée en direct !',
                'Specify your vehicle and the part needed, our team will check new and tested used stock live!'
              )}
            </p>

            {/* Form */}
            <form onSubmit={handleSendWhatsApp} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {L('Marque *', 'Make *')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Toyota, Peugeot"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {L('Modèle *', 'Model *')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Corolla, 206, Tucson"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {L('Année du véhicule', 'Vehicle Year')}
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 2012"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {L('Commune (Abidjan)', 'Commune')}
                  </label>
                  <select
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Cocody">Cocody</option>
                    <option value="Yopougon">Yopougon</option>
                    <option value="Marcory">Marcory (Zone 4)</option>
                    <option value="Treichville">Treichville</option>
                    <option value="Adjamé">Adjamé</option>
                    <option value="Koumassi">Koumassi</option>
                    <option value="Abobo">Abobo</option>
                    <option value="Plateau">Plateau</option>
                    <option value="Port-Bouët">Port-Bouët</option>
                    <option value="Grand Abidjan (Bassam/Bingerville)">Grand Abidjan</option>
                    <option value="Intérieur (Gare routière)">Intérieur du pays</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {L('Pièce(s) recherchée(s) *', 'Part(s) needed *')}
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Ex: Alternateur, Amortisseurs avant, Rétroviseur gauche, Disques de frein..."
                  value={partName}
                  onChange={(e) => setPartName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <span>💬</span> {L('Ouvrir sur WhatsApp →', 'Open on WhatsApp →')}
                </button>
                <button
                  type="button"
                  onClick={handleDirectWhatsApp}
                  className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  {L('Discussion libre', 'Direct chat')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
