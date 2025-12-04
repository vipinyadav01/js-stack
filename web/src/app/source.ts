import { loader } from "fumadocs-core/source";
import { createMDXSource } from "fumadocs-mdx";
import * as fs from "fs";
import { join } from "path";

// Read MDX files from content/docs directory
const currentDir = process.cwd();
let docsDir = join(currentDir, "content", "docs");

// If not found, try web/content/docs (in case running from root)
if (fs.existsSync && !fs.existsSync(docsDir)) {
  docsDir = join(currentDir, "web", "content", "docs");
}

function getFiles(
  dir: string,
  baseDir: string = "",
): Array<{ file: string; content: string }> {
  try {
    if (!fs.existsSync(dir)) {
      return [];
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let files: Array<{ file: string; content: string }> = [];

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      const relativePath = baseDir ? join(baseDir, entry.name) : entry.name;

      if (entry.isDirectory()) {
        files = [...files, ...getFiles(fullPath, relativePath)];
      } else if (
        entry.isFile() &&
        (entry.name.endsWith(".mdx") || entry.name === "meta.json")
      ) {
        try {
          const content = fs.readFileSync(fullPath, "utf-8");
          files.push({ file: relativePath.replace(/\\/g, "/"), content });
        } catch (err) {
          // Skip files that can't be read
          console.warn(`Failed to read file: ${fullPath}`, err);
        }
      }
    }

    return files;
  } catch (err) {
    console.warn(`Failed to read directory: ${dir}`, err);
    return [];
  }
}

const allFiles = getFiles(docsDir);

const docs = allFiles
  .filter((f) => f.file.endsWith(".mdx"))
  .map((f: { file: string; content: string }) => {
    const url = f.file.replace(".mdx", "").replace(/\\/g, "/");
    const fullPath = url.startsWith("/") ? url : `/${url}`;
    return {
      file: f.file,
      url: fullPath,
      fullPath: fullPath,
      content: f.content,
    };
  });

const meta = allFiles
  .filter((f) => f.file.endsWith("meta.json"))
  .map((f) => {
    const path = f.file.replace("meta.json", "").replace(/\\/g, "/");
    const fullPath = path.startsWith("/") ? path : `/${path}`;
    return {
      file: f.file,
      path: fullPath,
      fullPath: fullPath,
      content: f.content,
    };
  });

let sourceInstance;
try {
  sourceInstance = loader({
    baseUrl: "/docs",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    source: createMDXSource(docs as any, meta as any),
  });
} catch (error) {
  console.error("Failed to create source:", error);
  // Fallback to empty source
  sourceInstance = loader({
    baseUrl: "/docs",
    source: createMDXSource([], []),
  });
}

export const source = sourceInstance;

export const pageTree = source.pageTree;
