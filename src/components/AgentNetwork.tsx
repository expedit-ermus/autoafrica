'use client';

// Réseau d'agents de dépôt : pas encore déployé, aucune donnée inventée
// (cf. DECISIONS.md D40) — les points de dépôt seront annoncés avant la
// mise en production.
export default function AgentNetwork() {
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

        {/* Honest status */}
        <div className="text-center py-8 text-gray-500 border border-dashed border-gray-200 rounded-xl bg-gray-50">
          <p className="text-3xl mb-2">🏪</p>
          <p className="text-sm font-medium text-gray-700">
            Le réseau d&apos;agents est en cours de déploiement
          </p>
          <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
            Les points de dépôt officiels et leurs coordonnées seront annoncés avant la mise en production. Aucun agent, aucune note et aucun numéro ne sont communiqués d&apos;ici là.
          </p>
        </div>
      </div>
    </div>
  );
}