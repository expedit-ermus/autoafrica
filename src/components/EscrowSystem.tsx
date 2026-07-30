'use client';
import { useState } from 'react';

interface Props {
  vehicleId: string;
  vehicleName: string;
  amount: number;
  buyerName: string;
  sellerName: string;
}

const statuses = [
  { key: 'created', label: 'Commande créée', icon: '📝', color: 'text-gray-500' },
  { key: 'funded', label: 'Paiement reçu', icon: '💰', color: 'text-blue-600' },
  { key: 'inspection', label: 'Période d\'inspection', icon: '🔍', color: 'text-yellow-600' },
  { key: 'released', label: 'Fonds libérés', icon: '✅', color: 'text-green-600' },
];

export default function EscrowSystem({ vehicleId, vehicleName, amount, buyerName, sellerName }: Props) {
  const [currentStatus, setCurrentStatus] = useState(0);
  const [disputeReason, setDisputeReason] = useState('');
  const [showDispute, setShowDispute] = useState(false);
  const [inspectionNotes, setInspectionNotes] = useState('');

  const formatCFA = (n: number) => new Intl.NumberFormat('fr-FR').format(n);

  const inspectionDeadline = new Date();
  inspectionDeadline.setDate(inspectionDeadline.getDate() + 7);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="bg-gray-900 p-5 text-white">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🛡️</span>
          <h3 className="font-bold">Séquestre (Escrow) AutoAfrique</h3>
        </div>
        <p className="text-gray-300 text-sm">Fonds sécurisés jusqu&apos;à validation de l&apos;inspection véhicule</p>
      </div>

      {/* Timeline */}
      <div className="p-5">
        <div className="relative">
          {statuses.map((s, i) => (
            <div key={s.key} className="flex items-start gap-4 mb-6 last:mb-0">
              <div className="relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                  i <= currentStatus ? 'bg-orange-100' : 'bg-gray-100'
                }`}>
                  {i < currentStatus ? '✓' : s.icon}
                </div>
                {i < statuses.length - 1 && (
                  <div className={`absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-8 ${
                    i < currentStatus ? 'bg-orange-300' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
              <div className="flex-1 pt-2">
                <p className={`text-sm font-bold ${i <= currentStatus ? 'text-gray-900' : 'text-gray-400'}`}>
                  {s.label}
                </p>
                {i === 0 && <p className="text-xs text-gray-500 mt-1">Commande #ESC-{vehicleId} créée</p>}
                {i === 1 && <p className="text-xs text-gray-500 mt-1">{formatCFA(amount)} FCFA reçus via Mobile Money</p>}
                {i === 2 && (
                  <div className="mt-2">
                    <p className="text-xs text-yellow-600 font-medium">
                      ⏰ Inspection avant le {inspectionDeadline.toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">7 jours pour inspecter le véhicule</p>
                  </div>
                )}
                {i === 3 && <p className="text-xs text-green-600 mt-1">Fonds versés au vendeur</p>}
              </div>
              {i === currentStatus && (
                <span className="badge badge-warning text-xs mt-3">En cours</span>
              )}
              {i < currentStatus && (
                <span className="badge badge-success text-xs mt-3">Terminé</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="px-5 pb-5 space-y-3">
        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Véhicule</span>
            <span className="font-medium">{vehicleName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Montant en séquestre</span>
            <span className="font-extrabold text-orange-600">{formatCFA(amount)} FCFA</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Acheteur</span>
            <span className="font-medium">{buyerName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Vendeur</span>
            <span className="font-medium">{sellerName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Référence</span>
            <span className="font-mono font-bold">ESC-{vehicleId}</span>
          </div>
        </div>

        {currentStatus === 2 && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes d&apos;inspection</label>
              <textarea value={inspectionNotes} onChange={(e) => setInspectionNotes(e.target.value)}
                className="input-field" rows={3} placeholder="Décrivez l'état du véhicule..." />
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowDispute(true); }}
                className="flex-1 px-4 py-3 rounded-xl border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50 transition">
                🚨 Signaler un problème
              </button>
              <button onClick={() => setCurrentStatus(3)}
                className="flex-1 btn-primary text-sm !py-3 text-center">
                ✓ Approuver le véhicule
              </button>
            </div>
          </div>
        )}

        {showDispute && (
          <div className="bg-red-50 rounded-xl p-4 space-y-3 border border-red-200">
            <p className="text-sm font-bold text-red-800">Signaler un problème</p>
            <select value={disputeReason} onChange={(e) => setDisputeReason(e.target.value)} className="input-field">
              <option value="">Sélectionnez un motif...</option>
              <option value="condition">État du véhicule différent de l&apos;annonce</option>
              <option value="documents">Documents manquants ou falsifiés</option>
              <option value="km">Kilométrage non conforme</option>
              <option value="damage">Dommages non déclarés</option>
              <option value="other">Autre</option>
            </select>
            <textarea className="input-field" rows={2} placeholder="Détails..." />
            <div className="flex gap-2">
              <button onClick={() => setShowDispute(false)} className="text-xs text-gray-500">Annuler</button>
              <button className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold">Envoyer la réclamation</button>
            </div>
          </div>
        )}

        {currentStatus < 2 && (
          <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700">
            💡 <strong>Séquestre AutoAfrique :</strong> Les fonds sont sécurisés jusqu&apos;à ce que l&apos;acheteur confirme la conformité du véhicule. En cas de litige, notre équipe de médiation intervient sous 48h.
          </div>
        )}
      </div>
    </div>
  );
}
