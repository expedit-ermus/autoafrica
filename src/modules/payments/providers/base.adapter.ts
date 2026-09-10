import { PaymentMethod } from '@/generated/prisma/client'
import { InitiatePaymentInput, InitiatePaymentResult, PaymentProviderAdapter, ProviderFee, ProviderLimits } from './types'
import { cinetPayConfigured, initiateCinetPayPayment } from '@/lib/cinetpay'

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

  /**
   * Canal a mettre en avant sur la page CinetPay. `MOBILE_MONEY` par defaut :
   * l'acheteur choisit alors lui-meme son operateur.
   */
  protected getCinetPayChannel(): string {
    return 'MOBILE_MONEY'
  }

  async initiate(input: InitiatePaymentInput): Promise<InitiatePaymentResult> {
    this.validate(input)

    // Chemin reel : les quatre operateurs passent par la page hebergee de
    // CinetPay. L'acheteur y saisit son code aupres de son operateur, jamais
    // sur AutoAfrique.
    if (cinetPayConfigured()) {
      const initiation = await initiateCinetPayPayment({
        transactionId: input.reference,
        amount: input.amount,
        currency: input.currency,
        description: input.description || `Commande AutoAfrique`,
        customerPhone: input.phone,
        channels: this.getCinetPayChannel(),
      })

      if (!initiation.ok) {
        return {
          success: false,
          status: 'failed',
          message:
            `Le paiement ${this.name} n'a pas pu etre ouvert. Votre commande est enregistree : ` +
            `le vendeur vous contactera pour convenir du reglement.`,
          pinRequired: false,
          error: 'PROVIDER_INITIATION_FAILED',
        }
      }

      // `pending`, jamais `completed` : rien n'est encaisse a ce stade.
      return {
        success: true,
        transactionId: initiation.paymentToken || input.reference,
        status: 'pending',
        message: `Vous allez etre redirige vers ${this.name} pour regler votre commande.`,
        pinRequired: false,
        redirectUrl: initiation.paymentUrl,
      }
    }

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
