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
  image = "/og-image.png",
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author = "Vipin Yadav",
  section,
  tags = [],
}: SEOProps): Metadata {
  const baseUrl = "https://js-stack.pages.dev";
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const fullTitle = title
    ? `${title} | JS-Stack CLI`
    : "JS-Stack CLI - Modern Full-Stack JavaScript Development Tool";
  const fullDescription =
    description ||
    "A powerful, modern CLI tool for scaffolding production-ready JavaScript full-stack projects with extensive customization options and best practices built-in. Features React, Next.js, Node.js, Express, databases, authentication, testing, and deployment configurations.";

  const allKeywords = [
    ...keywords,
    "js",
    "jsstack",
    "js-stack",
    "createjs",
    "create jsstack",
    "create-js-stack",
    "javascript cli",
    "typescript cli",
    "react boilerplate",
    "nextjs starter",
    "nodejs scaffolding",
    "full-stack development",
  ];

  return {
    title: fullTitle,
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
          url: image,
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
        url: image,
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

// Pre-configured metadata for common pages
export const homePageMetadata = generateSEOMetadata({
  title: "Modern Full-Stack JavaScript & TypeScript Development Tool",
  description:
    "A powerful, modern CLI tool for scaffolding production-ready JavaScript full-stack projects with extensive customization options and best practices built-in. Features React, Next.js, Node.js, Express, databases, authentication, testing, and deployment configurations. Save hours of setup time.",
  keywords: [
    "javascript project generator",
    "typescript boilerplate",
    "react starter template",
    "nextjs project setup",
    "nodejs express generator",
    "full-stack cli tool",
    "web development automation",
    "modern development stack",
    "project scaffolding",
    "development productivity",
  ],
});

export const docsPageMetadata = generateSEOMetadata({
  title: "Documentation - Complete Guide",
  description:
    "Complete documentation for JS-Stack CLI. Learn how to create, customize, and deploy modern JavaScript and TypeScript full-stack applications.",
  keywords: [
    "js-stack documentation",
    "cli documentation",
    "javascript tutorial",
    "typescript guide",
    "full-stack development guide",
    "project setup tutorial",
  ],
  url: "/docs",
});

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
  url: "/features",
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
  url: "/analytics",
});
