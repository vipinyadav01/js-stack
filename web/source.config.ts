import { defineDocs, defineConfig } from "fumadocs-mdx/config";

export const { docs, meta } = defineDocs({
  dir: "content/docs",
  docs: {
    // Keep the processed Markdown around so we can serve it to LLMs
    // (llms.txt, llms-full.txt, and the *.md endpoints).
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
});

export default defineConfig();
