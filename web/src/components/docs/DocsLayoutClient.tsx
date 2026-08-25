"use client";

import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider/next";
import type * as PageTree from "fumadocs-core/page-tree";

interface DocsLayoutClientProps {
  tree: PageTree.Root;
  children: ReactNode;
}

export function DocsLayoutClient({ tree, children }: DocsLayoutClientProps) {
  return (
    <RootProvider theme={{ enabled: false }}>
      <div suppressHydrationWarning>
        <DocsLayout
          tree={tree}
          nav={{ enabled: false }}
          githubUrl="https://github.com/vipinyadav01/js-stack"
          containerProps={{ suppressHydrationWarning: true }}
        >
          {children}
        </DocsLayout>
      </div>
    </RootProvider>
  );
}
