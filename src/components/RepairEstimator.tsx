'use client'

import { useState } from 'react'
import { DEFAULT_GARAGES, type CertifiedGarage } from '@/lib/garages'
import type { repairEstimatorService } from '@/modules/repair-estimator/repair-estimator.service'

/** Forme exacte renvoyee par le service de devis. */
type RepairLeadResult = Awaited<ReturnType<typeof repairEstimatorService.captureRepairLead>>
export { DEFAULT_GARAGES, type CertifiedGarage }

export interface RepairOption {
  id: string
  title: string
  description: string
  icon: string
  duration: string
  recommendedPart: string
  priceVenant: { min: number; max: number }
  priceNeuf: { min: number; max: number }
  laborFee: number
}

const DEFAULT_OPTIONS: RepairOption[] = [
  {
    id: 'suspension',
    title: 'Suspension & Châssis',
    description: 'Bruit claquement / Amortisseur usé',
    icon: '🚙',
    duration: '2h00',
    recommendedPart: "Paire d'amortisseurs avant + rotules",
    priceVenant: { min: 35000, max: 55000 },
    priceNeuf: { min: 70000, max: 110000 },
    laborFee: 15000,
  },
  {
    id: 'braking',
    title: 'Freinage',
    description: 'Freins qui sifflent ou pédale molle',
    icon: '🛑',
    duration: '1h30',
    recommendedPart: 'Jeu de plaquettes de frein avant + disques',
    priceVenant: { min: 25000, max: 40000 },
    priceNeuf: { min: 45000, max: 75000 },
    laborFee: 10000,
  },
  {
    id: 'maintenance',
    title: 'Entretien Régulier',
    description: 'Vidange & Révision 10 000 km',
    icon: '🛢️',
    duration: '1h00',
    recommendedPart: 'Huile 15W40/5W30 + Filtres huile, air & carburant',
    priceVenant: { min: 20000, max: 30000 },
    priceNeuf: { min: 35000, max: 50000 },
    laborFee: 8000,
  },
  {
    id: 'engine',
    title: 'Moteur & Injection',
    description: 'Fumée noire / Perte de puissance',
    icon: '⚙️',
    duration: '3h30',
    recommendedPart: 'Nettoyage/Remplacement Injecteurs + Bougies de préchauffage',
    priceVenant: { min: 45000, max: 80000 },
    priceNeuf: { min: 120000, max: 180000 },
    laborFee: 25000,
  },
  {
    id: 'cooling',
    title: 'Refroidissement',
    description: 'Aiguille de température haute / Fuite d’eau',
    icon: '🌡️',
    duration: '2h00',
    recommendedPart: 'Radiateur d’eau + Thermostat (Calorstat) + Liquide 5L',
    priceVenant: { min: 30000, max: 50000 },
    priceNeuf: { min: 65000, max: 95000 },
    laborFee: 12000,
  },
  {
    id: 'electricity',
    title: 'Électricité & Démarrage',
    description: 'La voiture ne démarre pas / Voyant batterie',
    icon: '⚡',
    duration: '1h30',
    recommendedPart: 'Batterie renforcée 70Ah / Alternateur reconditionné',
    priceVenant: { min: 30000, max: 50000 },
    priceNeuf: { min: 65000, max: 95000 },
    laborFee: 10000,
  },
]

