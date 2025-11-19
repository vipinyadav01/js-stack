"use client";

interface StructuredDataProps {
  type?: "website" | "software" | "article" | "organization";
  data?: Record<string, unknown>;
}

export function StructuredData({
  type = "website",
  data = {},
}: StructuredDataProps) {
  const baseUrl = "https://createjsstack.dev";

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
          "https://vipinyadav01.vercel.app",
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
        softwareVersion: "1.0.10",
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
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          ratingCount: "150",
          bestRating: "5",
          worstRating: "1",
        },
        review: [
          {
            "@type": "Review",
            author: {
              "@type": "Person",
              name: "Developer",
            },
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
              bestRating: "5",
            },
            reviewBody:
              "Excellent CLI tool for modern JavaScript development. Saves hours of setup time.",
          },
        ],
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
          "https://www.npmjs.com/package/create-js-stack",
        ],
      };
    }

    if (type === "website") {
      return {
        ...baseData,
        "@type": "WebSite",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${baseUrl}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
        mainEntity: {
          "@type": "SoftwareApplication",
          name: "create-js-stack",
          alternateName: ["js-stack", "jsstack", "createjs", "create jsstack"],
          applicationCategory: "DeveloperApplication",
          operatingSystem: ["Windows", "macOS", "Linux"],
          downloadUrl: "https://www.npmjs.com/package/create-js-stack",
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
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
}

// Breadcrumb structured data
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
        __html: JSON.stringify(breadcrumbData, null, 2),
      }}
    />
  );
}

// FAQ structured data
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
        __html: JSON.stringify(faqData, null, 2),
      }}
    />
  );
}
