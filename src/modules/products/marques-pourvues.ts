import { prisma } from '@/lib/prisma'

/**
 * Marques ayant au moins une piece active, les mieux pourvues d'abord.
 *
 * Source unique pour tout ce qui propose de choisir une marque. Le composant
 * `VehiclePartsSearch` portait la sienne, ecrite en dur : elle proposait
 * Suzuki, Dacia et Mitsubishi — zero piece, et les deux dernieres absentes de
 * la table `Brand` — tout en omettant Kia, Mercedes et Volkswagen, qui portent
 * seize des cinquante et une pieces du catalogue.
 *
 * C'est la troisieme fois que le defaut se presente : les categories en D62,
 * les marques du sitemap en D66, celles-ci. Le filtre reproduit exactement
 * celui des pages marque et du sitemap, `products: { some: { active: true } }`,
 * pour qu'une marque entre et sorte de la liste d'elle-meme.
 */
export async function marquesPourvues(): Promise<string[]> {
  const marques = await prisma.brand.findMany({
    where: { products: { some: { active: true } } },
    select: { name: true },
    orderBy: { products: { _count: 'desc' } },
  })

  return marques.map((m) => m.name)
}
