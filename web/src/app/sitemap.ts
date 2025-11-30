import { MetadataRoute } from "next";
import { source } from "@/app/source";

export const dynamic = "force-static";
export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://createjsstack.dev"
  ).trim();
  const baseUrl = siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`;
  const now = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

  // Get all docs pages from Fumadocs source
  const docsPages: MetadataRoute.Sitemap = [];
  try {
    const pages = source.getPages();
    if (pages && pages.length > 0) {
      pages.forEach((page: { url: string }) => {
        const url = page.url || "";
        if (url) {
          docsPages.push({
            url: `${baseUrl}${url}`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.8,
          });
        }
      });
    } else {
      // Fallback docs pages if source is empty
      const fallbackDocs = [
        "/docs/getting-started",
        "/docs/technologies",
        "/docs/commands",
        "/docs/examples",
      ];
      fallbackDocs.forEach((path) => {
        docsPages.push({
          url: `${baseUrl}${path}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      });
    }
  } catch (error) {
    console.warn("Failed to get docs pages for sitemap:", error);
    // Add fallback docs pages
    [
      "/docs/getting-started",
      "/docs/technologies",
      "/docs/commands",
      "/docs/examples",
    ].forEach((path) => {
      docsPages.push({
        url: `${baseUrl}${path}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    });
  }

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...docsPages,
    {
      url: `${baseUrl}/new`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/analytics`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/sponsors`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
