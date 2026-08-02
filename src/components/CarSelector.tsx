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
    <div className="bg-white rounded-3xl shadow-xl shadow-[var(--color-earth)]/8 border border-[var(--color-warm-border)] overflow-hidden">
      <div className="bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-warm-navy-deep)] p-7">
        <h3 className="text-white font-extrabold text-xl mb-2">
          {L('Trouvez les pièces pour votre véhicule', 'Find parts for your vehicle')}
        </h3>
        <p className="text-white/65 text-base">
          {L('Recherchez par numéro d\'immatriculation ou sélectionnez votre modèle', 'Search by registration number or select your model')}
        </p>
      </div>

      <div className="p-7">
        <div className="mb-7">
          <label htmlFor="regNumber" className="block text-base font-bold text-[var(--color-warm-ink)] mb-2.5">
            {L('Numéro d\'immatriculation', 'Registration number')}
          </label>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-12 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white text-xs font-bold">CI</span>
              </div>
              <input
                id="regNumber"
                type="text"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
                placeholder="AB-123-CD"
                maxLength={12}
                className="flex-1 px-5 py-3.5 border-2 border-[var(--color-warm-border)] rounded-xl text-lg font-mono uppercase focus:border-[var(--color-primary)] focus:outline-none transition-colors text-[var(--color-warm-ink)] placeholder-[var(--color-warm-muted)]"
              />
            </div>
            <button className="px-7 py-3.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-warm)] hover:from-[var(--color-orange-hover)] hover:to-[var(--color-primary-dark)] text-white font-bold rounded-xl transition-all shadow-lg shadow-[var(--color-primary)]/30">
              {L('Rechercher', 'Search')}
            </button>
          </div>
        </div>

        <div className="relative flex items-center gap-4 my-7">
          <div className="flex-1 h-px bg-[var(--color-warm-border)]"></div>
          <span className="text-sm text-[var(--color-warm-muted)] font-bold">
            {L('ou sélectionnez votre modèle', 'or select your model')}
          </span>
          <div className="flex-1 h-px bg-[var(--color-warm-border)]"></div>
        </div>

        <div className="space-y-5">
          <div>
            <label htmlFor="carMake" className="block text-base font-bold text-[var(--color-warm-ink)] mb-2.5">
              {L('Marque', 'Make')}
            </label>
            <select
              id="carMake"
              value={selectedMake || ''}
              onChange={(e) => {
                setSelectedMake(Number(e.target.value) || null);
                setSelectedModel(null);
                setSelectedEngine(null);
              }}
              className="w-full px-5 py-3.5 border-2 border-[var(--color-warm-border)] rounded-xl text-[var(--color-warm-ink)] focus:border-[var(--color-primary)] focus:outline-none transition-colors appearance-none bg-white font-medium"
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
            <label htmlFor="carModel" className="block text-base font-bold text-[var(--color-warm-ink)] mb-2.5">
              {L('Modèle', 'Model')}
            </label>
            <select
              id="carModel"
              value={selectedModel || ''}
              onChange={(e) => {
                setSelectedModel(Number(e.target.value) || null);
                setSelectedEngine(null);
              }}
              disabled={!selectedMake}
              className="w-full px-5 py-3.5 border-2 border-[var(--color-warm-border)] rounded-xl text-[var(--color-warm-ink)] focus:border-[var(--color-primary)] focus:outline-none transition-colors appearance-none bg-white disabled:bg-[var(--color-bg-warm)] disabled:text-[var(--color-warm-muted)] font-medium"
            >
              <option value="">{L('Choisissez un modèle', 'Choose a model')}</option>
              {availableModels.map((model) => (
                <option key={model.id} value={model.id}>{model.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="carEngine" className="block text-base font-bold text-[var(--color-warm-ink)] mb-2.5">
              {L('Motorisation', 'Engine')}
            </label>
            <select
              id="carEngine"
              value={selectedEngine || ''}
              onChange={(e) => setSelectedEngine(Number(e.target.value) || null)}
              disabled={!selectedModel}
              className="w-full px-5 py-3.5 border-2 border-[var(--color-warm-border)] rounded-xl text-[var(--color-warm-ink)] focus:border-[var(--color-primary)] focus:outline-none transition-colors appearance-none bg-white disabled:bg-[var(--color-bg-warm)] disabled:text-[var(--color-warm-muted)] font-medium"
            >
              <option value="">{L('Choisissez une motorisation', 'Choose an engine')}</option>
              {availableEngines.map((engine) => (
                <option key={engine.id} value={engine.id}>{engine.name}</option>
              ))}
            </select>
          </div>

          <button className="w-full px-7 py-4 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary-light)] hover:from-[var(--color-secondary-light)] hover:to-[var(--color-secondary)] text-white font-bold rounded-xl transition-all shadow-lg text-lg">
            {L('Rechercher les pièces', 'Search parts')}
          </button>
        </div>

        <p className="text-center text-sm text-[var(--color-warm-muted)] mt-5 font-medium">
          {L('Vous ne trouvez pas votre voiture ?', 'Can\'t find your car?')}{' '}
          <a href="#" className="text-[var(--color-primary)] hover:underline font-bold">
            {L('Contactez-nous', 'Contact us')}
          </a>
        </p>
      </div>
    </div>
  );
}