export function RepairEstimator() {
  const [selectedIssueId, setSelectedIssueId] = useState<string>('suspension')
  const [partCondition, setPartCondition] = useState<'venant' | 'neuf'>('venant')
  const [selectedGarageId, setSelectedGarageId] = useState<string>('g-diallo')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  // Form State
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [vehicleInfo, setVehicleInfo] = useState('')
  const [locationCity, setLocationCity] = useState('Abidjan')
  const [paymentMethod, setPaymentMethod] = useState('Paiement sécurisé sur place / Mobile Money')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmationData, setConfirmationData] = useState<RepairLeadResult | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  const activeOption = DEFAULT_OPTIONS.find(o => o.id === selectedIssueId) || DEFAULT_OPTIONS[0]
  const activeGarage = DEFAULT_GARAGES.find(g => g.id === selectedGarageId) || DEFAULT_GARAGES[0]

  const activePriceRange = partCondition === 'venant' ? activeOption.priceVenant : activeOption.priceNeuf
  const totalMin = activePriceRange.min + activeOption.laborFee
  const totalMax = activePriceRange.max + activeOption.laborFee

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName || !customerPhone || !vehicleInfo) {
      setErrorMessage('Veuillez remplir tous les champs obligatoires (*).')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const res = await fetch('/api/v1/repair-estimates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          vehicleInfo,
          locationCity,
          issueId: selectedIssueId,
          partCondition,
          selectedGarageId,
          paymentMethod,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || 'Erreur lors de la réservation.')
      }

      setConfirmationData(json.data)
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Problème de connexion. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto my-8 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900 rounded-3xl text-white shadow-2xl border border-slate-700/50">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full uppercase tracking-wider mb-3">
          💡 Estimateur de Devis & Panne Express
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          Calculez le prix de votre réparation en 30 secondes
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Transparence totale : découvrez le tarif estimé de la pièce (<strong className="text-amber-400">Venante</strong> ou <strong className="text-emerald-400">Neuve</strong>) et la main d&apos;œuvre du Maître Garagiste certifié.
        </p>
      </div>

      {/* Problem Selector Grid */}
      <div className="mb-10">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span>🔎</span> Sélectionnez votre problème ou besoin :
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {DEFAULT_OPTIONS.map((item) => {
            const isSelected = item.id === selectedIssueId
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedIssueId(item.id)}
                className={`p-4 rounded-2xl text-left transition-all duration-200 border flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-400 shadow-lg shadow-orange-500/20 scale-[1.02]'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600'
                }`}
              >
                <span className="text-3xl p-2 bg-slate-900/40 rounded-xl flex-shrink-0">{item.icon}</span>
                <div>
                  <div className="font-extrabold text-sm sm:text-base leading-snug">{item.title}</div>
                  <div className={`text-xs mt-1 ${isSelected ? 'text-orange-100' : 'text-slate-400'}`}>
                    {item.description}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Detailed Estimation Card */}
      <div className="bg-slate-800/90 rounded-3xl p-5 sm:p-8 border border-slate-700 shadow-xl mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-700/80">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-orange-400">Estimation Devis Détaillé</span>
            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 mt-1">
              <span>{activeOption.icon}</span> {activeOption.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">{activeOption.description}</p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900/80 rounded-xl text-xs font-bold text-amber-300 border border-slate-700 self-start sm:self-auto">
            <span>⏱️</span> Durée moyenne : <strong>{activeOption.duration}</strong>
          </div>
        </div>

        {/* Condition Toggle */}
        <div className="my-6">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Choisissez l&apos;état de la pièce souhaité :
          </label>
          <div className="grid grid-cols-2 gap-3 max-w-md">
            <button
              type="button"
              onClick={() => setPartCondition('venant')}
              className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all ${
                partCondition === 'venant'
                  ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/30'
                  : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-900'
              }`}
            >
              <span>🔵</span> Venant (Occasion)
            </button>
            <button
              type="button"
              onClick={() => setPartCondition('neuf')}
              className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all ${
                partCondition === 'neuf'
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-500/30'
                  : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-900'
              }`}
            >
              <span>🟢</span> Neuf (OEM)
            </button>
          </div>
        </div>

        {/* Breakdown Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-900/70 rounded-2xl border border-slate-700/60 text-sm">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Pièce recommandée :</span>
            <strong className="text-white text-xs sm:text-sm block mt-0.5">{activeOption.recommendedPart}</strong>
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Prix estimé pièce :</span>
            <strong className="text-amber-400 text-sm sm:text-base font-bold block mt-0.5">
              {activePriceRange.min.toLocaleString('fr-FR')} - {activePriceRange.max.toLocaleString('fr-FR')} FCFA
            </strong>
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Main d&apos;œuvre Garagiste :</span>
            <strong className="text-emerald-400 text-sm sm:text-base font-bold block mt-0.5">
              {activeOption.laborFee.toLocaleString('fr-FR')} FCFA
            </strong>
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Garantie Incluse :</span>
            <strong className="text-sky-300 text-xs sm:text-sm font-bold block mt-0.5">
              🛡️ Pièce ET Main d&apos;œuvre
            </strong>
          </div>
        </div>

        {/* Total Summary Banner */}
        <div className="mt-6 p-4 bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <span className="text-xs uppercase font-extrabold text-amber-400 tracking-wider">Total Estimé</span>
            <div className="text-xl sm:text-3xl font-black text-amber-300">
              {totalMin.toLocaleString('fr-FR')} - {totalMax.toLocaleString('fr-FR')} FCFA
            </div>
            <span className="text-[11px] text-slate-400">
              ({activePriceRange.min.toLocaleString('fr-FR')} pièce + {activeOption.laborFee.toLocaleString('fr-FR')} pose)
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm sm:text-base rounded-xl shadow-lg shadow-orange-500/30 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <span>📲</span> Valider ce devis & Réserver mon RDV
          </button>
        </div>
      </div>

      {/* Affiliated Certified Master Garages Nearby */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span>🛠️</span> Maîtres Garagistes affiliés à proximité :
        </h3>
        <fieldset className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <legend className="sr-only">Choisissez un garagiste</legend>
          {DEFAULT_GARAGES.map((g) => {
            const isSelected = g.id === selectedGarageId
            return (
              <label
                key={g.id}
                className={`p-4 rounded-2xl cursor-pointer transition-all border text-left flex flex-col ${
                  isSelected
                    ? 'bg-slate-800 border-amber-500 ring-2 ring-amber-500/50 shadow-md'
                    : 'bg-slate-900/60 border-slate-700/80 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-extrabold text-sm text-white">{g.name}</h4>
                  <input
                    type="radio"
                    name="garage_selection"
                    checked={isSelected}
                    onChange={() => setSelectedGarageId(g.id)}
                    className="accent-orange-500"
                  />
                </div>
                <p className="text-xs text-slate-400 mb-2">{g.location}</p>
                <div className="flex items-center justify-between text-xs mt-auto">
                  <span className="text-amber-400 font-bold">★ {g.rating} <span className="text-slate-400 font-normal">({g.reviewsCount} avis)</span></span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-semibold rounded text-[11px]">
                    {g.availability}
                  </span>
                </div>
              </label>
            )
          })}
        </fieldset>
      </div>

      {/* Footer Security Note */}
      <div className="text-center text-xs text-slate-400 border-t border-slate-800 pt-4">
        🔒 Paiement sécurisé sur place / Mobile Money (Wave, Djamo, OM) après intervention du Maître Garagiste.
      </div>

      {/* Modal for Data Capture & Lead Generation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 text-white rounded-3xl border border-slate-700 shadow-2xl max-w-lg w-full p-6 sm:p-8 relative overflow-hidden">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false)
                setConfirmationData(null)
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full bg-slate-800"
            >
              ✕
            </button>

            {confirmationData ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-3xl mx-auto">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-white">Devis Validé & RDV Enregistré !</h3>
                <p className="text-xs text-slate-300">
                  Référence du Devis : <strong className="text-amber-400">{confirmationData.reference}</strong>
                </p>

                <div className="bg-slate-800 p-4 rounded-2xl text-left text-xs space-y-2 border border-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Client :</span>
                    <strong className="text-white">{confirmationData.customerName} ({confirmationData.customerPhone})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Garagiste :</span>
                    <strong className="text-amber-300">{confirmationData.garage.name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Estimé :</span>
                    <strong className="text-emerald-400">{confirmationData.estimate.formattedTotal}</strong>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Un membre de l&apos;équipe AutoAfrique et le Maître Garagiste vous contacteront sous 15 minutes sur WhatsApp pour confirmer l&apos;heure exacte de prise en charge.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setConfirmationData(null)
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-xl"
                >
                  Fermer & Terminer
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <span className="text-xs font-extrabold uppercase text-orange-400 tracking-wider">Étape Finale</span>
                  <h3 className="text-xl font-extrabold text-white">Réservez votre RDV Garagiste</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Devis sélectionné : <strong>{activeOption.title}</strong> chez <strong>{activeGarage.name}</strong> ({totalMin.toLocaleString('fr-FR')} - {totalMax.toLocaleString('fr-FR')} FCFA).
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs rounded-xl font-medium">
                    ⚠️ {errorMessage}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Nom & Prénom <span className="text-rose-400">*</span>
                  </label>
                  <input aria-label="ex. Kouassi Jean"
                    type="text"
                    required
                    placeholder="ex. Kouassi Jean"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Téléphone WhatsApp / Mobile Money <span className="text-rose-400">*</span>
                  </label>
                  <input aria-label="ex. +225 07 07 07 07 07"
                    type="tel" inputMode="tel" autoComplete="tel"
                    required
                    placeholder="ex. +225 07 07 07 07 07"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Marque & Modèle du Véhicule <span className="text-rose-400">*</span>
                  </label>
                  <input aria-label="ex. Toyota Corolla 2014 / Peugeot 308"
                    type="text"
                    required
                    placeholder="ex. Toyota Corolla 2014 / Peugeot 308"
                    value={vehicleInfo}
                    onChange={(e) => setVehicleInfo(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Ville ou Quartier (ex. Yopougon, Abidjan)
                  </label>
                  <input aria-label="Ville ou commune"
                    type="text"
                    placeholder="Abidjan"
                    value={locationCity}
                    onChange={(e) => setLocationCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Mode de Règlement Souhaité
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Paiement sur place (Garagiste)">Paiement sur place au Garage (Espèces)</option>
                    <option value="Mobile Money (Wave, Orange, MTN)">Mobile Money (Wave, Orange, MTN, Djamo)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2 mt-4"
                >
                  {isSubmitting ? (
                    <span>Traitement en cours...</span>
                  ) : (
                    <>
                      <span>📲</span> Enregistrer ma Réservation & Mon Devis
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
