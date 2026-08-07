'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { track } from '@/lib/tracking';

interface Make {
  id: number;
  name: string;
  popular: boolean;
  icon: string;
}

const carMakes: Make[] = [
  { id: 1, name: 'Toyota', popular: true, icon: '🏎️' },
  { id: 4, name: 'Peugeot', popular: true, icon: '🦁' },
  { id: 2, name: 'Hyundai', popular: true, icon: '⚡' },
  { id: 3, name: 'Kia', popular: true, icon: '🇰🇷' },
  { id: 9, name: 'Nissan', popular: true, icon: '🚘' },
  { id: 6, name: 'Renault', popular: true, icon: '🚗' },
  { id: 14, name: 'Mitsubishi', popular: true, icon: '💎' },
  { id: 13, name: 'Suzuki', popular: true, icon: '🏍️' },
  { id: 5, name: 'Mercedes-Benz', popular: false, icon: '⭐' },
  { id: 7, name: 'Ford', popular: false, icon: '🔷' },
  { id: 8, name: 'Volkswagen', popular: false, icon: '⚙️' },
  { id: 10, name: 'BMW', popular: false, icon: '🔵' },
];

interface Model {
  id: number;
  makeId: number;
  name: string;
}

const carModelsList: Model[] = [
  // Toyota
  { id: 101, makeId: 1, name: 'Hilux' },
  { id: 102, makeId: 1, name: 'Corolla' },
  { id: 103, makeId: 1, name: 'Land Cruiser' },
  { id: 104, makeId: 1, name: 'RAV4' },
  { id: 105, makeId: 1, name: 'Yaris' },
  { id: 106, makeId: 1, name: 'Prado' },
  // Peugeot
  { id: 401, makeId: 4, name: '308' },
  { id: 402, makeId: 4, name: '307' },
  { id: 403, makeId: 4, name: '206' },
  { id: 404, makeId: 4, name: '406' },
  { id: 405, makeId: 4, name: 'Partner' },
  // Hyundai
  { id: 201, makeId: 2, name: 'Tucson' },
  { id: 202, makeId: 2, name: 'Elantra' },
  { id: 203, makeId: 2, name: 'Santa Fe' },
  { id: 204, makeId: 2, name: 'Accent' },
  { id: 205, makeId: 2, name: 'i10' },
  // Kia
  { id: 301, makeId: 3, name: 'Sportage' },
  { id: 302, makeId: 3, name: 'Rio' },
  { id: 303, makeId: 3, name: 'Sorento' },
  { id: 304, makeId: 3, name: 'Cerato' },
  // Renault
  { id: 601, makeId: 6, name: 'Symbol' },
  { id: 602, makeId: 6, name: 'Duster' },
  { id: 603, makeId: 6, name: 'Clio' },
  { id: 604, makeId: 6, name: 'Scénic' },
  { id: 605, makeId: 6, name: 'Logan' },
  // Nissan
  { id: 901, makeId: 9, name: 'Hardbody' },
  { id: 902, makeId: 9, name: 'Patrol' },
  { id: 903, makeId: 9, name: 'Qashqai' },
  { id: 904, makeId: 9, name: 'Almera' },
  // Mitsubishi
  { id: 1401, makeId: 14, name: 'L200' },
  { id: 1402, makeId: 14, name: 'Pajero' },
  { id: 1403, makeId: 14, name: 'Outlander' },
  // Suzuki
  { id: 1301, makeId: 13, name: 'Alto' },
  { id: 1302, makeId: 13, name: 'Swift' },
  { id: 1303, makeId: 13, name: 'Carry' },
  { id: 1304, makeId: 13, name: 'Desire' },
];

interface Engine {
  id: number;
  modelId: number;
  name: string;
}

