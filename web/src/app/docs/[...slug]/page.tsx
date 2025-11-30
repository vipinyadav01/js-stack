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
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const page = source.getPage(slug);
  if (!page) {
    return generateSEOMetadata({
      title: "Documentation",
      description: "JS-Stack CLI Documentation",
      url: `/docs/${slug.join("/")}`,
    });
  }

  const pageData = page.data as { title: string; description: string };

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
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  if (!slug || slug.length === 0) {
    notFound();
  }

  const page = source.getPage(slug);
  if (!page) {
    notFound();
  }

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

  const breadcrumbItems = [
    { name: "Home", url: "https://createjsstack.dev" },
    { name: "Documentation", url: "https://createjsstack.dev/docs" },
  ];

  let currentPath = "/docs";
  slug.forEach((segment) => {
    currentPath += `/${segment}`;
    breadcrumbItems.push({
      name: segment
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      url: `https://createjsstack.dev${currentPath}`,
    });
  });

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
  try {
    const pages = source.getPages();
    if (!pages || pages.length === 0) {
      return [
        { slug: ["getting-started"] },
        { slug: ["technologies"] },
        { slug: ["commands"] },
        { slug: ["examples"] },
      ];
    }
    return pages
      .map((page: { url: string }) => page.url || "")
      .filter((url) => url.startsWith("/docs/"))
      .map((url) => ({ slug: url.replace(/^\/docs\//, "").split("/") }));
  } catch (error) {
    console.warn("Failed to generate static params from source:", error);
    return [
      { slug: ["getting-started"] },
      { slug: ["technologies"] },
      { slug: ["commands"] },
      { slug: ["examples"] },
    ];
  }
}
