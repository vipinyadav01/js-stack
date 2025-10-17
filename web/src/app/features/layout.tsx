import type { Metadata } from "next";
import { featuresPageMetadata } from "@/components/seo";

export const metadata: Metadata = featuresPageMetadata;

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-screen overflow-hidden">{children}</div>;
}
