'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { track } from '@/lib/tracking';

interface Make {
  id: number;
  name: string;
  popular: boolean;
}

const carMakes: Make[] = [
  { id: 1, name: 'Toyota', popular: true },
  { id: 4, name: 'Peugeot', popular: true },
  { id: 2, name: 'Hyundai', popular: true },
  { id: 3, name: 'Kia', popular: true },
  { id: 14, name: 'Mitsubishi', popular: true },
  { id: 9, name: 'Nissan', popular: true },
  { id: 6, name: 'Renault', popular: true },
  { id: 15, name: 'Dacia', popular: true },
  { id: 13, name: 'Suzuki', popular: true },
  { id: 5, name: 'Mercedes-Benz', popular: false },
  { id: 7, name: 'Ford', popular: false },
  { id: 8, name: 'Volkswagen', popular: false },
  { id: 10, name: 'BMW', popular: false },
  { id: 11, name: 'Citroën', popular: false },
  { id: 12, name: 'Opel', popular: false },
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

  // Modèles filtrés par marque si choisie, sinon tous les modèles
  const availableModels = selectedMake
    ? carModelsList.filter((m) => m.makeId === selectedMake)
    : carModelsList;

  // Motorisations filtrées par modèle si choisi, sinon toutes les motorisations
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
    // 1. Recherche par immatriculation ou numéro de châssis (VIN)
    if (regNumber.trim()) {
      const cleanInput = regNumber.trim().toUpperCase();
      track('search_vehicle_registration', { query: cleanInput });

      // Détection automatique du constructeur par préfixe WMI (VIN 17 caractères)
      if (cleanInput.length === 17) {
        if (cleanInput.startsWith('JT')) {
          router.push('/marques/toyota');
          return;
        } else if (cleanInput.startsWith('VF3')) {
          router.push('/marques/peugeot');
          return;
        } else if (cleanInput.startsWith('KMH')) {
          router.push('/marques/hyundai');
          return;
        } else if (cleanInput.startsWith('VF1')) {
          router.push('/marques/renault');
          return;
        } else if (cleanInput.startsWith('JN')) {
          router.push('/marques/nissan');
          return;
        }
      }

      router.push(`/catalogue?search=${encodeURIComponent(cleanInput)}`);
      return;
    }

    // 2. Recherche par Marque / Modèle
    const brandObj = carMakes.find((m) => m.id === selectedMake);
    const modelObj = carModelsList.find((m) => m.id === selectedModel);
    const brandName = brandObj ? brandObj.name : '';
    const modelName = modelObj ? modelObj.name : '';

    track('search_vehicle', { brand: brandName, model: modelName });

    if (brandName && modelName) {
      router.push(`/catalogue?brand=${encodeURIComponent(brandName)}&model=${encodeURIComponent(modelName)}`);
    } else if (brandName) {
      const slug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      router.push(`/marques/${slug}`);
    } else {
      router.push('/catalogue');
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-200/80 overflow-hidden">
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-6 py-6 sm:py-7 text-white border-b border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-orange-400">Sélecteur Rapide</span>
        </div>
        <h2 className="text-white font-black text-lg sm:text-xl tracking-tight">
          {L('Trouvez les pièces pour votre véhicule', 'Find parts for your vehicle')}
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          {L('Par immatriculation ou modèle (Toyota, Peugeot...)', 'By registration or model (Toyota, Peugeot...)')}
        </p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="p-6 sm:p-7">
        {/* Immatriculation */}
        <div className="mb-6">
          <label htmlFor="regNumber" className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
            {L('Numéro d\'immatriculation (Côte d\'Ivoire / Sénégal)', 'Registration number (CI / SN)')}
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="flex items-stretch flex-1 min-w-0 shadow-inner rounded-2xl overflow-hidden border-2 border-slate-200 focus-within:border-orange-500 transition-all">
              <div className="w-16 shrink-0 bg-blue-700 flex flex-col items-center justify-center text-white px-2 py-1 select-none">
                <span className="text-[9px] font-black tracking-widest opacity-80">CI / SN</span>
                <span className="text-sm">🚗</span>
              </div>
              <input
                id="regNumber"
                type="text"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
                placeholder="1234-AB-01"
                maxLength={14}
                className="flex-1 min-w-0 px-4 py-3 text-base sm:text-lg font-mono font-bold uppercase focus:outline-none bg-slate-50/50 text-slate-900 placeholder-slate-400"
              />
            </div>
            <button
              type="button"
              onClick={handleSearch}
              className="shrink-0 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm rounded-2xl transition-all shadow-md shadow-orange-500/20 whitespace-nowrap cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              {L('Valider', 'Submit')}
            </button>
          </div>
        </div>

        <div className="relative flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap">
            {L('ou par modèle précis', 'or by specific model')}
          </span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        <div className="space-y-3.5">
          <div>
            <label htmlFor="carMake" className="block text-xs font-bold text-slate-700 mb-1.5">
              {L('1. Constructeur automobile', '1. Vehicle Make')}
            </label>
            <div className="relative">
              <select
                id="carMake"
                value={selectedMake || ''}
                onChange={(e) => handleMakeChange(Number(e.target.value) || null)}
                className="w-full pl-4 pr-10 py-3 border-2 border-slate-200 rounded-2xl text-slate-900 font-bold text-sm focus:border-orange-500 focus:outline-none transition-colors bg-slate-50/60 cursor-pointer appearance-none"
              >
                <option value="">{L('Sélectionner une marque (ex: Toyota, Peugeot)', 'Select a make')}</option>
                <optgroup label={L('Populaires en Afrique de l\'Ouest', 'Popular in West Africa')}>
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
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-orange-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="carModel" className="block text-xs font-bold text-slate-700 mb-1.5">
              {L('2. Modèle de véhicule', '2. Vehicle Model')}
            </label>
            <div className="relative">
              <select
                id="carModel"
                value={selectedModel || ''}
                onChange={(e) => handleModelChange(Number(e.target.value) || null)}
                className="w-full pl-4 pr-10 py-3 border-2 border-slate-200 rounded-2xl text-slate-900 font-bold text-sm focus:border-orange-500 focus:outline-none transition-colors bg-slate-50/60 cursor-pointer appearance-none"
              >
                <option value="">{L('Sélectionner un modèle (ex: Hilux, Corolla, 308)', 'Select a model')}</option>
                {availableModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} {!selectedMake ? `(${carMakes.find(m => m.id === model.makeId)?.name})` : ''}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-orange-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="carEngine" className="block text-xs font-bold text-slate-700 mb-1.5">
              {L('3. Motorisation', '3. Engine')}
            </label>
            <div className="relative">
              <select
                id="carEngine"
                value={selectedEngine || ''}
                onChange={(e) => handleEngineChange(Number(e.target.value) || null)}
                className="w-full pl-4 pr-10 py-3 border-2 border-slate-200 rounded-2xl text-slate-900 font-bold text-sm focus:border-orange-500 focus:outline-none transition-colors bg-slate-50/60 cursor-pointer appearance-none"
              >
                <option value="">{L('Motorisation (ex: 2.4L D-4D, 1.6L BlueHDi)', 'Engine (optional)')}</option>
                {availableEngines.map((engine) => (
                  <option key={engine.id} value={engine.id}>{engine.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-orange-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSearch}
            className="w-full mt-2 px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black rounded-2xl transition-all shadow-lg shadow-orange-500/25 text-sm uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.98]"
          >
            <span>🔍</span> {L('Voir les pièces compatibles', 'View compatible parts')}
          </button>
        </div>

        <p className="text-center text-xs text-slate-500 mt-4 font-medium">
          {L('Besoin d\'aide pour trouver une pièce rare ?', 'Need help finding a rare part?')}{' '}
          <Link href="/contact" className="text-orange-600 hover:text-orange-700 font-bold underline">
            {L('Conseiller WhatsApp', 'WhatsApp Advisor')}
          </Link>
        </p>
      </form>
    </div>
  );
}
