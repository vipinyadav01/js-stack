import { MetadataRoute } from "next";

export const dynamic = "force-static";
export const revalidate = false;

export default function robots(): MetadataRoute.Robots {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.createjsstack.dev"
  ).trim();
  const baseUrl = siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
      {
        userAgent: "GPTBot",
        allow: ["/", "/docs/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/api/", "/_next/"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: ["/", "/docs/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/api/", "/_next/"],
      },
      {
        userAgent: "anthropic-ai",
        allow: ["/", "/docs/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/api/", "/_next/"],
      },
      {
        userAgent: "ClaudeBot",
        allow: ["/", "/docs/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/api/", "/_next/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: ["/", "/docs/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
