import { Metadata } from "next";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  image = "/opengraph-image/",
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author = "Vipin Yadav",
  section,
  tags = [],
}: SEOProps): Metadata {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.createjsstack.dev"
  ).trim();
  const baseUrl = (
    siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`
  ).replace(/\/$/, "");

  // Ensure canonical URL strictly follows Next.js trailingSlash: true configuration
  let canonicalPath = "/";
  if (url) {
    const trimmed = url.trim();
    if (trimmed !== "/" && trimmed !== "") {
      canonicalPath = trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
      if (!canonicalPath.startsWith("/")) {
        canonicalPath = `/${canonicalPath}`;
      }
    }
  }
  const fullUrl = `${baseUrl}${canonicalPath}`;

  // Ensure absolute image URL without 308 redirect
  const fullImageUrl = image.startsWith("http")
    ? image
    : `${baseUrl}${image.startsWith("/") ? image : `/${image}`}`;

  const fullTitle = title
    ? `${title} | JS-Stack CLI`
    : "JS-Stack CLI - Modern Full-Stack JavaScript Development Tool";
  const fullDescription =
    description ||
    "Scaffold production-ready JavaScript full-stack apps in seconds. JS-Stack CLI generates React, Next.js, Express, Prisma and Docker projects from one command.";

  // The root layout applies `template: "%s | JS-Stack CLI"`, so the page title
  // is passed bare — appending the suffix here as well is what produced
  // "X | JS-Stack CLI | JS-Stack CLI" on every page but the homepage. The Open
  // Graph and Twitter titles bypass the template, so they keep the full form.
  const pageTitle: Metadata["title"] = title ? title : { absolute: fullTitle };

  const allKeywords = [
    ...keywords,
    "js-stack",
    "@vipinyadav02/createjsstack",
    "javascript project generator",
    "typescript cli",
    "nextjs starter",
    "react boilerplate",
    "full-stack scaffolding",
    "nodejs framework",
    "production-ready template",
    "monorepo setup",
    "turborepo",
    "docker configuration",
    "ci/cd pipelines",
    "prisma orm",
    "shadcn/ui",
    "tailwind css components",
  ];

  return {
    title: pageTitle,
    description: fullDescription,
    keywords: allKeywords,
    authors: [{ name: author, url: "https://github.com/vipinyadav01" }],
    creator: author,
    publisher: "JS-Stack",
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: fullUrl,
      siteName: "JS-Stack CLI",
      type: type as "website" | "article",
      locale: "en_US",
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
          type: "image/png",
        },
      ],
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors: [author],
        section,
        tags,
      }),
    },
    twitter: {
      card: "summary_large_image",
      site: "@jsstack_cli",
      creator: "@vipinyadav",
      title: fullTitle,
      description: fullDescription,
      images: {
        url: fullImageUrl,
        alt: fullTitle,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export const featuresPageMetadata = generateSEOMetadata({
  title: "Features - Everything You Need",
  description:
    "Explore all the features of JS-Stack CLI: React, Next.js, Node.js, Express, databases, authentication, testing, deployment, and more.",
  keywords: [
    "js-stack features",
    "cli features",
    "javascript frameworks",
    "typescript support",
    "database integration",
    "authentication systems",
    "testing frameworks",
    "deployment options",
  ],
  url: "/features/",
});

export const analyticsPageMetadata = generateSEOMetadata({
  title: "Analytics - Usage Statistics",
  description:
    "View usage statistics and analytics for JS-Stack CLI. See popular stacks, deployment trends, and community metrics.",
  keywords: [
    "js-stack analytics",
    "usage statistics",
    "development trends",
    "popular frameworks",
    "community metrics",
  ],
  url: "/analytics/",
});
