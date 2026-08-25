import { docs, meta } from ".source";
import { loader } from "fumadocs-core/source";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";

// The Fumadocs page-tree + page loader for everything under content/docs.
export const source = loader({
  baseUrl: "/docs",
  source: toFumadocsSource(docs, meta),
});
