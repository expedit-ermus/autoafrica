'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { COUNTRY_PLATE_SPECS, SUPPORTED_COUNTRIES } from '@/modules/vehicles/license-plate.validator';
import type { SupportedCountryCode } from '@/modules/vehicles/license-plate.validator';

/**
 * Garage de l'acheteur : les vehicules qu'il declare pour retrouver ses pieces.
 *
 * Une plaque ne designe une voiture que par un registre, et celui de Cote
 * d'Ivoire est concede a un operateur prive dont le projet n'a pas l'acces
 * (D70, D71). L'acheteur declare donc sa voiture une fois, et la retrouve
 * ensuite par sa plaque depuis notre propre base.
 */

interface VehiculeGarage {
  id: string;
  plateNumber: string;
  countryCode: string;
  brandName: string;
  model?: string | null;
  year?: number | null;
  fuel?: string | null;
  gearbox?: string | null;
  engine?: string | null;
  nickname?: string | null;
}

const FUELS = [
  { value: '', label: 'Non précisé' },
  { value: 'GASOLINE', label: 'Essence' },
  { value: 'DIESEL', label: 'Diesel' },
  { value: 'HYBRID', label: 'Hybride' },
  { value: 'ELECTRIC', label: 'Électrique' },
  { value: 'LPG', label: 'GPL' },
];

const GEARBOXES = [
  { value: '', label: 'Non précisée' },
  { value: 'MANUAL', label: 'Manuelle' },
  { value: 'AUTOMATIC', label: 'Automatique' },
];

const formulaireVide = {
  plateNumber: '',
  countryCode: 'CI' as SupportedCountryCode,
  brandName: '',
  model: '',
  year: '',
  fuel: '',
  gearbox: '',
  engine: '',
  nickname: '',
};

interface Props {
  /** Marques du catalogue, proposees en suggestion — la saisie reste libre. */
  marques: string[];
}

