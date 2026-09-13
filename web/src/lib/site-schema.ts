/**
 * The site's Schema.org graph.
 *
 * Shared so the inline JSON-LD in the root layout and the /schema.json endpoint
 * can never describe the site differently. Google only reads structured data
 * from an inline <script type="application/ld+json">, so the layout is the copy
 * that actually matters for search; the endpoint stays for other consumers.
 */

export const CLI_PACKAGE = "@vipinyadav02/createjsstack";
export const NPM_URL = `https://www.npmjs.com/package/${CLI_PACKAGE}`;
export const REPO_URL = "https://github.com/vipinyadav01/js-stack";

export function resolveSiteUrl(): string {
  const candidate = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.createjsstack.dev"
  ).trim();
  const normalized = candidate.startsWith("http")
    ? candidate
    : `https://${candidate}`;
  return normalized.replace(/\/$/, "");
}

export function buildSiteSchema(baseUrl: string = resolveSiteUrl()) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: "JS-Stack",
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/web-app-512x512.png`,
          width: 512,
          height: 512,
        },
        sameAs: [REPO_URL, NPM_URL],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "Customer Service",
          url: `${REPO_URL}/issues`,
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${baseUrl}/#software`,
        name: "JS-Stack CLI",
        alternateName: [CLI_PACKAGE, "js-stack", "jsstack", "create jsstack"],
        description:
          "A powerful CLI tool for scaffolding production-ready JavaScript and TypeScript full-stack applications. Supports React, Next.js, Vue, Svelte, Express, Hono, Nest, Prisma, Drizzle, and more.",
        applicationCategory: "DeveloperApplication",
        operatingSystem: ["Windows", "macOS", "Linux"],
        softwareVersion: "1.3.0",
        downloadUrl: NPM_URL,
        installUrl: NPM_URL,
        license: "https://opensource.org/licenses/MIT",
        programmingLanguage: ["JavaScript", "TypeScript"],
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        author: {
          "@type": "Person",
          name: "Vipin Yadav",
          url: "https://github.com/vipinyadav01",
        },
        publisher: { "@id": `${baseUrl}/#organization` },
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: "JS-Stack CLI",
        alternateName: ["js-stack", "jsstack", CLI_PACKAGE, "create jsstack"],
        description:
          "JS-Stack CLI (@vipinyadav02/createjsstack) — scaffold production-ready JavaScript full-stack applications instantly with presets, composable templates, and deep-merge layering.",
        publisher: { "@id": `${baseUrl}/#organization` },
        inLanguage: "en-US",
      },
    ],
  };
}

/**
 * Per-page schema for a documentation page: the article itself plus the
 * breadcrumb trail, which is what turns a bare URL into a Home > Docs > Page
 * path in search results.
 *
 * URLs carry a trailing slash to match the canonical exactly — the site runs
 * with `trailingSlash: true`, and a schema URL that disagrees with the
 * canonical is a weaker signal than one that matches.
 */
export function buildDocsSchema({
  title,
  description,
  path,
  baseUrl = resolveSiteUrl(),
}: {
  title: string;
  description?: string;
  path: string;
  baseUrl?: string;
}) {
  const url = `${baseUrl}${path.endsWith("/") ? path : `${path}/`}`;
  const isIndex = path === "/docs" || path === "/docs/";

  const trail = [
    { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/` },
    {
      "@type": "ListItem",
      position: 2,
      name: "Documentation",
      item: `${baseUrl}/docs/`,
    },
  ];

  if (!isIndex) {
    trail.push({
      "@type": "ListItem",
      position: 3,
      name: title,
      item: url,
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${url}#article`,
        headline: title,
        name: title,
        ...(description ? { description } : {}),
        url,
        inLanguage: "en-US",
        isPartOf: { "@id": `${baseUrl}/#website` },
        about: { "@id": `${baseUrl}/#software` },
        publisher: { "@id": `${baseUrl}/#organization` },
        author: {
          "@type": "Person",
          name: "Vipin Yadav",
          url: "https://github.com/vipinyadav01",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: trail,
      },
    ],
  };
}

/**
 * Serialize a schema object for inlining in a <script type="application/ld+json">.
 * "<" is escaped so a value containing "</script>" can never close the tag early.
 */
export function serializeSchema(schema: unknown): string {
  return JSON.stringify(schema).replace(/</g, "\\u003c");
}
