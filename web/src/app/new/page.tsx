import { Suspense } from "react";
import { StackBuilder } from "./_components/stack-builder";
import { Metadata } from "next";
import { generateSEOMetadata } from "@/components/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Interactive Stack Builder - Build Your Perfect JavaScript Project",
  description:
    "Build your perfect JavaScript full-stack project with our interactive stack builder. Choose from React, Next.js, Node.js, Express, databases, authentication, and more. Generate your project configuration instantly.",
  url: "/new",
  keywords: [
    "stack builder",
    "project generator",
    "javascript stack",
    "interactive builder",
    "project configuration",
    "full-stack builder",
    "react stack",
    "nextjs stack",
  ],
});

export default function NewPage() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
      <div className="grid h-[calc(100vh-64px)] w-full flex-1 grid-cols-1 overflow-hidden">
        <StackBuilder />
      </div>
    </Suspense>
  );
}
