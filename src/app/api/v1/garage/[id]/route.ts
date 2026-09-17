import { NextRequest } from 'next/server'
import { garageService } from '@/modules/vehicles/garage.service'
import { requireAuth } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'

interface Params {
  params: Promise<{ id: string }>
}

/**
 * Le `userId` vient toujours du jeton, jamais de l'URL ni du corps : le service
 * porte la propriete dans sa clause `where`, si bien qu'un identifiant de
 * vehicule appartenant a un autre compte repond 404 au lieu d'etre modifie.
 */

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const auth = await requireAuth(request)
    const { id } = await params
    const body = await request.json()
    return successResponse(await garageService.update(auth.userId, id, body), 'Véhicule mis à jour')
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const auth = await requireAuth(request)
    const { id } = await params
    return successResponse(await garageService.remove(auth.userId, id), 'Véhicule retiré du garage')
  } catch (error) {
    return handleApiError(error)
  }
}
