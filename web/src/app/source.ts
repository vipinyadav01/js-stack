import { loader } from "fumadocs-core/source";
import { createMDXSource } from "fumadocs-mdx";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

// Read MDX files from content/docs directory
const docsDir = join(process.cwd(), "web", "content", "docs");

function getMDXFiles() {
  try {
    const files = readdirSync(docsDir);
    return files
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => {
        const filePath = join(docsDir, file);
        const content = readFileSync(filePath, "utf-8");
        return { file: file, content };
      });
  } catch {
    return [];
  }
}

const mdxFiles = getMDXFiles();
const docs = mdxFiles.map((f) => ({
  file: f.file,
  url: f.file.replace(".mdx", ""),
  content: f.content,
}));

const meta = mdxFiles.map((f) => {
  const frontmatterMatch = f.content.match(/^---\n([\s\S]*?)\n---/);
  const frontmatter = frontmatterMatch
    ? frontmatterMatch[1].split("\n").reduce(
        (acc, line) => {
          const [key, ...valueParts] = line.split(":");
          if (key && valueParts.length > 0) {
            acc[key.trim()] = valueParts
              .join(":")
              .trim()
              .replace(/^["']|["']$/g, "");
          }
          return acc;
        },
        {} as Record<string, string>,
      )
    : {};

  return {
    file: f.file,
    url: f.file.replace(".mdx", ""),
    title: frontmatter.title || f.file.replace(".mdx", ""),
    description: frontmatter.description || "",
  };
});

// Use type assertion to work with Fumadocs API
export const source = loader({
  baseUrl: "/docs",
  source: createMDXSource(docs as never, meta as never),
});

export const pageTree = source.pageTree;
