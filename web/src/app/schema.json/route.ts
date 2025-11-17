import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = false;

export async function GET() {
  const baseUrl = "https://js-stack.pages.dev";

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
          "https://www.npmjs.com/package/create-js-stack",
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
          "create-js-stack",
          "js-stack",
          "jsstack",
          "createjs",
          "create jsstack",
        ],
        applicationCategory: "DeveloperApplication",
        operatingSystem: ["Windows", "macOS", "Linux"],
        softwareVersion: "1.1.17",
        downloadUrl: "https://www.npmjs.com/package/create-js-stack",
        installUrl: "https://www.npmjs.com/package/create-js-stack",
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
        alternateName: ["js-stack", "jsstack", "create-js-stack", "createjs"],
        description:
          "JS-Stack CLI (create-js-stack) - A powerful, modern CLI tool for scaffolding production-ready JavaScript full-stack applications. Create JS projects instantly.",
        publisher: {
          "@id": `${baseUrl}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${baseUrl}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
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
