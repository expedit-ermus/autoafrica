export interface CategorySlugEntry {
  slug: string;
  name: string;
  description: string;
}

export interface BrandSlugEntry {
  slug: string;
  name: string;
  description: string;
}

export const CATEGORY_SLUGS: CategorySlugEntry[] = [
  {
    slug: 'pneus-jantes',
    name: 'Pneus & Jantes',
    description:
      "Pneus neufs et occasion, jantes aluminium et acier pour toutes les marques, disponibles à Abidjan. Paiement Mobile Money, livraison 24-72h.",
  },
  {
    slug: 'frein',
    name: 'Frein',
    description:
      'Disques de frein, plaquettes, étriers et câbles de frein pour voitures en Afrique de l\'Ouest. Prix transparents, garantie incluse.',
  },
  {
    slug: 'moteur',
    name: 'Moteur',
    description:
      "Pièces moteur, joint de culasse, pistons et vilebrequins neufs et d'occasion contrôlée à Abidjan, Côte d'Ivoire.",
  },
  {
    slug: 'courroies-chaines',
    name: 'Courroies & Chaînes',
    description:
      'Courroies de distribution et accessoires, galets tendeurs et chaînes de distribution pour toutes les marques.',
  },
  {
    slug: 'embrayage',
    name: 'Embrayage',
    description:
      "Kits d'embrayage, disques, butées et récepteurs pour voitures au meilleur prix, livraison 24-72h à Abidjan.",
  },
  {
    slug: 'amortissement',
    name: 'Amortissement',
    description:
      'Amortisseurs, supports, biellettes et rotules pour un confort de conduite sûr en Afrique de l\'Ouest.',
  },
  {
    slug: 'suspension',
    name: 'Suspension',
    description:
      'Ressorts, bras de suspension, barres antiroulis et baladeurs pour toutes les marques.',
  },
  {
    slug: 'filtre',
    name: 'Filtre',
    description:
      "Filtres à huile, à air, à carburant et habitacle pour l'entretien de votre voiture à Abidjan.",
  },
  {
    slug: 'carrosserie',
    name: 'Carrosserie',
    description:
      "Pare-chocs, rétroviseurs, phares et calandres neufs et d'occasion contrôlée en Afrique de l'Ouest.",
  },
  {
    slug: 'huiles-fluides',
    name: 'Huiles & Fluides',
    description:
      'Huile moteur, liquide de refroidissement, liquide de frein et huile de transmission.',
  },
  {
    slug: 'electricite',
    name: 'Électricité',
    description:
      "Alternateurs, démarreurs, batteries et bougies d'allumage pour votre véhicule.",
  },
  {
    slug: 'autres',
    name: 'Autres catégories',
    description:
      'Échappement, climatisation, direction et systèmes de refroidissement en Afrique de l\'Ouest.',
  },
];

export const BRAND_SLUGS: BrandSlugEntry[] = [
  {
    slug: 'toyota',
    name: 'Toyota',
    description:
      "Pièces détachées Toyota neuves et d'occasion contrôlée à Abidjan, Côte d'Ivoire. Paiement Mobile Money, livraison 24-72h.",
  },
  {
    slug: 'hyundai',
    name: 'Hyundai',
    description:
      "Pièces détachées Hyundai neuves et d'occasion contrôlée à Abidjan, Côte d'Ivoire. Paiement Mobile Money, livraison 24-72h.",
  },
  {
    slug: 'kia',
    name: 'Kia',
    description:
      "Pièces détachées Kia neuves et d'occasion contrôlée à Abidjan, Côte d'Ivoire. Paiement Mobile Money, livraison 24-72h.",
  },
  {
    slug: 'peugeot',
    name: 'Peugeot',
    description:
      "Pièces détachées Peugeot neuves et d'occasion contrôlée à Abidjan, Côte d'Ivoire. Paiement Mobile Money, livraison 24-72h.",
  },
  {
    slug: 'mercedes-benz',
    name: 'Mercedes-Benz',
    description:
      "Pièces détachées Mercedes-Benz neuves et d'occasion contrôlée à Abidjan, Côte d'Ivoire. Paiement Mobile Money, livraison 24-72h.",
  },
  {
    slug: 'renault',
    name: 'Renault',
    description:
      "Pièces détachées Renault neuves et d'occasion contrôlée à Abidjan, Côte d'Ivoire. Paiement Mobile Money, livraison 24-72h.",
  },
  {
    slug: 'suzuki',
    name: 'Suzuki',
    description:
      "Pièces détachées Suzuki neuves et d'occasion contrôlée à Abidjan, Côte d'Ivoire. Paiement Mobile Money, livraison 24-72h.",
  },
  {
    slug: 'nissan',
    name: 'Nissan',
    description:
      "Pièces détachées Nissan neuves et d'occasion contrôlée à Abidjan, Côte d'Ivoire. Paiement Mobile Money, livraison 24-72h.",
  },
  {
    slug: 'ford',
    name: 'Ford',
    description:
      "Pièces détachées Ford neuves et d'occasion contrôlée à Abidjan, Côte d'Ivoire. Paiement Mobile Money, livraison 24-72h.",
  },
  {
    slug: 'volkswagen',
    name: 'Volkswagen',
    description:
      "Pièces détachées Volkswagen neuves et d'occasion contrôlée à Abidjan, Côte d'Ivoire. Paiement Mobile Money, livraison 24-72h.",
  },
  {
    slug: 'bmw',
    name: 'BMW',
    description:
      "Pièces détachées BMW neuves et d'occasion contrôlée à Abidjan, Côte d'Ivoire. Paiement Mobile Money, livraison 24-72h.",
  },
  {
    slug: 'citroen',
    name: 'Citroën',
    description:
      "Pièces détachées Citroën neuves et d'occasion contrôlée à Abidjan, Côte d'Ivoire. Paiement Mobile Money, livraison 24-72h.",
  },
  {
    slug: 'opel',
    name: 'Opel',
    description:
      "Pièces détachées Opel neuves et d'occasion contrôlée à Abidjan, Côte d'Ivoire. Paiement Mobile Money, livraison 24-72h.",
  },
];

export function resolveCategory(slug: string): CategorySlugEntry | undefined {
  return CATEGORY_SLUGS.find((c) => c.slug === slug);
}

export function resolveBrand(slug: string): BrandSlugEntry | undefined {
  return BRAND_SLUGS.find((b) => b.slug === slug);
}