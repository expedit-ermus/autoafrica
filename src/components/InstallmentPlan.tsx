'use client';

interface InstallmentPlan {
  duration: number;
  downPayment: number;
  monthly: number;
  provider: string;
}

interface Props {
  vehicleName: string;
  vehiclePrice: number;
  onPlanSelected: (plan: InstallmentPlan) => void;
}

// Paiement en plusieurs fois : offre en cours de mise en place, aucune
// condition financière inventée n'est affichée (cf. DECISIONS.md D40) — les
// taux, frais et modalités seront communiqués avant la mise en production.
export default function InstallmentPlan({ vehicleName, vehiclePrice, onPlanSelected }: Props) {
  const formatCFA = (n: number) => new Intl.NumberFormat('fr-FR').format(n);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-5 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">📅</span>
          <div>
            <h3 className="font-bold">Paiement en Plusieurs fois</h3>
            <p className="text-purple-100 text-sm">Achetez maintenant, payez en plusieurs fois via Mobile Money</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm font-medium text-gray-700">{vehicleName}</p>
          <p className="text-xl font-extrabold text-orange-600">{formatCFA(vehiclePrice)} FCFA</p>
        </div>

        <div className="text-center py-10 text-gray-500 border border-dashed border-gray-200 rounded-xl bg-gray-50">
          <p className="text-3xl mb-2">📅</p>
          <p className="text-sm font-medium text-gray-700">
            Le paiement en plusieurs fois est en cours de mise en place
          </p>
          <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
            Les taux, l&apos;apport initial, les durées et les conditions seront communiqués avant la mise en production. Aucune condition financière n&apos;est affichée d&apos;ici là.
          </p>
        </div>

        <button onClick={() => onPlanSelected({ duration: 0, downPayment: 0, monthly: 0, provider: '' })}
          className="btn-primary w-full text-center !py-3">
          Valider le plan de paiement
        </button>
      </div>
    </div>
  );
}