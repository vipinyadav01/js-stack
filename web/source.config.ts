import { defineDocs, defineConfig } from "fumadocs-mdx/config";
import { pageSchema } from "fumadocs-core/source/schema";

// Search-facing frontmatter. `title` stays short because it also labels the
// sidebar; `seoTitle` is the keyword-bearing <title>, and `keywords` is a
// comma-separated list. Both reuse the schema's own optional-string type, so
// this file needs no direct zod import.
const optionalString = pageSchema.shape.description;

export const { docs, meta } = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema.extend({
      seoTitle: optionalString,
      keywords: optionalString,
    }),
    // Keep the processed Markdown around so we can serve it to LLMs
    // (llms.txt, llms-full.txt, and the *.md endpoints).
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
});

export default defineConfig();
