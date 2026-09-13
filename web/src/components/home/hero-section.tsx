"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Zap,
  ArrowRight,
  Terminal,
  Copy,
  Check,
  Sparkles,
  Layers,
  Database,
  Coffee,
} from "lucide-react";
import { CTAButton } from "@/components/ui/cta-button";
import { cn } from "@/lib/utils";

type StackPresetKey = "nextjs" | "springboot" | "express";

interface StackDemo {
  label: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  command: string;
  outputs: { label: string; text: string; success?: boolean }[];
}

const STACK_DEMOS: Record<StackPresetKey, StackDemo> = {
  nextjs: {
    label: "Next.js full-stack",
    badge: "Most Popular",
    icon: Layers,
    command:
      "npx @vipinyadav02/createjsstack@latest my-app --preset next-fullstack --yes",
    outputs: [
      {
        label: "Frontend",
        text: "Next.js application",
        success: true,
      },
      {
        label: "Backend",
        text: "Next.js server runtime",
        success: true,
      },
      {
        label: "Database",
        text: "PostgreSQL",
        success: true,
      },
      {
        label: "ORM",
        text: "Prisma",
        success: true,
      },
      {
        label: "Runtime",
        text: "Node.js",
        success: true,
      },
    ],
  },
  springboot: {
    label: "React + Spring Boot",
    badge: "Enterprise",
    icon: Coffee,
    command:
      "npx @vipinyadav02/createjsstack@latest my-app --preset react-springboot --yes",
    outputs: [
      {
        label: "Frontend",
        text: "React application",
        success: true,
      },
      {
        label: "Backend",
        text: "Spring Boot Maven service",
        success: true,
      },
      {
        label: "Database",
        text: "PostgreSQL",
        success: true,
      },
      {
        label: "Data",
        text: "Spring Data JPA",
        success: true,
      },
      {
        label: "API & Auth",
        text: "REST with Spring Security",
        success: true,
      },
    ],
  },
  express: {
    label: "MERN Stack",
    badge: "Classic",
    icon: Database,
    command:
      "npx @vipinyadav02/createjsstack@latest my-app --preset mern --yes",
    outputs: [
      {
        label: "Frontend",
        text: "React application",
        success: true,
      },
      {
        label: "Backend",
        text: "Express application",
        success: true,
      },
      {
        label: "Database",
        text: "MongoDB",
        success: true,
      },
      {
        label: "ODM",
        text: "Mongoose",
        success: true,
      },
      {
        label: "Runtime",
        text: "Node.js",
        success: true,
      },
    ],
  },
};

