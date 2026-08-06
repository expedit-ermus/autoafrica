'use client';

// Paiements transfrontaliers : service en cours de mise en place, aucune
// condition inventée (frais, taux, PAPSS, 1:1 UEMOA) n'est affichée
// (cf. DECISIONS.md D40) — les modalités seront confirmées avant la mise en
// production.
export default function CrossBorderPayments() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🌍</span>
          <div>
            <h3 className="font-bold">Paiements Transfrontaliers</h3>
            <p className="text-blue-100 text-sm">Envoyez et recevez des paiements en Afrique de l&apos;Ouest</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="text-center py-10 text-gray-500 border border-dashed border-gray-200 rounded-xl bg-gray-50">
          <p className="text-3xl mb-2">🌍</p>
          <p className="text-sm font-medium text-gray-700">
            Le service transfrontalier est en cours de mise en place
          </p>
          <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
            Les pays couverts, les frais, les taux de change et les zones d&apos;envoi seront confirmés avant la mise en production. Aucune condition n&apos;est affichée d&apos;ici là.
          </p>
        </div>
      </div>
    </div>
  );
}