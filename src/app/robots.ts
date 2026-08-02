import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://autoafrique-saas.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/dashboard/marketplace", "/dashboard/vehicles"],
        disallow: [
          "/dashboard/",
          "/api/",
          "/auth/",
          "/_next/",
          "/admin/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
