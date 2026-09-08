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

/**
 * Categories reelles du catalogue, alignees sur `Category.slug` en base.
 *
 * Elles divergeaient : le code exposait douze categories inventees pour le SEO
 * (`pneus-jantes`, `filtre`, `huiles-fluides`...) dont huit n'existaient pas en
 * base, tandis que des categories reelles — `electrique`, `refroidissement`,
 * `transmission` — n'etaient exposees par aucune page. Vingt et un produits sur
 * cinquante et un etaient inatteignables par la navigation (D62).
 *
 * La liste suit la taxonomie creee par `prisma/seed.mjs`, y compris les trois
 * categories encore sans produit (`pneumatique`, `direction`, `echappement`) :
 * elles existent en base et se rempliront, et une categorie vide affiche
 * desormais un etat vide honnete plutot que des pieces d'autres categories.
 *
 * Le filtre API s'applique par `category = slug`, exactement ce champ.
 */
export const CATEGORY_SLUGS: CategorySlugEntry[] = [
  {
    slug: 'moteur',
    name: 'Moteur',
    description:
      "Pieces moteur, joints de culasse, pistons, vilebrequins, filtres a huile et courroies de distribution, neufs et d'occasion controlee a Abidjan.",
  },
  {
    slug: 'frein',
    name: 'Frein',
    description:
      "Disques de frein, plaquettes, etriers et cables pour voitures en Afrique de l'Ouest. Prix transparents, garantie incluse.",
  },
  {
    slug: 'electrique',
    name: 'Électrique',
    description:
      "Alternateurs, demarreurs, batteries, bougies d'allumage, phares et faisceaux electriques pour votre vehicule.",
  },
  {
    slug: 'suspension',
    name: 'Suspension',
    description:
      "Amortisseurs, ressorts, bras de suspension, rotules et barres antiroulis, pour tenir les routes degradees d'Afrique de l'Ouest.",
  },
  {
    slug: 'refroidissement',
    name: 'Refroidissement',
    description:
      "Radiateurs, pompes a eau, thermostats, durites et liquides de refroidissement, indispensables sous les fortes chaleurs.",
  },
  {
    slug: 'transmission',
    name: 'Transmission',
    description:
      "Boites de vitesses, kits d'embrayage, disques, butees et cardans, neufs et d'occasion controlee, livres a Abidjan.",
  },
  {
    slug: 'carrosserie',
    name: 'Carrosserie',
    description:
      "Pare-chocs, retroviseurs, phares, calandres et elements de tolerie neufs et d'occasion controlee en Afrique de l'Ouest.",
  },
  {
    slug: 'pneumatique',
    name: 'Pneumatique',
    description:
      "Pneus neufs et d'occasion controlee, jantes aluminium et acier pour toutes les marques, disponibles a Abidjan.",
  },
  {
    slug: 'direction',
    name: 'Direction',
    description:
      "Cremailleres, rotules, biellettes et pompes de direction assistee, pour une conduite sure sur routes degradees.",
  },
  {
    slug: 'echappement',
    name: 'Échappement',
    description:
      "Silencieux, catalyseurs, collecteurs et lignes d'echappement completes, neufs et d'occasion controlee.",
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
    name: 'Mercedes',
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