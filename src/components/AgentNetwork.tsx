'use client';
import { useState } from 'react';

interface Agent {
  id: string;
  name: string;
  location: string;
  city: string;
  country: string;
  supportedProviders: string[];
  operatingHours: string;
  rating: number;
  verified: boolean;
  distance?: string;
}

const mockAgents: Agent[] = [
  { id: 'a1', name: 'Point Pay Abidjan Plateau', location: 'Boulevard de la République', city: 'Abidjan', country: 'CI', supportedProviders: ['Orange Money', 'MTN MoMo', 'Wave', 'Moov'], operatingHours: '08:00 - 19:00', rating: 4.8, verified: true, distance: '0.5 km' },
  { id: 'a2', name: 'Kiosque Mobile Dakar Centre', location: 'Avenue Léopold Sédar Senghor', city: 'Dakar', country: 'SN', supportedProviders: ['Orange Money', 'Wave'], operatingHours: '07:30 - 20:00', rating: 4.6, verified: true, distance: '1.2 km' },
  { id: 'a3', name: 'Agence MTN Lagos Island', location: 'Broad Street, Lagos Island', city: 'Lagos', country: 'NG', supportedProviders: ['MTN MoMo'], operatingHours: '08:00 - 18:00', rating: 4.3, verified: true, distance: '3.1 km' },
  { id: 'a4', name: 'Wave Express Accra', location: 'Oxford Street, Osu', city: 'Accra', country: 'GH', supportedProviders: ['Wave', 'MTN MoMo'], operatingHours: '08:00 - 19:00', rating: 4.7, verified: true, distance: '0.8 km' },
  { id: 'a5', name: 'Centre Mobile Money Ouaga', location: 'Avenue Kwamé Nkrumah', city: 'Ouagadougou', country: 'BF', supportedProviders: ['Orange Money', 'Moov'], operatingHours: '07:00 - 18:30', rating: 4.4, verified: true, distance: '2.0 km' },
  { id: 'a6', name: 'Point C2C Bamako', location: 'Place de l\'Indépendance', city: 'Bamako', country: 'ML', supportedProviders: ['Orange Money', 'Moov'], operatingHours: '08:00 - 19:00', rating: 4.5, verified: true, distance: '1.5 km' },
];

export default function AgentNetwork() {
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const filtered = mockAgents.filter(a => {
    const matchSearch = `${a.name} ${a.location} ${a.city}`.toLowerCase().includes(search.toLowerCase());
    const matchCity = selectedCity === 'all' || a.city === selectedCity;
    const matchProvider = selectedProvider === 'all' || a.supportedProviders.includes(selectedProvider);
    return matchSearch && matchCity && matchProvider;
  });

  const cities = [...new Set(mockAgents.map(a => a.city))];
  const providers = [...new Set(mockAgents.flatMap(a => a.supportedProviders))];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-green-700 p-5 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🏪</span>
          <div>
            <h3 className="font-bold">Réseau d&apos;Agents AutoAfrique</h3>
            <p className="text-green-100 text-sm">Déposez votre paiement en espèces chez un agent agréé</p>
          </div>
        </div>
        <div className="flex gap-3 mt-3 text-xs">
          <span className="bg-white/20 px-3 py-1 rounded-full">📍 {mockAgents.length} agents</span>
          <span className="bg-white/20 px-3 py-1 rounded-full">🌍 {cities.length} villes</span>
          <span className="bg-white/20 px-3 py-1 rounded-full">✓ Vérifiés</span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* How it works */}
        <div className="bg-green-50 rounded-xl p-4">
          <p className="text-xs font-bold text-green-800 mb-2">Comment ça marche :</p>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { step: '1', label: 'Choisissez un agent' },
              { step: '2', label: 'Rendez-vous avec votre CNI' },
              { step: '3', label: 'Déposez les espèces' },
              { step: '4', label: 'Paiement crédité' },
            ].map(s => (
              <div key={s.step}>
                <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-bold text-xs mx-auto mb-1">{s.step}</div>
                <p className="text-[10px] text-green-700">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              className="input-field !pl-10" placeholder="Rechercher un agent..." />
          </div>
          <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="input-field !w-auto">
            <option value="all">Toutes les villes</option>
            {cities.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={selectedProvider} onChange={(e) => setSelectedProvider(e.target.value)} className="input-field !w-auto">
            <option value="all">Tous les moyens</option>
            {providers.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>

        {/* Agent list */}
        <div className="space-y-3">
          {filtered.map(agent => (
            <div key={agent.id}
              onClick={() => setSelectedAgent(selectedAgent?.id === agent.id ? null : agent)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedAgent?.id === agent.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-100 hover:border-gray-200 bg-white'
              }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-lg">🏪</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-900">{agent.name}</p>
                      {agent.verified && <span className="badge badge-success text-[10px]">✓ Vérifié</span>}
                    </div>
                    <p className="text-xs text-gray-500">📍 {agent.location}, {agent.city}</p>
                    <p className="text-xs text-gray-400 mt-0.5">🕐 {agent.operatingHours}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-yellow-500 text-xs">
                    ⭐ {agent.rating}
                  </div>
                  {agent.distance && <p className="text-xs text-gray-400 mt-1">{agent.distance}</p>}
                </div>
              </div>
              <div className="flex gap-2 mt-3 flex-wrap">
                {agent.supportedProviders.map(p => (
                  <span key={p} className="text-[10px] font-medium px-2 py-1 rounded-lg bg-gray-100 text-gray-600">{p}</span>
                ))}
              </div>

              {selectedAgent?.id === agent.id && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                  <div className="bg-green-50 rounded-xl p-3">
                    <p className="text-xs font-bold text-green-800 mb-2">Effectuer un dépôt ici :</p>
                    <div className="space-y-2">
                      <input className="input-field text-sm" placeholder="Numéro de téléphone" />
                      <input className="input-field text-sm" type="number" placeholder="Montant à déposer (FCFA)" />
                      <button className="btn-primary w-full text-sm !py-2.5 text-center">
                        Générer le code de dépôt
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 rounded-lg bg-green-100 text-green-700 text-xs font-semibold text-center">
                      📞 Appeler l&apos;agent
                    </button>
                    <button className="flex-1 px-3 py-2 rounded-lg bg-blue-100 text-blue-700 text-xs font-semibold text-center">
                      📍 Itinéraire
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-3xl mb-2">🏪</p>
            <p className="text-sm">Aucun agent trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}
