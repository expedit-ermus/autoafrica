'use client';
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';

const carMakes = [
  { id: 1, name: 'Toyota', popular: true },
  { id: 2, name: 'Hyundai', popular: true },
  { id: 3, name: 'Kia', popular: true },
  { id: 4, name: 'Peugeot', popular: true },
  { id: 5, name: 'Mercedes-Benz', popular: true },
  { id: 6, name: 'Renault', popular: true },
  { id: 7, name: 'Ford', popular: false },
  { id: 8, name: 'Volkswagen', popular: false },
  { id: 9, name: 'Nissan', popular: false },
  { id: 10, name: 'BMW', popular: false },
  { id: 11, name: 'Citroën', popular: false },
  { id: 12, name: 'Opel', popular: false },
];

const carModels: Record<number, { id: number; name: string }[]> = {
  1: [
    { id: 101, name: 'Hilux' },
    { id: 102, name: 'Corolla' },
    { id: 103, name: 'Land Cruiser' },
    { id: 104, name: 'RAV4' },
    { id: 105, name: 'Yaris' },
    { id: 106, name: 'Prado' },
  ],
  2: [
    { id: 201, name: 'Tucson' },
    { id: 202, name: 'Elantra' },
    { id: 203, name: 'Santa Fe' },
    { id: 204, name: 'Accent' },
    { id: 205, name: 'i10' },
  ],
  3: [
    { id: 301, name: 'Sportage' },
    { id: 302, name: 'Rio' },
    { id: 303, name: 'Sorento' },
    { id: 304, name: 'Cerato' },
  ],
  4: [
    { id: 401, name: '308' },
    { id: 402, name: '307' },
    { id: 403, name: '206' },
    { id: 404, name: '406' },
    { id: 405, name: 'Partner' },
  ],
  5: [
    { id: 501, name: 'Classe C' },
    { id: 502, name: 'Classe E' },
    { id: 503, name: 'ML' },
    { id: 504, name: 'GLA' },
  ],
  6: [
    { id: 601, name: 'Symbol' },
    { id: 602, name: 'Duster' },
    { id: 603, name: 'Clio' },
    { id: 604, name: 'Scénic' },
  ],
};

const carEngines: Record<number, { id: number; name: string }[]> = {
  101: [
    { id: 1001, name: '2.4L D-4D Diesel 150ch' },
    { id: 1002, name: '2.8L D-4D Diesel 204ch' },
    { id: 1003, name: '2.7L Turbo Diesel 177ch' },
  ],
  102: [
    { id: 1021, name: '1.6L VVT-i 122ch' },
    { id: 1022, name: '1.8L Valvematic 147ch' },
    { id: 1023, name: '2.0L D-4D Diesel 143ch' },
  ],
  201: [
    { id: 2001, name: '1.6L CRDi Diesel 136ch' },
    { id: 2002, name: '2.0L CRDi Diesel 185ch' },
    { id: 2003, name: '1.6L T-GDi 177ch' },
  ],
  301: [
    { id: 3001, name: '1.6L CRDi Diesel 136ch' },
    { id: 3002, name: '2.0L CRDi Diesel 185ch' },
    { id: 3003, name: '1.6L T-GDi 180ch' },
  ],
  401: [
    { id: 4001, name: '1.6L BlueHDi 100ch' },
    { id: 4002, name: '1.6L THP 165ch' },
    { id: 4003, name: '2.0L BlueHDi 150ch' },
  ],
  602: [
    { id: 6001, name: '1.5 dCi 110ch' },
    { id: 6002, name: '1.6 SCe 115ch' },
    { id: 6003, name: '1.5 dCi 90ch' },
  ],
};

export default function CarSelector() {
  const { locale } = useApp();
  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const [regNumber, setRegNumber] = useState('');
  const [selectedMake, setSelectedMake] = useState<number | null>(null);
  const [selectedModel, setSelectedModel] = useState<number | null>(null);
  const [selectedEngine, setSelectedEngine] = useState<number | null>(null);

  const availableModels = selectedMake ? carModels[selectedMake] || [] : [];
  const availableEngines = selectedModel ? carEngines[selectedModel] || [] : [];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-[#1E3A5F] p-6">
        <h3 className="text-white font-bold text-lg mb-1">
          {L('Trouvez les pièces pour votre véhicule', 'Find parts for your vehicle')}
        </h3>
        <p className="text-white/60 text-sm">
          {L('Recherchez par numéro d\'immatriculation ou sélectionnez votre modèle', 'Search by registration number or select your model')}
        </p>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {L('Numéro d\'immatriculation', 'Registration number')}
          </label>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-10 h-7 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">UE</span>
              </div>
              <input
                type="text"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
                placeholder="AB-123-CD"
                maxLength={12}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg text-lg font-mono uppercase focus:border-[#FF6B35] focus:outline-none transition-colors"
              />
            </div>
            <button className="px-6 py-3 bg-[#FF6B35] hover:bg-[#FF5520] text-white font-semibold rounded-lg transition-colors shadow-lg shadow-[#FF6B35]/25">
              {L('Rechercher', 'Search')}
            </button>
          </div>
        </div>

        <div className="relative flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-sm text-gray-400 font-medium">
            {L('ou sélectionnez votre modèle', 'or select your model')}
          </span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {L('Marque', 'Make')}
            </label>
            <select
              value={selectedMake || ''}
              onChange={(e) => {
                setSelectedMake(Number(e.target.value) || null);
                setSelectedModel(null);
                setSelectedEngine(null);
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-700 focus:border-[#FF6B35] focus:outline-none transition-colors appearance-none bg-white"
            >
              <option value="">{L('Choisissez une marque', 'Choose a make')}</option>
              <optgroup label={L('Populaires', 'Popular')}>
                {carMakes.filter((m) => m.popular).map((make) => (
                  <option key={make.id} value={make.id}>{make.name}</option>
                ))}
              </optgroup>
              <optgroup label={L('Toutes les marques', 'All makes')}>
                {carMakes.filter((m) => !m.popular).map((make) => (
                  <option key={make.id} value={make.id}>{make.name}</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {L('Modèle', 'Model')}
            </label>
            <select
              value={selectedModel || ''}
              onChange={(e) => {
                setSelectedModel(Number(e.target.value) || null);
                setSelectedEngine(null);
              }}
              disabled={!selectedMake}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-700 focus:border-[#FF6B35] focus:outline-none transition-colors appearance-none bg-white disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">{L('Choisissez un modèle', 'Choose a model')}</option>
              {availableModels.map((model) => (
                <option key={model.id} value={model.id}>{model.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {L('Motorisation', 'Engine')}
            </label>
            <select
              value={selectedEngine || ''}
              onChange={(e) => setSelectedEngine(Number(e.target.value) || null)}
              disabled={!selectedModel}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-700 focus:border-[#FF6B35] focus:outline-none transition-colors appearance-none bg-white disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">{L('Choisissez une motorisation', 'Choose an engine')}</option>
              {availableEngines.map((engine) => (
                <option key={engine.id} value={engine.id}>{engine.name}</option>
              ))}
            </select>
          </div>

          <button className="w-full px-6 py-3 bg-[#1E3A5F] hover:bg-[#2A4A6F] text-white font-semibold rounded-lg transition-colors shadow-lg">
            {L('Rechercher les pièces', 'Search parts')}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          {L('Vous ne trouvez pas votre voiture ?', 'Can\'t find your car?')}{' '}
          <a href="#" className="text-[#FF6B35] hover:underline font-medium">
            {L('Contactez-nous', 'Contact us')}
          </a>
        </p>
      </div>
    </div>
  );
}
