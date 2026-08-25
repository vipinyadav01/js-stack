import { createFromSource } from "fumadocs-core/search/server";
import { source } from "@/lib/source";

// Static search index built from the docs content.
export const { GET } = createFromSource(source);
