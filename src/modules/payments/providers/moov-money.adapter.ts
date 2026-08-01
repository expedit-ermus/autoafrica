import { PaymentMethod } from '@/generated/prisma/client'
import { BaseMobileMoneyAdapter } from './base.adapter'

export class MoovMoneyAdapter extends BaseMobileMoneyAdapter {
  readonly id = PaymentMethod.MOOV_MONEY
  readonly name = 'Moov Money'
  readonly shortCode = 'MOOV'
  readonly fees = { percent: 1.5, fixed: 0 }
  readonly limits = { min: 100, max: 5_000_000 }
  readonly countries = ['CI', 'BJ', 'BF', 'TG', 'NE', 'CG', 'GA']

  protected getUssdCode(): string | undefined {
    return `*155#`
  }
}