const CORE_ECOSYSTEM = [
  { name: "Next.js 15", category: "Frontend" },
  { name: "React 19", category: "Frontend" },
  { name: "Vue 3", category: "Frontend" },
  { name: "Spring Boot 3", category: "Java 21" },
  { name: "Express / NestJS", category: "Backend" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Prisma / JPA", category: "ORM" },
  { name: "Better Auth", category: "Security" },
  { name: "Docker", category: "DevOps" },
];

export function HeroSection() {
  const [activeStack, setActiveStack] = useState<StackPresetKey>("nextjs");
  const [copied, setCopied] = useState(false);

  const currentDemo = STACK_DEMOS[activeStack];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentDemo.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-border/50 bg-background dark:bg-[#090a0f]">
      {/* Background radial gradients for subtle SaaS atmosphere */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[840px] h-[480px] bg-primary/10 dark:bg-primary/[0.08] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none" />

      {/* Subtle SaaS Dot Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
          {/* Eyebrow / Release Badge */}
          <Link
            href="/new/"
            className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border/80 dark:border-white/10 bg-secondary/70 dark:bg-white/[0.03] hover:bg-secondary dark:hover:bg-white/[0.06] hover:border-primary/40 text-foreground transition-all duration-300 shadow-xs hover:shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">
              JS-Stack CLI v1.3.0 · Full-Stack Generator for JS &amp; Java
            </span>
            <span className="font-mono text-xs font-semibold text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Explore Builder
              <ArrowRight className="size-3" />
            </span>
          </Link>

          {/* Primary H1 Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-mono font-black tracking-tight text-foreground leading-[1.08]">
            Scaffold production-ready{" "}
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent underline decoration-primary/30 underline-offset-8">
              full-stack apps
            </span>{" "}
            in JavaScript &amp; Java
          </h1>

          {/* Value Proposition Description */}
          <p className="text-base sm:text-lg text-muted-foreground font-sans max-w-2xl leading-relaxed">
            Stop stitching boilerplate from scratch. One CLI command generates
            your frontend, backend, database, and auth in seconds — React,
            Next.js, or Vue paired with Express, NestJS, or Spring Boot, with
            typed configuration and optional tooling ready to add.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md pt-2">
            <CTAButton
              asChild
              variant="primary"
              size="lg"
              className="w-full sm:w-auto flex-1 shadow-md shadow-orange-500/25"
            >
              <Link href="/new/" className="flex items-center gap-2">
                <Zap className="size-4" />
                <span>Start building stack</span>
                <ArrowRight className="size-4" />
              </Link>
            </CTAButton>

            <CTAButton
              asChild
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link href="/docs/" className="flex items-center gap-2">
                <Terminal className="size-4 text-muted-foreground" />
                <span>Documentation</span>
              </Link>
            </CTAButton>
          </div>

          {/* Interactive Stack Preview & Terminal Showcase */}
          <div className="w-full max-w-3xl pt-8">
            <div className="rounded-2xl border border-border/80 dark:border-white/10 bg-card dark:bg-[#0d0e15] shadow-2xl overflow-hidden text-left transition-all duration-300">
              {/* Terminal Window Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-border/60 dark:border-white/[0.08] bg-muted/40 dark:bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-red-500/80" />
                  <div className="size-3 rounded-full bg-yellow-500/80" />
                  <div className="size-3 rounded-full bg-green-500/80" />
                  <span className="font-mono text-xs text-muted-foreground ml-2 hidden sm:inline">
                    terminal · js-stack generator
                  </span>
                </div>

                {/* Preset Selector Tabs */}
                <div className="flex items-center gap-1 rounded-xl bg-secondary/80 dark:bg-white/[0.04] p-1 border border-border/50 dark:border-white/[0.06]">
                  {(Object.keys(STACK_DEMOS) as StackPresetKey[]).map((key) => {
                    const demo = STACK_DEMOS[key];
                    const isSelected = activeStack === key;
                    const Icon = demo.icon;

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setActiveStack(key)}
                        className={cn(
                          "flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-xs transition-all cursor-pointer",
                          isSelected
                            ? "bg-background dark:bg-white/[0.1] text-foreground font-semibold shadow-xs"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <Icon className="size-3" />
                        <span>{demo.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Command Bar with Copy Button */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40 dark:border-white/[0.05] bg-muted/20 dark:bg-black/30 font-mono text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-primary font-bold select-none">$</span>
                  <code className="text-foreground/90 truncate font-mono">
                    {currentDemo.command}
                  </code>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  title="Copy command"
                  aria-label="Copy command"
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-mono font-medium text-muted-foreground hover:text-foreground bg-secondary/60 hover:bg-secondary border border-border/60 transition-colors shrink-0 ml-2"
                >
                  {copied ? (
                    <>
                      <Check className="size-3 text-emerald-500" />
                      <span className="text-emerald-500">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Output Inspection Grid */}
              <div className="p-4 sm:p-5 space-y-2 font-mono text-xs bg-card/60 dark:bg-[#0c0d12]/60">
                <div className="text-muted-foreground text-[11px] pb-1">
                  ✔ Configuration verified &amp; scaffolding layered
                  architecture:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {currentDemo.outputs.map((out) => (
                    <div
                      key={out.label}
                      className="flex items-start gap-2 p-2 rounded-lg border border-border/40 dark:border-white/[0.04] bg-muted/30 dark:bg-white/[0.02]"
                    >
                      <Check className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <span className="font-semibold text-foreground text-[11px]">
                          {out.label}:
                        </span>{" "}
                        <span className="text-muted-foreground text-[11px]">
                          {out.text}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-2 text-[11px] text-primary flex items-center gap-1.5 font-semibold">
                  <Sparkles className="size-3" />
                  <span>
                    Compatibility-checked selections and layered templates,
                    generated automatically.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Supported Core Frameworks Stripline */}
          <div className="pt-6 w-full max-w-4xl">
            <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-3">
              Production Stack Modules Supported Out of the Box
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {CORE_ECOSYSTEM.map((tech) => (
                <div
                  key={tech.name}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/70 dark:border-white/10 bg-secondary/40 dark:bg-white/[0.02] text-xs font-mono text-foreground hover:border-primary/40 transition-colors shadow-2xs"
                >
                  <span className="font-semibold">{tech.name}</span>
                  <span className="text-[10px] text-muted-foreground">
                    ({tech.category})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
