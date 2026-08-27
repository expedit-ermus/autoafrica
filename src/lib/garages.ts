export interface CertifiedGarage {
  id: string
  name: string
  location: string
  rating: number
  reviewsCount: number
  availability: string
}

export const DEFAULT_GARAGES: CertifiedGarage[] = [
  {
    id: 'g-diallo',
    name: 'Maître Garage Diallo',
    location: 'Yopougon Selmer, Abidjan',
    rating: 4.9,
    reviewsCount: 128,
    availability: 'Disponible aujourd’hui',
  },
  {
    id: 'g-ndotre',
    name: "Atelier Mécanique N'Dotré Pro",
    location: "Abobo N'Dotré (Près de la Ferraille), Abidjan",
    rating: 4.8,
    reviewsCount: 94,
    availability: 'Intervention à domicile possible',
  },
  {
    id: 'g-pikine',
    name: 'Garage Express Pikine',
    location: 'Pikine Technopole, Dakar',
    rating: 4.9,
    reviewsCount: 156,
    availability: 'Disponible sous 2h',
  },
]
