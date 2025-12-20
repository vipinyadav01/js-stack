import { pageTree } from "@/app/source";
import type { ReactNode } from "react";
import { Navigation } from "@/components/navigation";
import { DocsLayoutWrapper } from "./docs-layout-wrapper";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <DocsLayoutWrapper tree={pageTree}>{children}</DocsLayoutWrapper>
    </div>
  );
}