export default function GarageManager({ marques }: Props) {
  const [vehicules, setVehicules] = useState<VehiculeGarage[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState('');
  const [enCours, setEnCours] = useState(false);
  const [editionId, setEditionId] = useState<string | null>(null);
  const [form, setForm] = useState(formulaireVide);

  /**
   * `chargement` demarre a `true` et n'est jamais repositionne ici : le
   * remettre en tete de fonction ferait clignoter la liste a chaque
   * rechargement apres une modification.
   */
  const charger = useCallback(async (annule?: () => boolean) => {
    try {
      const r = await fetch('/api/v1/garage', { credentials: 'include' });
      const data = await r.json();
      if (annule?.()) return;
      if (!r.ok) throw new Error(data.error || 'Chargement impossible');
      setVehicules(data.data || []);
      setErreur('');
    } catch (e) {
      if (annule?.()) return;
      setErreur(e instanceof Error ? e.message : 'Chargement impossible');
    } finally {
      if (!annule?.()) setChargement(false);
    }
  }, []);

  // Motif du depot : l'appel vit dans une fonction asynchrone interne, et un
  // drapeau evite d'ecrire dans un composant demonte.
  useEffect(() => {
    let annule = false;
    (async () => {
      await charger(() => annule);
    })();
    return () => {
      annule = true;
    };
  }, [charger]);

  const spec = COUNTRY_PLATE_SPECS[form.countryCode];

  const reinitialiser = () => {
    setForm(formulaireVide);
    setEditionId(null);
  };

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnCours(true);
    setErreur('');
    setSucces('');

    // Les champs vides ne sont pas envoyes : le serveur les distingue d'une
    // valeur choisie, et rien n'est complete par un defaut invente.
    const corps = {
      plateNumber: form.plateNumber,
      countryCode: form.countryCode,
      brandName: form.brandName,
      ...(form.model ? { model: form.model } : {}),
      ...(form.year ? { year: Number(form.year) } : {}),
      ...(form.fuel ? { fuel: form.fuel } : {}),
      ...(form.gearbox ? { gearbox: form.gearbox } : {}),
      ...(form.engine ? { engine: form.engine } : {}),
      ...(form.nickname ? { nickname: form.nickname } : {}),
    };

    try {
      const r = await fetch(editionId ? `/api/v1/garage/${editionId}` : '/api/v1/garage', {
        method: editionId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corps),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Enregistrement impossible');
      setSucces(editionId ? 'Véhicule mis à jour' : 'Véhicule ajouté à votre garage');
      reinitialiser();
      await charger();
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Enregistrement impossible');
    } finally {
      setEnCours(false);
    }
  };

  const editer = (v: VehiculeGarage) => {
    setEditionId(v.id);
    setForm({
      plateNumber: v.plateNumber,
      countryCode: v.countryCode as SupportedCountryCode,
      brandName: v.brandName,
      model: v.model || '',
      year: v.year ? String(v.year) : '',
      fuel: v.fuel || '',
      gearbox: v.gearbox || '',
      engine: v.engine || '',
      nickname: v.nickname || '',
    });
    setSucces('');
    setErreur('');
  };

  const supprimer = async (v: VehiculeGarage) => {
    if (!window.confirm(`Retirer ${v.plateNumber} de votre garage ?`)) return;
    try {
      const r = await fetch(`/api/v1/garage/${v.id}`, { method: 'DELETE' });
      if (!r.ok) throw new Error((await r.json()).error || 'Suppression impossible');
      if (editionId === v.id) reinitialiser();
      await charger();
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Suppression impossible');
    }
  };

  const champ =
    'w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400';
  const etiquette = 'block text-xs font-semibold text-slate-500 mb-1.5';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <section className="lg:col-span-5">
        <form onSubmit={soumettre} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-slate-900">
            {editionId ? 'Modifier le véhicule' : 'Ajouter un véhicule'}
          </h2>

          <div className="flex gap-2">
            <div className="w-28">
              <label htmlFor="g-pays" className={etiquette}>Pays</label>
              <select
                id="g-pays"
                value={form.countryCode}
                onChange={(e) => setForm({ ...form, countryCode: e.target.value as SupportedCountryCode })}
                className={champ}
              >
                {SUPPORTED_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="g-plaque" className={etiquette}>Immatriculation *</label>
              <input
                id="g-plaque"
                required
                value={form.plateNumber}
                onChange={(e) => setForm({ ...form, plateNumber: e.target.value.toUpperCase() })}
                placeholder={spec.formats[0].sample}
                className={champ}
              />
            </div>
          </div>

          {/* Les normes remplacees restent acceptees : leur porteur ne doit pas
              croire sa plaque perimee. */}
          <ul className="text-xs text-slate-500 space-y-0.5">
            {spec.formats.map((f) => (
              <li key={f.sample}>
                {f.formatDescription}
                {f.legacy ? ' — ancienne norme, toujours acceptée' : ''}
              </li>
            ))}
          </ul>

          <div>
            <label htmlFor="g-marque" className={etiquette}>Marque *</label>
            <input
              id="g-marque"
              required
              list="g-marques-connues"
              value={form.brandName}
              onChange={(e) => setForm({ ...form, brandName: e.target.value })}
              placeholder="Toyota, Kia…"
              className={champ}
            />
            {/* Suggestion, pas contrainte : la voiture de l'acheteur peut etre
                d'une marque que le catalogue ne porte pas encore. */}
            <datalist id="g-marques-connues">
              {marques.map((m) => <option key={m} value={m} />)}
            </datalist>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="g-modele" className={etiquette}>Modèle</label>
              <input id="g-modele" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="Corolla" className={champ} />
            </div>
            <div>
              <label htmlFor="g-annee" className={etiquette}>Année</label>
              <input id="g-annee" type="number" min={1950} max={new Date().getFullYear() + 1} value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className={champ} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="g-carburant" className={etiquette}>Carburant</label>
              <select id="g-carburant" value={form.fuel} onChange={(e) => setForm({ ...form, fuel: e.target.value })} className={champ}>
                {FUELS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="g-boite" className={etiquette}>Boîte</label>
              <select id="g-boite" value={form.gearbox} onChange={(e) => setForm({ ...form, gearbox: e.target.value })} className={champ}>
                {GEARBOXES.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="g-moteur" className={etiquette}>Motorisation</label>
              <input id="g-moteur" value={form.engine} onChange={(e) => setForm({ ...form, engine: e.target.value })} placeholder="1.6 VVT-i" className={champ} />
            </div>
            <div>
              <label htmlFor="g-surnom" className={etiquette}>Surnom</label>
              <input id="g-surnom" value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} placeholder="Voiture de service" className={champ} />
            </div>
          </div>

          {erreur && <p className="text-sm text-red-600" role="alert">⚠️ {erreur}</p>}
          {succes && <p className="text-sm text-emerald-700" role="status">✅ {succes}</p>}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={enCours}
              className="flex-1 py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition-colors disabled:opacity-50"
            >
              {enCours ? 'Enregistrement…' : editionId ? 'Mettre à jour' : 'Ajouter'}
            </button>
            {editionId && (
              <button type="button" onClick={reinitialiser} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm">
                Annuler
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="lg:col-span-7">
        <h2 className="text-base font-extrabold text-slate-900 mb-4">
          Mes véhicules {vehicules.length > 0 && <span className="text-slate-400 font-bold">({vehicules.length})</span>}
        </h2>

        {chargement ? (
          <p className="text-sm text-slate-500">Chargement…</p>
        ) : vehicules.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
            <div className="text-4xl mb-3" aria-hidden="true">🚗</div>
            <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
              Votre garage est vide. Enregistrez une voiture et vous la retrouverez ensuite
              par sa plaque depuis la recherche de pièces.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {vehicules.map((v) => (
              <li key={v.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-extrabold text-slate-900">
                      {[v.brandName, v.model, v.year].filter(Boolean).join(' ')}
                    </p>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {v.plateNumber}
                      {v.nickname ? ` · ${v.nickname}` : ''}
                    </p>
                    {/* Aucune ligne pour un champ non renseigne : « Carburant :
                        — » informerait moins que son absence (D61). */}
                    {[v.engine, FUELS.find((f) => f.value === v.fuel)?.label, GEARBOXES.find((g) => g.value === v.gearbox)?.label]
                      .filter((c) => c && c !== 'Non précisé' && c !== 'Non précisée').length > 0 && (
                      <p className="text-xs text-slate-500 mt-1">
                        {[v.engine, FUELS.find((f) => f.value === v.fuel)?.label, GEARBOXES.find((g) => g.value === v.gearbox)?.label]
                          .filter((c) => c && c !== 'Non précisé' && c !== 'Non précisée')
                          .join(' · ')}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/catalogue?marque=${encodeURIComponent(v.brandName)}`}
                      className="px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 text-xs font-bold hover:bg-orange-100 transition-colors"
                    >
                      Voir les pièces
                    </Link>
                    <button onClick={() => editer(v)} className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:border-slate-300">
                      Modifier
                    </button>
                    <button onClick={() => supprimer(v)} className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50">
                      Retirer
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
