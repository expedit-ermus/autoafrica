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
    <div className="bg-white rounded-3xl shadow-xl shadow-[var(--color-earth)]/8 border border-[var(--color-warm-border)] overflow-hidden">
      <div className="bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-warm-navy-deep)] px-5 sm:px-7 pt-7 sm:pt-9 pb-5 sm:pb-7">
        <h2 className="text-white font-extrabold text-lg sm:text-xl mb-2">
          {L('Trouvez les pièces pour votre véhicule', 'Find parts for your vehicle')}
        </h2>
        <p className="text-white/85 text-sm sm:text-base">
          {L('Recherchez par immatriculation ou sélectionnez votre modèle', 'Search by registration or select your model')}
        </p>
      </div>

      <div className="p-5 sm:p-7">
        {/* Immatriculation */}
        <div className="mb-7">
          <label htmlFor="regNumber" className="block text-base font-bold text-[var(--color-warm-ink)] mb-2.5">
            {L('Numéro d\'immatriculation (Afrique de l\'Ouest)', 'Registration number')}
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-stretch flex-1 min-w-0">
              <div className="w-14 shrink-0 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white text-xs font-bold tracking-wide">CI / SN</span>
              </div>
              <input
                id="regNumber"
                type="text"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
                placeholder="AB-123-CD"
                maxLength={12}
                className="flex-1 min-w-0 px-4 py-3.5 border-2 border-l-0 border-[var(--color-warm-border)] rounded-r-xl rounded-l-none text-lg font-mono uppercase focus:border-[var(--color-primary)] focus:outline-none transition-colors text-[var(--color-warm-ink)] placeholder-[var(--color-warm-muted)]"
              />
            </div>
            <button
              type="button"
              onClick={handleSearch}
              className="shrink-0 px-5 sm:px-7 py-3.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-warm)] hover:from-[var(--color-orange-hover)] hover:to-[var(--color-primary-dark)] text-white font-bold rounded-xl transition-all shadow-lg shadow-[var(--color-primary)]/30 whitespace-nowrap cursor-pointer"
            >
              {L('Rechercher', 'Search')}
            </button>
          </div>
        </div>

        <div className="relative flex items-center gap-4 my-7">
          <div className="flex-1 h-px bg-[var(--color-warm-border)]"></div>
          <span className="text-sm text-[var(--color-warm-muted)] font-bold leading-none whitespace-nowrap">
            {L('ou sélectionnez votre modèle', 'or select your model')}
          </span>
          <div className="flex-1 h-px bg-[var(--color-warm-border)]"></div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="carMake" className="block text-base font-bold text-[var(--color-warm-ink)] mb-2.5">
              {L('1. Marque du véhicule', '1. Vehicle Make')}
            </label>
            <div className="relative">
              <select
                id="carMake"
                value={selectedMake || ''}
                onChange={(e) => handleMakeChange(Number(e.target.value) || null)}
                className="w-full pl-5 pr-10 py-3.5 border-2 border-[var(--color-warm-border)] rounded-xl text-gray-900 focus:border-orange-500 focus:outline-none transition-colors bg-white font-medium cursor-pointer appearance-none"
              >
                <option value="">{L('Choisissez une marque (ex: Toyota, Peugeot)', 'Choose a make')}</option>
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
            <label htmlFor="carModel" className="block text-base font-bold text-[var(--color-warm-ink)] mb-2.5">
              {L('2. Modèle de véhicule', '2. Vehicle Model')}
            </label>
            <div className="relative">
              <select
                id="carModel"
                value={selectedModel || ''}
                onChange={(e) => handleModelChange(Number(e.target.value) || null)}
                className="w-full pl-5 pr-10 py-3.5 border-2 border-[var(--color-warm-border)] rounded-xl text-gray-900 focus:border-orange-500 focus:outline-none transition-colors bg-white font-medium cursor-pointer appearance-none"
              >
                <option value="">{L('Choisissez un modèle (ex: Hilux, Corolla, 308)', 'Choose a model')}</option>
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
            <label htmlFor="carEngine" className="block text-base font-bold text-[var(--color-warm-ink)] mb-2.5">
              {L('3. Motorisation & Cylindrée', '3. Engine & Displacement')}
            </label>
            <div className="relative">
              <select
                id="carEngine"
                value={selectedEngine || ''}
                onChange={(e) => handleEngineChange(Number(e.target.value) || null)}
                className="w-full pl-5 pr-10 py-3.5 border-2 border-[var(--color-warm-border)] rounded-xl text-gray-900 focus:border-orange-500 focus:outline-none transition-colors bg-white font-medium cursor-pointer appearance-none"
              >
                <option value="">{L('Choisissez une motorisation (ex: 2.4L D-4D, 1.6L BlueHDi)', 'Choose an engine')}</option>
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
            className="w-full px-7 py-3.5 sm:py-4 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-xl transition-all shadow-lg shadow-orange-950/20 text-base sm:text-lg cursor-pointer flex items-center justify-center gap-2"
          >
            <span>🔍</span> {L('Rechercher les pièces compatibles', 'Search compatible parts')}
          </button>
        </div>

        <p className="text-center text-sm text-[var(--color-warm-muted)] mt-5 font-medium">
          {L('Vous ne trouvez pas votre véhicule ?', 'Can\'t find your vehicle?')}{' '}
          <Link href="/contact" className="text-orange-600 hover:underline font-bold">
            {L('Contactez-nous sur WhatsApp', 'Contact us on WhatsApp')}
          </Link>
        </p>
      </div>
    </div>
  );
}
