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

function BuilderLoadingState() {
  return (
    <div className="flex h-[calc(100vh-64px)] w-full pt-16">
      {/* Sidebar Skeleton */}
      <div className="hidden lg:flex w-[260px] xl:w-[300px] flex-shrink-0 flex-col border-r border-border/50 bg-background h-[calc(100vh-64px)] fixed left-0 top-16 z-40">
        <div className="p-4 border-b border-border/50">
          <div className="h-10 bg-muted/50 rounded-md animate-pulse" />
        </div>
        <div className="p-4 space-y-4">
          <div className="h-24 bg-muted/50 rounded-md animate-pulse" />
          <div className="h-32 bg-muted/50 rounded-md animate-pulse" />
        </div>
      </div>

      <div className="hidden lg:block w-[260px] xl:w-[300px] flex-shrink-0" />

      {/* Main Content Skeleton */}
      <div className="flex-1 px-4 py-4">
        <div className="space-y-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-4">
              <div className="h-6 w-32 bg-muted/50 rounded animate-pulse" />
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5, 6].map((j) => (
                  <div
                    key={j}
                    className="h-12 bg-muted/50 rounded-md animate-pulse"
                    style={{ animationDelay: `${j * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function NewPage() {
  return (
    <Suspense fallback={<BuilderLoadingState />}>
      <StackBuilder />
    </Suspense>
  );
}
