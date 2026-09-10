'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type Etat = 'chargement' | 'confirme' | 'en-attente' | 'echoue' | 'introuvable';

/**
 * Retour depuis la page de paiement de l'operateur.
 *
 * L'acheteur peut revenir ici avant que la notification n'ait ete traitee : le
 * retour navigateur ne prouve rien, seul l'etat en base fait foi. Tant que le
 * paiement n'est pas COMPLETED, la page dit qu'il est en cours de confirmation
 * — jamais qu'il a reussi.
 */
export default function RetourPaiementContenu() {
  const params = useSearchParams();
  const paiementId = params.get('paiement');

  // Deduit au rendu, pas dans un effet : l'absence d'identifiant est connue des
  // le premier rendu, la poser dans useEffect provoquerait un rendu en cascade.
  const [etat, setEtat] = useState<Etat>(paiementId ? 'chargement' : 'introuvable');
  const [montant, setMontant] = useState<{ valeur: number; devise: string } | null>(null);
  const [tentatives, setTentatives] = useState(0);

  useEffect(() => {
    if (!paiementId) return;

    let annule = false;

    const interroger = async () => {
      try {
        const res = await fetch(`/api/v1/payments/${encodeURIComponent(paiementId)}`, {
          credentials: 'include',
          cache: 'no-store',
        });
        if (annule) return;

        if (!res.ok) {
          setEtat('introuvable');
          return;
        }

        const corps = await res.json();
        const paiement = corps?.data ?? corps;
        setMontant({ valeur: paiement?.amount ?? 0, devise: paiement?.currency ?? 'XOF' });

        if (paiement?.status === 'COMPLETED') setEtat('confirme');
        else if (paiement?.status === 'FAILED' || paiement?.status === 'CANCELLED') setEtat('echoue');
        else setEtat('en-attente');
      } catch {
        if (!annule) setEtat('en-attente');
      }
    };

    interroger();
    return () => {
      annule = true;
    };
  }, [paiementId, tentatives]);

  // Relance manuelle plutot qu'un rechargement automatique : l'acheteur garde
  // la main, et un reseau instable ne declenche pas une rafale de requetes.
  const relancer = () => {
    setEtat('chargement');
    setTentatives((n) => n + 1);
  };

  const somme = montant ? `${montant.valeur.toLocaleString('fr-FR')} ${montant.devise}` : null;

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-slate-50">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-sm p-8 text-center">
        {etat === 'chargement' && (
          <>
            <div className="text-4xl mb-4" aria-hidden="true">⏳</div>
            <h1 className="text-xl font-extrabold text-slate-900">Vérification du paiement…</h1>
            <p className="mt-2 text-slate-600">Un instant, nous interrogeons votre opérateur.</p>
          </>
        )}

        {etat === 'confirme' && (
          <>
            <div className="text-4xl mb-4" aria-hidden="true">✅</div>
            <h1 className="text-xl font-extrabold text-emerald-700">Paiement confirmé</h1>
            <p className="mt-2 text-slate-600">
              {somme ? `Votre règlement de ${somme} a bien été reçu.` : 'Votre règlement a bien été reçu.'}{' '}
              Le vendeur prépare votre commande.
            </p>
            <Link
              href="/dashboard/orders"
              className="mt-6 inline-block rounded-xl bg-orange-600 px-6 py-3 font-bold text-white hover:bg-orange-700"
            >
              Suivre ma commande
            </Link>
          </>
        )}

        {etat === 'en-attente' && (
          <>
            <div className="text-4xl mb-4" aria-hidden="true">🕐</div>
            <h1 className="text-xl font-extrabold text-amber-700">Paiement en cours de confirmation</h1>
            <p className="mt-2 text-slate-600">
              Votre opérateur ne nous a pas encore confirmé le règlement
              {somme ? ` de ${somme}` : ''}. Cela prend généralement moins d’une minute.
              Votre commande est enregistrée : rien n’est perdu.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={relancer}
                className="rounded-xl bg-slate-900 px-6 py-3 font-bold text-white hover:bg-slate-800"
              >
                Actualiser
              </button>
              <Link
                href="/dashboard/orders"
                className="rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700 hover:bg-slate-50"
              >
                Voir mes commandes
              </Link>
            </div>
          </>
        )}

        {etat === 'echoue' && (
          <>
            <div className="text-4xl mb-4" aria-hidden="true">⚠️</div>
            <h1 className="text-xl font-extrabold text-red-700">Paiement non abouti</h1>
            <p className="mt-2 text-slate-600">
              Le règlement n’a pas été effectué. Votre commande reste enregistrée : vous pouvez
              réessayer, ou convenir du paiement directement avec le vendeur.
            </p>
            <Link
              href="/dashboard/orders"
              className="mt-6 inline-block rounded-xl bg-orange-600 px-6 py-3 font-bold text-white hover:bg-orange-700"
            >
              Voir mes commandes
            </Link>
          </>
        )}

        {etat === 'introuvable' && (
          <>
            <div className="text-4xl mb-4" aria-hidden="true">❓</div>
            <h1 className="text-xl font-extrabold text-slate-900">Paiement introuvable</h1>
            <p className="mt-2 text-slate-600">
              Nous ne retrouvons pas cette transaction. Retrouvez l’état de vos règlements depuis
              votre espace commandes.
            </p>
            <Link
              href="/dashboard/orders"
              className="mt-6 inline-block rounded-xl bg-orange-600 px-6 py-3 font-bold text-white hover:bg-orange-700"
            >
              Voir mes commandes
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
