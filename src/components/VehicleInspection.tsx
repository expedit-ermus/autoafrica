'use client';
import { useState } from 'react';

interface Props {
  vehicleName: string;
  vehicleId: string;
}

const inspectionPoints = [
  { category: 'Moteur', items: ['État du moteur', 'Niveau d\'huile', 'Fuites', 'Courroies', 'Batterie'] },
  { category: 'Carrosserie', items: ['État général', 'Peinture', 'Rouilles', 'Chocs antérieurs', 'Portes et capot'] },
  { category: 'Intérieur', items: ['Habitacles', 'Tableau de bord', 'Climatisation', 'Système audio', 'Sièges'] },
  { category: 'Sûreté', items: ['Freins', 'Pneus', 'Suspension', 'Éclairage', 'Ceintures'] },
  { category: 'Documents', items: ['Carte grise', 'Contrôle technique', 'Assurance', 'Factures d\'entretien', 'Historique kilométrage'] },
];

export default function VehicleInspection({ vehicleName, vehicleId }: Props) {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  const category = inspectionPoints[selectedCategory];
  const totalItems = inspectionPoints.reduce((s, c) => s + c.items.length, 0);
  const ratedItems = Object.keys(ratings).length;
  const averageScore = ratedItems > 0
    ? (Object.values(ratings).reduce((s, r) => s + r, 0) / ratedItems).toFixed(1)
    : '-';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🔍</span>
          <div>
            <h3 className="font-bold">Certification d&apos;Inspection AutoAfrique</h3>
            <p className="text-emerald-100 text-sm">{vehicleName} • #{vehicleId}</p>
          </div>
        </div>
        <div className="flex gap-4 mt-3 text-xs">
          <span className="bg-white/20 px-3 py-1 rounded-full">{ratedItems}/{totalItems} vérifiés</span>
          <span className="bg-white/20 px-3 py-1 rounded-full">Score: {averageScore}/5</span>
        </div>
      </div>

      <div className="p-5">
        {/* Progress */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">Progression</span>
            <span className="text-xs font-bold text-gray-900">{Math.round(ratedItems / totalItems * 100)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all"
              style={{ width: `${ratedItems / totalItems * 100}%` }}></div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
          {inspectionPoints.map((cat, i) => {
            const catRated = cat.items.filter(item => ratings[`${cat.category}-${item}`]).length;
            return (
              <button key={cat.category} onClick={() => setSelectedCategory(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                  selectedCategory === i
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {cat.category}
                {catRated === cat.items.length && catRated > 0 && <span>✓</span>}
              </button>
            );
          })}
        </div>

        {/* Items */}
        <div className="space-y-3">
          {category.items.map(item => {
            const key = `${category.category}-${item}`;
            const currentRating = ratings[key] || 0;
            return (
              <div key={item} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{item}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => setRatings({ ...ratings, [key]: star })}
                        className={`text-lg transition ${star <= currentRating ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  aria-label="Notes d'inspection"
                  value={notes[key] || ''}
                  onChange={(e) => setNotes({ ...notes, [key]: e.target.value })}
                  className="input-field text-xs" rows={2}
                  placeholder="Notes (optionnel)..." />
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-5 bg-emerald-50 rounded-xl p-4">
          <p className="text-xs font-bold text-emerald-800 mb-2">📋 Résumé de l&apos;inspection</p>
          <div className="grid grid-cols-5 gap-2 text-center">
            {inspectionPoints.map((cat) => {
              const catItems = cat.items.map(item => ratings[`${cat.category}-${item}`] || 0);
              const catAvg = catItems.some(v => v > 0)
                ? (catItems.filter(v => v > 0).reduce((s, v) => s + v, 0) / catItems.filter(v => v > 0).length).toFixed(1)
                : '-';
              return (
                <div key={cat.category}>
                  <p className="text-lg font-extrabold text-emerald-600">{catAvg}</p>
                  <p className="text-[10px] text-gray-500">{cat.category}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Certification badge */}
        {ratedItems >= totalItems * 0.8 && (
          <div className="mt-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-4 text-center">
            <p className="text-3xl mb-2">🏆</p>
            <p className="font-bold text-white">Véhicule Certifié AutoAfrique</p>
            <p className="text-xs text-yellow-100">Score global: {averageScore}/5 - Inspecté et vérifié</p>
          </div>
        )}

        <button className="mt-4 btn-primary w-full text-center !py-3">
          Enregistrer l&apos;inspection
        </button>
      </div>
    </div>
  );
}
