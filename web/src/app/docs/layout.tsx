import type { ReactNode } from "react";
import { source } from "@/lib/source";
import { DocsLayoutClient } from "@/components/docs/DocsLayoutClient";

export default function DocsSectionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DocsLayoutClient tree={source.pageTree}>{children}</DocsLayoutClient>;
}
