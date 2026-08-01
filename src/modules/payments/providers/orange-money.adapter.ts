import { PaymentMethod } from '@/generated/prisma/client'
import { BaseMobileMoneyAdapter } from './base.adapter'

export class OrangeMoneyAdapter extends BaseMobileMoneyAdapter {
  readonly id = PaymentMethod.ORANGE_MONEY
  readonly name = 'Orange Money'
  readonly shortCode = 'OM'
  readonly fees = { percent: 1.5, fixed: 0 }
  readonly limits = { min: 100, max: 5_000_000 }
  readonly countries = ['CI', 'SN', 'ML', 'BF', 'NE', 'TG', 'BJ', 'CM', 'MG']

  protected getUssdCode(): string | undefined {
    return `#144*4#`
  }
}
