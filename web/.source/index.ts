// @ts-nocheck -- skip type checking
import * as meta_0 from "../content/docs/meta.json?collection=meta&hash=1764876314118";
import * as docs_3 from "../content/docs/technologies.mdx?collection=docs&hash=1764876314118";
import * as docs_2 from "../content/docs/getting-started.mdx?collection=docs&hash=1764876314118";
import * as docs_1 from "../content/docs/examples.mdx?collection=docs&hash=1764876314118";
import * as docs_0 from "../content/docs/commands.mdx?collection=docs&hash=1764876314118";
import { _runtime } from "fumadocs-mdx";
import * as _source from "../source.config";
export const docs = _runtime.doc<typeof _source.docs>([
  {
    info: { path: "commands.mdx", fullPath: "content\\docs\\commands.mdx" },
    data: docs_0,
  },
  {
    info: { path: "examples.mdx", fullPath: "content\\docs\\examples.mdx" },
    data: docs_1,
  },
  {
    info: {
      path: "getting-started.mdx",
      fullPath: "content\\docs\\getting-started.mdx",
    },
    data: docs_2,
  },
  {
    info: {
      path: "technologies.mdx",
      fullPath: "content\\docs\\technologies.mdx",
    },
    data: docs_3,
  },
]);
export const meta = _runtime.meta<typeof _source.meta>([
  {
    info: { path: "meta.json", fullPath: "content\\docs\\meta.json" },
    data: meta_0,
  },
]);
