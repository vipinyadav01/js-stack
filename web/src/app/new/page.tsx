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
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-64px)] items-center justify-center text-muted-foreground">
          Loading Builder...
        </div>
      }
    >
      <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden bg-background">
        {/* Ambient Background */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px] opacity-30"></div>
        <div className="absolute right-0 bottom-0 -z-10 h-[500px] w-[500px] translate-x-1/2 translate-y-1/2 rounded-full bg-purple-500/5 blur-[100px] opacity-30"></div>

        {/* Full Screen Builder Area */}
        <div className="h-full w-full flex flex-col">
          <StackBuilder />
        </div>
      </div>
    </Suspense>
  );
}
