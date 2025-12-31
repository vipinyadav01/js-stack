"use client";

import {
  Rocket,
  Package,
  CheckCircle,
  Star,
  Layers,
  Monitor,
  Wrench,
  Database,
  Lock,
  Cpu,
  Menu,
  Grid3X3,
  List,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

export default function Features() {
  // State management
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set([
      "overview",
      "frontend",
      "backend",
      "database",
      "orm",
      "auth",
      "devtools",
      "packages",
      "additional",
    ]),
  );

  // Filter categories
  const filterCategories = [
    {
      id: "overview",
      label: "Overview",
      icon: Star,
      description: "Quick feature overview",
    },
    {
      id: "frontend",
      label: "Frontend",
      icon: Monitor,
      description: "UI frameworks and libraries",
    },
    {
      id: "backend",
      label: "Backend",
      icon: Cpu,
      description: "Server-side frameworks",
    },
    {
      id: "database",
      label: "Database",
      icon: Database,
      description: "Data storage solutions",
    },
    {
      id: "orm",
      label: "ORM/ODM",
      icon: Layers,
      description: "Object mapping tools",
    },
    {
      id: "auth",
      label: "Authentication",
      icon: Lock,
      description: "Identity and security",
    },
    {
      id: "devtools",
      label: "Dev Tools",
      icon: Wrench,
      description: "Development utilities",
    },
    {
      id: "packages",
      label: "Package Managers",
      icon: Package,
      description: "Dependency management",
    },
    {
      id: "additional",
      label: "Additional",
      icon: Rocket,
      description: "Extra features and tools",
    },
  ];

  const toggleSection = (sectionId: string) => {
    setVisibleSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  // Frontend Frameworks
  const frontendFrameworks = [
    {
      name: "React",
      available: true,
      version: "18+",
      description: "With Vite, TypeScript, and modern tooling",
    },
    {
      name: "Vue.js",
      available: true,
      version: "3+",
      description: "Vue 3 with Composition API and Vite",
    },
    {
      name: "Angular",
      available: true,
      version: "16+",
      description: "Latest Angular with CLI integration",
    },
    {
      name: "Svelte",
      available: true,
      version: "4+",
      description: "SvelteKit with optimized builds",
    },
    {
      name: "Next.js",
      available: true,
      version: "14+",
      description: "Full-stack React framework",
    },
    {
      name: "Nuxt",
      available: true,
      version: "3+",
      description: "Vue.js full-stack framework",
    },
    {
      name: "React Native",
      available: true,
      version: "0.72+",
      description: "Mobile app development",
    },
  ];

  // Backend Frameworks
  const backendFrameworks = [
    {
      name: "Express.js",
      available: true,
      version: "4+",
      description: "Fast, minimalist web framework",
    },
    {
      name: "Fastify",
      available: true,
      version: "4+",
      description: "High-performance, low-overhead framework",
    },
    {
      name: "Koa.js",
      available: true,
      version: "2+",
      description: "Lightweight, expressive middleware framework",
    },
    {
      name: "Hapi.js",
      available: true,
      version: "21+",
      description: "Rich ecosystem with built-in validation",
    },
    {
      name: "NestJS",
      available: true,
      version: "10+",
      description: "Scalable Node.js framework with TypeScript",
    },
  ];

  // Databases
  const databases = [
    {
      name: "SQLite",
      available: true,
      description: "Lightweight, serverless database",
    },
    {
      name: "PostgreSQL",
      available: true,
      description: "Advanced open-source database",
    },
    {
      name: "MySQL",
      available: true,
      description: "Popular relational database",
    },
    {
      name: "MongoDB",
      available: true,
      description: "NoSQL document database",
    },
    {
      name: "Supabase",
      available: false,
      description: "Open source Firebase alternative",
    },
    {
      name: "PlanetScale",
      available: false,
      description: "Serverless MySQL platform",
    },
  ];

  // ORMs/ODMs
  const orms = [
    {
      name: "Prisma",
      available: true,
      description: "Next-generation ORM with type safety",
    },
    {
      name: "Sequelize",
      available: true,
      description: "Feature-rich ORM for SQL databases",
    },
    {
      name: "Mongoose",
      available: true,
      description: "Elegant MongoDB object modeling",
    },
    {
      name: "TypeORM",
      available: true,
      description: "Advanced ORM with decorator support",
    },
  ];

  // Authentication
  const authMethods = [
    {
      name: "JWT",
      available: true,
      description: "JSON Web Token implementation",
    },
    {
      name: "Passport",
      available: true,
      description: "Flexible authentication middleware",
    },
    {
      name: "Auth0",
      available: true,
      description: "Identity platform integration",
    },
    {
      name: "Firebase Auth",
      available: false,
      description: "Google's authentication service",
    },
    {
      name: "Clerk",
      available: false,
      description: "Modern authentication platform",
    },
    {
      name: "Lucia",
      available: false,
      description: "Lightweight authentication library",
    },
    {
      name: "Supabase Auth",
      available: false,
      description: "Open source auth solution",
    },
    {
      name: "Security Middleware",
      available: true,
      description: "Helmet, CORS, Rate limiting",
    },
  ];

  // Development & DevOps
  const devTools = [
    {
      name: "TypeScript",
      available: true,
      description: "Full TypeScript support across all templates",
    },
    {
      name: "Docker",
      available: true,
      description: "Complete containerization with Docker Compose",
    },
    {
      name: "Jest",
      available: true,
      description: "JavaScript testing framework",
    },
    { name: "Vitest", available: true, description: "Fast unit testing" },
    { name: "Cypress", available: false, description: "E2E testing framework" },
    {
      name: "ESLint",
      available: true,
      description: "ESLint with framework-specific rules",
    },
    {
      name: "Prettier",
      available: true,
      description: "Prettier with consistent configurations",
    },
    {
      name: "Husky",
      available: true,
      description: "Husky for pre-commit validation",
    },
    { name: "GitHub Actions", available: true, description: "CI/CD workflows" },
  ];

  // Package Managers
  const packageManagers = [
    {
      name: "npm",
      available: true,
      description: "Node.js default package manager",
    },
    {
      name: "yarn",
      available: true,
      description: "Fast, reliable dependency management",
    },
    {
      name: "pnpm",
      available: true,
      description: "Efficient disk space usage",
    },
    {
      name: "bun",
      available: true,
      description: "All-in-one JavaScript runtime",
    },
  ];

  // Additional Features
  const additionalFeatures = [
    {
      name: "Redis",
      available: true,
      description: "Caching and session storage",
    },
    {
      name: "Socket.IO",
      available: true,
      description: "Real-time communication",
    },
    {
      name: "Tailwind CSS",
      available: true,
      description: "Utility-first CSS framework",
    },
    {
      name: "Material UI",
      available: false,
      description: "React component library",
    },
    {
      name: "Bootstrap",
      available: false,
      description: "Popular CSS framework",
    },
    {
      name: "Environment Management",
      available: true,
      description: "Complete .env configuration",
    },
    {
      name: "API Documentation",
      available: false,
      description: "Auto-generated Swagger/OpenAPI docs",
    },
    {
      name: "Hot Reload",
      available: true,
      description: "Development with instant updates",
    },
  ];

  const FeatureCard = ({
    data,
  }: {
    data: {
      name: string;
      available: boolean;
      description: string;
      version?: string;
    };
  }) => (
    <div className="group relative overflow-hidden rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm p-6 transition-all duration-300 hover:border-primary/50 hover:bg-card/60 hover:shadow-lg hover:shadow-primary/5">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base font-mono tracking-tight text-foreground/90 group-hover:text-primary transition-colors">
              {data.name}
            </span>
          </div>
          <Badge
            variant={data.available ? "default" : "secondary"}
            className={cn(
              "text-[10px] font-medium border-0 px-2 py-0.5",
              data.available
                ? "bg-primary/15 text-primary hover:bg-primary/20"
                : "bg-muted/50 text-muted-foreground hover:bg-muted/60",
            )}
          >
            {data.available ? "Available" : "Coming Soon"}
          </Badge>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {data.description}
          </p>
          {data.version && (
            <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground/60">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />v
              {data.version}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const SidebarContent = () => (
    <div className="space-y-8 p-4">
      {/* Header */}
      <div className="flex items-center gap-3 px-2">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/20 shadow-inner">
          <Star className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold font-mono tracking-tight text-foreground">
            Features
          </h1>
          <p className="text-xs text-muted-foreground font-medium">
            Tech Stack Explorer
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
          Overview
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            {
              label: "Frontend",
              count: frontendFrameworks.filter((f) => f.available).length,
            },
            {
              label: "Backend",
              count: backendFrameworks.filter((f) => f.available).length,
            },
            {
              label: "Database",
              count: databases.filter((f) => f.available).length,
            },
            {
              label: "Auth",
              count: authMethods.filter((f) => f.available).length,
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 p-2.5 rounded-lg bg-card/40 border border-border/40 backdrop-blur-sm"
            >
              <CheckCircle className="h-3.5 w-3.5 text-primary" />
              <div>
                <div className="text-sm font-bold text-foreground">
                  {stat.count}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
          Categories
        </h3>
        <div className="space-y-1">
          {filterCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => toggleSection(category.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                visibleSections.has(category.id)
                  ? "text-primary bg-primary/10 shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
              )}
            >
              {visibleSections.has(category.id) && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute left-0 w-1 h-full bg-primary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
              <category.icon
                className={cn(
                  "h-4 w-4 transition-colors",
                  visibleSections.has(category.id)
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
              />
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4 pt-4 border-t border-border/40">
        {/* View Mode */}
        <div className="flex bg-muted/30 p-1 rounded-lg border border-border/40">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-medium transition-all",
              viewMode === "grid"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Grid3X3 className="h-3.5 w-3.5" />
            Grid
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-medium transition-all",
              viewMode === "list"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <List className="h-3.5 w-3.5" />
            List
          </button>
        </div>

        {/* Quick Start Code */}
        <div className="rounded-lg border border-border/50 bg-zinc-950/50 p-3 shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase">
              Quick Start
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-black/40 p-2 rounded border border-white/5">
            <span className="text-primary">➜</span>
            <span className="truncate">npx create-js-stack init</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-6rem)] w-full overflow-hidden bg-background text-foreground lg:grid lg:grid-cols-[300px_1fr] xl:grid-cols-[340px_1fr]">
      {/* Background Ambience */}
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="fixed left-0 top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px] opacity-20 pointer-events-none" />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-full flex-col border-r border-border/40 bg-background/30 backdrop-blur-xl h-full">
        <ScrollArea className="flex-1">
          <SidebarContent />
        </ScrollArea>
      </aside>

      {/* Mobile Toggle */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-24 left-4 z-40 lg:hidden h-10 w-10 rounded-full border border-border/50 bg-background/80 backdrop-blur-md shadow-lg"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[85%] sm:w-[350px] p-0 border-r border-border/40 bg-background/95 backdrop-blur-2xl"
        >
          <ScrollArea className="h-full">
            <SidebarContent />
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        <ScrollArea className="h-full">
          <div className="p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto pt-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-12 pb-24"
            >
              {/* Overview Section - Special Handled */}
              <AnimatePresence>
                {visibleSections.has("overview") && (
                  <motion.section
                    id="overview"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-6 scroll-mt-24"
                  >
                    <div className="flex items-center gap-4 pb-4 border-b border-border/40">
                      <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                        <Star className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                          Overview
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Technology stack snapshot
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="col-span-full md:col-span-1 rounded-2xl border border-border/50 bg-gradient-to-br from-primary/10 to-transparent p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                          <Monitor className="h-24 w-24" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                          Frontend First
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Support for React, Vue, Svelte, and more with modern
                          tooling built-in.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {frontendFrameworks.slice(0, 3).map((f) => (
                            <Badge
                              key={f.name}
                              variant="secondary"
                              className="bg-background/80 backdrop-blur"
                            >
                              {f.name}
                            </Badge>
                          ))}
                          <Badge variant="outline">+4 more</Badge>
                        </div>
                      </div>
                      <div className="col-span-full md:col-span-1 rounded-2xl border border-border/50 bg-gradient-to-br from-purple-500/10 to-transparent p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                          <Cpu className="h-24 w-24" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                          Robust Backend
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Scalable server-side solutions with Express, NestJS,
                          and Fastify.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {backendFrameworks.slice(0, 3).map((f) => (
                            <Badge
                              key={f.name}
                              variant="secondary"
                              className="bg-background/80 backdrop-blur"
                            >
                              {f.name}
                            </Badge>
                          ))}
                          <Badge variant="outline">+2 more</Badge>
                        </div>
                      </div>
                      <div className="col-span-full md:col-span-1 rounded-2xl border border-border/50 bg-gradient-to-br from-blue-500/10 to-transparent p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                          <Database className="h-24 w-24" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Data Layer</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Seamless database integration with Prisma, Mongoose,
                          and more.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {databases.slice(0, 3).map((f) => (
                            <Badge
                              key={f.name}
                              variant="secondary"
                              className="bg-background/80 backdrop-blur"
                            >
                              {f.name}
                            </Badge>
                          ))}
                          <Badge variant="outline">+3 more</Badge>
                        </div>
                      </div>
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>

              {/* Other Sections Mapping */}
              {[
                {
                  id: "frontend",
                  icon: Monitor,
                  title: "Frontend Frameworks",
                  desc: "UI libraries & frameworks",
                  data: frontendFrameworks,
                },
                {
                  id: "backend",
                  icon: Cpu,
                  title: "Backend Frameworks",
                  desc: "Server-side runtimes",
                  data: backendFrameworks,
                },
                {
                  id: "database",
                  icon: Database,
                  title: "Database & Storage",
                  desc: "Data persistence layers",
                  data: databases,
                },
                {
                  id: "orm",
                  icon: Layers,
                  title: "ORM & ODM",
                  desc: "Type-safe database clients",
                  data: orms,
                },
                {
                  id: "auth",
                  icon: Lock,
                  title: "Authentication",
                  desc: "Security & identity",
                  data: authMethods,
                },
                {
                  id: "devtools",
                  icon: Wrench,
                  title: "Developer Tools",
                  desc: "DX & CI/CD",
                  data: devTools,
                },
                {
                  id: "packages",
                  icon: Package,
                  title: "Package Managers",
                  desc: "Dependency handling",
                  data: packageManagers,
                },
                {
                  id: "additional",
                  icon: Rocket,
                  title: "Extras",
                  desc: "Additional capabilities",
                  data: additionalFeatures,
                },
              ].map((section) => (
                <AnimatePresence key={section.id}>
                  {visibleSections.has(section.id) && (
                    <motion.section
                      id={section.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="space-y-6 scroll-mt-24"
                    >
                      <div className="flex items-center gap-4 pb-4 border-b border-border/40">
                        <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                          <section.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold tracking-tight">
                            {section.title}
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            {section.desc}
                          </p>
                        </div>
                      </div>

                      <div
                        className={cn(
                          "grid gap-4",
                          viewMode === "grid"
                            ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                            : "grid-cols-1",
                        )}
                      >
                        {section.data?.map((item, idx) => (
                          <FeatureCard key={idx} data={item} />
                        ))}
                      </div>
                    </motion.section>
                  )}
                </AnimatePresence>
              ))}
            </motion.div>
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
