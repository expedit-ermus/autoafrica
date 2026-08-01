import { PaymentMethod } from '@/generated/prisma/client'
import { BaseMobileMoneyAdapter } from './base.adapter'

export class WaveAdapter extends BaseMobileMoneyAdapter {
  readonly id = PaymentMethod.WAVE
  readonly name = 'Wave'
  readonly shortCode = 'WAVE'
  readonly fees = { percent: 1.0, fixed: 0 }
  readonly limits = { min: 100, max: 10_000_000 }
  readonly countries = ['CI', 'SN', 'BF', 'ML']
}
