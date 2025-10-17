"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export function ConditionalFooter() {
  const pathname = usePathname();

  // Hide footer on builder page (/new)
  const isBuilderPage = pathname.startsWith("/new");

  if (isBuilderPage) {
    return null;
  }

  return <Footer />;
}
