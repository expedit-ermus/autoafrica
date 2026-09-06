import { NextRequest } from 'next/server'
import { paymentsService } from '@/modules/payments/payments.service'
import { requireAuth, requireOwnershipOrAdmin } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuth(request)
    const { id } = await params
    const payment = await paymentsService.getStatus(id)

    // Un paiement n'est consultable que par son titulaire ou un admin plateforme.
    requireOwnershipOrAdmin(auth, [payment.userId], 'Accès non autorisé à ce paiement')

    return successResponse(payment)
  } catch (error) {
    return handleApiError(error)
  }
}
