"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Copy,
  Terminal,
  Globe,
  Zap,
  ShieldCheck,
  Cpu,
} from "lucide-react";

export default function Hero() {
  const [copied, setCopied] = useState(false);
  const command = "npx @vipinyadav02/createjsstack@latest my-app --yolo";

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const techBadges = [
    { name: "Next.js 15", icon: "▲" },
    { name: "React 19", icon: "⚛️" },
    { name: "Vue 3", icon: "💚" },
    { name: "Express", icon: "🚂" },
    { name: "Fastify", icon: "⚡" },
    { name: "Postgres", icon: "🐘" },
    { name: "MongoDB", icon: "🍃" },
    { name: "Prisma", icon: "⚡" },
    { name: "Docker", icon: "🐳" },
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-24 border-b border-border/50 bg-background dark:bg-[#090a0f]">
      {/* Background Ambient Glows & Mesh Pattern */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto space-y-8">

          {/* Cloudflare-Style Announcement Banner */}
          <Link
            href="/new"
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 hover:border-primary/60 text-primary text-xs sm:text-sm font-mono tracking-wide backdrop-blur-md transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-primary/10"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Connect 2026 · JS-Stack CLI v1.2.16 · The Full-Stack Generator</span>
            <span className="text-muted-foreground group-hover:text-primary transition-colors">·</span>
            <span className="font-semibold underline underline-offset-4 group-hover:text-foreground transition-colors flex items-center gap-1">
              Start Building <ArrowRight className="h-3.5 w-3.5 inline-block group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>

          {/* Cloudflare Signature Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-mono font-extrabold text-foreground tracking-tight leading-[1.08] max-w-4xl">
            Everything we learned from generating{" "}
            <span className="text-primary underline decoration-primary/30 underline-offset-8">
              1,000+ apps
            </span>
            — yours by default
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-muted-foreground font-sans max-w-3xl leading-relaxed font-normal">
            One CLI platform for your frontends, backends, databases, and authentication.
            Build, scaffold, and scale production-ready code without managing complex boilerplate.
          </p>

          {/* CTA Buttons Group */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-xl pt-2">
            <Link
              href="/new"
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 px-10 py-4 rounded-md bg-primary text-primary-foreground font-mono text-sm font-bold hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99]"
            >
              <Zap className="h-4 w-4" />
              <span>Start building</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            {/* Quick Copy Command Pill */}
            <button
              onClick={handleCopy}
              className="w-full sm:w-auto flex-1 flex items-center justify-between gap-3 px-6 py-4 rounded-md bg-card border border-border text-foreground font-mono text-xs hover:border-primary/60 transition-all duration-200 shadow-sm hover:shadow-md group"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <Terminal className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="truncate">npx @vipinyadav02/createjsstack</span>
              </div>
              {copied ? (
                <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              )}
            </button>
          </div>

          {/* Cloudflare Region: Earth 3-Column Feature Mesh */}
          <div className="w-full pt-10">
            <div className="relative mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-3 border border-border/60 rounded-xl bg-card/40 backdrop-blur-md overflow-hidden text-left shadow-xl">
              {/* Corner crosshairs decor */}
              <div className="pointer-events-none absolute -left-1.5 -top-1.5 h-3 w-3 rounded-sm border border-primary/50 bg-background" />
              <div className="pointer-events-none absolute -right-1.5 -top-1.5 h-3 w-3 rounded-sm border border-primary/50 bg-background" />
              <div className="pointer-events-none absolute -left-1.5 -bottom-1.5 h-3 w-3 rounded-sm border border-primary/50 bg-background" />
              <div className="pointer-events-none absolute -right-1.5 -bottom-1.5 h-3 w-3 rounded-sm border border-primary/50 bg-background" />

              {/* Column 1 */}
              <div className="p-6 lg:p-8 border-b md:border-b-0 md:border-r border-border/60 hover:bg-card/80 transition-colors">
                <div className="flex flex-col space-y-3">
                  <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 w-fit text-primary">
                    <Globe className="h-5 w-5" />
                  </div>
                  <h3 className="font-mono font-bold text-lg text-foreground pt-1">Run everywhere</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                    Scaffold frontends across Next.js 15, React 19, Vue 3, Angular, and Svelte paired with Express, Fastify, Koa, or NestJS seamlessly.
                  </p>
                </div>
              </div>

              {/* Column 2 */}
              <div className="p-6 lg:p-8 border-b md:border-b-0 md:border-r border-border/60 hover:bg-card/80 transition-colors">
                <div className="flex flex-col space-y-3">
                  <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 w-fit text-primary">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <h3 className="font-mono font-bold text-lg text-foreground pt-1">Deploy anywhere</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                    Pre-configured deployment scripts for Vercel, Cloudflare Workers, AWS, Docker containers, or self-hosted servers with zero setup overhead.
                  </p>
                </div>
              </div>

              {/* Column 3 */}
              <div className="p-6 lg:p-8 hover:bg-card/80 transition-colors">
                <div className="flex flex-col space-y-3">
                  <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 w-fit text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h3 className="font-mono font-bold text-lg text-foreground pt-1">Run at massive scale</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                    Built-in Prisma, D1, Mongoose, Better Auth, Vitest testing, and CI/CD pipelines. No more manual boilerplate planning. Ever.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Terminal Mockup Preview */}
          <div className="w-full max-w-4xl pt-4 text-left">
            <div className="rounded-xl border border-border/70 bg-[#0d0d0d] shadow-2xl overflow-hidden font-mono text-xs sm:text-sm">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-[#121215]">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <div className="text-muted-foreground text-xs flex items-center gap-1.5 font-mono">
                  <Terminal className="h-3.5 w-3.5 text-primary" />
                  <span>bash — js-stack init --yolo</span>
                </div>
              </div>
              <div className="p-5 space-y-2 text-foreground/90 font-mono overflow-x-auto">
                <div className="flex items-center gap-2">
                  <span className="text-primary font-bold">$</span>
                  <span className="text-foreground">npx @vipinyadav02/createjsstack@latest my-app</span>
                </div>
                <div className="text-muted-foreground text-xs pt-1">
                  ┌ Scaffolding your full-stack application...
                </div>
                <div className="text-emerald-400 text-xs flex items-center gap-2 pl-3">
                  <span>✔</span> <span>Frontend: Next.js 15 (App Router, Tailwind CSS, TypeScript)</span>
                </div>
                <div className="text-emerald-400 text-xs flex items-center gap-2 pl-3">
                  <span>✔</span> <span>Backend: Express.js (TypeScript Server)</span>
                </div>
                <div className="text-emerald-400 text-xs flex items-center gap-2 pl-3">
                  <span>✔</span> <span>Database: PostgreSQL + Prisma ORM</span>
                </div>
                <div className="text-emerald-400 text-xs flex items-center gap-2 pl-3">
                  <span>✔</span> <span>Auth: Better Auth (JWT + OAuth pre-configured)</span>
                </div>
                <div className="text-emerald-400 text-xs flex items-center gap-2 pl-3">
                  <span>✔</span> <span>Addons: Docker Compose, Vitest, Biome</span>
                </div>
                <div className="text-primary text-xs pt-2 pl-3 font-semibold">
                  ✨ Project created in ./my-app. Ready for development!
                </div>
              </div>
            </div>
          </div>

          {/* Supported Technology Badges */}
          <div className="pt-6 w-full">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
              Supported Core Frameworks & Ecosystems
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {techBadges.map((badge) => (
                <div
                  key={badge.name}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card/60 text-xs font-mono text-foreground hover:border-primary/50 transition-colors shadow-sm"
                >
                  <span>{badge.icon}</span>
                  <span>{badge.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
