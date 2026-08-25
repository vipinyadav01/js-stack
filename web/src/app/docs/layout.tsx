import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider/next";
import { source } from "@/lib/source";

export default function DocsSectionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    // The app already renders a global navbar + next-themes provider, so we
    // disable Fumadocs' own theme provider and top nav and only use its sidebar.
    <RootProvider theme={{ enabled: false }}>
      <DocsLayout
        tree={source.pageTree}
        nav={{ enabled: false }}
        githubUrl="https://github.com/vipinyadav01/js-stack"
      >
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
