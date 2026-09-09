import { PaymentMethod } from '@/generated/prisma/client'
import { InitiatePaymentInput, InitiatePaymentResult, PaymentProviderAdapter, ProviderFee, ProviderLimits } from './types'

export abstract class BaseMobileMoneyAdapter implements PaymentProviderAdapter {
  abstract readonly id: PaymentMethod
  abstract readonly name: string
  abstract readonly shortCode: string
  abstract readonly fees: ProviderFee
  abstract readonly limits: ProviderLimits
  abstract readonly countries: string[]

  protected readonly failureRate = 0.05

  protected getUssdCode(): string | undefined {
    return undefined
  }

  protected validate(input: InitiatePaymentInput) {
    if (!/^\+?[0-9]{8,15}$/.test(input.phone)) {
      throw new Error('Numéro de téléphone invalide')
    }
    if (input.amount < this.limits.min || input.amount > this.limits.max) {
      throw new Error(
        `Montant hors limites pour ${this.name} (min ${this.limits.min} ${input.currency}, max ${this.limits.max} ${input.currency})`,
      )
    }
  }

  /**
   * La simulation n'est active que si elle est demandee explicitement
   * (`PAYMENTS_SIMULATOR=1`, pose par les suites de tests). Ailleurs — donc en
   * production — l'adaptateur refuse au lieu de fabriquer un succes.
   *
   * Sans ce garde-fou, `initiate()` renvoyait « Paiement effectue avec succes »
   * apres un delai d'une seconde et un tirage aleatoire, sans le moindre appel
   * a un operateur : la commande passait a PAID sans qu'aucun argent ne bouge
   * (D65).
   */
  private static simulationActive(): boolean {
    return process.env.PAYMENTS_SIMULATOR === '1'
  }

  async initiate(input: InitiatePaymentInput): Promise<InitiatePaymentResult> {
    this.validate(input)

    if (!BaseMobileMoneyAdapter.simulationActive()) {
      return {
        success: false,
        status: 'failed',
        message:
          `Le paiement en ligne par ${this.name} n'est pas encore actif sur AutoAfrique. ` +
          `Votre commande est enregistree : le vendeur vous contactera pour convenir du reglement.`,
        pinRequired: false,
        error: 'PROVIDER_NOT_CONFIGURED',
      }
    }

    await new Promise(resolve => setTimeout(resolve, 1000))

    const failed = Math.random() < this.failureRate
    if (failed) {
      return {
        success: false,
        status: 'failed',
        message: `${this.name} a refusé le paiement. Réessayez ou choisissez un autre moyen de paiement.`,
        pinRequired: true,
        error: 'PROVIDER_REFUSED',
      }
    }

    return {
      success: true,
      transactionId: `${this.shortCode}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      status: 'completed',
      message: `Paiement ${this.name} effectué avec succès`,
      ussdCode: this.getUssdCode(),
      pinRequired: true,
    }
  }
}
