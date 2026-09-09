import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { BRAND_SLUGS, CATEGORY_SLUGS } from "@/lib/marketplace-catalog";

const BASE_URL = "https://autoafrique-saas.vercel.app";

// Le sitemap interroge le catalogue : il n'annonce que les pages qui portent
// reellement quelque chose. Revalide chaque heure pour suivre l'arrivee de
// stock sans redeploiement.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const indexablePages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/recherche-pieces`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/catalogue`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/devenir-vendeur`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/tarifs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/estimation-devis`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/a-propos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/conditions-generales`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/politique-de-confidentialite`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/aide`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/paiement`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/livraison`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/retours`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog/entretien-vehicule-afrique`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog/choisir-pieces-occasion-controlee`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog/paiement-mobile-money-auto`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog/casse-auto-vs-autoafrique`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog/gestion-stock-garage-erp`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/blog/livraison-pieces-gare-routiere`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/blog/devenir-vendeur-marketplace`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/blog/verifier-compatibilite-piece-auto-vehicule`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog/ou-trouver-pieces-detachees-auto-abidjan`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/manuels-reparation`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...(await categoryUrls()),
    ...(await brandUrls()),
  ];

  return indexablePages;
}

/**
 * Categories et marques reellement pourvues.
 *
 * Le sitemap portait sa propre liste de slugs, troisieme copie de la taxonomie
 * apres la base et `marketplace-catalog.ts`. D62 avait realigne les categories,
 * en laissant les marques derriver : treize marques etaient soumises a
 * l'indexation, huit seulement avaient du stock. Suzuki, Ford, BMW, Citroen et
 * Opel etaient annoncees a Google et n'affichaient rien.
 *
 * La liste est desormais deduite du catalogue, avec exactement le filtre que
 * les pages appliquent (`products.service.ts`) : `active: true`, la categorie
 * par slug, la marque par nom. Une page entre au sitemap quand elle se
 * remplit et en sort quand elle se vide, sans intervention.
 *
 * L'intersection avec `CATEGORY_SLUGS` / `BRAND_SLUGS` reste necessaire : les
 * routes repondent 404 sur un slug absent de ces listes, une categorie creee
 * en base sans y etre declaree n'a pas de page a annoncer.
 */
async function categoryUrls(): Promise<MetadataRoute.Sitemap> {
  const pourvues = await prisma.category.findMany({
    where: { products: { some: { active: true } } },
    select: { slug: true },
  });
  const slugs = new Set(pourvues.map((c) => c.slug));

  return CATEGORY_SLUGS.filter((entree) => slugs.has(entree.slug)).map((entree) => ({
    url: `${BASE_URL}/categories/${entree.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
}

async function brandUrls(): Promise<MetadataRoute.Sitemap> {
  // Les pages marque filtrent par nom, pas par slug : `mercedes-benz` porte le
  // nom `Mercedes` (D62). C'est donc le nom qui sert de cle ici.
  const pourvues = await prisma.brand.findMany({
    where: { products: { some: { active: true } } },
    select: { name: true },
  });
  const noms = new Set(pourvues.map((b) => b.name));

  return BRAND_SLUGS.filter((entree) => noms.has(entree.name)).map((entree) => ({
    url: `${BASE_URL}/marques/${entree.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
}
