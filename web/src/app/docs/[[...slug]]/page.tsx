import { source } from "@/app/source";
import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { generateSEOMetadata } from "@/components/seo";
import { BreadcrumbStructuredData } from "@/components/structured-data";
import type { ComponentType } from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (!slug || slug.length === 0) {
    return generateSEOMetadata({
      title: "Documentation - Complete Guide",
      description:
        "Complete documentation for JS-Stack CLI. Learn how to create, customize, and deploy modern JavaScript full-stack applications.",
      url: "/docs",
      keywords: [
        "js-stack documentation",
        "cli documentation",
        "javascript tutorial",
        "full-stack development guide",
        "project setup tutorial",
      ],
    });
  }

  const page = source.getPage(slug);
  if (!page) {
    return generateSEOMetadata({
      title: "Documentation",
      description: "JS-Stack CLI Documentation",
      url: `/docs/${slug.join("/")}`,
    });
  }

  const pageData = page.data as {
    title: string;
    description: string;
  };

  return generateSEOMetadata({
    title: pageData.title || "Documentation",
    description: pageData.description || "JS-Stack CLI Documentation",
    url: `/docs/${slug.join("/")}`,
    keywords: [
      "js-stack",
      "documentation",
      "cli",
      "javascript",
      "full-stack",
      slug.join(" "),
    ],
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;

  // The root /docs route is handled by /docs/page.tsx
  // This route only handles /docs/[slug] paths
  if (!slug || slug.length === 0) {
    notFound();
  }

  const page = source.getPage(slug);

  if (!page) {
    notFound();
  }

  // Access MDX component from page data exports
  // Based on Fumadocs API: page.data.exports.default
  const pageData = page.data as {
    title: string;
    description: string;
    exports?: {
      default?: ComponentType;
      toc?: Array<{ title: string; url: string; depth: number }>;
    };
  };

  const MDX = pageData.exports?.default;

  if (!MDX) {
    notFound();
  }

  // Generate breadcrumb items
  const breadcrumbItems = [
    { name: "Home", url: "https://createjsstack.dev" },
    { name: "Documentation", url: "https://createjsstack.dev/docs" },
  ];

  if (slug && slug.length > 0) {
    let currentPath = "/docs";
    slug.forEach((segment) => {
      currentPath += `/${segment}`;
      breadcrumbItems.push({
        name: segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        url: `https://createjsstack.dev${currentPath}`,
      });
    });
  }

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <DocsPage toc={pageData.exports?.toc || []}>
        <DocsTitle>{pageData.title}</DocsTitle>
        <DocsDescription>{pageData.description}</DocsDescription>
        <DocsBody>
          <MDX />
        </DocsBody>
      </DocsPage>
    </>
  );
}

export async function generateStaticParams() {
  // Generate static params for all docs pages
  // This is required for static export with "output: export"
  try {
    const pages = source.getPages();
    if (!pages || pages.length === 0) {
      // Fallback: return known docs pages if source is empty
      return [
        { slug: [] }, // Root docs page
        { slug: ["getting-started"] },
        { slug: ["technologies"] },
        { slug: ["commands"] },
        { slug: ["examples"] },
      ];
    }
    return pages.map((page: { url: string }) => {
      // Extract slug from page URL
      const url = page.url || "";
      const slug = url.split("/").filter(Boolean).slice(1); // Remove /docs prefix
      return { slug: slug.length > 0 ? slug : [] };
    });
  } catch (error) {
    // Fallback if source fails
    console.warn("Failed to generate static params from source:", error);
    return [
      { slug: [] }, // Root docs page
      { slug: ["getting-started"] },
      { slug: ["technologies"] },
      { slug: ["commands"] },
      { slug: ["examples"] },
    ];
  }
}
