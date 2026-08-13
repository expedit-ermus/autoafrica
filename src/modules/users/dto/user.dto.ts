import { z } from 'zod'

export const updateUserDto = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION', 'BANNED']).optional(),
  role: z.enum(['SUPER_ADMIN', 'TENANT_ADMIN', 'MODERATOR', 'SUPPORT', 'SELLER', 'BUYER']).optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  country: z.string().length(2).optional(),
  city: z.string().optional(),
})

export type UpdateUserInput = z.infer<typeof updateUserDto>
