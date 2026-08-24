"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Monitor,
  Cpu,
  Database,
  Layers,
  Lock,
  Wrench,
  Package,
  Globe,
  CheckCircle2,
  LayoutGrid,
  List,
  Zap,
  ArrowRight,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TechItem {
  name: string;
  category: string;
  version?: string;
  description: string;
  icon?: string;
  badge?: string;
}

const CATEGORIES = [
  { id: "all", label: "All Stacks", icon: LayoutGrid },
  { id: "frontend", label: "Frontend", icon: Monitor },
  { id: "backend", label: "Backend", icon: Cpu },
  { id: "database", label: "Database", icon: Database },
  { id: "orm", label: "ORM / ODM", icon: Layers },
  { id: "auth", label: "Authentication", icon: Lock },
  { id: "addons", label: "Tooling & Addons", icon: Wrench },
  { id: "deploy", label: "Deployment", icon: Globe },
];

const TECH_STACK: TechItem[] = [
  // Frontends
  { name: "Next.js 15", category: "frontend", version: "15+", description: "Full-stack React framework with App Router, SSR & Server Actions", icon: "▲", badge: "Recommended" },
  { name: "React 19", category: "frontend", version: "19+", description: "Modern React with Vite, TypeScript & Concurrent Features", icon: "⚛️", badge: "Popular" },
  { name: "Vue 3", category: "frontend", version: "3+", description: "Vue 3 with Composition API, Script Setup & Vite tooling", icon: "💚" },
  { name: "Angular", category: "frontend", version: "18+", description: "Enterprise-grade TypeScript framework with modern signals", icon: "🅰️" },
  { name: "Svelte 5", category: "frontend", version: "5+", description: "Cybernetically enhanced web apps with reactive runes", icon: "🔥" },
  { name: "Nuxt 3", category: "frontend", version: "3+", description: "Intuitive Vue full-stack framework with auto-imports", icon: "💚" },
  { name: "Remix", category: "frontend", version: "2+", description: "Full-stack web framework focused on web standards & UX", icon: "💿" },
  { name: "Astro", category: "frontend", version: "4+", description: "Content-driven web framework with island architecture", icon: "🚀" },
  { name: "Solid.js", category: "frontend", version: "1.8+", description: "Declarative, efficient and flexible JS library for UI", icon: "🔵" },
  { name: "React Native", category: "frontend", version: "0.74+", description: "Cross-platform mobile apps with NativeWind styling", icon: "📱" },

  // Backends
  { name: "Express.js", category: "backend", version: "4+", description: "Fast, unopinionated, minimalist web framework for Node.js", icon: "🚂", badge: "Recommended" },
  { name: "Fastify", category: "backend", version: "4+", description: "High-performance Node.js framework focused on low overhead", icon: "⚡", badge: "High Speed" },
  { name: "NestJS", category: "backend", version: "10+", description: "Progressive Node.js framework for enterprise architectures", icon: "🪶" },
  { name: "Koa.js", category: "backend", version: "2+", description: "Next generation web framework designed by Express team", icon: "🌿" },
  { name: "Hono", category: "backend", version: "4+", description: "Ultrafast web framework for Cloudflare Workers & Node.js", icon: "🔥" },
  { name: "Elysia.js", category: "backend", version: "1+", description: "Ergonomic Bun web framework with End-to-End type safety", icon: "🦊" },

  // Databases
  { name: "PostgreSQL", category: "database", description: "World's most advanced open-source relational SQL database", icon: "🐘", badge: "Recommended" },
  { name: "MongoDB", category: "database", description: "Scalable NoSQL document database for modern cloud applications", icon: "🍃", badge: "Popular" },
  { name: "SQLite", category: "database", description: "Lightweight, zero-config embedded SQL database engine", icon: "📦" },
  { name: "MySQL", category: "database", description: "Proven, enterprise relational database management system", icon: "🐬" },

  // ORMs
  { name: "Prisma", category: "orm", description: "Next-generation ORM with automated migrations & end-to-end types", icon: "⚡", badge: "Recommended" },
  { name: "Mongoose", category: "orm", description: "Elegant MongoDB object modeling for Node.js with strict schemas", icon: "🍃" },
  { name: "Drizzle ORM", category: "orm", description: "Headless TypeScript ORM with maximum performance & zero overhead", icon: "🌧️", badge: "Modern" },
  { name: "TypeORM", category: "orm", description: "Decorator-based ORM supporting Data Mapper & Active Record patterns", icon: "🔷" },
  { name: "Sequelize", category: "orm", description: "Promise-based Node.js ORM for Postgres, MySQL, SQLite", icon: "🔵" },

  // Auth
  { name: "Better Auth", category: "auth", description: "Comprehensive TypeScript-first auth framework with multi-tenant sessions", icon: "🛡️", badge: "Recommended" },
  { name: "Clerk", category: "auth", description: "Complete user management & authentication platform with UI components", icon: "🔐" },
  { name: "Lucia Auth", category: "auth", description: "Flexible session management library that connects directly to your DB", icon: "🔑" },
  { name: "NextAuth / Auth.js", category: "auth", description: "Flexible authentication library for Next.js and full-stack apps", icon: "🔒" },
  { name: "JWT + OAuth", category: "auth", description: "Custom JSON Web Token authentication with Google & GitHub OAuth", icon: "🔑" },

  // Addons
  { name: "Docker Compose", category: "addons", description: "Containerized development & production environment configurations", icon: "🐳", badge: "Recommended" },
  { name: "Biome", category: "addons", description: "Ultra-fast linter & formatter replacing ESLint and Prettier", icon: "⚡" },
  { name: "Turborepo", category: "addons", description: "High-performance build system for JavaScript & TypeScript monorepos", icon: "🏎️" },
  { name: "Vitest", category: "addons", description: "Blazing fast unit & integration testing framework powered by Vite", icon: "🧪" },
  { name: "Playwright", category: "addons", description: "Reliable end-to-end browser testing for modern web applications", icon: "🎭" },
  { name: "Cypress", category: "addons", description: "Fast, easy and reliable testing for anything that runs in a browser", icon: "🌲" },

  // Deployment
  { name: "Vercel", category: "deploy", description: "Zero-config deployment platform optimized for Next.js & static sites", icon: "▲", badge: "1-Click" },
  { name: "Cloudflare Workers", category: "deploy", description: "Serverless execution environment deployed across global edge locations", icon: "☁️" },
  { name: "Cloudflare Pages", category: "deploy", description: "JAMstack platform for frontend developers with instant deployments", icon: "⚡" },
  { name: "Docker Container", category: "deploy", description: "Standardized container builds ready for AWS, GCP, or self-hosted VPS", icon: "🐳" },
];

