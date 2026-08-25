"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export function ConditionalFooter() {
  const pathname = usePathname();

  // Hide footer on builder page (/new) and docs pages (/docs)
  const isHiddenPage =
    pathname.startsWith("/new") || pathname.startsWith("/docs");

  if (isHiddenPage) {
    return null;
  }

  return <Footer />;
}
