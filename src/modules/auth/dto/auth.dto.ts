import { z } from 'zod'

export const registerDto = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  country: z.enum(['CI', 'SN', 'ML', 'BF', 'NE', 'BJ', 'TG', 'GW', 'NG', 'GH']),
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
