import { PaymentMethod } from '@/generated/prisma/client'
import { PaymentProviderAdapter } from './types'
import { OrangeMoneyAdapter } from './orange-money.adapter'
import { MtnMomoAdapter } from './mtn-momo.adapter'
import { MoovMoneyAdapter } from './moov-money.adapter'
import { WaveAdapter } from './wave.adapter'

export class PaymentProviderRegistry {
  private readonly providers: Record<PaymentMethod, PaymentProviderAdapter>

  constructor(providers: PaymentProviderAdapter[]) {
    this.providers = providers.reduce(
      (acc, provider) => {
        acc[provider.id] = provider
        return acc
      },
      {} as Record<PaymentMethod, PaymentProviderAdapter>,
    )
  }

  get(method: string): PaymentProviderAdapter {
    const provider = this.providers[method as PaymentMethod]
    if (!provider) {
      throw new Error(`Moyen de paiement non supporté : ${method}`)
    }
    return provider
  }

  list(): PaymentProviderAdapter[] {
    return Object.values(this.providers)
  }

  isSupported(method: string): boolean {
    return method in this.providers
  }
}

export const paymentProviders = new PaymentProviderRegistry([
  new OrangeMoneyAdapter(),
  new MtnMomoAdapter(),
  new WaveAdapter(),
  new MoovMoneyAdapter(),
])
