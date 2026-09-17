import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NotFoundError, ValidationError } from '@/shared/errors'

const mockPrisma = vi.hoisted(() => ({
  userVehicle: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    updateMany: vi.fn(),
    deleteMany: vi.fn(),
  },
}))

vi.mock('@/lib/prisma', () => ({ prisma: mockPrisma }))

import { garageService, normaliserPlaque } from './garage.service'

const base = {
  plateNumber: 'AB-123-CD',
  brandName: 'Toyota',
}

/**
 * Le garage est la reponse honnete a « la recherche par plaque doit identifier
 * le vehicule » : le registre national etant inaccessible, c'est l'acheteur qui
 * declare sa voiture, et notre base qui l'identifie ensuite.
 *
 * Son point sensible est le cloisonnement : une plaque saisie par un tiers ne
 * doit jamais reveler le vehicule de quelqu'un d'autre.
 */
describe('GarageService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('normaliserPlaque', () => {
    // Une meme plaque s'ecrit de plusieurs facons ; enregistrer l'une et
    // chercher l'autre ne doit produire ni doublon ni echec de recherche.
    it('ramene les ecritures d une meme plaque a une seule cle', () => {
      const attendu = 'AB123CD'
      for (const saisie of ['AB-123-CD', 'AB 123 CD', 'ab123cd', ' ab-123 cd ']) {
        expect(normaliserPlaque(saisie), saisie).toBe(attendu)
      }
    })
  })

  describe('create', () => {
    it('enregistre une plaque a la norme en vigueur', async () => {
      mockPrisma.userVehicle.findUnique.mockResolvedValue(null)
      mockPrisma.userVehicle.create.mockResolvedValue({ id: 'v1' })

      await garageService.create('user-1', base)

      expect(mockPrisma.userVehicle.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user-1',
          // La saisie est conservee pour l'affichage, sa forme normalisee sert
          // de cle : un automobiliste reconnait « AB-123-CD », pas « AB123CD ».
          plateNumber: 'AB-123-CD',
          plateKey: 'AB123CD',
          countryCode: 'CI',
          brandName: 'Toyota',
        }),
      })
    })

    it('enregistre aussi une plaque a l ancienne norme', async () => {
      mockPrisma.userVehicle.findUnique.mockResolvedValue(null)
      mockPrisma.userVehicle.create.mockResolvedValue({ id: 'v1' })

      await garageService.create('user-1', { ...base, plateNumber: '4550 EG 01' })

      expect(mockPrisma.userVehicle.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ plateNumber: '4550 EG 01', plateKey: '4550EG01' }),
      })
    })

    it('refuse une immatriculation qui ne releve d aucune norme', async () => {
      await expect(
        garageService.create('user-1', { ...base, plateNumber: 'PAS-UNE-PLAQUE' }),
      ).rejects.toBeInstanceOf(ValidationError)
      expect(mockPrisma.userVehicle.create).not.toHaveBeenCalled()
    })

    // Le message doit citer les deux normes : celui qui saisit une plaque de
    // 2019 ne doit pas croire qu'elle n'est plus reconnue.
    it('cite toutes les normes acceptees dans le refus', async () => {
      await expect(
        garageService.create('user-1', { ...base, plateNumber: 'XX' }),
      ).rejects.toThrow(/4 chiffres/)
    })

    it('exige une marque', async () => {
      await expect(
        garageService.create('user-1', { ...base, brandName: '   ' }),
      ).rejects.toBeInstanceOf(ValidationError)
    })

    it('refuse une annee hors des bornes plausibles', async () => {
      for (const year of [1900, new Date().getFullYear() + 5, 2020.5]) {
        await expect(
          garageService.create('user-1', { ...base, year }),
          String(year),
        ).rejects.toBeInstanceOf(ValidationError)
      }
    })

    /**
     * Un carburant inconnu n'est pas remplace par un defaut : il serait
     * ensuite affiche comme un fait sur la fiche du vehicule (D61).
     */
    it('refuse un carburant ou une boite hors nomenclature', async () => {
      await expect(
        garageService.create('user-1', { ...base, fuel: 'CHARBON' }),
      ).rejects.toBeInstanceOf(ValidationError)
      await expect(
        garageService.create('user-1', { ...base, gearbox: 'SEQUENTIELLE' }),
      ).rejects.toBeInstanceOf(ValidationError)
    })

    it('laisse vides les champs non renseignes plutot que de les inventer', async () => {
      mockPrisma.userVehicle.findUnique.mockResolvedValue(null)
      mockPrisma.userVehicle.create.mockResolvedValue({ id: 'v1' })

      await garageService.create('user-1', base)

      const data = mockPrisma.userVehicle.create.mock.calls[0][0].data
      for (const champ of ['model', 'year', 'fuel', 'gearbox', 'engine', 'nickname']) {
        expect(data[champ], champ).toBeNull()
      }
    })

    it('refuse un doublon dans le meme garage', async () => {
      mockPrisma.userVehicle.findUnique.mockResolvedValue({ id: 'deja' })

      await expect(garageService.create('user-1', base)).rejects.toBeInstanceOf(ValidationError)
      expect(mockPrisma.userVehicle.create).not.toHaveBeenCalled()
    })

    it('refuse un pays non pris en charge', async () => {
      await expect(
        garageService.create('user-1', { ...base, countryCode: 'FR' }),
      ).rejects.toBeInstanceOf(ValidationError)
    })
  })

  /**
   * Cloisonnement entre comptes. C'est la raison pour laquelle le `@@unique`
   * porte sur le couple utilisateur/plaque et non sur la plaque seule : deux
   * personnes peuvent declarer la meme immatriculation — un vehicule revendu,
   * une erreur de saisie — sans que l'une voie le vehicule de l'autre.
   */
  describe('cloisonnement entre comptes', () => {
    it('ne cherche que dans le garage du demandeur', async () => {
      mockPrisma.userVehicle.findUnique.mockResolvedValue(null)

      await garageService.findByPlate('user-1', 'AB 123 CD')

      expect(mockPrisma.userVehicle.findUnique).toHaveBeenCalledWith({
        where: { userId_plateKey: { userId: 'user-1', plateKey: 'AB123CD' } },
      })
    })

    it('ne liste que les vehicules du demandeur', async () => {
      mockPrisma.userVehicle.findMany.mockResolvedValue([])

      await garageService.list('user-1')

      expect(mockPrisma.userVehicle.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: 'user-1' } }),
      )
    })

    // La propriete est portee par la clause `where` : une modification visant
    // le vehicule d'un autre compte ne trouve aucune ligne, au lieu d'etre
    // appliquee puis rejetee apres coup.
    it('porte la propriete dans la clause de mise a jour', async () => {
      mockPrisma.userVehicle.updateMany.mockResolvedValue({ count: 1 })
      mockPrisma.userVehicle.findUnique.mockResolvedValue({ id: 'v1' })

      await garageService.update('user-1', 'v1', base)

      expect(mockPrisma.userVehicle.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'v1', userId: 'user-1' } }),
      )
    })

    it('refuse de modifier le vehicule d un autre compte', async () => {
      mockPrisma.userVehicle.updateMany.mockResolvedValue({ count: 0 })

      await expect(garageService.update('intrus', 'v1', base)).rejects.toBeInstanceOf(NotFoundError)
    })

    it('porte la propriete dans la clause de suppression', async () => {
      mockPrisma.userVehicle.deleteMany.mockResolvedValue({ count: 1 })

      await garageService.remove('user-1', 'v1')

      expect(mockPrisma.userVehicle.deleteMany).toHaveBeenCalledWith({
        where: { id: 'v1', userId: 'user-1' },
      })
    })

    it('refuse de supprimer le vehicule d un autre compte', async () => {
      mockPrisma.userVehicle.deleteMany.mockResolvedValue({ count: 0 })

      await expect(garageService.remove('intrus', 'v1')).rejects.toBeInstanceOf(NotFoundError)
    })
  })

  describe('findByPlate', () => {
    it('ne consulte pas la base sur une plaque vide', async () => {
      expect(await garageService.findByPlate('user-1', '')).toBeNull()
      expect(mockPrisma.userVehicle.findUnique).not.toHaveBeenCalled()
    })

    it('retrouve le vehicule quelle que soit l ecriture de la plaque', async () => {
      mockPrisma.userVehicle.findUnique.mockResolvedValue({ id: 'v1', brandName: 'Toyota' })

      const v = await garageService.findByPlate('user-1', 'ab123cd')

      expect(v?.brandName).toBe('Toyota')
    })
  })
})
