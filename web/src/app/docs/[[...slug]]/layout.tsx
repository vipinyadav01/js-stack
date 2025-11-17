import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { pageTree } from "@/app/source";
import type { ReactNode } from "react";
import { Navigation } from "@/components/navigation";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <DocsLayout
        tree={pageTree}
        nav={{
          title: "JS-Stack CLI",
          url: "/",
        }}
        links={[
          {
            text: "Documentation",
            url: "/docs",
            active: "nested-url",
          },
          {
            text: "GitHub",
            url: "https://github.com/vipinyadav01/js-stack",
            external: true,
          },
        ]}
      >
        {children}
      </DocsLayout>
    </div>
  );
}
