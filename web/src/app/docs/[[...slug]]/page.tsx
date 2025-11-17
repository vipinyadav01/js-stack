import { source } from "@/app/source";
import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { docsPageMetadata } from "@/components/seo";
import type { ComponentType } from "react";

export const metadata: Metadata = docsPageMetadata;

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
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

  return (
    <DocsPage toc={pageData.exports?.toc || []}>
      <DocsTitle>{pageData.title}</DocsTitle>
      <DocsDescription>{pageData.description}</DocsDescription>
      <DocsBody>
        <MDX />
      </DocsBody>
    </DocsPage>
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
