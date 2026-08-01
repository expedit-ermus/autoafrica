import { PaymentMethod } from '@/generated/prisma/client'
import { BaseMobileMoneyAdapter } from './base.adapter'

export class MtnMomoAdapter extends BaseMobileMoneyAdapter {
  readonly id = PaymentMethod.MTN_MOMO
  readonly name = 'MTN Mobile Money'
  readonly shortCode = 'MTN'
  readonly fees = { percent: 1.8, fixed: 0 }
  readonly limits = { min: 100, max: 7_000_000 }
  readonly countries = ['CI', 'NG', 'GH', 'BJ', 'NE', 'CM', 'UG', 'RW']

  protected getUssdCode(): string | undefined {
    return `*133#`
  }
}
