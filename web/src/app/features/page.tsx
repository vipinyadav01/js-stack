import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, 
  Settings, 
  Shield, 
  Rocket, 
  Code, 
  Package, 
  GitBranch, 
  Terminal,
  CheckCircle,
  Star,
  Layers,
  Monitor,
  Smartphone,
  Palette,
  Activity,
  FileText,
  Database,
  Lock,
  Globe,
  Cpu,
  Wrench
} from "lucide-react";

export default function Features() {
  const coreFeatures = [
    {
      icon: Zap,
      title: "Quick Project Setup",
      description: "Create full-stack projects in seconds with interactive prompts and presets",
      details: "Generate complete project structures with frontend, backend, database, and authentication setup in one command."
    },
    {
      icon: Settings,
      title: "Smart Presets",
      description: "Pre-configured templates for common project types",
      details: "Choose from SaaS, API, full-stack, or minimal presets to get started quickly with best practices built-in."
    },
    {
      icon: Shield,
      title: "Modern Stack Support",
      description: "Support for latest frameworks and technologies",
      details: "Works with React, Vue, Angular, Express, Fastify, PostgreSQL, MongoDB, and more with TypeScript support."
    },
    {
      icon: Rocket,
      title: "Production Ready",
      description: "Includes testing, linting, Docker, and deployment configurations",
      details: "Every generated project comes with ESLint, Prettier, testing setup, Docker configs, and CI/CD workflows."
    }
  ];

  const developmentFeatures = [
    {
      icon: Code,
      title: "Interactive CLI",
      description: "Beautiful command-line interface with guided setup",
      badge: "Modern"
    },
    {
      icon: Package,
      title: "Package Manager Support",
      description: "Works with npm, yarn, pnpm, and bun",
      badge: "Universal"
    },
    {
      icon: GitBranch,
      title: "Git Integration",
      description: "Automatic git initialization and hooks setup",
      badge: "Automated"
    },
    {
      icon: Terminal,
      title: "Add Features",
      description: "Add authentication, database, testing to existing projects",
      badge: "Extensible"
    }
  ];

  const frameworks = [
    { name: "React", supported: true, version: "18+" },
    { name: "Vue", supported: true, version: "3+" },
    { name: "Angular", supported: true, version: "16+" },
    { name: "Svelte", supported: true, version: "4+" },
    { name: "Next.js", supported: true, version: "14+" },
    { name: "Nuxt", supported: true, version: "3+" },
    { name: "React Native", supported: true, version: "0.72+" },
    { name: "Express", supported: true, version: "4+" }
  ];

  const tools = [
    { name: "TypeScript", category: "Language", description: "Type-safe JavaScript" },
    { name: "ESLint", category: "Linting", description: "Static code analysis" },
    { name: "Prettier", category: "Formatting", description: "Opinionated code formatter" },
    { name: "Jest", category: "Testing", description: "JavaScript testing framework" },
    { name: "Vitest", category: "Testing", description: "Fast unit testing" },
    { name: "Husky", category: "Git Hooks", description: "Git hooks made easy" },
    { name: "Docker", category: "Containerization", description: "Container platform" },
    { name: "GitHub Actions", category: "CI/CD", description: "Automated workflows" }
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
              [POWERFUL CAPABILITIES]
            </span>
          </div>
        </div>

        {/* Core Features */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="font-bold text-lg sm:text-xl">
              CORE_CAPABILITIES.TXT
            </span>
          </div>
          <div className="h-px flex-1 bg-border" />
          <span className="text-muted-foreground text-xs">
            [ESSENTIAL FEATURES]
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {coreFeatures.map((feature, index) => (
            <div key={index} className="flex h-full flex-col justify-between rounded border border-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <feature.icon className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">{feature.title.toUpperCase().replace(/\s+/g, '_')}</span>
                </div>
                <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                  CORE
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded border border-border p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-foreground">{feature.description}</span>
                  </div>
                  <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                    FEATURE
                  </div>
                </div>
                
                <div className="rounded border border-border p-3">
                  <div className="text-xs text-muted-foreground mb-1">DETAILS</div>
                  <div className="text-sm text-foreground">{feature.details}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Development Features */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" />
            <span className="font-bold text-lg sm:text-xl">
              DEV_EXPERIENCE.TXT
            </span>
          </div>
          <div className="h-px flex-1 bg-border" />
          <span className="text-muted-foreground text-xs">
            [WORKFLOW ENHANCEMENT]
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {developmentFeatures.map((feature, index) => (
            <div key={index} className="flex h-full flex-col justify-between rounded border border-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <feature.icon className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">{feature.title.toUpperCase().replace(/\s+/g, '_')}</span>
                </div>
                <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                  {feature.badge.toUpperCase()}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded border border-border p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-foreground">{feature.description}</span>
                  </div>
                  <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                    DEV
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Framework Support & Tools */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {/* Framework Support */}
          <div className="flex h-full flex-col justify-between rounded border border-border p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">FRAMEWORK_SUPPORT</span>
              </div>
              <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                COMPATIBLE
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded border border-border p-3">
                <div className="text-xs text-muted-foreground mb-2">SUPPORTED_FRAMEWORKS</div>
                <div className="grid grid-cols-1 gap-2">
                  {frameworks.map((framework, index) => (
                    <div key={index} className="flex items-center justify-between rounded border border-border p-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-foreground font-mono">{framework.name}</span>
                      </div>
                      <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                        {framework.version}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Integrated Tools */}
          <div className="flex h-full flex-col justify-between rounded border border-border p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">INTEGRATED_TOOLS</span>
              </div>
              <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                BUILT_IN
              </div>
            </div>

            <div className="space-y-3">
              <Tabs defaultValue="development" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="development" className="text-xs">DEV</TabsTrigger>
                  <TabsTrigger value="testing" className="text-xs">TEST</TabsTrigger>
                  <TabsTrigger value="deployment" className="text-xs">DEPLOY</TabsTrigger>
                </TabsList>
                
                <TabsContent value="development" className="space-y-2 mt-3">
                  {tools.filter(tool => ['Language', 'Linting', 'Formatting', 'Git Hooks'].includes(tool.category)).map((tool, index) => (
                    <div key={index} className="flex items-center justify-between rounded border border-border p-2">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground font-mono text-sm">{tool.name}</span>
                      </div>
                      <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                        {tool.category.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="testing" className="space-y-2 mt-3">
                  {tools.filter(tool => tool.category.includes('Testing')).map((tool, index) => (
                    <div key={index} className="flex items-center justify-between rounded border border-border p-2">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground font-mono text-sm">{tool.name}</span>
                      </div>
                      <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                        {tool.category.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="deployment" className="space-y-2 mt-3">
                  {tools.filter(tool => ['Containerization', 'CI/CD'].includes(tool.category)).map((tool, index) => (
                    <div key={index} className="flex items-center justify-between rounded border border-border p-2">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground font-mono text-sm">{tool.name}</span>
                      </div>
                      <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                        {tool.category.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Presets Section */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <span className="font-bold text-lg sm:text-xl">
              PROJECT_PRESETS.TXT
            </span>
          </div>
          <div className="h-px flex-1 bg-border" />
          <span className="text-muted-foreground text-xs">
            [QUICK START TEMPLATES]
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { name: "SaaS App", desc: "Full-stack SaaS with auth & payments", cmd: "npx create-js-stack init --preset saas" },
            { name: "API Service", desc: "RESTful API with database", cmd: "npx create-js-stack init --preset api" },
            { name: "Full Stack", desc: "Complete web application", cmd: "npx create-js-stack init --preset fullstack" },
            { name: "Minimal", desc: "Lightweight starter template", cmd: "npx create-js-stack init --preset minimal" }
          ].map((preset, index) => (
            <div key={index} className="flex h-full flex-col justify-between rounded border border-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Rocket className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">{preset.name.toUpperCase().replace(/\s+/g, '_')}</span>
                </div>
                <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                  PRESET
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded border border-border p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-foreground">{preset.desc}</span>
                  </div>
                  <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                    TEMPLATE
                  </div>
                </div>
                
                <div className="rounded border border-border p-3">
                  <div className="text-xs text-muted-foreground mb-1">COMMAND</div>
                  <div className="text-sm text-foreground font-mono">{preset.cmd}</div>
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
            [EXTRA CAPABILITIES]
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {[
            { icon: Monitor, title: "Cross Platform", desc: "Works seamlessly on Windows, macOS, and Linux with consistent behavior across all platforms." },
            { icon: Smartphone, title: "Mobile Ready", desc: "Built-in support for Progressive Web Apps and mobile-first development practices." },
            { icon: Palette, title: "Customizable", desc: "Flexible configuration system that adapts to your team's coding standards and preferences." }
          ].map((feature, index) => (
            <div key={index} className="flex h-full flex-col justify-between rounded border border-border p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <feature.icon className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">{feature.title.toUpperCase().replace(/\s+/g, '_')}</span>
                </div>
                <div className="rounded border border-border bg-muted/30 px-2 py-1 text-xs">
                  BONUS
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded border border-border p-3">
                  <div className="text-xs text-muted-foreground mb-1">DESCRIPTION</div>
                  <div className="text-sm text-foreground">{feature.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
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