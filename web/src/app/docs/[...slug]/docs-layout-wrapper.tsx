"use client";

import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";

interface DocsLayoutWrapperProps {
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tree: any;
}

export function DocsLayoutWrapper({ children, tree }: DocsLayoutWrapperProps) {
  return (
    <DocsLayout
      tree={tree}
      nav={{ title: "JS-Stack CLI", url: "/" }}
      links={[
        { text: "Documentation", url: "/docs", active: "nested-url" },
        {
          text: "GitHub",
          url: "https://github.com/vipinyadav01/js-stack",
          external: true,
        },
      ]}
    >
      {children}
    </DocsLayout>
  );
}