const carEnginesList: Engine[] = [
  { id: 1001, modelId: 101, name: '2.4L D-4D Diesel 150ch' },
  { id: 1002, modelId: 101, name: '2.8L D-4D Diesel 204ch' },
  { id: 1021, modelId: 102, name: '1.6L VVT-i 122ch' },
  { id: 1022, modelId: 102, name: '1.8L Valvematic 147ch' },
  { id: 1023, modelId: 102, name: '2.0L D-4D Diesel 143ch' },
  { id: 2001, modelId: 201, name: '1.6L CRDi Diesel 136ch' },
  { id: 2002, modelId: 201, name: '2.0L CRDi Diesel 185ch' },
  { id: 3001, modelId: 301, name: '1.6L CRDi Diesel 136ch' },
  { id: 4001, modelId: 401, name: '1.6L BlueHDi 100ch' },
  { id: 4002, modelId: 402, name: '2.0L HDi Diesel 110ch' },
  { id: 6001, modelId: 602, name: '1.5 dCi 110ch' },
  { id: 9001, modelId: 901, name: '2.5L TD Diesel 133ch' },
  { id: 14001, modelId: 1401, name: '2.5L DI-D Diesel 136ch' },
];

export default function CarSelector() {
  const router = useRouter();
  const { locale } = useApp();
  const L = (fr: string, en: string) => (locale === 'fr' ? fr : en);

  const [regNumber, setRegNumber] = useState('');
  const [selectedMake, setSelectedMake] = useState<number | null>(null);
  const [selectedModel, setSelectedModel] = useState<number | null>(null);
  const [selectedEngine, setSelectedEngine] = useState<number | null>(null);

  const availableModels = selectedMake
    ? carModelsList.filter((m) => m.makeId === selectedMake)
    : carModelsList;

  const availableEngines = selectedModel
    ? carEnginesList.filter((e) => e.modelId === selectedModel)
    : carEnginesList;

  const handleMakeChange = (makeId: number | null) => {
    setSelectedMake(makeId);
    setSelectedModel(null);
    setSelectedEngine(null);
  };

  const handleModelChange = (modelId: number | null) => {
    setSelectedModel(modelId);
    if (modelId) {
      const modelObj = carModelsList.find((m) => m.id === modelId);
      if (modelObj && (!selectedMake || selectedMake !== modelObj.makeId)) {
        setSelectedMake(modelObj.makeId);
      }
    }
    setSelectedEngine(null);
  };

  const handleEngineChange = (engineId: number | null) => {
    setSelectedEngine(engineId);
    if (engineId) {
      const engineObj = carEnginesList.find((e) => e.id === engineId);
      if (engineObj) {
        const modelObj = carModelsList.find((m) => m.id === engineObj.modelId);
        if (modelObj) {
          setSelectedModel(modelObj.id);
          setSelectedMake(modelObj.makeId);
        }
      }
    }
  };

  const handleSearch = () => {
    const brandObj = carMakes.find((m) => m.id === selectedMake);
    const modelObj = carModelsList.find((m) => m.id === selectedModel);
    const brandName = brandObj ? brandObj.name : '';
    const modelName = modelObj ? modelObj.name : '';

    track('search_vehicle', { brand: brandName, model: modelName });

    if (brandName) {
      const slug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      router.push(`/catalogue/${slug}`);
    } else {
      router.push('/catalogue');
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      {/* En-tête du sélecteur */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-6 sm:py-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl border border-emerald-400/30">
            🚗
          </div>
          <div>
            <h2 className="font-extrabold text-xl sm:text-2xl text-white tracking-tight">
              {L('Trouvez les pièces de votre véhicule', 'Find your vehicle parts')}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              {L('Compatibilité garantie pour l\'Afrique de l\'Ouest', 'Guaranteed compatibility for West Africa')}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7 space-y-6">

        {/* Option 1 : Recherche par immatriculation */}
        <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
          <label htmlFor="regNumber" className="block text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-700 mb-2">
            {L('💡 Option 1 : Par immatriculation (CI / SN / ML)', 'Option 1: By registration')}
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="flex items-stretch flex-1 min-w-0">
              <div className="w-12 shrink-0 bg-blue-600 rounded-l-xl flex items-center justify-center font-bold text-white text-xs">
                CI / SN
              </div>
              <input
                id="regNumber"
                type="text"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
                placeholder="Ex: 1234-AB-01"
                maxLength={14}
                className="flex-1 min-w-0 px-4 py-3 border-2 border-l-0 border-slate-300 rounded-r-xl text-base font-mono uppercase bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleSearch}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer whitespace-nowrap"
            >
              {L('Rechercher', 'Search')}
            </button>
          </div>
        </div>

        {/* Séparateur visuel */}
        <div className="relative flex items-center gap-4 my-2">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap bg-white px-2">
            {L('ou choisissez votre modèle en 1-clic', 'or select your model in 1-click')}
          </span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        {/* Raccourcis Marques Populaires (Icons 1-clic) */}
        <div>
          <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
            {L('Marques les plus recherchées :', 'Popular makes:')}
          </span>
          <div className="flex flex-wrap gap-2">
            {carMakes.filter((m) => m.popular).map((make) => {
              const isSelected = selectedMake === make.id;
              return (
                <button
                  key={make.id}
                  type="button"
                  onClick={() => handleMakeChange(isSelected ? null : make.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200 scale-105'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50'
                  }`}
                >
                  <span>{make.icon}</span>
                  <span>{make.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grille Horizontale Ergonomique (3 colonnes sur desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200">
          
          {/* 1. Sélecteur Marque */}
          <div className="space-y-1.5">
            <label htmlFor="carMake" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
              {L('1. Marque', '1. Make')}
            </label>
            <div className="relative">
              <select
                id="carMake"
                value={selectedMake || ''}
                onChange={(e) => handleMakeChange(Number(e.target.value) || null)}
                className="w-full pl-4 pr-10 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-semibold text-slate-900 appearance-none focus:border-emerald-600 focus:outline-none cursor-pointer"
              >
                <option value="">{L('Toutes les marques...', 'All makes...')}</option>
                {carMakes.map((make) => (
                  <option key={make.id} value={make.id}>
                    {make.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* 2. Sélecteur Modèle */}
          <div className="space-y-1.5">
            <label htmlFor="carModel" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
              {L('2. Modèle', '2. Model')}
            </label>
            <div className="relative">
              <select
                id="carModel"
                value={selectedModel || ''}
                onChange={(e) => handleModelChange(Number(e.target.value) || null)}
                className="w-full pl-4 pr-10 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-semibold text-slate-900 appearance-none focus:border-emerald-600 focus:outline-none cursor-pointer"
              >
                <option value="">{L('Tous les modèles...', 'All models...')}</option>
                {availableModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} {!selectedMake ? `(${carMakes.find((m) => m.id === model.makeId)?.name})` : ''}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* 3. Sélecteur Motorisation */}
          <div className="space-y-1.5">
            <label htmlFor="carEngine" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
              {L('3. Motorisation', '3. Engine')}
            </label>
            <div className="relative">
              <select
                id="carEngine"
                value={selectedEngine || ''}
                onChange={(e) => handleEngineChange(Number(e.target.value) || null)}
                className="w-full pl-4 pr-10 py-3 bg-white border-2 border-slate-300 rounded-xl text-sm font-semibold text-slate-900 appearance-none focus:border-emerald-600 focus:outline-none cursor-pointer"
              >
                <option value="">{L('Toutes motorisations...', 'All engines...')}</option>
                {availableEngines.map((engine) => (
                  <option key={engine.id} value={engine.id}>
                    {engine.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

        </div>

        {/* Bouton de confirmation de recherche principal */}
        <button
          type="button"
          onClick={handleSearch}
          className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base sm:text-lg rounded-2xl transition-all shadow-lg shadow-emerald-950/20 cursor-pointer flex items-center justify-center gap-2 border border-emerald-400/30"
        >
          <span>🔍</span> {L('Rechercher les pièces compatibles', 'Search compatible parts')}
        </button>

        {/* Pied de composant réassurant */}
        <div className="text-center text-xs text-slate-500 font-medium pt-1">
          {L('Besoin d\'aide pour trouver votre pièce ?', 'Need help finding your part?')}{' '}
          <a href="/contact" className="text-emerald-700 hover:underline font-extrabold">
            {L('Assistance WhatsApp directe 💬', 'Direct WhatsApp Assistance 💬')}
          </a>
        </div>

      </div>
    </div>
  );
}
