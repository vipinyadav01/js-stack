import { Suspense } from "react";
import { StackBuilder } from "./_components/stack-builder";
import { Metadata } from "next";
import { generateSEOMetadata } from "@/components/seo";
import { Sparkles, Zap, Code2 } from "lucide-react";

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

// Enhanced Loading Component
function BuilderLoadingState() {
  return (
    <div className="flex h-[calc(100vh-64px)] items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 animate-gradient-shift" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] animate-pulse" />

      {/* Floating Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed" />

      {/* Loading Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Animated Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-50 animate-pulse" />
          <div className="relative bg-gradient-to-br from-primary/20 to-purple-500/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <Code2 className="h-12 w-12 text-primary animate-pulse" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-3">
          <div className="flex items-center gap-2 justify-center">
            <Sparkles className="h-5 w-5 text-primary animate-spin" />
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Initializing Stack Builder
            </h2>
            <Zap className="h-5 w-5 text-purple-500 animate-pulse" />
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">
            Preparing your interactive experience...
          </p>
        </div>

        {/* Loading Bar */}
        <div className="w-64 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 animate-loading-bar" />
        </div>

        {/* Shimmer Cards */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-20 h-20 rounded-xl bg-gradient-to-br from-secondary/50 to-secondary/20 backdrop-blur-sm border border-border/50 animate-shimmer"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function NewPage() {
  return (
    <Suspense fallback={<BuilderLoadingState />}>
      <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden bg-background">
        {/* Enhanced Ambient Background */}
        <div className="absolute inset-0 -z-10">
          {/* Animated Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] animate-grid-flow" />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />

          {/* Floating Orbs with Glassmorphism */}
          <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent blur-3xl opacity-40 animate-float" />
          <div className="absolute right-0 bottom-0 translate-x-1/2 translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-transparent blur-3xl opacity-40 animate-float-delayed" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent blur-3xl opacity-30 animate-float-slow" />

          {/* Radial Gradient Accent */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.05),transparent_50%)]" />
        </div>

        {/* Full Screen Builder Area with Enhanced Container */}
        <div className="h-full w-full flex flex-col relative">
          {/* Subtle Top Border Glow */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <StackBuilder />
        </div>
      </div>
    </Suspense>
  );
}
