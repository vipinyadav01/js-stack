import { Metadata } from "next";
import { analyticsPageMetadata } from "@/components/seo";

export const metadata: Metadata = analyticsPageMetadata;

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
