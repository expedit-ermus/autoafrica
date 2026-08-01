import { PaymentMethod } from '@/generated/prisma/client'

export interface ProviderFee {
  percent: number
  fixed: number
}

export interface ProviderLimits {
  min: number
  max: number
}

export interface InitiatePaymentInput {
  phone: string
  amount: number
  currency: string
  reference: string
  description?: string
}

export interface InitiatePaymentResult {
  success: boolean
  transactionId?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  message: string
  ussdCode?: string
  pinRequired: boolean
  error?: string
}

export interface PaymentProviderAdapter {
  readonly id: PaymentMethod
  readonly name: string
  readonly shortCode: string
  readonly fees: ProviderFee
  readonly limits: ProviderLimits
  readonly countries: string[]
  initiate(input: InitiatePaymentInput): Promise<InitiatePaymentResult>
}
