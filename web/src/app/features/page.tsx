import { 
  Rocket, 
  Package, 
  Terminal,
  CheckCircle,
  Star,
  Layers,
  Monitor,
  Wrench,
  Database,
  Lock,
  Cpu,
  Badge,
  Clock
} from "lucide-react";

export default function Features() {
  // Frontend Frameworks
  const frontendFrameworks = [
    { name: "React", available: true, version: "18+", description: "With Vite, TypeScript, and modern tooling" },
    { name: "Vue.js", available: true, version: "3+", description: "Vue 3 with Composition API and Vite" },
    { name: "Angular", available: true, version: "16+", description: "Latest Angular with CLI integration" },
    { name: "Svelte", available: true, version: "4+", description: "SvelteKit with optimized builds" },
    { name: "Next.js", available: true, version: "14+", description: "Full-stack React framework" },
    { name: "Nuxt", available: true, version: "3+", description: "Vue.js full-stack framework" },
    { name: "React Native", available: true, version: "0.72+", description: "Mobile app development" }
  ];

  // Backend Frameworks
  const backendFrameworks = [
    { name: "Express.js", available: true, version: "4+", description: "Fast, minimalist web framework" },
    { name: "Fastify", available: true, version: "4+", description: "High-performance, low-overhead framework" },
    { name: "Koa.js", available: true, version: "2+", description: "Lightweight, expressive middleware framework" },
    { name: "Hapi.js", available: true, version: "21+", description: "Rich ecosystem with built-in validation" },
    { name: "NestJS", available: true, version: "10+", description: "Scalable Node.js framework with TypeScript" }
  ];

  // Databases
  const databases = [
    { name: "SQLite", available: true, description: "Lightweight, serverless database" },
    { name: "PostgreSQL", available: true, description: "Advanced open-source database" },
    { name: "MySQL", available: true, description: "Popular relational database" },
    { name: "MongoDB", available: true, description: "NoSQL document database" },
    { name: "Supabase", available: false, description: "Open source Firebase alternative" },
    { name: "PlanetScale", available: false, description: "Serverless MySQL platform" }
  ];

  // ORMs/ODMs
  const orms = [
    { name: "Prisma", available: true, description: "Next-generation ORM with type safety" },
    { name: "Sequelize", available: true, description: "Feature-rich ORM for SQL databases" },
    { name: "Mongoose", available: true, description: "Elegant MongoDB object modeling" },
    { name: "TypeORM", available: true, description: "Advanced ORM with decorator support" }
  ];

  // Authentication
  const authMethods = [
    { name: "JWT", available: true, description: "JSON Web Token implementation" },
    { name: "Passport", available: true, description: "Flexible authentication middleware" },
    { name: "Auth0", available: true, description: "Identity platform integration" },
    { name: "Firebase Auth", available: false, description: "Google's authentication service" },
    { name: "Clerk", available: false, description: "Modern authentication platform" },
    { name: "Lucia", available: false, description: "Lightweight authentication library" },
    { name: "Supabase Auth", available: false, description: "Open source auth solution" },
    { name: "Security Middleware", available: true, description: "Helmet, CORS, Rate limiting" }
  ];

  // Development & DevOps
  const devTools = [
    { name: "TypeScript", available: true, description: "Full TypeScript support across all templates" },
    { name: "Docker", available: true, description: "Complete containerization with Docker Compose" },
    { name: "Jest", available: true, description: "JavaScript testing framework" },
    { name: "Vitest", available: true, description: "Fast unit testing" },
    { name: "Cypress", available: false, description: "E2E testing framework" },
    { name: "ESLint", available: true, description: "ESLint with framework-specific rules" },
    { name: "Prettier", available: true, description: "Prettier with consistent configurations" },
    { name: "Husky", available: true, description: "Husky for pre-commit validation" },
    { name: "GitHub Actions", available: true, description: "CI/CD workflows" }
  ];

  // Package Managers
  const packageManagers = [
    { name: "npm", available: true, description: "Node.js default package manager" },
    { name: "yarn", available: true, description: "Fast, reliable dependency management" },
    { name: "pnpm", available: true, description: "Efficient disk space usage" },
    { name: "bun", available: true, description: "All-in-one JavaScript runtime" }
  ];

  // Additional Features
  const additionalFeatures = [
    { name: "Redis", available: true, description: "Caching and session storage" },
    { name: "Socket.IO", available: true, description: "Real-time communication" },
    { name: "Tailwind CSS", available: true, description: "Utility-first CSS framework" },
    { name: "Material UI", available: false, description: "React component library" },
    { name: "Bootstrap", available: false, description: "Popular CSS framework" },
    { name: "Environment Management", available: true, description: "Complete .env configuration" },
    { name: "API Documentation", available: false, description: "Auto-generated Swagger/OpenAPI docs" },
    { name: "Hot Reload", available: true, description: "Development with instant updates" }
  ];

  return (
    <div className="mx-auto min-h-svh max-w-[1280px]">
      <main className="mx-auto px-4 pt-12">
        {/* Terminal Header */}
        <div className="mb-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary" />
              <span className="font-bold text-lg sm:text-xl">
                FEATURES.TXT
              </span>
            </div>
            <div className="h-px flex-1 bg-border" />
            <span className="text-muted-foreground text-xs">
              [COMPREHENSIVE TECH STACK]
            </span>
          </div>
        </div>

        {/* Feature Status Legend */}
        <div className="mb-8 rounded border border-border p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">FEATURE_STATUS_LEGEND</span>
            </div>
            <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
              INFO
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between rounded border border-border p-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-mono">✅ AVAILABLE</span>
              </div>
              <div className="rounded border border-border bg-green-500/20 px-2 py-1 text-xs text-green-600">
                READY
              </div>
            </div>
            <div className="flex items-center justify-between rounded border border-border p-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-mono">🚧 COMING SOON</span>
              </div>
              <div className="rounded border border-border bg-yellow-500/20 px-2 py-1 text-xs text-yellow-600">
                PLANNED
              </div>
            </div>
          </div>
        </div>

        {/* Frontend Frameworks */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-primary" />
            <span className="font-bold text-lg sm:text-xl">
              FRONTEND_FRAMEWORKS.TXT
            </span>
          </div>
          <div className="h-px flex-1 bg-border" />
          <span className="text-muted-foreground text-xs">
            [UI LIBRARIES & FRAMEWORKS]
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {frontendFrameworks.map((framework, index) => (
            <div key={index} className="flex h-full flex-col justify-between rounded border border-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm font-mono">{framework.name.toUpperCase()}</span>
                </div>
                <div className={`rounded border border-border px-2 py-1 text-xs ${
                  framework.available 
                    ? 'bg-green-500/20 text-green-600' 
                    : 'bg-yellow-500/20 text-yellow-600'
                }`}>
                  {framework.available ? '✅ AVAILABLE' : '🚧 COMING SOON'}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded border border-border p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-foreground">{framework.description}</span>
                  </div>
                  <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                    {framework.version}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Backend Frameworks */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-primary" />
            <span className="font-bold text-lg sm:text-xl">
              BACKEND_FRAMEWORKS.TXT
            </span>
          </div>
          <div className="h-px flex-1 bg-border" />
          <span className="text-muted-foreground text-xs">
            [SERVER-SIDE FRAMEWORKS]
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {backendFrameworks.map((framework, index) => (
            <div key={index} className="flex h-full flex-col justify-between rounded border border-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm font-mono">{framework.name.toUpperCase()}</span>
                </div>
                <div className="rounded border border-border bg-green-500/20 px-2 py-1 text-xs text-green-600">
                  ✅ AVAILABLE
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded border border-border p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-foreground">{framework.description}</span>
                  </div>
                  <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                    {framework.version}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Database & Storage */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            <span className="font-bold text-lg sm:text-xl">
              DATABASE_STORAGE.TXT
            </span>
          </div>
          <div className="h-px flex-1 bg-border" />
          <span className="text-muted-foreground text-xs">
            [DATA PERSISTENCE LAYERS]
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {databases.map((database, index) => (
            <div key={index} className="flex h-full flex-col justify-between rounded border border-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm font-mono">{database.name.toUpperCase()}</span>
                </div>
                <div className={`rounded border border-border px-2 py-1 text-xs ${
                  database.available 
                    ? 'bg-green-500/20 text-green-600' 
                    : 'bg-yellow-500/20 text-yellow-600'
                }`}>
                  {database.available ? '✅ AVAILABLE' : '🚧 COMING SOON'}
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded border border-border p-3">
                  <div className="text-xs text-muted-foreground mb-1">DESCRIPTION</div>
                  <div className="text-sm text-foreground">{database.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ORM/ODM Integration */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <span className="font-bold text-lg sm:text-xl">
              ORM_ODM_INTEGRATION.TXT
            </span>
          </div>
          <div className="h-px flex-1 bg-border" />
          <span className="text-muted-foreground text-xs">
            [OBJECT RELATIONAL MAPPING]
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {orms.map((orm, index) => (
            <div key={index} className="flex h-full flex-col justify-between rounded border border-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm font-mono">{orm.name.toUpperCase()}</span>
                </div>
                <div className="rounded border border-border bg-green-500/20 px-2 py-1 text-xs text-green-600">
                  ✅ AVAILABLE
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded border border-border p-3">
                  <div className="text-xs text-muted-foreground mb-1">DESCRIPTION</div>
                  <div className="text-sm text-foreground">{orm.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Authentication & Security */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            <span className="font-bold text-lg sm:text-xl">
              AUTHENTICATION_SECURITY.TXT
            </span>
          </div>
          <div className="h-px flex-1 bg-border" />
          <span className="text-muted-foreground text-xs">
            [IDENTITY & ACCESS MANAGEMENT]
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {authMethods.map((auth, index) => (
            <div key={index} className="flex h-full flex-col justify-between rounded border border-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm font-mono">{auth.name.toUpperCase()}</span>
                </div>
                <div className={`rounded border border-border px-2 py-1 text-xs ${
                  auth.available 
                    ? 'bg-green-500/20 text-green-600' 
                    : 'bg-yellow-500/20 text-yellow-600'
                }`}>
                  {auth.available ? '✅ AVAILABLE' : '🚧 COMING SOON'}
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded border border-border p-3">
                  <div className="text-xs text-muted-foreground mb-1">DESCRIPTION</div>
                  <div className="text-sm text-foreground">{auth.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Development & DevOps */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-primary" />
            <span className="font-bold text-lg sm:text-xl">
              DEVELOPMENT_DEVOPS.TXT
            </span>
          </div>
          <div className="h-px flex-1 bg-border" />
          <span className="text-muted-foreground text-xs">
            [DEVELOPMENT TOOLS & WORKFLOWS]
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {devTools.map((tool, index) => (
            <div key={index} className="flex h-full flex-col justify-between rounded border border-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm font-mono">{tool.name.toUpperCase()}</span>
                </div>
                <div className={`rounded border border-border px-2 py-1 text-xs ${
                  tool.available 
                    ? 'bg-green-500/20 text-green-600' 
                    : 'bg-yellow-500/20 text-yellow-600'
                }`}>
                  {tool.available ? '✅ AVAILABLE' : '🚧 COMING SOON'}
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded border border-border p-3">
                  <div className="text-xs text-muted-foreground mb-1">DESCRIPTION</div>
                  <div className="text-sm text-foreground">{tool.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Package Managers */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" />
            <span className="font-bold text-lg sm:text-xl">
              PACKAGE_MANAGERS.TXT
            </span>
          </div>
          <div className="h-px flex-1 bg-border" />
          <span className="text-muted-foreground text-xs">
            [DEPENDENCY MANAGEMENT]
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {packageManagers.map((pm, index) => (
            <div key={index} className="flex h-full flex-col justify-between rounded border border-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm font-mono">{pm.name.toUpperCase()}</span>
                </div>
                <div className="rounded border border-border bg-green-500/20 px-2 py-1 text-xs text-green-600">
                  ✅ AVAILABLE
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded border border-border p-3">
                  <div className="text-xs text-muted-foreground mb-1">DESCRIPTION</div>
                  <div className="text-sm text-foreground">{pm.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            <span className="font-bold text-lg sm:text-xl">
              ADDITIONAL_FEATURES.TXT
            </span>
          </div>
          <div className="h-px flex-1 bg-border" />
          <span className="text-muted-foreground text-xs">
            [EXTRA CAPABILITIES & TOOLS]
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {additionalFeatures.map((feature, index) => (
            <div key={index} className="flex h-full flex-col justify-between rounded border border-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm font-mono">{feature.name.toUpperCase()}</span>
                </div>
                <div className={`rounded border border-border px-2 py-1 text-xs ${
                  feature.available 
                    ? 'bg-green-500/20 text-green-600' 
                    : 'bg-yellow-500/20 text-yellow-600'
                }`}>
                  {feature.available ? '✅ AVAILABLE' : '🚧 COMING SOON'}
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded border border-border p-3">
                  <div className="text-xs text-muted-foreground mb-1">DESCRIPTION</div>
                  <div className="text-sm text-foreground">{feature.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Start Command */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
          <div className="flex items-center gap-2">
            <Rocket className="h-4 w-4 text-primary" />
            <span className="font-bold text-lg sm:text-xl">
              GET_STARTED.TXT
            </span>
          </div>
          <div className="h-px flex-1 bg-border" />
          <span className="text-muted-foreground text-xs">
            [READY TO START]
          </span>
        </div>

        <div className="rounded border border-border p-6 mb-12">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">QUICK_START_COMMAND</span>
            </div>
            <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
              READY
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded border border-border p-4">
              <div className="text-xs text-muted-foreground mb-2">COMMAND</div>
              <div className="text-sm text-foreground font-mono">npx create-js-stack init my-app</div>
            </div>
            
            <div className="flex items-center justify-between rounded border border-border p-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-foreground">Get started in seconds with a single command</span>
              </div>
              <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                INSTANT
              </div>
            </div>
          </div>
        </div>

        {/* End of File */}
        <div className="mb-4 mt-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-muted-foreground" />
              <span className="font-bold text-lg sm:text-xl text-muted-foreground">
                END_OF_FILE
              </span>
            </div>
            <div className="h-px flex-1 bg-border" />
            <span className="text-muted-foreground text-xs">
              [FEATURES]
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}