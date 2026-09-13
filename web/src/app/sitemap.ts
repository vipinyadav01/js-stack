import { MetadataRoute } from "next";
import { source } from "@/lib/source";

export const dynamic = "force-static";
export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.createjsstack.dev"
  ).trim();
  const baseUrl = siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`;
  const now = new Date().toISOString().split("T")[0];

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/new/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/features/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/analytics/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sponsors/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const docsPages: MetadataRoute.Sitemap = source.getPages().map((page) => {
    const slug = page.slugs.join("/");
    const url = slug ? `${baseUrl}/docs/${slug}/` : `${baseUrl}/docs/`;
    let priority = 0.7;
    if (
      !slug ||
      slug === "getting-started" ||
      slug === "cli-options" ||
      slug === "presets"
    ) {
      priority = 0.85;
    }
    return {
      url,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority,
    };
  });

  return [...staticPages, ...docsPages];
}
