import { NextRequest } from 'next/server'
import { garageService } from '@/modules/vehicles/garage.service'
import { requireAuth } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'

/**
 * Garage de l'utilisateur connecte.
 *
 * Toutes les operations passent par `requireAuth` et sont portees par
 * `auth.userId` : l'identifiant n'est jamais lu du corps de la requete, faute
 * de quoi n'importe qui pourrait lire ou modifier le garage d'un autre.
 */

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    return successResponse(await garageService.list(auth.userId))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    const body = await request.json()
    const vehicule = await garageService.create(auth.userId, body)
    return successResponse(vehicule, 'Véhicule ajouté à votre garage', 201)
  } catch (error) {
    return handleApiError(error)
  }
}
