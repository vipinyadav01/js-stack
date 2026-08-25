import { source } from "@/lib/source";

// Convert a docs page into static Markdown for LLMs.
export async function getLLMText(page: (typeof source)["$inferPage"]) {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title} (${page.url})

${processed}`;
}
