import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = false;

export async function GET() {
  const baseUrl = "https://www.createjsstack.dev";

  const schema = {
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
        sameAs: [
          "https://github.com/vipinyadav01/js-stack",
          "https://www.npmjs.com/package/@vipinyadav02/createjsstack",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "Customer Service",
          url: "https://github.com/vipinyadav01/js-stack/issues",
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${baseUrl}/#software`,
        name: "JS-Stack CLI",
        alternateName: [
          "@vipinyadav02/createjsstack",
          "js-stack",
          "jsstack",
          "create jsstack",
        ],
        description:
          "A powerful CLI tool for scaffolding production-ready JavaScript and TypeScript full-stack applications. Supports React, Next.js, Vue, Svelte, Express, Hono, Nest, Prisma, Drizzle, and more.",
        applicationCategory: "DeveloperApplication",
        operatingSystem: ["Windows", "macOS", "Linux"],
        softwareVersion: "1.2.17",
        downloadUrl:
          "https://www.npmjs.com/package/@vipinyadav02/createjsstack",
        installUrl:
          "https://www.npmjs.com/package/@vipinyadav02/createjsstack",
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
        publisher: {
          "@id": `${baseUrl}/#organization`,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: "JS-Stack CLI",
        alternateName: [
          "js-stack",
          "jsstack",
          "@vipinyadav02/createjsstack",
          "create jsstack",
        ],
        description:
          "JS-Stack CLI (@vipinyadav02/createjsstack) — scaffold production-ready JavaScript full-stack applications instantly with presets, composable templates, and deep-merge layering.",
        publisher: {
          "@id": `${baseUrl}/#organization`,
        },
        inLanguage: "en-US",
      },
    ],
  };

  return NextResponse.json(schema, {
    headers: {
      "Content-Type": "application/ld+json",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
