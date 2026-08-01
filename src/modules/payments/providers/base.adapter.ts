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

  async initiate(input: InitiatePaymentInput): Promise<InitiatePaymentResult> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    this.validate(input)

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
