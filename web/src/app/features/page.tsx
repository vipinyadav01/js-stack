import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Palette
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
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <Badge variant="secondary" className="mb-4">
          <Star className="w-3 h-3 mr-1" />
          Feature Rich
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold">Powerful Features</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          create-js-stack comes packed with everything you need for modern JavaScript development, 
          from project initialization to production deployment.
        </p>
      </div>

      {/* Core Features */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Core Capabilities</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Essential features that make create-js-stack the perfect choice for your development workflow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {coreFeatures.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {feature.details}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Development Features */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Development Experience</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Features designed to enhance your development workflow and productivity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {developmentFeatures.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader className="space-y-4">
                <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Framework Support & Tools */}
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Framework Support */}
        <section className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Framework Support</h2>
            <p className="text-muted-foreground">
              Works seamlessly with all major JavaScript frameworks and libraries.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Supported Frameworks
              </CardTitle>
              <CardDescription>
                Full compatibility with modern JavaScript frameworks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {frameworks.map((framework, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-medium">{framework.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {framework.version}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Integrated Tools */}
        <section className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Integrated Tools</h2>
            <p className="text-muted-foreground">
              Pre-configured tools and utilities for a complete development experience.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Built-in Tools
              </CardTitle>
              <CardDescription>
                Everything you need, configured and ready to use
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="development" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="development">Dev</TabsTrigger>
                  <TabsTrigger value="testing">Test</TabsTrigger>
                  <TabsTrigger value="deployment">Deploy</TabsTrigger>
                </TabsList>
                
                <TabsContent value="development" className="space-y-3">
                  {tools.filter(tool => ['Language', 'Linting', 'Formatting', 'Git Hooks'].includes(tool.category)).map((tool, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">{tool.name}</div>
                        <div className="text-sm text-muted-foreground">{tool.description}</div>
                      </div>
                      <Badge variant="outline">{tool.category}</Badge>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="testing" className="space-y-3">
                  {tools.filter(tool => tool.category.includes('Testing')).map((tool, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">{tool.name}</div>
                        <div className="text-sm text-muted-foreground">{tool.description}</div>
                      </div>
                      <Badge variant="outline">{tool.category}</Badge>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="deployment" className="space-y-3">
                  {tools.filter(tool => ['Containerization', 'CI/CD'].includes(tool.category)).map((tool, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">{tool.name}</div>
                        <div className="text-sm text-muted-foreground">{tool.description}</div>
                      </div>
                      <Badge variant="outline">{tool.category}</Badge>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Presets Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Popular Presets</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get started quickly with pre-configured project templates.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">SaaS App</CardTitle>
              <CardDescription>Full-stack SaaS with auth & payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-3 rounded font-mono text-sm">
                npx create-js-stack init --preset saas
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">API Service</CardTitle>
              <CardDescription>RESTful API with database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-3 rounded font-mono text-sm">
                npx create-js-stack init --preset api
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Full Stack</CardTitle>
              <CardDescription>Complete web application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-3 rounded font-mono text-sm">
                npx create-js-stack init --preset fullstack
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Minimal</CardTitle>
              <CardDescription>Lightweight starter template</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-3 rounded font-mono text-sm">
                npx create-js-stack init --preset minimal
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Additional Features */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Additional Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Extra capabilities that set create-js-stack apart from other development tools.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="text-center">
              <Monitor className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Cross Platform</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Works seamlessly on Windows, macOS, and Linux with consistent behavior across all platforms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Smartphone className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Mobile Ready</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Built-in support for Progressive Web Apps and mobile-first development practices.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Palette className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Customizable</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Flexible configuration system that adapts to your team&apos;s coding standards and preferences.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center space-y-6 py-12 bg-muted/30 rounded-2xl">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Ready to Experience These Features?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of developers who have streamlined their workflow with create-js-stack.
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <Card className="p-6 text-left max-w-sm">
            <CardContent className="space-y-3">
              <div className="font-mono text-sm bg-muted p-2 rounded">
                npx create-js-stack init my-app
              </div>
              <p className="text-sm text-muted-foreground">
                Get started in seconds with a single command
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}