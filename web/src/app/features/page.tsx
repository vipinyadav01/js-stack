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

  return (
    <div className="flex h-screen w-full overflow-hidden border-border text-foreground lg:grid lg:grid-cols-[30%_1fr]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-full flex-col border-border border-r sm:max-w-3xs md:max-w-xs lg:max-w-sm">
        <ScrollArea className="flex-1">
          <div className="flex h-full flex-col gap-3 p-3 sm:p-4 md:h-[calc(100vh-64px)]">
            {/* Features Sidebar Content */}
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-lg font-bold font-mono text-foreground">
                    Features
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Comprehensive tech stack
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Quick Stats
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 border border-border">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <div>
                      <div className="text-xs font-semibold">
                        {frontendFrameworks.filter((f) => f.available).length}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Frontend
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 border border-border">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <div>
                      <div className="text-xs font-semibold">
                        {backendFrameworks.filter((f) => f.available).length}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Backend
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 border border-border">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <div>
                      <div className="text-xs font-semibold">
                        {databases.filter((f) => f.available).length}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Database
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 border border-border">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <div>
                      <div className="text-xs font-semibold">
                        {authMethods.filter((f) => f.available).length}
                      </div>
                      <div className="text-xs text-muted-foreground">Auth</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Filters */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Sections
                </h3>
                <div className="space-y-2">
                  {filterCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => toggleSection(category.id)}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all",
                        visibleSections.has(category.id)
                          ? "border-primary bg-primary/10 text-primary shadow-sm"
                          : "border-border text-muted-foreground hover:border-primary/50 hover:bg-muted/50 hover:text-foreground",
                      )}
                    >
                      <category.icon className="h-3 w-3" />
                      <span>{category.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Controls
                </h3>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 p-1 rounded-lg border border-border bg-background/50">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all",
                      viewMode === "grid"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    )}
                  >
                    <Grid3X3 className="h-3 w-3" />
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all",
                      viewMode === "list"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    )}
                  >
                    <List className="h-3 w-3" />
                    List
                  </button>
                </div>

                {/* Quick Start */}
                <div className="rounded-lg border border-border bg-background/50 p-3">
                  <div className="text-xs font-semibold text-foreground mb-2">
                    Quick Start
                  </div>
                  <div className="text-xs text-muted-foreground font-mono bg-muted/50 p-2 rounded border">
                    npx create-js-stack init my-app
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </aside>

      {/* Mobile Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 lg:hidden h-9 w-9"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[320px] sm:w-[400px] p-0">
          <ScrollArea className="flex-1">
            <div className="flex h-full flex-col gap-3 p-3 sm:p-4 md:h-[calc(100vh-64px)]">
              {/* Mobile Sidebar Content - Same as desktop */}
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold font-mono text-foreground">
                      Features
                    </h1>
                    <p className="text-xs text-muted-foreground">
                      Comprehensive tech stack
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    Quick Stats
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 border border-border">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <div>
                        <div className="text-xs font-semibold">
                          {frontendFrameworks.filter((f) => f.available).length}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Frontend
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 border border-border">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <div>
                        <div className="text-xs font-semibold">
                          {backendFrameworks.filter((f) => f.available).length}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Backend
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 border border-border">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <div>
                        <div className="text-xs font-semibold">
                          {databases.filter((f) => f.available).length}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Database
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 border border-border">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <div>
                        <div className="text-xs font-semibold">
                          {authMethods.filter((f) => f.available).length}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Auth
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section Filters */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    Sections
                  </h3>
                  <div className="space-y-2">
                    {filterCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => toggleSection(category.id)}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all",
                          visibleSections.has(category.id)
                            ? "border-primary bg-primary/10 text-primary shadow-sm"
                            : "border-border text-muted-foreground hover:border-primary/50 hover:bg-muted/50 hover:text-foreground",
                        )}
                      >
                        <category.icon className="h-3 w-3" />
                        <span>{category.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    Controls
                  </h3>

                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-1 p-1 rounded-lg border border-border bg-background/50">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all",
                        viewMode === "grid"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                      )}
                    >
                      <Grid3X3 className="h-3 w-3" />
                      Grid
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all",
                        viewMode === "list"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                      )}
                    >
                      <List className="h-3 w-3" />
                      List
                    </button>
                  </div>

                  {/* Quick Start */}
                  <div className="rounded-lg border border-border bg-background/50 p-3">
                    <div className="text-xs font-semibold text-foreground mb-2">
                      Quick Start
                    </div>
                    <div className="text-xs text-muted-foreground font-mono bg-muted/50 p-2 rounded border">
                      npx create-js-stack init my-app
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-3 sm:p-4 lg:p-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6 sm:space-y-8"
            >
              {/* Overview Section */}
              <AnimatePresence>
                {visibleSections.has("overview") && (
                  <motion.section
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3">
                      <Star className="h-6 w-6 text-primary" />
                      <h2 className="text-2xl font-bold font-mono">Overview</h2>
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground">
                        Quick feature overview
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Frontend Frameworks */}
                      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-2">
                          <Monitor className="h-5 w-5 text-primary" />
                          <span className="font-semibold text-sm">
                            Frontend
                          </span>
                        </div>
                        <div className="space-y-2 text-xs text-muted-foreground">
                          <div>• React with Vite</div>
                          <div>• Vue.js 3</div>
                          <div>• Angular</div>
                          <div>• SvelteKit</div>
                          <div>• Next.js</div>
                          <div>• Nuxt</div>
                        </div>
                      </div>

                      {/* Backend Frameworks */}
                      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-2">
                          <Cpu className="h-5 w-5 text-primary" />
                          <span className="font-semibold text-sm">Backend</span>
                        </div>
                        <div className="space-y-2 text-xs text-muted-foreground">
                          <div>• Express.js</div>
                          <div>• Fastify</div>
                          <div>• Koa.js</div>
                          <div>• Hapi.js</div>
                          <div>• NestJS</div>
                          <div>• Custom APIs</div>
                        </div>
                      </div>

                      {/* Database & ORM */}
                      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-2">
                          <Database className="h-5 w-5 text-primary" />
                          <span className="font-semibold text-sm">
                            Database
                          </span>
                        </div>
                        <div className="space-y-2 text-xs text-muted-foreground">
                          <div>• PostgreSQL</div>
                          <div>• MongoDB</div>
                          <div>• SQLite</div>
                          <div>• MySQL</div>
                          <div>• Prisma ORM</div>
                          <div>• Mongoose</div>
                        </div>
                      </div>
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>

              {/* Frontend Frameworks Section */}
              <AnimatePresence>
                {visibleSections.has("frontend") && (
                  <motion.section
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3">
                      <Monitor className="h-6 w-6 text-primary" />
                      <h2 className="text-2xl font-bold font-mono">
                        Frontend Frameworks
                      </h2>
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground">
                        UI libraries & frameworks
                      </span>
                    </div>

                    <div
                      className={cn(
                        "grid gap-4",
                        viewMode === "grid"
                          ? "md:grid-cols-2 lg:grid-cols-3"
                          : "grid-cols-1",
                      )}
                    >
                      {frontendFrameworks.map((framework, index) => (
                        <div
                          key={index}
                          className="rounded-xl border border-border bg-card p-6 shadow-sm"
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm font-mono">
                                {framework.name}
                              </span>
                            </div>
                            <div
                              className={cn(
                                "rounded border border-border px-2 py-1 text-xs",
                                framework.available
                                  ? "bg-green-500/20 text-green-600"
                                  : "bg-yellow-500/20 text-yellow-600",
                              )}
                            >
                              {framework.available
                                ? "✅ Available"
                                : "🚧 Coming Soon"}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm text-foreground">
                              {framework.description}
                            </div>
                            {framework.version && (
                              <div className="text-xs text-muted-foreground">
                                Version: {framework.version}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>

              {/* Backend Frameworks Section */}
              <AnimatePresence>
                {visibleSections.has("backend") && (
                  <motion.section
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3">
                      <Cpu className="h-6 w-6 text-primary" />
                      <h2 className="text-2xl font-bold font-mono">
                        Backend Frameworks
                      </h2>
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground">
                        Server-side frameworks
                      </span>
                    </div>

                    <div
                      className={cn(
                        "grid gap-4",
                        viewMode === "grid"
                          ? "md:grid-cols-2 lg:grid-cols-3"
                          : "grid-cols-1",
                      )}
                    >
                      {backendFrameworks.map((framework, index) => (
                        <div
                          key={index}
                          className="rounded-xl border border-border bg-card p-6 shadow-sm"
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm font-mono">
                                {framework.name}
                              </span>
                            </div>
                            <div className="rounded border border-border bg-green-500/20 px-2 py-1 text-xs text-green-600">
                              ✅ Available
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm text-foreground">
                              {framework.description}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Version: {framework.version}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>

              {/* Database Section */}
              <AnimatePresence>
                {visibleSections.has("database") && (
                  <motion.section
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3">
                      <Database className="h-6 w-6 text-primary" />
                      <h2 className="text-2xl font-bold font-mono">
                        Database & Storage
                      </h2>
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground">
                        Data persistence layers
                      </span>
                    </div>

                    <div
                      className={cn(
                        "grid gap-4",
                        viewMode === "grid"
                          ? "md:grid-cols-2 lg:grid-cols-3"
                          : "grid-cols-1",
                      )}
                    >
                      {databases.map((database, index) => (
                        <div
                          key={index}
                          className="rounded-xl border border-border bg-card p-6 shadow-sm"
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm font-mono">
                                {database.name}
                              </span>
                            </div>
                            <div
                              className={cn(
                                "rounded border border-border px-2 py-1 text-xs",
                                database.available
                                  ? "bg-green-500/20 text-green-600"
                                  : "bg-yellow-500/20 text-yellow-600",
                              )}
                            >
                              {database.available
                                ? "✅ Available"
                                : "🚧 Coming Soon"}
                            </div>
                          </div>

                          <div className="text-sm text-foreground">
                            {database.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>

              {/* ORM/ODM Section */}
              <AnimatePresence>
                {visibleSections.has("orm") && (
                  <motion.section
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3">
                      <Layers className="h-6 w-6 text-primary" />
                      <h2 className="text-2xl font-bold font-mono">
                        ORM/ODM Integration
                      </h2>
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground">
                        Object relational mapping
                      </span>
                    </div>

                    <div
                      className={cn(
                        "grid gap-4",
                        viewMode === "grid"
                          ? "md:grid-cols-2 lg:grid-cols-4"
                          : "grid-cols-1",
                      )}
                    >
                      {orms.map((orm, index) => (
                        <div
                          key={index}
                          className="rounded-xl border border-border bg-card p-6 shadow-sm"
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm font-mono">
                                {orm.name}
                              </span>
                            </div>
                            <div className="rounded border border-border bg-green-500/20 px-2 py-1 text-xs text-green-600">
                              ✅ Available
                            </div>
                          </div>

                          <div className="text-sm text-foreground">
                            {orm.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>

              {/* Authentication Section */}
              <AnimatePresence>
                {visibleSections.has("auth") && (
                  <motion.section
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3">
                      <Lock className="h-6 w-6 text-primary" />
                      <h2 className="text-2xl font-bold font-mono">
                        Authentication & Security
                      </h2>
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground">
                        Identity & access management
                      </span>
                    </div>

                    <div
                      className={cn(
                        "grid gap-4",
                        viewMode === "grid"
                          ? "md:grid-cols-2 lg:grid-cols-4"
                          : "grid-cols-1",
                      )}
                    >
                      {authMethods.map((auth, index) => (
                        <div
                          key={index}
                          className="rounded-xl border border-border bg-card p-6 shadow-sm"
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm font-mono">
                                {auth.name}
                              </span>
                            </div>
                            <div
                              className={cn(
                                "rounded border border-border px-2 py-1 text-xs",
                                auth.available
                                  ? "bg-green-500/20 text-green-600"
                                  : "bg-yellow-500/20 text-yellow-600",
                              )}
                            >
                              {auth.available
                                ? "✅ Available"
                                : "🚧 Coming Soon"}
                            </div>
                          </div>

                          <div className="text-sm text-foreground">
                            {auth.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>

              {/* Development Tools Section */}
              <AnimatePresence>
                {visibleSections.has("devtools") && (
                  <motion.section
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3">
                      <Wrench className="h-6 w-6 text-primary" />
                      <h2 className="text-2xl font-bold font-mono">
                        Development & DevOps
                      </h2>
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground">
                        Development tools & workflows
                      </span>
                    </div>

                    <div
                      className={cn(
                        "grid gap-4",
                        viewMode === "grid"
                          ? "md:grid-cols-2 lg:grid-cols-3"
                          : "grid-cols-1",
                      )}
                    >
                      {devTools.map((tool, index) => (
                        <div
                          key={index}
                          className="rounded-xl border border-border bg-card p-6 shadow-sm"
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm font-mono">
                                {tool.name}
                              </span>
                            </div>
                            <div
                              className={cn(
                                "rounded border border-border px-2 py-1 text-xs",
                                tool.available
                                  ? "bg-green-500/20 text-green-600"
                                  : "bg-yellow-500/20 text-yellow-600",
                              )}
                            >
                              {tool.available
                                ? "✅ Available"
                                : "🚧 Coming Soon"}
                            </div>
                          </div>

                          <div className="text-sm text-foreground">
                            {tool.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>

              {/* Package Managers Section */}
              <AnimatePresence>
                {visibleSections.has("packages") && (
                  <motion.section
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3">
                      <Package className="h-6 w-6 text-primary" />
                      <h2 className="text-2xl font-bold font-mono">
                        Package Managers
                      </h2>
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground">
                        Dependency management
                      </span>
                    </div>

                    <div
                      className={cn(
                        "grid gap-4",
                        viewMode === "grid"
                          ? "md:grid-cols-2 lg:grid-cols-4"
                          : "grid-cols-1",
                      )}
                    >
                      {packageManagers.map((pm, index) => (
                        <div
                          key={index}
                          className="rounded-xl border border-border bg-card p-6 shadow-sm"
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm font-mono">
                                {pm.name}
                              </span>
                            </div>
                            <div className="rounded border border-border bg-green-500/20 px-2 py-1 text-xs text-green-600">
                              ✅ Available
                            </div>
                          </div>

                          <div className="text-sm text-foreground">
                            {pm.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>

              {/* Additional Features Section */}
              <AnimatePresence>
                {visibleSections.has("additional") && (
                  <motion.section
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3">
                      <Rocket className="h-6 w-6 text-primary" />
                      <h2 className="text-2xl font-bold font-mono">
                        Additional Features
                      </h2>
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground">
                        Extra capabilities & tools
                      </span>
                    </div>

                    <div
                      className={cn(
                        "grid gap-4",
                        viewMode === "grid"
                          ? "md:grid-cols-2 lg:grid-cols-4"
                          : "grid-cols-1",
                      )}
                    >
                      {additionalFeatures.map((feature, index) => (
                        <div
                          key={index}
                          className="rounded-xl border border-border bg-card p-6 shadow-sm"
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm font-mono">
                                {feature.name}
                              </span>
                            </div>
                            <div
                              className={cn(
                                "rounded border border-border px-2 py-1 text-xs",
                                feature.available
                                  ? "bg-green-500/20 text-green-600"
                                  : "bg-yellow-500/20 text-yellow-600",
                              )}
                            >
                              {feature.available
                                ? "✅ Available"
                                : "🚧 Coming Soon"}
                            </div>
                          </div>

                          <div className="text-sm text-foreground">
                            {feature.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
