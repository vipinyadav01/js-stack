import { serializeSchema } from "@/lib/site-schema";

/**
 * FAQ schema for the homepage.
 *
 * The site-wide Organization/SoftwareApplication/WebSite graph lives in
 * `@/lib/site-schema` and is emitted once from the root layout, and
 * documentation pages build their own article/breadcrumb graph there too —
 * so this file only covers the one page-level type that has no other home.
 */
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
      dangerouslySetInnerHTML={{ __html: serializeSchema(faqData) }}
    />
  );
}
