import { crmService } from '@/modules/crm/crm.service'

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

export interface CertifiedGarage {
  id: string
  name: string
  location: string
  rating: number
  reviewsCount: number
  availability: string
}

export interface RepairLeadPayload {
  customerName: string
  customerPhone: string
  vehicleInfo: string
  locationCity?: string
  issueId: string
  partCondition: 'venant' | 'neuf'
  selectedGarageId: string
  paymentMethod: string
}

export class RepairEstimatorService {
  private options: Record<string, RepairOption> = {
    suspension: {
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
    braking: {
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
    maintenance: {
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
    engine: {
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
    cooling: {
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
    electricity: {
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
  }

  private garages: CertifiedGarage[] = [
    {
      id: 'g-diallo',
      name: 'Maître Garage Diallo',
      location: 'Yopougon Selmer, Abidjan',
      rating: 4.9,
      reviewsCount: 128,
      availability: 'Disponible aujourd’hui',
    },
    {
      id: 'g-ndotre',
      name: "Atelier Mécanique N'Dotré Pro",
      location: "Abobo N'Dotré (Près de la Ferraille), Abidjan",
      rating: 4.8,
      reviewsCount: 94,
      availability: 'Intervention à domicile possible',
    },
    {
      id: 'g-pikine',
      name: 'Garage Express Pikine',
      location: 'Pikine Technopole, Dakar',
      rating: 4.9,
      reviewsCount: 156,
      availability: 'Disponible sous 2h',
    },
  ]

  getOptions(): RepairOption[] {
    return Object.values(this.options)
  }

  getOptionById(id: string): RepairOption | undefined {
    return this.options[id]
  }

  getGarages(): CertifiedGarage[] {
    return this.garages
  }

  calculateEstimate(issueId: string, partCondition: 'venant' | 'neuf') {
    const option = this.getOptionById(issueId) || this.options.suspension
    const partPriceRange = partCondition === 'venant' ? option.priceVenant : option.priceNeuf
    const minTotal = partPriceRange.min + option.laborFee
    const maxTotal = partPriceRange.max + option.laborFee

    return {
      option,
      partCondition,
      partPriceRange,
      laborFee: option.laborFee,
      minTotal,
      maxTotal,
      formattedPartPrice: `${partPriceRange.min.toLocaleString('fr-FR')} - ${partPriceRange.max.toLocaleString('fr-FR')} FCFA`,
      formattedLaborFee: `${option.laborFee.toLocaleString('fr-FR')} FCFA`,
      formattedTotal: `${minTotal.toLocaleString('fr-FR')} - ${maxTotal.toLocaleString('fr-FR')} FCFA`,
    }
  }

  async captureRepairLead(payload: RepairLeadPayload) {
    const option = this.getOptionById(payload.issueId) || this.options.suspension
    const garage = this.garages.find(g => g.id === payload.selectedGarageId) || this.garages[0]
    const estimate = this.calculateEstimate(payload.issueId, payload.partCondition)

    const reference = `DEV-${Date.now().toString().slice(-6)}`
    const notes = [
      `[DEVIS EXPRESS ${reference}]`,
      `Panne : ${option.title} (${option.description})`,
      `Pièce : ${option.recommendedPart} (${payload.partCondition.toUpperCase()})`,
      `Estimation Pièce : ${estimate.formattedPartPrice}`,
      `Main d'œuvre Garagiste : ${estimate.formattedLaborFee}`,
      `Total Estimé : ${estimate.formattedTotal}`,
      `Garagiste Référent : ${garage.name} (${garage.location})`,
      `Véhicule : ${payload.vehicleInfo}`,
      `Localisation Client : ${payload.locationCity || 'Abidjan'}`,
      `Mode Paiement : ${payload.paymentMethod}`,
    ].join('\n')

    const lead = await crmService.createLead({
      name: payload.customerName,
      phone: payload.customerPhone,
      source: 'Estimateur Devis Panne Express',
      value: estimate.maxTotal,
      notes,
    })

    return {
      leadId: lead.id,
      reference,
      status: 'CONFIRMED',
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      garage,
      estimate,
      createdAt: new Date().toISOString(),
    }
  }
}

export const repairEstimatorService = new RepairEstimatorService()