export default function FeaturesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredTech = TECH_STACK.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Hero Header Section */}
      <div className="border-b border-border/50 bg-background dark:bg-[#090a0f] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-4 lg:px-6 py-10 lg:py-16 relative z-10 text-center max-w-4xl space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>JS-STACK V1.2.16 // FEATURES & TECH STACK</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-mono font-extrabold text-foreground tracking-tight leading-[1.08]">
            Features & <span className="text-primary underline decoration-primary/30 underline-offset-8">Tech Stack</span> Explorer
          </h1>

          <p className="text-base sm:text-xl text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed">
            Explore all supported CLI features, frontend frameworks, backend servers, databases, ORMs, and deployment tooling.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/new"
              className="flex items-center gap-2 px-8 py-3.5 rounded-md bg-primary text-primary-foreground font-mono text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:scale-[1.01]"
            >
              <Zap className="h-4 w-4" />
              <span>Interactive Stack Builder</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href="https://github.com/vipinyadav01/js-stack"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3.5 rounded-md border border-border bg-card font-mono text-sm font-medium hover:border-primary/60 transition-all"
            >
              <Terminal className="h-4 w-4 text-primary" />
              <span>CLI Commands</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 lg:px-6 pt-10 pb-32 lg:pt-14 lg:pb-44 max-w-7xl">

        {/* Category Controls & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-border/60 pb-6 mb-8">

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md font-mono text-xs transition-all whitespace-nowrap",
                    isActive
                      ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20"
                      : "bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search & Grid/List View Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search frameworks, ORMs, auth..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 px-3.5 py-2 rounded-md border border-border/80 bg-card font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-all"
            />

            <div className="flex items-center gap-1 border border-border/80 rounded-md p-1 bg-card shrink-0">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-1.5 rounded text-xs transition-colors",
                  viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
                title="Grid View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-1.5 rounded text-xs transition-colors",
                  viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
                title="List View"
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tech Stack Cards Display */}
        {filteredTech.length === 0 ? (
          <div className="text-center py-16 border border-border/60 rounded-xl bg-card/40 font-mono">
            <Package className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-foreground font-bold">No tech stack matches your query</p>
            <p className="text-xs text-muted-foreground mt-1">Try resetting search filter or choosing another category.</p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="mt-4 px-4 py-2 rounded bg-primary/10 border border-primary/30 text-primary text-xs font-mono hover:bg-primary/20 transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTech.map((item) => (
              <div
                key={item.name}
                className="relative group rounded-xl border border-border/70 bg-card dark:bg-[#0d0d0d] p-6 shadow-xl hover:border-primary/60 transition-all hover:shadow-primary/5 flex flex-col justify-between"
              >
                {/* Cloudflare Corner Crosshairs */}
                <div className="pointer-events-none absolute -left-1 -top-1 h-2.5 w-2.5 rounded-sm border border-primary/50 bg-background" />
                <div className="pointer-events-none absolute -right-1 -top-1 h-2.5 w-2.5 rounded-sm border border-primary/50 bg-background" />
                <div className="pointer-events-none absolute -left-1 -bottom-1 h-2.5 w-2.5 rounded-sm border border-primary/50 bg-background" />
                <div className="pointer-events-none absolute -right-1 -bottom-1 h-2.5 w-2.5 rounded-sm border border-primary/50 bg-background" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{item.icon}</span>
                      <h3 className="font-mono font-bold text-lg text-foreground tracking-tight">
                        {item.name}
                      </h3>
                    </div>

                    {item.badge && (
                      <span className="rounded-full bg-primary/15 border border-primary/30 px-2 py-0.5 text-[10px] font-mono font-semibold text-primary">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-border/40 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>CLI Supported</span>
                  </div>
                  {item.version && (
                    <span className="text-muted-foreground">ver {item.version}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTech.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between p-4 rounded-xl border border-border/70 bg-card dark:bg-[#0d0d0d] hover:border-primary/60 transition-all font-mono"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-foreground">{item.name}</h3>
                      {item.badge && (
                        <span className="rounded bg-primary/15 border border-primary/30 px-1.5 py-0.5 text-[9px] text-primary font-semibold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-sans mt-0.5">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Ready
                  </span>
                  <Link
                    href="/new"
                    className="px-3 py-1.5 rounded bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
                  >
                    Select
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
