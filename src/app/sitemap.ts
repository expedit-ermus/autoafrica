import type { MetadataRoute } from "next";

const BASE_URL = "https://autoafrique-saas.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const indexablePages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/dashboard/marketplace`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/dashboard/vehicles`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  return indexablePages;
}
