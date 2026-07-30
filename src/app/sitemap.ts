import type { MetadataRoute } from "next";

const BASE_URL = "https://autoafrique-saas.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  const authPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/auth/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/auth/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const dashboardPages: MetadataRoute.Sitemap = [
    "dashboard",
    "dashboard/analytics",
    "dashboard/cart",
    "dashboard/crm",
    "dashboard/finance",
    "dashboard/help",
    "dashboard/inventory",
    "dashboard/marketplace",
    "dashboard/orders",
    "dashboard/payments",
    "dashboard/profile",
    "dashboard/settings",
  ].map((path) => ({
    url: `${BASE_URL}/${path}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.1,
  }));

  const apiRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/api/v1`,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0,
    },
  ];

  return [...staticPages, ...authPages, ...dashboardPages, ...apiRoutes];
}
