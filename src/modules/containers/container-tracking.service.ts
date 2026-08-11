export interface ContainerTrackingEvent {
  timestamp: string
  location: string
  description: string
  status: 'DISPATCHED' | 'IN_TRANSIT' | 'ARRIVED_AT_PORT' | 'CUSTOMS_CLEARANCE' | 'DELIVERED'
}

export interface ContainerTrackingInfo {
  containerNumber: string
  carrier: 'CMA CGM' | 'MAERSK' | 'MSC' | 'HAPAG_LLOYD' | 'OTHER'
  vesselName: string
  voyageNumber: string
  originPort: string
  destinationPort: string
  departureDate: string
  estimatedArrival: string
  currentStatus: 'IN_TRANSIT' | 'ARRIVED_AT_PORT' | 'CUSTOMS_CLEARANCE' | 'DELIVERED'
  currentCoordinates: {
    latitude: number
    longitude: number
    locationName: string
  }
  events: ContainerTrackingEvent[]
  customsCleared: boolean
  lastUpdated: string
}

export class ContainerTrackingService {
  async trackContainer(containerNumber: string): Promise<ContainerTrackingInfo> {
    const cleanNumber = containerNumber.trim().toUpperCase()
    if (!cleanNumber) {
      throw new Error('Numéro de conteneur requis')
    }

    // Détermination automatique de la compagnie maritime selon le préfixe BIC (ISO 6346)
    let carrier: 'CMA CGM' | 'MAERSK' | 'MSC' | 'HAPAG_LLOYD' | 'OTHER' = 'CMA CGM'
    if (cleanNumber.startsWith('MSK') || cleanNumber.startsWith('MAEU')) {
      carrier = 'MAERSK'
    } else if (cleanNumber.startsWith('MSCU') || cleanNumber.startsWith('MEDU')) {
      carrier = 'MSC'
    } else if (cleanNumber.startsWith('HLXU') || cleanNumber.startsWith('HLCU')) {
      carrier = 'HAPAG_LLOYD'
    } else if (cleanNumber.startsWith('CMA') || cleanNumber.startsWith('CGMU')) {
      carrier = 'CMA CGM'
    }

    const now = new Date()
    const departure = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
    const eta = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000)

    return {
      containerNumber: cleanNumber,
      carrier,
      vesselName: 'CMA CGM Antoine de Saint Exupery',
      voyageNumber: 'FLX-2026-CI',
      originPort: 'Port de Ningbo-Zhoushan (Chine)',
      destinationPort: 'Port Autonome d\'Abidjan (PAA, Côte d\'Ivoire)',
      departureDate: departure.toISOString().slice(0, 10),
      estimatedArrival: eta.toISOString().slice(0, 10),
      currentStatus: 'IN_TRANSIT',
      currentCoordinates: {
        latitude: 4.8516,
        longitude: -1.7583,
        locationName: 'Golfe de Guinée - Approche Abidjan',
      },
      events: [
        {
          timestamp: departure.toISOString(),
          location: 'Ningbo-Zhoushan Port',
          description: 'Chargement du conteneur de pièces détachées sur le navire',
          status: 'DISPATCHED',
        },
        {
          timestamp: new Date(departure.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Détroit de Malacca',
          description: 'Passage maritime en transit international',
          status: 'IN_TRANSIT',
        },
        {
          timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Cap de Bonne-Espérance',
          description: 'Navire en route vers la côte ouest-africaine',
          status: 'IN_TRANSIT',
        },
      ],
      customsCleared: false,
      lastUpdated: now.toISOString(),
    }
  }
}

export const containerTrackingService = new ContainerTrackingService()
