import type { ReactNode } from "react";
import type { Metadata } from "next";
import { generateSEOMetadata } from "@/components/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Sponsors - Support JS-Stack CLI",
  description:
    "Support JS-Stack CLI development. View our sponsors, GitHub sponsors, and community supporters. Help us build better developer tools.",
  url: "/sponsors",
  keywords: [
    "sponsors",
    "support",
    "github sponsors",
    "open source",
    "community",
    "donate",
  ],
});

export default function SponsorsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
