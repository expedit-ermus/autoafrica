import { z } from 'zod'

export const payoutMethods = ['ORANGE_MONEY', 'MTN_MOMO', 'WAVE'] as const

export const activateSellerDto = z.object({
  displayName: z.string().min(1, 'Nom affiché requis'),
  city: z.string().optional(),
  phoneForOrders: z.string().optional(),
  payoutMethod: z.enum(payoutMethods),
  payoutNumber: z.string().min(4, 'Numéro de paiement invalide'),
})

export const updateSellerProfileDto = z.object({
  displayName: z.string().min(1).optional(),
  city: z.string().optional(),
  phoneForOrders: z.string().optional(),
  payoutMethod: z.enum(payoutMethods).optional(),
  payoutNumber: z.string().min(4).optional(),
})

export type ActivateSellerInput = z.infer<typeof activateSellerDto>
export type UpdateSellerProfileInput = z.infer<typeof updateSellerProfileDto>
