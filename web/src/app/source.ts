import { loader } from "fumadocs-core/source";
import { createMDXSource } from "fumadocs-mdx";

// Create a simple empty source for now to unblock the build
// The docs pages will still work with the static file structure
export const source = loader({
  baseUrl: "/docs",
  source: createMDXSource([], []),
});

export const pageTree = source.pageTree;
