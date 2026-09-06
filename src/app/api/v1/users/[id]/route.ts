import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'
import { NotFoundError } from '@/shared/errors'
import { updateUserDto } from '@/modules/users/dto/user.dto'
import { auditService } from '@/modules/audit/audit.service'
import { sendSellerApprovedEmail, sendAccountStatusAlertEmail } from '@/modules/notifications/providers/email.provider'



type Context = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, context: Context) {
  try {
    await requireRole(request, ['SUPER_ADMIN', 'TENANT_ADMIN', 'MODERATOR', 'SUPPORT'])
    const { id } = await context.params

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        status: true,
        country: true,
        city: true,
        shopName: true,
        sellerEnabled: true,
        createdAt: true,
        sellerProfile: true,
        buyerProfile: true,
      },
    })

    if (!user) throw new NotFoundError('User', id)
    return successResponse(user)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  try {
    await requireRole(request, ['SUPER_ADMIN', 'TENANT_ADMIN'])
    const { id } = await context.params
    const rawBody = await request.json()
    const body = updateUserDto.parse(rawBody)

    const existingUser = await prisma.user.findUnique({ where: { id } })
    if (!existingUser) throw new NotFoundError('User', id)

    const updateData: Record<string, unknown> = {}
    if (body.status) updateData.status = body.status
    if (body.role) updateData.role = body.role
    if (body.firstName) updateData.firstName = body.firstName
    if (body.lastName) updateData.lastName = body.lastName
    if (body.phone) updateData.phone = body.phone
    if (body.country) updateData.country = body.country
    if (body.city) updateData.city = body.city


    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
      },
    })

    // ── Audit Log & Email Triggers ───────────────────────────────────────────
    if (body.status && body.status !== existingUser.status) {
      void auditService.log({
        userId: id,
        action: `USER_STATUS_CHANGE_${body.status}`,
        entity: 'User',
        entityId: id,
        oldValues: { status: existingUser.status },
        newValues: { status: body.status },
      })

      if (body.status === 'ACTIVE' && updatedUser.role === 'SELLER') {
        void sendSellerApprovedEmail({ email: updatedUser.email, firstName: updatedUser.firstName })
      } else if (body.status === 'SUSPENDED' || body.status === 'BANNED') {
        void sendAccountStatusAlertEmail({
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          status: body.status as 'SUSPENDED' | 'BANNED',
        })
      }
    }


    return successResponse(updatedUser, 'Statut utilisateur mis à jour')
  } catch (error) {
    return handleApiError(error)
  }
}
