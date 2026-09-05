import { SUPPORTED_COUNTRY_CODES } from '@/shared/utils/phone'
import { z } from 'zod'

export const registerDto = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  // Liste partagee avec le formulaire d'inscription : voir SUPPORTED_COUNTRIES.
  country: z.enum(SUPPORTED_COUNTRY_CODES),
  city: z.string().optional(),
  shopName: z.string().optional(),
  role: z.enum(['SELLER', 'BUYER']).optional(),
})

export const loginDto = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const refreshTokenDto = z.object({
  refreshToken: z.string().min(1),
})

export type RegisterInput = z.infer<typeof registerDto>
export type LoginInput = z.infer<typeof loginDto>
