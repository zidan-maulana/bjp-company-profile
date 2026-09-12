import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/siteUrl";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const lastModified = new Date();

  return [
    {
      url: `${baseUrl}`,
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
      alternates: {
        languages: {
          id: `${baseUrl}/`,
          en: `${baseUrl}/?lang=en`,
        },
      },
    },
    {
      url: `${baseUrl}/?lang=en`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];
}

