export type CategoryCode = 'ENGINE_PARTS' | 'BRAKE_PARTS' | 'TIRES' | 'BODY_PARTS' | 'ELECTRONICS'

export interface UemoaCustomsDutyBreakdown {
  cifValueXof: number
  category: CategoryCode
  hsCode: string
  dutyRatePercent: number
  droitDeDouane: number
  redevanceStatistique: number
  prelevementUemoaCedeao: number
  tvaXof: number
  totalCustomsDuties: number
  totalDdpCost: number
  incoterm: 'DDU' | 'DDP'
}

export class UemoaCustomsCalculator {
  calculateDuties(cifValueXof: number, category: CategoryCode, incoterm: 'DDU' | 'DDP' = 'DDP'): UemoaCustomsDutyBreakdown {
    if (cifValueXof <= 0) {
      throw new Error('La valeur CAF (CIF) doit être supérieure à zéro')
    }

    let dutyRatePercent = 20
    let hsCode = '8708.99.00' // Code SH par défaut pour pièces de véhicules

    switch (category) {
      case 'ENGINE_PARTS':
        dutyRatePercent = 10
        hsCode = '8409.91.00'
        break
      case 'BRAKE_PARTS':
        dutyRatePercent = 10
        hsCode = '8708.30.00'
        break
      case 'TIRES':
        dutyRatePercent = 20
        hsCode = '4011.10.00'
        break
      case 'BODY_PARTS':
        dutyRatePercent = 20
        hsCode = '8708.29.00'
        break
      case 'ELECTRONICS':
        dutyRatePercent = 5
        hsCode = '8512.20.00'
        break
    }

    // 1. Droit de Douane (DD)
    const droitDeDouane = Math.round((cifValueXof * dutyRatePercent) / 100)

    // 2. Redevance Statistique (RS) : 1%
    const redevanceStatistique = Math.round(cifValueXof * 0.01)

    // 3. Prélèvements Communautaires UEMOA + CEDEAO (PCS + PCC) : 1.5%
    const prelevementUemoaCedeao = Math.round(cifValueXof * 0.015)

    // 4. Base imposable TVA = CAF + DD + RS + PCS + PCC
    const baseTva = cifValueXof + droitDeDouane + redevanceStatistique + prelevementUemoaCedeao

    // 5. Taxe sur la Valeur Ajoutée (TVA 18% Côte d'Ivoire)
    const tvaXof = Math.round(baseTva * 0.18)

    // 6. Total Droits et Taxes Douaniers UEMOA
    const totalCustomsDuties = droitDeDouane + redevanceStatistique + prelevementUemoaCedeao + tvaXof

    // 7. Coût Total DDP (Delivered Duty Paid)
    const totalDdpCost = cifValueXof + totalCustomsDuties

    return {
      cifValueXof,
      category,
      hsCode,
      dutyRatePercent,
      droitDeDouane,
      redevanceStatistique,
      prelevementUemoaCedeao,
      tvaXof,
      totalCustomsDuties,
      totalDdpCost: incoterm === 'DDP' ? totalDdpCost : cifValueXof,
      incoterm,
    }
  }
}

export const uemoaCustomsCalculator = new UemoaCustomsCalculator()
