interface StructuredDataProps {
  type?: "website" | "software" | "article" | "organization";
  data?: Record<string, unknown>;
}

const baseUrl = "https://createjsstack.dev";

export function StructuredData({
  type = "website",
  data = {},
}: StructuredDataProps) {
  const getStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type":
        type === "website"
          ? "WebSite"
          : type === "software"
            ? "SoftwareApplication"
            : type === "article"
              ? "Article"
              : "Organization",
      name: "JS-Stack CLI",
      url: baseUrl,
      description:
        "A comprehensive CLI tool for scaffolding production-ready JavaScript full-stack applications with React, Next.js, Node.js, and modern development best practices.",
      author: {
        "@type": "Person",
        name: "Vipin Yadav",
        url: "https://github.com/vipinyadav01",
        sameAs: [
          "https://github.com/vipinyadav01",
        ],
      },
      publisher: {
        "@type": "Organization",
        name: "JS-Stack",
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/web-app-512x512.png`,
        },
      },
      ...data,
    };

    if (type === "software") {
      return {
        ...baseData,
        "@type": "SoftwareApplication",
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
      };
    }

    if (type === "organization") {
      return {
        ...baseData,
        "@type": "Organization",
        foundingDate: "2024",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "Customer Service",
          url: "https://github.com/vipinyadav01/js-stack/issues",
        },
        sameAs: [
          "https://github.com/vipinyadav01/js-stack",
          "https://www.npmjs.com/package/@vipinyadav02/createjsstack",
        ],
      };
    }

    if (type === "website") {
      return {
        ...baseData,
        "@type": "WebSite",
        mainEntity: {
          "@type": "SoftwareApplication",
          name: "@vipinyadav02/createjsstack",
          alternateName: [
            "js-stack",
            "jsstack",
            "create jsstack",
          ],
          applicationCategory: "DeveloperApplication",
          operatingSystem: ["Windows", "macOS", "Linux"],
          downloadUrl:
            "https://www.npmjs.com/package/@vipinyadav02/createjsstack",
        },
      };
    }

    return baseData;
  };

  const structuredData = getStructuredData();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

export function BreadcrumbStructuredData({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbData),
      }}
    />
  );
}

export function FAQStructuredData({
  faqs,
}: {
  faqs: Array<{ question: string; answer: string }>;
}) {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqData),
      }}
    />
  );
}
